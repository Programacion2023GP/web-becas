import React, { useEffect } from "react";
import { Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";

import { useMenuContext } from "../../../context/MenuContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatDatetime } from "../../../utils/Formats";
import { useAuthContext } from "../../../context/AuthContext";
import { Box } from "@mui/system";
import SwitchIOSComponent from "../../../components/SwitchIOSComponent";
import * as tablerIcons from "@tabler/icons";

const MenuDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      menu,
      menus,
      getMenus,
      showMenu,
      deleteMenu,
      DisEnableMenu,
      formData,
      setFormData,
      resetFormData,
      resetMenu,
      setTextBtnSumbit,
      setFormTitle,
      isItem,
      setIsItem,
      formikRef
   } = useMenuContext();
   const globalFilterFields = ["id", "icon", "menu", "caption", "patern", "order", "url", "counter_name", "others_permissions", "active", "created_at"];

   // #region BodysTemplate
   const IDBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.id}</b>
      </Typography>
   );
   const IconBodyTemplate = (obj) => {
      // const Icon = React.createElement(obj.icon ? obj.icon : IconPointFilled);
      const Icon = tablerIcons[`${obj.icon}`];
      return (
         <Box textAlign={"center"}>
            {obj.icon && (
               <>
                  <Icon stroke={1.5} size="1.3rem" />
                  <Typography variant="subtitle2">{obj.icon}</Typography>
               </>
            )}
         </Box>
      );
   };
   const MenuBodyTemplate = (obj) => (
      <>
         <Typography textAlign={"center"}>{obj.menu}</Typography>
         {obj.caption && (
            <Typography textAlign={"center"} sx={{ fontStyle: "italic", fontSize: 12 }}>
               {obj.caption}
            </Typography>
         )}
      </>
   );
   const InfoBodyTemplate = (obj) => (
      <>
         {obj.belongs_to > 0 ? (
            <Typography textAlign={"center"}>
               Pertence a: <b>{obj.patern ?? "-"}</b>
               <br />
               Orden: <b>{obj.order ?? "-"}</b>
               <br />
               Path: <b>{obj.url ?? "-"}</b>
               <br />
               Nombre del Contador: <b>{obj.counter_name ?? "-"}</b>
            </Typography>
         ) : (
            <>
               <Typography textAlign={"center"}>
                  <b>{"***** MENÚ PADRE *****"}</b>
               </Typography>
               <Typography textAlign={"center"}>
                  Orden: <b>{obj.order ?? "-"}</b>
               </Typography>
            </>
         )}
      </>
   );
   const OthersPermissionsTemplate = (obj) => (
      <>
         <Typography textAlign={"center"}>{obj.others_permissions}</Typography>
      </>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at, true)}</Typography>;

   // #endregion BodysTemplate

   const columns = [
      { field: "id", header: "ID", sortable: true, functionEdit: null, body: IDBodyTemplate },
      { field: "icon", header: "Icono", sortable: true, functionEdit: null, body: IconBodyTemplate, filterField: null },
      { field: "menu", header: "Menu", sortable: true, functionEdit: null, body: MenuBodyTemplate, filterField: null },
      { field: "level", header: "Info", sortable: true, functionEdit: null, body: InfoBodyTemplate, filterField: null },
      { field: "others_permissions", header: "Otros Permisos", sortable: true, functionEdit: null, body: OthersPermissionsTemplate, filterField: null }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null }
         // { field: "created_at", header: "Fecha de registro", sortable: true, functionEdit: null, body: CreatedAtBodyTemplate, filterField: null }
      );

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         // resetMenu();
         resetFormData();
         formikRef.current.resetForm();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         setOpenDialog(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         const axiosResponse = await showMenu(id);
         setIsItem(axiosResponse.result.type == "item" ? true : false);
         if (axiosResponse.result.description) axiosResponse.result.description == null && (axiosResponse.result.description = "");
         formikRef.current.setValues(axiosResponse.result);
         // setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         setLoadingAction(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteMenu(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         setLoadingAction(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDisEnable = async (id, name, active) => {
      try {
         let axiosResponse;
         setTimeout(async () => {
            axiosResponse = await DisEnableMenu(id, !active);
            Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         }, 500);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, name, active }) => {
      return (
         <ButtonGroup variant="outlined">
            {auth.permissions.update && (
               <Tooltip title={`Editar ${singularName}`} placement="top">
                  <Button color="info" onClick={() => handleClickEdit(id)}>
                     <IconEdit />
                  </Button>
               </Tooltip>
            )}
            {/* <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip> */}
            {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{}}>
                     <SwitchIOSComponent checked={Boolean(active)} />
                  </Button>
               </Tooltip>
            )}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", menus);
         await menus.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.menu} active={obj.active} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(menus[0]));
         // console.log("la data del formatData", globalFilterFields);
         setLoading(false);
      } catch (error) {
         setLoading(false);
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {
      setLoading(false);
   }, []);
   
   return (
      <DataTableComponent
         columns={columns}
         data={data}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         btnAdd={false}
         handleClickAdd={handleClickAdd}
         rowEdit={false}
         refreshTable={getMenus}
         btnsExport={false}
         scrollHeight="63vh"
      />
   );
};
export default MenuDT;
