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
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-primary text-primary-text">
        <Header />
        <main className="h-[95dvh] flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
