import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControlLabel, InputLabel, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { handleInputFormik } from "../../../utils/Formats";
import { OutlinedInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../../utils/password-strength";
import Select2Component from "../../../components/Form/Select2Component";
import { useRoleContext } from "../../../context/RoleContext";
import { FormikComponent } from "../../../components/Form/FormikComponent";
import { InputComponentEST } from "../../../components/Form/InputComponentEST";
import { RadioButtonComponent } from "../../../components/Form/RadioButtonComponent";
import { InputNumericComponent } from "../../../components/Form/InputNumericComponent";
import { InputPasswordCompnent } from "../../../components/Form/InputPasswordComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const UserForm = ({ dataRoles }) => {
   const { getRolesSelectIndex } = useRoleContext();
   // #region Boton de Contraseña
   const [showPassword, setShowPassword] = useState(false);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(true);

   const [strength, setStrength] = useState(0);
   const [level, setLevel] = useState();
   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const changePassword = (value) => {
      const temp = strengthIndicator(value);
      setStrength(temp);
      setLevel(strengthColor(temp));
   };
   // #endregion Boton de Contraseña

   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   // const { roles, getRolesSelectIndex } = useRoleContext();
   const { resetUser, singularName, createUser, updateUser, formData, setFormData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } = useUserContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);

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

         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createUser(values);
         else axiosResponse = await updateUser(values);
         // console.log(axiosResponse);
         if (axiosResponse.status_code == 200) {
            resetForm();
            setStrength(0);
            setTextBtnSumbit("AGREGAR");
            setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
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

   const handleReset = (resetForm, setFieldValue, id) => {
      try {
         resetForm();
         resetUser();
         formData.role = "Selecciona una opción...";
         setStrength(0);
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = async (setValues, setFieldValue) => {
      try {
         // setLoadingAction(true);
         // console.log(formData);
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         resetUser();
         formData.role = "Selecciona una opción...";
         setStrength(0);
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
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
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
            <FormikComponent key={"formikComponent"} initialValues={formData} validationSchema={validationSchemas()} onSubmit={onsubmit} textBtnSubmit={textBtnSubmit}>
               <InputComponentEST col={12} idName="id" label={"id"} hidden={true} />
               {/* <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} /> */}

               {/* Nombre de Usuario */}
               <InputComponentEST col={12} idName="username" label={"Nombre de usuario *"} placeholder={"Ingrese su nombre de usuario"} />
               {/* <Grid xs={12} md={6} sx={{ mb: 2 }}>
                  <TextField
                     id="username"
                     name="username"
                     label="Nombre de usuario *"
                     type="text"
                     value={values.username}
                     placeholder="Ingrese su nombre de usuario"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     // onInput={(e) => handleInputFormik(e, setFieldValue, "username", true)}
                     // InputProps={{ }}
                     fullWidth
                     // disabled={values.id == 0 ? false : true}
                     error={errors.username && touched.username}
                     helperText={errors.username && touched.username && errors.username}
                  />
               </Grid> */}

               {/* Correo Electronico */}
               <InputComponentEST col={12} idName="email" label={"Correo Electrónico *"} placeholder={"mi@correo.com"} textStyleCase={false} />
               {/* <Grid xs={12} md={6} sx={{ mb: 1 }}>
                  <TextField
                     id="email"
                     name="email"
                     label="Correo Electrónico *"
                     type="email"
                     value={values.email}
                     placeholder="mi@correo.com"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     onInput={(e) => handleInputFormik(e, setFieldValue, "email", false)}
                     // inputProps={{ maxLength: 2 }}
                     fullWidth
                     // disabled={values.id == 0 ? false : true}
                     error={errors.email && touched.email}
                     helperText={errors.email && touched.email && errors.email}
                  />
               </Grid> */}

               {/* Contraseña */}
               <InputPasswordCompnent
                  col={12}
                  idName={"password"}
                  newPasswordChecked={newPasswordChecked}
                  setNewPasswordChecked={setNewPasswordChecked}
               />
               {/* Switch para mostrar el cambiar contraseña */}
               {/* {checkedShowSwitchPassword && (
                  <Grid xs={12} md={12} sx={{ mb: -2 }}>
                     <FormControlLabel
                        control={<Switch />}
                        label="Cambiar Contraseña"
                        checked={newPasswordChecked}
                        onChange={() => setNewPasswordChecked(!newPasswordChecked)}
                     />
                  </Grid>
               )} */}
               {/* Contraseña */}
               {/* <Grid xs={12} md={6} sx={{ mb: 2 }}>
                  <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                     <InputLabel htmlFor="password">Contraseña *</InputLabel>
                     <OutlinedInput
                        id="password"
                        name="password"
                        label="Contraseña *"
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        placeholder="Ingrese su contraseña, minimo 6 dígitos"
                        onBlur={handleBlur}
                        onChange={(e) => {
                           handleChange(e);
                           changePassword(e.target.value);
                        }}
                        endAdornment={
                           <InputAdornment position="end">
                              <IconButton
                                 aria-label="toggle password visibility"
                                 onClick={handleClickShowPassword}
                                 onMouseDown={handleMouseDownPassword}
                                 edge="end"
                                 size="large"
                              >
                                 {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                           </InputAdornment>
                        }
                        inputProps={{}}
                        fullWidth
                        disabled={newPasswordChecked ? false : true} // DESHABILITAR CON UN CHECK
                        // disabled={values.id == 0 ? false : true}
                        error={errors.password && touched.password}
                     />
                     {touched.password && errors.password && (
                        <FormHelperText error id="ht-password">
                           {errors.password}
                        </FormHelperText>
                     )}
                  </FormControl>
                  {strength !== 0 && (
                     <FormControl fullWidth>
                        <Box sx={{ mb: 2 }}>
                           <Grid container spacing={2} alignItems="center">
                              <Grid>
                                 <Box
                                    style={{ backgroundColor: level?.color }}
                                    sx={{
                                       width: 85,
                                       height: 8,
                                       borderRadius: "7px"
                                    }}
                                 />
                              </Grid>
                              <Grid>
                                 <Typography variant="subtitle1" fontSize="0.75rem">
                                    {level?.label}
                                 </Typography>
                              </Grid>
                           </Grid>
                        </Box>
                     </FormControl>
                  )}
               </Grid> */}

               {/* Rol */}
               {/* <Grid xs={12} md={6} sx={{ mb: 1 }}>
                  <Select2Component
                     idName={"role_id"}
                     label={"Rol *"}
                     valueLabel={values.role}
                     formDataLabel={"role"}
                     placeholder={"Selecciona una opción..."}
                     options={dataRoles}
                     fullWidth={true}
                     // handleChangeValueSuccess={handleChangeRole}
                     handleBlur={handleBlur}
                     error={errors.role_id}
                     touched={touched.role_id}
                     disabled={false}
                     pluralName={"Roles"}
                     refreshSelect={getRolesSelectIndex}
                  />
               </Grid> */}
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default UserForm;
