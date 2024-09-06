// import AnswerScoreForm from "./Form";

import { useEffect, useRef } from "react";
import { useAnswerScoreContext } from "../../../context/AnswerScoreContext";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Alert, AlertTitle, Backdrop, Typography } from "@mui/material";
import Toast from "../../../utils/Toast";
import { colorPrimaryDark, gpcLight, useGlobalContext } from "../../../context/GlobalContext";
import { useSettingContext } from "../../../context/SettingContext";
import MainCard from "../../../ui-component/cards/MainCard";
import { DatePickerComponent, DividerComponent, FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useCycleContext } from "../../../context/CycleContext";
import CycleForm from "./CycleForm";
import { theme } from "./../../../themes/index";
import SettingForm from "./Form";

const SettingsView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { currentCycle, getCurrentCycle } = useCycleContext();
   const { pluralName, getCurrentSettings } = useSettingContext();

   useEffect(() => {
      try {
         (async () => {
            setLoading(true);
            await getCurrentCycle();
            await getCurrentSettings();
            setLoading(false);
         })();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, []);

   return (
      <>
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>

         <MainCard>
            <CycleForm />
         </MainCard>

         <DividerComponent title={""} mt={4} />
         {!currentCycle && (
            <Alert severity="info" sx={{ mb: 1 }}>
               <AlertTitle>SIN CICLO NO HAY CONFIGURACIÓN</AlertTitle>
               Si no hay un ciclo vigente, no puede haber una configuración ni realizar solicitudes de becas.
            </Alert>
         )}

         <MainCard>
            <SettingForm />
         </MainCard>
      </>
   );
};

// export const loaderIndexSettingsView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosSettings = await Axios.get("/answerScores/selectIndex");
//       res.result.answerScores = axiosSettings.data.data.result;
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
