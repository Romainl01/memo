/**
 * Date helpers for the journal feature
 */

/**
 * Returns the number of days remaining in the year, including today
 */
export function getDaysRemainingInYear(date: Date = new Date()): number {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  // Total days in year
  const totalDays = Math.ceil(
    (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  // Days elapsed (not including today)
  const daysElapsed = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );

  return totalDays - daysElapsed;
}

/**
 * Generates an array of all dates in a year as YYYY-MM-DD strings
 */
export function generateYearDates(year: number): string[] {
  const dates: string[] = [];
  const date = new Date(year, 0, 1);

  while (date.getFullYear() === year) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

/**
 * Formats a date string as "Wednesday, January 29, 2026"
 */
export function formatJournalDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Checks if a date string (YYYY-MM-DD) is today
 */
export function isToday(dateStr: string): boolean {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  return dateStr === todayStr;
}

/**
 * Checks if a date string (YYYY-MM-DD) is today or in the past
 */
export function isPastOrToday(dateStr: string): boolean {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date.getTime() <= today.getTime();
}
