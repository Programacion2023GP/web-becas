import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useMemo, useState } from "react";
import { useSchoolContext } from "../../../context/SchoolContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { useLevelContext } from "../../../context/LevelContext";
import { handleInputFormik } from "../../../utils/Formats";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const SchoolForm = () => {
   const {
      openDialog,
      setOpenDialog,
      toggleDrawer,
      setLoadingAction,
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete
   } = useGlobalContext();
   const { singularName, levels, getLevelsSelectIndex } = useLevelContext();
   const {
      createSchool,
      updateSchool,

      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle
   } = useSchoolContext();
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
         if (values.id == 0) axiosResponse = await createSchool(values);
         else axiosResponse = await updateSchool(values);
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

   const handleReset = (resetForm, setFieldValue, id, code) => {
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
         if (formData.community_id > 0) {
            getCommunity(
               formData.zip,
               setFieldValue,
               formData.community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies,
               setDataColoniesComplete
            );
         }
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
      code: Yup.string().trim().required("Clave de escuela requerida"),
      level_id: Yup.number().min(1, "Ésta opción no es valida").required("Nivel requerido"),
      school: Yup.string().trim().required("Nombre de escuela requerida"),
      // city_id: Yup.string().trim().required("Ciudad requerido"),
      // colony_id: Yup.string().trim().required("Colonia requerida"),
      street: Yup.string().trim().required("Calle requerida"),
      num_ext: Yup.string().trim().required("Número exterior requerida"),
      phone: Yup.string()
         .trim()
         .matches("[0-9]{10}", "Formato invalido - teléfono a 10 digitos")
         .max(10, "Formato invalido - teléfono a 10 digitos")
         .required("Número telefónico requerido"),
      director: Yup.string().trim().required("Nombre del director requerido"),
      loc_for: Yup.string().required("Indica si la esculea esá dentro o fuera del municipio de Gomez Palacio"),
      zone: Yup.string().trim().required("Zona requerida")
   });

   useEffect(() => {
      try {
         getLevelsSelectIndex();
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
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
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                     <Grid container width={"100%"} maxHeight={"79vh"} overflow={"auto"}>
                        <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />
                        {/* Codigo */}
                        <Grid xs={12} md={4} sx={{ mb: 3 }}>
                           {/* <InputComponent idName={"code"} /> */}
                           <TextField
                              id="code"
                              name="code"
                              label="Código de la Escuela *"
                              type="text"
                              value={values.code}
                              placeholder="AS5D16A158"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "code", true)}
                              inputProps={{ maxLength: 10 }}
                              fullWidth
                              disabled={values.id == 0 ? false : true}
                              error={errors.code && touched.code}
                              helperText={errors.code && touched.code && errors.code}
                           />
                        </Grid>
                        {/* Nivel */}
                        <Grid xs={12} md={8} sx={{ mb: 1 }}>
                           <Select2Component
                              idName={"level_id"}
                              label={"Nivel *"}
                              valueLabel={values.level}
                              formDataLabel={"level"}
                              placeholder={"Selecciona una opción..."}
                              options={levels}
                              fullWidth={true}
                              // handleChangeValueSuccess={handleChangeLevel}
                              handleBlur={handleBlur}
                              error={errors.level_id}
                              touched={touched.level_id}
                              disabled={false}
                              pluralName={"Niveles"}
                              refreshSelect={getLevelsSelectIndex}
                           />
                        </Grid>
                        {/* Escuela */}
                        <Grid xs={12} md={12} sx={{ mb: 3 }}>
                           <TextField
                              id="school"
                              name="school"
                              label="Nombre de la Escuela *"
                              type="text"
                              value={values.school}
                              placeholder="Lazaro Cardenas del Rio"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "school", true)}
                              fullWidth
                              error={errors.school && touched.school}
                              helperText={errors.school && touched.school && errors.school}
                           />
                        </Grid>
                        {/* Comunidad */}
                        <InputsCommunityComponent
                           formData={formData}
                           setFormData={setFormData}
                           values={values}
                           setValues={setValues}
                           setFieldValue={setFieldValue}
                           handleChange={handleChange}
                           handleBlur={handleBlur}
                           errors={errors}
                           touched={touched}
                        />

                        {/* Telefono */}
                        <Grid xs={12} md={4} sx={{ mb: 1 }}>
                           <TextField
                              id="phone"
                              name="phone"
                              label="Número Telefónico *"
                              type="phone"
                              value={values.phone}
                              placeholder="10 dígitos"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              fullWidth
                              inputProps={{ maxLength: 10 }}
                              error={errors.phone && touched.phone}
                              helperText={errors.phone && touched.phone && errors.phone}
                           />
                        </Grid>
                        {/* Director */}
                        <Grid xs={12} md={8} sx={{ mb: 1 }}>
                           {/* <ReactInputMask mask={"(999)-999-99-99"} value={values.director} disabled={false} maskChar=" "> */}
                           <TextField
                              id="director"
                              name="director"
                              label="Nombre del director *"
                              type="text"
                              value={values.director}
                              placeholder="Lic. Nombre Completo"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onInput={(e) => handleInputFormik(e, setFieldValue, "director", true)}
                              fullWidth
                              error={errors.director && touched.director}
                              helperText={errors.director && touched.director && errors.director}
                           />
                        </Grid>
                        {/* Local o Foraneo */}
                        <Grid xs={12} md={6} sx={{ mb: 1 }}>
                           <FormControl fullWidth sx={{ alignItems: "center" }}>
                              <FormLabel id="loc_for-label">Ubicacion de escuela</FormLabel>
                              <RadioGroup
                                 row
                                 aria-labelledby="loc_for-label"
                                 id="loc_for"
                                 name="loc_for"
                                 value={values.loc_for}
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                              >
                                 <FormControlLabel value="1" control={<Radio />} label="Local" />
                                 <FormControlLabel value="0" control={<Radio />} label="Foranea" />
                              </RadioGroup>
                              {touched.loc_for && errors.loc_for && (
                                 <FormHelperText error id="ht-loc_for">
                                    {errors.loc_for}
                                 </FormHelperText>
                              )}
                           </FormControl>
                        </Grid>
                        {/* Zona */}
                        <Grid xs={12} md={6} sx={{ mb: 3 }}>
                           <FormControl fullWidth sx={{ alignItems: "center" }}>
                              <FormLabel id="zone-label">Zona</FormLabel>
                              <RadioGroup row aria-labelledby="zone-label" id="zone" name="zone" value={values.zone} onChange={handleChange} onBlur={handleBlur}>
                                 <FormControlLabel value="U" control={<Radio />} label="Urbana" />
                                 <FormControlLabel value="R" control={<Radio />} label="Rural" />
                              </RadioGroup>
                              {touched.zone && errors.zone && (
                                 <FormHelperText error id="ht-zone">
                                    {errors.zone}
                                 </FormHelperText>
                              )}
                           </FormControl>
                        </Grid>
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
                           onClick={() => handleReset(resetForm, setFieldValue, values.id, values.code)}
                        >
                           LIMPIAR
                        </Button>
                        <Button type="reset" variant="outlined" color="error" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleCancel(resetForm)}>
                           CANCELAR
                        </Button>
                     </ButtonGroup>
                     <Button
                        type="button"
                        color="info"
                        fullWidth
                        id="btnModify"
                        sx={{ mt: 1, display: "none" }}
                        onClick={() => handleModify(setValues, setFieldValue)}
                     >
                        setValues
                     </Button>
                  </Grid>
               )}
            </Formik>
         </Box>
      </SwipeableDrawer>
   );
};
export default SchoolForm;
