import { useFormikContext } from "formik";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { FileInputComponent, InputComponent, DividerComponent } from "../../../components/Form/FormikComponents";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { ROLE_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import { Box, Button, ButtonGroup, FormControl, FormGroup, FormLabel, Icon, Tooltip, Typography } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import { useState } from "react";
import { IconCircleCheck, IconCircleX } from "@tabler/icons";
import { display } from "@mui/system";

const InputsFormik9 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext, isTutor }) => {
   useGlobalContext();
   const { auth } = useAuthContext();
   const { formData, setFormData } = useRequestBecaContext();
   const formik = useFormikContext();

   const [imgTutorIne, setImgTutorIne] = useState([]);

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
         console.log("formik.values", formik.values);
      } catch (error) {}
   };

   const ButtonsApprovedDocument = ({ setFieldValue, fieldApproved, fieldComments, name = "documento", approved = true }) => {
      const iconSize = 65;
      return (
         <>
            {/* Botones */}
            <Grid xs={4} md={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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
            </Grid>
            {/* Comentarios */}
            <Grid xs={8} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
               <InputComponent
                  // col={4}
                  idName={fieldComments}
                  label={"Causa del rechazo del documento"}
                  placeholder={"Escribe el detalle del porque rechazaste este documento..."}
                  rows={5}
               />
            </Grid>
         </>
      );
   };

   // useEffect(() => {});
   const dataFileInputs = [
      {
         idName: "b7_img_tutor_ine",
         label: "Foto INE del Tutor",
         filePreviews: imgTutorIne,
         setFilePreviews: setImgTutorIne,
         fieldApproved: "b7_approved_tutor_ine",
         fieldComments: "b7_comments_tutor_ine",
         name: "INE del tutor",
         isTutor: false
      },
      {
         idName: "b7_img_tutor_ine",
         label: "Foto INE del Tutor",
         filePreviews: imgTutorIne,
         setFilePreviews: setImgTutorIne,
         fieldApproved: "b7_approved_tutor_ine",
         fieldComments: "b7_comments_tutor_ine",
         name: "INE del tutor",
         isTutor: false
      },
      {
         idName: "b7_img_tutor_ine",
         label: "Foto INE del Tutor",
         filePreviews: imgTutorIne,
         setFilePreviews: setImgTutorIne,
         fieldApproved: "b7_approved_tutor_ine",
         fieldComments: "b7_comments_tutor_ine",
         name: "INE del tutor",
         isTutor: false
      },
      {
         idName: "b7_img_tutor_ine",
         label: "Foto INE del Tutor",
         filePreviews: imgTutorIne,
         setFilePreviews: setImgTutorIne,
         fieldApproved: "b7_approved_tutor_ine",
         fieldComments: "b7_comments_tutor_ine",
         name: "INE del tutor",
         isTutor: false
      },
      {
         idName: "b7_img_tutor_ine",
         label: "Foto INE del Tutor",
         filePreviews: imgTutorIne,
         setFilePreviews: setImgTutorIne,
         fieldApproved: "b7_approved_tutor_ine",
         fieldComments: "b7_comments_tutor_ine",
         name: "INE del tutor",
         isTutor: false
      },
      {
         idName: "b7_img_tutor_ine",
         label: "Foto INE del Tutor",
         filePreviews: imgTutorIne,
         setFilePreviews: setImgTutorIne,
         fieldApproved: "b7_approved_tutor_ine",
         fieldComments: "b7_comments_tutor_ine",
         name: "INE del tutor",
         isTutor: false
      }
   ];

   return (
      <>
         <Grid container spacing={2} xs={12} sx={{ height: "69vh", overflowY: "auto" }}>
            {/* IMAGEN DE INE TUTOR */}
            {dataFileInputs.map((dataInput, index) => (
               <>
                  {dataInput.isTutor && (
                     <Typography variant="h4" sx={{ display: "block", width: "100%", mb: 1 }}>
                        Al no ser familiar directo favor de cargar el documento de Carta Poder
                     </Typography>
                  )}
                  {!dataInput.isTutor && (
                     <>
                        <Grid container xs={12}>
                           <FileInputComponent
                              key={dataInput.idName}
                              col={6}
                              idName={dataInput.idName}
                              label={dataInput.label}
                              filePreviews={dataInput.filePreviews}
                              setFilePreviews={dataInput.setFilePreviews}
                              multiple={false}
                              accept={"image/*"}
                           />
                           {auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && (
                              <ButtonsApprovedDocument
                                 key={`btns_${dataInput.idName}`}
                                 setFieldValue={formik.setFieldValue}
                                 fieldApproved={dataInput.fieldApproved}
                                 fieldComments={dataInput.fieldComments}
                                 approved={formik.values[dataInput.idName]}
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

         {/* ENVIAR (onSubmit) ----------> values.b7_img_tutor_ine = imgTutorIne.length == 0 ? '' : imgTutorIne[0].file; */}
         {/* MODIFICAR (handleModify) ---> setObjImg(formData.b7_img_tutor_ine, setImgTutorIne); */}
         {/* RESET ----------------------> setImgTutorIne([]); */}

         {folio > 0 && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik9;
