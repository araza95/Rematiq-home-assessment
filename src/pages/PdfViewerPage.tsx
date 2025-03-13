import {
  DocumentLoadEvent,
  ScrollMode,
  SpecialZoomLevel,
  Viewer,
  ViewMode,
  VisiblePagesRange,
  Worker,
} from "@react-pdf-viewer/core";
import type { RenderCurrentPageLabelProps } from "@react-pdf-viewer/page-navigation";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { OnHighlightKeyword, searchPlugin } from "@react-pdf-viewer/search";
import {
  Fragment,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePDFStore } from "../store/pdf-store";

// Style Imports
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";

import { PdfLoadProgress } from "../components/Loaders/PDFLoader";
import { extractPdfTextContent } from "../utils/helpers/extract-pdf-text-content";

/**
 * Interface representing the extracted PDF text content and mapping.
 */
export interface PdfTextContentData {
  originalText: string;
  normalizedText: string;
  normalizedToOriginalMap: number[];
}

/**
 * PdfViewer component displays a PDF document, extracts its text,
 * and highlights a user-selected chunk that may span multiple pages.
 */
const PdfViewer: FunctionComponent = () => {
  const { selectedPDF, selectedChunk } = usePDFStore();

  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

  const [pdfLocalData, setPdfLocalData] = useState<
    {
      pageNumber: number;
      normalizedToOriginalMap: number[];
      content: string;
    }[]
  >([]);
  console.log("🚀 ~ pdfLocalData:", pdfLocalData);

  const [pdfTextContent, setPdfTextContent] = useState<PdfTextContentData>({
    originalText: "",
    normalizedText: "",
    normalizedToOriginalMap: [],
  });

  // Initialize the page navigation plugin.
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { CurrentPageLabel } = pageNavigationPluginInstance;

  // Create the search plugin instance once.
  const searchPluginInstance = useRef(
    searchPlugin({
      onHighlightKeyword: (props: OnHighlightKeyword) => {
        props.highlightEle.style.background = "#00FFFF";
        props.highlightEle.style.padding = "5px";
        props.highlightEle.style.mixBlendMode = "multiply";
      },
    })
  ).current;

  /**
   * Handles the PDF document load event. Extracts text from the PDF and builds the mapping.
   *
   * @param event - The document load event containing the PDF document.
   */
  const handleDocumentLoad = async ({
    doc,
    file,
  }: DocumentLoadEvent): Promise<void> => {
    const data: {
      pageNumber: number;
      content: string;
      normalizedToOriginalMap: number[];
    }[] = [];

    const numPages = doc.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const content = await (await doc.getPage(pageNum)).getTextContent();

      let pageOriginalText = ""; // Text content for this specific page
      const pageNormalizedToOriginalMap: number[] = []; // Map for this specific page

      content.items.forEach((item) => {
        const text = item.str;
        const offset = pageOriginalText.length;
        pageOriginalText += text;

        // Store offsets relative to the beginning of this page's text
        for (let i = 0; i < text.length; i++) {
          if (!/\s/.test(text[i])) {
            pageNormalizedToOriginalMap.push(offset + i);
          }
        }
      });

      // Clean the text by removing potential page number artifacts at the beginning
      // This regex looks for a number (potentially the page number) at the start of the text
      // and removes it if found
      const normalizedText = pageOriginalText;

      data.push({
        pageNumber: pageNum,
        content: normalizedText,
        normalizedToOriginalMap: pageNormalizedToOriginalMap,
      });
    }

    setPdfLocalData(data);

    setIsDocumentLoaded(true);

    const extractedContent = await extractPdfTextContent({ doc: doc, file });
    setPdfTextContent(extractedContent);
  };

  // Trigger highlighting when the selected text chunk or PDF text content changes.
  useEffect(() => {
    const highlightMatch = async () => {
      if (!isDocumentLoaded) return;

      if (!selectedChunk?.content || !pdfTextContent.normalizedText) return;
      console.log(
        "🚀 ~ highlightMatch ~ selectedChunk?.content:",
        pdfLocalData
      );

      const found = pdfLocalData.find(
        (item) => item.pageNumber === selectedChunk.pageRange[0]
      );

      if (!found) return;

      const formatSelectedContent = selectedChunk.content
        .replace(/^\s*\d+\s*/, "")
        .replace(/\s+/g, "");

      console.log(
        "found a match",
        found ? found.content.includes(formatSelectedContent) : false
      );

      const startIndex = found?.content.indexOf(formatSelectedContent);

      console.log("🚀 ~ highlightMatch ~ found?.content:", found?.content);
      console.log(
        "🚀 ~ highlightMatch ~ pdf text:",
        pdfTextContent.originalText
      );

      if (!startIndex) return;

      const startOriginal = found.normalizedToOriginalMap[startIndex];

      const endOriginal =
        found.normalizedToOriginalMap[
          startIndex + formatSelectedContent.length - 1
        ];

      // Extract the exact matching substring from the original text.
      const exactMatch = found.content.substring(
        startOriginal,
        endOriginal + 1
      );

      console.log("inner  exact match", exactMatch);
      console.log("inner ", startIndex, endOriginal);

      // searchPluginInstance.clearHighlights();

      const match = await searchPluginInstance.highlight(exactMatch);
      if (match.length > 0) {
        searchPluginInstance.jumpToMatch(0);
      }
      console.log("🚀 ~ highlightMatch ~ match:", match);

      // await highlightMatchingText({
      //   searchPluginInstance,
      //   pdfTextContent,
      //   selectedText: selectedChunk.content,
      // });
    };
    highlightMatch();
  }, [
    selectedChunk,
    pdfTextContent,
    searchPluginInstance,
    pdfLocalData,
    isDocumentLoaded,
  ]);

  if (!selectedPDF) return <div>Select a PDF to view</div>;

  return (
    <div
      style={{
        border: "1px solid rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#eeeeee",
            borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            padding: "8px",
          }}
        >
          <CurrentPageLabel>
            {(props: RenderCurrentPageLabelProps) => (
              <Fragment>
                {`${props.currentPage + 1} ${
                  props.pageLabel === `${props.currentPage + 1}`
                    ? ""
                    : props.pageLabel
                } of ${props.numberOfPages}`}
              </Fragment>
            )}
          </CurrentPageLabel>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Viewer
            initialPage={0}
            fileUrl={selectedPDF.path}
            plugins={[searchPluginInstance, pageNavigationPluginInstance]}
            enableSmoothScroll
            viewMode={ViewMode.SinglePage}
            defaultScale={SpecialZoomLevel.PageFit}
            scrollMode={ScrollMode.Vertical}
            setRenderRange={({ endPage, startPage }: VisiblePagesRange) => ({
              endPage,
              startPage,
            })}
            renderLoader={(progress) => <PdfLoadProgress progress={progress} />}
            onDocumentLoad={handleDocumentLoad}
          />
        </div>
      </Worker>
    </div>
  );
};

export default PdfViewer;
