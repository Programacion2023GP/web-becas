import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import sAlert from "../utils/sAlert";

export const AuthContext = createContext();

export const Axios = axios;
Axios.defaults.baseURL = import.meta.env.VITE_API;
Axios.defaults.headers.common = {
   Accept: "application/json", //*/*
   "Content-Type": "application/json",
   Authorization: "Bearer "
};

export default function AuthContextProvider({ children }) {
   // const [auth, setAuth] = useState(null);
   const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")) || null);

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
         localStorage.setItem("auth", JSON.stringify(data.data.result.user));
         setAuth(JSON.parse(localStorage.getItem("auth")));
         // setAuth(data.data.result.auth);
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

   const logout = async () => {
      try {
         const { data } = await Axios.delete(`/logout/${auth.id}`);

         localStorage.removeItem("token");
         localStorage.removeItem("auth");
         setAuth(null);
         return data.data;
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      // console.log("el useEffect de AuthContext");
      const asyncCall = async () => await loggedInCheck();
      asyncCall();
   }, []);

   // console.log("el auth en el context: ", auth);
   // if (auth === null) return;

   // return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
   return <AuthContext.Provider value={{ register, login, auth, loggedInCheck, logout }}>{children}</AuthContext.Provider>;
}
export const useAuthContext = () => useContext(AuthContext);

// export default AuthContextProvider;
