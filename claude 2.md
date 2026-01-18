# PIA - React Native + Expo Project Guidelines

> **Learning Mode Active**: This project uses TDD (Test-Driven Development) and is optimized for learning React Native with Expo. Claude will explain concepts, suggest learning opportunities, and help you level up.

## Project Overview

- **Framework**: React Native with Expo (managed workflow)
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **State Management**: Zustand (simple, scalable)
- **Testing**: Jest + React Native Testing Library (RNTL)
- **Target**: iOS, Android, and Web

---

## TDD (Test-Driven Development) Workflow

### The Red-Green-Refactor Cycle

Always follow this cycle when implementing features:

```
1. RED    → Write a failing test first
2. GREEN  → Write minimal code to pass the test
3. REFACTOR → Clean up while keeping tests green
```

### TDD Best Practices

- **Write the test BEFORE the implementation** - This is non-negotiable
- **One test at a time** - Don't write multiple failing tests
- **Keep tests small** - Test one behavior per test
- **Descriptive test names** - Use "given/when/then" or "should" format
- **Run tests frequently** - After every small change

### Test Structure (AAA Pattern)

```typescript
it('should return red color for past due dates', () => {
  // Arrange - Set up test data
  const pastDate = '2000-10-20';

  // Act - Execute the function
  const result = colorForDueDate(pastDate);

  // Assert - Verify the result
  expect(result).toBe('red');
});
```

### What to Test

| Test Type | What to Test | Tools |
|-----------|-------------|-------|
| **Unit** | Pure functions, utilities, hooks | Jest |
| **Component** | User interactions, rendering | RNTL |
| **Integration** | Multiple components together | RNTL |

### What NOT to Test

- Implementation details (internal state, private methods)
- Third-party library internals
- Expo Router navigation internals
- Styles (unless critical to functionality)

---

## Project Structure (Expo Router)

> **Key Rule**: The `app/` directory is ONLY for routes. All other code lives in `src/`.

```
├── app/                        # Routes ONLY (Expo Router)
│   ├── _layout.tsx             # Root layout (providers, fonts, splash)
│   ├── index.tsx               # Home screen (/)
│   ├── +not-found.tsx          # 404 page
│   ├── (tabs)/                 # Tab group (doesn't affect URL)
│   │   ├── _layout.tsx         # Tab navigator config
│   │   ├── index.tsx           # First tab (/)
│   │   ├── explore.tsx         # /explore
│   │   └── profile.tsx         # /profile
│   ├── (auth)/                 # Auth group
│   │   ├── _layout.tsx         # Auth stack config
│   │   ├── login.tsx           # /login
│   │   └── register.tsx        # /register
│   └── [id].tsx                # Dynamic route (/123, /abc)
│
├── src/                        # All non-route code
│   ├── components/             # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── features/               # Feature-specific components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginForm.test.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAuth.test.ts
│   │   └── ...
│   ├── stores/                 # Zustand state stores
│   │   ├── userStore.ts
│   │   ├── userStore.test.ts
│   │   └── ...
│   ├── services/               # API calls, external services
│   │   ├── api.ts
│   │   └── ...
│   ├── utils/                  # Helper functions
│   │   ├── formatDate.ts
│   │   ├── formatDate.test.ts
│   │   └── ...
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   └── constants/              # App-wide constants
│       └── index.ts
│
├── assets/                     # Static assets (images, fonts)
├── app.config.ts               # Expo configuration
└── package.json
```

### Expo Router Conventions

| Pattern | Example | URL |
|---------|---------|-----|
| **Index route** | `app/index.tsx` | `/` |
| **Named route** | `app/settings.tsx` | `/settings` |
| **Nested route** | `app/user/profile.tsx` | `/user/profile` |
| **Route group** | `app/(tabs)/home.tsx` | `/home` (no "tabs" in URL) |
| **Dynamic route** | `app/user/[id].tsx` | `/user/123` |
| **Catch-all** | `app/[...rest].tsx` | Any unmatched path |
| **Layout** | `app/_layout.tsx` | Wraps sibling routes |
| **Not found** | `app/+not-found.tsx` | 404 page |

### Naming Conventions

- **Route files**: lowercase with hyphens (`my-profile.tsx` → `/my-profile`)
- **Components**: PascalCase (`Button.tsx`, `UserCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Stores**: camelCase with `Store` suffix (`userStore.ts`)
- **Test files**: Same name with `.test.tsx` suffix

---

## Expo Router Patterns

### Root Layout (`app/_layout.tsx`)

The root layout replaces `App.tsx`. Use it for:
- Loading fonts
- Managing splash screen
- Global providers (Zustand doesn't need one)
- Error boundaries

```typescript
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return <Stack />;
}
```

### Tab Navigation (`app/(tabs)/_layout.tsx`)

```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### Navigation Between Screens

```typescript
import { Link, router } from 'expo-router';

// Declarative (preferred for simple links)
<Link href="/profile">Go to Profile</Link>
<Link href="/user/123">View User</Link>

// Imperative (for programmatic navigation)
router.push('/profile');           // Add to stack
router.replace('/home');           // Replace current
router.back();                     // Go back
router.navigate('/settings');      // Smart navigation
```

### Typed Routes

Expo Router generates types automatically. Use them:

```typescript
import { Href } from 'expo-router';

// TypeScript will catch invalid routes
router.push('/invalid-route'); // Error if route doesn't exist
```

---

## Expo Configuration

### `app.config.ts` (Recommended over `app.json`)

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'PIA',
  slug: 'pia',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'pia',  // Required for deep links
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourname.pia',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.yourname.pia',
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,  // Enable typed routes
  },
  extra: {
    // Custom values accessible via Constants.expoConfig.extra
    apiUrl: process.env.API_URL ?? 'https://api.example.com',
  },
});
```

### Environment Variables

```bash
# .env (never commit this)
API_URL=https://api.production.com

# Usage in app.config.ts
extra: {
  apiUrl: process.env.API_URL,
}

# Access in code
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

**Security**: Never put secrets in `app.config.ts` - they're bundled into the app!

---

## Expo Go vs Development Builds

### Use Expo Go When:
- Learning and prototyping
- Using only Expo SDK modules
- Quick iteration without native builds

### Switch to Development Build When:
- Using native libraries not in Expo Go (e.g., `react-native-firebase`)
- Customizing app icon, splash screen, or name
- Testing push notifications
- Adding deep links (App Links / Universal Links)

```bash
# Create a development build
npx expo install expo-dev-client
eas build --profile development --platform ios
```

---

## State Management with Zustand

### Store Pattern

```typescript
// src/stores/counterStore.ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### Using in Components

```typescript
const Counter: React.FC = () => {
  const { count, increment, decrement } = useCounterStore();

  return (
    <View>
      <Text>{count}</Text>
      <Button label="+" onPress={increment} />
      <Button label="-" onPress={decrement} />
    </View>
  );
};
```

### Testing Stores

```typescript
beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

it('should increment count', () => {
  const { increment } = useCounterStore.getState();
  increment();
  expect(useCounterStore.getState().count).toBe(1);
});
```

---

## Component Patterns

### Functional Components Only

```typescript
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onPress, disabled }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Text>{label}</Text>
    </Pressable>
  );
};

export { Button };
```

### Component Test Example

```typescript
// src/components/Button/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('should render the label', () => {
    const { getByText } = render(<Button label="Click me" onPress={() => {}} />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button label="Click me" onPress={onPressMock} />);

    fireEvent.press(getByText('Click me'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

---

## Performance Best Practices

### Critical Rules

1. **Remove console.log in production**
   ```json
   // babel.config.js
   {
     "env": {
       "production": {
         "plugins": ["transform-remove-console"]
       }
     }
   }
   ```

2. **Use FlatList for lists** - Never `.map()` for scrollable lists
   ```typescript
   // Good
   <FlatList data={items} renderItem={renderItem} />

   // Bad
   {items.map(item => <Item key={item.id} {...item} />)}
   ```

3. **Use FlashList for large lists** (100+ items)
   ```bash
   npx expo install @shopify/flash-list
   ```

4. **Memoize expensive computations**
   ```typescript
   const result = useMemo(() => expensiveCalc(data), [data]);
   const handlePress = useCallback(() => doThing(id), [id]);
   ```

5. **Test in production mode**
   ```bash
   npx expo start --no-dev
   ```

---

## Testing Guidelines

### Query Priority (RNTL)

Use queries in this order:
1. `getByRole` - Accessible elements (best)
2. `getByLabelText` - Form inputs
3. `getByPlaceholderText` - Input placeholders
4. `getByText` - Visible text
5. `getByTestId` - Last resort only

### Avoid Snapshot Tests

```typescript
// Avoid
expect(tree).toMatchSnapshot();

// Prefer explicit assertions
expect(getByText('Welcome')).toBeTruthy();
```

### Mocking Expo Router

```typescript
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({ id: '123' }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
```

---

## Code Style

### Imports Order

```typescript
// 1. React/React Native
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';

// 2. Expo
import { Link, router } from 'expo-router';
import * as Haptics from 'expo-haptics';

// 3. Third-party libraries
import { create } from 'zustand';

// 4. Local imports
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';
```

### Path Aliases

Configure `@/` to point to `src/`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## Learning Opportunities

When implementing features, Claude will identify opportunities for you to:

- Write meaningful business logic (5-10 lines)
- Make design decisions with trade-offs
- Implement error handling strategies
- Choose between valid approaches

These moments are flagged with a learning prompt rather than Claude writing everything.

---

## Plan Mode Guidelines

When planning UI features, prefer native iOS patterns and components over custom implementations. Use `GlassView` from `expo-glass-effect` for UI elements that float above content (sheets, buttons, menus, toolbars, overlays). When uncertain about interaction patterns, ask for clarification rather than assuming.

---

## Common Commands

```bash
# Development
npx expo start                    # Start dev server
npx expo start --clear            # Clear cache and start
npx expo start --ios              # Open iOS simulator
npx expo start --android          # Open Android emulator

# Testing
npm test                          # Run all tests
npm test -- --watch               # Watch mode
npm test -- --coverage            # Coverage report
npm test Button.test.tsx          # Run specific test

# Type checking
npx tsc --noEmit                  # Type check without build

# Building
eas build --platform ios          # Build for iOS
eas build --platform android      # Build for Android

# Expo utilities
npx expo install <package>        # Install with correct version
npx expo doctor                   # Check for issues
npx expo config --type public     # View resolved config
```

---

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Expo Blog - Folder Structure](https://expo.dev/blog/expo-app-folder-structure-best-practices)
