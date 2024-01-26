import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useLayoutEffect, useMemo, useState } from "react";
import { useMenuContext } from "../../../context/MenuContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { handleInputFormik } from "../../../utils/Formats";
import { Card } from "@material-ui/core";
import SwitchComponent from "../../../components/SwitchComponent";
import { Label } from "@mui/icons-material";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const MenuForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const { singularName, menus, createMenu, updateMenu, formData, setFormData, textBtnSubmit, resetFormData, setTextBtnSumbit, formTitle, setFormTitle, headerMenus } =
      useMenuContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);
   const [isItem, setIsItem] = useState(false);

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

   const handleChangeType = (type) => {
      // console.log("handleChangeType - type", type);
      setIsItem(type === "item" ? true : false);
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // return console.log("values", values);
         if (!isItem) values.belongs_to = 0; //es menu padre
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createMenu(values);
         else axiosResponse = await updateMenu(values);
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
         handleChangeType(formData.type);
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
         // setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         menu: Yup.string().trim().required("Menú requerido"),
         // caption: Yup.string().trim().required("Leyenda requerida"),
         order: Yup.number().required("Orden requerido")
      });
      if (isItem)
         validationSchema = Yup.object().shape({
            menu: Yup.string().trim().required("Menú requerido"),
            belongs_to: Yup.number().min(1, "Esta opción no es valida").required("Pertenencia requerida"),
            url: Yup.string().trim().required("URL requerido"),
            icon: Yup.string().trim().required("Icono requerido"),
            order: Yup.number().required("Orden requerido")
         });
      return validationSchema;
   };

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null && formData.id > 0) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData, isItem]);

   return (
      // <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <Card>
         <Box role="presentation" p={3} pt={5} className="form" sx={{ maxHeight: "77.2vh", overflowY: "auto" }}>
            <Typography variant="h2" mb={3} textAlign={"center"}>
               {formTitle}
               {/* <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                  label="Seguir Agregando"
               /> */}
            </Typography>
            <Formik initialValues={formData} validationSchema={validationSchemas} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                     <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />
                     {/* Padre o Hijo */}
                     <Grid xs={12} md={12} sx={{ mb: 1 }}>
                        <FormControl fullWidth sx={{ alignItems: "center" }}>
                           <FormLabel id="type-label">Tipo de Menú</FormLabel>
                           <RadioGroup
                              row
                              aria-labelledby="type-label"
                              id="type"
                              name="type"
                              value={values.type}
                              onChange={(e) => {
                                 handleChange(e);
                                 handleChangeType(e.target.value);
                              }}
                              onBlur={handleBlur}
                           >
                              <FormControlLabel value="group" control={<Radio />} label="Padre" />
                              <FormControlLabel value="item" control={<Radio />} label="Hijo" />
                           </RadioGroup>
                           {touched.type && errors.type && (
                              <FormHelperText error id="ht-type">
                                 {errors.type}
                              </FormHelperText>
                           )}
                        </FormControl>
                     </Grid>
                     {/* Menú */}
                     <Grid xs={12} md={12} sx={{ mb: 3 }}>
                        <TextField
                           id="menu"
                           name="menu"
                           label="Nombre del Menú *"
                           type="text"
                           value={values.menu}
                           placeholder="Usuarios"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInputFormik(e, setFieldValue, "menu", true)}
                           fullWidth
                           error={errors.menu && touched.menu}
                           helperText={errors.menu && touched.menu && errors.menu}
                        />
                     </Grid>
                     {/* Leyenda */}
                     {values.type === "group" && (
                        <Grid xs={12} md={12} sx={{ mb: 3 }}>
                           <TextField
                              id="caption"
                              name="caption"
                              label="Ingrese Leyenda"
                              type="text"
                              value={values.caption}
                              placeholder="Texto de ayuda"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              // onInput={(e) => handleInputFormik(e, setFieldValue, "caption", true)}
                              fullWidth
                              error={errors.caption && touched.caption}
                              helperText={errors.caption && touched.caption && errors.caption}
                           />
                        </Grid>
                     )}
                     {values.type === "item" && (
                        <>
                           {/* Pertence a */}
                           <Grid xs={12} md={12} sx={{ mb: 2 }}>
                              <Select2Component
                                 idName={"belongs_to"}
                                 label={"Pertenezco a *"}
                                 valueLabel={values.patern}
                                 formDataLabel={"belongs_to"}
                                 placeholder={"Selecciona una opción..."}
                                 options={headerMenus}
                                 fullWidth={true}
                                 // handleChangeValueSuccess={handleChange...}
                                 handleBlur={handleBlur}
                                 error={errors.belongs_to}
                                 touched={touched.belongs_to}
                                 disabled={false}
                              />
                           </Grid>
                           {/* URL */}
                           <Grid xs={12} md={12} sx={{ mb: 3 }}>
                              <TextField
                                 id="url"
                                 name="url"
                                 label="URL / Path *"
                                 type="text"
                                 value={values.url}
                                 placeholder="/admin/nombre-de-pagina"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 onInput={(e) => handleInputFormik(e, setFieldValue, "url", false)}
                                 fullWidth
                                 error={errors.url && touched.url}
                                 helperText={errors.url && touched.url && errors.url}
                              />
                           </Grid>
                           {/* Icono */}
                           <Grid xs={12} md={12} sx={{ mb: 3 }}>
                              <TextField
                                 id="icon"
                                 name="icon"
                                 label="Ingrese el nombre del icono *"
                                 type="text"
                                 value={values.icon}
                                 placeholder="NombreDelIcono"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 // onInput={(e) => handleInputFormik(e, setFieldValue, "icon", true)}
                                 fullWidth
                                 error={errors.icon && touched.icon}
                                 helperText={errors.icon && touched.icon && errors.icon}
                              />
                              <small style={{ fontStyle: "italic" }}>
                                 <a href="https://tabler.io/icons" target="_blank">
                                    Pagina de iconos - copiar el "React Name"
                                 </a>
                              </small>
                           </Grid>
                        </>
                     )}

                     {/* Orden */}
                     <Grid xs={12} md={12} sx={{ mb: 3 }}>
                        <TextField
                           id="order"
                           name="order"
                           label="Ingrese el orden *"
                           type="number"
                           value={values.order}
                           placeholder="0"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           // onInput={(e) => handleInputFormik(e, setFieldValue, "order", true)}
                           fullWidth
                           error={errors.order && touched.order}
                           helperText={errors.order && touched.order && errors.order}
                        />
                     </Grid>
                     {/* Mostrar contador */}
                     {values.type === "item" && (
                        <Grid xs={12} md={12} sx={{ mb: 3 }}>
                           <Tooltip title={values.show_counter ? "Mostrar" : "Ocultar"} placement="right">
                              <Button color="dark" onClick={() => setFieldValue("show_counter", !Boolean(values.show_counter))}>
                                 <SwitchComponent checked={Boolean(values.show_counter)} label={"¿Mostrar contador?"} />
                              </Button>
                           </Tooltip>
                        </Grid>
                     )}
                     {/* Activar */}
                     <Grid xs={12} md={12} sx={{ mb: 3 }}>
                        <Tooltip title={values.active ? "Activo" : "Inactivo"} placement="right">
                           <Button color="dark" onClick={() => setFieldValue("active", !Boolean(values.active))}>
                              <SwitchComponent checked={Boolean(values.active)} label={"¿Menú Activo?"} />
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

      // </SwipeableDrawer>
   );
};
export default MenuForm;
