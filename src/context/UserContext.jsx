import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";

const UserContext = createContext();

const formDataInitialState = {
   id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   role: "Selecciona una opción..."
};
const userInitialState = {
   id: 0,
   username: "",
   email: "",
   password: "",
   role_id: 0,
   role: "Selecciona una opción...",
   phone: "",
   license_number: "",
   license_due_date: "",
   payroll_number: "",
   department_id: "",
   department: "Selecciona una opción...",
   name: "",
   paternal_last_name: "",
   maternal_last_name: "",
   community_id: 0,
   street: "",
   num_ext: "",
   num_int: "",

   zip: "",
   state: 0,
   city: 0,
   colony: 0
};

export default function UserContextProvider({ children }) {
   const { auth } = useAuthContext();

   const singularName = "Usuario"; //Escribirlo siempre letra Capital
   const pluralName = "Usuarios"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [user, setUser] = useState(formDataInitialState);
   const [users, setUsers] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);
   const formikRef = useRef();

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };
   const resetUser = () => {
      try {
         setUser(userInitialState);
      } catch (error) {
         console.log("Error en resetUser:", error);
         Toast.Error(error);
      }
   };

   const getUsers = async () => {
      try {
         const res = CorrectRes;
         // const axiosData = await Axios.get(`/users`);
         const axiosData = await Axios.get(`/users/role_id/${auth.role_id}`);
         res.result.users = axiosData.data.data.result;
         setUsers(axiosData.data.data.result);
         // console.log("users", users);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showUser = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/users/${id}`);
         res = axiosData.data.data;
         setUser(res.result);
         setFormData(res.result);
         // fillFormData(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createUser = async (user) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/users", user);
         // console.log(axiosData);
         res = axiosData.data.data;
         getUsers();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateUser = async (user) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/users", user);
         res = axiosData.data.data;
         getUsers();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteUser = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/users/${id}`);
         // console.log("deleteUser() axiosData", axiosData.data);
         getUsers();
         res = axiosData.data.data;
         // console.log("res", res);
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const deleteMultiple = async (ids) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/users/destroyMultiple`, { ids });
         // console.log("deleteMultiple() axiosData", axiosData.data);
         getUsers();
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

   const DisEnableUser = async (id, active) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/users/${id}/DisEnableUser/${active ? "1" : "0"}`);
         // console.log("deleteUser() axiosData", axiosData.data);
         getUsers();
         res = axiosData.data.data;
         // console.log("res", res);
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   // useEffect(() => {
   //    console.log("el useEffect de UserContext");
   //    getUsers();
   // });

   return (
      <UserContext.Provider
         value={{
            singularName,
            pluralName,
            users,
            user,
            setUser,
            resetUser,
            formData,
            setFormData,
            resetFormData,
            getUsers,
            showUser,
            createUser,
            updateUser,
            deleteUser,
            DisEnableUser,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            deleteMultiple,
            formikRef
         }}
      >
         {children}
      </UserContext.Provider>
   );
}
export const useUserContext = () => useContext(UserContext);
