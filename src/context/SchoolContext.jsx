import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const SchoolContext = createContext();

const formDataInitialState = {
   id: 0,
   code: "",
   level_id: "",
   level: "Selecciona una opción...",
   school: "",
   community_id: 0,
   street: "",
   num_ext: "",
   num_int: "",
   phone: "",
   director: "",
   loc_for: "1",
   zone: "U",

   zip: "",
   state: "Selecciona una opción...",
   city: "Selecciona una opción...",
   colony: "Selecciona una opción..."
};

export default function SchoolContextProvider({ children }) {
   const [formTitle, setFormTitle] = useState("REGISTRAR ESCUELA");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   const [loading, setLoading] = useState(true);
   const [loadingAction, setLoadingAction] = useState(false);

   const [schools, setSchools] = useState([]);
   const [school, setSchool] = useState(null);
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
         console.log("Error en fillFormData:", error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.code = values.code;
         newData.level_id = values.level_id;
         newData.school = values.school;
         newData.community_id = values.community_id;
         newData.city_id = values.city_id;
         newData.colony_id = values.colony_id;
         newData.address = values.address;
         newData.phone = values.phone;
         newData.director = values.director;
         newData.loc_for = values.loc_for;
         newData.zone = values.zone;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getSchools = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/schools`);
         res.result.schools = axiosData.data.data.result;
         setSchools(axiosData.data.data.result);
         // console.log("schools", schools);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getSchoolsSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/schools/selectIndex`);
         // console.log("el selectedDeSchools", axiosData);
         res.result.schools = axiosData.data.data.result;
         res.result.schools.unshift({ id: 0, label: "Selecciona una opción..." });
         setSchools(axiosData.data.data.result);
         // console.log("schools", schools);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showSchool = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/schools/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         setSchool(res.result);
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

   const createSchool = async (school) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/schools", school);
         res = axiosData.data.data;
         getSchools();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateSchool = async (school) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/schools", school);
         res = axiosData.data.data;
         getSchools();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteSchool = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/schools/${id}`);
         // console.log("deleteSchool() axiosData", axiosData.data);
         getSchools();
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
   //    console.log("el useEffect de SchoolContext");
   //    getSchools();
   // });

   return (
      <SchoolContext.Provider
         value={{
            schools,
            school,
            formData,
            setFormData,
            resetFormData,
            getSchools,
            getSchoolsSelectIndex,
            showSchool,
            createSchool,
            updateSchool,
            deleteSchool,
            loading,
            setLoading,
            loadingAction,
            setLoadingAction,
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
      </SchoolContext.Provider>
   );
}
export const useSchoolContext = () => useContext(SchoolContext);
