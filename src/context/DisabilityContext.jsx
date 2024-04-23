import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const DisabilityContext = createContext();

const formDataInitialState = {
   id: 0,
   disability: "",
   description: ""
};

export default function DisabilityContextProvider({ children }) {
   const singularName = "Discapacidad"; //Escribirlo siempre letra Capital
   const pluralName = "Discapacidades"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [disabilities, setDisabilities] = useState([]);
   const [disability, setDisability] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };

   const getDisabilities = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/disabilities`);
         res.result.disabilities = axiosData.data.data.result;
         setDisabilities(axiosData.data.data.result);
         // console.log("disabilities", disabilities);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getDisabilitiesSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/disabilities/selectIndex`);
         // console.log("el selectedDeDisabilities", axiosData);
         res.result.disabilities = axiosData.data.data.result;
         // res.result.disabilities.unshift({ id: 0, label: "Selecciona una opción..." });
         setDisabilities(axiosData.data.data.result);
         // console.log("disabilities", disabilities);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showDisability = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/disabilities/${id}`);
         res = axiosData.data.data;
         setDisability(res.result);
         setFormData(res.result);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createDisability = async (disability) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/disabilities", disability);
         res = axiosData.data.data;
         getDisabilities();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateDisability = async (disability) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/disabilities", disability);
         res = axiosData.data.data;
         getDisabilities();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteDisability = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/disabilities/${id}`);
         // console.log("deleteDisability() axiosData", axiosData.data);
         getDisabilities();
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
   //    console.log("el useEffect de DisabilityContext");
   //    getDisabilities();
   // });

   return (
      <DisabilityContext.Provider
         value={{
            disabilities,
            disability,
            formData,
            resetFormData,
            getDisabilities,
            getDisabilitiesSelectIndex,
            showDisability,
            createDisability,
            updateDisability,
            deleteDisability,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName
         }}
      >
         {children}
      </DisabilityContext.Provider>
   );
}
export const useDisabilityContext = () => useContext(DisabilityContext);
