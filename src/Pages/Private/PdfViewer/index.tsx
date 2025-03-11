// React Imports
import { Fragment } from "react";
import { useSearchParams } from "react-router";

interface IPdfViewerProps {}

const PdfViewer: React.FunctionComponent<IPdfViewerProps> = () => {
  const [searchParams] = useSearchParams();

  const pdfId = searchParams.get("id");
  return <Fragment>{pdfId}</Fragment>;
};

export default PdfViewer;
