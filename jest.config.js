// jest.config.js
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/__tests__/setup.ts"],

  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
    "^@/(.*)\\.js$": "<rootDir>/src/$1",
  },

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
