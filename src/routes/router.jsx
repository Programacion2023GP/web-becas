import { createBrowserRouter, useRoutes } from "react-router-dom";

// routes
import MainRoutes from "./MainRoutes";

// ====================|| AUTHENTICATION ROUTING ||===================== //
import { lazy } from "react";

// project imports
import Loadable from "../ui-component/Loadable";
import MinimalLayout from "../layout/MinimalLayout";
import NotFound from "../views/NotFound";
import MainLayout from "../layout/MainLayout";
import RequestBecaContextProvider from "../context/RequestBecaContext";
import RequestListView from "../views/Request/RequestListView/RequestListView";

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import("../views/authentication/Login")));
const AuthRegister = Loadable(lazy(() => import("../views/authentication/Register")));
// ====================|| AUTHENTICATION ROUTING ||===================== //

export const router = createBrowserRouter([
   {
      path: "/",
      element: <MinimalLayout />,
      errorElement: <NotFound />,
      children: [
         {
            index: true,
            path: "/",
            element: <AuthLogin />
         },
         {
            index: true,
            path: "login",
            element: <AuthLogin />
         },
         {
            path: "register",
            element: <AuthRegister />
         },
         MainRoutes,
         {
            path: "solicitudes",
            element: <MainLayout />,
            children: [
               {
                  index: true,
                  // path: "/",
                  element: (
                     <RequestBecaContextProvider>
                        <RequestListView />
                     </RequestBecaContextProvider>
                  )
               }
            ]
         }
      ]
   }
]);
