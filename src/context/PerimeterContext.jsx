import { createContext, useContext, useEffect, useState } from "react";
// import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import axios from "axios";

const axiosMyCommunity = axios;
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
   const resetPerimeter = () => {
      try {
         setPerimeter(formDataInitialState);
      } catch (error) {
         console.log("Error en resetPerimeter:", error);
      }
   };

   const getPerimeters = async () => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/perimetros/id`);
         // console.log("axiosData", axiosData);
         res.result.perimeters = axiosData.data.data.result;
         setPerimeters(axiosData.data.data.result);
         // console.log("perimeters", perimeters);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const getPerimetersSelectIndex = async () => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/perimetros/selectIndex`);
         // console.log("el getPerimetersSelectIndex", axiosData);
         res.result.perimeters = axiosData.data.data.result;
         // res.result.perimeters.unshift({ id: 0, label: "Selecciona una opción..." });
         setPerimeters(axiosData.data.data.result);
         // console.log("perimeters", perimeters);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const showPerimeter = async (id) => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/perimetros/id/${id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         setPerimeter(res.result);
         setFormData(res.result);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const createPerimeter = async (perimeter) => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.post(`${import.meta.env.VITE_API_CP}/perimetros/create`, perimeter);
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
         const axiosData = await axiosMyCommunity.post(`${import.meta.env.VITE_API_CP}/perimetros/update/${perimeter.id}`, perimeter);
         // console.log("axiosData", axiosData);
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
      let res = CorrectRes;
      try {
         console.log("no hay por el momento");
         // const axiosData = await Axios.delete(`/perimeters/${id}`);
         // // console.log("deletePerimeter() axiosData", axiosData.data);
         // getPerimeters();
         // res = axiosData.data.data;
         // console.log("res", res);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   // const assignPerimeterToCommunity = async (id, community_id) => {
   //    let res = CorrectRes;
   //    try {
   //       const axiosData = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/perimetros/${id}/assignToCommunity${community_id}`);
   //       console.log("axiosData", axiosData);
   //       res = axiosData.data.data;
   //       setPerimeter(res.result);
   //       setFormData(res.result);
   //    } catch (error) {
   //       res = ErrorRes;
   //       console.log(error);
   //       res.message = error;
   //       res.alert_text = error;
   //    }
   //    return res;
   // };

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
            resetPerimeter,
            getPerimeters,
            getPerimetersSelectIndex,
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
