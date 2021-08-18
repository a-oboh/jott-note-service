module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  moduleDirectories: [".", "src", "dist", "node_modules"],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   // "json",
  //   // "jsx",
  //   "ts",
  //   "tsx",
  //   // "node"
  // ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {
  //   "^controllers/(.+)$": "<rootDir>/src/controllers/$1",
  //   "^util/(.+)$": "<rootDir>/src/util/$1",
  //   '^index$': '<rootDir>/src/index',
  // },

  roots: ["<rootDir>/src"],
};
