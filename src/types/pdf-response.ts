export interface PDFChunk {
  content: string;
  pageRange: [number, number];
  isSelected: boolean;
}

export interface PDFDatum {
  path: string;
  chunks: PDFChunk[];
}

export type PDFData = Record<string, PDFDatum>;
