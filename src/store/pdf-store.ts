// Zustand Import
import { create } from "zustand";

// Type Imports
import { PDFData } from "../types/pdf-response";

type PDFState = {
  selectedPDF: string | null;
  selectedChunk: string | null;
  pdfData: Record<string, PDFData> | null;
  setSelectedPDF: (id: string | null) => void;
  setSelectedChunk: (chunk: string | null) => void;
  setPDFData: (data: Record<string, PDFData>) => void;
};

export const usePDFStore = create<PDFState>((set) => ({
  selectedPDF: null,
  selectedChunk: null,
  pdfData: null,
  setSelectedPDF: (id) => set({ selectedPDF: id, selectedChunk: null }),
  setSelectedChunk: (chunk) => set({ selectedChunk: chunk }),
  setPDFData: (data) => set({ pdfData: data }),
}));
