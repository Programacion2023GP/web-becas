import axios from "axios";
import { createContext, useContext, useState } from "react";
import sAlert from "../utils/sAlert";
import { CorrectRes } from "../utils/Response";
import { ROLE_CIUDADANO, useGlobalContext } from "./GlobalContext";
import { useEffect } from "react";
import Toast from "../utils/Toast";
import { useCycleContext } from "./CycleContext";
import { useSettingContext } from "./SettingContext";

export const AuthContext = createContext();

export const Axios = axios;
Axios.defaults.baseURL = import.meta.env.VITE_API;
Axios.defaults.headers.common = {
   Accept: "application/json", //*/*
   "Content-Type": "application/json",
   Authorization: `Bearer ${localStorage.getItem("token") || ""}`
};

export let idPage = 0;
const AuthinitialStatate = {
   id: null,
   username: "",
   email: "",
   email_verified_at: null,
   role_id: null,
   active: null,
   created_at: "",
   updated_at: null,
   deleted_at: null,
   role: "",
   read: false,
   create: false,
   update: false,
   delete: false,
   more_permissions: [],
   permissions: {
      read: false,
      create: false,
      update: false,
      delete: false,
      more_permissions: []
   }
};

export default function AuthContextProvider({ children }) {
   const { counters, setCounters, resetCounters } = useGlobalContext();

   const { getCurrentCycle } = useCycleContext();
   const { getCurrentSettings } = useSettingContext();
   const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")) || AuthinitialStatate);
   const [permissionRead, setPermissionRead] = useState(false);
   // const [idPage, setIdPage] = useState(0);

   const register = async ({ username, email, password, role }) => {
      try {
         const { data } = await Axios.post(`/signup`, {
            username,
            email,
            password,
            role
         });
         // console.log("el data register:", data);
         if (data.data.status_code == 200) sAlert.Success(data.data.alert_text, 2500);
         return data.data;
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error 🤔, intenta más tarde");
         return error;
      }
   };

   const login = async ({ email, password }) => {
      setAuth(null);
      try {
         let postData = {
            email,
            password
         };
         if (!email.includes("@"))
            postData = {
               username: email,
               password
            };
         // return console.log(postData);
         const { data } = await Axios.post(`/login`, postData);
         // console.log("data", data);

         if (data.data.result.token === null) sAlert.Customizable(data.data.alert_text, data.data.alert_icon, true, false);
         localStorage.setItem("token", data.data.result.token);
         data.data.result.user.permissions = {
            read: false,
            create: false,
            update: false,
            delete: false,
            more_permissions: []
         };
         localStorage.setItem("auth", JSON.stringify(data.data.result.user));
         // setAuth(data.data.result.auth);
         setAuth(JSON.parse(localStorage.getItem("auth")));
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;

         return data.data;
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error 🤔, intenta más tarde");
      }
   };

   const loggedInCheck = async () => {
      const token = localStorage.getItem("token") || null;
      Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (token != null && auth != null) {
         const { data } = await Axios.get(`users/${auth.id}`); //es el id
         if (data.data.status_code != 200) setAuth(null);
         else {
            localStorage.setItem("auth", JSON.stringify(data.data.result));
            setAuth(JSON.parse(localStorage.getItem("auth")));
            // setAuth(data.data.result);
         }
      }
   };

   const logout = async (status = null) => {
      try {
         if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("auth");
            const token = localStorage.getItem("token") || null;
            Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            setAuth(null);
            location.hash = "/login";
            return;
         }
         const { data } = await Axios.get(`/logout`);

         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         setAuth(null);
         location.hash = "/login";
         return data.data;
      } catch (error) {
         console.log(error);
         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         setAuth(null);
         location.hash = "/login";
      }
   };

   const counterOfMenus = async () => {
      let res = CorrectRes;
      try {
         await resetCounters();
         if (["", "#", "#/", "#/login", "#/register"].includes(window.location.hash)) return;
         counters.requestAll = 0;
         counters.requestInReview = 0;
         // console.log("counterofMenus");
         const axiosData = await Axios.get(`counters/counterOfMenus`);
         res = await axiosData.data.data;
         // console.log("🚀 ~ counterOfMenus ~ res:", res);
         const filterCounters = { ...counters };
         const newCounters = { ...counters };

         newCounters.requestAll = 0;
         filterCounters.requestAll = await res.result.filter((data) =>
            ["ALTA", "TERMINADA", "EN REVISIÓN", "EN EVALUACIÓN", "RECHAZADA", "APROBADA", "PAGO 1", "PAGO 2", "PAGO 3", "PAGADA", "ENTREGADA", "CANCELADA"].includes(
               data.counter
            )
         );
         await filterCounters.requestAll.map((data) => (newCounters.requestAll += data.total));

         // newCounters.requestByUser = 150;
         // if (auth.role_id === ROLE_CIUDADANO) {
         //    console.log("soy ciudadano");
         //    filterCounters.requestByUser = await res.result.filter((data) => console.log(data));
         //    await filterCounters.requestByUser.map((data) => (newCounters.requestByUser += data.total));
         // }

         newCounters.requestInReview = 0;
         filterCounters.requestInReview = await res.result.filter((data) => ["TERMINADA", "EN REVISIÓN"].includes(data.counter));
         await filterCounters.requestInReview.map((data) => (newCounters.requestInReview += data.total));

         newCounters.requestInEvaluation = 0;
         filterCounters.requestInEvaluation = await res.result.filter((data) => ["EN EVALUACIÓN"].includes(data.counter));
         await filterCounters.requestInEvaluation.map((data) => (newCounters.requestInEvaluation += data.total));

         newCounters.requestApproved = 0;
         filterCounters.requestApproved = await res.result.filter((data) => ["APROBADA"].includes(data.counter));
         await filterCounters.requestApproved.map((data) => (newCounters.requestApproved += data.total));

         newCounters.requestPayed1 = 0;
         filterCounters.requestPayed1 = await res.result.filter((data) => ["PAGO 1"].includes(data.counter));
         await filterCounters.requestPayed1.map((data) => (newCounters.requestPayed1 += data.total));

         newCounters.requestPayed2 = 0;
         filterCounters.requestPayed2 = await res.result.filter((data) => ["PAGO 2"].includes(data.counter));
         await filterCounters.requestPayed2.map((data) => (newCounters.requestPayed2 += data.total));

         newCounters.requestPayed3 = 0;
         filterCounters.requestPayed3 = await res.result.filter((data) => ["PAGO 3"].includes(data.counter));
         await filterCounters.requestPayed3.map((data) => (newCounters.requestPayed3 += data.total));

         newCounters.requestPayed = 0;
         filterCounters.requestPayed = await res.result.filter((data) => ["PAGADA"].includes(data.counter));
         await filterCounters.requestPayed.map((data) => (newCounters.requestPayed += data.total));

         newCounters.requestDelivered = 0;
         filterCounters.requestDelivered = await res.result.filter((data) => ["ENTREGADA"].includes(data.counter));
         await filterCounters.requestDelivered.map((data) => (newCounters.requestDelivered += data.total));

         newCounters.requestRejected = 0;
         filterCounters.requestRejected = await res.result.filter((data) => ["RECHAZADA"].includes(data.counter));
         await filterCounters.requestRejected.map((data) => (newCounters.requestRejected += data.total));

         newCounters.requestCanceled = 0;
         filterCounters.requestCanceled = await res.result.filter((data) => ["CANCELADA"].includes(data.counter));
         await filterCounters.requestCanceled.map((data) => (newCounters.requestCanceled += data.total));
         // console.log("newCounters", newCounters);

         setCounters(newCounters);
         // console.log("counters", counters);

         // return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };
   const validateAccessPage = async (updateAuth = false) => {
      // console.log("validateAccessPage->el auth", auth);
      try {
         // console.log("auth.antes", auth);
         if (auth === null) {
            // console.log("al login");
            window.location.hash = "/login";
            return;
         }
         if (updateAuth) await updatePermissionsAuth(auth.id);
         // window.addEventListener('hashchange',()=>{console.log('cambie de ruyta Luisao')}) IMPLEMENTARRRRRRR

         // console.log("auth.despues", auth);
         // #region VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
         const currentPath = location.hash.split("#").reverse()[0];
         const dataPost = { url: currentPath };
         let menu = null;
         const { data } = await Axios.post(`/menus/getIdByUrl`, dataPost);
         menu = data.data.result;
         let pagesRead;
         let idPage;
         if (menu !== null) {
            if (auth.read === undefined) return logout(401);
            idPage = menu;
            pagesRead = auth.read.split(",");
            // console.log(menu.id);
            idPage = menu.id.toString();
            // console.log(pagesRead);
         }

         // console.log("currentPath", currentPath);
         let permission = false; // tengo permiso para estar en esta pagina?
         let validatePermissions = false; // voy a validar el permiso??? es decir, si estoy auth y no tengo en "read"=todas
         const permissions = {
            read: false,
            create: false,
            update: false,
            delete: false,
            more_permissions: []
         };
         // console.log("QUE TRA DE PERMISOS EL AUTH - 1", auth);
         if (auth.read !== "todas") validatePermissions = true;
         if (currentPath === "/app") validatePermissions = false;

         if (menu) {
            permissions.read = auth.read === "todas" ? true : auth.read.split(",").includes(idPage) ? true : false;
            permissions.create = auth.create === "todas" ? true : auth.create === null ? false : auth.create.split(",").includes(idPage) ? true : false;
            permissions.update = auth.update === "todas" ? true : auth.update === null ? false : auth.update.split(",").includes(idPage) ? true : false;
            permissions.delete = auth.delete === "todas" ? true : auth.delete === null ? false : auth.delete.split(",").includes(idPage) ? true : false;
            permissions.more_permissions = auth.more_permissions === "todas" ? ["todas"] : auth.more_permissions === null ? [] : auth.more_permissions.split(",");
            const more_permissions_trim = permissions.more_permissions.map((p) => p.trim());
            permissions.more_permissions = more_permissions_trim;
            // PASAR PERMISOS AL AUTH
            auth.permissions = permissions;
         }

         // console.log("QUE TRA DE PERMISOS EL AUTH - 2", auth);

         // console.log("auth Antes", auth);
         // if (location.hash.split("/").length <= 3) {
         //    console.log("conservar los mismos valores del auth");
         //    setAuth(JSON.parse(localStorage.getItem("auth")));
         //    console.log("auth Despues", auth);
         // }

         if (validatePermissions) {
            // console.log("validatePermissions?", menu);
            // console.log("data/getIdByUrl", data);
            if (menu !== null) {
               if (auth.read === undefined) return logout(401);
               permission = pagesRead.includes(idPage) ? true : false;
            } else {
               if (location.hash.split("/").length >= 3) permission = true;
            }
         } else {
            // console.log("no necesita validacion");
            permission = true;
         }
         // console.log("el permission", permission);
         if (permission) setPermissionRead(permission);
         localStorage.setItem("auth", JSON.stringify(auth));
         // console.log("el permissionRead", permissionRead);
         // console.log(location.hash.split("/"));
         // console.log("🚀 ~ validateAccessPage ~ permission:", permission);
         // console.log("🚀 ~ validateAccessPage ~ location.hash:", location.hash.split("/"));
         if (!permission) {
            // console.log("sigue entrando");
            if (location.hash.split("/").length <= 3) {
               // console.log("y tengo menos de 3 slash");
               window.location.hash = `#${auth.page_index}`;
            }
            // console.log("🚀 ~ validateAccessPage ~ !location.hash.split('/').includes('solicitud-beca'):", !location.hash.split("/").includes("solicitud-beca"));
            if (!location.hash.split("/").includes("solicitud-beca")) {
               // console.log("mandar al page_index", auth.page_index);
               // console.log(window.location.hash);
               window.location.hash = `#${auth.page_index}`;
               // auth.permissions.read = true;
               setPermissionRead(true);
               // localStorage.setItem("auth", JSON.stringify(auth));
               // console.log("los permisos del auth", auth);
            }
         }

         // console.log("como quedo el permission?", permission);
         // console.log("auth al final", auth);

         // #endregion VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
      } catch (error) {
         console.log(error);
         if (error.response.status === 401) logout(error.response.status);
      }
   };

   const changePasswordAuth = async ({ password, new_password }) => {
      try {
         const postData = {
            password,
            new_password
         };
         // console.log(postData);
         const { data } = await Axios.post(`/users/changePasswordAuth`, postData);
         // console.log("el data register:", data);
         if (data.data.status_code == 200 && data.data.alert_icon == "success") sAlert.Success(data.data.alert_text, null);
         return data.data;
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error, intenta más tarde");
         return error;
      }
   };

   const updatePermissionsAuth = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/users/${id}`);
         res = axiosData.data.data;
         res.result.permissions = {
            read: auth.permissions.read,
            create: auth.permissions.create,
            update: auth.permissions.update,
            delete: auth.permissions.delete,
            more_permissions: auth.permissions.more_permissions ?? []
         };
         // console.log(res);
         localStorage.setItem("auth", JSON.stringify(res.result));
         // setAuth(data.data.result.auth);
         setAuth(JSON.parse(localStorage.getItem("auth")));

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
         return res;
      }
   };

   useEffect(() => {
      // console.log("el useEffect de AuthContext");
      validateAccessPage();
      counterOfMenus();
   }, []);

   // console.log("el auth en el context: ", auth);
   // if (auth === null) return;

   return (
      <AuthContext.Provider value={{ register, login, auth, loggedInCheck, logout, permissionRead, validateAccessPage, changePasswordAuth, counterOfMenus }}>
         {children}
      </AuthContext.Provider>
   );
}
export const useAuthContext = () => useContext(AuthContext);
