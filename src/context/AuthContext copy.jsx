import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import sAlert from "../utils/sAlert";

export const AuthContext = createContext();

export const Axios = axios;
Axios.defaults.baseURL = import.meta.env.VITE_API;

Axios.defaults.headers.common = {
   Accept: "application/json", //*/*
   "Content-Type": "application/json",
   Authorization: `Bearer ${localStorage.getItem("token") || ""}`
};

export default function AuthContextProvider({ children }) {
   const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")) || null);
   const [permissionRead, setPermissionRead] = useState(false);

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
      } catch (error) {
         console.log(error);
         sAlert.Error("Parece que hay un error 🤔, intenta más tarde");
      }
      return data.data;
   };

   const login = async ({ email, password }) => {
      setAuth(null);
      try {
         const { data } = await Axios.post(`/login`, {
            email,
            password
         });

         if (data.data.status_code != 200 && !data.data.result.token) return alert("algo paso");
         localStorage.setItem("token", data.data.result.token);
         localStorage.setItem("auth", JSON.stringify(data.data.result));

         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;

         setAuth(JSON.parse(localStorage.getItem("auth")));
         // setAuth(data.data.result.auth);

         return data;
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
         const { data } = await Axios.post(`/logout/${auth.id}`);

         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         setAuth(null);
         return data;
      } catch (error) {
         console.log("me arrojo al catch");
         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         const token = localStorage.getItem("token") || null;
         Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         window.location.hash = "/login";
      }
   };

   const validateAccessPage = async () => {
      // console.log("validateAccessPage->el auth", auth);
      try {
         if (auth === null) {
            // console.log("al login");
            window.location.hash = "/login";
            return;
         }
         // console.log("auth.read", auth.read);
         // #region VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
         const currentPath = location.hash.split("#").reverse()[0];
         // console.log("currentPath", currentPath);
         let permission = false; // tengo permiso para estar en esta pagina?
         const permissions = { read: false, create: false, update: false, delete: false, more_permissions: "" }; // que permisos tengo para ésta pagina?
         auth.permissions = permissions;
         let validatePermissions = false; // voy a validar el permiso??? es decir, si estoy auth y no tengo en "read"=todas
         if (auth.read === "todas") auth.permissions.read = true;
         if (auth.create === "todas") auth.permissions.create = true;
         if (auth.update === "todas") auth.permissions.update = true;
         if (auth.delete === "todas") auth.permissions.delete = true;
         if (auth.more_permissions === "todas") auth.permissions.more_permissions = true;

         if (auth.read !== "todas") validatePermissions = true;
         if (currentPath === "/admin") validatePermissions = false;
         const dataPost = { url: currentPath };
         const { data } = await Axios.post(`/menus/getIdByUrl`, dataPost);

         if (validatePermissions) {
            // console.log("data/getIdByUrl", data);
            if (data.data.result !== null) {
               if (auth.read === undefined) return logout(401);
               const pagesRead = auth.read.split(",");
               // console.log("samuel quiere ver esto", data.data.result.id);
               const idPage = data.data.result.id.toString();
               // console.log(pagesRead);
               permission = pagesRead.includes(idPage) ? true : false;
            }
         } else {
            // console.log("no necesita validacion");
            permission = true;
         }

         // #region VALIDAR PERMISOS DE ACCIONES
         if (data.data.result !== null) {
            if (auth.read === undefined) return logout(401);
            // console.log("VAMOS A ASIGNAR LOS PERMISOS DE ACCIONES");
            const idPage = data.data.result.id.toString();
            // console.log("samuel quiere ver id de pagina para permisos de acciones", data.data.result.id);
            const pagesRead = auth.read === null ? "" : auth.read.split(",");
            const pagesCreate = auth.create === null ? "" : auth.create.split(",");
            const pagesUpdate = auth.update === null ? "" : auth.update.split(",");
            const pagesDelete = auth.delete === null ? "" : auth.delete.split(",");
            const morePermissions = auth.more_permissions === null ? "" : auth.more_permissions.split(",");
            // console.log(pagesRead);
            if (!auth.permissions.read) auth.permissions.read = pagesRead.includes(idPage) ? true : false;
            if (!auth.permissions.create) auth.permissions.create = pagesCreate.includes(idPage) ? true : false;
            if (!auth.permissions.update) auth.permissions.update = pagesUpdate.includes(idPage) ? true : false;
            if (!auth.permissions.delete) auth.permissions.delete = pagesDelete.includes(idPage) ? true : false;
            auth.permissions.more_permissions = morePermissions;
         }
         // #endregion VALIDAR PERMISOS DE ACCIONES
         localStorage.setItem("auth", JSON.stringify(auth));

         // console.log("el permission", permission);
         if (permission) setPermissionRead(permission);
         // console.log("el permissionRead", permissionRead);
         if (!permission) window.location.hash = "/admin";

         // #endregion VALIDAR SI TENGO PERMISO PARA ACCEDER A ESTA PAGINA
      } catch (error) {
         console.log(error);
         if (error.response.status === 401) logout(error.response.status);
      }
   };

   // useEffect(() => {
   //    const asyncCall = async () => await loggedInCheck();

   //    asyncCall();
   // }, []);

   // console.log("el auth en el context: ", auth);
   // if (auth === null) return;

   // return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
   return <AuthContext.Provider value={{ register, login, auth, loggedInCheck, logout, permissionRead, validateAccessPage }}>{children}</AuthContext.Provider>;
}
export const useAuthContext = () => useContext(AuthContext);

// export default AuthContextProvider;
