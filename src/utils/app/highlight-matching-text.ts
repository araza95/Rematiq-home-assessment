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
export const highlightMatchingText = async ({
  searchPluginInstance,
  pdfTextContent,
  selectedText,
}: {
  searchPluginInstance: ReturnType<typeof searchPlugin>;
  pdfTextContent: PdfTextContentData;
  selectedText: string;
}): Promise<void> => {
  // Normalize the search query by removing whitespace.
  const searchNormalized = selectedText.replace(/\s+/g, "");
  const startIndex = pdfTextContent.normalizedText.indexOf(searchNormalized);
  if (startIndex === -1) return;

  // Map the normalized indices back to the original text positions.
  const startOriginal = pdfTextContent.normalizedToOriginalMap[startIndex];
  const endOriginal =
    pdfTextContent.normalizedToOriginalMap[
      startIndex + searchNormalized.length - 1
    ];

  // Extract the exact matching substring from the original text.
  const exactMatch = pdfTextContent.originalText.substring(
    startOriginal,
    endOriginal + 1
  );

  console.log("inner - outside exact match", exactMatch);
  console.log("inner - outside", startIndex, endOriginal);

  // Clear any previous highlights, apply new highlighting, and jump to the match.
  searchPluginInstance.clearHighlights();
  const matches = await searchPluginInstance.highlight(exactMatch);
  if (matches.length > 0) {
    searchPluginInstance.jumpToMatch(0);
  }
};
