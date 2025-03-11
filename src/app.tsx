import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Document, Page, pdfjs } from "react-pdf";
import classes from "./app.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

import useFetch from "./hooks/use-fetch.js";
import "./mvp.css";

interface PDFDatum {
  path: string;
  chunks: { content: string; pageRange: [number, number] }[];
}

type PDFData = Record<string, PDFDatum>;

function App() {
  const { loading, error, data } = useFetch<PDFData>({
    url: "/assets/data.json",
  });

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        {data
          ? Object.keys(data).map((key) => {
              return (
                <div
                  key={key}
                  className="p-4 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  {key}
                </div>
              );
            })
          : null}
      </div>
      <div>
        <Document>
          <Page />
        </Document>
      </div>
    </div>
  );
}

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
