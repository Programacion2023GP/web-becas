import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const RoleContext = createContext();

const formDataInitialState = {
   id: 0,
   role: "",
   description: "",
   read: "",
   create: "",
   update: "",
   delete: "",
   more_permissions: "",
   active: true,
   page_index: 0
};

export default function RoleContextProvider({ children }) {
   const { auth, validateAccessPage } = useAuthContext();
   const singularName = "Rol"; //Escribirlo siempre letra Capital
   const pluralName = "Roles"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [roles, setRoles] = useState([]);
   const [role, setRole] = useState(null);
   const [roleSelect, setRoleSelect] = useState(formDataInitialState);
   const [rolesSelect, setRolesSelect] = useState([]);
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };
   const resetRole = () => {
      try {
         setRole(formDataInitialState);
      } catch (error) {
         console.log("Error en resetRole:", error);
      }
   };
   const resetRoleSelect = () => {
      try {
         setRoleSelect(formDataInitialState);
      } catch (error) {
         console.log("Error en resetRoleSelect:", error);
      }
   };

   const updatePermissions = async (role) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/roles/updatePermissions", role);
         res = axiosData.data.data;
         // getRoles();
         validateAccessPage(); // actualizar permisos en el auth
         return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const getRoles = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/roles/role_id/${auth.role_id}`);
         res.result.roles = axiosData.data.data.result;
         setRoles(axiosData.data.data.result);
         // console.log("roles", roles);
         // showRoleSelect(auth.role_id);
         getRolesSelectIndex();
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
         // const axiosData = await Axios.get(`/roles/selectIndex/role_id`);
         const axiosData = await Axios.get(`/roles/selectIndex/role_id/${auth.role_id}`);
         // console.log("el selectedDeRoles", axiosData);
         res.result.roles = axiosData.data.data.result;
         // res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
         setRolesSelect(axiosData.data.data.result);
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
         // console.log(axiosData.data.data.result.page_index);
         // let page_index_id = 0;
         // const axiosDataMenu = await Axios.post(`/menus/getIdByUrl`, { url: axiosData.data.data.result.page_index });
         // console.log("axiosDataMenu", axiosDataMenu.data.data.result);
         // page_index_id = axiosDataMenu.data.data.result == null ? 0 : axiosDataMenu.data.data.result.id;
         // console.log(page_index_id);
         // axiosData.data.data.result.page_index = page_index_id;

         setOpenDialog(true);
         res = axiosData.data.data;
         // console.log("showRole->res", res);
         setRole(res.result);
         setFormData(res.result);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showRoleSelect = async (id) => {
      try {
         // console.log("showRoleSelect");
         let res = CorrectRes;
         const axiosData = await Axios.get(`/roles/${id}`);
         // console.log(axiosData.data.data.result.page_index);
         let page_index_id = 0;
         const axiosDataMenu =
            axiosData.data.data.result.page_index == null ? null : await Axios.post(`/menus/getIdByUrl`, { url: axiosData.data.data.result.page_index });
         page_index_id = axiosDataMenu == null ? 0 : axiosDataMenu.data.data.result.id;
         // console.log(page_index_id);
         axiosData.data.data.result.page_index = page_index_id;
         // console.log(axiosData.data.data.result);

         setOpenDialog(true);
         res = axiosData.data.data;
         // console.log("showRoleSelect->res", res);
         setRoleSelect(res.result);

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
         const axiosData = await Axios.post("/roles/update", role);
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
         const axiosData = await Axios.delete(`/roles/destoy/${id}`);
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

   const DisEnableRole = async (id, active) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/roles/${id}/DisEnableRole/${active ? "1" : "0"}`);
         // console.log("deleteUser() axiosData", axiosData.data);
         getRoles();
         res = axiosData.data.data;
         // console.log("res", res);
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
         return res;
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
            rolesSelect,
            setRolesSelect,
            formData,
            resetFormData,
            resetRole,
            getRoles,
            getRolesSelectIndex,
            showRole,
            createRole,
            updateRole,
            deleteRole,
            DisEnableRole,
            openDialog,
            setOpenDialog,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName,
            roleSelect,
            setRoleSelect,
            resetRoleSelect,
            showRoleSelect,
            updatePermissions,
            formikRef
         }}
      >
         {children}
      </RoleContext.Provider>
   );
}
export const useRoleContext = () => useContext(RoleContext);
