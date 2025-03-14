// src/tests/components/Sidebar.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "./index";

// 1) Mock your custom hook that fetches PDFs
vi.mock("../../hooks/use-fetch.ts", async (importOriginal) => ({
  ...(await importOriginal()),
  default: () => ({
    data: null,
    loading: false,
    error: null,
    setData: vi.fn(),
  }),
}));

// 2) Mock your sidebar-store
vi.mock("../../store/sidebar-store.ts", () => ({
  useSidebarStore: () => ({
    isCollapsed: false,
    toggleSidebar: vi.fn(),
    autoCollapse: vi.fn(),
  }),
}));

// 3) Mock your pdf-store
vi.mock("../../store/pdf-store.ts", () => ({
  usePDFStore: () => ({
    setSelectedPDF: vi.fn(),
    selectChunk: vi.fn(),
    selectedChunk: undefined,
    selectedPDF: undefined,
    isDocumentLoaded: true,
  }),
}));

describe("Sidebar Component", () => {
  it('renders "No PDFs available" when pdfData is empty', () => {
    // Render the component
    render(<Sidebar />);

    // Assert the "No PDFs available" text is in the document
    expect(screen.getByText(/No PDFs available/i)).toBeTruthy();
  });

  it("renders a PDF list when pdfData is present", () => {
    vi.mock("../../hooks/use-fetch.ts", async (importOriginal) => ({
      ...(await importOriginal()),
      usePdfFetch: () => ({
        data: {
          pdf1: {
            path: "pdfs/test.pdf",
            chunks: [
              {
                content: "",
                pageRange: [1, 2],
                isSelected: false,
              },
            ],
          },
        },
        loading: false,
        error: null,
      }),
    }));

    render(<Sidebar />);

    // Assert the PDF list is rendered
    expect(screen.getByText(/PDFs/i)).toBeTruthy();
  });
});
