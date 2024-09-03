// import AnswerScoreForm from "./Form";

import { useEffect, useRef } from "react";
import { useAnswerScoreContext } from "../../../context/AnswerScoreContext";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Typography } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useSettingContext } from "../../../context/SettingContext";
import MainCard from "../../../ui-component/cards/MainCard";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";

const SettingsView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName } = useSettingContext();
   const formikRef = useRef(null);
   // const { answerScore, getAnswerScores, getAnswerScoreActive } = useAnswerScoreContext();

   useEffect(() => {
      try {
         setLoading(true);
         setLoading(false);
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

         <DividerComponent title={"SECCIÓN GENERAL"} mb={1} />
         <MainCard>
            <ul>
               <li>Algo</li>
            </ul>
         </MainCard>
         {/* <DividerComponent title={"SECCIÓN CATÁLOGOS"} mt={4} mb={1} />
         <MainCard>
            <ul>
               <li>Estados habilitados</li>
            </ul>
         </MainCard> */}
         <DividerComponent title={"SECCIÓN BECAS"} mt={4} mb={1} />
         <MainCard>
            <FormikComponent
               key={"formikComponent"}
               initialValues={{}}
               validationSchema={{}}
               onSubmit={null}
               textBtnSubmit={"GUARDAR"}
               formikRef={formikRef}
               handleCancel={null}
            >
               <Grid container xs={12} spacing={2}>
                  <Grid xs={12} md={6}>
                     <DividerComponent
                        title={<Typography variant="h3">Configuración en la solicitud de beca</Typography>}
                        fontWeight={"bold"}
                        textAlign="center"
                        mb={1}
                     />
                     <ul>
                        <li>
                           <Typography variant="h4" mb={1}>
                              Periodo para solicitar becas
                           </Typography>
                           <Grid container spacing={2}>
                              <DatePickerComponent col={6} idName={"start_date_request"} label={"Fehca de Inicio "} format={"DD/MM/YYYY"} />
                              <DatePickerComponent col={6} idName={"closing_date_request"} label={"Fehca de Cierre "} format={"DD/MM/YYYY"} />
                           </Grid>
                        </li>
                        <li>
                           <Typography variant="h4" mb={1}>
                              Oportunidades por usuario para solicitar becas
                           </Typography>
                           <InputComponent col={6} idName={"opportunities"} label={"Cantidad"} placeholder={"0"} type={"number"} />
                        </li>
                        <li>
                           <Typography variant="h4" mb={2}>
                              Montos mínimos para mostrar alerta en Ingresos y Egresos Mensuales
                           </Typography>
                           <Grid container spacing={2}>
                              <InputComponent col={6} idName={"monthly_income_min"} label={"Monto en Ingresos"} placeholder={"0"} type={"number"} />
                              <InputComponent col={6} idName={"total_expenses_min"} label={"Monto en Engresos"} placeholder={"0"} type={"number"} />
                           </Grid>
                        </li>
                     </ul>
                  </Grid>
                  <Grid xs={12} md={6}>
                     <DividerComponent title={<Typography variant="h3">Datos de beca</Typography>} fontWeight={"bold"} textAlign="center" mb={1} />
                     <ul>
                        <li>
                           <Typography variant="h4" mb={2}>
                              Presupuesto asignado
                           </Typography>
                           <Grid container spacing={2}>
                              <InputComponent col={6} idName={"budget"} label={"Monto"} placeholder={"0"} type={"number"} />
                           </Grid>
                        </li>
                        <li>
                           <Typography variant="h4" mb={2}>
                              Cantidad de pagos para beca
                           </Typography>
                           <Grid container spacing={2}>
                              <InputComponent col={6} idName={"total_payments"} label={"Cantidad"} placeholder={"0"} type={"number"} />
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
                        <li>
                           <Typography variant="h4" mb={2}>
                              Becas Aprobadas
                           </Typography>
                           <Grid container spacing={2}>
                              <InputComponent col={6} idName={"max_approved"} label={"Cantidad Máxima"} placeholder={"0"} type={"number"} />
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
