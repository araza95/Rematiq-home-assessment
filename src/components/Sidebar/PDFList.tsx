// PdfList.tsx
import { FunctionComponent, useMemo } from "react";
import { PDFChunk, PDFData, PDFDatum } from "../../types/pdf-response";
import PdfItem from "./PDFItem";

interface PdfListProps {
  pdfData: PDFData;
  openPdfId: string | null;
  setOpenPdfId: (id: string | null) => void;
  selectedPDF: PDFDatum | undefined;
  selectedChunk: PDFChunk | undefined;
  isDocumentLoaded: boolean;
  handlePdfSelect: (id: string, data: PDFDatum) => void;
  handleChunkSelect: (chunk: PDFChunk) => void;
}

const PdfList: FunctionComponent<PdfListProps> = ({
  pdfData,
  openPdfId,
  setOpenPdfId,
  selectedPDF,
  selectedChunk,
  isDocumentLoaded,
  handlePdfSelect,
  handleChunkSelect,
}) => {
  const pdfList = useMemo(() => {
    if (!pdfData || Object.entries(pdfData).length === 0) return null;

    return Object.entries(pdfData).map(([id, data]) => {
      const isSelected =
        selectedPDF &&
        id === Object.keys(pdfData).find((key) => pdfData[key] === selectedPDF);

      return (
        <PdfItem
          key={id}
          id={id}
          data={data}
          openPdfId={openPdfId}
          setOpenPdfId={setOpenPdfId}
          isSelected={!!isSelected}
          handlePdfSelect={handlePdfSelect}
          selectedChunk={selectedChunk}
          isDocumentLoaded={isDocumentLoaded}
          handleChunkSelect={handleChunkSelect}
          selectedPDF={selectedPDF}
        />
      );
    });
  }, [
    pdfData,
    openPdfId,
    selectedPDF,
    selectedChunk,
    isDocumentLoaded,
    handlePdfSelect,
    handleChunkSelect,
    setOpenPdfId,
  ]);

  return (
    <div className="py-4">
      <h3 className="px-4 text-xs uppercase text-blue-400 font-semibold mb-3 tracking-wider">
        YOUR PDFs
      </h3>
      <div className="space-y-1">{pdfList}</div>
    </div>
  );
};

export default PdfList;
