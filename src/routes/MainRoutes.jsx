import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import SchoolsView from "../views/catalogs/SchoolsView/Index";
import LevelsView from "../views/catalogs/LevelsView/Index";
import SchoolContextProvider from "../context/SchoolContext";
import LevelContextProvider from "../context/LevelContext";
import PerimetersView from "../views/catalogs/PerimetersView/Index";
import PerimeterContextProvider from "../context/PerimeterContext";
import RequestBecaView from "../views/RequestBecaView/RequestBecaView";
import DisabilitiesView from "../views/catalogs/DisabilitiesView/Index";
import DisabilityContextProvider from "../context/DisabilityContext";
import RequestBecaContextProvider from "../context/RequestBecaContext";
import StudentContextProvider from "../context/StudentContext";
import UserContextProvider from "../context/UserContext";
import UsersView from "../views/settings/UsersView/Index";
import RelationshipContextProvider from "../context/RelationshipContext";
import TutorContextProvider from "../context/TutorContext";
import { loaderIndexUsersView } from "../views/settings/UsersView/Index";
import FamilyContextProvider from "../context/FamilyContext";
import RequestListView from "../views/Request/RequestListView/Index";
import CommunitiesView from "../views/catalogs/CommunitiesView/Index";
import CommunityContextProvider from "../context/CommunityContext";
import MenuContextProvider from "../context/MenuContext";
import MenusView from "../views/settings/MenusView/Index";
import RoleContextProvider from "../context/RoleContext";
import RolesView from "../views/settings/RolesView/Index";
import AnswerScoreContextProvider from "../context/AnswerScoreContext";
import AnswersScoresView from "../views/settings/AnswersScoresView/Index";
import BecaSettingsView from "../views/settings/BecaSettingsView/Index";
import DashboardIndex from "../views/dashboard/DashboardView/Index";

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
   path: "/app",
   element: (
      <MenuContextProvider>
         <MainLayout />
      </MenuContextProvider>
   ),
   children: [
      {
         index: true,
         //    path: "dashboard",
         element: <DashboardIndex />
      },
      // {
      //    path: "dashboard",
      //    element: <DashboardDefault />
      // },
      {
         path: "solicitud-beca/pagina?/:pagina?/folio?/:folio?/:accion?",
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
         path: "configuraciones",
         children: [
            {
               path: "usuarios",
               element: (
                  <RoleContextProvider>
                     <UserContextProvider>
                        <UsersView />
                     </UserContextProvider>
                  </RoleContextProvider>
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
               path: "respuestas-y-puntajes",
               element: (
                  <AnswerScoreContextProvider>
                     <AnswersScoresView />
                  </AnswerScoreContextProvider>
               )
               // loader: loaderIndex
            },
            {
               path: "becas",
               element: (
                  <AnswerScoreContextProvider>
                     <BecaSettingsView />
                  </AnswerScoreContextProvider>
               )
               // loader: loaderIndex
            }
         ]
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
               path: ":status?",
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
               element: (
                  <FamilyContextProvider>
                     <RequestBecaContextProvider>
                        <RequestListView />
                     </RequestBecaContextProvider>
                  </FamilyContextProvider>
               )
            }
            // {
            //    path: "en-revision",
            //    element: (
            //       <FamilyContextProvider>
            //          <RequestBecaContextProvider>
            //             <RequestListView status={"TERMINADA, EN REVISIÓN"} />
            //          </RequestBecaContextProvider>
            //       </FamilyContextProvider>
            //    )
            // },
            // {
            //    path: "en-evaluacion",
            //    element: (
            //       <FamilyContextProvider>
            //          <RequestBecaContextProvider>
            //             <RequestListView status={"EN EVALUACIÓN"} />
            //          </RequestBecaContextProvider>
            //       </FamilyContextProvider>
            //    )
            // },
            // {
            //    path: "aprobadas",
            //    element: (
            //       <FamilyContextProvider>
            //          <RequestBecaContextProvider>
            //             <RequestListView status={"APROBADA"} />
            //          </RequestBecaContextProvider>
            //       </FamilyContextProvider>
            //    )
            // },
            // {
            //    path: "pagadas",
            //    element: (
            //       <FamilyContextProvider>
            //          <RequestBecaContextProvider>
            //             <RequestListView status={"PAGADA"} />
            //          </RequestBecaContextProvider>
            //       </FamilyContextProvider>
            //    )
            // },
            // {
            //    path: "rechazadas",
            //    element: (
            //       <FamilyContextProvider>
            //          <RequestBecaContextProvider>
            //             <RequestListView status={"RECHAZADA"} />
            //          </RequestBecaContextProvider>
            //       </FamilyContextProvider>
            //    )
            // },
            // {
            //    path: "canceladas",
            //    element: (
            //       <FamilyContextProvider>
            //          <RequestBecaContextProvider>
            //             <RequestListView status={"CANCELADA"} />
            //          </RequestBecaContextProvider>
            //       </FamilyContextProvider>
            //    )
            // }
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
