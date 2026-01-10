/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo/ios",
  setupFiles: ["<rootDir>/jest.setupBefore.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|sf-symbols-typescript|expo-glass-effect|expo-symbols)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Mock the winter runtime to prevent import errors
    "^expo/src/winter$": "<rootDir>/__mocks__/expo-winter.js",
    "^expo/src/winter/(.*)$": "<rootDir>/__mocks__/expo-winter.js",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.expo/"],
  clearMocks: true,
  modulePathIgnorePatterns: ["<rootDir>/.expo/"],
};
