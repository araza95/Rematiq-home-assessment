import "@testing-library/jest-dom"; // for extra matchers like .toBeInTheDocument()
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// automatically unmount and cleanup DOM after each test
afterEach(() => {
  cleanup();
});
