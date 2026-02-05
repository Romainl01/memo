import { useJournalStore } from './journalStore';

describe('journalStore', () => {
  beforeEach(() => {
    useJournalStore.setState({ entries: {} });
  });

  describe('getEntryByDate', () => {
    it('should return undefined for non-existent entry', () => {
      const { getEntryByDate } = useJournalStore.getState();
      expect(getEntryByDate('2025-01-15')).toBeUndefined();
    });

    it('should return entry for existing date', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();
      upsertEntry('2025-01-15', 'My journal entry');

      const entry = getEntryByDate('2025-01-15');
      expect(entry).toBeDefined();
      expect(entry?.content).toBe('My journal entry');
      expect(entry?.date).toBe('2025-01-15');
    });
  });

  describe('upsertEntry', () => {
    it('should create a new entry with correct fields', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();
      const beforeCreate = new Date().toISOString();

      upsertEntry('2025-01-15', 'New entry content');

      const entry = getEntryByDate('2025-01-15');
      expect(entry).toBeDefined();
      expect(entry?.id).toBeDefined();
      expect(entry?.date).toBe('2025-01-15');
      expect(entry?.content).toBe('New entry content');
      expect(entry?.createdAt).toBeDefined();
      expect(entry?.updatedAt).toBeDefined();
      expect(new Date(entry!.createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeCreate).getTime() - 1000
      );
    });

    it('should update existing entry and preserve createdAt', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Original content');
      const originalEntry = getEntryByDate('2025-01-15');
      const originalCreatedAt = originalEntry?.createdAt;
      const originalId = originalEntry?.id;

      const beforeUpdate = new Date().toISOString();
      upsertEntry('2025-01-15', 'Updated content');

      const updatedEntry = getEntryByDate('2025-01-15');
      expect(updatedEntry?.content).toBe('Updated content');
      expect(updatedEntry?.id).toBe(originalId);
      expect(updatedEntry?.createdAt).toBe(originalCreatedAt);
      expect(new Date(updatedEntry!.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeUpdate).getTime() - 1000
      );
    });

    it('should handle empty content', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', '');

      const entry = getEntryByDate('2025-01-15');
      expect(entry?.content).toBe('');
    });
  });

  describe('multiple entries', () => {
    it('should handle multiple dates independently', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Entry 1');
      upsertEntry('2025-01-16', 'Entry 2');
      upsertEntry('2025-01-17', 'Entry 3');

      expect(getEntryByDate('2025-01-15')?.content).toBe('Entry 1');
      expect(getEntryByDate('2025-01-16')?.content).toBe('Entry 2');
      expect(getEntryByDate('2025-01-17')?.content).toBe('Entry 3');
    });

    it('should update one entry without affecting others', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Entry 1');
      upsertEntry('2025-01-16', 'Entry 2');

      upsertEntry('2025-01-15', 'Updated Entry 1');

      expect(getEntryByDate('2025-01-15')?.content).toBe('Updated Entry 1');
      expect(getEntryByDate('2025-01-16')?.content).toBe('Entry 2');
    });
  });
});
