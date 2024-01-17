import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
// import { socket } from "./GlobalContext";

const FamilyContext = createContext();

const formDataInitialState = {
   id: 0,
   beca_id: 0,
   relationship: "",
   age: 0,
   occupation: "",
   monthly_income: "",
   finished: false
};

export default function FamilyContextProvider({ children }) {
   const singularName = "Familia"; //Escribirlo siempre letra Capital
   const pluralName = "Familias"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [families, setFamilies] = useState([]);
   const [family, setFamily] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [monthlyIncome, setMonthlyIncome] = useState(0);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };

   const getIndexByBeca = async (beca_id) => {
      try {
         const res = CorrectRes;
         // console.log("getFamilies() ejecutado");
         const axiosData = await Axios.get(`/families/beca/${beca_id}`);
         res.result.families = axiosData.data.data.result;
         setFamilies(axiosData.data.data.result);
         // console.log("families", families);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getIndexByFolio = async (folio) => {
      try {
         setFamilies([]);
         const res = CorrectRes;
         // console.log("getFamilies() ejecutado... folio", folio);
         const axiosData = await Axios.get(`/families/beca/folio/${folio}`);
         // console.log("getIndexByFolio() -> axiosData", axiosData.data.data.result);
         res.result.families = axiosData.data.data.result;
         setFamilies(axiosData.data.data.result);
         // console.log("families", families);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   //#region CRUD
   const getFamilies = async () => {
      try {
         const res = CorrectRes;
         // console.log("getFamilies() ejecutado");
         const axiosData = await Axios.get(`/families`);
         res.result.families = axiosData.data.data.result;
         setFamilies(axiosData.data.data.result);
         // console.log("families", families);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getFamiliesSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/families/selectIndex`);
         // console.log("el selectedDeFamilies", axiosData);
         res.result.families = axiosData.data.data.result;
         res.result.families.unshift({ id: 0, label: "Selecciona una opción..." });
         setFamilies(axiosData.data.data.result);
         // console.log("families", families);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showFamily = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/families/${id}`);
         res = axiosData.data.data;
         setFamily(res.result);
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

   const createFamily = async (family) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/families/create", family);
         res = axiosData.data.data;

         // socket.send("getFamilies()");

         getIndexByFolio(family.beca_id);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateFamily = async (family) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put(`/families/update/${family.id}`, family);
         res = axiosData.data.data;
         getIndexByFolio(family.beca_id);
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteFamily = async (ids, beca_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/families/destroy`, { ids });
         // console.log("deleteFamily() axiosData", axiosData.data);
         res = axiosData.data.data;
         getIndexByFolio(beca_id);
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
   //    console.log("el useEffect de FamilyContext");
   //    getFamilies();
   // });
   //#endregion

   return (
      <FamilyContext.Provider
         value={{
            families,
            setFamilies,
            family,
            formData,
            resetFormData,
            getFamilies,
            getFamiliesSelectIndex,
            showFamily,
            createFamily,
            updateFamily,
            deleteFamily,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName,
            getIndexByBeca,
            getIndexByFolio,
            monthlyIncome,
            setMonthlyIncome
         }}
      >
         {children}
      </FamilyContext.Provider>
   );
}
export const useFamilyContext = () => useContext(FamilyContext);
