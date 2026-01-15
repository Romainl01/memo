# Notification Implementation Plan

## Overview

Implement two local push notifications:
1. **Birthday notification** - "It's [name]'s birthday" triggered when a friend has a birthday
2. **Catch-up notification** - "Catch'up with [name]" triggered when it's time to reconnect

---

## Design Specs (from Figma)

### Birthday Notification
- **Title**: "It's [first name]'s birthday 🎉"
- **Body**: "Send wishes, make their day!"
- **Icon**: 👋 emoji
- **Multiple friends**: "It's Sarah and Mike's birthday 🎉" or "Sarah, Mike and 3 others' birthday 🎉"

### Catch-up Notification
- **Title**: "Catch'up with [name]"
- **Body**: "You last checked in X days ago"
- **Icon**: 👋 emoji

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| Multiple birthdays same day | Group: max 2 names + "and X others" |
| Multiple catch-ups same day | Individual notifications, staggered randomly within 9-10 AM |
| Birthday + catch-up same day | Only birthday notification (skip catch-up) |
| Feb 29 birthdays | Show on Feb 28 in non-leap years |
| Repeat reminders | Once per frequency period only |
| Tap action | Open friends list tab |
| Timing | Fixed daily window 9-10 AM |
| Settings | None for now (deferred) |
| Permission request | After first friend successfully added |

---

## Implementation Steps

### Phase 1: TDD Setup & Permission Hook

**Create `src/hooks/useNotificationPermission.ts`**
- Request permission via `expo-notifications`
- Track permission status
- Provide `requestPermission()` function

**Create `src/hooks/useNotificationPermission.test.ts`**
- Test permission request flow
- Test granted/denied states

### Phase 2: Notification Service

**Create `src/services/notificationService.ts`**
Core functions:
- `initializeNotifications()` - Set up notification handler and channel
- `scheduleDailyNotificationCheck()` - Schedule daily trigger between 9-10 AM
- `checkAndSendNotifications()` - Called daily to evaluate and send notifications
- `sendBirthdayNotification(friends: Friend[])` - Format and send birthday notification
- `sendCatchUpNotification(friend: Friend)` - Format and send catch-up notification
- `cancelAllScheduledNotifications()` - Clean up on reschedule

**Create `src/services/notificationService.test.ts`**
- Test birthday notification formatting (1, 2, 3+ friends)
- Test catch-up notification formatting
- Test scheduling logic
- Test "once per frequency" tracking

### Phase 3: Helper Utilities

**Create `src/utils/notificationHelpers.ts`**
- `formatBirthdayTitle(friends: Friend[])` - Handle 1, 2, 3+ friends naming
- `isBirthdayToday(birthday: string)` - Compare MM-DD with current date
- `shouldSendCatchUpNotification(friend: Friend, lastNotified: Date | null)` - Check if due and not recently notified
- `getRandomTimeInWindow(startHour: number, endHour: number)` - Random time between 9-10 AM

**Create `src/utils/notificationHelpers.test.ts`**
- Test name formatting edge cases
- Test birthday comparison (with/without year)
- Test catch-up eligibility logic

### Phase 4: Storage for Notification State

**Create `src/stores/notificationStateStore.ts`** (Zustand with persist)
- `lastBirthdayNotificationDate: string | null` - Prevent duplicate birthday notifications same day
- `lastCatchUpNotificationDates: Record<friendId, string>` - Track per-friend last notified

### Phase 5: Integration

**Modify `app/_layout.tsx`**
- Initialize notification service on app mount
- Set up notification response handler (tap → navigate to friends tab)
- Schedule daily notification check

**Modify `app/add-friend.tsx`**
- After successful first friend add:
  1. Check if notifications permission not yet requested
  2. Request permission
  3. If granted, schedule notifications

**Modify `src/stores/friendsStore.ts`**
- After `addFriend()` or `removeFriend()`:
  - Trigger notification reschedule (update which friends to notify about)

---

## Files Summary

### New Files
| File | Purpose |
|------|---------|
| `src/hooks/useNotificationPermission.ts` | Permission request hook |
| `src/hooks/useNotificationPermission.test.ts` | Tests for permission hook |
| `src/services/notificationService.ts` | Core scheduling & sending logic |
| `src/services/notificationService.test.ts` | Tests for notification service |
| `src/utils/notificationHelpers.ts` | Formatting & logic helpers |
| `src/utils/notificationHelpers.test.ts` | Tests for helpers |
| `src/stores/notificationStateStore.ts` | Persist notification sent dates |

### Modified Files
| File | Changes |
|------|---------|
| `app/_layout.tsx` | Initialize notifications, handle tap navigation |
| `app/add-friend.tsx` | Request permission after first friend |
| `src/stores/friendsStore.ts` | Trigger reschedule on friend changes |

---

## Edge Cases Handled

1. **No birthday set**: Skip friend in birthday notifications
2. **Birthday without year**: Compare MM-DD only (already supported in data model)
3. **frequencyDays = null**: No catch-up reminders for that friend
4. **Multiple birthdays**: Group with max 2 names + "and X others" (single notification)
5. **Multiple catch-ups due**: Individual notifications, each at a random time within 9-10 AM window
6. **Birthday AND catch-up same day**: Only send birthday notification (skip catch-up, user will likely contact anyway)
7. **Leap year birthday (Feb 29)**: Show notification on Feb 28 in non-leap years
8. **Overdue friend ignored**: Only notify once per frequency period (track last notified)
9. **App killed**: Use `expo-notifications` scheduled triggers (survives app termination)
10. **Permission denied**: Gracefully skip notification features
11. **Timezone**: Use device local time for 9-10 AM window

---

## Notification Scheduling Strategy

```
┌─────────────────────────────────────────────────────────────┐
│ App Launch / Friend Added                                   │
│                                                             │
│  1. Cancel all existing scheduled notifications             │
│  2. Get all friends from store                              │
│  3. Schedule for tomorrow 9-10 AM:                          │
│                                                             │
│     BIRTHDAY (grouped):                                     │
│     - Find friends with birthday matching tomorrow          │
│     - Schedule 1 notification at random time in window      │
│                                                             │
│     CATCH-UP (individual, staggered):                       │
│     - Find friends due for catch-up tomorrow                │
│     - For each friend: schedule at unique random time       │
│       within 9-10 AM window                                 │
│                                                             │
│  4. On each notification delivery:                          │
│     - Record last notified timestamp for that friend        │
│     - Reschedule for next eligible day                      │
└─────────────────────────────────────────────────────────────┘

Example for 3 catch-up friends due same day:
  - Sarah: notification at 9:07 AM
  - Mike: notification at 9:23 AM
  - Emma: notification at 9:51 AM
```

---

## Verification Plan

1. **Unit tests**: Run `npm test` - all notification tests pass
2. **Manual testing**:
   - Add a friend with today's birthday → Should receive birthday notification
   - Add a friend with `lastContactAt` = 7 days ago, `frequencyDays` = 7 → Should receive catch-up notification
   - Tap notification → Should open app to friends tab
3. **Permission flow**:
   - Fresh install, add first friend → Permission dialog appears
   - Deny permission → App works normally, no notifications
4. **Edge cases**:
   - Add 3 friends with same birthday → Grouped notification
   - Friend with no birthday → No birthday notification, catch-up still works
