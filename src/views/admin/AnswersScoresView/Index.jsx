import AnswerScoreForm from "./Form";
import AnswerScoreDT from "./DataTable";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { Fragment, useEffect, useState } from "react";
import { useAnswerScoreContext } from "../../../context/AnswerScoreContext";
import { Alert, AlertTitle, DialogContentText, Divider, List, ListItemText, Slider, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import ChartComponent from "../../../components/ChartComponent";
import TabsComponent from "../../../components/TabsComponent";
import { InputComponentv3 } from "../../../components/Form/InputComponent2";
import { Box } from "@mui/system";
import SliderComponent, { SliderWithScoreComponent } from "../../../components/SliderComponent";

const AnswersScoresView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, answerScore, getAnswerScores, getAnswerScoreActive } = useAnswerScoreContext();

   useEffect(() => {
      try {
         setLoading(true);
         getAnswerScoreActive();
         getAnswerScores();
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [answerScore]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         {/* <AnswerScoreDT /> */}
         {/* </MainCard> */}

         {/* <ChartComponent /> */}

         <AnswerScoreForm />
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

export default AnswersScoresView;
