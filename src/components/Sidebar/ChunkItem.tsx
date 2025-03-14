// ChunkItem.tsx
import { FunctionComponent } from "react";
import { PDFChunk } from "../../types/pdf-response";
import { cn } from "../../utils/tailwind-cn";
import { Tooltip } from "../Tooltip";

interface ChunkItemProps {
  chunk: PDFChunk;
  isChunkSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const ChunkItem: FunctionComponent<ChunkItemProps> = ({
  chunk,
  isChunkSelected,
  isDisabled,
  onClick,
}) => {
  return (
    <Tooltip
      content={isDisabled ? "Document is processing, please wait" : ""}
      show={isDisabled}
    >
      <button
        className={cn(
          "cursor-pointer w-full text-left py-2 px-3 text-xs",
          "transition-all duration-200 rounded-md",
          "hover:bg-gray-700/60 hover:shadow-inner",
          isChunkSelected
            ? "bg-emerald-500/20 text-emerald-200 font-medium"
            : "text-slate-300 hover:text-blue-200"
        )}
        onClick={onClick}
      >
        <div className="truncate">{chunk.content.substring(0, 50)}...</div>
      </button>
    </Tooltip>
  );
};

export default ChunkItem;
