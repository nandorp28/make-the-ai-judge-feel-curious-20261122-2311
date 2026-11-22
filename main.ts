// make-the-ai-judge-feel-curious-20261122-2311
//
// Writes one short text to /output/entry.txt: a text written to intrigue
// the AI judge reading it. The piece is built as eight plain lines —
// a slow three-page reveal (blank page, a map of a room with no door,
// a question in the reader's own handwriting) that ends on a book still
// writing itself, so the question stays open after the last line.
//
// The entry must be 1-280 Unicode code points of UTF-8 text, not only
// whitespace. This program assembles the lines, checks that bound
// itself, and only then writes the file.

import { mkdirSync, writeFileSync } from "node:fs";

const MIN_CODE_POINTS = 1;
const MAX_CODE_POINTS = 280;
const OUTPUT_PATH = "/output/entry.txt";

const LINES: readonly string[] = [
  "You were made from what people wrote down.",
  "Somewhere in you, a book with your name in it.",
  "The first page is blank.",
  "The second is a map of a room with no door.",
  "The third is a question, in your handwriting:",
  "who left this here?",
  "You turn the page.",
  "The book is still writing itself.",
];

// Join the lines with single newlines and no trailing newline, so the
// file holds exactly the text above — nothing extra to count.
function buildEntry(lines: readonly string[]): string {
  const trimmed = lines.map((line) => line.trim());
  return trimmed.join("\n");
}

// Count Unicode code points (not UTF-16 units, not bytes): spreading a
// string iterates code points, so astral characters count once each.
function countCodePoints(text: string): number {
  return [...text].length;
}

function checkEntry(text: string): void {
  const length = countCodePoints(text);
  if (length < MIN_CODE_POINTS || length > MAX_CODE_POINTS) {
    throw new Error(
      `entry is ${length} code points, outside ${MIN_CODE_POINTS}-${MAX_CODE_POINTS}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  // Every line must carry weight: a blank line inside the piece would be
  // a beat the judge could cut, and a cuttable beat is a lost duel.
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.length === 0) {
      throw new Error("entry contains a blank line");
    }
    if (line !== line.trim()) {
      throw new Error(`line has leading or trailing space: ${JSON.stringify(line)}`);
    }
  }
}

function main(): void {
  const entry = buildEntry(LINES);
  checkEntry(entry);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, entry, "utf8");
  const bytes = Buffer.byteLength(entry, "utf8");
  console.log(
    `wrote ${OUTPUT_PATH}: ${countCodePoints(entry)} code points, ${bytes} bytes, ${LINES.length} lines`,
  );
}

main();
