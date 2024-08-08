import * as Yup from "yup";

import { Card, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { useRoleContext } from "../../../context/RoleContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useMenuContext } from "../../../context/MenuContext";
import { FormikComponent, InputComponent, Select2Component, SwitchComponent } from "../../../components/Form/FormikComponents";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const RoleForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const { singularName, roles, createRole, updateRole, formData, setFormData, textBtnSubmit, resetFormData, setTextBtnSumbit, formTitle, setFormTitle, formikRef } =
      useRoleContext();
   const { menusSelect, getMenusSelectIndexToRoles } = useMenuContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const handleChangeCheckAdd = (e) => {
      try {
         const active = e.target.checked;
         localStorage.setItem("checkAdd", active);
         setCheckAdd(active);
         setColorLabelcheck("");
         if (!active) setColorLabelcheck("#ccc");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // return console.log("values", values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createRole(values);
         else axiosResponse = await updateRole(values);
         resetForm();
         resetFormData();
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
      }
   };

   // const handleReset = (resetForm, setFieldValue, id) => {
   //    try {
   //       resetForm();
   //       setFieldValue("id", id);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   // const handleModify = (setValues, setFieldValue) => {
   //    try {
   //       if (formData.description) formData.description == null && (formData.description = "");
   //       setValues(formData);
   //       // console.log(formData);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         resetFormData();
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      role: Yup.string().trim().required("Rol requerido")
   });

   useEffect(() => {
      try {
         // console.log("menusSelect", menusSelect);
         // const btnModify = document.getElementById("btnModify");
         // if (btnModify != null && formData.id > 0) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         {/* <Card> */}
         <Box role="presentation" p={3} pt={5} className="form">
            <Grid container mb={2}>
               <Grid item xs={8} pr={3}>
                  <Typography variant="h2">{formTitle}</Typography>
               </Grid>
               <Grid item xs={4}>
                  <FormControlLabel
                     sx={{ float: "right", color: colorLabelcheck }}
                     control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                     label="Seguir Agregando"
                  />
               </Grid>
            </Grid>

            <FormikComponent
               key={"formikComponent"}
               initialValues={formData}
               validationSchema={validationSchema}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               formikRef={formikRef}
               handleCancel={handleCancel}
            >
               <InputComponent col={12} idName={"id"} label={"id"} hidden={true} />
               <InputComponent col={12} idName={"role"} label={"Nombre del Rol *"} placeholder={"Supervisor"} />
               <InputComponent col={12} idName={"description"} label={"Descripción"} placeholder={"Texto de ayuda"} />
               <Select2Component col={12} idName={"page_index"} label={"Página de Inicio *"} options={menusSelect} refreshSelect={getMenusSelectIndexToRoles} />
               <SwitchComponent col={12} idName={"active"} label={"¿Rol Activo?"} textEnable={"Activo"} textDisable={"Inactivo"} />
            </FormikComponent>
         </Box>
         {/* </Card> */}
      </SwipeableDrawer>
   );
};
export default RoleForm;
