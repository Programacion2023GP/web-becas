import MenuForm from "./Form";
import MenuDT from "./DataTable";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useMenuContext } from "../../../context/MenuContext";
import { Alert, AlertTitle, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";

const MenusView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, menu, getMenus, getHeaderMenusSelectIndex } = useMenuContext();

   useEffect(() => {
      try {
         setLoading(true);
         getMenus();
         getHeaderMenusSelectIndex();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [menu]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         {/* </MainCard> */}
         <Grid container spacing={2}>
            <Grid xs={12} md={3} sx={{ mb: 3 }}>
               <MenuForm />
            </Grid>
            <Grid xs={12} md={9} sx={{ mb: 3 }}>
               <MenuDT />
            </Grid>
         </Grid>
      </>
   );
};

// export const loaderIndexMenusView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosMenus = await Axios.get("/menus/selectIndex");
//       res.result.menus = axiosMenus.data.data.result;
//       res.result.menus.unshift({ id: 0, label: "Selecciona una opción..." });
//       // // console.log(res);

//       return res;
//    } catch (error) {
//       const res = ErrorRes;
//       console.log(error);
//       res.message = error;
//       res.alert_text = error;
//       sAlert.Error(error);
//       return res;
//    }
// };

export default MenusView;
