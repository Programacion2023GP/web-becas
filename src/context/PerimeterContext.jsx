import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const PerimeterContext = createContext();

const formDataInitialState = {
   id: 0,
   perimeter: ""
};

export default function PerimeterContextProvider({ children }) {
   const singularName = "Perímetro"; //Escribirlo siempre letra Capital
   const pluralName = "Perímetros"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [perimeters, setPerimeters] = useState([]);
   const [perimeter, setPerimeter] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };

   const getPerimeters = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/perimeters`);
         res.result.perimeters = axiosData.data.data.result;
         setPerimeters(axiosData.data.data.result);
         // console.log("perimeters", perimeters);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showPerimeter = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/perimeters/${id}`);
         res = axiosData.data.data;
         setPerimeter(res.result);
         setFormData(res.result);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createPerimeter = async (perimeter) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/perimeters", perimeter);
         res = axiosData.data.data;
         getPerimeters();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updatePerimeter = async (perimeter) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/perimeters", perimeter);
         res = axiosData.data.data;
         getPerimeters();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deletePerimeter = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/perimeters/${id}`);
         // console.log("deletePerimeter() axiosData", axiosData.data);
         getPerimeters();
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
   //    console.log("el useEffect de PerimeterContext");
   //    getPerimeters();
   // });

   return (
      <PerimeterContext.Provider
         value={{
            perimeters,
            perimeter,
            formData,
            resetFormData,
            getPerimeters,
            showPerimeter,
            createPerimeter,
            updatePerimeter,
            deletePerimeter,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName
         }}
      >
         {children}
      </PerimeterContext.Provider>
   );
}
export const usePerimeterContext = () => useContext(PerimeterContext);
