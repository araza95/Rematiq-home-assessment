import { DocumentLoadEvent, PdfJs } from "@react-pdf-viewer/core";

/**
 * Interface representing a page's text content data
 */
export interface PageData {
  pageNumber: number;
  originalContent: string;
  normalizedContent: string;
  normalizedToOriginalMap: number[];
}

/**
 * Interface for selected text chunk information
 */
export interface SelectedChunk {
  content: string;
  pageRange: number[];
}

/**
 * Service class for processing PDF page data and text matching
 */
export class PageDataService {
  /**
   * Extracts text content and mapping from a PDF document
   *
   * @param doc - The PDF document to extract text from
   * @returns Promise with array of page data
   */
  public static async extractPageData(
    doc: DocumentLoadEvent["doc"]
  ): Promise<PageData[]> {
    const data: PageData[] = [];
    const numPages = doc.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page: PdfJs.Page = await doc.getPage(pageNum);
      const content: PdfJs.PageTextContent = await page.getTextContent();

      let originalText: string = "";
      const normalizedMap: number[] = [];

      content.items.forEach((item) => {
        const text: string = item.str;
        const offset: number = originalText.length;
        originalText += text;

        // Build normalized mapping - store position of non-whitespace characters
        for (let i = 0; i < text.length; i++) {
          if (!/\s/.test(text[i])) {
            normalizedMap.push(offset + i);
          }
        }
      });

      const normalizedText: string = originalText.replace(/\s+/g, "");

      data.push({
        pageNumber: pageNum,
        originalContent: originalText,
        normalizedContent: normalizedText,
        normalizedToOriginalMap: normalizedMap,
      });
    }

    return data;
  }

  /**
   * Finds text matches across multiple pages for a selected chunk
   *
   * @param pdfLocalData - Array of page data
   * @param selectedChunk - The chunk of text to find and highlight
   * @returns Array of exact text matches
   */
  public static async findTextMatchesInPages(
    pdfLocalData: PageData[],
    selectedChunk: SelectedChunk
  ): Promise<string[]> {
    const result: string[] = [];
    const searchContent: string = selectedChunk.content.replace(/\s+/g, "");
    let remaining: string = "";

    // Process each page in the range
    for (const pageNumber of selectedChunk.pageRange) {
      const pageData = pdfLocalData.find((p) => p.pageNumber === pageNumber);

      if (!pageData) continue;

      // Determine what to search for on this page
      let currentSearchContent = remaining.length ? remaining : searchContent;
      let startIndex = -1;

      if (remaining.length) {
        // We're continuing from previous page
        startIndex = pageData.normalizedContent.indexOf(remaining);
        currentSearchContent = remaining;
        remaining = ""; // Reset remaining for next iteration
      } else {
        // First attempt at finding the content
        startIndex = pageData.normalizedContent.indexOf(searchContent);
      }

      // Handle content that spans multiple pages
      if (startIndex === -1 && selectedChunk.pageRange.length > 1) {
        // Find partial match at end of page to connect with next page
        const matchResult = this.findPartialMatch(
          pageData.normalizedContent,
          currentSearchContent
        );

        if (matchResult.matchedText) {
          currentSearchContent = matchResult.matchedText;
          remaining = matchResult.remainingText;
          startIndex = matchResult.startIndex;
        }

        if (startIndex === -1) continue; // No match on this page
      }

      // Calculate positions in original text
      if (
        startIndex !== -1 &&
        startIndex < pageData.normalizedToOriginalMap.length
      ) {
        const startOriginal = pageData.normalizedToOriginalMap[startIndex];
        const endIndex = startIndex + currentSearchContent.length - 1;

        // Check if we have a valid end index
        if (endIndex < pageData.normalizedToOriginalMap.length) {
          const endOriginal = pageData.normalizedToOriginalMap[endIndex];

          // Extract exact match from original text
          const exactMatch = pageData.originalContent.substring(
            startOriginal,
            endOriginal + 1
          );

          result.push(exactMatch);
        }
      }
    }

    return result;
  }

  /**
   * Finds the longest partial match of text at beginning of a page
   *
   * @param pageContent - Normalized page content
   * @param searchText - Text to search for
   * @returns Object with matched text, remaining text and start index
   */
  private static findPartialMatch(
    pageContent: string,
    searchText: string
  ): {
    matchedText: string;
    remainingText: string;
    startIndex: number;
  } {
    let matched = "";
    let startIndex = -1;

    // Try to match incrementally longer substrings
    for (let i = 1; i <= searchText.length; i++) {
      const testString = searchText.slice(0, i);
      const foundIndex = pageContent.indexOf(testString);

      if (foundIndex !== -1) {
        matched = testString;
        startIndex = foundIndex;
      } else {
        // We've found the longest match
        break;
      }
    }

    // Calculate remaining text that wasn't matched
    const remainingText = matched.length
      ? searchText.slice(matched.length)
      : "";

    return {
      matchedText: matched,
      remainingText,
      startIndex,
    };
  }
}
