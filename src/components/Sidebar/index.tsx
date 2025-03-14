// Sidebar.tsx
import React, { FunctionComponent, useEffect, useMemo } from "react";
import { PDF_LISTS_PATH } from "../../config/constants";
import usePdfFetch from "../../hooks/use-fetch";
import { useDimension } from "../../hooks/useWindow";
import { usePDFStore } from "../../store/pdf-store";
import { useSidebarStore } from "../../store/sidebar-store";
import { PDFChunk, PDFData, PDFDatum } from "../../types/pdf-response";
import { cn } from "../../lib/utils";
import PdfList from "./PDFList";
import SidebarHeader from "./SidebarHeader";

const Sidebar: FunctionComponent = () => {
  // Global Store Hooks
  const { isCollapsed, toggleSidebar, autoCollapse } = useSidebarStore();
  const {
    setSelectedPDF,
    selectChunk,
    selectedChunk,
    selectedPDF,
    isDocumentLoaded,
  } = usePDFStore();

  // Fetch PDF data
  const { data: pdfData } = usePdfFetch<PDFData>({ url: PDF_LISTS_PATH });
  const { width } = useDimension();

  // Manage open PDF state
  const [openPdfId, setOpenPdfId] = React.useState<string | null>(null);

  const handlePdfSelect = (id: string, data: PDFDatum) => {
    setSelectedPDF(data);
    setOpenPdfId((prevId) => (prevId === id ? null : id));
  };

  const handleChunkSelect = (chunk: PDFChunk) => {
    if (!isDocumentLoaded) return;
    selectChunk(chunk);
  };

  // Automatically collapse sidebar on small screens
  useEffect(() => {
    if (width < 768) {
      autoCollapse(true);
    } else {
      autoCollapse(false);
    }
  }, [autoCollapse, width]);

  // Sidebar animation classes
  const sidebarClasses = useMemo(
    () =>
      cn(
        "flex flex-col transition-all duration-500 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100",
        "border-r border-gray-700 shadow-lg",
        isCollapsed
          ? "w-0 opacity-0 overflow-hidden"
          : "w-64 opacity-100 md:w-72 md:opacity-100"
      ),
    [isCollapsed]
  );

  return (
    <aside className={sidebarClasses}>
      <SidebarHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent p-2">
        {pdfData && Object.entries(pdfData).length > 0 ? (
          <PdfList
            pdfData={pdfData}
            openPdfId={openPdfId}
            setOpenPdfId={setOpenPdfId}
            selectedPDF={selectedPDF}
            selectedChunk={selectedChunk}
            isDocumentLoaded={isDocumentLoaded}
            handlePdfSelect={handlePdfSelect}
            handleChunkSelect={handleChunkSelect}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm italic">No PDFs available</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
