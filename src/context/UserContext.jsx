import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
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
   const singularName = "Usuario"; //Escribirlo siempre letra Capital
   const pluralName = "Usuarios"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [user, setUser] = useState(null);
   const [users, setUsers] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);

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

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.username = values.username;
         newData.email = values.email;
         // newData.password = values.password;
         newData.role_id = values.role_id;
         newData.phone = values.phone;
         newData.license_number = values.license_number;
         newData.license_due_date = values.license_due_date;
         newData.payroll_number = values.payroll_number;
         newData.department_id = values.department_id;
         newData.name = values.name;
         newData.paternal_last_name = values.paternal_last_name;
         newData.maternal_last_name = values.maternal_last_name;
         newData.community_id = values.community_id;
         newData.street = values.street;
         newData.num_ext = values.num_ext;
         newData.num_int = values.num_int;

         // newData.zip = values.zip;
         // newData.state = values.state;
         // newData.city = values.city;
         // newData.colony = values.colony;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
         Toast.Error(error);
      }
   };

   const getUsers = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/users`);
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
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </UserContext.Provider>
   );
}
export const useUserContext = () => useContext(UserContext);
