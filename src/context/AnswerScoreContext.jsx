import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
// import { socket } from "./GlobalContext";

const AnswerScoreContext = createContext();

const formDataInitialState = {
   id: 0,
   answerScore: ""
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
