// React Imports
import { FunctionComponent } from "react";

// React Router Imports
import { Outlet } from "react-router";

// Component Imports
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

/**
 * @description Protected Layout Component- This component is responsible for the layout of the protected routes.
 * This component wraps the routes that are protected, providing the layout for the header and sidebar.
 * Outlet is used to render the child routes, this comes from react-router-dom.
 *
 * @returns ProtectedLayout
 *
 * @example
 * <ProtectedLayout />
 */
const ProtectedLayout: FunctionComponent = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="h-[] flex-1 overflow-auto bg-gradient-to-b from-slate-900 to-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
