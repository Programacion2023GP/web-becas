import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const TutorContext = createContext();

const formDataInitialState = {
   id: 0,
   tutor_curp: "",
   tutor_relationship_id: 0,
   tutor_relationship: "Selecciona una opción...",
   tutor_name: "",
   tutor_paternal_last_name: "",
   tutor_maternal_last_name: "",
   tutor_phone: "",
   tutor_img_ine: "",
   tutor_img_power_letter: ""
};

export default function TutorContextProvider({ children }) {
   const [formTitle, setFormTitle] = useState("REGISTRAR ESTUDIANTE");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   // const [loading, setLoading] = useState(true);
   // const [loadingAction, setLoadingAction] = useState(false);

   const [tutors, setTutors] = useState([]);
   const [tutor, setTutor] = useState(null);
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
         newData.tutor = values.tutor;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getTutors = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/tutors`);
         res.result.tutors = axiosData.data.data.result;
         setTutors(axiosData.data.data.result);
         // console.log("tutors", tutors);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getTutorByCURP = async (curp) => {
      try {
         if (!curp) return;
         let res = CorrectRes;
         const axiosData = await Axios.get(`/tutors/tutor_curp/${curp}`);
         // console.log(axiosData);
         res = axiosData.data.data;

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showTutor = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/tutors/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         await setTutor(res.result);
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

   const createTutor = async (tutor) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/tutors", tutor);
         res = axiosData.data.data;
         getTutors();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateTutor = async (tutor) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/tutors", tutor);
         res = axiosData.data.data;
         getTutors();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteTutor = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/tutors/${id}`);
         // console.log("deleteTutor() axiosData", axiosData.data);
         getTutors();
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
   //    console.log("el useEffect de TutorContext");
   //    getTutors();
   // });

   return (
      <TutorContext.Provider
         value={{
            tutors,
            tutor,
            formData,
            resetFormData,
            getTutors,
            getTutorByCURP,
            showTutor,
            createTutor,
            updateTutor,
            deleteTutor,
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
      </TutorContext.Provider>
   );
}
export const useTutorContext = () => useContext(TutorContext);
