// React Imports
import { FunctionComponent, useEffect } from "react";

// Store Imports
import { useSidebarStore } from "../../store/sidebar-store";

// Util Imports
import { cn } from "../../utils/tailwind-cn";

// React Icon Imports
import { GoSidebarExpand } from "react-icons/go";

// Component Imports
import PrimaryButton from "../UI/Buttons/primary-button";

// Custom Hook Imports
import { useDimension } from "../../hooks/useWindow";

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
  const { isCollapsed, toggleSidebar, autoCollapse } = useSidebarStore();

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
        <h1 className="text-2xl font-bold">Logo</h1>
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
        {["PDF 1", "PDF 2", "PDF 3", "PDF 4", "PDF 5"].map((pdf, index) => (
          <div
            key={index}
            className="p-4 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <p>{pdf}</p>
          </div>
        ))}
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
