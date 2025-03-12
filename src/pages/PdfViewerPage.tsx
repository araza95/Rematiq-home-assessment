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
import { usePDFStore } from "../store/pdf-store";
// Style Imports
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
// Import styles
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

import { clsx } from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";

import tubeSpinner from "../../assets/svg-icons/tube-spinner.svg";

// Define structure for PDF text content and mapping
interface PdfTextContent {
  originalText: string;
  normalizedText: string;
  normalizedToOriginalMap: number[];
}

const PdfViewer = () => {
  const { selectedPDF, selectedChunk } = usePDFStore();

  const [pdfTextContent, setPdfTextContent] = useState<PdfTextContent>({
    originalText: "",
    normalizedText: "",
    normalizedToOriginalMap: [],
  });

  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { CurrentPageLabel } = pageNavigationPluginInstance;

  // 1. First create the plugin instance unconditionally
  const searchPluginInstance = useRef(
    searchPlugin({
      onHighlightKeyword: (props: OnHighlightKeyword) => {
        props.highlightEle.style.background = "#00FFFF";
        props.highlightEle.style.padding = "5px";
        props.highlightEle.style.mixBlendMode = "multiply";
      },
    })
  ).current;

  // Extract text and build position mapping
  const handleDocumentLoad = async ({ doc }: DocumentLoadEvent) => {
    const pageNumbers = Array.from({ length: doc.numPages }, (_, i) => i + 1);
    const pageContents = await Promise.all(
      pageNumbers.map(async (pageNumber) => {
        const page = await doc.getPage(pageNumber);
        return page.getTextContent();
      })
    );

    let originalText = "";
    const normalizedToOriginalMap: number[] = [];

    pageContents.forEach((page) => {
      page.items.forEach((item) => {
        const text = item.str;
        // 1. Get the offset *before* appending
        const offset = originalText.length;

        // 2. Append text to `originalText`
        originalText += text;

        // 3. Map each non-whitespace character
        for (let i = 0; i < text.length; i++) {
          if (!/\s/.test(text[i])) {
            // Use (offset + i) as the index
            normalizedToOriginalMap.push(offset + i);
          }
        }
      });
    });

    // Create normalized text (without whitespace)
    const normalizedText = originalText.replace(/\s+/g, "");

    setPdfTextContent({
      originalText,
      normalizedText,
      normalizedToOriginalMap,
    });
  };

  // Highlight matching text
  useEffect(() => {
    const highlightMatch = async () => {
      if (!selectedChunk?.content || !pdfTextContent.normalizedText) return;

      // Normalize search query
      const searchNormalized = selectedChunk.content.replace(/\s+/g, "");

      // Find match in normalized text
      const startIndex =
        pdfTextContent.normalizedText.indexOf(searchNormalized);
      if (startIndex === -1) return;

      // Get positions in original text
      const startOriginal = pdfTextContent.normalizedToOriginalMap[startIndex];
      const endOriginal =
        pdfTextContent.normalizedToOriginalMap[
          startIndex + searchNormalized.length - 1
        ];

      // Extract exact match from original text
      const exactMatch = pdfTextContent.originalText.substring(
        startOriginal,
        endOriginal + 1
      );

      // Highlight the match
      searchPluginInstance.clearHighlights();
      const matches = await searchPluginInstance.highlight(exactMatch);
      if (matches.length > 0) {
        searchPluginInstance.jumpToMatch(0);
      }
    };

    highlightMatch();
  }, [selectedChunk, pdfTextContent, searchPluginInstance]);
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
        <div
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
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

export const PdfLoadProgress = ({ progress }: { progress: number }) => {
  return (
    <div className="box-wrapper">
      <div className="w-full h-full flex justify-center items-center gap-4">
        <div className="max-w-[400px] w-full h-full flex flex-col items-center justify-center gap-[16px]">
          <div className="w-[60px] h-[60px] flex items-center justify-center flex-shrink-0">
            <img
              src={tubeSpinner}
              alt="Loader..."
              className="w-[60px] h-[60px]"
            />
            {/* Add a progress indicator using tailwind css and add animation as per progress */}
            <div
              style={{ width: `${progress}%` }}
              className={clsx(
                "pdf-reading-indicator",
                "w-[100%] h-[31px] bg-[#ffffff] dark:bg-button-bg-dark rounded-[8px] px-[16px] py-[12px] mb-[10px]"
              )}
            />
          </div>
          {/* <div className="w-full flex items-center justify-center flex-shrink-0">
            {fileName}
          </div> */}
          {/* <div className="w-full flex items-center justify-center flex-shrink-0 animate-pulse">
            <div
              className={clsx(
                "pdf-reading-indicator",
                "w-[100%] h-[31px] bg-[#ffffff] dark:bg-button-bg-dark rounded-[8px] px-[16px] py-[12px] mb-[10px]"
              )}
            >
              <div className={clsx("ribbon-box", "w-full h-auto relative")}>
                <div
                  className={clsx("ribbon-progress", "w-full absolute left-0 ")}
                >
                  <div
                    className={clsx(
                      "ribbon-progress-bg",
                      "h-[6px] bg-[#F2F2F2] dark:bg-button-bg-dark rounded-[8px]"
                    )}
                  >
                    <div
                      style={{ width: `${progress}%` }}
                      className={clsx(
                        "ribbon-progress-indicator",
                        "min-w-[6px] max-w-[100%] rounded-[50px] bg-[#15B79E]",
                        "border-[1px]",
                        "border-[#15b79e] h-full transition-[width_750ms_linear]"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
