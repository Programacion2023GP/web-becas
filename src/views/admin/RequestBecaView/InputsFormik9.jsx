import { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { FileInputComponent, InputComponent, DividerComponent } from "../../../components/Form/FormikComponents";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { ROLE_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import { Box, Button, ButtonGroup, FormControl, FormGroup, FormLabel, Icon, Tooltip, Typography } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import { IconCircleCheck, IconCircleX } from "@tabler/icons";
import Toast from "../../../utils/Toast";

const ButtonsApprovedDocument = ({ auth, formik, setFieldValue, fieldApproved, fieldComments, name = "documento", approved = true }) => {
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
            {auth.permissions.more_permissions.includes("16@Validar Documentos") && (
               <>
                  <Icon sx={{ fontSize: iconSize }}>{approved ? <IconCircleCheck size={iconSize} color="green" /> : <IconCircleX size={iconSize} color="red" />}</Icon>
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
               disabled={!auth.permissions.more_permissions.includes("16@Validar Documentos")}
            />
         </Grid>
      </>
   );
};

const InputsFormik9 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext, isTutor, dataFileInputs = [] }) => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction } = useGlobalContext();
   const { formData, setFormData, saveOrFinishReview } = useRequestBecaContext();
   const formik = useFormikContext();

   const [imgTutorIne, setImgTutorIne] = useState([]);

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
         window.location.hash = "/admin/solicitudes/";
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
         window.location.hash = "/admin/solicitudes/";
      } catch (error) {
         console.error(error);
      } finally {
      }
   };

   useEffect(() => {
      // console.log(formik.values.b6_finished);
   }, []);

   return (
      <>
         <Grid width={"100%"} xs={12} spacing={2} height={"66vh"} MaxHeight={"66vh"} overflow={"auto"}>
            <Grid xs={12} container spacing={2}>
               {/* IMAGEN DE INE TUTOR */}
               {dataFileInputs.map((dataInput, index) => (
                  <>
                     {dataInput.isTutor === true && (
                        <Typography variant="h4" sx={{ display: "block", width: "100%", mb: 1 }}>
                           {`Al no ser familiar directo favor de cargar el documento de ${dataInput.name}`}
                        </Typography>
                     )}
                     {dataInput.isTutor !== null && (
                        <>
                           {/* {console.log(
                              dataInput.name,
                              dataInput.fieldApproved,
                              formik.values,
                              ["EN REVISIÓN", "EN EVALUACIÓN"].includes(formik.values.status),
                              !formik.values[dataInput.fieldApproved]
                           )} */}
                           <Grid container xs={12}>
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
                                 disabled={
                                    auth.id == formik.values.user_id
                                       ? ["", "ALTA"].includes(formData.status)
                                          ? false
                                          : ["EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) &&
                                            auth.permissions.more_permissions.includes("16@Corregir Documentos")
                                          ? false
                                          : true
                                       : ["ALTA", "EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) &&
                                         auth.permissions.more_permissions.includes("16@Validar Documentos")
                                       ? false
                                       : true
                                 }
                              />
                              {(auth.permissions.more_permissions.includes("16@Validar Documentos") ||
                                 auth.permissions.more_permissions.includes("16@Corregir Documentos")) &&
                                 ["EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) && (
                                    <ButtonsApprovedDocument
                                       key={`btns_${dataInput.idName}`}
                                       auth={auth}
                                       formik={formik}
                                       setFieldValue={formik.setFieldValue}
                                       fieldApproved={dataInput.fieldApproved}
                                       fieldComments={dataInput.fieldComments}
                                       approved={formik.values[dataInput.fieldApproved]}
                                       name={dataInput.name}
                                    />
                                 )}
                           </Grid>
                           {index < dataFileInputs.length && <DividerComponent />}
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
               (["EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) && auth.permissions.more_permissions.includes("16@Corregir Documentos"))) && (
               <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />
            )}

         {auth.role_id <= ROLE_ADMIN && folio > 0 && ["TERMINADA", "EN REVISIÓN", "EN EVALUACIÓN"].includes(formData.status) && (
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
