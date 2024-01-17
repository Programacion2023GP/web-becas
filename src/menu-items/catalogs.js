// assets
import { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber, IconAspectRatio, IconWheelchair, IconFrame, IconMapPin, IconRadar2 } from "@tabler/icons";

// constant
const icons = { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber, IconAspectRatio, IconWheelchair, IconFrame, IconMapPin, IconRadar2 };

// ==============================|| PAGINAS DISPONIBLES PARA UN ADMIN ||============================== //

const catalogs = {
   id: "catalogs",
   title: "Catalogos",
   caption: "Gestion de catalogos",
   type: "group",
   children: [
      {
         id: "admin-school",
         title: "Escuelas",
         type: "item",
         url: "/admin/catalogos/escuelas",
         icon: icons.IconBuildingSkyscraper,
         breadcrumbs: false
      },
      {
         id: "admin-levels",
         title: "Niveles",
         type: "item",
         url: "/admin/catalogos/niveles",
         icon: icons.IconNumber
      },
      {
         id: "admin-disabilities",
         title: "Discapacidades",
         type: "item",
         url: "/admin/catalogos/discapacidades",
         icon: icons.IconWheelchair
      },
      {
         id: "admin-perimeters",
         title: "Perímetros",
         type: "item",
         url: "/admin/catalogos/perimetros",
         icon: icons.IconRadar2
      },
      {
         id: "admin-communities",
         title: "Comunidades",
         type: "item",
         url: "/admin/catalogos/comunidades",
         icon: icons.IconMapPin,
         breadcrumbs: false
      }
   ]
};

export default catalogs;
