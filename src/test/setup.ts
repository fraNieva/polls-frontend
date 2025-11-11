import "@testing-library/jest-dom";

// Extend Vitest's expect with jest-dom matchers
import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// Mock import.meta.env for tests
Object.defineProperty(import.meta, "env", {
  value: {
    DEV: false,
    PROD: false,
    MODE: "test",
  },
  configurable: true,
});