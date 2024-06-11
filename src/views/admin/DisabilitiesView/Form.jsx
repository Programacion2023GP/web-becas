import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useMemo, useState } from "react";
import { useDisabilityContext } from "../../../context/DisabilityContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { handleInputFormik } from "../../../utils/Formats";
import { FormikComponent, InputComponent } from "../../../components/Form/FormikComponents";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const DisabilityForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const {
      singularName,
      disabilities,
      createDisability,
      updateDisability,
      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef
   } = useDisabilityContext();
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
         if (values.id == 0) axiosResponse = await createDisability(values);
         else axiosResponse = await updateDisability(values);
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
      disability: Yup.string().trim().required("Nivel requerido")
   });

   useEffect(() => {
      try {
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

               {/* Discapacidad */}
               <InputComponent col={12} idName={"disability"} label={"Nombre de la Discapacidad *"} placeholder={"CEGUERA"} textStyleCase={true} />

               {/* Descripción */}
               <InputComponent col={12} idName={"description"} label={"Descripción"} placeholder={"Descripción de la discapacidad"} textStyleCase={null} />
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default DisabilityForm;
