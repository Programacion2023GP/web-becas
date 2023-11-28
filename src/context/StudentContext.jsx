import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const StudentContext = createContext();

const formDataInitialState = {
   id: 0,
   student: ""
};

export default function StudentContextProvider({ children }) {
   const [formTitle, setFormTitle] = useState("REGISTRAR ESTUDIANTE");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   // const [loading, setLoading] = useState(true);
   // const [loadingAction, setLoadingAction] = useState(false);

   const [students, setStudents] = useState([]);
   const [student, setStudent] = useState(null);
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
         newData.student = values.student;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getStudents = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/students`);
         res.result.students = axiosData.data.data.result;
         setStudents(axiosData.data.data.result);
         // console.log("students", students);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getStudentByCURP = async (curp) => {
      try {
         if (!curp) return;
         let res = CorrectRes;
         const axiosData = await Axios.get(`/students/curp/${curp}`);
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

   const showStudent = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/students/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         // await setStudent(res.result);
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

   const createStudent = async (student) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/students", student);
         res = axiosData.data.data;
         getStudents();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateStudent = async (student) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/students", student);
         res = axiosData.data.data;
         getStudents();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteStudent = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/students/${id}`);
         // console.log("deleteStudent() axiosData", axiosData.data);
         getStudents();
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
   //    console.log("el useEffect de StudentContext");
   //    getStudents();
   // });

   return (
      <StudentContext.Provider
         value={{
            students,
            student,
            formData,
            resetFormData,
            getStudents,
            getStudentByCURP,
            showStudent,
            createStudent,
            updateStudent,
            deleteStudent,
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
      </StudentContext.Provider>
   );
}
export const useStudentContext = () => useContext(StudentContext);
