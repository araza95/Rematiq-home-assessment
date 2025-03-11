interface PDFDatum {
  path: string;
  chunks: { content: string; pageRange: [number, number] }[];
}

export type PDFData = Record<string, PDFDatum>;
