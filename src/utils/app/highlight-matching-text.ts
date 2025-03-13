import { searchPlugin } from "@react-pdf-viewer/search";
import { PdfTextContentData } from "../../pages/PdfViewerPage";

/**
 * @description Highlights matching text in a PDF document while handling whitespace normalization differences.
 * This function bridges the gap between user-provided text searches and PDF text content by:
 * 1. Normalizing search queries to match processed PDF text
 * 2. Mapping positions between normalized and original text versions
 * 3. Applying precise highlights to the exact original text match
 *
 * Key Features:
 * - White space -agnostic text matching
 * - Position mapping between normalized/original text versions
 * - Automated highlight management (clears previous matches)
 * - Direct navigation to first match occurrence
 *
 * @param {Object} params
 * @param {ReturnType<typeof searchPlugin>} params.searchPluginInstance - PDF viewer search plugin interface
 * @param {PdfTextContentData} params.pdfTextContent - Processed text data from PDF extraction
 * @param {string} params.selectedText - User-provided search text (with original formatting)
 *
 * @returns {Promise<void>} - Resolves when highlighting is complete
 *
 * @example
 * await highlightMatchingText({
 *   searchPluginInstance: pdfViewerSearch,
 *   pdfTextContent: processedData,
 *   selectedText: " search  text "
 * });
 */
// export const highlightMatchingText = async ({
//   searchPluginInstance,
//   pdfTextContent,
//   selectedText,
// }: {
//   searchPluginInstance: ReturnType<typeof searchPlugin>;
//   pdfTextContent: PdfTextContentData;
//   selectedText: string;
// }): Promise<void> => {
//   // Normalize the search query by removing all whitespace.
//   const searchNormalized = selectedText.replace(/\s+/g, "");

//   console.log("🚀 ~ searchNormalized:", searchNormalized);

//   console.log("🚀 ~ pdfTextContent:", pdfTextContent);

//   // Find the start index of the normalized search query in the normalized text.
//   const startIndex = text.indexOf(searchNormalized);

//   console.log(
//     "🚀 Testing ~ startIndex:",
//     searchNormalized.substring(0, 10),
//     startIndex
//   );

//   // If the query is not found, exit the function.
//   if (startIndex === -1) return;

//   // Calculate the start position in the original text.
//   const startOriginal = pdfTextContent.normalizedToOriginalMap[startIndex];
//   console.log(
//     "🚀 Testing  startOriginal:",
//     searchNormalized.substring(0, 10),
//     startOriginal
//   );

//   // Calculate the end position in the original text.
//   const endOriginal =
//     pdfTextContent.normalizedToOriginalMap[
//       startIndex + searchNormalized.length - 1
//     ];

//   console.log(
//     "🚀 Testing endOriginal:",
//     searchNormalized.substring(0, 10),
//     endOriginal
//   );

//   // Extract the exact matching substring from the original text.
//   const exactMatch = pdfTextContent.originalText.substring(
//     startOriginal,
//     endOriginal + 1
//   );

//   // Clear any previous highlights, apply new highlighting, and jump to the match.
//   searchPluginInstance.clearHighlights();

//   // Highlight the exact match and jump to it.
//   const matches = await searchPluginInstance.highlight(exactMatch);

//   // If there are matches, jump to the first one.
//   if (matches.length > 0) {
//     searchPluginInstance.jumpToMatch(0);
//   }
// };
/**
 * Find the best approximate match for the search text in the PDF content
 * This handles cases where the text spans multiple pages with slight variations
 */
export const highlightMatchingText = async ({
  searchPluginInstance,
  pdfTextContent,
  selectedText,
}: {
  searchPluginInstance: ReturnType<typeof searchPlugin>;
  pdfTextContent: PdfTextContentData;
  selectedText: string;
}): Promise<void> => {
  // Normalize the search query by removing all whitespace
  const searchNormalized = selectedText.replace(/\s+/g, "");

  console.log("🚀 ~ searchNormalized length:", searchNormalized.length);

  // First try exact matching
  let startIndex = pdfTextContent.normalizedText.indexOf(searchNormalized);

  // If exact match fails, try finding the largest common substring
  if (startIndex === -1) {
    console.log("Exact match failed, trying to find longest common substring");

    // Try finding significant chunks from the beginning, middle, and end
    const chunks = [
      // Beginning chunk (first 30%)
      searchNormalized.substring(0, Math.floor(searchNormalized.length * 0.3)),
      // Middle chunk (middle 30%)
      searchNormalized.substring(
        Math.floor(searchNormalized.length * 0.35),
        Math.floor(searchNormalized.length * 0.65)
      ),
      // End chunk (last 30%)
      searchNormalized.substring(Math.floor(searchNormalized.length * 0.7)),
    ];

    console.log("🚀 ~ chunks:", chunks);

    // Try each chunk
    for (const chunk of chunks) {
      console.log(`🚀 ~ chunks: Trying chunk: "${chunk}`);
      if (chunk.length < 20) continue; // Skip if chunk is too small

      const chunkIndex = pdfTextContent.normalizedText.indexOf(chunk);
      console.log("🚀 ~ chunks: ~ chunkIndex:", chunkIndex);
      if (chunkIndex !== -1) {
        console.log(`Found matching chunk: "${chunk.substring(0, 20)}..."`);

        // Calculate approximate positions based on the chunk position
        if (chunk === chunks[0]) {
          console.log(`Found matching chunk: part1 "${chunks[0]}`);

          // If beginning chunk matched
          startIndex = chunkIndex;
        } else if (chunk === chunks[1]) {
          console.log(`Found matching chunk: part2 "${chunks[1]}`);

          // If middle chunk matched, estimate start position
          startIndex = Math.max(
            0,
            chunkIndex - Math.floor(searchNormalized.length * 0.35)
          );
        } else {
          console.log(`Found matching chunk: part3 "${chunks[2]}`);
          // If end chunk matched, estimate start position
          startIndex = Math.max(
            0,
            chunkIndex - Math.floor(searchNormalized.length * 0.7)
          );
        }

        break;
      }
      console.log("🚀 ~ startIndex:", startIndex);
    }

    // If we still couldn't find a match, try breaking it down into smaller chunks
    if (startIndex === -1) {
      // Create an array of smaller chunks (20 chars each with 10 char overlap)
      const smallChunks = [];
      const chunkSize = 20;
      const step = 10;

      for (let i = 0; i < searchNormalized.length - chunkSize + 1; i += step) {
        smallChunks.push(searchNormalized.substring(i, i + chunkSize));
      }

      // Find the first matching small chunk
      for (let i = 0; i < smallChunks.length; i++) {
        const chunk = smallChunks[i];
        const chunkIndex = pdfTextContent.normalizedText.indexOf(chunk);

        if (chunkIndex !== -1) {
          // Calculate approximate start position based on which chunk matched
          startIndex = Math.max(0, chunkIndex - i * step);
          console.log(
            `Found small chunk match at position ${i * step} of original text`
          );
          break;
        }
      }
    }

    // If we still couldn't find any match
    if (startIndex === -1) {
      console.error("Unable to find any matching text in PDF content");
      return;
    }
  }

  console.log("🚀 Using startIndex:", startIndex);

  // Now determine how much text to highlight
  // First, calculate the maximum possible match length (based on available text)
  const maxPossibleLength = Math.min(
    pdfTextContent.normalizedText.length - startIndex,
    searchNormalized.length
  );

  // Then determine how much actually matches
  let matchLength = 0;
  let mismatchCount = 0;
  const maxAllowedMismatches = Math.ceil(searchNormalized.length * 0.2); // Allow up to 20% mismatches

  for (let i = 0; i < maxPossibleLength; i++) {
    if (pdfTextContent.normalizedText[startIndex + i] === searchNormalized[i]) {
      matchLength++;
    } else {
      mismatchCount++;
      // Allow skipping characters in the target text (PDF content)
      if (
        pdfTextContent.normalizedText[startIndex + i + 1] ===
        searchNormalized[i]
      ) {
        startIndex++; // Adjust startIndex to skip the extra character
        i--; // Retry with the next character
        continue;
      }
      // Also try skipping characters in the search text
      else if (
        i + 1 < maxPossibleLength &&
        pdfTextContent.normalizedText[startIndex + i] ===
          searchNormalized[i + 1]
      ) {
        i++; // Skip this character in the search text
        matchLength++;
        continue;
      }

      // If too many mismatches, stop extending the match
      if (mismatchCount > maxAllowedMismatches) {
        break;
      }
    }
  }

  console.log(
    `Match stats: ${matchLength} of ${searchNormalized.length} characters (${mismatchCount} mismatches)`
  );

  // Use either the match length or a reasonable proportion of the search text
  const effectiveMatchLength = Math.min(
    matchLength + mismatchCount,
    searchNormalized.length
  );

  // Calculate the original text positions
  const startOriginal = pdfTextContent.normalizedToOriginalMap[startIndex];

  // Make sure we don't exceed array bounds
  const endIndex = Math.min(
    startIndex + effectiveMatchLength - 1,
    pdfTextContent.normalizedToOriginalMap.length - 1
  );

  const endOriginal = pdfTextContent.normalizedToOriginalMap[endIndex];

  console.log(`Original text positions: ${startOriginal} to ${endOriginal}`);

  // Extract the matching substring from the original text
  const exactMatch = pdfTextContent.originalText.substring(
    startOriginal,
    endOriginal + 1
  );

  console.log(`Highlighting text: "${exactMatch.substring(0, 50)}..."`);

  // Clear previous highlights and apply new highlighting
  searchPluginInstance.clearHighlights();
  const matches = await searchPluginInstance.highlight(exactMatch);

  // Jump to the first match
  if (matches.length > 0) {
    searchPluginInstance.jumpToMatch(0);
  } else {
    console.error("No matches found after highlighting");
  }
};
