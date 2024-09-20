import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, FormControlLabel, SwipeableDrawer, Switch, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useSettingContext } from "../../../context/SettingContext";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { colorPrimaryDark, gpcLight, useGlobalContext } from "../../../context/GlobalContext";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { formatCurrency, formatDatetime } from "../../../utils/Formats";
import { Box } from "@mui/system";
import { IconCalendarTime } from "@tabler/icons";
import { IconCalendarX } from "@tabler/icons-react";
import { useCycleContext } from "../../../context/CycleContext";
import dayjs from "dayjs";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const SettingForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const {
      singularName,
      settings,
      createSetting,
      updateSetting,
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
   // const { currentCycle } = useCycleContext();
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
         const today = dayjs();
         const start_date = dayjs(values.start_date_request);
         const closing_date = dayjs(values.closing_date_request);
         values.request_enabled = today.isBetween(start_date, closing_date, "day", "[]");
         // values.cycle_id = currentCycle.id;

         // return console.log("values", values);
         setLoadingAction(true);
         // if ()

         let axiosResponse;
         if (values.id < 1) axiosResponse = await createSetting(values);
         else axiosResponse = await updateSetting(values);
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
      // description: Yup.string().trim().required("Descripción de la configuración requerido"),
      start_date_request: Yup.date("Fecha inválida").required("Fecha de Inicio requerida"),
      closing_date_request: Yup.date("Fecha inválida").required("Fecha de Cierre requerida"),
      opportunities: Yup.number().required("Oportunidades requerido"),
      monthly_income_min: Yup.number().required("Monto de ingresos mínimo requerido"),
      total_expenses_min: Yup.number().required("Monto de egresos mínimo requerido"),
      budget: Yup.number().required("Monto de presupuesto requerido"),
      max_approved: Yup.number().required("Cantidad de solicitudes a aprobar requerido"),
      total_payments: Yup.number().required("Cantidad de pagos requerido"),
      payment_frequency: Yup.string().trim().required("Periodisidad de pago requerido")
   });

   useEffect(() => {
      try {
         (async () => {
            if (currentSettings) {
               // console.log("🚀 ~ useEffect ~ currentSettings:", currentSettings);
               await setFormData(currentSettings);
            }
         })();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <>
         <FormikComponent
            key={"formikComponent"}
            initialValues={currentSettings ? currentSettings : formData}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            textBtnSubmit={"GUARDAR CONFIGURACIÓN"}
            formikRef={formikRef}
            handleCancel={handleCancel}
            showCancelButton={false}
         >
            <InputComponent col={12} idName={"id"} label={"ID"} placeholder={"0"} type={"number"} hidden={true} />

            {/* <InputComponent col={12} idName={"description"} label={"Descripción de la configuración"} placeholder={"..."} disabled={!currentSettings?.cycle_name} /> */}
            <Grid container xs={12} spacing={2}>
               <Grid xs={12} md={6}>
                  <DividerComponent
                     title={<Typography variant="h3">CONFIGURACIONES PARA LA SOLICITUD DE BECA</Typography>}
                     fontWeight={"bold"}
                     textAlign="center"
                     mb={1}
                  />
                  <ul>
                     <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem", textDecorationLine: "none" }}>
                        <Typography variant="h4" mb={1} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                           Periodo para solicitar becas
                        </Typography>
                        <Grid container spacing={2} mx={0.5} py={1.6}>
                           <DatePickerComponent
                              col={6}
                              idName={"start_date_request"}
                              label={"Fehca de Inicio "}
                              format={"DD/MM/YYYY"}
                              disabled={!currentSettings?.cycle_name}
                           />
                           <DatePickerComponent
                              col={6}
                              idName={"closing_date_request"}
                              label={"Fehca de Cierre "}
                              format={"DD/MM/YYYY"}
                              disabled={!currentSettings?.cycle_name}
                           />
                        </Grid>
                     </li>
                     <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                        <Typography variant="h4" mb={1} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                           Oportunidades por usuario para solicitar becas
                        </Typography>
                        <InputComponent
                           col={6}
                           idName={"opportunities"}
                           label={"Cantidad"}
                           placeholder={"0"}
                           type={"number"}
                           disabled={!currentSettings?.cycle_name}
                        />
                     </li>
                     <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                        <Typography variant="h4" mb={2} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                           Montos mínimos para mostrar alerta en Ingresos y Egresos Mensuales
                        </Typography>
                        <Grid container spacing={2} mx={0.5}>
                           <InputComponent
                              col={6}
                              idName={"monthly_income_min"}
                              label={"Monto en Ingresos"}
                              placeholder={"0"}
                              type={"number"}
                              disabled={!currentSettings?.cycle_name}
                           />
                           <InputComponent
                              col={6}
                              idName={"total_expenses_min"}
                              label={"Monto en Engresos"}
                              placeholder={"0"}
                              type={"number"}
                              disabled={!currentSettings?.cycle_name}
                           />
                        </Grid>
                     </li>
                  </ul>
               </Grid>
               <Grid xs={12} md={6}>
                  <DividerComponent title={<Typography variant="h3">INFORMACIÓN PARA ENTREGA DE BECA</Typography>} fontWeight={"bold"} textAlign="center" mb={1} />
                  <ul>
                     <Grid container spacing={2}>
                        <Grid xs={12} md={6}>
                           <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                              <Typography variant="h4" mb={2} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                                 Presupuesto asignado
                              </Typography>
                              <InputComponent col={12} idName={"budget"} label={"Monto"} placeholder={"0"} type={"number"} disabled={!currentSettings?.cycle_name} />
                           </li>
                        </Grid>
                        <Grid xs={12} md={6}>
                           <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                              <Typography variant="h4" mb={2} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                                 Becas Aprobadas
                              </Typography>
                              <InputComponent
                                 col={12}
                                 idName={"max_approved"}
                                 label={"Cantidad Máxima"}
                                 placeholder={"0"}
                                 type={"number"}
                                 disabled={!currentSettings?.cycle_name}
                              />
                           </li>
                        </Grid>
                     </Grid>
                     <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                        <Typography variant="h4" mb={2} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                           Entrega de Becas
                        </Typography>
                        <Grid container spacing={2} mx={0.5}>
                           <InputComponent
                              col={6}
                              idName={"total_payments"}
                              label={"Cantidad de pagos"}
                              placeholder={"0"}
                              type={"number"}
                              inputProps={{ maxLength: 1, min: 1, max: 3 }}
                              disabled={!currentSettings?.cycle_name}
                           />
                           <Select2Component
                              col={6}
                              idName={"payment_frequency"}
                              label={"Periodicidad de pago"}
                              options={[
                                 { id: "1 month", label: "1 Mes" },
                                 { id: "2 months", label: "2 Meses" },
                                 { id: "3 months", label: "3 Meses" }
                              ]}
                              pluralName={""}
                              refreshSelect={null}
                              disabled={!currentSettings?.cycle_name}
                           />
                        </Grid>
                     </li>
                     <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                        <Typography variant="h4" mb={2} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                           CALCULOS
                        </Typography>
                        <Grid container spacing={2} mx={0.5}>
                           <Grid xs={12}>
                              <Typography variant="h5" mb={2}>
                                 Monto por Beca: {formatCurrency(!currentSettings ? 0 : currentSettings?.budget / currentSettings?.max_approved)}
                              </Typography>
                              <Typography variant="h5" mb={2}>
                                 Monto por Pago :
                                 {formatCurrency(!currentSettings ? 0 : currentSettings?.budget / currentSettings?.max_approved / currentSettings?.total_payments)}
                              </Typography>
                           </Grid>
                        </Grid>
                     </li>
                  </ul>
               </Grid>
            </Grid>
         </FormikComponent>
      </>
   );
};
export default SettingForm;
