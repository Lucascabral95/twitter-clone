import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import("jest").Config} */
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^.+\\.(css|scss|sass)$": "<rootDir>/test/__mocks__/styleMock.ts",
    "^@/zustand$": "<rootDir>/test/__mocks__/zustand.ts",
    "^@/(?!zustand$)(.*)$": "<rootDir>/src/$1",
    "^zustand$": "<rootDir>/test/__mocks__/zustand-create-shim.ts",
    "^avvvatars-react$": "<rootDir>/test/__mocks__/avvvatars-react.tsx",
  },
};

export default createJestConfig(config);
