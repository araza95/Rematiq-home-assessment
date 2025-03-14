// React Imports
import { JSX, lazy, Suspense } from "react";

// React Router Imports
import { BrowserRouter, Route, Routes } from "react-router";

// Layout Imports
import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";
import SuspenseAppLoader from "../components/Loaders/SuspenseAppLoader";

// Lazily load the PdfViewer component
const PdfViewer = lazy(() => import("../pages/PdfViewerPage"));
const LoginPage = lazy(() => import("../pages/Login"));

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
          <Route
            path="/login"
            element={
              <Suspense fallback={<SuspenseAppLoader />}>
                <LoginPage />
              </Suspense>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<SuspenseAppLoader />}>
                <PdfViewer />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
