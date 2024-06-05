import { createContext, useContext, useEffect, useState } from "react";
import { Axios, useAuthContext } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import Toast from "../utils/Toast";
import * as tablerIcons from "@tabler/icons";
import { useGlobalContext } from "./GlobalContext";

const MenuContext = createContext();

const formDataInitialState = {
   id: 0,
   menu: "",
   caption: "",
   type: "group",
   belongs_to: 0,
   url: "",
   icon: "",
   order: "",
   show_counter: false,
   counter_name: "",
   others_permissions: "",

   active: true,
   patern: ""
};

export default function MenuContextProvider({ children }) {
   const { counters, setCounters } = useGlobalContext();
   const { auth, setAuth, logout } = useAuthContext();

   const singularName = "Menú"; //Escribirlo siempre letra Capital
   const pluralName = "Menús"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName.toUpperCase()}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [menus, setMenus] = useState([]);
   const [menusSelect, setMenusSelect] = useState([]);
   const [menu, setMenu] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [menuItems, setMenuItems] = useState({ items: [] });
   const [headerMenus, setHeaderMenus] = useState([]);
   const [permissionsByMenu, setPermissionsByMenu] = useState([]);
   const [checkMaster, setCheckMaster] = useState(false);
   const [checkMenus, setCheckMenus] = useState([]);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
         Toast.Error(error);
      }
   };

   const resetMenu = () => {
      try {
         setMenu(formDataInitialState);
      } catch (error) {
         console.log("Error en resetMenu:", error);
         Toast.Error(error);
      }
   };

   const getIdByUrl = async (dataPost) => {
      try {
         // setMenu([]);
         let res = CorrectRes;
         const axiosData = await Axios.post(`/menus/getIdByUrl`, dataPost);
         // console.log("axiosData", axiosData);

         res = axiosData.data.data;
         // console.log(res);
         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const MenusByRole = async (role_id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/menus/MenusByRole/${role_id}`);
         // console.log("axiosData", axiosData.status);

         res = axiosData.data.data;
         // await setMenu(res.result);
         setMenu(res.result);
         console.log(res.result);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showMyMenus = async () => {
      // console.log("cargando mis menussss");
      let res = CorrectRes;
      try {
         if (auth !== null) {
            const pages_read = auth.read;
            const axiosResponse = await Axios.get(`/menus/MenusByRole/${pages_read}`);
            // console.log("axiosResponse", axiosResponse);
            const menus = axiosResponse.data.data.result;
            // console.log("menus", menus);

            const HeaderMenus = menus.filter((menu) => menu.belongs_to == 0);
            // console.log("HeaderMenus", HeaderMenus);
            const items = [];
            HeaderMenus.map((hm) => {
               const item = {
                  id: hm.id,
                  title: hm.menu,
                  caption: hm.caption,
                  type: hm.type,
                  children: []
               };

               const childrenMenus = menus.filter((chm) => chm.belongs_to == hm.id);
               // console.log("childrenMenus", childrenMenus);
               childrenMenus.map((iCh) => {
                  const child = {
                     id: iCh.id,
                     title: iCh.menu,
                     type: iCh.type,
                     url: iCh.url,
                     show_counter: iCh.show_counter,
                     counter_name: iCh.counter_name,
                     icon: tablerIcons[`${iCh.icon}`]
                  };
                  item.children.push(child);
               });

               items.push(item);
            });
            // console.log("items", items);
            setMenuItems({ items: items });
            // setAuth({ ...auth, menus: "cambiados" });
         }
      } catch (error) {
         if (error.response.status === 401) {
            // console.log("no AUUUUTH!");
            localStorage.removeItem("token");
            localStorage.removeItem("auth");
            const token = localStorage.getItem("token") || null;
            Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            setAuth(null);
            location.hash = "/login";
            return;
         }
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const DisEnableMenu = async (id, active) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/menus/${id}/DisEnableMenu/${active ? "1" : "0"}`);
         // console.log("deleteUser() axiosData", axiosData.data);
         getMenus();
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

   const getHeaderMenusSelectIndex = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/menus/headers/selectIndex`);
         // console.log("el selectedDeLevels", axiosData);
         res.result.headerMenus = axiosData.data.data.result;
         // res.result.headerMenus.unshift({ id: 0, label: "Selecciona una opción..." });
         setHeaderMenus(axiosData.data.data.result);
         // console.log("headerMenus", headerMenus);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const counterOfMenus = async () => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/menus/counterOfMenus`);
         res = axiosData.data.data;
         // console.log("counterOfMenus()->res", res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   // #region CRUD
   const getMenus = async (getItems = false) => {
      try {
         // setMenu([]);
         const res = CorrectRes;
         const axiosData = await Axios.get(`/menus`);
         res.result.menus = axiosData.data.data.result;
         // console.log(res.result);

         if (getItems) {
            let _headerMenus = [];
            let _checkMenus = []; // #permisos
            _headerMenus = res.result.menus.filter((menu) => menu.belongs_to == 0);
            const items = [];

            await _headerMenus.map((hm) => {
               let _childrenMenus = [];
               const item = {
                  id: hm.id,
                  title: hm.menu,
                  // caption: hm.caption,
                  // type: hm.type,
                  children: []
               };

               // #permisos
               _checkMenus.push({
                  id: hm.id,
                  isChecked: false,
                  permissions: {
                     read: false,
                     create: false,
                     update: false,
                     delete: false,
                     more_permissions: []
                  }
               });
               // #permisos

               _childrenMenus = res.result.menus.filter((chm) => chm.belongs_to == hm.id);
               _childrenMenus.map((iCh) => {
                  let others_permissions = iCh.others_permissions == null ? [] : iCh.others_permissions.split(",");
                  others_permissions = others_permissions.map((op) => op.trim());
                  const child = {
                     id: iCh.id,
                     title: iCh.menu,
                     others_permissions: others_permissions
                     // type: iCh.type,
                     // url: iCh.url,
                     // icon: tablerIcons[`${iCh.icon}`]
                  };
                  item.children.push(child);

                  // #permisos
                  _checkMenus.push({
                     id: iCh.id,
                     isChecked: false,
                     permissions: {
                        read: false,
                        create: false,
                        update: false,
                        delete: false,
                        more_permissions: []
                     }
                  });
                  // #permisos
               });
               items.push(item);
            });
            // console.log("los items", items);
            setMenus(items);
            setCheckMenus(_checkMenus);
            // console.log("los checkMenus", checkMenus);
         } else setMenus(axiosData.data.data.result);
         // console.log("menus", menus);
         showMyMenus();
         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const getMenusSelectIndexToRoles = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/menus/selectIndexToRoles`);
         // console.log("el selectedDeLevels", axiosData);
         res.result.menus = axiosData.data.data.result;
         // console.log(res.result.menus);
         // res.result.menus.unshift({ id: 0, label: "Selecciona una opción..." });
         setMenusSelect(axiosData.data.data.result);
         // console.log("menus", menus);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showMenu = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/menus/id/${id}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // await setMenu(res.result);
         setFormData(res.result);
         setMenu(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const showMenuBy = async (searchBy, value) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/menus/${searchBy}/${value}`);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         // await setMenu(res.result);
         // setFormData(res.result);
         setMenu(res.result);
         // console.log(res);

         return res;
      } catch (error) {
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
   };

   const createMenu = async (menu) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/menus/create", menu);
         res = axiosData.data.data;
         getMenus();
         showMyMenus();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const updateMenu = async (menu) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post(`/menus/update/${menu.id}`, menu);
         res = axiosData.data.data;
         getMenus();
         showMyMenus();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
         Toast.Error(error);
      }
      return res;
   };

   const deleteMenu = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.post(`/menus/destroy/${id}`);
         // console.log("deleteMenu() axiosData", axiosData.data);
         getMenus();
         showMyMenus();
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
   // #endregion CRUD

   // useEffect(() => {
   //    console.log("el useEffect de MenuContext");
   //    getMenus();
   // });

   return (
      <MenuContext.Provider
         value={{
            singularName,
            pluralName,
            menus,
            menu,
            formData,
            setFormData,
            resetFormData,
            resetMenu,
            getMenus,
            showMenu,
            MenusByRole,
            getIdByUrl,
            showMyMenus,
            menuItems,
            createMenu,
            updateMenu,
            deleteMenu,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            DisEnableMenu,
            headerMenus,
            setHeaderMenus,
            getHeaderMenusSelectIndex,
            permissionsByMenu,
            setPermissionsByMenu,
            checkMaster,
            setCheckMaster,
            checkMenus,
            setCheckMenus,
            counterOfMenus,
            getMenusSelectIndexToRoles,
            menusSelect,
            setMenusSelect
         }}
      >
         {children}
      </MenuContext.Provider>
   );
}
export const useMenuContext = () => useContext(MenuContext);
