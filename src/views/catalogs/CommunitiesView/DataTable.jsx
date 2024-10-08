import { useEffect, useState } from "react";
import { Button, ButtonGroup, Tooltip, Typography } from "@mui/material";

import { useCommunityContext } from "../../../context/CommunityContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatDatetime } from "../../../utils/Formats";
import { useAuthContext } from "../../../context/AuthContext";
import { IconCirclesRelation } from "@tabler/icons-react";
import CommunityFormAssignPerimeter from "./FormAssignPerimeter";

const CommunityDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      formData,
      setFormData,
      community,
      communities,
      getCommunities,
      showCommunity,
      deleteCommunity,
      DisEnableCommunity,
      resetFormData,
      resetCommunity,
      setTextBtnSumbit,
      setFormTitle,
      assignPerimeterToCommunity,
      formikRef,
      formikRefAssing
   } = useCommunityContext();

   const globalFilterFields = ["CodigoPostal", "Colonia", "Municipio", "Estado", "Perimetro", "Tipo", "Zona", "active", "created_at"];
   const [openDialogPreview, setOpenDialogPreview] = useState(false);
   const [nameCommunity, setNameCommunity] = useState(null);
   const [idCommunity, setIdCommunity] = useState(null);

   // #region BodysTemplate
   const ZipBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.CodigoPostal}</Typography>;
   const CommunityBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.Colonia}</Typography>;
   const MunicipalityBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.Municipio}</Typography>;
   const StateBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.Estado}</Typography>;
   const PerimeterBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.Perimetro}</Typography>;
   const TypeBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.Tipo}</Typography>;
   const ZoneBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.Zona}</Typography>;

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );
   const CreatedAtBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at, true)}</Typography>;

   // #endregion BodysTemplate

   const columns = [
      { field: "CodigoPostal", header: "C.P.", sortable: true, functionEdit: null, body: ZipBodyTemplate, filter: true, filterField: null },
      { field: "Perimetro", header: "Perímetro", sortable: true, functionEdit: null, body: PerimeterBodyTemplate, filter: true, filterField: null },
      { field: "Colonia", header: "Comunidad/Colonia", sortable: true, functionEdit: null, body: CommunityBodyTemplate, filter: true, filterField: null },
      { field: "Municipio", header: "Municipio", sortable: true, functionEdit: null, body: MunicipalityBodyTemplate, filter: true, filterField: null },
      { field: "Estado", header: "Estado", sortable: true, functionEdit: null, body: StateBodyTemplate, filter: true, filterField: null },
      { field: "Tipo", header: "Tipo", sortable: true, functionEdit: null, body: TypeBodyTemplate, filter: true, filterField: null },
      { field: "Zona", header: "Zona", sortable: true, functionEdit: null, body: ZoneBodyTemplate, filter: true, filterField: null }
   ];
   // auth.role_id === ROLE_SUPER_ADMIN &&
   //    columns.push(
   //       { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate,filter: false, filterField: null  },
   //       { field: "created_at", header: "Fecha de registro", sortable: true, functionEdit: null, body: CreatedAtBodyTemplate,filter: false, filterField: null  }
   //    );

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         // resetCommunity();
         resetFormData();
         setOpenDialog(true);
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
         await showCommunity(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickAssign = async (id, name, perimeterId) => {
      try {
         setLoadingAction(true);
         // const axiosResponse = await showCommunity(id);
         // console.log("🚀 ~ handleClickAssign ~ axiosResponse:", axiosResponse);
         // setFormData({ ...formData, perimeter_id: axiosResponse.result.perimeter_id });
         await formikRefAssing.current.setFieldValue("id", id);
         await formikRefAssing.current.setFieldValue("perimeter_id", perimeterId); //axiosResponse.result.perimeter_id);
         // setNameCommunity(name);
         // setIdCommunity(id);
         setOpenDialogPreview(true);
         // setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         setOpenDialogPreview(true);
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
               const axiosResponse = await deleteCommunity(id);
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
   //          axiosResponse = await DisEnableCommunity(id, !active);
   //          Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
   //       }, 500);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   const ButtonsAction = ({ id, name, active, perimeterId }) => {
      return (
         <ButtonGroup variant="outlined">
            {/* <Tooltip title={`Editar ${singularName}`} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip> */}
            {/* {console.log(idPage)} */}
            {(auth.permissions.more_permissions.includes(`Asignar Perímetro`) || auth.permissions.more_permissions.includes(`todas`)) && (
               <Tooltip title={`Asignar Perímetro a ${singularName}`} placement="top">
                  <Button color="secondary" onClick={() => handleClickAssign(id, name, perimeterId)}>
                     <IconCirclesRelation />
                  </Button>
               </Tooltip>
            )}
            {/* <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip> */}
            {/* {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{}}>
                     <SwitchIOSComponent checked={active} />
                  </Button>
               </Tooltip>
            )} */}
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", communities);
         await communities.map((obj, index) => {
            // if (index === 1) console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.Colonia} active={obj.active} perimeterId={obj.PerimetroId} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(communities[0]));
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
      <>
         <DataTableComponent
            columns={columns}
            data={data}
            globalFilterFields={globalFilterFields}
            headerFilters={true}
            btnAdd={auth.permissions.create}
            handleClickAdd={handleClickAdd}
            rowEdit={false}
            refreshTable={getCommunities}
         />
         <CommunityFormAssignPerimeter openDialog={openDialogPreview} setOpenDialog={setOpenDialogPreview} />
      </>
   );
};
export default CommunityDT;
