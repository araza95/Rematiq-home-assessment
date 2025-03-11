// React Imports
import { FunctionComponent } from "react";

// React Router Imports
import { Outlet } from "react-router";

/**
 * @description Public Layout Component- This component is responsible for the layout of the public routes.
 * This component wraps the routes that are public. No Wrapper is used for the public routes.
 * Outlet is used to render the child routes, this comes from react-router-dom.
 *
 * @returns PublicLayout
 *
 * @example
 * <PublicLayout />
 */
const PublicLayout: FunctionComponent = () => {
  return <div className="flex h-screen w-full">{<Outlet />}</div>;
};

export default PublicLayout;
