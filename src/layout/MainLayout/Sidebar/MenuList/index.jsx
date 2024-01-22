// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "../../../../menu-items";
import { useEffect } from "react";
import { useAuthContext } from "../../../../context/AuthContext";
import { useMenuContext } from "../../../../context/MenuContext";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
   const { auth } = useAuthContext();
   const { menuItems, showMyMenus } = useMenuContext();
   // console.log(auth);
   useEffect(() => {
      console.log("el useEffect de MenuList", menuItem);
      showMyMenus();
   }, [auth]);
   
   const navItems = menuItems.items.map((item) => {
      switch (item.type) {
         case "group":
            return <NavGroup key={item.id} item={item} />;
         default:
            return (
               <Typography
                  key={item.id}
                  variant="h6"
                  color="error"
                  align="center"
               >
                  Menu Items Error
               </Typography>
            );
      }
   });

   return <>{navItems}</>;
};

export default MenuList;
