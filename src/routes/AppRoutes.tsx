// React Imports
import { JSX } from "react";

// React Router Imports
import { BrowserRouter, Route, Routes } from "react-router";

// Page Imports
import Login from "../pages/Login";
import PdfViewer from "../pages/PdfViewerPage";

// Layout Imports
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";

/**
 * @description This component defines the routing structure for the application using React Router.
 * It sets up both public and protected routes, each with their respective layouts.
 * This will render the appropriate component based on the current URL. The router is wrapped in a BrowserRouter component.
 * The children are rendered using react-router `<Outlet/>` component.
 *
 * @component AppRoutes
 *
 * @returns {JSX.Element} Returns a JSX element containing the BrowserRouter and Routes components with defined paths and their corresponding components.
 *
 * @example
 */
const AppRoutes = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Layouts */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<PdfViewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
