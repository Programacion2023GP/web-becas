import RoleForm from "./Form";
import RoleDT from "./DataTable";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect, useState } from "react";
import { useRoleContext } from "../../../context/RoleContext";
import { Alert, AlertTitle, SwipeableDrawer, Typography } from "@mui/material";

import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import FormSelect from "./FormSelect";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";
import MenusCards from "./MenusCards";
import { useMenuContext } from "../../../context/MenuContext";

const useStyles = makeStyles((theme) => ({
   formSwiper: {
      maxWidth: "75vw"
   }

   // Estilos para pantallas grandes (mayores o iguales a 600px)
   // [theme.breakpoints.up('md')]: {
   //    fontSize: '1.5em',
   //  },

   // Estilos para pantallas pequeñas (menores a 600px)
   //  [theme.breakpoints.down('sm')]: {
   //    fontSize: '1em',
   //  },
}));

const RolesView = () => {
   const classess = useStyles();
   // const { result } = useLoaderData();
   const { setLoading, toggleDrawer } = useGlobalContext();
   const { pluralName, role, roles, getRoles, roleSelect, getRolesSelectIndex } = useRoleContext();
   const { getMenus, getMenusSelectIndexToRoles } = useMenuContext();

   const [openDialogTable, setOpenDialogTable] = useState(false);
   const [loadPermissions, setLoadPermissions] = useState(false);

   useEffect(() => {
      try {
         setLoading(true);
         getRoles();
         getRolesSelectIndex();
         getMenusSelectIndexToRoles();
         getMenus(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [role]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase() + " Y PERMISOS"}
         </Typography>
         {/* </MainCard> */}
         <Grid container spacing={2}>
            <Grid xs={12} md={12} sx={{ mb: 2 }}>
               <FormSelect setOpenDialogTable={setOpenDialogTable} setLoadPermissions={setLoadPermissions} />
            </Grid>
            <Grid xs={12} md={12} sx={{ mb: 1 }}>
               <MenusCards key={"MenusCards"} loadPermissions={loadPermissions} />
            </Grid>
         </Grid>

         <SwipeableDrawer anchor={"left"} open={openDialogTable} onClose={toggleDrawer(false, setOpenDialogTable)} onOpen={toggleDrawer(true, setOpenDialogTable)}>
            <Box role="presentation" p={3} pt={5} className={classess.formSwiper} sx={{ maxHeight: "77.2vh", overflowY: "auto" }}>
               <RoleDT />
            </Box>
         </SwipeableDrawer>

         <RoleForm />
      </>
   );
};

// export const RolesView = async () => {
//    try {
//       const res = CorrectRes;
//       const Roles = await Axios.get("/roles/selectIndex/role_id");
//       res.result.roles = Roles.data.data.result;
//       res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default RolesView;
