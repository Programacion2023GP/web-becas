import { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import MainCard from "../../../ui-component/cards/MainCard";
import { DividerComponent } from "../../../components/Form/FormikComponents";
import ChartComponent from "../../../components/ChartComponent";
import EarningCard from "../Default/EarningCard";
import TotalIncomeLightCard from "../Default/TotalIncomeLightCard";
import TotalIncomeDarkCard from "../Default/TotalIncomeDarkCard";

const DashboardIndex = () => {
   // const { result } = useLoaderData();
   const { loading, setLoading } = useGlobalContext();

   useEffect(() => {
      try {
         setLoading(true);
         // getAnswerScoreActive();
         // getAnswerScores();
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
            {"DASHBOARD".toUpperCase()}
         </Typography>

         <Grid container spacing={2}>
            <Grid item xs={12}>
               <Grid container spacing={2}>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                     <TotalIncomeDarkCard isLoading={loading} title={"Usuarios"} caption={"cantidad de usuarios registrados"} icon={"IconUsers"} quantity={1500} />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                     <TotalIncomeLightCard isLoading={loading} title={"Usuarios"} caption={"cantidad de usuarios registrados"} icon={"IconUsers"} quantity={1500} />
                  </Grid>
               </Grid>
            </Grid>

            <Grid item xs={12}>
               <DividerComponent title={"Datos generales"} />
            </Grid>

            <Grid item xs={12}>
               <MainCard>
                  <ChartComponent />
               </MainCard>
            </Grid>
         </Grid>
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

export default DashboardIndex;
