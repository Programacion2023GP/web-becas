import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Typography } from "@mui/material";
import { useState } from "react";
import { useCycleContext } from "../../../context/CycleContext";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent } from "../../../components/Form/FormikComponents";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const CycleForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const {
      singularName,
      cycles,
      createCycle,
      updateCycle,
      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef,
      currentCycle
   } = useCycleContext();
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
         if (values.id == 0) axiosResponse = await createCycle(values);
         else axiosResponse = await updateCycle(values);
         if (axiosResponse.status === 200) {
            resetForm();
            resetFormData();
            setTextBtnSumbit("AGREGAR");
            setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         }
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         setLoadingAction(false);
         setOpenDialog(false);
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
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
      cycle_name: Yup.string().trim().required("Nombre del Ciclo requerido"),
      start_date: Yup.date("Fecha inválida").required("Fecha de Inicio requerida"),
      closing_date: Yup.date("Fecha inválida").required("Fecha de Cierre requerida")
   });

   useEffect(() => {
      try {
         if (currentCycle.id) {
            console.log("hay current", currentCycle);
            setFormData(currentCycle);
         }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <FormikComponent
         key={"formikComponentCycle"}
         initialValues={formData}
         validationSchema={validationSchema}
         onSubmit={onSubmit}
         textBtnSubmit={"GUARDAR"}
         formikRef={formikRef}
         handleCancel={handleCancel}
      >
         {JSON.stringify(formData)}
         <Grid container xs={12} spacing={2}>
            <DividerComponent title={<Typography variant="h3">DATOS DEL CICLO ACTUAL</Typography>} fontWeight={"bold"} textAlign="center" mb={1} />

            <InputComponent col={4} idName={"cycle_name"} label={"Nombre del Ciclo"} placeholder={"Ciclo Enero - Junio 2024"} />
            <DatePickerComponent col={4} idName={"start_date"} label={"Fehca de Inicio "} format={"DD/MM/YYYY"} />
            <DatePickerComponent col={4} idName={"closing_date"} label={"Fehca de Cierre "} format={"DD/MM/YYYY"} />
         </Grid>
      </FormikComponent>
   );
};
export default CycleForm;
