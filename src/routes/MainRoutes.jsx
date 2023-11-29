import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import SchoolsView from "../views/admin/SchoolsView/SchoolsView";
import LevelsView from "../views/admin/LevelsView";
import SchoolContextProvider from "../context/SchoolContext";
import LevelContextProvider from "../context/LevelContext";
import PerimetersView from "../views/admin/PerimetersView";
import PerimeterContextProvider from "../context/PerimeterContext";
import RequestBecaView from "../views/admin/RequestBecaView";
import DisabilitiesView from "../views/admin/DisabilitiesView";
import DisabilityContextProvider from "../context/DisabilityContext";
import RequestBecaContextProvider from "../context/RequestBecaContext";
import StudentContextProvider from "../context/StudentContext";
import UserContextProvider from "../context/UserContext";
import UsersView from "../views/admin/UsersView/UsersView";
import RelationshipContextProvider from "../context/RelationshipContext";
import TutorContextProvider from "../context/TutorContext";
import { loaderIndexUsersView } from "../views/admin/UsersView/UsersView";

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard/Default")));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import("../views/utilities/Typography")));
const UtilsColor = Loadable(lazy(() => import("../views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("../views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(lazy(() => import("../views/utilities/MaterialIcons")));
const UtilsTablerIcons = Loadable(lazy(() => import("../views/utilities/TablerIcons")));

// sample page routing
const SamplePage = Loadable(lazy(() => import("../views/sample-page")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
   path: "/admin",
   element: <MainLayout />,
   children: [
      {
         index: true,
         element: <DashboardDefault />
      },
      // {
      //    path: "dashboard",
      //    element: <DashboardDefault />
      // },
      {
         path: "solicitud-beca/:folio?",
         element: (
            <RequestBecaContextProvider>
               <StudentContextProvider>
                  <DisabilityContextProvider>
                     <SchoolContextProvider>
                        <TutorContextProvider>
                           <RelationshipContextProvider>
                              <RequestBecaView />
                           </RelationshipContextProvider>
                        </TutorContextProvider>
                     </SchoolContextProvider>
                  </DisabilityContextProvider>
               </StudentContextProvider>
            </RequestBecaContextProvider>
         )
      },
      {
         path: "usuarios",
         element: (
            <UserContextProvider>
               <UsersView />
            </UserContextProvider>
         ),
         loader: loaderIndexUsersView
      },
      {
         path: "catalogos",
         children: [
            {
               path: "escuelas",
               element: (
                  <SchoolContextProvider>
                     <SchoolsView />
                  </SchoolContextProvider>
               )
            },
            {
               path: "niveles",
               element: (
                  <LevelContextProvider>
                     <LevelsView />
                  </LevelContextProvider>
               )
            },
            {
               path: "perimetros",
               element: (
                  <PerimeterContextProvider>
                     <PerimetersView />
                  </PerimeterContextProvider>
               )
            },
            {
               path: "discapacidades",
               element: (
                  <DisabilityContextProvider>
                     <DisabilitiesView />
                  </DisabilityContextProvider>
               )
            }
         ]
      },

      {
         path: "utils",
         children: [
            {
               path: "util-typography",
               element: <UtilsTypography />
            },
            {
               path: "util-color",
               element: <UtilsColor />
            },
            {
               path: "util-shadow",
               element: <UtilsShadow />
            }
         ]
      },
      {
         path: "icons",
         children: [
            {
               path: "tabler-icons",
               element: <UtilsTablerIcons />
            },
            {
               path: "material-icons",
               element: <UtilsMaterialIcons />
            }
         ]
      },
      {
         path: "sample-page",
         element: <SamplePage />
      }
   ]
};

export default MainRoutes;
