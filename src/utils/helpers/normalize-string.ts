/**
 * Normalizes a string by replacing consecutive whitespace (including newlines)
 * with a single space and trimming leading/trailing spaces.
 *
 * @param text - The input text to normalize.
 * @returns A normalized string.
 */
export const normalizeString = ({ text }: { text: string }): string => {
  return text.replace(/\s+/g, " ").trim();
};
