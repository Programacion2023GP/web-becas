import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import { ROLE_ADMIN, useGlobalContext } from "./GlobalContext";

const RequestBecaContext = createContext();

const formDataInitialState = {
   id: 0,
   user_id: "",
   folio: "",

   tutor_data_id: "",
   tutor_relationship_id: 0,
   tutor_relationship: "Selecciona una opción...",
   tutor_curp: "",
   tutor_name: "",
   tutor_paternal_last_name: "",
   tutor_maternal_last_name: "",
   tutor_phone: "",
   // tutor_img_ine: "",
   // tutor_img_power_letter: "",

   student_data_id: 0,
   curp: "",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   birthdate: "",
   gender: "MASCULINO",
   community_id: 0,
   zip: "",
   state: "",
   city: "",
   colony: "",
   street: "",
   num_ext: "",
   num_int: "",
   disability_id: 0,
   disability: "Selecciona una opción...",

   school_id: 0,
   school: "Selecciona una opción...",
   grade: "",
   average: "",
   comments: "",

   extra_income: "",
   monthly_income: "",

   total_expenses: 0,
   under_protest: "",

   socioeconomic_study: "",
   status: "",
   end_date: "",
   finished: false, //al concluir la pagina 4 que son los Familiares Tabla B2

   // # id, folio, user_id, tutor_data_id, student_data_id, school_id, grade, average, extra_income, monthly_income, total_expenses, under_protest, comments, socioeconomic_study, status, end_date, active, created_at,

   // TABLE -> beca_3_economic_data
   b3_food: "",
   b3_transport: "",
   b3_living_place: "",
   b3_services: "",
   b3_automobile: "",
   b3_finished: false,

   // TABLE -> beca_4_house_data
   b4_house_is: "",
   b4_roof_material: "",
   b4_floor_material: "",
   b4_score: "",
   b4_finished: false,

   b7_img_tutor_ine: "",
   b7_approved_tutor_ine: "",
   b7_comments_tutor_ine: "",
   b7_img_tutor_power_letter: "",
   b7_approved_tutor_power_letter: "",
   b7_comments_tutor_power_letter: "",
   b7_img_second_ref: "",
   b7_approved_second_ref: "",
   b7_comments_second_ref: "",
   b7_img_proof_address: "",
   b7_approved_proof_address: "",
   b7_comments_proof_address: "",
   b7_img_curp: "",
   b7_approved_curp: "",
   b7_comments_curp: "",
   b7_img_birth_certificate: "",
   b7_approved_birth_certificate: "",
   b7_comments_birth_certificate: "",
   b7_img_academic_transcript: "",
   b7_approved_academic_transcript: "",
   b7_comments_academic_transcript: "",
   b7_finished: "",

   second_ref: "NULL",
   correction_permission: false,
   correction_completed: false
};

// const formDataInitialState = {
//    id: 0,
//    tutor_id: "",
//    folio: "",
//    tutor_full_name: "",
//    tutor_phone: "",

//    student_data_id: 0,
//    curp: "",
//    name: "",
//    paternal_last_name: "",
//    maternal_last_name: "",
//    birthdate: "",
//    gender: "MASCULINO",
//    community_id: 0,
//    zip: "",
//    state: "",
//    city: "",
//    colony: "",

//    street: "",
//    num_ext: "",
//    num_int: "",
//    disability_id: "",
//    disability: "Selecciona una opción...",

//    school_id: "",
//    grade: "",
//    average: ""
// };

export default function RequestBecaContextProvider({ children }) {
   const { auth, counterOfMenus } = useAuthContext();
   const { counters, setCounters } = useGlobalContext();
   // formDataInitialState.tutor_id = auth.id;
   formDataInitialState.user_id = auth.id;
   const singularName = "Beca"; //Escribirlo siempre letra Capital
   const pluralName = "Becas"; //Escribirlo siempre letra Capital
   const [formTitle, setFormTitle] = useState("REGISTRAR BECA");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   // const [loading, setLoading] = useState(true);
   // const [loadingAction, setLoadingAction] = useState(false);

   const [requestBecas, setRequestBecas] = useState([]);
   const [requestBeca, setRequestBeca] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);

   const saveOrFinishReview = async (folio, page, beca) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/documents/folio/${folio}/page/${page}/saveOrFinishReview`, beca);
         res = axiosData.data.data;
         if (auth.role_id <= ROLE_ADMIN) getRequestBecas();
         else getRequestBecasByUser(auth.id);
         // setRequestBecas(axiosData.data.data.result);
         // console.log("requestBecas", requestBecas);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

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
         // console.log("a resetear forms");
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getRequestBecas = async (status = null) => {
      try {
         await setRequestBecas([]);
         let res = CorrectRes;
         let pathApi = `/becas`;
         // let counterName = "requestAll";
         if (status != null) {
            // console.log("getRequestBecas()->status", status);
            let filterStatus;
            if (status == "en-revision") {
               filterStatus = "TERMINADA,EN REVISIÓN";
               // counterName = "requestInReview";
            } else if (status == "en-evaluacion") {
               filterStatus = "EN EVALUACIÓN";
               // counterName = "requestInEvaluation";
            } else if (status == "aprobadas") {
               filterStatus = "APROBADA";
               // counterName = "requestApproved";
            } else if (status == "pagadas") {
               filterStatus = "PAGADA";
               // counterName = "requestPayed";
            } else if (status == "entregadas") {
               filterStatus = "ENTREGADA";
               // counterName = "requestDelivered";
            } else if (status == "rechazadas") {
               filterStatus = "RECHAZADA";
               // counterName = "requestRejected";
            } else if (status == "canceladas") {
               filterStatus = "CANCELADA";
               // counterName = "requestCanceled";
            }
            pathApi = `/becas/status/${filterStatus}`;
         }
         const axiosData = await Axios.get(pathApi);

         // console.log("axiosData", axiosData);
         res = await axiosData.data.data;
         await setRequestBecas(res.result);
         // console.log("requestBecas", requestBecas);
         await counterOfMenus();

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const saveBeca = async (folio, page, beca) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/becas/folio/${folio}/page/${page}/saveBeca`, beca, {
            headers: {
               "Content-Type": "multipart/form-data" // Asegúrate de establecer el encabezado adecuado
            }
         });
         res = axiosData.data.data;
         // setRequestBecas(axiosData.data.data.result);
         // console.log("requestBecas", requestBecas);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const updateStatusBeca = async (folio, status, beca = null, statusCurrent = null) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/becas/updateStatus/folio/${folio}/status/${status}`, beca);
         res = axiosData.data.data;
         // setRequestBecas(axiosData.data.data.result);
         // console.log("requestBecas", requestBecas);
         getRequestBecas(statusCurrent);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getRequestBecasByFolio = async (folio) => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/becas/folio/${folio}`);
         res.result.requestBecas = axiosData.data.data.result;
         // console.log("getRequestBecasByFolio()->res", res.result.requestBecas);
         setRequestBeca(res.result.requestBecas);
         setFormData(res.result.requestBecas);
         // console.log("requestBecas", requestBecas);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getReportRequestByFolio = async (folio) => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/becas/report/folio/${folio}`);
         res.result.requestBecas = axiosData.data.data.result;
         // console.log("res", res.result.requestBecas);
         await setRequestBeca(axiosData.data.data.result.requestBecas);
         await setFormData(res.result.requestBecas);
         // console.log("requestBecas", requestBecas);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getRequestBecasByUser = async (user_id) => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/becas/user/${user_id}`);
         res.result.requestBecas = axiosData.data.data.result;
         setRequestBecas(axiosData.data.data.result);
         // console.log("requestBecas", requestBecas);
         // await setCounters({ ...counters, requestByUser: res.result.requestBecas.length });

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showRequestBeca = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/becas/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         setRequestBeca(res.result);
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

   const createRequestBeca = async (requestBeca) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/becas", requestBeca);
         res = axiosData.data.data;
         // getRequestBecas();
         return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateRequestBeca = async (requestBeca) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/becas", requestBeca);
         res = axiosData.data.data;
         // console.log("el res", res);
         // getRequestBecas();
         return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteRequestBeca = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/becas/${id}`);
         // console.log("deleteRequestBeca() axiosData", axiosData.data);
         getRequestBecas();
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
   //    // console.log("el useEffect de RequestBecaContext");
   //    // getRequestBecas();
   // });

   return (
      <RequestBecaContext.Provider
         value={{
            singularName,
            pluralName,
            formTitle,
            setFormTitle,
            textBtnSubmit,
            setTextBtnSumbit,
            requestBecas,
            setRequestBecas,
            requestBeca,
            setRequestBeca,
            formData,
            setFormData,
            openDialog,
            setOpenDialog,
            toggleDrawer,
            resetFormData,
            getRequestBecas,
            showRequestBeca,
            createRequestBeca,
            updateRequestBeca,
            deleteRequestBeca,
            getRequestBecasByUser,
            getRequestBecasByFolio,
            saveBeca,
            getReportRequestByFolio,
            updateStatusBeca,
            saveOrFinishReview
         }}
      >
         {children}
      </RequestBecaContext.Provider>
   );
}
export const useRequestBecaContext = () => useContext(RequestBecaContext);
