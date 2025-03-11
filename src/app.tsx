import ReactDOM from "react-dom/client";
import { StrictMode, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import classes from "./app.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

import "./mvp.css";

interface PDFDatum {
  path: string;
  chunks: { content: string; pageRange: [number, number] }[];
}

type PDFData = Record<string, PDFDatum>;

function usePDFData() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<PDFData>();

  useEffect(() => {
    const inner = async () => {
      setLoading(true);

      const resp = await fetch("/assets/data.json");

      setData(await resp.json());
    };

    inner()
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Something went wrong");
        }

        setLoading(false);
      });
  }, []);

  return {
    loading,
    error,
    data,
  };
}

function App() {
  const { loading, error, data } = usePDFData();
  console.log("🚀 ~ App ~ data:", data);

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        {loading && "Loading..."}
        {!loading && error && error}
        {!loading &&
          data &&
          Object.keys(data).map((key) => {
            return <div key={key}>{key}</div>;
          })}
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
