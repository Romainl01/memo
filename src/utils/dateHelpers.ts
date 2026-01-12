/**
 * Date helper utilities for check-in calculations
 */

/**
 * Calculates days remaining until next check-in.
 * Negative values mean overdue.
 */
export function getDaysRemaining(lastContactAt: string, frequencyDays: number): number {
  const lastContact = new Date(lastContactAt);
  const today = new Date();

  lastContact.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysSinceContact = Math.floor(
    (today.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
  );

  return frequencyDays - daysSinceContact;
}
