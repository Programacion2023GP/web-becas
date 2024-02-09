import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import SchoolsView from "../views/admin/SchoolsView/Index";
import LevelsView from "../views/admin/LevelsView/Index";
import SchoolContextProvider from "../context/SchoolContext";
import LevelContextProvider from "../context/LevelContext";
import PerimetersView from "../views/admin/PerimetersView/Index";
import PerimeterContextProvider from "../context/PerimeterContext";
import RequestBecaView from "../views/admin/RequestBecaView/RequestBecaView";
import DisabilitiesView from "../views/admin/DisabilitiesView/Index";
import DisabilityContextProvider from "../context/DisabilityContext";
import RequestBecaContextProvider from "../context/RequestBecaContext";
import StudentContextProvider from "../context/StudentContext";
import UserContextProvider from "../context/UserContext";
import UsersView from "../views/admin/UsersView/Index";
import RelationshipContextProvider from "../context/RelationshipContext";
import TutorContextProvider from "../context/TutorContext";
import { loaderIndexUsersView } from "../views/admin/UsersView/Index";
import FamilyContextProvider from "../context/FamilyContext";
import RequestListView from "../views/Request/RequestListView/RequestListView";
import CommunitiesView from "../views/admin/CommunitiesView/Index";
import CommunityContextProvider from "../context/CommunityContext";
import MenuContextProvider from "../context/MenuContext";
import MenusView from "../views/admin/MenusView/Index";
import RoleContextProvider from "../context/RoleContext";
import RolesView from "../views/admin/RolesView/Index";

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
   element: (
      <MenuContextProvider>
         <MainLayout />
      </MenuContextProvider>
   ),
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
         path: "solicitud-beca/pagina?/:pagina?/folio?/:folio?",
         element: (
            <RequestBecaContextProvider>
               <StudentContextProvider>
                  <DisabilityContextProvider>
                     <SchoolContextProvider>
                        <TutorContextProvider>
                           <RelationshipContextProvider>
                              <FamilyContextProvider>
                                 <RequestBecaView />
                              </FamilyContextProvider>
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
         path: "menus",
         element: (
            <MenuContextProvider>
               <MenusView />
            </MenuContextProvider>
         )
         // loader: loaderIndexUsersView
      },
      {
         path: "roles-y-permisos",
         element: (
            <RoleContextProvider>
               <MenuContextProvider>
                  <RolesView />
               </MenuContextProvider>
            </RoleContextProvider>
         )
         // loader: loaderIndex
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
               path: "discapacidades",
               element: (
                  <DisabilityContextProvider>
                     <DisabilitiesView />
                  </DisabilityContextProvider>
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
               path: "comunidades",
               element: (
                  <CommunityContextProvider>
                     <PerimeterContextProvider>
                        <CommunitiesView />
                     </PerimeterContextProvider>
                  </CommunityContextProvider>
               )
            }
         ]
      },
      {
         path: "solicitudes",
         children: [
            {
               index: true,
               // path: "/",
               element: (
                  <FamilyContextProvider>
                     <RequestBecaContextProvider>
                        <RequestListView />
                     </RequestBecaContextProvider>
                  </FamilyContextProvider>
               )
            },
            {
               path: "mis-solicitudes",
               // path: "/",
               element: (
                  <FamilyContextProvider>
                     <RequestBecaContextProvider>
                        <RequestListView />
                     </RequestBecaContextProvider>
                  </FamilyContextProvider>
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
