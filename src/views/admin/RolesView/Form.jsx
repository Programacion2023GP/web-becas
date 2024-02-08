import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, Card, FormControlLabel, FormLabel, InputLabel, Radio, RadioGroup, Select, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useLayoutEffect, useMemo, useState } from "react";
import { useRoleContext } from "../../../context/RoleContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { handleInputFormik } from "../../../utils/Formats";
import SwitchComponent from "../../../components/SwitchComponent";
import { Label } from "@mui/icons-material";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const RoleForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const { singularName, roles, createRole, updateRole, formData, setFormData, textBtnSubmit, resetFormData, setTextBtnSumbit, formTitle, setFormTitle } =
      useRoleContext();
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

   const handleReset = (resetForm, setFieldValue, id) => {
      try {
         resetForm();
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = (setValues, setFieldValue) => {
      try {
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
         // console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

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
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null && formData.id > 0) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Card>
            <Box role="presentation" p={3} pt={5} className="form" sx={{ maxHeight: "77.2vh", overflowY: "auto" }}>
               <Typography variant="h2" mb={3} textAlign={"center"}>
                  {formTitle}
                  <FormControlLabel
                     sx={{ float: "right", color: colorLabelcheck }}
                     control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                     label="Seguir Agregando"
                  />
               </Typography>

               <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
                  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                     <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                        <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />

                        {/* Rol */}
                        <Grid xs={12} md={12} sx={{ mb: 3 }}>
                           <TextField
                              id="role"
                              name="role"
                              label="Nombre del Rol *"
                              type="text"
                              value={values.role}
                              placeholder="Supervisor"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              // onInput={(e) => handleInputFormik(e, setFieldValue, "role", true)}
                              fullWidth
                              error={errors.role && touched.role}
                              helperText={errors.role && touched.role && errors.role}
                           />
                        </Grid>
                        {/* Descripción */}
                        <Grid xs={12} md={12} sx={{ mb: 3 }}>
                           <TextField
                              id="description"
                              name="description"
                              label="Descripción"
                              type="text"
                              value={values.description}
                              placeholder="Texto de ayuda"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              // onInput={(e) => handleInputFormik(e, setFieldValue, "description", true)}
                              fullWidth
                              error={errors.description && touched.description}
                              helperText={errors.description && touched.description && errors.description}
                           />
                        </Grid>

                        {/* Activar */}
                        <Grid xs={12} md={12} sx={{ mb: 3 }}>
                           <Tooltip title={values.active ? "Activo" : "Inactivo"} placement="right">
                              <Button color="dark" onClick={() => setFieldValue("active", !Boolean(values.active))}>
                                 <SwitchComponent checked={Boolean(values.active)} label={"¿Rol Activo?"} />
                              </Button>
                           </Tooltip>
                        </Grid>
                        <LoadingButton
                           type="submit"
                           disabled={isSubmitting}
                           loading={isSubmitting}
                           // loadingPosition="start"
                           variant="contained"
                           fullWidth
                           size="large"
                        >
                           {textBtnSubmit}
                        </LoadingButton>
                        <ButtonGroup variant="outlined" fullWidth>
                           <Button
                              type="reset"
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              size="large"
                              sx={{ mt: 1, display: "none" }}
                              onClick={() => handleReset(resetForm, setFieldValue, values.id)}
                           >
                              LIMPIAR
                           </Button>
                           <Button type="reset" variant="outlined" color="error" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleCancel(resetForm)}>
                              CANCELAR
                           </Button>
                        </ButtonGroup>
                        <Button type="button" color="info" fullWidth id="btnModify" sx={{ mt: 1, display: "none" }} onClick={() => handleModify(setValues)}>
                           setValues
                        </Button>
                     </Grid>
                  )}
               </Formik>
            </Box>
         </Card>
      </SwipeableDrawer>
   );
};
export default RoleForm;
