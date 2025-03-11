// React Imports
import { Fragment, FunctionComponent } from "react";

// PDF Viewer Imports
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { useCustomSearchPlugin } from "../plugins/search";
import { SearchPlugin } from "../plugins/search/CustomSearchUI";

// Style Imports
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";

// Asset Imports
import pdf from "../sample.pdf";

// Utility Imports
import { cn } from "../utils/tailwind-cn";

const PdfViewer: FunctionComponent = () => {
  const searchPluginInstance = useCustomSearchPlugin();
  return (
    <Fragment>
      <div className=" h-full bg-primary">
        <div
          className={cn(
            "flex flex-col items-center justify-center p-4 sm:px-6 sm:py-10 lg:px-8 lg:py-5"
          )}
        >
          <SearchPlugin instance={searchPluginInstance} />
        </div>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={pdf} plugins={[searchPluginInstance]} />
        </Worker>
      </div>
    </Fragment>
  );
};

export default PdfViewer;
