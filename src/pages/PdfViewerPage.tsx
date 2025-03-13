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
      originalContent: string;
      normalizedContent: string;
      normalizedToOriginalMap: number[];
    }[]
  >([]);

  // Initialize plugins
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { CurrentPageLabel } = pageNavigationPluginInstance;

  const searchPluginInstance = useRef(
    searchPlugin({
      onHighlightKeyword: (props: OnHighlightKeyword) => {
        props.highlightEle.style.background = "#00FFFF";
        props.highlightEle.style.padding = "2px";
        props.highlightEle.style.mixBlendMode = "multiply";
      },
    })
  ).current;

  /**
   * Handles the PDF document load event. Extracts text from the PDF and builds the mapping.
   *
   * @param event - The document load event containing the PDF document.
   */

  // Document load handler
  const handleDocumentLoad = async ({ doc }: DocumentLoadEvent) => {
    const data = [];
    const numPages = doc.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();

      let originalText = "";
      const normalizedMap: number[] = [];

      content.items.forEach((item) => {
        const text = item.str;
        const offset = originalText.length;
        originalText += text;

        // Build normalized mapping
        for (let i = 0; i < text.length; i++) {
          if (!/\s/.test(text[i])) {
            normalizedMap.push(offset + i);
          }
        }
      });

      const normalizedText = originalText.replace(/\s+/g, "");

      data.push({
        pageNumber: pageNum,
        originalContent: originalText,
        normalizedContent: normalizedText,
        normalizedToOriginalMap: normalizedMap,
      });
    }

    setPdfLocalData(data);
    setIsDocumentLoaded(true);
  };

  useEffect(() => {
    const highlightMatch = async () => {
      if (!isDocumentLoaded || !selectedChunk) return;

      console.log(
        "🚀 ~ highlightMatch ~ selectedChunk?.content:",
        pdfLocalData
      );
      let remaining = "";
      const result = [];
      for (const page of selectedChunk.pageRange) {
        const targetPage = page;
        const pageData = pdfLocalData.find((p) => p.pageNumber === targetPage);

        console.log("logsss", targetPage, pageData);

        if (!pageData) return;

        // Prepare search content
        let searchContent = selectedChunk.content.replace(/\s+/g, "");
        let startIndex = -1;
        if (remaining.length) {
          startIndex = pageData.normalizedContent.indexOf(remaining);
          searchContent = remaining;
        } else {
          startIndex = pageData.normalizedContent.indexOf(searchContent);
        }
        if (startIndex === -1 && selectedChunk.pageRange.length > 1) {
          // Not matched might be split in two pages
          let matched = searchContent[0];
          let i = 0;
          for (i = 0; i < searchContent.length; i++) {
            const found = pageData.normalizedContent.indexOf(matched);
            if (found != -1) matched += searchContent[i + 1];
            else break;
          }
          remaining = searchContent.slice(i);
          console.log("remaining", remaining);
          console.log("matched", matched);
          matched = matched.slice(0, matched.length - 1);
          searchContent = matched;
          startIndex = pageData.normalizedContent.indexOf(matched);
          // startIndex = 1167
          console.log("startIndex", startIndex);
          if (startIndex === -1) return;
          console.log("searchContent", searchContent, searchContent.length);
          console.warn("Text not found on target page");
          // return;
        }

        // Calculate original positions
        const startOriginal = pageData.normalizedToOriginalMap[startIndex];
        // console.log('startOriginal', startOriginal)
        const endOriginal =
          pageData.normalizedToOriginalMap[
            startIndex + searchContent.length - 1
          ];

        // Extract exact match from original text
        const exactMatch = pageData.originalContent.substring(
          startOriginal,
          endOriginal + 1
        );
        result.push(exactMatch);
        console.log("inner  exact match", exactMatch);
        // console.log("inner ", startIndex, endOriginal);
      }

      // Perform highlight
      searchPluginInstance.clearHighlights();
      const matches = await searchPluginInstance.highlight(result);
      if (matches.length > 0) {
        searchPluginInstance.jumpToMatch(0);
      }
    };

    highlightMatch();
  }, [selectedChunk, searchPluginInstance, pdfLocalData, isDocumentLoaded]);

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
