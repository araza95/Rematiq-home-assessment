import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { PDFDatum } from "./pdf-response";
import {
  DocumentLoadEvent,
  Plugin,
  VisiblePagesRange,
} from "@react-pdf-viewer/core";

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
 * Interface representing the extracted PDF text content and mapping.
 */
export interface PdfTextContentData {
  originalText: string;
  normalizedText: string;
  normalizedToOriginalMap: number[];
}

export type usePdfViewerHook = {
  // The currently selected PDF file
  selectedPDF: PDFDatum | undefined;
  // Plugin instance for page navigation (jumping to specific pages, etc.)
  pageNavigationPluginInstance: ReturnType<typeof pageNavigationPlugin>;
  // Component to display the current page number
  CurrentPageLabel: ReturnType<typeof pageNavigationPlugin>["CurrentPageLabel"];
  // Array of all PDF viewer plugins being used
  plugins: Plugin[];
  // Function to handle when a document is loaded
  handleDocumentLoad: (event: DocumentLoadEvent) => Promise<void>;
  // Function to set the visible page range
  setRenderRange: (range: VisiblePagesRange) => {
    startPage: number;
    endPage: number;
  };
};
