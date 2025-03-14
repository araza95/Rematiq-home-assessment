// PdfItem.tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { FunctionComponent } from "react";
import { PDFChunk, PDFDatum } from "../../types/pdf-response";
import { cn } from "../../lib/utils";
import ChunkItem from "./ChunkItem";

interface PdfItemProps {
  id: string;
  data: PDFDatum;
  openPdfId: string | null;
  setOpenPdfId: (id: string | null) => void;
  isSelected: boolean;
  handlePdfSelect: (id: string, data: PDFDatum) => void;
  selectedChunk: PDFChunk | undefined;
  isDocumentLoaded: boolean;
  handleChunkSelect: (chunk: PDFChunk) => void;
  selectedPDF: PDFDatum | undefined;
}

const PdfItem: FunctionComponent<PdfItemProps> = ({
  id,
  data,
  openPdfId,
  setOpenPdfId,
  isSelected,
  handlePdfSelect,
  selectedChunk,
  isDocumentLoaded,
  handleChunkSelect,
  selectedPDF,
}) => {
  return (
    <Collapsible
      className="group w-full mb-2"
      open={openPdfId === id}
      onOpenChange={(open) => {
        if (open) setOpenPdfId(id);
        else setOpenPdfId(null);
      }}
    >
      <CollapsibleTrigger
        onClick={() => handlePdfSelect(id, data)}
        className={cn(
          "cursor-pointer flex items-center justify-between w-full px-4 py-3",
          "text-sm font-medium transition-all duration-300 rounded-lg",
          "hover:bg-gray-700/50 group-hover:shadow-md",
          isSelected
            ? "bg-blue-500/20 text-blue-50 font-semibold"
            : "text-slate-200 hover:text-white"
        )}
      >
        <span className="truncate">{id}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300 ease-out",
            openPdfId === id ? "rotate-180 text-blue-300" : "text-gray-400"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
        <div className="pl-6 pr-4 py-2 space-y-1.5 border-l border-blue-500/30 ml-4 mt-1">
          {data.chunks.map((chunk, index: number) => {
            const isChunkSelected =
              selectedChunk && chunk.content === selectedChunk.content;
            const isDisabled = !isDocumentLoaded && selectedPDF === data;
            return (
              <ChunkItem
                key={index}
                chunk={chunk}
                isChunkSelected={!!isChunkSelected}
                isDisabled={isDisabled}
                onClick={() => handleChunkSelect(chunk)}
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PdfItem;
