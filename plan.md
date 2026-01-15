# Add Friend Bottom Sheet UI Improvement Plan

## Status: ✅ IMPLEMENTED

## Summary
Redesign the AddFriendSheet component to match the Figma mockup and inspiration screenshots, implementing iOS Liquid Glass aesthetics with a floating sheet design.

## Key Changes

### 1. Sheet Architecture Change
**Current**: Uses `@gorhom/bottom-sheet` with 70% snap point, edge-to-edge
**New**: Use React Native `Modal` + custom `GlassView` sheet for full design control

**Why Modal?**:
- NativeTabs doesn't expose API to hide tab bar programmatically
- Modal naturally renders over everything including tab bar
- Gives full control over floating margins and glass styling

### 2. Visual Changes

| Element | Current | New |
|---------|---------|-----|
| Sheet background | Solid `surfaceLight` | `GlassView` with frosted effect |
| Sheet margins | Edge-to-edge | 6px padding on sides/bottom (floating) |
| Border radius | 24px top corners | 34px all corners |
| Save button | Bottom Cancel/Save buttons | Top-right glass checkmark icon |
| Cancel | Text button | Swipe-down to dismiss + X button top-right |
| Settings rows | Simple labels + inputs | Bordered rows with icons (as in Figma) |
| Grabber | Gray bar | Subtle grabber in glass handle area |

### 3. Contact Birthday Extraction
Update `useContacts` hook to extract birthday from contact data:
```typescript
interface ContactBirthday {
  day: number;
  month: number;  // 0-indexed (January = 0)
  year?: number;  // Optional - user may not have set year
}

interface SelectedContact {
  id: string;
  name: string;
  imageUri: string | null;
  birthday: ContactBirthday | null;  // NEW: from expo-contacts
}
```
Note: `presentContactPickerAsync()` returns birthday if available in the contact.

### 4. Form Field Changes

**Birthday Field:**
- If contact has birthday → Pre-fill and display as "Oct 20" format
- If no birthday → Show "Pick a date" → Opens native date picker
- Default picker date: 30 years ago from today
- Year optional (user may not know it)

**Last Catch-up Field:**
- Always shows "Pick a date" initially
- Opens native date picker with today's date as default
- Maximum date: today

**Frequency Field:**
- Default: "Weekly" (pre-selected)
- On tap: Show action sheet/menu with options:
  - Weekly (7 days)
  - Bi-weekly (14 days)
  - Monthly (30 days)
  - Quarterly (90 days)
  - None (no tracking)

### 5. New Components

#### `GlassSheet` Component
```typescript
// New reusable glass bottom sheet
interface GlassSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

#### `SettingsRow` Component
```typescript
// Bordered row matching Figma design
interface SettingsRowProps {
  icon: string;  // SF Symbol name
  label: string;
  value: string;
  onPress: () => void;
  chevronType?: 'expand' | 'dropdown';  // + vs chevron.down
}
```

## Critical Files to Modify

1. **`src/features/friends/AddFriendSheet.tsx`** - Complete redesign
2. **`src/hooks/useContacts.ts`** - Add birthday extraction
3. **`src/components/FrequencySelector/FrequencySelector.tsx`** - Convert to action sheet
4. **`src/components/DateInput/DateInput.tsx`** - Update default date logic

## New Files to Create

1. **`src/components/GlassSheet/GlassSheet.tsx`** - Reusable glass modal sheet
2. **`src/components/SettingsRow/SettingsRow.tsx`** - Bordered settings row

## Implementation Steps

### Step 1: Create GlassSheet Component
- Modal-based with animated slide-up
- GlassView background with 34px border radius
- 6px margins on sides and bottom
- Grabber handle at top
- Close button (X) in top-right with glass styling

### Step 2: Create SettingsRow Component
- Horizontal row with icon, label, value, chevron
- 1px border with `neutralGray` (#6A7282) color
- 12px border radius
- 12px padding
- Icon using `SymbolView` from expo-symbols

### Step 3: Update useContacts Hook
- Request birthday field from expo-contacts
- Parse and include birthday in SelectedContact
- Handle missing/partial birthday data

### Step 4: Redesign AddFriendSheet
- Replace BottomSheet with GlassSheet
- Replace DateInput/FrequencySelector with SettingsRow
- Add save icon button (checkmark in glass circle, primary tint)
- Implement date picker modals for Birthday/Last catch-up
- Implement ActionSheet for Frequency selection

### Step 5: Update Date Picker Logic
- Birthday: Default to 30 years ago, allow month/day selection without year
- Last catch-up: Default to today, max date = today

### Step 6: Update Frequency Selection
- Use native ActionSheet (`@expo/react-native-action-sheet` or built-in)
- Options: Weekly, Bi-weekly, Monthly, Quarterly, None

### Step 7: Write Tests (TDD)
- Test GlassSheet open/close behavior
- Test SettingsRow rendering and interactions
- Test birthday pre-population from contact
- Test frequency default value
- Update existing AddFriendSheet tests

## UX Recommendations

### Wording Improvements
- "Last catch'up" → "Last catch-up" (proper hyphenation)
- Consider "Remind me" instead of "Frequency" (more action-oriented)

### Color/Visual Note
- Consider lighter border color for rows (`neutralGray200` instead of `neutralGray`) for softer appearance
- The `neutralGray` (#6A7282) may be too dark on the light glass background - will implement as specified and adjust if needed

## Verification

1. **Visual**: Compare side-by-side with Figma mockup
2. **Interaction**: Test all date pickers and frequency selection
3. **Contact Birthday**: Test with contacts that have/don't have birthdays
4. **Tab Bar**: Verify tab bar is hidden when sheet is open
5. **Gestures**: Test swipe-to-dismiss
6. **Platform**: Test on iOS 26+ simulator/device

## Dependencies Check
- `expo-glass-effect` ✓ (already installed)
- `expo-symbols` ✓ (already installed)
- `expo-contacts` ✓ (already installed, needs birthday field request)
- `@react-native-community/datetimepicker` ✓ (already installed)

---

# V2 - UI Improvements (Feedback Fixes)

## Status: 🔄 IN PROGRESS

## Issues to Address

| # | Issue | Solution |
|---|-------|----------|
| 1 | Bouncy animation on entry | Remove all staggered animations |
| 2 | Wrong calendar type (spinner) | Use native iOS calendar popup (`display='compact'`) |
| 3 | Menu centered/not native | Replace ActionSheetIOS with iOS ContextMenu (`zeego`) |
| 4 | Bottom sheet not liquid glass | Wrap content in GlassView |
| 5 | Too much space above avatar | Reduce contactSection padding |
| 6 | White space below frequency | Fix layout (remove flex spreading) |

## Changes

### 1. Remove Entry Animations
Delete all reanimated shared values, animated styles, and replace `Animated.View`/`Animated.Text` with plain components.

### 2. Native iOS Calendar Popup
Change `display='spinner'` to `display='compact'` for iOS DateTimePicker.

### 3. iOS Context Menu for Frequency
Install `zeego` and use `DropdownMenu` instead of `ActionSheetIOS`.

### 4. Liquid Glass Background
Wrap sheet content in `GlassView` from `expo-glass-effect`.

### 5. Reduce Top Spacing
- `contactSection.paddingTop`: 24 → 8
- `contactSection.gap`: 16 → 12

### 6. Fix Bottom White Space
Ensure container uses `justifyContent: 'flex-start'`.

## New Dependencies
```bash
npx expo install zeego
```

## Verification
1. Content appears instantly (no bounce)
2. Tapping date fields shows calendar popover
3. Tapping frequency shows native context menu anchored to row
4. Sheet has glass background effect
5. Compact spacing throughout
