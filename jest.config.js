/** @type {import('jest').Config} */
module.exports = {
  // Don't use jest-expo preset - configure manually to avoid winter runtime
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setupBefore.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./babel.config.js" },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|native-base|react-native-svg|sf-symbols-typescript|expo-glass-effect|expo-symbols)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Mock Expo winter runtime modules to prevent loading
    "^expo$": "<rootDir>/__mocks__/expo.js",
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
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
