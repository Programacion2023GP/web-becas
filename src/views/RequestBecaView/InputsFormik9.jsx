import { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { FileInputComponent, InputComponent, DividerComponent } from "../../components/Form/FormikComponents";
import { useRequestBecaContext } from "../../context/RequestBecaContext";
import { ROLE_ADMIN, useGlobalContext } from "../../context/GlobalContext";
import { Box, Button, ButtonGroup, FormControl, FormGroup, FormLabel, Icon, Tooltip, Typography } from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { IconCircleCheck, IconCircleX } from "@tabler/icons";
import Toast from "../../utils/Toast";
import { useNavigate, useParams } from "react-router-dom";

const ButtonsApprovedDocument = ({ auth, formik, setFieldValue, fieldApproved, fieldComments, name = "documento", approved = true, accion }) => {
   const iconSize = 65;

   const handleClickBtnCheckApproved = (setFieldValue, fieldApproved, fieldComments) => {
      try {
         setFieldValue(fieldApproved, true);
         setFieldValue(fieldComments, "Archivo cargado correctamente.");
      } catch (error) {}
   };
   const handleClickBtnCheckDecline = (setFieldValue, fieldApproved, fieldComments) => {
      try {
         setFieldValue(fieldApproved, false);
         setFieldValue(fieldComments, "");
      } catch (error) {}
   };

   return (
      <>
         {/* Botones */}
         <Grid xs={4} md={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {(auth.permissions.more_permissions.includes("Validar Documentos") || auth.permissions.more_permissions.includes(`todas`)) &&
               ["revision"].includes(accion) && (
                  <>
                     <Icon sx={{ fontSize: iconSize }}>
                        {approved ? <IconCircleCheck size={iconSize} color="green" /> : <IconCircleX size={iconSize} color="red" />}
                     </Icon>
                     <ButtonGroup sx={{ mb: 1 }}>
                        <Tooltip title={`Aprobar ${name}`} placement="top">
                           <Button
                              variant={approved ? "contained" : "outlined"}
                              color="success"
                              onClick={() => handleClickBtnCheckApproved(setFieldValue, fieldApproved, fieldComments)}
                           >
                              <IconCircleCheck />
                           </Button>
                        </Tooltip>
                        <Tooltip title={`Rechazar ${name}`} placement="top">
                           <Button
                              variant={!approved ? "contained" : "outlined"}
                              color="error"
                              onClick={() => handleClickBtnCheckDecline(setFieldValue, fieldApproved, fieldComments)}
                           >
                              <IconCircleX />
                           </Button>
                        </Tooltip>
                     </ButtonGroup>
                     <Typography sx={{ fontWeight: "bolder" }} textAlign={"center"}>
                        Documento {approved ? "Aprovado" : "Rechazado"}
                     </Typography>
                  </>
               )}
         </Grid>
         {/* Comentarios */}
         <Grid xs={8} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <InputComponent
               // col={4}
               idName={fieldComments}
               label={"Causa del rechazo del documento"}
               placeholder={"Escribe el detalle del porque rechazaste este documento..."}
               rows={5}
               color={!formik.values[fieldApproved] && "red"}
               disabled={!(auth.permissions.more_permissions.includes("Validar Documentos") || auth.permissions.more_permissions.includes(`todas`))}
            />
         </Grid>
      </>
   );
};

const InputsFormik9 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext, isTutor, haveSecondRef, dataFileInputs = [] }) => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction } = useGlobalContext();
   const { formData, setFormData, saveOrFinishReview } = useRequestBecaContext();
   const formik = useFormikContext();
   const { accion } = useParams();
   const navigate = useNavigate();

   const handleClickSaveReview = async (values) => {
      try {
         values.action = "save";
         await setFormData({ ...formData, ...values });
         // console.log("formData en submit3", formData);

         setLoadingAction(true);
         const axiosResponse = await saveOrFinishReview(folio, pagina, values);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) {
            Toast.Success(axiosResponse.alert_text);
            return Toast.Warning(axiosResponse.alert_title);
         }
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         window.location.hash = "/app/solicitudes/";
      } catch (error) {
         console.error(error);
      } finally {
      }
   };
   const handleClickFinishReview = async (values) => {
      try {
         // console.log("estoy en el handleClickFinishReview()", values);
         if (
            Boolean(values.b7_approved_tutor_ine) == false ||
            Boolean(values.b7_approved_proof_address) == false ||
            Boolean(values.b7_approved_curp) == false ||
            Boolean(values.b7_approved_birth_certificate) == false ||
            Boolean(values.b7_approved_academic_transcript) == false
         )
            return Toast.Info("Solo al tener todos los docuemntos aprobados puedes finalizar la revisión");
         if (isTutor && Boolean(values.b7_approved_tutor_power_letter) == false)
            return Toast.Info("Solo al tener todos los docuemntos aprobados puedes finalizar la revisión");
         if (haveSecondRef && Boolean(values.b7_approved_second_ref) == false)
            return Toast.Info("Solo al tener todos los docuemntos aprobados puedes finalizar la revisión");

         values.action = "finish";
         await setFormData({ ...formData, ...values });
         // console.log("formData en submit3", formData);

         setLoadingAction(true);
         const axiosResponse = await saveOrFinishReview(folio, pagina, values);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) {
            Toast.Success(axiosResponse.alert_text);
            return Toast.Warning(axiosResponse.alert_title);
         }
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         navigate("/app/solicitudes/en-revision");
         // window.location.hash = "/app/solicitudes/en-revision";
      } catch (error) {
         console.error(error);
      } finally {
      }
   };

   useEffect(() => {
      // console.log(formik.values.b6_finished);
      // console.log("dataFileInputs", dataFileInputs);
      // console.log("accion", accion);
      // console.log("[undefined, 'revision'].includes(accion)", ["revision"].includes(accion));
   }, []);

   return (
      <>
         <Grid width={"100%"} xs={12} spacing={2} height={"66vh"} maxHeight={"66vh"} overflow={"auto"}>
            <Grid xs={12} container spacing={2} key={"key-key-key"}>
               {/* IMAGEN DE INE TUTOR */}
               {dataFileInputs.map((dataInput, index) => (
                  <>
                     {![dataInput.isTutor, dataInput.haveSecondRef].includes(null) && <DividerComponent title={dataInput.infoDivider.title} />}
                     {dataInput.isTutor === true && (
                        <>
                           <Typography variant="h5" sx={{ display: "block", width: "100%", mb: 1 }}>
                              Al no ser familiar directo favor de cargar algúno de los siguientes documentos <br />
                              <small>Carta de dependencia económica del DIF &nbsp;|&nbsp; Hoja custodia &nbsp;|&nbsp; Acta de defunción del padre o madre</small>
                           </Typography>
                        </>
                     )}
                     {dataInput.haveSecondRef === true && (
                        <>
                           <Typography variant="h5" sx={{ display: "block", width: "100%", mb: 1 }}>
                              Se eligio un Familiar como 2da opción para recoger el apoyo
                           </Typography>
                        </>
                     )}
                     {![dataInput.isTutor, dataInput.haveSecondRef].includes(null) && (
                        <>
                           <Grid key={`Key-Grid-${dataInput.idName}`} container xs={12}>
                              <FileInputComponent
                                 key={dataInput.idName}
                                 col={6}
                                 color={["EN REVISIÓN", "EN EVALUACIÓN"].includes(formik.values.status) && !formik.values[dataInput.fieldApproved] && "red"}
                                 idName={dataInput.idName}
                                 label={dataInput.label}
                                 filePreviews={dataInput.filePreviews}
                                 setFilePreviews={dataInput.setFilePreviews}
                                 multiple={false}
                                 accept={"image/*"}
                                 fileSizeMax={3}
                                 showBtnCamera={true}
                                 disabled={
                                    auth.id == formik.values.user_id
                                       ? ["", "ALTA"].includes(formData.status)
                                          ? false
                                          : ["EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) &&
                                            (auth.permissions.more_permissions.includes("Corregir Documentos") || auth.permissions.more_permissions.includes(`todas`))
                                          ? false
                                          : true
                                       : ["ALTA", "EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) &&
                                         (auth.permissions.more_permissions.includes("Validar Documentos") || auth.permissions.more_permissions.includes(`todas`))
                                       ? false
                                       : true
                                 }
                              />
                              {(auth.permissions.more_permissions.includes("Validar Documentos") ||
                                 auth.permissions.more_permissions.includes("Corregir Documentos") ||
                                 auth.permissions.more_permissions.includes(`todas`)) &&
                                 ["EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) &&
                                 ["revision", "correccion"].includes(accion) && (
                                    <ButtonsApprovedDocument
                                       key={`btns_${dataInput.idName}`}
                                       auth={auth}
                                       formik={formik}
                                       setFieldValue={formik.setFieldValue}
                                       fieldApproved={dataInput.fieldApproved}
                                       fieldComments={dataInput.fieldComments}
                                       approved={formik.values[dataInput.fieldApproved]}
                                       name={dataInput.name}
                                       accion={accion}
                                    />
                                 )}
                           </Grid>
                           {/* {index < dataFileInputs.length && <DividerComponent />} */}
                        </>
                     )}
                  </>
               ))}
            </Grid>
         </Grid>

         {/* <Button type="button" color="info" id="btnModify" sx={{ mt: 1, display: "none" }} onClick={() => handleModify(formik.setValues)}>
            setValues
         </Button> */}

         {folio > 0 &&
            (["", "ALTA"].includes(formData.status) ||
               ((auth.permissions.more_permissions.includes("Corregir Documentos") || auth.permissions.more_permissions.includes(`todas`)) &&
                  ["EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status))) &&
            [undefined, "correccion"].includes(accion) && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}

         {folio > 0 && ["TERMINADA", "EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) && ["revision"].includes(accion) && (
            <Grid container xs={12} sx={{ pt: 2, justifyContent: "end" }}>
               <Button color="primary" variant="contained" onClick={() => handleClickFinishReview(formik.values)} sx={{ mr: 1 }}>
                  TERMINAR REVISIÓN
               </Button>
               <Button color="secondary" variant="contained" onClick={() => handleClickSaveReview(formik.values)} sx={{ mr: 1 }}>
                  GUARDAR
               </Button>
            </Grid>
         )}
      </>
   );
};

export default InputsFormik9;
