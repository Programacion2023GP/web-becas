import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControlLabel, SwipeableDrawer, Switch, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useCycleContext } from "../../../context/CycleContext";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent } from "../../../components/Form/FormikComponents";
import { formatDatetime } from "../../../utils/Formats";
import { Box } from "@mui/system";
import { IconCalendarTime } from "@tabler/icons";
import { IconCalendarX } from "@tabler/icons-react";

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
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <>
         <Grid container xs={12} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
            {currentCycle ? (
               <>
                  <Typography variant="h4">CICLO ACTUAL VIGENTE:</Typography>
                  <Tooltip title="Nombre del ciclo">
                     <Typography variant="h4">{currentCycle.cycle_name}</Typography>
                  </Tooltip>
                  <Tooltip title="Fecha de Inicio">
                     <Typography variant="h4" display={"flex"} alignItems={"end"}>
                        <IconCalendarTime />
                        &nbsp; {currentCycle.start_date}
                     </Typography>
                  </Tooltip>
                  <Tooltip title="Fecha de Termino">
                     <Typography variant="h4" display={"flex"} alignItems={"end"}>
                        <IconCalendarX />
                        &nbsp; {currentCycle.closing_date}
                     </Typography>
                  </Tooltip>
               </>
            ) : (
               <Typography variant="h4">NO HAY CICLO ACTIVO</Typography>
            )}
            <Button color="secondary" sx={{ fontWeight: "bolder" }} onClick={() => setOpenDialog(true)}>
               NUEVO CICLO
            </Button>
         </Grid>
         <SwipeableDrawer anchor={"top"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
            <Box role="presentation" p={3} pt={5} className="">
               <Grid container mb={2}>
                  <Grid item xs={8} pr={3}>
                     <Typography variant="h2">{formTitle}</Typography>
                  </Grid>
                  {/* <Grid item xs={4}>
                     <FormControlLabel
                        sx={{ float: "right", color: colorLabelcheck }}
                        control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                        label="Seguir Agregando"
                     />
                  </Grid> */}
               </Grid>
               <FormikComponent
                  key={"formikComponentCycle"}
                  initialValues={formData}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  textBtnSubmit={"GUARDAR"}
                  formikRef={formikRef}
                  handleCancel={handleCancel}
               >
                  <Grid container xs={12} spacing={2}>
                     <InputComponent col={4} idName={"cycle_name"} label={"Nombre del Ciclo"} placeholder={"Ciclo Enero - Junio 2024"} />
                     <DatePickerComponent col={4} idName={"start_date"} label={"Fehca de Inicio "} format={"DD/MM/YYYY"} />
                     <DatePickerComponent col={4} idName={"closing_date"} label={"Fehca de Cierre "} format={"DD/MM/YYYY"} />
                  </Grid>
               </FormikComponent>
            </Box>
         </SwipeableDrawer>
      </>
   );
};
export default CycleForm;
