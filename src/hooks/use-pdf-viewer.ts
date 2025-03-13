// React Imports
import { useCallback, useEffect, useRef, useState } from "react";

// React PDF Viewer Core Imports
import { DocumentLoadEvent, VisiblePagesRange } from "@react-pdf-viewer/core";

// React PDF Viewer Plugin Imports
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { OnHighlightKeyword, searchPlugin } from "@react-pdf-viewer/search";

// Store Imports
import { usePDFStore } from "../store/pdf-store";

// Type Imports
import { PageData, usePdfViewerHook } from "../types/pdf-types";

// Utility Imports
import { PageDataService } from "../utils/app/pdf-utils";

/**
 * @description A custom hook that manages PDF viewer functionality including page navigation, text search,
 * and document processing. This hook integrates with PDF viewer plugins and provides a comprehensive solution
 * for PDF interaction within React components.
 *
 * Key Features:
 * - Manages PDF viewer plugin integration (search, page navigation)
 * - Handles document loading and text extraction
 * - Implements text matching and highlighting functionality
 * - Maintains synchronization between PDF view and application state
 * - Provides page range control for optimized rendering
 *
 * @returns {Object} An object containing:
 *   - selectedPDF: Currently selected PDF document metadata
 *   - pageNavigationPluginInstance: Plugin for page navigation controls
 *   - CurrentPageLabel: Component displaying current page number
 *   - plugins: Array of active PDF viewer plugins
 *   - handleDocumentLoad: Function to process loaded PDF documents
 *   - setRenderRange: Function to control visible page range
 *
 * @example
 * const {
 *   selectedPDF,
 *   CurrentPageLabel,
 *   plugins,
 *   handleDocumentLoad
 * } = usePdfViewer();
 *
 * <PdfViewer
 *   documents={[selectedPDF]}
 *   plugins={plugins}
 *   onDocumentLoad={handleDocumentLoad}
 * />
 */
export const usePdfViewer = (): usePdfViewerHook => {
  // Get PDF-related data from global store
  const { selectedPDF, selectedChunk, setDocumentLoaded, isDocumentLoaded } =
    usePDFStore();

  // Store extracted page data from the PDF
  const [pdfLocalData, setPdfLocalData] = useState<PageData[]>([]);

  // Create the page navigation plugin (for page jumping, etc.)
  // useRef ensures the plugin is only created once
  const pageNavigationPluginInstance = useRef(pageNavigationPlugin()).current;

  // Create the search plugin with custom highlight styling
  const searchPluginRef = useRef(
    searchPlugin({
      onHighlightKeyword: ({ highlightEle }: OnHighlightKeyword) => {
        // Make highlights cyan with padding and a blending mode for better visibility
        highlightEle.style.background = "#00FFFF"; // Cyan color
        highlightEle.style.padding = "2px"; // Add padding around highlights
        highlightEle.style.mixBlendMode = "multiply"; // Blend with underlying content
      },
    })
  );

  // Get the search plugin instance from the ref
  const searchPluginInstance = searchPluginRef.current;

  // Combine all plugins into a single array for the PDF viewer
  const pluginsRef = useRef([
    searchPluginInstance,
    pageNavigationPluginInstance,
  ]);

  /**
   * Processes a PDF document after it's loaded
   *
   * @param {DocumentLoadEvent} event - Contains the loaded PDF document
   * @returns {Promise<void>} - Nothing is returned
   */
  const handleDocumentLoad = useCallback(
    async ({ doc }: DocumentLoadEvent): Promise<void> => {
      try {
        // Extract text and other data from each page of the PDF
        const data = await PageDataService.extractPageData(doc);

        // Store the extracted data for later use
        setPdfLocalData(data);

        // Mark the document as successfully loaded
        setDocumentLoaded(true);
      } catch (error) {
        // Log any errors that occur during loading
        console.error("Error loading PDF document:", error);

        // Mark the document as not loaded
        setDocumentLoaded(false);
      }
    },
    [] // No dependencies means this function is created once
  );

  /**
   * Defines which pages should be rendered in the viewer
   *
   * @param {VisiblePagesRange} range - Contains start and end page numbers
   * @returns {Object} - Object with startPage and endPage properties
   */
  const setRenderRange = useCallback(
    ({ endPage, startPage }: VisiblePagesRange) => ({
      endPage, // Last page to render
      startPage, // First page to render
    }),
    [] // No dependencies means this function is created once
  );

  /**
   * Finds and highlights text in the PDF that matches the selected chunk
   *
   * @returns {Promise<void>} - Nothing is returned
   */
  const highlightMatchingText = useCallback(async (): Promise<void> => {
    // Don't proceed if document isn't loaded or no chunk is selected
    if (!isDocumentLoaded || !selectedChunk) return;

    try {
      // Search for text matches across all pages
      const result = await PageDataService.findTextMatchesInPages(
        pdfLocalData,
        selectedChunk
      );

      // Remove any existing highlighted text
      searchPluginInstance.clearHighlights();

      // If we found matches, highlight them and jump to the first one
      if (result.length > 0) {
        const matches = await searchPluginInstance.highlight(result);
        if (matches.length > 0) {
          searchPluginInstance.jumpToMatch(0); // Jump to the first match
        }
      }
    } catch (error) {
      console.error("Error highlighting text:", error);
    }
  }, [
    selectedChunk, // Re-run when selected text changes
    searchPluginInstance, // Re-run if search plugin changes
    pdfLocalData, // Re-run when PDF data changes
    isDocumentLoaded, // Re-run when document load state changes
  ]);

  // Run the highlight function whenever dependencies change
  useEffect(() => {
    highlightMatchingText();
  }, [highlightMatchingText]); // This depends on selectedChunk, searchPluginInstance, etc.

  // Return all the values and functions needed by components using this hook
  return {
    selectedPDF, // Currently selected PDF file
    pageNavigationPluginInstance, // Plugin for page navigation
    CurrentPageLabel: pageNavigationPluginInstance.CurrentPageLabel, // Component to show current page
    plugins: pluginsRef.current, // All PDF viewer plugins
    handleDocumentLoad, // Function to handle document loading
    setRenderRange, // Function to set visible page range
  };
};
