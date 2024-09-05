import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
// import { socket } from "./GlobalContext";

const SettingContext = createContext();

const formDataInitialState = {
   id: null,
   description: "",
   monthly_income_min: null,
   total_expenses_min: null,
   budget: null,
   total_payments: null,
   payment_frequency: "",
   max_approved: null,
   opportunities: 1,
   request_enabled: false,
   start_date_request: "",
   closing_date_request: "",
   cycle_id: null,
   active: true
};

export default function SettingContextProvider({ children }) {
   const singularName = "Ajuste"; //Escribirlo siempre letra Capital
   const pluralName = "Ajustes"; //Escribirlo siempre letra Capital
   const formikRef = useRef();

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [settings, setSettings] = useState([]);
   const [setting, setSetting] = useState(null);
   const [currentSetting, setCurrentSetting] = useState(JSON.parse(localStorage.getItem("currentSetting")) || formDataInitialState);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
         return formData;
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };
   const resetSetting = () => {
      try {
         setSetting(formDataInitialState);
      } catch (error) {
         console.log("Error en resetSetting:", error);
      }
   };

   const getCurrentSetting = async () => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/settings/current`);
         res = axiosData.data.data;
         // console.log("🚀 ~ getCurrentSetting ~ res:", res);
         if (!res.status) return;
         const current_setting = res.result;
         // console.log("🚀 ~ getCurrentSetting ~ current_setting:", current_setting);
         localStorage.setItem("currentSetting", JSON.stringify(current_setting));
         setCurrentSetting(current_setting);
         setFormData(current_setting);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getSettings = async () => {
      try {
         // console.log("getSettings() ejecutado");
         const res = CorrectRes;
         const axiosData = await Axios.get(`/settings`);
         res.result.settings = axiosData.data.data.result;
         setSettings(axiosData.data.data.result);
         // console.log("settings", settings);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getSettingsSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/settings/selectIndex`);
         // console.log("el selectedDeSettingss", axiosData);
         res.result.settings = axiosData.data.data.result;
         // res.result.settings.unshift({ id: 0, label: "Selecciona una opción..." });
         setSettings(axiosData.data.data.result);
         // console.log("settings", settings);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showSetting = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/settings/id/${id}`);
         res = axiosData.data.data;
         setSetting(res.result);
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

   const createSetting = async (setting) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/settings/create", setting);
         res = axiosData.data.data;

         // socket.send("getSettings()");

         getSettings();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateSetting = async (setting) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put(`/settings/update/${setting.id}`, setting);
         res = axiosData.data.data;
         getSettings();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteSetting = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/settings/delete/${id}`);
         // console.log("deleteSetting() axiosData", axiosData.data);
         getSettings();
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
   //    console.log("el useEffect de SettingContext");
   //    getSettings();
   // });

   return (
      <SettingContext.Provider
         value={{
            settings,
            setting,
            formData,
            setFormData,
            resetFormData,
            getSettings,
            getSettingsSelectIndex,
            showSetting,
            createSetting,
            updateSetting,
            deleteSetting,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName,
            formikRef,
            getCurrentSetting,
            currentSetting,
            setCurrentSetting
         }}
      >
         {children}
      </SettingContext.Provider>
   );
}
export const useSettingContext = () => useContext(SettingContext);
