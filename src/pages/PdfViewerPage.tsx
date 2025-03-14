// React Imports
import React, { JSX, useEffect } from "react";

// React PDF Viewer Core Imports
import {
  ScrollMode,
  SpecialZoomLevel,
  Viewer,
  ViewMode,
  Worker,
} from "@react-pdf-viewer/core";

// Style Imports
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

// Component Imports
import { PdfLoadProgress } from "../components/Loaders/PDFLoader";
import PDFHeader from "../components/Header/PDFHeader";

// Hook Imports
import { usePdfViewer } from "../hooks/use-pdf-viewer";
import { usePDFStore } from "../store/pdf-store";
import DocumentProcessingLoader from "../components/Loaders/DocumentProcessingLoader";

/**
 * @description A React component that renders a PDF viewer with integrated plugin support and responsive display features.
 * This component handles PDF document loading, page navigation, and view customization while providing loading states
 * and empty state handling.
 *
 * Key Features:
 * - Dynamic PDF loading based on selection
 * - Integrated plugin system for extended functionality (search, navigation, etc.)
 * - Smooth scrolling and configurable view modes
 * - Progress indication during PDF loading
 * - Responsive layout with empty state management
 *
 * @returns {JSX.Element} - Returns a PDF viewer component with toolbar integration and display controls
 *
 * @example
 * // Usage in parent component:
 * <PdfViewer />
 *
 * // Requires wrapping Provider for PDF context:
 * <PDFProvider>
 *   <PdfViewer />
 * </PDFProvider>
 *
 * @issues - https://github.com/mozilla/pdf.js/issues/3768#issuecomment-36468349
 * @issues - https://github.com/react-pdf-viewer/react-pdf-viewer/issues/1571
 *
 * @see [react-pdf-viewer documentation](https://react-pdf-viewer.dev) for plugin configuration details
 * @see [pdfjs-dist worker setup](https://react-pdf-viewer.dev/docs/basic-usage/) for worker requirements
 */
const PdfViewer: React.FC = (): JSX.Element => {
  const {
    selectedPDF,
    CurrentPageLabel,
    plugins,
    handleDocumentLoad,
    setRenderRange,
  } = usePdfViewer();

  const { isDocumentLoaded } = usePDFStore();

  // Create a temporary loading state when document first loads
  // This will simulate a 2-second processing time for demonstration
  useEffect(() => {
    if (selectedPDF && !isDocumentLoaded) {
      const timer = setTimeout(() => {}, 3000);

      return () => clearTimeout(timer);
    }
  }, [selectedPDF, isDocumentLoaded]);

  // If no PDF is selected, show empty state
  if (!selectedPDF) {
    return (
      <div className="p-4 text-center text-gray-600 h-full flex items-center justify-center text-[2.5rem] font-[initial]">
        Select a PDF to view
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* DocumentProcessingLoader will only show when isDocumentLoaded is false */}
      {!isDocumentLoaded && selectedPDF && (
        <DocumentProcessingLoader
          pdfId={selectedPDF.path || selectedPDF.path.split("/").pop()}
        />
      )}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <PDFHeader CurrentPageLabel={CurrentPageLabel} />
        <div className="flex-1 overflow-hidden w-[95%] md:w-[85%] m-auto">
          <Viewer
            initialPage={0}
            fileUrl={selectedPDF.path}
            plugins={plugins}
            enableSmoothScroll
            viewMode={ViewMode.SinglePage}
            defaultScale={SpecialZoomLevel.PageWidth}
            scrollMode={ScrollMode.Vertical}
            setRenderRange={setRenderRange}
            renderLoader={(progress) => <PdfLoadProgress progress={progress} />}
            onDocumentLoad={handleDocumentLoad}
            theme="dark"
          />
        </div>
      </Worker>
    </div>
  );
};

export default PdfViewer;
