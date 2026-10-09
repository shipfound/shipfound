import type React from "react";
import BrowserExample from "./browser-example";
import TerminalExample from "./terminal-example";

// Every scene video.json names, by id. Write one file per scene (copy an
// example), register it here, and delete the examples you do not use.
export const scenes: Record<string, React.FC> = {
  "browser-example": BrowserExample,
  "terminal-example": TerminalExample,
};
