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
import SliderComponent from "../../../components/SliderComponent";

const AnswersScoresView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, answerScore, getAnswerScores } = useAnswerScoreContext();
   const [values1, setValues1] = useState([0, 10]);

   const ItemContainer = ({ question = "¿La pregunta?", options = [{ answer: "Opción 1", score: 0 }], optionsByRange = false }) => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               {/* <Divider variant="inset" component="li" /> */}
               {/* <ListItemButton alignItems="flex-start" onClick={() => handleClick(id, full_name)}> */}
               {/* <ListItemAvatar>
               <Avatar {...stringAvatar(full_name)} />
            </ListItemAvatar> */}
               <ListItemText
                  primary={
                     <Typography variant="h4" component={"b"}>
                        {question}
                     </Typography>
                  }
                  secondary={
                     <Fragment>
                        {optionsByRange ? (
                           <Box sx={{ width: 300 }}>
                              <SliderComponent width={300} min={0} max={100} values={values1} setValues={setValues1} />
                           </Box>
                        ) : (
                           <InputComponentv3
                              idName="b5_beds"
                              label="Camas"
                              type="number"
                              value={1}
                              placeholder="0"
                              // setFieldValue={{}}
                              // onChange={{}}
                              // onBlur={{}}
                              inputProps={{ min: 0, max: 100000 }}
                              // disabled={values.id == 0 ? false : true}
                              // error={{}}
                              // touched={{}}
                              // setStepFailed={{}}
                              // step={7}
                              size="normal"
                              // error={errors.b5_beds && touched.b5_beds}
                              // helperText={errors.b5_beds && touched.b5_beds && showErrorInput(4, errors.b5_beds)}
                           />
                        )}
                     </Fragment>
                  }
               />
               {/* </ListItemButton> */}
               <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
            </DialogContentText>
         </List>
      );
   };
   const ListContainer = () => {
      return <ItemContainer question="Cantidad de miembros en la casa" options={2} optionsByRange={true} />;
   };

   const titles = ["DATOS FAMILIARES", "DATOS ECONÓMICOS", "DATOS DE VIVIENDA", "EQUIPAMIENTO DOMÉSTICO", "PRGRAMA DE BECAS"];
   const containers = [<ListContainer />, <ListContainer />, <ListContainer />, <ListContainer />, <ListContainer />];

   useEffect(() => {
      try {
         setLoading(true);
         getAnswerScores();
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
         <AnswerScoreDT />
         <TabsComponent TabsTitles={titles} TabsContainer={containers} />
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
