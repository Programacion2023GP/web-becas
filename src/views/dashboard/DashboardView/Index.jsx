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
import { useCommunityContext } from "../../../context/CommunityContext";
import { useUserContext } from "../../../context/UserContext";

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
   const { getCommunities } = useCommunityContext();
   const { getRequestBecas, getRequestApproved } = useRequestBecaContext();
   const { getUsers } = useUserContext();

   const [usersCiudadanos, setUsersCiudadanos] = useState(0);
   const [becasApplied, setBecasApplied] = useState(0);
   const [dataGraphs, setDataGraphs] = useState([]);

   const getDataGraphs = async () => {
      try {
         const axiosUsers = await getUsers();
         setUsersCiudadanos(axiosUsers.result.users.filter((u) => u.role_id == 3).length);
         const axiosBecasApplied = await getRequestBecas();
         setBecasApplied(axiosBecasApplied.result.filter((b) => b.status != "CANCELADA").length);
         const axiosCommunities = await getCommunities();
         // console.log("🚀 ~ getDataGraphs ~ axiosCommunities:", axiosCommunities)
         const communities = await axiosCommunities.result.communities;
         const axiosBecasApproved = await getRequestApproved();
         // console.log("🚀 ~ getDataGraphs ~ axiosBecasApproved:", axiosBecasApproved);
         const data = await axiosBecasApproved.result.requestBecasApproved;
         await data.map((d) => {
            d.community = communities.find((c) => c.id == d.community_id);
            d.school_community = communities.find((c) => c.id == d.school_community_id);
         });

         await getDataBecasApprovedByGender(data);
         await getDataBecasApprovedBySchool(data);
         await getDataBecasApprovedByZone(data);
         await getDataBecasApprovedByPerimeter(data);
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
   const getDataBecasApprovedByZone = async (data) => {
      try {
         const urbanos = data.filter((d) => d.community.Zona.toUpperCase() == "URBANA");
         const rural = data.filter((d) => d.community.Zona.toUpperCase() == "RURAL");
         const titles = ["URBANA", "RURAL"];
         const values = [];
         values.push(urbanos.length);
         values.push(rural.length);

         const _data = { ...objDataGraphs };
         _data.name = "Becas Entregadas por Zona";
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
   const getDataBecasApprovedByPerimeter = async (data) => {
      try {
         const groupedValues = groupBy(data, "community.Perimetro", true);
         const titles = groupedValues.map((item) => item[0].toUpperCase());
         const values = [];
         groupedValues.map((item) => {
            values.push(item[1].length);
         });

         const _data = { ...objDataGraphs };
         _data.name = "Becas Entregadas por Perímetro";
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
                     <TotalIncomeDarkCard isLoading={loading} title={"Usuarios"} caption={"ciudadanos registrados"} icon={"IconUsers"} quantity={usersCiudadanos} />
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                     <TotalIncomeLightCard
                        isLoading={loading}
                        title={"Becas Aplicadas"}
                        caption={"Becas sin contar canceladas"}
                        icon={"IconFileStack"}
                        quantity={becasApplied}
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
