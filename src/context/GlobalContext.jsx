import { useSnackbar } from "notistack";
import { createContext, useContext, useEffect, useState } from "react";
import Toast from "../utils/Toast";
import axios from "axios";

//mis colores
export const gpcLight = "#E9ECEF";
export const gpcDark = "#1E2126";
export const gpcDark100 = "#566173";
export const gpcDarkContrast = "#E9ECEF";
export const gpcBlue = "#1455CB";
export const gpcText = "#1455CB";

export const ROLE_SUPER_ADMIN = 1;
export const ROLE_ADMIN = 2;
export const ROLE_CIUDADANO = 3;

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
   const [loading, setLoading] = useState(true);
   const [loadingAction, setLoadingAction] = useState(false);
   const [cursorLoading, setCursorLoading] = useState(false);
   const [openDialog, setOpenDialog] = useState(false);
   const [bgImage, setBgImage] = useState("none");

   const toggleDrawer = (open) => (event) => {
      try {
         if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
         }
         setOpenDialog(open);
      } catch (error) {
         console.log("Error en toggleDrawer:", error);
         Toast.Error(error);
      }
   };

   const [formTitle, setFormTitle] = useState("REGISTRAR OBJETO | EDITAR OBJETO");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR | GUARDAR");

   // #region INPUTS-COMMUNITY-COMPONENT
   const [disabledState, setDisabledState] = useState(true);
   const [disabledCity, setDisabledCity] = useState(true);
   const [disabledColony, setDisabledColony] = useState(true);
   const [showLoading, setShowLoading] = useState(false);
   const [dataStates, setDataStates] = useState([]);
   const [dataCities, setDataCities] = useState([]);
   const [dataColonies, setDataColonies] = useState([]);
   const [dataColoniesComplete, setDataColoniesComplete] = useState([]);
   //#endregion INPUTS-COMMUNITY-COMPONENT

   return (
      <GlobalContext.Provider
         value={{
            loading,
            setLoading,
            loadingAction,
            setLoadingAction,
            cursorLoading,
            setCursorLoading,
            openDialog,
            setOpenDialog,
            toggleDrawer,
            formTitle,
            setFormTitle,
            textBtnSubmit,
            setTextBtnSumbit,
            bgImage,
            setBgImage,
            disabledState,
            setDisabledState,
            disabledCity,
            setDisabledCity,
            disabledColony,
            setDisabledColony,
            showLoading,
            setShowLoading,
            dataStates,
            setDataStates,
            dataCities,
            setDataCities,
            dataColonies,
            setDataColonies,
            dataColoniesComplete,
            setDataColoniesComplete
         }}
      >
         {children}
      </GlobalContext.Provider>
   );
};
export const useGlobalContext = () => useContext(GlobalContext);
