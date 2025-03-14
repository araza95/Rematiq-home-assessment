import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Import the component under test
import PdfViewer from "../pages/PdfViewerPage";

// Minimal mocks for required hooks
vi.mock("../store/pdf-store", () => ({
  usePDFStore: () => ({
    selectedPDF: undefined,
    selectedChunk: undefined,
    isDocumentLoaded: false,
    setSelectedPDF: vi.fn(),
    selectChunk: vi.fn(),
    clearSelection: vi.fn(),
    setDocumentLoaded: vi.fn(),
  }),
}));

vi.mock("../hooks/use-pdf-viewer", () => ({
  usePdfViewer: () => ({
    selectedPDF: undefined,
    CurrentPageLabel: () => <div>Page Label Mock</div>,
    plugins: [],
    handleDocumentLoad: vi.fn(),
    setRenderRange: vi.fn(),
  }),
}));

describe("PdfViewer Component", () => {
  it('shows "Select a PDF to view" if no PDF is selected', () => {
    render(<PdfViewer />);
    expect(screen.getByText(/Select a PDF to view/i)).toBeTruthy();
  });
});
