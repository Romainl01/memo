import { useJournalStore, Mood } from './journalStore';

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

    it('should create entry with mood', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Great day!', 'great');

      const entry = getEntryByDate('2025-01-15');
      expect(entry?.mood).toBe('great');
    });

    it('should create entry with null mood when not provided', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Content');

      const entry = getEntryByDate('2025-01-15');
      expect(entry?.mood).toBeNull();
    });

    it('should update content without affecting existing mood', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Original', 'good');
      upsertEntry('2025-01-15', 'Updated');

      const entry = getEntryByDate('2025-01-15');
      expect(entry?.content).toBe('Updated');
      expect(entry?.mood).toBe('good'); // Mood preserved
    });

    it('should update mood when explicitly passed', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Content', 'good');
      upsertEntry('2025-01-15', 'Content', 'bad');

      const entry = getEntryByDate('2025-01-15');
      expect(entry?.mood).toBe('bad');
    });

    it('should clear mood when null is explicitly passed', () => {
      const { upsertEntry, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Content', 'great');
      upsertEntry('2025-01-15', 'Content', null);

      const entry = getEntryByDate('2025-01-15');
      expect(entry?.mood).toBeNull();
    });
  });

  describe('setMood', () => {
    it('should set mood on existing entry', () => {
      const { upsertEntry, setMood, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Content');
      setMood('2025-01-15', 'okay');

      const entry = getEntryByDate('2025-01-15');
      expect(entry?.mood).toBe('okay');
      expect(entry?.content).toBe('Content'); // Content preserved
    });

    it('should create empty entry when setting mood on non-existent date', () => {
      const { setMood, getEntryByDate } = useJournalStore.getState();

      setMood('2025-01-15', 'awful');

      const entry = getEntryByDate('2025-01-15');
      expect(entry).toBeDefined();
      expect(entry?.mood).toBe('awful');
      expect(entry?.content).toBe('');
    });

    it('should clear mood when null is passed', () => {
      const { upsertEntry, setMood, getEntryByDate } = useJournalStore.getState();

      upsertEntry('2025-01-15', 'Content', 'great');
      setMood('2025-01-15', null);

      const entry = getEntryByDate('2025-01-15');
      expect(entry?.mood).toBeNull();
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
