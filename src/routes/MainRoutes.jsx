import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
const SchoolsView = Loadable(lazy(() => import("../views/catalogs/SchoolsView/Index")));
const LevelsView = Loadable(lazy(() => import("../views/catalogs/LevelsView/Index")));
const SchoolContextProvider = Loadable(lazy(() => import("../context/SchoolContext")));
const LevelContextProvider = Loadable(lazy(() => import("../context/LevelContext")));
const PerimetersView = Loadable(lazy(() => import("../views/catalogs/PerimetersView/Index")));
const PerimeterContextProvider = Loadable(lazy(() => import("../context/PerimeterContext")));
const RequestBecaView = Loadable(lazy(() => import("../views/RequestBecaView/RequestBecaView")));
const DisabilitiesView = Loadable(lazy(() => import("../views/catalogs/DisabilitiesView/Index")));
const DisabilityContextProvider = Loadable(lazy(() => import("../context/DisabilityContext")));
const RequestBecaContextProvider = Loadable(lazy(() => import("../context/RequestBecaContext")));
const StudentContextProvider = Loadable(lazy(() => import("../context/StudentContext")));
const UserContextProvider = Loadable(lazy(() => import("../context/UserContext")));
const UsersView = Loadable(lazy(() => import("../views/settings/UsersView/Index")));
const RelationshipContextProvider = Loadable(lazy(() => import("../context/RelationshipContext")));
const TutorContextProvider = Loadable(lazy(() => import("../context/TutorContext")));
import { loaderIndexUsersView } from "../views/settings/UsersView/Index";
const FamilyContextProvider = Loadable(lazy(() => import("../context/FamilyContext")));
const RequestListView = Loadable(lazy(() => import("../views/Request/RequestListView/Index")));
const CommunitiesView = Loadable(lazy(() => import("../views/catalogs/CommunitiesView/Index")));
const CommunityContextProvider = Loadable(lazy(() => import("../context/CommunityContext")));
const MenuContextProvider = Loadable(lazy(() => import("../context/MenuContext")));
const MenusView = Loadable(lazy(() => import("../views/settings/MenusView/Index")));
const RoleContextProvider = Loadable(lazy(() => import("../context/RoleContext")));
const RolesView = Loadable(lazy(() => import("../views/settings/RolesView/Index")));
const AnswerScoreContextProvider = Loadable(lazy(() => import("../context/AnswerScoreContext")));
const AnswersScoresView = Loadable(lazy(() => import("../views/settings/AnswersScoresView/Index")));
const SettingsView = Loadable(lazy(() => import("../views/settings/SettingsView/Index")));
const DashboardIndex = Loadable(lazy(() => import("../views/dashboard/DashboardView/Index")));
const SettingContextProvider = Loadable(lazy(() => import("../context/SettingContext")));

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
         element: (
            <UserContextProvider>
               <CommunityContextProvider>
                  <RequestBecaContextProvider>
                     <DashboardIndex />
                  </RequestBecaContextProvider>
               </CommunityContextProvider>
            </UserContextProvider>
         )
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
               path: "ajustes",
               element: (
                  <SettingContextProvider>
                     <SettingsView />
                  </SettingContextProvider>
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
                        <RelationshipContextProvider>
                           <RequestListView />
                        </RelationshipContextProvider>
                     </RequestBecaContextProvider>
                  </FamilyContextProvider>
               )
            },
            {
               path: "mis-solicitudes",
               element: (
                  <FamilyContextProvider>
                     <RequestBecaContextProvider>
                        <RelationshipContextProvider>
                           <RequestListView />
                        </RelationshipContextProvider>
                     </RequestBecaContextProvider>
                  </FamilyContextProvider>
               )
            },
            {
               path: "pagos/:pago?",
               element: (
                  <FamilyContextProvider>
                     <RequestBecaContextProvider>
                        <RelationshipContextProvider>
                           <RequestListView />
                        </RelationshipContextProvider>
                     </RequestBecaContextProvider>
                  </FamilyContextProvider>
               )
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
