import { CircularProgress, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
// import "@material-ui/core/styles";

// defaultTheme
import themes from "./themes";
import { useSelector } from "react-redux";
import { Backdrop } from "@mui/material";
import { useGlobalContext } from "./context/GlobalContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
   const customization = useSelector((state) => state.customization);
   const { load, loadLogo, loadAction } = useGlobalContext();

   return (
      <ThemeProvider theme={themes(customization)}>
         <CssBaseline />
         {/* <NavigationSroll> */}
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 10000 }} open={load}>
               <Typography variant="h1" sx={{ color: "#fff" }}>
                  CARGANDO... <CircularProgress color="inherit" />
               </Typography>
            </Backdrop> */}
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 10000 }} open={loadAction}>
               <Typography variant="h1" sx={{ color: "#fff" }}>
                  CARGANDO... <CircularProgress color="inherit" />
               </Typography>
            </Backdrop>
            <RouterProvider router={router} />
         </LocalizationProvider>

         {/* </NavigationSroll> */}
      </ThemeProvider>
   );
};

export default App;
