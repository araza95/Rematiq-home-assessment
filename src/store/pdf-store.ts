// Zustand Import
import { create } from "zustand";

// Type Imports
import { PDFChunk, PDFDatum } from "../types/pdf-response";

export type initialState = {
  // Core State
  selectedPDF: PDFDatum | undefined;
  selectedChunk: PDFChunk | undefined;

  // Actions
  setSelectedPDF: (pdf: PDFDatum) => void;
  selectChunk: (content: PDFChunk) => void;
  clearSelection: () => void;
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
}));

// export type initialState = {
//   // Derived State
//   selectedPDF: PDFDatum | undefined;
//   selectedChunkContent: string | undefined;
//   setSelectedPDF: (pdf: PDFDatum) => void;

//   // Actions
//   getSelectedPDF: () => PDFDatum | undefined;
//   selectPDF: (pdf: PDFDatum) => void;
//   selectChunk: (content: string) => void;
//   clearSelection: () => void;
// };

// export const usePDFStore = create<initialState>()((set, get) => ({
//   selectedPDF: undefined,
//   selectedChunkContent: undefined,

//   setSelectedPDF: (pdf) => set({ selectedPDF: pdf }),

//   getSelectedPDF: () => get().selectedPDF,
//   selectPDF: (pdf: PDFDatum) => set({ selectedPDF: pdf }),
// }));
// export const usePDFStore = create<PDFState>()((set, get) => ({
//   pdfData: null,
//   selectedPDFId: null,
//   selectedChunkContent: null,

//   // Getters for derived state
//   get selectedPDF() {
//     return get().pdfData?.[get().selectedPDFId ?? ""];
//   },
//   get selectedChunk() {
//     return get().selectedPDF?.chunks.find(
//       (chunk) => chunk.content === get().selectedChunkContent
//     );
//   },

//   // Mutations
//   loadPDFData: (data) => set({ pdfData: data }),
//   selectPDF: (id) =>
//     set({
//       selectedPDFId: id,
//       selectedChunkContent: null, // Reset chunk on PDF change
//     }),
//   selectChunk: (content) => set({ selectedChunkContent: content }),
// }));
