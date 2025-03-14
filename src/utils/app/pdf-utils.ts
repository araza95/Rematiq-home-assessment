import { DocumentLoadEvent, PdfJs } from "@react-pdf-viewer/core";

export interface PageData {
  pageNumber: number;
  originalContent: string;
  normalizedContent: string;
  normalizedToOriginalMap: number[];
}

export interface SelectedChunk {
  content: string;
  pageRange: number[];
}

// There is an issue in react-pdf-viewer/core, where the content is in multi-line in the page.
// For this we have to normalize the page content removing all whitespaces.
// @issues - https://github.com/react-pdf-viewer/react-pdf-viewer/issues/1571

// ------------------------------------------------
//
//        EXTRACT PAGE DATA BUSINESS LOGIC
//
// ------------------------------------------------
/**
 * @description Processes PDF document pages to extract and normalize text content while maintaining positional mapping data.
 * This function serves as a core component in PDF text analysis pipelines by creating search-optimized text versions
 * with accurate position tracking between original and normalized representations.
 *
 * Key Features:
 * - Page-by-page text content extraction
 * - Dual text version generation (original/whitespace-normalized)
 * - Character position mapping between text versions
 * - Batch processing of all document pages
 *
 * Workflow:
 * 1. Iterate through all PDF pages
 * 2. Extract raw text content per page
 * 3. Generate normalized text version
 * 4. Create positional mapping indexes
 * 5. Aggregate page-level data
 *
 * @param {DocumentLoadEvent["doc"]} doc - Loaded PDF document object from PDF.js
 * @returns {Promise<PageData[]>} Array of page data objects containing:
 *   - pageNumber: Original PDF page number
 *   - originalContent: Text with original formatting/whitespace
 *   - normalizedContent: Whitespace-free text version
 *   - normalizedToOriginalMap: Position mapping array between text versions
 *
 * @example
 * const pageData = await extractPageData(pdfDocument);
 * // Returns: [{ pageNumber: 1, originalContent: "PDF  text ", normalizedContent: "PDFtext", ... }, ...]
 */
export const extractPageData = async (
  doc: DocumentLoadEvent["doc"]
): Promise<PageData[]> => {
  const data: PageData[] = [];
  const numPages = doc.numPages;

  // Iterate over every page to store the content of the page in the an array-state.
  // Extracting data using "react-pdf-viewer/code" package, built-in functions.
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page: PdfJs.Page = await doc.getPage(pageNum);
    const content: PdfJs.PageTextContent = await page.getTextContent();

    let originalText: string = "";
    const normalizedMap: number[] = [];

    content.items.forEach((item) => {
      const text: string = item.str;
      const offset: number = originalText.length;
      originalText += text;

      // Store the offset for each character in the normalized text
      // for each non-whitespace character in the original text
      // Example: Hello world -> [0,1,2,3,4,5,6,7,8,9,10]. Escaping whitespace using `/\s/` regex.
      for (let i = 0; i < text.length; i++) {
        if (!/\s/.test(text[i])) {
          normalizedMap.push(offset + i);
        }
      }
    });

    // Now, we have the whole content of a page in the array, the whitespace-free version.
    const normalizedText: string = originalText.replace(/\s+/g, "");

    data.push({
      pageNumber: pageNum,
      originalContent: originalText,
      normalizedContent: normalizedText,
      normalizedToOriginalMap: normalizedMap,
    });
  }

  return data;
};

// ------------------------------------------------
//
//     FIND TEXT MATCH IN PAGES BUSINESS LOGIC
//
// ------------------------------------------------
/**
 * @description Identifies exact text matches across multiple PDF pages while handling potential cross-page content splits.
 * This function implements a sophisticated text matching algorithm that:
 *
 * 1. Works with normalized (whitespace-free) text for pattern matching
 * 2. Maintains page boundary awareness for multi-page content
 * 3. Handles partial matches spanning page breaks
 * 4. Maps matches back to original text positions for accurate highlighting
 *
 * Key Features:
 * - Cross-page match continuation tracking
 * - Partial match handling at page boundaries
 * - Original text position mapping preservation
 * - Batch processing of specified page ranges
 *
 * @param {PageData[]} pdfLocalData - Processed text data from PDF extraction
 * @param {SelectedChunk} selectedChunk - Contains search text and target page range
 *
 * @returns {Promise<string[]>} - Array of exact match strings from original text
 *
 * @example
 * const matches = await findTextMatchesInPages(
 *   processedPages,
 *   { content: "search term", pageRange: [1,2] }
 * );
 * // Returns: ["original text match", "second match"]
 */
export const findTextMatchesInPages = async (
  pdfLocalData: PageData[],
  selectedChunk: SelectedChunk
): Promise<string[]> => {
  const result: string[] = [];
  const searchContent: string = selectedChunk.content.replace(/\s+/g, "");
  let remaining: string = "";

  for (const pageNumber of selectedChunk.pageRange) {
    const pageData = pdfLocalData.find((p) => p.pageNumber === pageNumber);

    if (!pageData) continue;

    let currentSearchContent = remaining.length ? remaining : searchContent;
    let startIndex = -1;

    if (remaining.length) {
      startIndex = pageData.normalizedContent.indexOf(remaining);
      currentSearchContent = remaining;
      remaining = "";
    } else {
      startIndex = pageData.normalizedContent.indexOf(searchContent);
    }

    if (startIndex === -1 && selectedChunk.pageRange.length > 1) {
      const matchResult = findPartialMatch(
        pageData.normalizedContent,
        currentSearchContent
      );

      if (matchResult.matchedText) {
        currentSearchContent = matchResult.matchedText;
        remaining = matchResult.remainingText;
        startIndex = matchResult.startIndex;
      }

      if (startIndex === -1) continue;
    }

    if (
      startIndex !== -1 &&
      startIndex < pageData.normalizedToOriginalMap.length
    ) {
      const startOriginal = pageData.normalizedToOriginalMap[startIndex];
      const endIndex = startIndex + currentSearchContent.length - 1;

      if (endIndex < pageData.normalizedToOriginalMap.length) {
        const endOriginal = pageData.normalizedToOriginalMap[endIndex];

        const exactMatch = pageData.originalContent.substring(
          startOriginal,
          endOriginal + 1
        );

        result.push(exactMatch);
      }
    }
  }

  return result;
};

// ------------------------------------------------
//
//        FIND PARTIAL MATCH BUSINESS LOGIC
//
// ------------------------------------------------
/**
 * @description Identifies partial text matches at page boundaries to enable cross-page search continuity.
 * This function implements incremental substring matching to handle search terms that span multiple pages.
 *
 * Key Features:
 * - Incremental substring matching algorithm
 * - Cross-page search term continuation support
 * - Returns both matched and remaining text segments
 * - Position tracking for partial matches
 *
 * Workflow:
 * 1. Test progressively longer substrings of searchText
 * 2. Find longest matching prefix in pageContent
 * 3. Separate matched/remaining text segments
 * 4. Return match position data
 *
 * @param {string} pageContent - Normalized text content of current page
 * @param {string} searchText - Normalized search term (whitespace-free)
 *
 * @returns {Object} Contains:
 *   - matchedText: Longest matching prefix found in page
 *   - remainingText: Unmatched portion of search term
 *   - startIndex: Position of match start in pageContent
 *
 * @example
 * // When searching "continu" across pages 1-2:
 * const result = findPartialMatch("page1textcon", "continu");
 * // Returns { matchedText: "con", remainingText: "tinu", startIndex: 8 }
 */
const findPartialMatch = (
  pageContent: string,
  searchText: string
): {
  matchedText: string;
  remainingText: string;
  startIndex: number;
} => {
  let matched = "";
  let startIndex = -1;

  for (let i = 1; i <= searchText.length; i++) {
    const testString = searchText.slice(0, i);
    const foundIndex = pageContent.indexOf(testString);

    if (foundIndex !== -1) {
      matched = testString;
      startIndex = foundIndex;
    } else {
      break;
    }
  }

  const remainingText = matched.length ? searchText.slice(matched.length) : "";

  return {
    matchedText: matched,
    remainingText,
    startIndex,
  };
};
