import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
// import { socket } from "./GlobalContext";

const AnswerScoreContext = createContext();

const formDataInitialState = {
   id: 0,
   family_1_1: 0,
   family_1_2: 0,
   family_1_3: 0,

   economic_1_1: 0,
   economic_1_2: 0,
   economic_1_3: 0,
   economic_2_1: "",
   economic_2_2: 0,
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

   household_equipment_1_1: 0,
   household_equipment_1_2: 0,
   household_equipment_1_3: 0,
   household_equipment_2_1: 0,
   household_equipment_2_2: 0,
   household_equipment_2_3: 0,
   household_equipment_3_1: 0,
   household_equipment_3_2: 0,
   household_equipment_3_3: 0,
   household_equipment_4_1: 0,
   household_equipment_4_2: 0,
   household_equipment_4_3: 0,
   household_equipment_5_1: 0,
   household_equipment_5_2: 0,
   household_equipment_5_3: 0,
   household_equipment_6_1: 0,
   household_equipment_6_2: 0,
   household_equipment_6_3: 0,
   household_equipment_7_1: 0,
   household_equipment_7_2: 0,
   household_equipment_7_3: 0,
   household_equipment_8_1: 0,
   household_equipment_8_2: 0,
   household_equipment_8_3: 0,
   household_equipment_9_1: 0,
   household_equipment_9_2: 0,
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
   const [answerScore, setAnswerScore] = useState(null);
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

   const getAnswerScores = async () => {
      try {
         // console.log("getAnswerScores() ejecutado");
         const res = CorrectRes;
         const axiosData = await Axios.get(`/answerScores`);
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
         const axiosData = await Axios.get(`/answerScores/selectIndex`);
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
         const axiosData = await Axios.get(`/answerScores/${id}`);
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

   const createAnswerScore = async (answerScore) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/answerScores", answerScore);
         res = axiosData.data.data;

         // socket.send("getAnswerScores()");

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
         const axiosData = await Axios.put("/answerScores", answerScore);
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
         const axiosData = await Axios.delete(`/answerScores/${id}`);
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
            pluralName
         }}
      >
         {children}
      </AnswerScoreContext.Provider>
   );
}
export const useAnswerScoreContext = () => useContext(AnswerScoreContext);
