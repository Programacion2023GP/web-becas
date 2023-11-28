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
   const [formTitle, setFormTitle] = useState("REGISTRAR DISCAPACIDAD");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   // const [loading, setLoading] = useState(true);
   // const [loadingAction, setLoadingAction] = useState(false);

   const [disabilities, setDisabilities] = useState([]);
   const [disability, setDisability] = useState(null);
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
         newData.disability = values.disability;
         newData.description = values.description;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
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
         res.result.disabilities.unshift({ id: 0, label: "Selecciona una opción..." });
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
         setOpenDialog(true);
         res = axiosData.data.data;
         // await setDisability(res.result);
         // setFormData(res.result);
         fillFormData(res.result);

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
            openDialog,
            setOpenDialog,
            toggleDrawer,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </DisabilityContext.Provider>
   );
}
export const useDisabilityContext = () => useContext(DisabilityContext);
