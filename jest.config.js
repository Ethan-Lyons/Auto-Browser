// jest.config.js (or jest.config.mjs)
export default {
  testEnvironment: "node",
  roots: ["<rootDir>/Interpreter"],
  transform: {},
  moduleDirectories: ["node_modules", "src"],
  testTimeout: 10000,
};
