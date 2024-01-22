import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useMemo, useState } from "react";
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
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const MenuForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const { singularName, menus, createMenu, updateMenu, formData, setFormData, textBtnSubmit, resetFormData, setTextBtnSumbit, formTitle, setFormTitle } =
      useMenuContext();
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
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      menu: Yup.string().trim().required("Menú requerido")
   });

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      // <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <Card>
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3} textAlign={"center"}>
               {formTitle}
               {/* <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                  label="Seguir Agregando"
               /> */}
            </Typography>
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                     <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />

                     {/* Padre o Hijo */}
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        <FormControl fullWidth sx={{ alignItems: "center" }}>
                           <FormLabel id="type-label" >Tipo de Menú</FormLabel>
                           <RadioGroup row aria-labelledby="type-label" id="type" name="type" value={values.type} onChange={handleChange} onBlur={handleBlur}>
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
                           placeholder="PRIMARIA"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "menu", true)}
                           fullWidth
                           error={errors.menu && touched.menu}
                           helperText={errors.menu && touched.menu && errors.menu}
                        />
                     </Grid>
                     {/* Leyenda */}
                     <Grid xs={12} md={12} sx={{ mb: 3 }}>
                        <TextField
                           id="menu"
                           name="menu"
                           label="Ingrese Leyenda *"
                           type="text"
                           value={values.menu}
                           placeholder="PRIMARIA"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "menu", true)}
                           fullWidth
                           error={errors.menu && touched.menu}
                           helperText={errors.menu && touched.menu && errors.menu}
                        />
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
