// Mock for expo/src/winter to prevent import errors in Jest
// This bypasses the winter runtime which has module resolution issues with Jest

module.exports = {
  // Mock any exports that might be needed
  installFormDataPatch: jest.fn(),
};
