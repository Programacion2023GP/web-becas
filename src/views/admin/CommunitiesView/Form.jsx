import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from "@mui/material";
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
import { handleInputFormik } from "../../../utils/Formats";
import { usePerimeterContext } from "../../../context/PerimeterContext";
import {
   FormikComponent,
   InputComponent,
   InputsCommunityComponent,
   RadioButtonComponent,
   Select2Component,
   getCommunity
} from "../../../components/Form/FormikComponents";
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
      setFormTitle,
      formikRef,
      dataCommunityTypes
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
         // return console.log("onSubmit de FormCommunities ~ values", values);
         setLoadingAction(true);

         console.log("🚀 ~ createCommunity ~ BD: id, name, postalCode, type, zone, municipalities_id, perimeter_id");
         // Cambiar datos correspondientes
         values.postalCode = values.zip;
         values.municipality = values.city.label;

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
         setLoadingAction(false);
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
         setLoadingAction(false);
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
      zip: Yup.number("Solo números").required("Código Postal requerido"),
      name: Yup.string().trim().required("Communidad requerido"),
      // type: Yup.string()
      //    .typeError("Vuelve a seleccionar la opción deseada si aparece esta leyenda")
      //    .notOneOf(["Selecciona una opción..."], "Ésta opción no es valida"),
      // // .required("Tipo de Comunidad requerida"),
      zone: Yup.string().trim().required("Zona requerida"),
      perimeter_id: Yup.string()
         .typeError("Vuelve a seleccionar la opción deseada si aparece esta leyenda")
         .notOneOf(["Selecciona una opción..."], "Ésta opción no es valida")
         .required("Perímetro requerido")
   });

   useEffect(() => {
      try {
         console.log("formikRef", formikRef.current);
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
            <FormikComponent
               key={"formikComponent"}
               initialValues={formData}
               validationSchema={validationSchema}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               formikRef={formikRef}
               handleCancel={handleCancel}
            >
               <InputComponent col={12} idName={"id"} label={"ID"} placeholder={"ID"} textStyleCase={true} hidden={true} />

               {/* INPUTS DE COMUNIDAD */}
               <InputsCommunityComponent formData={formData} setFormData={setFormData} columnsByTextField={6} registerCommunity={true} />

               {/* Communidad */}
               <InputComponent col={12} idName={"name"} label={"Comunidad *"} placeholder={"Ejido la Esperanza"} textStyleCase={null} />

               {/* Tipo de Communidad */}
               <Select2Component
                  col={6}
                  idName={"type"}
                  label={"Tipo de Comunidad *"}
                  options={dataCommunityTypes}
                  pluralName={"colonia | fraccionamiento | ejido | rancho"}
               />

               {/* Zona */}
               <RadioButtonComponent
                  col={6}
                  idName={"zone"}
                  title={"Zona *"}
                  options={[
                     { value: "rural", label: "Rural" },
                     { value: "urbana", label: "Urbana" }
                  ]}
               />

               {/* Perímetro */}
               <Select2Component
                  col={12}
                  idName={"perimeter_id"}
                  label={"Perímetro *"}
                  options={perimeters}
                  pluralName={"Perímetros"}
                  refreshSelect={getPerimetersSelectIndex}
               />
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default CommunityForm;
