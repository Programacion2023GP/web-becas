import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import MainCard from "../../../ui-component/cards/MainCard";
import { DividerComponent } from "../../../components/Form/FormikComponents";
// import ChartComponent from "../../../components/ChartComponent";
import EarningCard from "../Default/EarningCard";
import TotalIncomeLightCard from "../Default/TotalIncomeLightCard";
import TotalIncomeDarkCard from "../Default/TotalIncomeDarkCard";
import { ChartComponent } from "../../../components/Charts/ChartComponent";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { groupBy, unifyBy } from "../../../utils/Formats";

const objDataGraphs = {
   chart: ["bar", "pie"],
   enable3D: [false, true],
   name: "",
   data: [],
   titles: [],
   values: [],
   inCard: true,
   width: 12
};
const DashboardIndex = () => {
   // const { result } = useLoaderData();
   const { loading, setLoading } = useGlobalContext();
   const { getRequestApproved, requestBecasApproved } = useRequestBecaContext();
   const [dataGraphsByGender, setDataGraphsByGender] = useState({
      chart: ["bar", "pie"],
      enable3D: [false, true],
      name: "Becas Entregadas por Genero",
      data: [],
      titles: ["MASCULINO", "FEMENINO"],
      values: [],
      inCard: true,
      width: 12
   });
   const [dataGraphsBySchool, setDataGraphsBySchool] = useState({
      chart: ["bar", "pie"],
      enable3D: [false, true],
      name: "Becas Entregadas por Escuela",
      data: [],
      titles: [],
      values: [],
      inCard: true,
      width: 12
   });
   const [dataGraphs, setDataGraphs] = useState([]);

   const getDataGraphs = async () => {
      try {
         const axiosResponse = await getRequestApproved();
         const data = await axiosResponse.result.requestBecasApproved;
         await getDataBecasApprovedByGender(data);
         await getDataBecasApprovedBySchool(data);
         const uniques = unifyBy(dataGraphs, "name");
         setDataGraphs(uniques);
      } catch (error) {
         console.log("🚀 ~ getDataGraphs ~ error:", error);
         Toast.Error(error);
      }
   };
   const getDataBecasApprovedByGender = async (data) => {
      try {
         const masculinos = data.filter((d) => d.gender == "MASCULINO");
         const femeninos = data.filter((d) => d.gender == "FEMENINO");
         const titles = ["MASCULINO", "FEMENINO"];
         const values = [];
         values.push(masculinos.length);
         values.push(femeninos.length);

         const _data = { ...objDataGraphs };
         _data.name = "Becas Entregadas por Genero";
         _data.data = data;
         _data.titles = titles;
         _data.values = values;

         dataGraphs.push(_data);
         setDataGraphs(dataGraphs);
      } catch (error) {
         console.log("🚀 ~ getDataBecasApprovedByGender ~ error:", error);
         Toast.Error(error);
      }
   };
   const getDataBecasApprovedBySchool = async (data) => {
      try {
         const groupedValues = groupBy(data, "school", true);
         const titles = groupedValues.map((item) => item[0]);
         const values = [];
         groupedValues.map((item) => {
            values.push(item[1].length);
         });

         const _data = { ...objDataGraphs };
         _data.name = "Becas Entregadas por Escuela";
         _data.data = data;
         _data.titles = titles;
         _data.values = values;

         dataGraphs.push(_data);
         setDataGraphs(dataGraphs);
      } catch (error) {
         console.log("🚀 ~ getDataBecasApprovedBySchool ~ error:", error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      try {
         const init = async () => {
            setLoading(true);
            await getDataGraphs();
            setLoading(false);
         };
         init();
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
            {"TABLERO GENERAL".toUpperCase()}
         </Typography>

         <Grid container spacing={2}>
            <Grid item xs={12}>
               <Grid container spacing={2}>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                     <TotalIncomeDarkCard isLoading={loading} title={"Usuarios"} caption={"cantidad de usuarios registrados"} icon={"IconUsers"} quantity={1500} />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                     <TotalIncomeLightCard
                        isLoading={loading}
                        title={"Becas Aplicadas"}
                        caption={"Becas sin contar canceladas"}
                        icon={"IconFileStack"}
                        quantity={51}
                     />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                     <TotalIncomeDarkCard
                        isLoading={loading}
                        title={"Presupuesto"}
                        caption={"cantidad del recurso asignado a becas"}
                        icon={"IconBusinessplan"}
                        quantity={"$500,000"}
                     />
                  </Grid>
               </Grid>
            </Grid>

            <Grid item xs={12}>
               <DividerComponent title={"Gráficas"} />
            </Grid>

            {dataGraphs.map((graph) => (
               <>
                  <Grid item xs={12}>
                     <Grid container spacing={2}>
                        {graph.chart.map((chart, i) => (
                           <Grid item md={6} xs={12}>
                              <ChartComponent
                                 key={`key-${graph.name}-${chart}`}
                                 chart={chart}
                                 name={graph.name}
                                 titles={graph.titles}
                                 values={graph.values}
                                 inCard={graph.inCard}
                                 width={graph.width}
                                 enable3D={graph.enable3D[i]}
                              />
                           </Grid>
                        ))}
                     </Grid>
                  </Grid>
               </>
            ))}
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
