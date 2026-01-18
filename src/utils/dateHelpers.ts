/**
 * Date helper utilities for check-in calculations
 */

/**
 * Parses a YYYY-MM-DD date string in local time (avoids UTC timezone issues)
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns a human-readable relative date string for when last contact occurred.
 * Examples: "Today", "Yesterday", "Tuesday", "Last Tuesday", "2 weeks ago", "3 months ago"
 */
export function getRelativeLastContact(lastContactAt: string): string {
  const lastContact = parseLocalDate(lastContactAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastContact.getTime();
  const daysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';

  // 2-6 days ago: show day name (e.g., "Tuesday")
  if (daysAgo >= 2 && daysAgo <= 6) {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(lastContact);
  }

  // 7-13 days ago: show "Last [day]"
  if (daysAgo >= 7 && daysAgo <= 13) {
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(lastContact);
    return `Last ${dayName}`;
  }

  // 14+ days: calculate weeks/months/years
  const weeks = Math.floor(daysAgo / 7);
  const months = Math.floor(daysAgo / 30);
  const years = Math.floor(daysAgo / 365);

  if (years >= 1) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }

  if (months >= 1) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  return `${weeks} weeks ago`;
}

export function getDaysRemaining(lastContactAt: string, frequencyDays: number): number {
  const lastContact = parseLocalDate(lastContactAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysSinceContact = Math.floor(
    (today.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
  );

  return frequencyDays - daysSinceContact;
}
