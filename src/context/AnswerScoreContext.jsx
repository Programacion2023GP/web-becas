import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
// import { socket } from "./GlobalContext";

const AnswerScoreContext = createContext();

const formDataInitialStateDB = {
   id: 0,
   family_1: "",
   economic_1: "",
   economic_2: "",
   house_1: "",
   house_2: "",
   house_3: "",
   household_equipment_1: "",
   household_equipment_2: "",
   household_equipment_3: "",
   household_equipment_4: "",
   household_equipment_5: "",
   household_equipment_6: "",
   household_equipment_7: "",
   household_equipment_8: "",
   household_equipment_9: "",
   service_1: 0,
   service_2: 0,
   service_3: 0,
   service_4: 0,
   service_5: 0,
   service_6: 0,
   service_7: 0,
   scholarship_1: 0,
   scholarship_2: 0,
   scholarship_3: 0,
   scholarship_4: 0,
   total_score: 0,
   medium_score: 0,
   medium_low_score: 0,
   low_score: 0
};

const formDataInitialState = {
   id: 0,
   family_1_1_min: 0,
   family_1_1_max: 0,
   family_1_1: 0,
   family_1_2_min: 0,
   family_1_2_max: 0,
   family_1_2: 0,
   family_1_3_min: 0,
   family_1_3_max: 0,
   family_1_3: 0,

   economic_1_1_min: 0,
   economic_1_1_max: 0,
   economic_1_1: 0,
   economic_1_2_min: 0,
   economic_1_2_max: 0,
   economic_1_2: 0,
   economic_1_3_min: 0,
   economic_1_3_max: 0,
   economic_1_3: 0,
   economic_2_1_min: 0,
   economic_2_1_max: 0,
   economic_2_1: 0,
   economic_2_2_min: 0,
   economic_2_2_max: 0,
   economic_2_2: 0,
   economic_2_3_min: 0,
   economic_2_3_max: 0,
   economic_2_3: 0,

   house_1_1: 0,
   house_1_2: 0,
   house_1_3: 0,
   house_1_4: 0,
   house_2_1: 0,
   house_2_2: 0,
   house_3_1: 0,
   house_3_2: 0,
   house_3_3: 0,

   household_equipment_1_1_min: 0,
   household_equipment_1_1_max: 0,
   household_equipment_1_1: 0,
   household_equipment_1_2_min: 0,
   household_equipment_1_2_max: 0,
   household_equipment_1_2: 0,
   household_equipment_1_3_min: 0,
   household_equipment_1_3_max: 0,
   household_equipment_1_3: 0,
   household_equipment_2_1_min: 0,
   household_equipment_2_1_max: 0,
   household_equipment_2_1: 0,
   household_equipment_2_2_min: 0,
   household_equipment_2_2_max: 0,
   household_equipment_2_2: 0,
   household_equipment_2_3_min: 0,
   household_equipment_2_3_max: 0,
   household_equipment_2_3: 0,
   household_equipment_3_1_min: 0,
   household_equipment_3_1_max: 0,
   household_equipment_3_1: 0,
   household_equipment_3_2_min: 0,
   household_equipment_3_2_max: 0,
   household_equipment_3_2: 0,
   household_equipment_3_3_min: 0,
   household_equipment_3_3_max: 0,
   household_equipment_3_3: 0,
   household_equipment_4_1_min: 0,
   household_equipment_4_1_max: 0,
   household_equipment_4_1: 0,
   household_equipment_4_2_min: 0,
   household_equipment_4_2_max: 0,
   household_equipment_4_2: 0,
   household_equipment_4_3_min: 0,
   household_equipment_4_3_max: 0,
   household_equipment_4_3: 0,
   household_equipment_5_1_min: 0,
   household_equipment_5_1_max: 0,
   household_equipment_5_1: 0,
   household_equipment_5_2_min: 0,
   household_equipment_5_2_max: 0,
   household_equipment_5_2: 0,
   household_equipment_5_3_min: 0,
   household_equipment_5_3_max: 0,
   household_equipment_5_3: 0,
   household_equipment_6_1_min: 0,
   household_equipment_6_1_max: 0,
   household_equipment_6_1: 0,
   household_equipment_6_2_min: 0,
   household_equipment_6_2_max: 0,
   household_equipment_6_2: 0,
   household_equipment_6_3_min: 0,
   household_equipment_6_3_max: 0,
   household_equipment_6_3: 0,
   household_equipment_7_1_min: 0,
   household_equipment_7_1_max: 0,
   household_equipment_7_1: 0,
   household_equipment_7_2_min: 0,
   household_equipment_7_2_max: 0,
   household_equipment_7_2: 0,
   household_equipment_7_3_min: 0,
   household_equipment_7_3_max: 0,
   household_equipment_7_3: 0,
   household_equipment_8_1_min: 0,
   household_equipment_8_1_max: 0,
   household_equipment_8_1: 0,
   household_equipment_8_2_max: 0,
   household_equipment_8_2_min: 0,
   household_equipment_8_2: 0,
   household_equipment_8_3_min: 0,
   household_equipment_8_3_max: 0,
   household_equipment_8_3: 0,
   household_equipment_9_1_min: 0,
   household_equipment_9_1_max: 0,
   household_equipment_9_1: 0,
   household_equipment_9_2_min: 0,
   household_equipment_9_2_max: 0,
   household_equipment_9_2: 0,
   household_equipment_9_3_min: 0,
   household_equipment_9_3_max: 0,
   household_equipment_9_3: 0,

   service_1: 0,
   service_2: 0,
   service_3: 0,
   service_4: 0,
   service_5: 0,
   service_6: 0,
   service_7: 0,

   scholarship_1: 0,
   scholarship_2: 0,
   scholarship_3: 0,
   scholarship_4: 0,

   total_score: 0,
   medium_score: 0,
   medium_low_score: 0,
   low_score: 0
};

export default function AnswerScoreContextProvider({ children }) {
   const singularName = "Respuesta y Puntaje"; //Escribirlo siempre letra Capital
   const pluralName = "Respuestas y Puntajes"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [answerScores, setAnswerScores] = useState([]);
   const [answerScore, setAnswerScore] = useState(formDataInitialState);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };
   const resetAnswerScore = () => {
      try {
         setAnswerScore(formDataInitialState);
      } catch (error) {
         console.log("Error en resetAnswerScore:", error);
      }
   };

   const mappingQuestions = async (obj, arrayQuestions, questionName, optionType) => {
      // console.log("mappingQuestions", obj);
      arrayQuestions.map((questions, qi) => {
         if (optionType === "range")
            questions.map((r, i) => {
               let q = qi + 1;
               // console.log("reg", r);
               const reg = r.trim();
               // console.log("reg", reg);
               const op = reg.split(":")[0];
               // console.log("op", op);
               const data = reg.split(":")[1];
               // console.log("data", data);
               const min = data.split("-")[0];
               const max = data.split("-")[1].split("=")[0];
               const pts = data.split("=")[1];
               // console.log("dataReal: ", `${questionName}_${q}_${op}: ${min}-${max}=${pts}`);
               obj[`${questionName}_${q}_${op}_min`] = Number(min);
               obj[`${questionName}_${q}_${op}_max`] = Number(max);
               obj[`${questionName}_${q}_${op}`] = Number(pts);

               // console.log(`${questionName}_${q}_${op}`);
               // console.log(obj);
            });
         else if (optionType === "multiple")
            questions.map((r, i) => {
               let q = qi + 1;
               // console.log("reg", r);
               const reg = r.trim();
               // console.log("reg", reg);
               const op = reg.split(":")[0];
               // console.log("op", op);
               const pts = reg.split(":")[1];
               // console.log("data", pts);
               // console.log("dataReal: ", `${questionName}_${q}_${op}= ${pts}`);
               obj[`${questionName}_${q}_${op}`] = Number(pts);
            });
         else if (optionType === "check") {
            // console.log(questions);
            let q = qi + 1;
            const pts = questions;
            // console.log("pts", pts);
            // console.log("dataReal: ", `${questionName}_${q}= ${pts}`);
            obj[`${questionName}_${q}`] = Number(pts);
         }
      });
   };
   const fillAnswerScore = async (answer_score) => {
      // console.log("fillAnswerScore -> answer_score", answer_score);
      if (!answer_score) return;
      answerScore.id = answer_score.id;
      answerScore.total_score = answer_score.total_score;
      answerScore.medium_score = answer_score.medium_score;
      answerScore.medium_low_score = answer_score.medium_low_score;
      answerScore.low_score = answer_score.low_score;
      // console.log(answerScore);

      const familys = [];
      familys.push(answer_score.family_1.split(","));
      // console.log("familys", familys);
      // console.log(answerScore);
      await mappingQuestions(answerScore, familys, "family", "range");
      // console.log(answerScore);

      const economics = [];
      economics.push(answer_score.economic_1.split(","));
      economics.push(answer_score.economic_2.split(","));
      // console.log(economics);
      // console.log(answerScore);
      await mappingQuestions(answerScore, economics, "economic", "range");
      // console.log(answerScore);

      const houses = [];
      // console.log(answer_score.house_1);
      houses.push(answer_score.house_1.split(","));
      houses.push(answer_score.house_2.split(","));
      houses.push(answer_score.house_3.split(","));
      // console.log(houses);
      // console.log(answerScore);
      await mappingQuestions(answerScore, houses, "house", "multiple");
      // console.log(answerScore);

      const household_equipments = [];
      // console.log(answer_score.household_equipment_1);
      household_equipments.push(answer_score.household_equipment_1.split(","));
      household_equipments.push(answer_score.household_equipment_2.split(","));
      household_equipments.push(answer_score.household_equipment_3.split(","));
      household_equipments.push(answer_score.household_equipment_4.split(","));
      household_equipments.push(answer_score.household_equipment_5.split(","));
      household_equipments.push(answer_score.household_equipment_6.split(","));
      household_equipments.push(answer_score.household_equipment_7.split(","));
      household_equipments.push(answer_score.household_equipment_8.split(","));
      household_equipments.push(answer_score.household_equipment_9.split(","));
      // console.log(household_equipments);
      // console.log(answerScore);
      await mappingQuestions(answerScore, household_equipments, "household_equipment", "range");
      // console.log(answerScore);

      const services = [];
      // console.log(answer_score.service_1);
      services.push(answer_score.service_1);
      services.push(answer_score.service_2);
      services.push(answer_score.service_3);
      services.push(answer_score.service_4);
      services.push(answer_score.service_5);
      services.push(answer_score.service_6);
      services.push(answer_score.service_7);
      // console.log(services);
      // console.log(answerScore);
      await mappingQuestions(answerScore, services, "service", "check");
      // console.log(answerScore);

      const scholarships = [];
      // console.log(answer_score.scholarship_1);
      scholarships.push(answer_score.scholarship_1);
      scholarships.push(answer_score.scholarship_2);
      scholarships.push(answer_score.scholarship_3);
      scholarships.push(answer_score.scholarship_4);
      // console.log(scholarships);
      // console.log(answerScore);
      await mappingQuestions(answerScore, scholarships, "scholarship", "check");
      // console.log(answerScore);

      // console.log("answerScore", answerScore);
      setFormData(answerScore);
      setAnswerScore(answerScore);
      return answerScore;
   };
   const fillAnswerScoreToDB = async (values) => {
      try {
         // console.log("values", values);
         let newAnswerScore = formDataInitialStateDB;
         if (!values) return;
         answerScore.id = values.id;
         answerScore.total_score = values.total_score;
         newAnswerScore.id = values.id;
         newAnswerScore.total_score = values.total_score;
         newAnswerScore.medium_score = values.medium_score;
         newAnswerScore.medium_low_score = values.medium_low_score;
         newAnswerScore.low_score = values.low_score;

         newAnswerScore.family_1 = `1:${values.family_1_1_min}-${values.family_1_1_max}=${values.family_1_1}, 2:${values.family_1_2_min}-${values.family_1_2_max}=${values.family_1_2}, 3:${values.family_1_3_min}-${values.family_1_3_max}=${values.family_1_3}`;

         newAnswerScore.economic_1 = `1:${values.economic_1_1_min}-${values.economic_1_1_max}=${values.economic_1_1}, 2:${values.economic_1_2_min}-${values.economic_1_2_max}=${values.economic_1_2}, 3:${values.economic_1_3_min}-${values.economic_1_3_max}=${values.economic_1_3}`;
         newAnswerScore.economic_2 = `1:${values.economic_2_1_min}-${values.economic_2_1_max}=${values.economic_2_1}, 2:${values.economic_2_2_min}-${values.economic_2_2_max}=${values.economic_2_2}, 3:${values.economic_2_3_min}-${values.economic_2_3_max}=${values.economic_2_3}`;

         newAnswerScore.house_1 = `1:${values.house_1_1}, 2:${values.house_1_2}, 3:${values.house_1_3}, 4:${values.house_1_4}`;
         newAnswerScore.house_2 = `1:${values.house_2_1}, 2:${values.house_2_2}`;
         newAnswerScore.house_3 = `1:${values.house_3_1}, 2:${values.house_3_2}, 3:${values.house_3_3}`;

         newAnswerScore.household_equipment_1 = `1:${values.household_equipment_1_1_min}-${values.household_equipment_1_1_max}=${values.household_equipment_1_1}, 2:${values.household_equipment_1_2_min}-${values.household_equipment_1_2_max}=${values.household_equipment_1_2}, 3:${values.household_equipment_1_3_min}-${values.household_equipment_1_3_max}=${values.household_equipment_1_3}`;
         newAnswerScore.household_equipment_2 = `1:${values.household_equipment_2_1_min}-${values.household_equipment_2_1_max}=${values.household_equipment_2_1}, 2:${values.household_equipment_2_2_min}-${values.household_equipment_2_2_max}=${values.household_equipment_2_2}, 3:${values.household_equipment_2_3_min}-${values.household_equipment_2_3_max}=${values.household_equipment_2_3}`;
         newAnswerScore.household_equipment_3 = `1:${values.household_equipment_3_1_min}-${values.household_equipment_3_1_max}=${values.household_equipment_3_1}, 2:${values.household_equipment_3_2_min}-${values.household_equipment_3_2_max}=${values.household_equipment_3_2}, 3:${values.household_equipment_3_3_min}-${values.household_equipment_3_3_max}=${values.household_equipment_3_3}`;
         newAnswerScore.household_equipment_4 = `1:${values.household_equipment_4_1_min}-${values.household_equipment_4_1_max}=${values.household_equipment_4_1}, 2:${values.household_equipment_4_2_min}-${values.household_equipment_4_2_max}=${values.household_equipment_4_2}, 3:${values.household_equipment_4_3_min}-${values.household_equipment_4_3_max}=${values.household_equipment_4_3}`;
         newAnswerScore.household_equipment_5 = `1:${values.household_equipment_5_1_min}-${values.household_equipment_5_1_max}=${values.household_equipment_5_1}, 2:${values.household_equipment_5_2_min}-${values.household_equipment_5_2_max}=${values.household_equipment_5_2}, 3:${values.household_equipment_5_3_min}-${values.household_equipment_5_3_max}=${values.household_equipment_5_3}`;
         newAnswerScore.household_equipment_6 = `1:${values.household_equipment_6_1_min}-${values.household_equipment_6_1_max}=${values.household_equipment_6_1}, 2:${values.household_equipment_6_2_min}-${values.household_equipment_6_2_max}=${values.household_equipment_6_2}, 3:${values.household_equipment_6_3_min}-${values.household_equipment_6_3_max}=${values.household_equipment_6_3}`;
         newAnswerScore.household_equipment_7 = `1:${values.household_equipment_7_1_min}-${values.household_equipment_7_1_max}=${values.household_equipment_7_1}, 2:${values.household_equipment_7_2_min}-${values.household_equipment_7_2_max}=${values.household_equipment_7_2}, 3:${values.household_equipment_7_3_min}-${values.household_equipment_7_3_max}=${values.household_equipment_7_3}`;
         newAnswerScore.household_equipment_8 = `1:${values.household_equipment_8_1_min}-${values.household_equipment_8_1_max}=${values.household_equipment_8_1}, 2:${values.household_equipment_8_2_min}-${values.household_equipment_8_2_max}=${values.household_equipment_8_2}, 3:${values.household_equipment_8_3_min}-${values.household_equipment_8_3_max}=${values.household_equipment_8_3}`;
         newAnswerScore.household_equipment_9 = `1:${values.household_equipment_9_1_min}-${values.household_equipment_9_1_max}=${values.household_equipment_9_1}, 2:${values.household_equipment_9_2_min}-${values.household_equipment_9_2_max}=${values.household_equipment_9_2}, 3:${values.household_equipment_9_3_min}-${values.household_equipment_9_3_max}=${values.household_equipment_9_3}`;

         newAnswerScore.service_1 = values.service_1;
         newAnswerScore.service_2 = values.service_2;
         newAnswerScore.service_3 = values.service_3;
         newAnswerScore.service_4 = values.service_4;
         newAnswerScore.service_5 = values.service_5;
         newAnswerScore.service_6 = values.service_6;
         newAnswerScore.service_7 = values.service_7;

         newAnswerScore.scholarship_1 = values.scholarship_1;
         newAnswerScore.scholarship_2 = values.scholarship_2;
         newAnswerScore.scholarship_3 = values.scholarship_3;
         newAnswerScore.scholarship_4 = values.scholarship_4;

         return newAnswerScore;
         // setFormData(answerScore);
         // setAnswerScore(answerScore);
      } catch (error) {
         console.log("Error en fillAnswerScoreToDB:", error);
      }
   };

   const getAnswerScoreActive = async () => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/answersScores/getAnswerScoreActive`);
         res = await axiosData.data.data;
         // setAnswerScore(res.result);
         // setFormData(res.result);
         const data = await fillAnswerScore(res.result);
         // console.log("getAnswerScoreActive->data", data);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getAnswerScores = async () => {
      try {
         // console.log("getAnswerScores() ejecutado");
         const res = CorrectRes;
         const axiosData = await Axios.get(`/answersScores`);
         res.result.answerScores = axiosData.data.data.result;
         setAnswerScores(axiosData.data.data.result);
         // console.log("answerScores", answerScores);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getAnswerScoresSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/answersScores/selectIndex`);
         // console.log("el selectedDeAnswerScores", axiosData);
         res.result.answerScores = axiosData.data.data.result;
         res.result.answerScores.unshift({ id: 0, label: "Selecciona una opción..." });
         setAnswerScores(axiosData.data.data.result);
         // console.log("answerScores", answerScores);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showAnswerScore = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/answersScores/id/${id}`);
         res = axiosData.data.data;
         setAnswerScore(res.result);
         setFormData(res.result);
         // fillFormData(res.result);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createAnswerScore = async (values) => {
      let res = CorrectRes;
      try {
         const answerScore = await fillAnswerScoreToDB(values);
         // console.log("a enviar", answerScore);
         const axiosData = await Axios.post("/answersScores/create", answerScore);
         res = axiosData.data.data;

         getAnswerScoreActive();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateAnswerScore = async (answerScore) => {
      let res = CorrectRes;
      try {
         const newAnswerScore = await fillAnswerScoreToDB(answerScore);
         const axiosData = await Axios.post(`/answersScores/update/${newAnswerScore.id}`, newAnswerScore);
         res = axiosData.data.data;
         await getAnswerScoreActive();
         return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteAnswerScore = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/answersScores/destroy/${id}`);
         // console.log("deleteAnswerScore() axiosData", axiosData.data);
         getAnswerScores();
         res = axiosData.data.data;
         // console.log("res", res);
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   // useEffect(() => {
   //    console.log("el useEffect de AnswerScoreContext");
   //    getAnswerScores();
   // });

   return (
      <AnswerScoreContext.Provider
         value={{
            answerScores,
            answerScore,
            formData,
            resetFormData,
            getAnswerScoreActive,
            getAnswerScores,
            getAnswerScoresSelectIndex,
            showAnswerScore,
            createAnswerScore,
            updateAnswerScore,
            deleteAnswerScore,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName,
            fillAnswerScoreToDB
         }}
      >
         {children}
      </AnswerScoreContext.Provider>
   );
}
export const useAnswerScoreContext = () => useContext(AnswerScoreContext);
