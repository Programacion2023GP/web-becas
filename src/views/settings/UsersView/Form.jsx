import * as Yup from "yup";

import { FormControlLabel, Switch, Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useRoleContext } from "../../../context/RoleContext";
import { FormikComponent, InputComponent, PasswordCompnent, Select2Component } from "../../../components/Form/FormikComponents";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const UserForm = ({ dataRoles }) => {
   const { formikRef } = useUserContext();
   const { getRolesSelectIndex } = useRoleContext();
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(false);

   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   // const { roles, getRolesSelectIndex } = useRoleContext();
   const { resetUser, singularName, createUser, updateUser, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } = useUserContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);

   const ResetForm = (resetForm) => {
      if (resetForm) resetForm();
      resetUser();
      // setStrength(0);
      setTextBtnSumbit("AGREGAR");
      setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
   };

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

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         // console.log("formData", formData);
         // console.log("values", values);
         // values.community_id = values.colony_id;
         values.change_password = newPasswordChecked;

         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createUser(values);
         else axiosResponse = await updateUser(values);
         // console.log(axiosResponse);
         if (axiosResponse.status_code == 200) {
            ResetForm(resetForm);
         }
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd && axiosResponse.status_code == 200) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         Toast.Error(error);
      } finally {
         setSubmitting(false);
      }
   };

   // const handleReset = (resetForm, setFieldValue, id) => {
   //    try {
   //       resetForm();
   //       resetUser();
   //       formData.role = "Selecciona una opción...";
   //       setStrength(0);
   //       setFieldValue("id", id);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   // const handleModify = async (setValues, setFieldValue) => {
   //    try {
   //       // setLoadingAction(true);
   //       // console.log(formData);
   //       if (formData.description) formData.description == null && (formData.description = "");
   //       setValues(formData);
   //       setLoadingAction(false);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   const handleCancel = (resetForm) => {
      try {
         ResetForm(resetForm);
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         username: Yup.string().trim().required("Nombre de usario requerido"),
         email: Yup.string().trim().email("Formato de correo no valido").required("Correo requerido"),
         password: newPasswordChecked && Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
         role_id: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido")
      });

      return validationSchema;
   };

   useEffect(() => {
      try {
         // getRolesSelectIndex();
         // const btnModify = document.getElementById("btnModify");
         // if (btnModify != null) btnModify.click();
         if (textBtnSubmit == "GUARDAR") {
            setNewPasswordChecked(false);
            setCheckedShowSwitchPassword(true);
         } else {
            setNewPasswordChecked(true);
            setCheckedShowSwitchPassword(false);
         }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3}>
               {formTitle}
               <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                  label="Seguir Agregando"
               />
            </Typography>

            {/* VALIDAR DEPENDIENDO DEL ROL ESCOGIDO */}
            <FormikComponent
               key={"formikComponent"}
               initialValues={formData}
               validationSchema={validationSchemas()}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               formikRef={formikRef}
               handleCancel={handleCancel}
            >
               <InputComponent col={12} idName="id" label={"id"} hidden={true} />

               {/* Nombre de Usuario */}
               <InputComponent col={6} idName="username" label={"Nombre de usuario *"} placeholder={"Ingrese su nombre de usuario"} />

               {/* Correo Electronico */}
               <InputComponent col={6} idName="email" label={"Correo Electrónico *"} placeholder={"mi@correo.com"} textStyleCase={false} />

               {/* Contraseña */}
               <PasswordCompnent
                  col={6}
                  idName={"password"}
                  newPasswordChecked={newPasswordChecked}
                  setNewPasswordChecked={setNewPasswordChecked}
                  checkedShowSwitchPassword={checkedShowSwitchPassword}
               />

               {/* Rol */}
               <Select2Component
                  col={6}
                  idName={"role_id"}
                  label={"Rol"}
                  placeholder={"Selecciona una opción..."}
                  options={dataRoles}
                  pluralName={"Roles"}
                  refreshSelect={getRolesSelectIndex}
               />
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default UserForm;
