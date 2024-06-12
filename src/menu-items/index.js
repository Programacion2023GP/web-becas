import dashboard from "./dashboard";
import pages from "./others/pages";
import utilities from "./others/utilities";
import other from "./others/other";
import admin from "./admin";
import catalogs from "./catalogs";

import * as tablerIcons from "@tabler/icons";

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
   items: [
      dashboard,
      admin,
      catalogs,
      {
         id: "request",
         title: "Mis Solicitudes",
         caption: "Solicitudes Realizadas",
         type: "group",
         children: [
            {
               id: "request-list",
               title: "Solicitudes",
               type: "item",
               url: "/app/solicitudes/",
               icon: tablerIcons["IconStack3"]
            },
            {
               id: "my-request",
               title: "Mis Solicitudes",
               type: "item",
               url: "/app/solicitudes/mis-solicitudes",
               icon: tablerIcons["IconFileStack"],
               breadcrumbs: false
            }
         ]
      }
   ]
};

export default menuItems;
