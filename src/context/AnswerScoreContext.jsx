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
   services_1: 0,
   services_2: 0,
   services_3: 0,
   services_4: 0,
   services_5: 0,
   services_6: 0,
   services_7: 0,
   scholarship_1: 0,
   scholarship_2: 0,
   scholarship_3: 0,
   scholarship_4: 0
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

   services_1: 0,
   services_2: 0,
   services_3: 0,
   services_4: 0,
   services_5: 0,
   services_6: 0,
   services_7: 0,

   scholarship_1: 0,
   scholarship_2: 0,
   scholarship_3: 0,
   scholarship_4: 0
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

   const fillAnswerScore = async (answer_score) => {
      console.log("fillAnswerScore -> answer_score", answer_score);
      if (!answer_score) return;
      answerScore.id = answer_score.id;
      const familys = [];
      familys.push(answer_score.family_1.split(","));
      console.log("familys", familys);
      familys.map((questions, qi) => {
         questions.map((r, i) => {
            let q = qi + 1;
            console.log("reg", r);
            const reg = r.trim();
            console.log("reg", reg);
            const op = reg.split(":")[0];
            console.log("op", op);
            const data = reg.split(":")[1];
            console.log("data", data);
            const min = data.split("-")[0];
            const max = data.split("-")[1].split("=")[0];
            const pts = data.split("=")[1];
            console.log("dataReal: ", `family_${q}_${op}_min= ${min}-${max}=${pts}`);
            answerScore[`family_${q}_${op}_min`] = Number(min);
            answerScore[`family_${q}_${op}_max`] = Number(max);
            answerScore[`family_${q}_${op}`] = Number(pts);
         });
      });

      const economics = [];
      economics.push(answer_score.economic_1.split(","));
      economics.push(answer_score.economic_2.split(","));
      console.log(economics);
      economics.map((questions, qi) => {
         questions.map((r, i) => {
            let q = qi + 1;
            console.log("reg", r);
            const reg = r.trim();
            console.log("reg", reg);
            const op = reg.split(":")[0];
            console.log("op", op);
            const data = reg.split(":")[1];
            console.log("data", data);
            const min = data.split("-")[0];
            const max = data.split("-")[1].split("=")[0];
            const pts = data.split("=")[1];
            console.log("dataReal: ", `economic_${q}_${op}_min= ${min}-${max}=${pts}`);
            answerScore[`economic_${q}_${op}_min`] = Number(min);
            answerScore[`economic_${q}_${op}_max`] = Number(max);
            answerScore[`economic_${q}_${op}`] = Number(pts);
         });
      });

      const houses = [];
      console.log(answer_score.house_1);
      houses.push(answer_score.house_1.split(","));
      houses.push(answer_score.house_2.split(","));
      houses.push(answer_score.house_3.split(","));
      console.log(houses);
      houses.map((questions, qi) => {
         questions.map((r, i) => {
            let q = qi + 1;
            console.log("reg", r);
            const reg = r.trim();
            console.log("reg", reg);
            const op = reg.split(":")[0];
            console.log("op", op);
            const pts = reg.split(":")[1];
            console.log("data", pts);
            console.log("dataReal: ", `house_${q}_${op}_min= ${pts}`);
            answerScore[`house_${q}_${op}`] = Number(pts);
         });
      });

      const mappingQuestions = (obj, arrayQuestions, questionName, typeOption) => {
         houses.map((questions, qi) => {
            questions.map((r, i) => {
               let q = qi + 1;
               console.log("reg", r);
               const reg = r.trim();
               console.log("reg", reg);
               const op = reg.split(":")[0];
               console.log("op", op);
               const pts = reg.split(":")[1];
               console.log("data", pts);
               console.log("dataReal: ", `house_${q}_${op}_min= ${pts}`);
               answerScore[`house_${q}_${op}`] = Number(pts);
            });
         });
      };

      // answerScore.house_1_1 = answer_score.house_1_1;
      // answerScore.house_1_2 = answer_score.house_1_2;
      // answerScore.house_1_3 = answer_score.house_1_3;
      // answerScore.house_1_4 = answer_score.house_1_4;
      // answerScore.house_2_1 = answer_score.house_2_1;
      // answerScore.house_2_2 = answer_score.house_2_2;
      // answerScore.house_3_1 = answer_score.house_3_1;
      // answerScore.house_3_2 = answer_score.house_3_2;
      // answerScore.house_3_3 = answer_score.house_3_3;

      // answerScore.household_equipment_1_1_min = answer_score.household_equipment_1_1_min;
      // answerScore.household_equipment_1_1_max = answer_score.household_equipment_1_1_max;
      // answerScore.household_equipment_1_1 = answer_score.household_equipment_1_1;
      // answerScore.household_equipment_1_2_min = answer_score.household_equipment_1_2_min;
      // answerScore.household_equipment_1_2_max = answer_score.household_equipment_1_2_max;
      // answerScore.household_equipment_1_2 = answer_score.household_equipment_1_2;
      // answerScore.household_equipment_1_3_min = answer_score.household_equipment_1_3_min;
      // answerScore.household_equipment_1_3_max = answer_score.household_equipment_1_3_max;
      // answerScore.household_equipment_1_3 = answer_score.household_equipment_1_3;
      // answerScore.household_equipment_2_1_min = answer_score.household_equipment_2_1_min;
      // answerScore.household_equipment_2_1_max = answer_score.household_equipment_2_1_max;
      // answerScore.household_equipment_2_1 = answer_score.household_equipment_2_1;
      // answerScore.household_equipment_2_2_min = answer_score.household_equipment_2_2_min;
      // answerScore.household_equipment_2_2_max = answer_score.household_equipment_2_2_max;
      // answerScore.household_equipment_2_2 = answer_score.household_equipment_2_2;
      // answerScore.household_equipment_2_3_min = answer_score.household_equipment_2_3_min;
      // answerScore.household_equipment_2_3_max = answer_score.household_equipment_2_3_max;
      // answerScore.household_equipment_2_3 = answer_score.household_equipment_2_3;
      // answerScore.household_equipment_3_1_min = answer_score.household_equipment_3_1_min;
      // answerScore.household_equipment_3_1_max = answer_score.household_equipment_3_1_max;
      // answerScore.household_equipment_3_1 = answer_score.household_equipment_3_1;
      // answerScore.household_equipment_3_2_min = answer_score.household_equipment_3_2_min;
      // answerScore.household_equipment_3_2_max = answer_score.household_equipment_3_2_max;
      // answerScore.household_equipment_3_2 = answer_score.household_equipment_3_2;
      // answerScore.household_equipment_3_3_min = answer_score.household_equipment_3_3_min;
      // answerScore.household_equipment_3_3_max = answer_score.household_equipment_3_3_max;
      // answerScore.household_equipment_3_3 = answer_score.household_equipment_3_3;
      // answerScore.household_equipment_4_1_min = answer_score.household_equipment_4_1_min;
      // answerScore.household_equipment_4_1_max = answer_score.household_equipment_4_1_max;
      // answerScore.household_equipment_4_1 = answer_score.household_equipment_4_1;
      // answerScore.household_equipment_4_2_min = answer_score.household_equipment_4_2_min;
      // answerScore.household_equipment_4_2_max = answer_score.household_equipment_4_2_max;
      // answerScore.household_equipment_4_2 = answer_score.household_equipment_4_2;
      // answerScore.household_equipment_4_3_min = answer_score.household_equipment_4_3_min;
      // answerScore.household_equipment_4_3_max = answer_score.household_equipment_4_3_max;
      // answerScore.household_equipment_4_3 = answer_score.household_equipment_4_3;
      // answerScore.household_equipment_5_1_min = answer_score.household_equipment_5_1_min;
      // answerScore.household_equipment_5_1_max = answer_score.household_equipment_5_1_max;
      // answerScore.household_equipment_5_1 = answer_score.household_equipment_5_1;
      // answerScore.household_equipment_5_2_min = answer_score.household_equipment_5_2_min;
      // answerScore.household_equipment_5_2_max = answer_score.household_equipment_5_2_max;
      // answerScore.household_equipment_5_2 = answer_score.household_equipment_5_2;
      // answerScore.household_equipment_5_3_min = answer_score.household_equipment_5_3_min;
      // answerScore.household_equipment_5_3_max = answer_score.household_equipment_5_3_max;
      // answerScore.household_equipment_5_3 = answer_score.household_equipment_5_3;
      // answerScore.household_equipment_6_1_min = answer_score.household_equipment_6_1_min;
      // answerScore.household_equipment_6_1_max = answer_score.household_equipment_6_1_max;
      // answerScore.household_equipment_6_1 = answer_score.household_equipment_6_1;
      // answerScore.household_equipment_6_2_min = answer_score.household_equipment_6_2_min;
      // answerScore.household_equipment_6_2_max = answer_score.household_equipment_6_2_max;
      // answerScore.household_equipment_6_2 = answer_score.household_equipment_6_2;
      // answerScore.household_equipment_6_3_min = answer_score.household_equipment_6_3_min;
      // answerScore.household_equipment_6_3_max = answer_score.household_equipment_6_3_max;
      // answerScore.household_equipment_6_3 = answer_score.household_equipment_6_3;
      // answerScore.household_equipment_7_1_min = answer_score.household_equipment_7_1_min;
      // answerScore.household_equipment_7_1_max = answer_score.household_equipment_7_1_max;
      // answerScore.household_equipment_7_1 = answer_score.household_equipment_7_1;
      // answerScore.household_equipment_7_2_min = answer_score.household_equipment_7_2_min;
      // answerScore.household_equipment_7_2_max = answer_score.household_equipment_7_2_max;
      // answerScore.household_equipment_7_2 = answer_score.household_equipment_7_2;
      // answerScore.household_equipment_7_3_min = answer_score.household_equipment_7_3_min;
      // answerScore.household_equipment_7_3_max = answer_score.household_equipment_7_3_max;
      // answerScore.household_equipment_7_3 = answer_score.household_equipment_7_3;
      // answerScore.household_equipment_8_1_min = answer_score.household_equipment_8_1_min;
      // answerScore.household_equipment_8_1_max = answer_score.household_equipment_8_1_max;
      // answerScore.household_equipment_8_1 = answer_score.household_equipment_8_1;
      // answerScore.household_equipment_8_2_max = answer_score.household_equipment_8_2_max;
      // answerScore.household_equipment_8_2_min = answer_score.household_equipment_8_2_min;
      // answerScore.household_equipment_8_2 = answer_score.household_equipment_8_2;
      // answerScore.household_equipment_8_3_min = answer_score.household_equipment_8_3_min;
      // answerScore.household_equipment_8_3_max = answer_score.household_equipment_8_3_max;
      // answerScore.household_equipment_8_3 = answer_score.household_equipment_8_3;
      // answerScore.household_equipment_9_1_min = answer_score.household_equipment_9_1_min;
      // answerScore.household_equipment_9_1_max = answer_score.household_equipment_9_1_max;
      // answerScore.household_equipment_9_1 = answer_score.household_equipment_9_1;
      // answerScore.household_equipment_9_2_min = answer_score.household_equipment_9_2_min;
      // answerScore.household_equipment_9_2_max = answer_score.household_equipment_9_2_max;
      // answerScore.household_equipment_9_2 = answer_score.household_equipment_9_2;
      // answerScore.household_equipment_9_3_min = answer_score.household_equipment_9_3_min;
      // answerScore.household_equipment_9_3_max = answer_score.household_equipment_9_3_max;
      // answerScore.household_equipment_9_3 = answer_score.household_equipment_9_3;

      // answerScore.services_1 = answer_score.services_1;
      // answerScore.services_2 = answer_score.services_2;
      // answerScore.services_3 = answer_score.services_3;
      // answerScore.services_4 = answer_score.services_4;
      // answerScore.services_5 = answer_score.services_5;
      // answerScore.services_6 = answer_score.services_6;
      // answerScore.services_7 = answer_score.services_7;

      // answerScore.scholarship_1 = answer_score.scholarship_1;
      // answerScore.scholarship_2 = answer_score.scholarship_2;
      // answerScore.scholarship_3 = answer_score.scholarship_3;
      // answerScore.scholarship_4 = answer_score.scholarship_4;
      console.log("answerScore", answerScore);
      setFormData(answerScore);
      setAnswerScore(answerScore);
   };
   const fillAnswerScoreValues = async (values) => {
      try {
         console.log("values", values);
         let newAnswerScore = formDataInitialStateDB;
         if (!values) return;
         answerScore.id = values.id;

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

         newAnswerScore.services_1 = values.services_1;
         newAnswerScore.services_2 = values.services_2;
         newAnswerScore.services_3 = values.services_3;
         newAnswerScore.services_4 = values.services_4;
         newAnswerScore.services_5 = values.services_5;
         newAnswerScore.services_6 = values.services_6;
         newAnswerScore.services_7 = values.services_7;

         newAnswerScore.scholarship_1 = values.scholarship_1;
         newAnswerScore.scholarship_2 = values.scholarship_2;
         newAnswerScore.scholarship_3 = values.scholarship_3;
         newAnswerScore.scholarship_4 = values.scholarship_4;

         return newAnswerScore;
         // setFormData(answerScore);
         // setAnswerScore(answerScore);
      } catch (error) {
         console.log("Error en fillAnswerScoreValues:", error);
      }
   };

   const getAnswerScoreActive = async () => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/answersScores/getAnswerScoreActive`);
         res = await axiosData.data.data;
         // setAnswerScore(res.result);
         // setFormData(res.result);
         await fillAnswerScore(res.result);

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
         const answerScore = await fillAnswerScoreValues(values);
         console.log("a enviar", answerScore);
         const axiosData = await Axios.post("/answersScores/create", answerScore);
         res = axiosData.data.data;

         getAnswerScores();
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
         const axiosData = await Axios.post("/answersScores/update", answerScore);
         res = axiosData.data.data;
         getAnswerScores();
         // return res;
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
            fillAnswerScoreValues
         }}
      >
         {children}
      </AnswerScoreContext.Provider>
   );
}
export const useAnswerScoreContext = () => useContext(AnswerScoreContext);
