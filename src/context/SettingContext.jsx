import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
// import { socket } from "./GlobalContext";

const SettingContext = createContext();

const formDataInitialState = {
   id: null,
   cycle_name: "",
   cycle_start: "",
   cycle_end: "",

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
   const [currentSettings, setCurrentSettings] = useState(JSON.parse(localStorage.getItem("currentSettings")) || formDataInitialState);
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

   const createOrUpdateCycle = async (cycle) => {
      let res = CorrectRes;
      try {
         const url = cycle.id > 0 ? `/settings/update/cycle/${cycle.id}` : `/settings/create/cycle`;

         const axiosData = await Axios.post(url, cycle);
         res = axiosData.data.data;

         await getSettings();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const getCurrentSettings = async () => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/settings/current`);
         res = axiosData.data.data;
         // console.log("🚀 ~ getCurrentSettings ~ res:", res);
         if (!res.status) return;
         const current_settings = res.result;
         // console.log("🚀 ~ getCurrentSettings ~ current_settings:", current_settings);
         localStorage.setItem("currentSettings", JSON.stringify(current_settings));
         setCurrentSettings(current_settings);
         setFormData(current_settings);

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
         setFormData(axiosData.data.data.result);
         // console.log("settings", settings);
         await getCurrentSettings();

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
         await getCurrentSettings();

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
         await getSettings();
         await getCurrentSettings();
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
         await getSettings();
         res = axiosData.data.data;
         await getCurrentSettings();
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

   // useMemo(async () => {
   //    console.log("soy un memo");
   //    const { result } = await getCurrentSettings();
   //    setCurrentSettings(result);
   // }, []);

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
            getCurrentSettings,
            currentSettings,
            setCurrentSettings,
            createOrUpdateCycle
         }}
      >
         {children}
      </SettingContext.Provider>
   );
}
export const useSettingContext = () => useContext(SettingContext);
