// import AnswerScoreForm from "./Form";

import { useEffect, useRef } from "react";
import { useAnswerScoreContext } from "../../../context/AnswerScoreContext";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Typography } from "@mui/material";
import Toast from "../../../utils/Toast";
import { colorPrimaryDark, gpcLight, useGlobalContext } from "../../../context/GlobalContext";
import { useSettingContext } from "../../../context/SettingContext";
import MainCard from "../../../ui-component/cards/MainCard";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useCycleContext } from "../../../context/CycleContext";
import CycleForm from "./CycleForm";

const SettingsView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { getCurrentCycle } = useCycleContext();
   const { pluralName } = useSettingContext();
   const formikRefSettings = useRef(null);
   // const { answerScore, getAnswerScores, getAnswerScoreActive } = useAnswerScoreContext();

   useEffect(() => {
      try {
         (async () => {
            setLoading(true);
            await getCurrentCycle();
            setLoading(false);
         })();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, []);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>

         <MainCard>
            <CycleForm />
         </MainCard>

         <DividerComponent title={""} mt={4} mb={4} />

         <MainCard>
            <FormikComponent
               key={"formikComponent"}
               initialValues={{}}
               validationSchema={{}}
               onSubmit={null}
               textBtnSubmit={"GUARDAR"}
               formikRef={formikRefSettings}
               handleCancel={null}
            >
               <Grid container xs={12} spacing={2}>
                  <Grid xs={12} md={6}>
                     <DividerComponent
                        title={<Typography variant="h3">CONFIGURACIONES PARA LA SOLICITU DE BECA</Typography>}
                        fontWeight={"bold"}
                        textAlign="center"
                        mb={1}
                     />
                     <ul>
                        <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem", textDecorationLine: "none" }}>
                           <Typography variant="h4" mb={1} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                              Periodo para solicitar becas
                           </Typography>
                           <Grid container spacing={2} mx={0.5}>
                              <DatePickerComponent col={6} idName={"start_date_request"} label={"Fehca de Inicio "} format={"DD/MM/YYYY"} />
                              <DatePickerComponent col={6} idName={"closing_date_request"} label={"Fehca de Cierre "} format={"DD/MM/YYYY"} />
                           </Grid>
                        </li>
                        <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                           <Typography variant="h4" mb={1} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                              Oportunidades por usuario para solicitar becas
                           </Typography>
                           <InputComponent col={6} idName={"opportunities"} label={"Cantidad"} placeholder={"0"} type={"number"} />
                        </li>
                        <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                           <Typography variant="h4" mb={2} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                              Montos mínimos para mostrar alerta en Ingresos y Egresos Mensuales
                           </Typography>
                           <Grid container spacing={2} mx={0.5}>
                              <InputComponent col={6} idName={"monthly_income_min"} label={"Monto en Ingresos"} placeholder={"0"} type={"number"} />
                              <InputComponent col={6} idName={"total_expenses_min"} label={"Monto en Engresos"} placeholder={"0"} type={"number"} />
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
                                 <InputComponent col={12} idName={"budget"} label={"Monto"} placeholder={"0"} type={"number"} />
                              </li>
                           </Grid>
                           <Grid xs={12} md={6}>
                              <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                                 <Typography variant="h4" mb={2} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                                    Becas Aprobadas
                                 </Typography>
                                 <InputComponent col={12} idName={"max_approved"} label={"Cantidad Máxima"} placeholder={"0"} type={"number"} />
                              </li>
                           </Grid>
                        </Grid>
                        <li style={{ border: `solid 2px ${colorPrimaryDark}`, borderRadius: "10px", marginBottom: "1rem" }}>
                           <Typography variant="h4" mb={2} sx={{ p: 0.5, backgroundColor: colorPrimaryDark, borderRadius: 1, color: gpcLight }}>
                              Entrega de Becas
                           </Typography>
                           <Grid container spacing={2} mx={0.5}>
                              <InputComponent col={6} idName={"total_payments"} label={"Cantidad de pagos"} placeholder={"0"} type={"number"} />
                              <Select2Component
                                 col={6}
                                 idName={"payment_frequency"}
                                 label={"Periodicidad de pago"}
                                 options={[
                                    { id: "1 month", label: "1 Mes" },
                                    { id: "2 months", label: "2 Meses" }
                                 ]}
                                 pluralName={""}
                                 refreshSelect={null}
                              />
                           </Grid>
                        </li>
                     </ul>
                  </Grid>
               </Grid>
            </FormikComponent>
         </MainCard>
      </>
   );
};

// export const loaderIndexAnswerScoresView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosAnswerScores = await Axios.get("/answerScores/selectIndex");
//       res.result.answerScores = axiosAnswerScores.data.data.result;
//       res.result.answerScores.unshift({ id: 0, label: "Selecciona una opción..." });
//       // // console.log(res);

//       return res;
//    } catch (error) {
//       const res = ErrorRes;
//       console.log(error);
//       res.message = error;
//       res.alert_text = error;
//       sAlert.Error(error);
//       return res;
//    }
// };

export default SettingsView;
