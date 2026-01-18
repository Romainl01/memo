import { getDaysRemaining, getRelativeLastContact } from './dateHelpers';

describe('getDaysRemaining', () => {
  // Helper to format date in local time
  const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  it('should return positive days when check-in is in the future', () => {
    const today = new Date();
    const lastContact = new Date(today);
    lastContact.setDate(today.getDate() - 5);
    const lastContactStr = toLocalDateString(lastContact);

    const result = getDaysRemaining(lastContactStr, 14);

    expect(result).toBe(9); // 14 - 5 = 9 days remaining
  });

  it('should return 0 when check-in is due today', () => {
    const today = new Date();
    const lastContact = new Date(today);
    lastContact.setDate(today.getDate() - 14);
    const lastContactStr = toLocalDateString(lastContact);

    const result = getDaysRemaining(lastContactStr, 14);

    expect(result).toBe(0);
  });

  it('should return negative days when overdue', () => {
    const today = new Date();
    const lastContact = new Date(today);
    lastContact.setDate(today.getDate() - 20);
    const lastContactStr = toLocalDateString(lastContact);

    const result = getDaysRemaining(lastContactStr, 14);

    expect(result).toBe(-6); // 14 - 20 = -6 (6 days overdue)
  });
});

describe('getRelativeLastContact', () => {
  // Helper to create a date string N days ago (in local time)
  const daysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  it('should return "Today" for today\'s date', () => {
    const today = daysAgo(0);
    expect(getRelativeLastContact(today)).toBe('Today');
  });

  it('should return "Yesterday" for yesterday\'s date', () => {
    const yesterday = daysAgo(1);
    expect(getRelativeLastContact(yesterday)).toBe('Yesterday');
  });

  it('should return day name for 2-6 days ago', () => {
    // For 2 days ago, should return the weekday name (e.g., "Tuesday")
    const twoDaysAgo = daysAgo(2);
    const expectedDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
      new Date(twoDaysAgo)
    );
    expect(getRelativeLastContact(twoDaysAgo)).toBe(expectedDayName);

    // For 6 days ago
    const sixDaysAgo = daysAgo(6);
    const expectedDayName6 = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
      new Date(sixDaysAgo)
    );
    expect(getRelativeLastContact(sixDaysAgo)).toBe(expectedDayName6);
  });

  it('should return "Last [day]" for 7-13 days ago', () => {
    const sevenDaysAgo = daysAgo(7);
    const expectedDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
      new Date(sevenDaysAgo)
    );
    expect(getRelativeLastContact(sevenDaysAgo)).toBe(`Last ${expectedDayName}`);

    const thirteenDaysAgo = daysAgo(13);
    const expectedDayName13 = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
      new Date(thirteenDaysAgo)
    );
    expect(getRelativeLastContact(thirteenDaysAgo)).toBe(`Last ${expectedDayName13}`);
  });

  it('should return "2 weeks ago" for 14-20 days ago', () => {
    expect(getRelativeLastContact(daysAgo(14))).toBe('2 weeks ago');
    expect(getRelativeLastContact(daysAgo(20))).toBe('2 weeks ago');
  });

  it('should return "X weeks ago" for 3-4 weeks', () => {
    expect(getRelativeLastContact(daysAgo(21))).toBe('3 weeks ago');
    expect(getRelativeLastContact(daysAgo(27))).toBe('3 weeks ago');
    expect(getRelativeLastContact(daysAgo(28))).toBe('4 weeks ago');
  });

  it('should return "1 month ago" for 30-59 days ago', () => {
    expect(getRelativeLastContact(daysAgo(30))).toBe('1 month ago');
    expect(getRelativeLastContact(daysAgo(45))).toBe('1 month ago');
  });

  it('should return "X months ago" for 2+ months', () => {
    expect(getRelativeLastContact(daysAgo(60))).toBe('2 months ago');
    expect(getRelativeLastContact(daysAgo(90))).toBe('3 months ago');
    expect(getRelativeLastContact(daysAgo(180))).toBe('6 months ago');
  });

  it('should return "1 year ago" for ~365 days', () => {
    expect(getRelativeLastContact(daysAgo(365))).toBe('1 year ago');
  });

  it('should return "X years ago" for 2+ years', () => {
    expect(getRelativeLastContact(daysAgo(730))).toBe('2 years ago');
  });
});
