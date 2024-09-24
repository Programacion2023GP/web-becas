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
import { useSettingContext } from "../../../context/SettingContext";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const CycleForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const {
      singularName,
      settings,
      createOrUpdateCycle,
      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef,
      currentSettings
   } = useSettingContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const handleChangeCheckAdd = (e) => {
      try {
         const active = e.target.checked;
         localStorage.setItem("checkAdd", active);
         setCheckAdd(active);
         setColorLabelcheck("");
         setTextBtnSumbit("CREAR NUEVO CICLO");
         if (!active) setColorLabelcheck("#ccc");
         formikRef.current.resetForm();
         setOpenDialog(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // return console.log("values", values);
         setLoadingAction(true);
         let axiosResponse = await createOrUpdateCycle(values);
         if (axiosResponse.status === 200) {
            resetForm();
            resetFormData();
            setTextBtnSumbit("CREAR NUEVO CICLO");
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
      cycle_start: Yup.date("Fecha inválida").required("Fecha de Inicio requerida"),
      cycle_end: Yup.date("Fecha inválida").required("Fecha de Cierre requerida")
   });

   useEffect(() => {
      try {
         // console.log("🚀 ~ CycleForm ~ currentSettings:", currentSettings);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData, currentSettings]);

   return (
      <>
         <Grid container xs={12} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
            {currentSettings ? (
               <>
                  <Typography variant="h4">CICLO ACTUAL VIGENTE:</Typography>
                  <Tooltip title="Nombre del ciclo">
                     <Typography variant="h4">{currentSettings?.cycle_name}</Typography>
                  </Tooltip>
                  <Tooltip title="Fecha de Inicio">
                     <Typography variant="h4" display={"flex"} alignItems={"end"}>
                        <IconCalendarTime />
                        &nbsp; {currentSettings?.cycle_start}
                     </Typography>
                  </Tooltip>
                  <Tooltip title="Fecha de Termino">
                     <Typography variant="h4" display={"flex"} alignItems={"end"}>
                        <IconCalendarX />
                        &nbsp; {currentSettings?.cycle_end}
                     </Typography>
                  </Tooltip>
               </>
            ) : (
               <Typography variant="h4">NO HAY CICLO ACTIVO</Typography>
            )}
            <Button color="secondary" sx={{ fontWeight: "bolder" }} onClick={handleChangeCheckAdd}>
               NUEVO CICLO
            </Button>
         </Grid>
         <SwipeableDrawer anchor={"top"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
            <Box role="presentation" p={3} pt={5} className="">
               <Grid container mb={2}>
                  <Grid item xs={12}>
                     <Typography variant="h2" textAlign={"center"}>{`${formTitle.split(" ")[0]} CICLO`}</Typography>
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
                  textBtnSubmit={textBtnSubmit}
                  formikRef={formikRef}
                  handleCancel={handleCancel}
               >
                  <Grid container xs={12} spacing={2}>
                     <InputComponent col={4} idName={"cycle_name"} label={"Nombre del Ciclo"} placeholder={"Ciclo Enero - Junio 2024"} />
                     <DatePickerComponent col={4} idName={"cycle_start"} label={"Fecha de Inicio "} format={"DD/MM/YYYY"} />
                     <DatePickerComponent col={4} idName={"cycle_end"} label={"Fecha de Cierre "} format={"DD/MM/YYYY"} />
                  </Grid>
               </FormikComponent>
            </Box>
         </SwipeableDrawer>
      </>
   );
};
export default CycleForm;
