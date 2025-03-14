import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  extractPageData,
  findTextMatchesInPages,
  PageData,
  SelectedChunk,
} from "../utils/app/pdf-utils";
import { DocumentLoadEvent, PdfJs } from "@react-pdf-viewer/core";

// Create properly typed mock objects
const mockTextContent: PdfJs.PageTextContent = {
  items: [
    { str: "Hello " },
    { str: "world" },
    { str: ", " },
    { str: "this is " },
    { str: "a test." },
  ],
};

const mockPage: PdfJs.Page = {
  getTextContent: vi.fn().mockResolvedValue(mockTextContent),
} as unknown as PdfJs.Page;

const mockDoc: DocumentLoadEvent["doc"] = {
  numPages: 2,
  getPage: vi.fn().mockResolvedValue(mockPage),
} as unknown as DocumentLoadEvent["doc"];

const mockPageData: PageData[] = [
  {
    pageNumber: 1,
    originalContent: "Hello world, this is a test.",
    normalizedContent: "Helloworldthisisatest.",
    normalizedToOriginalMap: [
      0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23,
    ],
  },
  {
    pageNumber: 2,
    originalContent: "Another page with content.",
    normalizedContent: "Anotherpagewitcontent.",
    normalizedToOriginalMap: [
      0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    ],
  },
];

describe("PDF Text Extraction and Matching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("extractPageData", () => {
    it("should extract text content from all pages", async () => {
      const result = await extractPageData(mockDoc);

      expect(mockDoc.getPage).toHaveBeenCalledTimes(mockDoc.numPages);
      expect(mockPage.getTextContent).toHaveBeenCalledTimes(mockDoc.numPages);
      expect(result).toHaveLength(mockDoc.numPages);
    });

    it("should correctly process page content and create normalized text", async () => {
      // Setup mock to return specific content for testing normalization
      const specificMockTextContent: PdfJs.PageTextContent = {
        items: [{ str: "PDF  " }, { str: "text " }, { str: "with  spaces" }],
      };

      const typedMockPage = {
        ...mockPage,
        getTextContent: vi.fn().mockResolvedValueOnce(specificMockTextContent),
      };

      const typedMockDoc: DocumentLoadEvent["doc"] = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValueOnce(typedMockPage),
      } as unknown as DocumentLoadEvent["doc"];

      const result = await extractPageData(typedMockDoc);

      expect(result[0].originalContent).toBe("PDF  text with  spaces");
      expect(result[0].normalizedContent).toBe("PDFtextwithspaces");
    });
  });

  describe("findTextMatchesInPages", () => {
    it("should find exact text matches on a single page", async () => {
      const selectedChunk: SelectedChunk = {
        content: "world",
        pageRange: [1],
      };

      const result = await findTextMatchesInPages(mockPageData, selectedChunk);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe("world");
    });

    it("should return empty array when no match is found", async () => {
      const selectedChunk: SelectedChunk = {
        content: "nonexistent text",
        pageRange: [1],
      };

      const result = await findTextMatchesInPages(mockPageData, selectedChunk);

      expect(result).toHaveLength(0);
    });

    it("should handle partial matches across pages", async () => {
      // Create mock page data with text that splits across pages
      const crossPageMockData: PageData[] = [
        {
          pageNumber: 1,
          originalContent: "This page ends with cross",
          normalizedContent: "Thispageendswithcross",
          normalizedToOriginalMap: Array.from(
            { length: "Thispageendswithcross".length },
            (_, i) => i
          ),
        },
        {
          pageNumber: 2,
          originalContent: "page content continues here",
          normalizedContent: "pagecontentcontinueshere",
          normalizedToOriginalMap: Array.from(
            { length: "pagecontentcontinueshere".length },
            (_, i) => i
          ),
        },
      ];

      const selectedChunk: SelectedChunk = {
        content: "cross page",
        pageRange: [1, 2],
      };

      const result = await findTextMatchesInPages(
        crossPageMockData,
        selectedChunk
      );

      // We expect to get matches from one or both pages
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
