import { useEffect, useState } from "react";
import { Button, ButtonGroup, Dialog, DialogContent, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { IconX, IconWindowMaximize, IconWindowMinimize, IconFileTypePdf, IconThumbUpFilled, IconCoin } from "@tabler/icons-react";

import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_ADMIN, ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconBan, IconChecklist, IconEye, IconFileSpreadsheet, IconPrinter, IconThumbDown } from "@tabler/icons";
import { formatDatetime } from "../../../utils/Formats";
import { Link } from "react-router-dom";
import { Axios, useAuthContext } from "../../../context/AuthContext";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { Box } from "@mui/system";
import { getCommunityById } from "../../../components/Form/InputsCommunityComponent";
import { useFamilyContext } from "../../../context/FamilyContext";
import html2pdf from "html2pdf.js";
import RequestReportPDF from "./RequestReportPDF";
import ModalReject from "./ModalReject";

const RequestBecaDT = ({ status = null }) => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      pluralName,
      requestBecas,
      setRequestBecas,
      getRequestBecas,
      showRequestBeca,
      deleteRequestBeca,
      setTextBtnSumbit,
      setFormTitle,
      updateStatusBeca
   } = useRequestBecaContext();
   const globalFilterFields = [
      "folio",
      "code",
      "level",
      "school",
      "curp",
      "name",
      "paternal_last_name",
      "maternal_last_name",
      "average",
      "status",
      "current_page",
      "created_at",
      "end_date",
      "socioeconomic_study"
   ];
   const { getIndexByFolio } = useFamilyContext();
   const [folio, setFolio] = useState(0);
   const [openModalReject, setOpenModalReject] = useState(false);

   const [openDialogPreview, setOpenDialogPreview] = useState(false);
   const [fullScreenDialog, setFullScreenDialog] = useState(false);
   const [objReport, setObjReport] = useState(null);

   const [downloadOptions, setDownloadOptions] = useState({
      margin: 0.5,
      filename: "Solicitud de Beca.pdf",
      image: {
         type: "png",
         quality: 1,
         width: 300
      },
      enableLinks: true,
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: {
         unit: "cm",
         format: "letter",
         orientation: "portrait",
         scrollY: 0
      }
      // pagebreak: { before: "#page2" } // Agrega paginación antes de un elemento con el ID 'page2'
   });

   const downloadPDF = async (elementID) => {
      setLoadingAction(true);
      const element = document.getElementById(elementID);
      const htmlContent = element.innerHTML;
      const title = "Solicitud de Beca";
      setDownloadOptions({
         ...downloadOptions,
         filename: title
      });

      await html2pdf().from(htmlContent).set(downloadOptions).outputPdf().save();
      setLoadingAction(false);
   };

   const printContent = (idContent) => {
      var content = document.getElementById(idContent).innerHTML;
      var printWindow = window.open("", "_blank");
      printWindow.document.write(`<html><head>
         <title>Solicitud de Beca</title>
         <link rel="preconnect" href="https://fonts.googleapis.com">
         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
         <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
         <style>
            table{font-family: 'Roboto', sans-serif;}
         </style>
      </head><body>`);
      printWindow.document.write(content);
      printWindow.document.write(`</body></html>`);
      printWindow.document.close();
      setTimeout(() => {
         printWindow.print();
      }, 500);
   };

   //#region BODY TEMPLATES
   const FolioBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.folio}</b>
      </Typography>
   );
   const SchoolBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b style={{ borderBottom: "1px solid" }}>{obj.code}</b> <br />
         <b>{obj.level}</b> - {obj.school}
      </Typography>
   );
   const StudentBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b style={{ borderBottom: "1px solid" }}>{obj.curp}</b> <br />
         {obj.name} {obj.paternal_last_name} {obj.maternal_last_name}
      </Typography>
   );
   const AverageBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.average}</b>
      </Typography>
   );
   const StatusBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.status}</b>
      </Typography>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );
   const CurrentBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.current_page}</b>
      </Typography>
   );
   const SocioeconomicStudyBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.socioeconomic_study}</b>
      </Typography>
   );
   const RequestDateBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at)}</Typography>;
   const EndDateBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.end_date)}</Typography>;
   //#endregion BODY TEMPLATES

   const columns = [
      { field: "folio", header: "Folio", sortable: true, functionEdit: null, body: FolioBodyTemplate },
      { field: "school", header: "Escuela", sortable: true, functionEdit: null, body: SchoolBodyTemplate },
      { field: "student", header: "Alumno", sortable: true, functionEdit: null, body: StudentBodyTemplate },
      { field: "average", header: "Promedio", sortable: true, functionEdit: null, body: AverageBodyTemplate },
      { field: "status", header: "Estatus", sortable: true, functionEdit: null, body: StatusBodyTemplate },
      { field: "current_page", header: "Página", sortable: true, functionEdit: null, body: CurrentBodyTemplate, filterField: null },
      { field: "created_at", header: "Fecha de Solicitud", sortable: true, functionEdit: null, body: RequestDateBodyTemplate },
      { field: "end_date", header: "Fecha de Termino", sortable: true, functionEdit: null, body: EndDateBodyTemplate },
      { field: "socioeconomic_study", header: "Estudio Socio-Económico", sortable: true, functionEdit: null, body: SocioeconomicStudyBodyTemplate }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null }
         // { field: "created_at", header: "Fecha de Solicitud", sortable: true, functionEdit: null, body: RequestDateBodyTemplate, filterField: null }
      );

   const mySwal = withReactContent(Swal);

   const handleClickView = async (obj) => {
      try {
         setLoadingAction(true);
         // return console.log(obj);
         const community = await getCommunityById(obj.community_id);
         const school_community = await getCommunityById(obj.school_community_id);
         const familyData = await getIndexByFolio(obj.folio);
         obj.community = community;
         obj.school_community = school_community;
         obj.families = familyData.result.families;
         setObjReport(obj);
         setOpenDialogPreview(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickValidateDocuments = async (folio, current_status) => {
      try {
         if (current_status == "TERMINADA") {
            const axiosResponse = await updateStatusBeca(folio, "EN REVISIÓN", null, status);
            Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         }
         location.hash = `/admin/solicitud-beca/pagina/9/folio/${folio}`;
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickApprove = async (folio) => {
      try {
         const axiosResponse = await updateStatusBeca(folio, "APROBADA", { user_id: auth.id }, status);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const handleClickReject = async (folio) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de RECHAZAR la solicitud con folio #${folio}`, "RECHAZAR!", "NO CANCELAR")).then(async (result) => {
            if (result.isConfirmed) {
               setFolio(folio);
               setOpenModalReject(true);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const handleClickPayed = async (folio) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de PAGAR y ENTREGAR la beca con folio #${folio}`, "PAGAR!", "CANCELAR")).then(async (result) => {
            if (result.isConfirmed) {
               const axiosResponse = await updateStatusBeca(folio, "PAGADA", null, status);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickAdd = () => {
      try {
         location.hash = "/admin/solicitud-beca";
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
         await showRequestBeca(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickCancel = async (id, folio, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de cancelar la solicitud con folio #${folio}`, "CANCELAR", "NO CANCELAR")).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await updateStatusBeca(folio, "CANCELADA", null, status);
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

   const ButtonsAction = ({ id, name, current_page, obj }) => {
      if (["CANCELADA"].includes(obj.status)) return;
      return (
         <ButtonGroup variant="outlined">
            {obj.end_date == null && (
               <Tooltip title={`Solicitud ${name}`} placement="top">
                  <Button color="dark">
                     <Link to={`/admin/solicitud-beca/pagina/${current_page}/folio/${id}`} target="_blank" style={{ textDecoration: "none" }}>
                        Continuar
                     </Link>
                  </Button>
               </Tooltip>
            )}
            {!["ALTA"].includes(obj.status) && (
               <Tooltip title={`Ver Solicitud ${name}`} placement="top">
                  <Button color="dark" onClick={() => handleClickView(obj)}>
                     <IconEye />
                  </Button>
               </Tooltip>
            )}
            {(auth.permissions.more_permissions.includes(`16@Validar Documentos`) || auth.permissions.more_permissions.includes(`18@Validar Documentos`)) &&
               ["TERMINADA", "EN REVISIÓN"].includes(obj.status) && (
                  <Tooltip title={`Validar Documentos del Folio #${name}`} placement="top">
                     <Button color="primary" onClick={() => handleClickValidateDocuments(obj.folio, obj.status)}>
                        <IconChecklist />
                     </Button>
                  </Tooltip>
               )}
            {(auth.permissions.more_permissions.includes(`16@Evaluar`) || auth.permissions.more_permissions.includes(`19@Evaluar`)) &&
               ["EN EVALUACIÓN"].includes(obj.status) && (
                  <Tooltip title={`Aprobar Folio #${name}`} placement="top">
                     <Button color="primary" onClick={() => handleClickApprove(obj.folio)}>
                        <IconThumbUpFilled />
                     </Button>
                  </Tooltip>
               )}
            {(auth.permissions.more_permissions.includes(`16@Evaluar`) || auth.permissions.more_permissions.includes(`19@Evaluar`)) &&
               ["EN EVALUACIÓN"].includes(obj.status) && (
                  <Tooltip title={`Rechazar Folio #${name}`} placement="top">
                     <Button color="error" onClick={() => handleClickReject(obj.folio)}>
                        <IconThumbDown />
                     </Button>
                  </Tooltip>
               )}
            {(auth.permissions.more_permissions.includes(`16@Pagar`) || auth.permissions.more_permissions.includes(`20@Pagar`)) &&
               ["APROBADA"].includes(obj.status) && (
                  <Tooltip title={`Pagar y Entregar del Folio #${name}`} placement="top">
                     <Button color="primary" onClick={() => handleClickPayed(obj.folio, obj.status)}>
                        <IconCoin />
                     </Button>
                  </Tooltip>
               )}
            {auth.permissions.more_permissions.includes(`16@Cancelar`) && !["RECHAZADA", "CANCELADA"].includes(obj.status) && (
               <Tooltip title={`Cancelar Folio ${name}`} placement="top">
                  <Button color="error" onClick={() => handleClickCancel(id, obj.folio, name)}>
                     <IconBan />
                  </Button>
               </Tooltip>
            )}
            {/* <Tooltip title={`Editar ${singularName}`} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip> */}
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

   const handleClickExportPublic = () => {
      try {
         Toast.Info("no se cual es el formato, ya lo pedi");
      } catch (error) {}
   };
   const handleClickExportContraloria = () => {
      try {
         Toast.Info("no se cual es el formato, ya lo pedi");
      } catch (error) {}
   };

   const toolbarContent = () => {
      return (
         <div className="flex flex-wrap gap-2">
            {(auth.permissions.more_permissions.includes(`16@Exportar Lista Pública`) || auth.permissions.more_permissions.includes(`20@Exportar Lista Pública`)) && (
               <Button variant="contained" color="success" startIcon={<IconFileSpreadsheet />} onClick={handleClickExportPublic} sx={{ mx: 1 }}>
                  Exprotar al público
               </Button>
            )}
            {(auth.permissions.more_permissions.includes(`16@Exportar Lista Contraloría`) ||
               auth.permissions.more_permissions.includes(`20@Exportar Lista Contraloría`)) && (
               <Button variant="contained" color="success" startIcon={<IconFileSpreadsheet />} onClick={handleClickExportContraloria} sx={{ mx: 1 }}>
                  Exprotar para contraloria
               </Button>
            )}
         </div>
      );
   };

   const data = [];

   const formatData = async () => {
      try {
         // console.log("cargar listado", requestBecas);
         await requestBecas.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.folio} current_page={obj.current_page} obj={obj} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(requestBecas[0]));
         // console.log("la data del formatData", globalFilterFields);
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   useEffect(() => {
      // setLoading(false);
   }, [requestBecas]);

   return (
      <>
         <DataTableComponent
            columns={columns}
            data={data}
            setData={setRequestBecas}
            globalFilterFields={globalFilterFields}
            headerFilters={false}
            handleClickAdd={handleClickAdd}
            rowEdit={false}
            refreshTable={() => getRequestBecas(status)}
            toolBar={auth.role_id <= ROLE_ADMIN && auth.more_permissions.includes("16@Exportar Lista Pública") && status == "aprobadas" ? true : false}
            positionBtnsToolbar="center"
            toolbarContent={toolbarContent}
         />
         {/* <PDFTable /> */}
         <Dialog fullWidth maxWidth={"lg"} fullScreen={fullScreenDialog} open={openDialogPreview} onClose={() => setOpenDialogPreview(false)}>
            {/* <DialogTitle> */}
            <Toolbar>
               <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
                  {}
               </Typography>
               {auth.permissions.update && (
                  <Tooltip title={`Exportar Reporte a PDF`} placement="top">
                     <IconButton color="inherit" onClick={() => downloadPDF("reportPaper")}>
                        <IconFileTypePdf color="red" />
                     </IconButton>
                  </Tooltip>
               )}
               <Tooltip title={`Imprimir Reporte`} placement="top">
                  <IconButton color="inherit" onClick={() => printContent("reportPaper")}>
                     <IconPrinter />
                  </IconButton>
               </Tooltip>
               <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
                  <IconButton color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
                     {fullScreenDialog ? <IconWindowMinimize /> : <IconWindowMaximize />}
                  </IconButton>
               </Tooltip>
               <Tooltip title={`Cerrar ventana`} placement="top">
                  <IconButton edge="end" color="inherit" onClick={() => setOpenDialogPreview(false)} aria-label="close">
                     <IconX />
                  </IconButton>
               </Tooltip>
            </Toolbar>
            {/* </DialogTitle> */}
            <DialogContent>
               {/* <DialogContentText>You can set my maximum width and whether to adapt or not.</DialogContentText> */}
               <Box
                  noValidate
                  component="form"
                  sx={{
                     display: "flex",
                     flexDirection: "column",
                     m: "auto",
                     width: "95%"
                  }}
               >
                  <RequestReportPDF obj={objReport} />
               </Box>
            </DialogContent>
            {/* <DialogActions>
               <Button onClick={() => Toast.Success("Guardado")}>Guardar</Button>
            </DialogActions> */}
         </Dialog>
         <ModalReject open={openModalReject} setOpen={setOpenModalReject} folio={folio} statusCurrent={status} />
      </>
   );
};
export default RequestBecaDT;
