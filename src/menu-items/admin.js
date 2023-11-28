// assets

import * as tablerIcons from "@tabler/icons";

// ==============================|| PAGINAS DISPONIBLES PARA UN ADMIN ||============================== //

const admin = {
   id: "admin",
   title: "Administrativo",
   caption: "Control de usuarios",
   type: "group",
   children: [
      {
         id: "admin-users",
         title: "Usuarios",
         type: "item",
         url: "/admin/usuarios",
         icon: tablerIcons["IconUsers"],
         breadcrumbs: false
      },
      {
         id: "admin-roles",
         title: "Roles",
         type: "item",
         url: "/admin/roles",
         icon: tablerIcons["IconPaperBag"]
      }
      // {
      //    id: "admin-departments",
      //    title: "Departamentos",
      //    type: "item",
      //    url: "/admin/departamentos",
      //    icon: tablerIcons["IconBuildingSkyscraper"],
      //    breadcrumbs: false
      // }
   ]
};

export default admin;
