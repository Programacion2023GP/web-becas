import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import sAlert from "../utils/sAlert";
import { CorrectRes } from "../utils/Response";

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
         if (currentPath === "/admin") validatePermissions = false;

         if (menu) {
            permissions.read = auth.read === "todas" ? true : auth.read.split(",").includes(idPage) ? true : false;
            permissions.create = auth.create === "todas" ? true : auth.create === null ? false : auth.create.split(",").includes(idPage) ? true : false;
            permissions.update = auth.update === "todas" ? true : auth.update === null ? false : auth.update.split(",").includes(idPage) ? true : false;
            permissions.delete = auth.delete === "todas" ? true : auth.delete === null ? false : auth.delete.split(",").includes(idPage) ? true : false;
            permissions.more_permissions = auth.more_permissions === "todas" ? ["todas"] : auth.more_permissions === null ? [] : auth.more_permissions.split(",");

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
         if (!permission) {
            console.log("sigue entrando");
            if (location.hash.split("/").length <= 3) {
               // console.log("y tengo menos de 3 slash");
               window.location.hash = auth.page_index;
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

   // useEffect(() => {
   //    console.log("el useEffect de AuthContext");
   //    const asyncCall = async () => await loggedInCheck();
   //    asyncCall();
   // }, []);

   // console.log("el auth en el context: ", auth);
   // if (auth === null) return;

   return (
      <AuthContext.Provider value={{ register, login, auth, loggedInCheck, logout, permissionRead, validateAccessPage, changePasswordAuth }}>
         {children}
      </AuthContext.Provider>
   );
}
export const useAuthContext = () => useContext(AuthContext);
