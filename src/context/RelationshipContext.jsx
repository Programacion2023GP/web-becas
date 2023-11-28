import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const RelationshipContext = createContext();

const formDataInitialState = {
   id: 0,
   relationship: ""
};

export default function RelationshipContextProvider({ children }) {
   const singularName = "Parentesco"; //Escribirlo siempre letra Capital
   const pluralName = "Parentescos"; //Escribirlo siempre letra Capital
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [relationships, setRelationships] = useState([]);
   const [relationship, setRelationship] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);

   const toggleDrawer = (open) => (event) => {
      try {
         if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
         }
         setOpenDialog(open);
      } catch (error) {
         console.log("Error en toggleDrawer:", error);
      }
   };

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.relationship = values.relationship;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getRelationships = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/relationships`);
         res.result.relationships = axiosData.data.data.result;
         setRelationships(axiosData.data.data.result);
         // console.log("relationships", relationships);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getRelationshipsSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/relationships/selectIndex`);
         // console.log("el selectedDeRelationships", axiosData);
         res.result.relationships = axiosData.data.data.result;
         res.result.relationships.unshift({ id: 0, label: "Selecciona una opción..." });
         setRelationships(axiosData.data.data.result);
         // console.log("relationships", relationships);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showRelationship = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/relationships/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         setRelationship(res.result);
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

   const createRelationship = async (relationship) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/relationships", relationship);
         res = axiosData.data.data;
         getRelationships();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateRelationship = async (relationship) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/relationships", relationship);
         res = axiosData.data.data;
         getRelationships();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteRelationship = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/relationships/${id}`);
         // console.log("deleteRelationship() axiosData", axiosData.data);
         getRelationships();
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
   //    console.log("el useEffect de RelationshipContext");
   //    getRelationships();
   // });

   return (
      <RelationshipContext.Provider
         value={{
            relationships,
            relationship,
            formData,
            resetFormData,
            getRelationships,
            getRelationshipsSelectIndex,
            showRelationship,
            createRelationship,
            updateRelationship,
            deleteRelationship,
            openDialog,
            setOpenDialog,
            toggleDrawer,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName
         }}
      >
         {children}
      </RelationshipContext.Provider>
   );
}
export const useRelationshipContext = () => useContext(RelationshipContext);
