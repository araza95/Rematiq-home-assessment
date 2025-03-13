import { DocumentLoadEvent } from "@react-pdf-viewer/core";
import { PdfTextContentData } from "../../pages/PdfViewerPage";
import { ExtendedTextItemType } from "../../types/react-pdf-viewer-extenders.type";

/**
 * @description Extracts and processes text content from a PDF document, generating both original and whitespace-normalized versions
 * while maintaining character position mapping between them. This function is designed for PDF text analysis and processing pipelines.
 *
 * Key Features:
 * - Processes all pages of PDF documents
 * - Maintains positional mapping between normalized and original text
 * - Handles large documents efficiently through parallel page processing
 * - Preserves original text structure while creating search-optimized version
 *
 * Workflow:
 * 1. Extract text content from all PDF pages
 * 2. Build original text with page separation spaces
 * 3. Create normalized text by removing whitespace
 * 4. Generate character position mapping between versions
 *
 * @param {DocumentLoadEvent} param - Contains the PDF document object
 * @param {PDFDocument} param.doc - Loaded PDF document for processing
 *
 * @returns {Promise<PdfTextContentData>} Object containing:
 *   - originalText: Complete text with original formatting/whitespace
 *   - normalizedText: Whitespace-free version for text analysis
 *   - normalizedToOriginalMap: Array mapping normalized text positions to original positions
 *
 * @example
 * const pdfData = await extractPdfTextContent({ doc: loadedPdf });
 * console.log(pdfData.normalizedText); // Outputs: "PDFTextWithoutWhitespace"
 */
export const extractPdfTextContent = async ({
  doc,
}: DocumentLoadEvent): Promise<PdfTextContentData> => {
  const pageNumbers = Array.from({ length: doc.numPages }, (_, i) => i + 1);

  console.log("🚀 ~ pageNumbers:", pageNumbers);

  const pageContents = await Promise.all(
    pageNumbers.map(async (pageNumber) => {
      const page = await doc.getPage(pageNumber);
      //   return page.getTextContent();
      const textContent = await page.getTextContent();

      // Detect and remove page numbers
      const filteredItems = textContent.items.filter((_, index) => {
        const item = _ as ExtendedTextItemType;

        // Check first item
        if (index === 0 && item.str.trim() === pageNumber.toString()) {
          return false;
        }

        // Check last item
        if (
          index === textContent.items.length - 1 &&
          item.str.trim() === pageNumber.toString()
        ) {
          return false;
        }

        return true;
      });

      return { ...textContent, items: filteredItems };
    })
  );

  console.log("🚀 ~ pageContents:", pageContents);

  // Initialize the original text.
  let originalText: string = "";

  // Array to map normalized text positions to original positions.
  const normalizedToOriginalMap: number[] = [];

  // Loop through each page's content.
  pageContents.forEach((page, pageIndex) => {
    page.items.forEach((_) => {
      const item = _ as ExtendedTextItemType;
      const text = item.str;
      const offset = originalText.length;
      originalText += text;
      // Map each non-whitespace character to its original position.
      for (let i = 0; i < text.length; i++) {
        if (!/\s/.test(text[i])) {
          normalizedToOriginalMap.push(offset + i);
        }
      }
    });

    // Add space between pages but not page numbers
    if (pageIndex < pageContents.length - 1) {
      originalText += " ";
    }
  });

  // Create normalized text by removing all whitespace.
  const normalizedText = originalText.replace(/\s+/g, "");

  console.log("🚀 ~ normalizedText:", normalizedText);

  return {
    originalText,
    normalizedText,
    normalizedToOriginalMap,
  };
};
