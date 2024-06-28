import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { AppBar, Box, Button, CssBaseline, Toolbar, useMediaQuery } from "@mui/material";

// project imports
import Breadcrumbs from "../../ui-component/extended/Breadcrumbs";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Customization from "../Customization";
// import navigation from "./Sidebar/MenuList/menu-items";
import { drawerWidth } from "../../config/store/constant";
import { SET_MENU } from "../../config/store/actions";

// assets
import { IconChevronRight } from "@tabler/icons";
import { useAuthContext } from "../../context/AuthContext";
import { useGlobalContext } from "../../context/GlobalContext";
import { useEffect } from "react";
// import AuthContextProvider, { useAuthContext } from "../../context/AuthContextFirebase";

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
   ...theme.typography.mainContent,
   borderBottomLeftRadius: 0,
   borderBottomRightRadius: 0,
   transition: theme.transitions.create(
      "margin",
      open
         ? {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
           }
         : {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
           }
   ),
   [theme.breakpoints.up("md")]: {
      marginLeft: open ? 0 : -(drawerWidth - 20),
      width: `calc(100% - ${drawerWidth}px)`
   },
   [theme.breakpoints.down("md")]: {
      marginLeft: "20px",
      width: `calc(100% - ${drawerWidth}px)`,
      padding: "16px"
   },
   [theme.breakpoints.down("sm")]: {
      marginLeft: "10px",
      width: `calc(100% - ${drawerWidth}px)`,
      padding: "16px",
      marginRight: "10px"
   }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
   const theme = useTheme();
   const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
   // Handle left drawer
   const leftDrawerOpened = useSelector((state) => state.customization.opened);
   const dispatch = useDispatch();
   const handleLeftDrawerToggle = () => {
      dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
   };

   const { auth, permissionRead, validateAccessPage } = useAuthContext();
   const { cursorLoading } = useGlobalContext();

   useEffect(() => {
      // console.log("validateAccessPage()");
      validateAccessPage();
   });

   // useEffect(() => {
   //    // console.log("cambio el has?");
   //    validateAccessPage();
   // }, [window.location.hash]);

   return (
      auth && (
         <>
            {permissionRead && (
               <>
                  <Box sx={{ display: "flex" }}>
                     <CssBaseline />
                     {/* header */}
                     <AppBar
                        enableColorOnDark
                        position="fixed"
                        color="inherit"
                        elevation={5}
                        sx={{
                           // background: "rgb(161,108,41)";
                           // background: "linear-gradient(337deg, rgba(13,52,25,1) 0%, rgba(52,128,63,1) 50%, rgba(13,52,25,1) 100%)",
                           background: "linear-gradient(315deg, rgba(222,187,154,1) 0%, rgba(242,223,205,1) 50%, rgba(222,187,154,1) 100%)",
                           background: "linear-gradient(315deg, rgba(161,108,41,1) 0%, rgba(200,156,93,1) 50%, rgba(161,108,41,1) 100%)",
                           background: "linear-gradient(315deg, rgba(164,108,56,1) 0%, rgba(222,187,154,1) 50%, rgba(164,108,56,1) 100%)",
                           transition: leftDrawerOpened ? theme.transitions.create("width") : "none"
                        }}
                     >
                        <Toolbar>
                           <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                        </Toolbar>
                     </AppBar>

                     {/* drawer */}
                     <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

                     {/* main content */}
                     <Main theme={theme} open={leftDrawerOpened} className={cursorLoading && "cursor-loading"}>
                        {/* breadcrumb */}
                        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
                        <Outlet />
                     </Main>
                     <Customization />
                  </Box>
               </>
            )}
            {/* // : ( // <p>Sin permiso</p>
            // // <Navigate to={"/login"} />
            // )} */}
         </>
      )
   );
   // return auth ? (
   //    <Box sx={{ display: "flex" }}>
   //       <CssBaseline />
   //       {/* header */}
   //       <AppBar
   //          enableColorOnDark
   //          position="fixed"
   //          color="inherit"
   //          elevation={5}
   //          sx={{
   //             bgcolor: theme.palette.background.default,
   //             transition: leftDrawerOpened ? theme.transitions.create("width") : "none"
   //          }}
   //       >
   //          <Toolbar>
   //             <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
   //          </Toolbar>
   //       </AppBar>

   //       {/* drawer */}
   //       <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

   //       {/* main content */}
   //       <Main theme={theme} open={leftDrawerOpened}>
   //          {/* breadcrumb */}
   //          <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
   //          <Outlet />
   //       </Main>
   //       <Customization />
   //    </Box>
   // ) : (
   //    <Navigate to={"/login"} />
   // );
};

export default MainLayout;
