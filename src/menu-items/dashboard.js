// assets
import { IconDashboard, IconFileDollar } from "@tabler/icons";

// constant
const icons = { IconDashboard, IconFileDollar };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
   id: "dashboard",
   title: "Dashboard",
   type: "group",
   children: [
      {
         id: "default",
         title: "Dashboard",
         type: "item",
         url: "/admin/",
         icon: icons.IconDashboard,
         breadcrumbs: false
      },
      {
         id: "requestBeca",
         title: "Solicitud de Beca",
         type: "item",
         url: "/admin/solicitud-beca",
         icon: icons.IconFileDollar,
         breadcrumbs: false
      }
   ]
};

export default dashboard;
