/**
 * Custom Jest resolver to handle Expo SDK 54 winter runtime issues.
 * The winter runtime intercepts global access in ways incompatible with Jest sandboxing.
 */
module.exports = (request, options) => {
  // Redirect expo/src/winter imports to empty mocks
  if (request.includes("expo/src/winter")) {
    return options.defaultResolver(request, {
      ...options,
      pathFilter: () => require.resolve("./jest.emptyMock.js"),
    });
  }

  // Use default resolver for everything else
  return options.defaultResolver(request, options);
};
