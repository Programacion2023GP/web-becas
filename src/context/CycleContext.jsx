import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
// import { socket } from "./GlobalContext";

const CycleContext = createContext();

const formDataInitialState = {
   id: null,
   cycle_name: "",
   start_date: "",
   closing_date: ""
};

export default function CycleContextProvider({ children }) {
   const singularName = "Ciclo"; //Escribirlo siempre letra Capital
   const pluralName = "Ciclos"; //Escribirlo siempre letra Capital
   const formikRef = useRef();

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [cycles, setCycles] = useState([]);
   const [cycle, setCycle] = useState(null);
   const [currentCycle, setCurrentCycle] = useState(JSON.parse(localStorage.getItem("currentCycle")) || formDataInitialState);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
         return formData;
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };
   const resetCycle = () => {
      try {
         setCycle(formDataInitialState);
      } catch (error) {
         console.log("Error en resetCycle:", error);
      }
   };

   const getCurrentCycle = async () => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/cycles/current`);
         res = axiosData.data.data;
         // console.log("🚀 ~ getCurrentCycle ~ res:", res);
         if (!res.status) return;
         const current_cycle = res.result;
         // console.log("🚀 ~ getCurrentCycle ~ current_cycle:", current_cycle);
         localStorage.setItem("currentCycle", JSON.stringify(current_cycle));
         setCurrentCycle(current_cycle);
         setFormData(current_cycle);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getCycles = async () => {
      try {
         // console.log("getCycles() ejecutado");
         const res = CorrectRes;
         const axiosData = await Axios.get(`/cycles`);
         res.result.cycles = axiosData.data.data.result;
         setCycles(axiosData.data.data.result);
         // console.log("cycles", cycles);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getCyclesSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/cycles/selectIndex`);
         // console.log("el selectedDeCycless", axiosData);
         res.result.cycles = axiosData.data.data.result;
         // res.result.cycles.unshift({ id: 0, label: "Selecciona una opción..." });
         setCycles(axiosData.data.data.result);
         // console.log("cycles", cycles);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showCycle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/cycles/id/${id}`);
         res = axiosData.data.data;
         setCycle(res.result);
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

   const createCycle = async (cycle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/cycles/create", cycle);
         res = axiosData.data.data;

         // socket.send("getCycles()");

         getCycles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateCycle = async (cycle) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put(`/cycles/update/${cycle.id}`, cycle);
         res = axiosData.data.data;
         getCycles();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteCycle = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/cycles/delete/${id}`);
         // console.log("deleteCycle() axiosData", axiosData.data);
         getCycles();
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
   //    console.log("el useEffect de CycleContext");
   //    getCycles();
   // });

   return (
      <CycleContext.Provider
         value={{
            cycles,
            cycle,
            formData,
            setFormData,
            resetFormData,
            getCycles,
            getCyclesSelectIndex,
            showCycle,
            createCycle,
            updateCycle,
            deleteCycle,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName,
            formikRef,
            getCurrentCycle,
            currentCycle,
            setCurrentCycle
         }}
      >
         {children}
      </CycleContext.Provider>
   );
}
export const useCycleContext = () => useContext(CycleContext);
