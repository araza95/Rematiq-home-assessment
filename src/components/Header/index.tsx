// React Imports
import { FunctionComponent } from "react";

// Store Imports
import { useSidebarStore } from "../../store/sidebar-store";

// React Icon Imports
import { FaAngleDoubleRight } from "react-icons/fa";

// Component Imports
import PrimaryButton from "../UI/Buttons/primary-button";

const Header: FunctionComponent = () => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <header className="h-[5vh] flex  items-center justify-between border-b border-slate-800 bg-slate-900 px-4 shadow-lg">
      <div className="flex items-center gap-4">
        {isCollapsed && (
          <PrimaryButton
            type="button"
            text=""
            onClick={toggleSidebar}
            aria-label="Expand Sidebar"
            className="cursor-pointer bg-transparent"
          >
            <FaAngleDoubleRight className="text-lg" />
          </PrimaryButton>
        )}
      </div>
      <div className="w-full text-center">
        <h1 className="text-xl font-bold text-blue-300 transition-all duration-300 hover:text-blue-200 ">
          PDF Viewer
        </h1>
      </div>
    </header>
  );
};

export default Header;
