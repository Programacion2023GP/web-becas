import { createContext, useContext, useState } from "react";
import Toast from "../utils/Toast";

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

const initialStateCounters = {
   requestAll: 0,
   requestByUser: 0,
   requestFinished: 0,
   requestInReview: 0,
   requestInEvaluate: 0,
   requestApproved: 0,
   requestPayed: 0,
   requestDelivered: 0,
   requestRejected: 0,
   requestCanceled: 0
};

export const GlobalContextProvider = ({ children }) => {
   // // const [loading, setLoading] = useState(true);
   // // const [loadingAction, setLoadingAction] = useState(false);
   // const [cursorLoading, setCursorLoading] = useState(false);
   // // const [openDialog, setOpenDialog] = useState(false);
   // const [bgImage, setBgImage] = useState("none");

   // const [loadLogo, setLoadLogo] = useState(true);
   // const [load, setLoad] = useState(true);
   // const [loadAction, setLoadAction] = useState(false);
   // const [openDialog, setOpenDialog] = useState(false);

   // const [loadLogo, setLoadLogo] = useState(true);
   const [load, setLoad] = useState(true);
   const [loadAction, setLoadAction] = useState(false);
   // const [loading, setLoading] = useState(true);
   // const [loadingAction, setLoadingAction] = useState(false);
   const [cursorLoading, setCursorLoading] = useState(false);
   const [openDialog, setOpenDialog] = useState(false);
   const [counters, setCounters] = useState(initialStateCounters);

   const toggleDrawer =
      (open, setOpenSwiper = null) =>
      (event) => {
         try {
            if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
               return;
            }
            setOpenSwiper ? setOpenSwiper(open) : setOpenDialog(open);
         } catch (error) {
            console.log("Error en toggleDrawer:", error);
            Toast.Error(error);
         }
      };

   const setLoading = (show) => {
      if (show) {
         setLoad(true);
         // setLoadLogo(true);
      } else {
         setTimeout(() => {
            // setLoadLogo(false);
            // setTimeout(() => {
            setLoad(false);
            // }, 1500);
         }, 500);
      }
   };

   const setLoadingAction = (show) => {
      if (show) {
         setLoadAction(true);
         // setLoadLogo(true);
      } else {
         setTimeout(() => {
            // setLoadLogo(false);
            // setTimeout(() => {
            setLoadAction(false);
            // }, 1500);
         }, 500);
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

   const resetCounters = () => {
      setCounters(initialStateCounters);
   };

   return (
      <GlobalContext.Provider
         value={{
            // loadLogo,
            // setLoadLogo,
            // load,
            // setLoad,
            // loadAction,
            // setLoadAction,
            // setLoading,
            // setLoadingAction,
            // openDialog,
            // setOpenDialog,
            // toggleDrawer,
            // formTitle,
            // setFormTitle,
            // textBtnSubmit,
            // setTextBtnSumbit,
            // cursorLoading,
            // setCursorLoading

            load,
            setLoad,
            loadAction,
            setLoadAction,
            // loading,
            setLoading,
            // loadingAction,
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
            setDataColoniesComplete,
            counters,
            setCounters,
            resetCounters
         }}
      >
         {children}
      </GlobalContext.Provider>
   );
};
export const useGlobalContext = () => useContext(GlobalContext);
