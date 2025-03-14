// SidebarHeader.tsx
import { FunctionComponent } from "react";
import { FaAngleDoubleLeft } from "react-icons/fa";
import PrimaryButton from "../UI/Buttons/primary-button";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: FunctionComponent<SidebarHeaderProps> = ({
  isCollapsed,
  toggleSidebar,
}) => {
  return (
    <div className="h-[7dvh] flex justify-between items-center border-b border-gray-700 p-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <h1 className="text-2xl font-bold text-blue-300 transition-all duration-300 hover:text-blue-200">
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
  );
};

export default SidebarHeader;
