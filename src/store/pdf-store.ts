// Zustand Import
import { create } from "zustand";

// Type Imports
import { PDFChunk, PDFDatum } from "../types/pdf-response";

export type initialState = {
  // Core State
  selectedPDF: PDFDatum | undefined;
  selectedChunk: PDFChunk | undefined;
  isDocumentLoaded: boolean;

  // Actions
  setSelectedPDF: (pdf: PDFDatum) => void;
  selectChunk: (content: PDFChunk) => void;
  clearSelection: () => void;
  setDocumentLoaded: (isLoaded: boolean) => void;
};

export const usePDFStore = create<initialState>()((set) => ({
  selectedPDF: undefined,
  selectedChunk: undefined,

  setSelectedPDF: (pdf) =>
    set({
      selectedPDF: pdf,
      selectedChunk: undefined,
    }),

  selectChunk: (content) => set({ selectedChunk: content }),

  clearSelection: () =>
    set({
      selectedPDF: undefined,
      selectedChunk: undefined,
    }),

  isDocumentLoaded: false,
  setDocumentLoaded: (isLoaded) => set({ isDocumentLoaded: isLoaded }),
}));
