// React Imports
import { FunctionComponent } from "react";

// Store Imports
import { useSidebarStore } from "../../store/sidebar-store";

// React Icon Imports
import { GoSidebarCollapse } from "react-icons/go";

// Component Imports
import PrimaryButton from "../UI/Buttons/primary-button";

const Header: FunctionComponent = () => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <header className="h-[5dvh] shadow-2xl flex items-center px-4 border-b">
      <div className="flex items-center gap-4">
        {isCollapsed && (
          <PrimaryButton
            type="button"
            text=""
            onClick={toggleSidebar}
            aria-label="Expand Sidebar"
            className=""
          >
            <GoSidebarCollapse className="text-xl" />
          </PrimaryButton>
        )}
        <h1 className="text-2xl font-bold">Header</h1>
      </div>
    </header>
  );
};

export default Header;
