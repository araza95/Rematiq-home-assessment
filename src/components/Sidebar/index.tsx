// React Imports
import { FunctionComponent, useEffect } from "react";

// Store Imports
import { useSidebarStore } from "../../store/sidebar-store";

// Util Imports
import { cn } from "../../utils/tailwind-cn";

// React Icon Imports
import { GoSidebarExpand } from "react-icons/go";
import { ChevronDown } from "lucide-react";

// Component Imports
import PrimaryButton from "../UI/Buttons/primary-button";

// Custom Hook Imports
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { PDF_LISTS_PATH } from "../../constants";
import usePdfFetch from "../../hooks/use-fetch";
import { useDimension } from "../../hooks/useWindow";
import { PDFData } from "../../types/pdf-response";
import { usePDFStore } from "../../store/pdf-store";

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
  // Global Store Hooks
  const { isCollapsed, toggleSidebar, autoCollapse } = useSidebarStore();
  const { setSelectedPDF, selectChunk } = usePDFStore();

  // Custom Hooks
  const { data: pdfData } = usePdfFetch<PDFData>({
    url: PDF_LISTS_PATH,
  });

  const { width } = useDimension();

  // Automatically collapse sidebar on small screens
  useEffect(() => {
    if (width < 768) {
      autoCollapse(true); // Collapse sidebar on small screens
    } else {
      autoCollapse(false); // Expand sidebar on larger screens
    }
  }, [autoCollapse, width]);

  return (
    <aside
      className={cn(
        "flex flex-col transition-all duration-500 bg-primary text-primary-text border-r border-gray-700",
        isCollapsed
          ? "w-0 opacity-0 overflow-hidden"
          : "w-64 opacity-100 md:w-64 md:opacity-100"
      )}
    >
      {/* Logo and Toggle Button */}
      <div className="flex justify-between items-center h-[5dvh] border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold ">Rematiq</h1>
        {!isCollapsed && (
          <PrimaryButton
            onClick={toggleSidebar}
            aria-label="Collapse Sidebar"
            type="button"
            className="p-2"
            text=""
          >
            <GoSidebarExpand />
          </PrimaryButton>
        )}
      </div>

      {/* Uploaded PDFs */}
      <div className="flex-1 overflow-y-auto">
        {pdfData && Object.entries(pdfData).length > 0 && (
          <div className="py-4">
            <h3 className="px-4 text-xs uppercase text-blue-300 font-semibold mb-2">
              YOUR PDFs
            </h3>
            {Object.entries(pdfData).map(([id, data]) => (
              <Collapsible key={id} className="group w-full mb-1">
                <CollapsibleTrigger
                  onClick={() => setSelectedPDF(data)}
                  className="cursor-pointer flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-gray-700/50 transition-colors duration-200 rounded-md"
                >
                  <span className="truncate">{id}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <div className="pl-6 pr-4 py-2 space-y-1.5 border-l border-gray-700 ml-4 mt-1">
                    {data.chunks.map((chunk, index) => (
                      <button
                        key={index}
                        className="cursor-pointer w-full text-left py-1.5 px-2 text-xs text-emerald-900 hover:text-blue-300 hover:bg-gray-800/40 transition-colors duration-200 rounded truncate"
                        onClick={() => selectChunk(chunk)}
                      >
                        {chunk.content.substring(0, 50)}...
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
