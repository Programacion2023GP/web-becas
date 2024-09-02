// import AnswerScoreForm from "./Form";

import { useEffect, useRef } from "react";
import { useAnswerScoreContext } from "../../../context/AnswerScoreContext";
import { Typography } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useSettingContext } from "../../../context/SettingContext";
import MainCard from "../../../ui-component/cards/MainCard";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent } from "../../../components/Form/FormikComponents";

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
         <DividerComponent title={"SECCIÓN CATÁLOGOS"} mt={4} mb={1} />
         <MainCard>
            <ul>
               <li>Estados habilitados</li>
            </ul>
         </MainCard>
         <DividerComponent title={"SECCIÓN BECAS"} mt={4} mb={1} />
         <MainCard>
            <FormikComponent
               key={"formikComponent"}
               initialValues={{}}
               validationSchema={{}}
               onSubmit={null}
               textBtnSubmit={"textBtnSubmit"}
               formikRef={formikRef}
               handleCancel={null}
            >
               <ul>
                  <DividerComponent title={"Configuración en la solicitud de beca"} fontWeight={"bold"} textAlign="left" mb={1} />
                  <li>Inicio del periodo para solicitar becas</li>
                  <DatePickerComponent col={12} idName={"start_date_request"} label={"Fehca de Inicio para solicitar becas"} format={"DD/MM/YYYY"} />
                  <li>Fin del periodo para solicitar becas</li>
                  <DatePickerComponent col={12} idName={"closing_date_request"} label={"Fehca de Cierre para solicitar becas"} format={"DD/MM/YYYY"} />
                  <li>Monto mínimo para no mostrar alerta en Ingresos Mensuales</li>
                  {/* <NumericComponent col={12} idName={"monthly_income_min"} label={"Monto Minimo"} /> */}
                  <InputComponent col={12} idName={"monthly_income_min"} label={"Monto mínimo"} placeholder={"999"} type={"number"} />
                  <li>Monto mínimo para no mostrar alerta en Egresos Mensuales</li>
                  <InputComponent col={12} idName={"total_expenses_min"} label={"Monto mínimo"} placeholder={"999"} type={"number"} />
                  <DividerComponent title={"Ajustes de beca"} fontWeight={"bold"} textAlign="left" mt={2} mb={1} />
                  <li>Fecha límite para reasignar becas</li>
                  <li>Cantidad de pagos para beca</li>
                  <li>Presupuesto asignado</li>
                  <li>Presupuesto por beca</li>
               </ul>
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
