// React Imports
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// Store Imports
import { usePDFStore } from "../../store/pdf-store";
import { useSidebarStore } from "../../store/sidebar-store";

// Util Imports
import { cn } from "../../utils/tailwind-cn";

// React Icon Imports
import { ChevronDown } from "lucide-react";
import { FaAngleDoubleLeft } from "react-icons/fa";

// Component Imports
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import PrimaryButton from "../UI/Buttons/primary-button";

// Constants & Custom Hook Imports
import { PDF_LISTS_PATH } from "../../constants";
import usePdfFetch from "../../hooks/use-fetch";
import { useDimension } from "../../hooks/useWindow";
import { PDFChunk, PDFData, PDFDatum } from "../../types/pdf-response";
import { Tooltip } from "../Tooltip";
interface ISidebarProps {
  className?: string;
}

/**
 * @description Sidebar Component - This component is responsible for the layout of the sidebar.
 *
 * @param className - The className for the sidebar
 *
 * @returns Sidebar Component
 */
const Sidebar: FunctionComponent<ISidebarProps> = () => {
  // Track which PDF is expanded
  const [openPdfId, setOpenPdfId] = useState<string | null>(null);

  // Global Store Hooks
  const { isCollapsed, toggleSidebar, autoCollapse } = useSidebarStore();
  const {
    setSelectedPDF,
    selectChunk,
    selectedChunk,
    selectedPDF,
    isDocumentLoaded,
  } = usePDFStore();

  // Custom Hooks
  const { data: pdfData } = usePdfFetch<PDFData>({
    url: PDF_LISTS_PATH,
  });

  const { width } = useDimension();

  // Handle PDF selection and toggle expansion
  const handlePdfSelect = useCallback(
    (
      id: string,

      data: PDFDatum
    ) => {
      setSelectedPDF(data);
      setOpenPdfId((prevId) => (prevId === id ? null : id));
    },
    [setSelectedPDF]
  );

  // Handle chunk selection with memoized callback
  const handleChunkSelect = useCallback(
    (chunk: PDFChunk) => {
      if (!isDocumentLoaded) return;

      selectChunk(chunk);
    },
    [selectChunk, isDocumentLoaded]
  );

  // Memoize PDF list rendering to prevent unnecessary rerenders
  const pdfList = useMemo(() => {
    if (!pdfData || Object.entries(pdfData).length === 0) return null;

    return Object.entries(pdfData).map(([id, data]) => {
      const isSelected =
        selectedPDF &&
        id === Object.keys(pdfData).find((key) => pdfData[key] === selectedPDF);

      return (
        <Collapsible
          key={id}
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
                  <Tooltip
                    key={index}
                    content={
                      isDisabled ? "Document is processing, please wait" : ""
                    }
                    show={isDisabled}
                  >
                    <button
                      key={index}
                      className={cn(
                        "cursor-pointer w-full text-left py-2 px-3 text-xs",
                        "transition-all duration-200 rounded-md",
                        "hover:bg-gray-700/60 hover:shadow-inner",
                        isChunkSelected
                          ? "bg-emerald-500/20 text-emerald-200 font-medium"
                          : "text-slate-300 hover:text-blue-200"
                      )}
                      onClick={() => handleChunkSelect(chunk)}
                    >
                      <div className="truncate">
                        {chunk.content.substring(0, 50)}...
                      </div>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    });
  }, [
    pdfData,
    openPdfId,
    selectedPDF,
    selectedChunk,
    handlePdfSelect,
    handleChunkSelect,
  ]);

  // Automatically collapse sidebar on small screens
  useEffect(() => {
    if (width < 768) {
      autoCollapse(true); // Collapse sidebar on small screens
    } else {
      autoCollapse(false); // Expand sidebar on larger screens
    }
  }, [autoCollapse, width]);

  // Sidebar animation classes
  const sidebarClasses = useMemo(
    () =>
      cn(
        "flex flex-col transition-all duration-500 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100",
        "border-r border-gray-700 shadow-lg",
        isCollapsed
          ? "w-0 opacity-0 overflow-hidden"
          : "w-64 opacity-100 md:w-72 md:opacity-100"
      ),
    [isCollapsed]
  );

  return (
    <aside className={sidebarClasses}>
      {/* Logo and Toggle Button */}
      <div className="h-[7dvh] flex justify-between items-center border-b border-gray-700 p-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <h1 className="text-2xl font-bold text-blue-300 transition-all duration-300 hover:text-blue-200 ">
          Rematiq
        </h1>
        {!isCollapsed && (
          <PrimaryButton
            onClick={toggleSidebar}
            aria-label="Collapse Sidebar"
            type="button"
            className="bg-transparent cursor-pointer hover:bg-slate-900!"
            text=""
          >
            <FaAngleDoubleLeft className="text-lg" />
          </PrimaryButton>
        )}
      </div>

      {/* Uploaded PDFs */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent p-2">
        {pdfData && Object.entries(pdfData).length > 0 ? (
          <div className="py-4">
            <h3 className="px-4 text-xs uppercase text-blue-400 font-semibold mb-3 tracking-wider">
              YOUR PDFs
            </h3>
            <div className="space-y-1">{pdfList}</div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm italic">No PDFs available</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
