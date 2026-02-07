# Memo Improvement Roadmap

While waiting for the Apple dev account, here's what we're building — a mix of polish, new features, and big foundational pieces.

---

## Overview

| Priority | Feature | Effort | Status |
|----------|---------|--------|--------|
| 1 | Search bar on friends list | 1-2 hours | Not started |
| 2 | Long-press context menu on friend cards | 1-2 hours | Not started |
| 3 | **Mood tracking on journal entries** | 4-6 hours | 🔄 In progress |
| 4 | Onboarding flow (minimal & elegant) | 1-2 days | Not started |
| 5 | iOS Home Screen Widget | 1-2 days | Not started |

---

## 1. Search Bar on Friends List

**Goal:** Let users quickly find friends by name, especially as the list grows.

**Implementation:**
- Add a search input at the top of FriendsList (below category filter or integrated with it)
- Filter friends by name (case-insensitive substring match)
- Debounce input (300ms) for smooth typing
- Show "No friends match your search" empty state when filter returns nothing
- Clear button to reset search

**Files to modify:**
- `src/features/friends/FriendsList.tsx` — Add search state + filtered list
- `src/features/friends/FilteredEmptyState.tsx` — Handle search empty state

**UX considerations:**
- Search should work WITH category filter (filter by category, then search within)
- Keyboard should dismiss on scroll
- Use SF Symbol "magnifyingglass" for visual consistency

---

## 2. Long-Press Context Menu on Friend Cards

**Goal:** Quick actions without opening the detail sheet — feel more native iOS.

**Implementation:**
- Use `zeego` (already installed) for native context menu
- Long-press on FriendCard shows menu with:
  - "Log Catch-up" (with clock icon)
  - "Edit" (pencil icon) → opens friend detail sheet
  - "Delete" (trash icon, red/destructive) → confirmation then delete
- Haptic feedback on menu open

**Files to modify:**
- `src/features/friends/FriendCard.tsx` — Wrap with `ContextMenu` from zeego
- `src/stores/friendsStore.ts` — Add `deleteFriend(id)` action if not exists

**zeego pattern:**
```tsx
import * as ContextMenu from 'zeego/context-menu'

<ContextMenu.Root>
  <ContextMenu.Trigger>
    <Pressable>{/* existing FriendCard content */}</Pressable>
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item key="catchup" onSelect={handleCatchUp}>
      <ContextMenu.ItemIcon ios={{ name: 'clock' }} />
      <ContextMenu.ItemTitle>Log Catch-up</ContextMenu.ItemTitle>
    </ContextMenu.Item>
    {/* ... more items */}
  </ContextMenu.Content>
</ContextMenu.Root>
```

---

## 3. Mood Tracking on Journal Entries

**Goal:** Add emotional context to journal entries. Show mood as colors on year grid dots, making patterns visible at a glance.

### Data Model Change
```typescript
type Mood = 'great' | 'good' | 'okay' | 'meh' | 'bad' | null;

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood; // NEW - nullable for entries without mood
  createdAt: string;
  updatedAt: string;
}
```

### Mood Colors (warm palette)
| Mood | Color | Hex | Meaning |
|------|-------|-----|---------|
| great | Vibrant coral | #F28C59 | Primary — feeling amazing |
| good | Warm green | #5B8A60 | Growth/positivity |
| okay | Muted gold | #D4A574 | Neutral warmth |
| meh | Cool gray | #9CA3AF | Low energy |
| bad | Soft red | #E5484D | Needing care |

### Implementation
1. **Mood picker in journal editor** — 5 options at top of entry screen
2. **Year grid dot colors** — Entry with mood → mood color; without mood → default
3. **Migration** — Existing entries get `mood: null`

**Files to modify:**
- `src/stores/journalStore.ts`
- `src/constants/colors.ts`
- `app/journal-entry/[date].tsx`
- `src/features/journal/DayDot.tsx`
- `src/features/journal/YearGrid.tsx`

---

## 4. Onboarding Flow

**Goal:** Beautiful, minimal welcome screens that explain Memo's value to new users.

**Style:** Minimal & elegant (Apple-inspired)
- 3-4 screens maximum
- Coral accent, generous whitespace
- Subtle fade/slide animations

**Screens:**
1. **Welcome** — "Memo" + tagline + Get Started
2. **Friends** — "Never lose touch" + brief explanation
3. **Journal** — "Capture every day" + year grid preview
4. **Get Started** — Apple Sign-In or skip to local mode

**Files to create:**
- `app/(onboarding)/_layout.tsx`
- `app/(onboarding)/index.tsx`
- `src/features/onboarding/OnboardingScreen.tsx`
- `src/features/onboarding/OnboardingPage.tsx`
- `src/stores/onboardingStore.ts`

---

## 5. iOS Home Screen Widget

**Goal:** Glanceable info on the home screen.

### Widget Types
**Friends Widget (Small + Medium):**
- Small: 1 most urgent friend with status
- Medium: 2-3 most urgent friends as list

**Journal Widget (Small):**
- Today's status: "✓ Done" or "Write something"
- Subtle year progress ring

### Implementation
- Widget Extension in Xcode (Swift/WidgetKit)
- App Groups for data sharing
- `src/services/widgetService.ts` for RN → Widget data sync

**Note:** Can be fully tested in iOS Simulator. Dev account only needed for real device install.

---

## Future Ideas (Backlog)

These aren't prioritized yet but are worth considering:

- Journal streaks (consecutive days tracking)
- Interaction history (log each catch-up as event)
- Topics to discuss per friend
- Pinned friends (favorites at top)
- Shared memories per friend
- Monthly calendar view for journal
- Journal search (full-text)
- Data export (PDF/CSV)
- Quick Actions (3D touch on app icon)
- Confetti animations for milestones
- Dynamic Type support
- Localization (French first)
