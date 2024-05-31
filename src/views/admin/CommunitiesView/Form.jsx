import { Field, Formik } from "formik";
import * as Yup from "yup";

/// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Grid, Button, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useMemo, useState } from "react";
import { useCommunityContext } from "../../../context/CommunityContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { handleInputFormik } from "../../../utils/Formats";
import { usePerimeterContext } from "../../../context/PerimeterContext";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const CommunityForm = () => {
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
   const {
      singularName,
      communities,
      createCommunity,
      updateCommunity,
      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle
   } = useCommunityContext();

   const { perimeters, getPerimetersSelectIndex } = usePerimeterContext();

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
         if (values.id == 0) axiosResponse = await createCommunity(values);
         else axiosResponse = await updateCommunity(values);
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
      name: Yup.string().trim().required("Communidad requerido")
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
                     <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />

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
                        registerCommunity={true}
                     />
                     {/* Communidad */}
                     <Grid item xs={12} md={12} sx={{ mb: 3 }}>
                        <TextField
                           id="name"
                           name="name"
                           label="Communidad *"
                           type="text"
                           value={values.name}
                           placeholder="PRIMARIA"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "name", true)}
                           fullWidth
                           error={errors.name && touched.name}
                           helperText={errors.name && touched.name && errors.name}
                        />
                     </Grid>
                     {/* Tipo de Communidad */}
                     <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                        <TextField
                           id="type"
                           name="type"
                           label="Tipo de Communidad *"
                           type="text"
                           value={values.type}
                           placeholder="colonia | fraccionamiento | ejido | rancho"
                           onChange={handleChange}
                           onBlur={handleBlur}
                           onInput={(e) => handleInputFormik(e, setFieldValue, "type", false)}
                           fullWidth
                           error={errors.type && touched.type}
                           helperText={errors.type && touched.type && errors.type}
                        />
                     </Grid>
                     {/* Zona */}
                     <Grid item xs={12} md={6} sx={{ mb: 3 }}>
                        <FormControl fullWidth sx={{ alignItems: "center" }}>
                           <FormLabel id="zone-label">Zona</FormLabel>
                           <RadioGroup row aria-labelledby="zone-label" id="zone" name="zone" value={values.zone} onChange={handleChange} onBlur={handleBlur}>
                              <FormControlLabel value="urbana" control={<Radio />} label="Urbana" />
                              <FormControlLabel value="rural" control={<Radio />} label="Rural" />
                           </RadioGroup>
                           {touched.zone && errors.zone && (
                              <FormHelperText error id="ht-zone">
                                 {errors.zone}
                              </FormHelperText>
                           )}
                        </FormControl>
                     </Grid>
                     {/* Perímetro */}
                     <Grid item xs={12} md={12} sx={{ mb: 1 }}>
                        <Select2Component
                           idName={"perimeter_id"}
                           label={"Perímetro *"}
                           valueLabel={values.perimeter}
                           formDataLabel={"perimeter"}
                           placeholder={"Selecciona una opción..."}
                           options={perimeters}
                           fullWidth={true}
                           // handleChangeValueSuccess={handleChangeLevel}
                           handleBlur={handleBlur}
                           error={errors.perimeter_id}
                           touched={touched.perimeter_id}
                           disabled={false}
                           pluralName={"Perímetros"}
                           refreshSelect={getPerimetersSelectIndex}
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
      </SwipeableDrawer>
   );
};
export default CommunityForm;
