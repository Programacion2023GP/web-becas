import { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import { useSchoolContext } from "../../../context/SchoolContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatDatetime, formatPhone } from "../../../utils/Formats";
import { GetDataCommunity } from "../../../utils/GetDataCommunity";
import { useAuthContext } from "../../../context/AuthContext";

const SchoolDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, school, schools, getSchools, showSchool, deleteSchool, resetFormData, resetSchool, setTextBtnSumbit, setFormTitle } = useSchoolContext();
   const globalFilterFields = ["code", "level", "school", "director", "phone", "loc_for", "zone", "created_at"];

   // #region BodysTemplate
   const CodeBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.code}</Typography>;
   const LevelBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.level}</Typography>;
   const SchoolBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.school}</Typography>;
   const AddressBodyTemplate = (obj) => {
      obj.community = GetDataCommunity(obj.community_id);
      return <Typography textAlign={"center"}>{obj.community.Colonia}</Typography>;
   };
   const DirectorBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.director}</Typography>;
   const PhoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatPhone(obj.phone)}</Typography>;
   const LocForBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.loc_for == "1" ? "LOCAL" : "FORANEA"}</Typography>;
   const ZoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.zone == "U" ? "URBANA" : "RURAL"}</Typography>;

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at, true)}</Typography>;
   // #endregion BodysTemplate

   const columns = [
      { field: "code", header: "Clave", sortable: true, functionEdit: null, body: CodeBodyTemplate, filterField: null },
      { field: "level", header: "Nivel", sortable: true, functionEdit: null, body: LevelBodyTemplate, filterField: null },
      { field: "school", header: "Escuela", sortable: true, functionEdit: null, body: SchoolBodyTemplate, filterField: null },
      // { field: "address", header: "Dirección", sortable: true, functionEdit: null, body: AddressBodyTemplate, filterField: null },
      { field: "director", header: "Director", sortable: true, functionEdit: null, body: DirectorBodyTemplate, filterField: null },
      { field: "phone", header: "Teléfono", sortable: true, functionEdit: null, body: PhoneBodyTemplate, filterField: null },
      { field: "loc_for", header: "Local / Foraneo", sortable: true, functionEdit: null, body: LocForBodyTemplate, filterField: null },
      { field: "zone", header: "Zona", sortable: true, functionEdit: null, body: ZoneBodyTemplate, filterField: null }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null },
         { field: "created_at", header: "Fecha de registro", sortable: true, functionEdit: null, body: CreatedAtBodyTemplate, filterField: null }
      );

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         resetFormData();
         setOpenDialog(true);
         // console.log("klasdklasdl");
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showSchool(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteSchool(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   // const handleClickDisEnable = async (id, name, active) => {
   //    try {
   //       let axiosResponse;
   //       setTimeout(async () => {
   //          axiosResponse = await DisEnableUser(id, !active);
   //          Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
   //       }, 500);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   const ButtonsAction = ({ id, name, active }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Editar ${singularName}`} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
            {/* {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{}}>
                     <SwitchComponent checked={active} />
                  </Button>
               </Tooltip>
            )} */}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", schools);
         await schools.map((obj,index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.code} active={obj.active} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(schools[0]));
         // console.log("la data del formatData", globalFilterFields);
         setLoading(false);
      } catch (error) {
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
         handleClickAdd={handleClickAdd}
         rowEdit={false}
         refreshTable={getSchools}
      />
   );
};
export default SchoolDT;
