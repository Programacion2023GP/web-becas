import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const RoleContext = createContext();

const formDataInitialState = {
   id: 0,
   role: ""
};

export default function RoleContextProvider({ children }) {
   const singularName = "Rol"; //Escribirlo siempre letra Capital
   const pluralName = "Roles"; //Escribirlo siempre letra Capital
   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [roles, setRoles] = useState([]);
   const [role, setRole] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);

   const toggleDrawer = (open) => (event) => {
      try {
         if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
         }
         setOpenDialog(open);
      } catch (error) {
         console.log("Error en toggleDrawer:", error);
      }
   };

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.role = values.role;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getRoles = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/roles`);
         res.result.roles = axiosData.data.data.result;
         setRoles(axiosData.data.data.result);
         // console.log("roles", roles);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const getRolesSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/roles/selectIndex`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.roles = axiosData.data.data.result;
         res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
         setRoles(axiosData.data.data.result);
         // console.log("roles", roles);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showRole = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/roles/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         setRole(res.result);
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

   const createRole = async (role) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/roles", role);
         res = axiosData.data.data;
         getRoles();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateRole = async (role) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/roles", role);
         res = axiosData.data.data;
         getRoles();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteRole = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/roles/${id}`);
         // console.log("deleteRole() axiosData", axiosData.data);
         getRoles();
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
   //    console.log("el useEffect de RoleContext");
   //    getRoles();
   // });

   return (
      <RoleContext.Provider
         value={{
            roles,
            role,
            formData,
            resetFormData,
            getRoles,
            getRolesSelectIndex,
            showRole,
            createRole,
            updateRole,
            deleteRole,
            openDialog,
            setOpenDialog,
            toggleDrawer,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName
         }}
      >
         {children}
      </RoleContext.Provider>
   );
}
export const useRoleContext = () => useContext(RoleContext);
