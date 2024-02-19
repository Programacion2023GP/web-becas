import { Fragment, useEffect, useRef, useState } from "react";
import { ROLE_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import { Box, fontWeight } from "@mui/system";
import {
   Button,
   ButtonGroup,
   Checkbox,
   Divider,
   FormControl,
   FormControlLabel,
   FormGroup,
   FormHelperText,
   FormLabel,
   Icon,
   IconButton,
   Input,
   Radio,
   RadioGroup,
   Step,
   StepLabel,
   Stepper,
   TextField,
   ToggleButton,
   ToggleButtonGroup,
   Tooltip,
   Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Formik } from "formik";
import * as Yup from "yup";

import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { IconCircleCheck, IconCircleX, IconEdit, IconInfoCircle } from "@tabler/icons";
import { useStudentContext } from "../../../context/StudentContext";
import Toast from "../../../utils/Toast";
import { Link, Navigate, useLoaderData, useParams } from "react-router-dom";
import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { Axios, useAuthContext } from "../../../context/AuthContext";
import sAlert from "../../../utils/sAlert";
import IconSended from "../../../components/icons/IconSended";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { formatCurrency, formatDatetimeToSQL, handleInputFormik } from "../../../utils/Formats";

import DatePickerComponent from "../../../components/Form/DatePickerComponent";
import { useDisabilityContext } from "../../../context/DisabilityContext";
import { useSchoolContext } from "../../../context/SchoolContext";
import { useRelationshipContext } from "../../../context/RelationshipContext";
import InputFileComponent, { setObjImg } from "../../../components/Form/InputFileComponent";
import { useTutorContext } from "../../../context/TutorContext";
import SimpleTableComponent from "../../../components/SimpleTableComponent";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import InputComponentv2, { InputComponentv3 } from "../../../components/Form/InputComponent2";
import IconDelete from "../../../components/icons/IconDelete";
import FamilyDT, { monthlyIncome } from "./FamilyDT";
import { useFamilyContext } from "../../../context/FamilyContext";
import { validateImageRequired } from "../../../utils/Validations";

const RequestBecaView = () => {
   const { auth } = useAuthContext();
   // const { result } = useLoaderData();
   // const dataDisabilities = result.disabilities;
   // const dataSchools = result.schools;
   let { folio, pagina = 0 } = useParams();

   // const [folio, setFolio] = useState(null);

   const {
      setLoading,
      setLoadingAction,
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete
   } = useGlobalContext();

   const { families, monthlyIncome } = useFamilyContext();

   const { disabilities, getDisabilitiesSelectIndex } = useDisabilityContext();
   const { relationships, getRelationshipsSelectIndex } = useRelationshipContext();
   const { schools, getSchoolsSelectIndex } = useSchoolContext();
   const { getStudentByCURP } = useStudentContext();
   const { getTutorByCURP } = useTutorContext();
   const { formData, setFormData, resetFormData, getRequestBecasByFolio, createRequestBeca, updateRequestBeca, saveBeca, requestBeca } = useRequestBecaContext();

   const [isTutor, setIsTutor] = useState(false); // es true cuando el tutor no es el padre ni la madre
   const [imgTutorIne, setImgTutorIne] = useState([]);
   const [imgTutorPowerLetter, setImgTutorPowerLetter] = useState([]);
   const [imgProofAddress, setImgProofAddress] = useState([]);
   const [imgCurp, setImgCurp] = useState([]);
   const [imgBirthCertificate, setImgBirthCertificate] = useState([]);
   const [imgAcademicTranscript, setImgAcademicTranscript] = useState([]);

   const inputRefFullNameTutor = useRef(null);
   const inputRefCurp = useRef(null);
   const inputRefSchoolId = useRef(null);

   // const [monthlyIncomeChange, setMonthlyIncomeChange] = useState(0);

   // #region STEPER
   const steps = [
      "Datos del Tutor del Alumno",
      "Datos del Alumno",
      "Datos Academicos",
      "Datos Familiares",
      "Datos Económicos",
      "Datos de la Vivienda",
      "Equipamiento Doméstico",
      "Programas de Becas",
      "Cargar Documentos"
   ];

   const [activeStep, setActiveStep] = useState(Number(pagina) - 1);
   const [completed, setCompleted] = useState({});
   const [stepFailed, setStepFailed] = useState(-1);

   const totalSteps = () => {
      return steps.length;
   };

   const completedSteps = () => {
      return Object.keys(completed).length;
   };

   const isLastStep = () => {
      return activeStep === totalSteps() - 1;
   };

   const allStepsCompleted = () => {
      return completedSteps() === totalSteps();
   };

   const handleNext = () => {
      const newActiveStep =
         isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
              // find the first step that has been completed
              steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;

      setActiveStep(newActiveStep);
      if (pagina >= 4 || folio > 0) location.hash = `/admin/solicitud-beca/pagina/${activeStep + 2}/folio/${folio}`;
      else location.hash = `/admin/solicitud-beca/pagina/${activeStep + 2}`;
   };

   const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      if (pagina >= 4 || folio > 0) location.hash = `/admin/solicitud-beca/pagina/${activeStep}/folio/${folio}`;
      else location.hash = `/admin/solicitud-beca/pagina/${activeStep}`;
   };

   const handleStep = (step) => () => {
      setActiveStep(step);
   };

   const handleComplete = () => {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
   };

   const handleReset = () => {
      setIsTutor(false);
      setActiveStep(0);
      setCompleted({});
      resetFormData();
      location.hash = `/admin/solicitud-beca`;
      // setTimeout(() => {
      //    inputRefFullNameTutor.current.focus();
      // }, 1000);
   };

   const ButtonsBeforeOrNext = ({ isSubmitting, setValues }) => (
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
         <Button color="inherit" variant="contained" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            ATRAS
         </Button>
         <Box sx={{ flex: "1 1 auto" }} />
         {/* <Button onClick={handleNext} sx={{ mr: 1 }}>
                                       Adelante
                                    </Button> */}
         {activeStep !== steps.length &&
            (completed[activeStep] ? (
               <>
                  <Button
                     type="submit"
                     disabled={isSubmitting}
                     // loading={isSubmitting}
                     // loadingPosition="start"
                     variant="contained"
                  >
                     {/* {console.log(completedSteps())} */}
                     {completedSteps() === 3 ? "REGISTRAR SOLICITUD" : "ADELANTE"}
                  </Button>

                  <Typography variant="caption" sx={{ ml: 1, display: "inline-block" }}>
                     Paso {activeStep + 1} completado
                  </Typography>
               </>
            ) : (
               <Button
                  // onClick={()=>onSubmit1(setValues)}
                  type="submit"
                  disabled={isSubmitting}
                  // loading={isSubmitting}
                  // loadingPosition="start"
                  variant="contained"
               >
                  {completedSteps() === totalSteps() - 1 ? "ENVIAR SOLICITUD" : "ADELANTE"}
               </Button>
            ))}
         <Button type="button" color="info" id="btnModify" sx={{ mt: 1, display: "none" }} onClick={() => handleModify(setValues)}>
            setValues
         </Button>
      </Box>
   );
   //#endregion
   const showErrorInput = (section, msg, formHelperText = false) => {
      // Toast.Error(`Error en Sección ${section}: ${msg}`);
      setTimeout(() => {
         setStepFailed(section - 1);
      }, 150);
      if (formHelperText) {
         return (
            <FormHelperText error id="ht-disability_id">
               {msg}
            </FormHelperText>
         );
      }
      return msg;
   };

   const handleChangeRelationships = (relationship, setFieldValue) => setIsTutor(relationship.id > 2 ? true : false);

   const handleChangeTutorCURP = async (e, values, setValues, setFieldValue) => {
      try {
         let curp = e.target.value.toUpperCase();
         // if (curp.length < 1) return Toast.Info("El campo CURP esta vacío");
         if (curp.length < 18) return;
         let axiosReponse = await getTutorByCURP(curp);
         // console.log(axiosReponse);

         if (axiosReponse.result == null)
            return sAlert.Info("El CURP ingresado no está registrado, veritifíca que este correcto para guardarse al finalizar esta solicitud.");

         // console.log("CURP - axiosReponse.result", axiosReponse.result);
         await setFieldValue("tutor_data_id", axiosReponse.result.id);
         await setFieldValue("tutor_relationship_id", axiosReponse.result.tutor_relationship_id);
         await setFieldValue("tutor_relationship", axiosReponse.result.relationship);
         // await setFieldValue("tutor_curp", axiosReponse.result.tutor_curp);
         await setFieldValue("tutor_name", axiosReponse.result.tutor_name);
         await setFieldValue("tutor_paternal_last_name", axiosReponse.result.tutor_paternal_last_name);
         await setFieldValue("tutor_maternal_last_name", axiosReponse.result.tutor_maternal_last_name);
         await setFieldValue("tutor_phone", axiosReponse.result.tutor_phone);

         await setFormData({ ...formData, ...values });
         // await setValues(formData);
         // console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeCURP = async (e, values, setValues, setFieldValue) => {
      try {
         let curp = e.target.value.toUpperCase();
         // if (curp.length < 1) return Toast.Info("El campo CURP esta vacío");
         if (curp.length < 18) return;

         let axiosReponse = await getStudentByCURP(curp);
         // console.log(axiosReponse);

         if (axiosReponse.result == null)
            return sAlert.Info("El CURP ingresado no está registrado, veritifíca que este correcto para guardarse al finalizar esta solicitud.");

         await setFieldValue("student_data_id", axiosReponse.result.id);
         await setFieldValue("curp", axiosReponse.result.curp);
         await setFieldValue("name", axiosReponse.result.name);
         await setFieldValue("paternal_last_name", axiosReponse.result.paternal_last_name);
         await setFieldValue("maternal_last_name", axiosReponse.result.maternal_last_name);
         await setFieldValue("birthdate", axiosReponse.result.birthdate);
         await setFieldValue("gender", axiosReponse.result.gender);
         await setFieldValue("disability", axiosReponse.result.disability);
         await setFieldValue("disability_id", axiosReponse.result.disability_id);
         await setFieldValue("street", axiosReponse.result.street);
         await setFieldValue("num_ext", axiosReponse.result.num_ext);
         await setFieldValue("num_int", axiosReponse.result.num_int);

         await setFormData({ ...formData, ...values });
         // await setValues(formData);

         // hacer consulta a la api de Comunidad para sacar la localidad
         formData.community_id = axiosReponse.result.community_id;
         await setFieldValue("community_id", formData.community_id);
         await setFormData({ ...formData, ...values });

         if (formData.community_id > 0) {
            getCommunity(
               formData.zip,
               setFieldValue,
               formData.community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies,
               setDataColoniesComplete
            );
         }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit1 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // // console.log("values", values);
         await setFormData({ ...formData, ...values });
         console.log("formData-1", formData);
         await setValues(formData);
         console.log("formData", formData);
         console.log("values", values);
         setStepFailed(-1);
         handleComplete();
         // setTimeout(() => {
         //    inputRefCurp.current.focus();
         // }, 500);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit2 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         values.num_int = values.num_int === "" ? "S/N" : values.num_int;

         // console.log("values", values);
         await setFormData({ ...formData, ...values });
         // console.log("formData-2", formData);
         // await setValues(values);
         // console.log("formData", formData);
         // console.log("values", values);
         setStepFailed(-1);
         handleComplete();
         // setTimeout(() => {
         //    inputRefSchoolId.current.focus();
         // }, 500);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit3 = async (values, { setSubmitting, setErrors, resetForm, setValues, setFieldValue }) => {
      try {
         if (!folio) {
            // console.log("formData en submit3", formData);
            // console.log("values", values);
            await setFormData({ ...formData, ...values });
            // await setValues(formData);
            // console.log("formData-3", formData);
            // console.log("values", values);
            // console.log(formData);
            setLoadingAction(true);
            let axiosResponse;
            if (values.id == 0) axiosResponse = await createRequestBeca(values);
            else axiosResponse = await updateRequestBeca(values);
            setSubmitting(false);
            setLoadingAction(false);

            if (axiosResponse.status_code != 200) return Toast.Error(axiosResponse.alert_text);
            sAlert.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            // console.log("axiosResponse", axiosResponse);
            folio = axiosResponse.result.folio;
            sAlert.Success(
               `Tu solicitud ha sido creada, termina de llenar el formulario para que se considere tu solicitud. Tu folio es: 
            <h1>${folio}</h1> 
            <i>Puedes ver tus solicitudes guardadas y su estatus en la sección de "Mis Solicitudes" en tú menú lateral</i>`,
               null
            );
            setStepFailed(-1);
            setFieldValue("id", axiosResponse.result.id);
            setFieldValue("folio", axiosResponse.result.folio);
            setFieldValue("status", axiosResponse.result.status);
         }
         // resetForm();
         // resetFormData();
         handleComplete();
         location.hash = `/admin/solicitud-beca/pagina/${activeStep + 2}/folio/${folio}`;
         setCompleted({ 0: true, 1: true, 2: true });

         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit4 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData en submit3", formData);
         values.finished = true;
         await setFormData({ ...formData, ...values });
         // await setFormData(values);
         // await setValues(formData);
         // return console.log(formData, values);
         setLoadingAction(true);
         const axiosResponse = await saveBeca(folio, pagina, values);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) return Toast.Error(axiosResponse.alert_text);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("axiosResponse", axiosResponse);
         setStepFailed(-1);
         // resetForm();
         // resetFormData();
         handleComplete();
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit5 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData en submit3", formData);
         values.b3_finished = true;
         await setFormData({ ...formData, ...values });
         // await setFormData(values);
         // await setValues(formData);
         // return console.log(formData, values);
         setLoadingAction(true);
         const axiosResponse = await saveBeca(folio, pagina, values);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) return Toast.Error(axiosResponse.alert_text);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("axiosResponse", axiosResponse);
         setStepFailed(-1);
         // resetForm();
         // resetFormData();
         handleComplete();
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit6 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData en submit3", formData);
         values.b4_finished = true;
         values.b4_score += Number(values.b4_house_is.split("@")[0]) || 0;
         values.b4_score += Number(values.b4_roof_material.split("@")[0]) || 0;
         values.b4_score += Number(values.b4_floor_material.split("@")[0]) || 0;
         await setFormData({ ...formData, ...values });
         // console.log("formData", values);
         // return console.log("values", values);
         // await setFormData(values);
         // await setValues(formData);
         setLoadingAction(true);
         const axiosResponse = await saveBeca(folio, pagina, values);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) return Toast.Error(axiosResponse.alert_text);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("axiosResponse", axiosResponse);
         setStepFailed(-1);
         // resetForm();
         // resetFormData();
         handleComplete();
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit7 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData en submit3", formData);
         values.b5_finished = true;
         values.b5_score += Number(values.b5_beds * 1) || 0;
         values.b5_score += Number(values.b5_washing_machines * 1) || 0;
         values.b5_score += Number(values.b5_tvs * 1) || 0;
         values.b5_score += Number(values.b5_pcs * 1) || 0;
         values.b5_score += Number(values.b5_phones * 1) || 0;
         values.b5_score += Number(values.b5_music_player * 1) || 0;
         values.b5_score += Number(values.b5_refrigerators * 1) || 0;

         values.b5_drinking_water = values.b5_drinking_water ? true : false || false;
         values.b5_electric_light = values.b5_electric_light ? true : false || false;
         values.b5_sewer_system = values.b5_sewer_system ? true : false || false;
         values.b5_pavement = values.b5_pavement ? true : false || false;
         values.b5_automobile = values.b5_automobile ? true : false || false;
         values.b5_phone_line = values.b5_phone_line ? true : false || false;
         values.b5_internet = values.b5_internet ? true : false || false;

         values.b5_score += Number(values.b5_drinking_water ? 1 : 0) || 0;
         values.b5_score += Number(values.b5_electric_light ? 1 : 0) || 0;
         values.b5_score += Number(values.b5_sewer_system ? 1 : 0) || 0;
         values.b5_score += Number(values.b5_pavement ? 1 : 0) || 0;
         values.b5_score += Number(values.b5_automobile ? 1 : 0) || 0;
         values.b5_score += Number(values.b5_phone_line ? 1 : 0) || 0;
         values.b5_score += Number(values.b5_internet ? 1 : 0) || 0;
         await setFormData({ ...formData, ...values });
         // console.log("formData", values);
         // return console.log("values", values);
         // await setFormData(values);
         // await setValues(formData);
         setLoadingAction(true);
         const axiosResponse = await saveBeca(folio, pagina, values);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) return Toast.Error(axiosResponse.alert_text);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("axiosResponse", axiosResponse);
         setStepFailed(-1);
         // resetForm();
         // resetFormData();
         handleComplete();
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit8 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData en submit3", formData);
         if (values.under_protest) values.b6_finished = true;

         values.b6_beca_transport = values.b6_beca_transport ? true : false || false;
         values.b6_beca_benito_juarez = values.b6_beca_benito_juarez ? true : false || false;
         values.b6_beca_jovenes = values.b6_beca_jovenes ? true : false || false;
         values.b6_other = values.b6_other ? true : false || false;
         await setFormData({ ...formData, ...values });
         // console.log("formData", values);
         // return console.log("values", values);
         // await setFormData(values);
         // await setValues(formData);
         setLoadingAction(true);
         const axiosResponse = await saveBeca(folio, pagina, values);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) {
            Toast.Success(axiosResponse.alert_text);
            return Toast.Warning(axiosResponse.alert_title);
         }
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("axiosResponse", axiosResponse);
         setStepFailed(-1);
         // resetForm();
         // resetFormData();
         handleComplete();
         console.log("el formData en el onSubmit8", formData);
         console.log("el values en el onSubmit8", values);
         setIsTutor(values.tutor_relationship_id > 2 ? true : false);
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit9 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         values.b7_img_tutor_ine = imgTutorIne.length == 0 ? "" : imgTutorIne[0].file;
         if (isTutor) values.b7_img_tutor_power_letter = imgTutorPowerLetter.length == 0 ? "" : imgTutorPowerLetter[0].file;
         values.b7_img_proof_address = imgProofAddress.length == 0 ? "" : imgProofAddress[0].file;
         values.b7_img_curp = imgCurp.length == 0 ? "" : imgCurp[0].file;
         values.b7_img_birth_certificate = imgBirthCertificate.length == 0 ? "" : imgBirthCertificate[0].file;
         values.b7_img_academic_transcript = imgAcademicTranscript.length == 0 ? "" : imgAcademicTranscript[0].file;

         if (!validateImageRequired(values.b7_img_tutor_ine, "La foto de la INE es requerida")) return;
         if (isTutor && !validateImageRequired(values.b7_img_tutor_power_letter, "La foto de la Carta Poder es requerida")) return;
         if (!validateImageRequired(values.b7_img_proof_address, "La foto del Comprobante de Domicilio es requerida")) return;
         if (!validateImageRequired(values.b7_img_curp, "La foto de la CURP es requerida")) return;
         if (!validateImageRequired(values.b7_img_birth_certificate, "La foto del Acta de Nacimiento es requerida")) return;
         if (!validateImageRequired(values.b7_img_academic_transcript, "La foto del Certificado Estudiantil es requerida")) return;

         values.b7_finished = true;
         values.end_date = formatDatetimeToSQL(new Date());
         // return console.log("values", values);
         await setFormData({ ...formData, ...values });
         // console.log("formData en submit3", formData);

         setLoadingAction(true);
         const axiosResponse = await saveBeca(folio, pagina, values);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) {
            Toast.Success(axiosResponse.alert_text);
            return Toast.Warning(axiosResponse.alert_title);
         }
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("axiosResponse", axiosResponse);
         setStepFailed(-1);
         // resetForm();
         // resetFormData();
         handleComplete();
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onBlurCapture = () => {
      setStepFailed(-1);
   };

   const validationSchemas = (page) => {
      let validationSchema;
      switch (page) {
         case 1: // PAGINA DATOS DEL TUTOR
            validationSchema = Yup.object().shape({
               // id: 0,
               // folio: Yup.number("solo números").required("Folio requerido"),
               tutor_relationship_id: Yup.string().trim().required("Parentesco del tutor requerido"),
               tutor_curp: Yup.string()
                  .trim()
                  .matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{2}[A-Z0-9]{4}[0-9]{1}$/, "Formato de CURP invalido")
                  .required("CURP del tutor requerido"),
               tutor_name: Yup.string().trim().required("Nombre del tutor requerido"),
               tutor_paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
               tutor_maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
               tutor_phone: Yup.string().trim().min(10, "El número telefónico debe ser a 10 digitos").required("Número telefonico del tutor requerido")
            });
            break;
         case 2: // PAGINA DATOS DEL ALUMNO
            validationSchema = Yup.object().shape({
               // id: 0,
               // student_data_id: 0,
               curp: Yup.string()
                  .trim()
                  .matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{2}[A-Z0-9]{4}[0-9]{1}$/, "Formato de CURP invalido")
                  .required("CURP del alumno requerido"),
               name: Yup.string().trim().required("Nombre(s) del alumno requerido(s)"),
               paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
               maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
               birthdate: Yup.date("Fecha inválida").required("Fecha de nacimiento requerida"),
               // gender: Yup.string().trim().required("Género requerido"),
               zip: Yup.number("Solo números").required("Código Postal requerido"),
               community_id: Yup.number().min(1, "Ésta opción no es valida").required("Colonia requerida"),
               colony: Yup.string().trim().notOneOf(["Selecciona una opción..."], "Ésta opción no es valida").required("Colonia requerida"),
               street: Yup.string().trim().required("Dirección requerida"),
               num_ext: Yup.string().trim().required("Número exterior requerido"),
               // num_int: Yup.string().trim().required("Clave de escuela requerida"),
               disability_id: Yup.number().min(1, "Ésta opción no es valida").required("Discapacidad requerida")
            });
            break;
         case 3: // PAGINA DATOS DE LA ESCUELA
            validationSchema = Yup.object().shape({
               // id: 0,
               school_id: Yup.number("Solo números").min(1, "Ésta opción no es valida").required("Escuela requerida"),
               grade: Yup.number("Solo números").required("Grado estudiantil requerido"),
               average: Yup.number("Solo números").required("Promedio actual requerido")
               // comments: Yup.string().trim().required("Comentarios requeridos"),
            });
            break;
         case 4: // PAGINA DATOS FAMILIARES
            validationSchema = Yup.object().shape({
               extra_income: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Ingresos Extra requerido"),
               monthly_income: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Ingresos Mensuales requerido")
            });
            break;
         case 5: // PAGINA DATOS ECONOMICOS
            validationSchema = Yup.object().shape({
               b3_food: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos de Alimentación requerido"),
               b3_transport: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos de Transporte requerido"),
               b3_living_place: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos de Vivienda requerido"),
               b3_services: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos de Servicios requerido"),
               b3_automobile: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos del Automóvil requerido")
            });
            break;
         case 6: // PAGINA DATOS DE VIVIENDA
            validationSchema = Yup.object().shape({
               b4_house_is: Yup.string().trim().required("Selecciona una opción"),
               b4_roof_material: Yup.string().trim().required("Selecciona una opción"),
               b4_floor_material: Yup.string().trim().required("Selecciona una opción")
            });
            break;
         case 7:
            validationSchema = Yup.object().shape({
               b5_beds: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Cantidad de Camas requerido"),
               b5_washing_machines: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Cantidad de Lavadoras requerido"),
               b5_boilers: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Cantidad de Boilers requerido"),
               b5_tvs: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Cantidad de TVs requerido"),
               b5_pcs: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Cantidad de Computadoras requerido"),
               b5_phones: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Cantidad de Teléfonos y Celuláres requerido"),
               b5_music_player: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Cantidad de Reproductores de Música requerido"),
               b5_stoves: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Cantidad de Estufas requerido"),
               b5_refrigerators: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Canitdad de Refrigeradores requerido")
               // b5_drinking_water: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos del Automóvil requerido"),
               // b5_electric_light: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos del Automóvil requerido"),
               // b5_sewer_system: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos del Automóvil requerido"),
               // b5_pavement: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos del Automóvil requerido"),
               // b5_automobile: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos del Automóvil requerido"),
               // b5_phone_line: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos del Automóvil requerido"),
               // b5_internet: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Gastos del Automóvil requerido")
            });
            break;
         case 8:
            validationSchema = Yup.object().shape({
               under_protest: Yup.bool().required("Bajo Protesta requerido")
            });
            break;
         case 9: // PAGINA DE DOCUMENTOS
            validationSchema = Yup.object().shape({
               // id: 0,
               // folio: Yup.number("solo números").required("Folio requerido"),
               // b7_img_tutor_ine: Yup.string().trim().required("INE requerida"),
               b7_approved_tutor_ine: auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_tutor_ine: "",
               // b7_img_tutor_power_letter: isTutor && Yup.string().trim().required("Carta Poder requerida"),
               b7_approved_tutor_power_letter:
                  auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_tutor_power_letter: "",
               // b7_img_proof_address: Yup.string().trim().required("Comprobante de Domicilio requerida"),
               b7_approved_proof_address: auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_proof_address: "",
               // b7_img_curp: Yup.string().trim().required("CURP requerida"),
               b7_approved_curp: auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_curp: "",
               // b7_img_birth_certificate: Yup.string().trim().required("Acta de Nacimiento requerida"),
               b7_approved_birth_certificate:
                  auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_birth_certificate: "",
               // b7_img_academic_transcript: Yup.string().trim().required("Constancia Estudiantil con Calificaciones requerida"),
               b7_approved_academic_transcript:
                  auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && Yup.bool().required("Aprueba o Desaprueba el documento.")
               // b7_comments_academic_transcript: ""
            });
            break;
         default:
            break;
      }
      return validationSchema;
   };

   const ButtonsAction = ({ id, name, active }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Editar ${name}`} placement="top">
               <IconButton color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </IconButton>
            </Tooltip>
            <Tooltip title={`Eliminar ${name}`} placement="top">
               <IconButton color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </IconButton>
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

   const handleClickBtnCheckApproved = (setFieldValue, field) => {
      try {
         setFieldValue(field, true);
      } catch (error) {}
   };

   const ButtonsApprovedDocument = ({ setFieldValue, field, name = "documento", approved = true }) => {
      const iconSize = 65;
      return (
         <>
            <Icon sx={{ fontSize: iconSize }}>{approved ? <IconCircleCheck size={iconSize} color="green" /> : <IconCircleX size={iconSize} color="red" />}</Icon>
            <ButtonGroup sx={{ mb: 1 }}>
               <Tooltip title={`Aprobar ${name}`} placement="top">
                  <Button variant={approved ? "contained" : "outlined"} color="success" onClick={() => handleClickBtnCheckApproved(setFieldValue, field)}>
                     <IconCircleCheck />
                  </Button>
               </Tooltip>
               <Tooltip title={`Rechazar ${name}`} placement="top">
                  <Button variant={!approved ? "contained" : "outlined"} color="error" onClick={() => setFieldValue(field, false)}>
                     <IconCircleX />
                  </Button>
               </Tooltip>
            </ButtonGroup>
            <Typography sx={{ fontWeight: "bolder" }} textAlign={"center"}>
               Documento {approved ? "Aprovado" : "Rechazado"}
            </Typography>
         </>
      );
   };

   const handleClickFinishReview = () => {
      try {
         console.log("estoy en el handleClickFinishReview() ");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickSavehReview = () => {
      try {
         console.log("estoy en el handleClickSavehReview() ");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const [houseIs, setHouseIs] = useState("Porpia");
   const handleHouseIs = (event, newValue) => {
      // console.log("el newValue", event.target.value);
      setHouseIs(event.target.value);
   };

   const handleModify = async (setValues) => {
      try {
         // console.log("hola handleModify()", pagina);
         setCompleted({ 0: true, 1: true, 2: true });
         const ajaxResponse = await getRequestBecasByFolio(folio);
         // console.log("holaaaaa familia", ajaxResponse.result.requestBecas);
         if (ajaxResponse.result.requestBecas.monthly_income)
            if (ajaxResponse.result.requestBecas.b3_finished)
               if (ajaxResponse.result.requestBecas.b4_finished)
                  if (ajaxResponse.result.requestBecas.b5_finished)
                     if (ajaxResponse.result.requestBecas.b6_finished) setCompleted({ 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true });
                     else setCompleted({ 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true });
                  else setCompleted({ 0: true, 1: true, 2: true, 3: true, 4: true, 5: true });
               else setCompleted({ 0: true, 1: true, 2: true, 3: true, 4: true });
            else setCompleted({ 0: true, 1: true, 2: true, 3: true });

         if (formData.description) formData.description == null && (formData.description = "");
         await setValues(ajaxResponse.result.requestBecas);
         await setFormData(ajaxResponse.result.requestBecas);
         // console.log("que paso?r :c", requestBeca);
         // console.log("que paso?f :c", formData);
         // console.log("isTutor :c", isTutor);
         if (pagina == 9) {
            await setIsTutor(ajaxResponse.result.requestBecas.tutor_relationship_id > 2 ? true : false);
            setObjImg(ajaxResponse.result.requestBecas.b7_img_tutor_ine, setImgTutorIne);
            if (isTutor) setObjImg(ajaxResponse.result.requestBecas.b7_img_tutor_power_letter, setImgTutorPowerLetter);
            setObjImg(ajaxResponse.result.requestBecas.b7_img_proof_address, setImgProofAddress);
            setObjImg(ajaxResponse.result.requestBecas.b7_img_curp, setImgCurp);
            setObjImg(ajaxResponse.result.requestBecas.b7_img_birth_certificate, setImgBirthCertificate);
            setObjImg(ajaxResponse.result.requestBecas.b7_img_academic_transcript, setImgAcademicTranscript);
         }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeTotal = (e, values, setFieldValue) => {
      // console.log("value", e.target.name);
      const name = e.target.name;
      const value = Number(e.target.value) || 0;
      const b3_food = name == "b3_food" ? value : values.b3_food,
         b3_transport = name == "b3_transport" ? value : values.b3_transport,
         b3_living_place = name == "b3_living_place" ? value : values.b3_living_place,
         b3_services = name == "b3_services" ? value : values.b3_services,
         b3_automobile = name == "b3_automobile" ? value : values.b3_automobile;
      const total_expenses = b3_food + b3_transport + b3_living_place + b3_services + b3_automobile;
      setFieldValue("total_expenses", total_expenses);
   };

   useEffect(() => {
      if (formData.id < 1) {
         // console.log("folio de params?", folio);
         // console.log("pagina de params?", pagina);
         if (folio) {
            const btnModify = document.getElementById("btnModify");
            if (btnModify != null) btnModify.click();
         }
         getDisabilitiesSelectIndex();
         getSchoolsSelectIndex();
         getRelationshipsSelectIndex();
         setLoading(false);

         if (families) {
            // console.log("hay familias");
         }

         // window.location.hash = ;
         // inputRefFullNameTutor.current.focus();
         // console.log("useEffect - formData", formData);
      }
   }, [folio]);
   // }, [formData, pagina, activeStep]);

   return (
      <Box sx={{ width: "100%", height: "100%" }}>
         <Typography variant="h1" color={"#364152"} mb={2}>
            Solicitud de Beca
         </Typography>
         {pagina == 0 ? (
            <Box sx={{ height: "85%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} p={2}>
               <Typography variant="h2" mb={2}>
                  DIRECCION DE EDUCACIÓN
               </Typography>
               <Typography variant="h3" align="justify" mb={2} sx={{ fontWeight: "normal", lineHeight: 2, maxWidth: "70%" }}>
                  El presente cuestionario tiene por objetivo conocer el perfil de los aspirantes a obtener una beca del <b>R. Ayuntamiento de Gómez Palacio</b>. La
                  información proporcionada de aqui debe ser completamente verdadera, por ello, lee con atención cada pregunta y contesta adecuadamente.
               </Typography>
               <Link to={"pagina/1"}>
                  <Button onClick={handleReset} variant="contained" fullWidth>
                     COMENZAR SOLICITUD
                  </Button>
               </Link>
            </Box>
         ) : (
            <>
               <Stepper nonLinear activeStep={activeStep} sx={{ overflowX: "auto" }}>
                  {steps.map((label, index) => {
                     const labelProps = {};
                     if (stepFailed === index) {
                        labelProps.optional = (
                           <Typography variant="caption" color="error">
                              Hay un campo invalido en esta sección.
                           </Typography>
                        );

                        labelProps.error = true;
                     }
                     return (
                        <Step key={label} completed={completed[index]}>
                           <StepLabel {...labelProps} color="inherit" onClick={handleStep(index)}>
                              {label}
                           </StepLabel>
                        </Step>
                     );
                  })}
               </Stepper>
               <Box sx={{ height: "85%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} p={2}>
                  {allStepsCompleted() ? (
                     <Fragment>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 5 }}>
                           <IconSended />
                           <Typography sx={{ my: 5 }} variant={"h3"} textAlign={"center"}>
                              Tú solicitud ha sido enviada, espera nuestra respuesta:
                              <Typography sx={{ mt: 2, mb: 5, fontWeight: "bolder" }} variant={"h1"} component={"p"} textAlign={"center"}>
                                 No. Folio: {folio}
                              </Typography>
                              <Typography sx={{ fontWeight: "bolder" }}>
                                 recuerda, puedes ver el estatus de tus solicitudes yendo a "Mis Solicitudes" en tú menú lateral
                              </Typography>
                           </Typography>
                           <Button onClick={handleReset} variant="contained" fullWidth>
                              Nueva Solicitud
                           </Button>
                        </Box>
                     </Fragment>
                  ) : (
                     <Fragment>
                        {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>ESTOY EN EL CONTENIDO STEP?? {activeStep + 1}</Typography> */}
                        <Box sx={{ mt: 2, height: "100%" }}>
                           {activeStep + 1 == 1 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit1}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                       onBlur={onBlurCapture}
                                    >
                                       <Grid container spacing={2}>
                                          {/* CURP tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_curp"
                                                name="tutor_curp"
                                                label="CURP *"
                                                FormHelperTextProps={{ itemScope: <IconInfoCircle /> }}
                                                type="text"
                                                value={values.tutor_curp}
                                                placeholder="Escribe tu CURP"
                                                onChange={(e) => {
                                                   handleChange(e);
                                                   handleChangeTutorCURP(e, values, setValues, setFieldValue);
                                                }}
                                                onBlur={handleBlur}
                                                inputProps={{ maxLength: 18 }}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "tutor_curp", true)}
                                                disabled={values.id == 0 ? false : true}
                                                // inputRef={inputRefTutorCurp}
                                                error={errors.tutor_curp && touched.tutor_curp}
                                                helperText={errors.tutor_curp && touched.tutor_curp && showErrorInput(2, errors.tutor_curp)}
                                             />
                                          </Grid>
                                          {/* Parentesco */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <Select2Component
                                                idName={"tutor_relationship_id"}
                                                label={"Parentesco *"}
                                                valueLabel={values.tutor_relationship}
                                                formDataLabel={"tutor_relationship"}
                                                placeholder={"Selecciona una opción..."}
                                                options={relationships}
                                                fullWidth={true}
                                                handleChangeValueSuccess={handleChangeRelationships}
                                                handleBlur={handleBlur}
                                                error={errors.tutor_relationship_id}
                                                touched={touched.tutor_relationship_id}
                                                disabled={values.id == 0 ? false : true}
                                             />
                                          </Grid>
                                          {/* Nombre Tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_name"
                                                name="tutor_name"
                                                label="Nombre del Tutor *"
                                                type="text"
                                                value={values.tutor_name}
                                                placeholder="Escribe tú nombre completo"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "tutor_name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                inputRef={inputRefFullNameTutor}
                                                error={errors.tutor_name && touched.tutor_name}
                                                helperText={errors.tutor_name && touched.tutor_name && showErrorInput(1, errors.tutor_name)}
                                             />
                                          </Grid>
                                          {/* Apellido Paterno Tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_paternal_last_name"
                                                name="tutor_paternal_last_name"
                                                label="Apellido Paterno del Tutor *"
                                                type="text"
                                                value={values.tutor_paternal_last_name}
                                                placeholder="Escribe tú primer apellido"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "tutor_paternal_last_name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                inputRef={inputRefFullNameTutor}
                                                error={errors.tutor_paternal_last_name && touched.tutor_paternal_last_name}
                                                helperText={
                                                   errors.tutor_paternal_last_name &&
                                                   touched.tutor_paternal_last_name &&
                                                   showErrorInput(1, errors.tutor_paternal_last_name)
                                                }
                                             />
                                          </Grid>
                                          {/* Apellido Materno Tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_maternal_last_name"
                                                name="tutor_maternal_last_name"
                                                label="Apellido Materno del Tutor *"
                                                type="text"
                                                value={values.tutor_maternal_last_name}
                                                placeholder="Escribe tú segundo apellido"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "tutor_maternal_last_name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                inputRef={inputRefFullNameTutor}
                                                error={errors.tutor_maternal_last_name && touched.tutor_maternal_last_name}
                                                helperText={
                                                   errors.tutor_maternal_last_name &&
                                                   touched.tutor_maternal_last_name &&
                                                   showErrorInput(1, errors.tutor_maternal_last_name)
                                                }
                                             />
                                          </Grid>
                                          {/* Tel Tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_phone"
                                                name="tutor_phone"
                                                label="Teléfono Tutor *"
                                                type="text"
                                                value={values.tutor_phone}
                                                placeholder="10 dígitos"
                                                inputProps={{ maxLength: 10 }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.tutor_phone && touched.tutor_phone}
                                                helperText={errors.tutor_phone && touched.tutor_phone && showErrorInput(1, errors.tutor_phone)}
                                             />
                                          </Grid>
                                       </Grid>
                                       {!(folio > 0) && <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 2 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit2}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                       onBlur={onBlurCapture}
                                    >
                                       <Grid container spacing={2}>
                                          {/* CURP */}
                                          <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                             <TextField
                                                id="curp"
                                                name="curp"
                                                label="CURP *"
                                                FormHelperTextProps={{ itemScope: <IconInfoCircle /> }}
                                                type="text"
                                                value={values.curp}
                                                placeholder="Escribe tu CURP"
                                                onChange={(e) => {
                                                   handleChange(e);
                                                   handleChangeCURP(e, values, setValues, setFieldValue);
                                                }}
                                                onBlur={handleBlur}
                                                inputProps={{ maxLength: 18 }}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "curp", true)}
                                                disabled={values.id == 0 ? false : true}
                                                inputRef={inputRefCurp}
                                                error={errors.curp && touched.curp}
                                                helperText={errors.curp && touched.curp && showErrorInput(2, errors.curp)}
                                             />
                                          </Grid>
                                          {/* Nombre del Alumno */}
                                          <Grid xs={12} md={8} sx={{ mb: 3 }}>
                                             <TextField
                                                id="name"
                                                name="name"
                                                label="Nombre del Alumno *"
                                                type="text"
                                                value={values.name}
                                                placeholder="Escribe tu nombre"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.name && touched.name}
                                                helperText={errors.name && touched.name && showErrorInput(2, errors.name)}
                                             />
                                          </Grid>
                                          {/* Apellido Paterno del Alumno */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="paternal_last_name"
                                                name="paternal_last_name"
                                                label="Apellido Paterno *"
                                                type="text"
                                                value={values.paternal_last_name}
                                                placeholder="Escribe tu apellido paterno"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "paternal_last_name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.paternal_last_name && touched.paternal_last_name}
                                                helperText={errors.paternal_last_name && touched.paternal_last_name && showErrorInput(2, errors.paternal_last_name)}
                                             />
                                          </Grid>
                                          {/* Apellido Materno del Alumno */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="maternal_last_name"
                                                name="maternal_last_name"
                                                label="Apellido Materno *"
                                                type="text"
                                                value={values.maternal_last_name}
                                                placeholder="Escribe tu apellido materno"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "maternal_last_name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.maternal_last_name && touched.maternal_last_name}
                                                helperText={errors.maternal_last_name && touched.maternal_last_name && showErrorInput(2, errors.maternal_last_name)}
                                             />
                                          </Grid>
                                          {/* Fecha de Nacimiento */}
                                          <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                             <DatePickerComponent
                                                idName={"birthdate"}
                                                label={"Fecha de Nacimiento"}
                                                value={values.birthdate}
                                                setFieldValue={setFieldValue}
                                                showErrorInput={showErrorInput}
                                                error={errors.birthdate}
                                                touched={touched.birthdate}
                                                formData={formData}
                                                disabled={values.id == 0 ? false : true}
                                             />
                                          </Grid>
                                          {/* Genero */}
                                          <Grid xs={12} md={4} sx={{ mb: 1 }}>
                                             <FormControl fullWidth sx={{ alignItems: "center" }} disabled={values.id == 0 ? false : true}>
                                                <FormLabel id="gender-label">Género</FormLabel>
                                                <RadioGroup
                                                   row
                                                   aria-labelledby="gender-label"
                                                   id="gender"
                                                   name="gender"
                                                   value={values.gender}
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                >
                                                   <FormControlLabel value="MASCULINO" control={<Radio />} label="Masculino" />
                                                   <FormControlLabel value="FEMENINO" control={<Radio />} label="Femenino" />
                                                </RadioGroup>
                                                {touched.gender && errors.gender && showErrorInput(2, errors.gender, true)}
                                             </FormControl>
                                          </Grid>
                                          {/* Discapacidad */}
                                          <Grid xs={12} md={4} sx={{ mb: 1 }}>
                                             <Select2Component
                                                idName={"disability_id"}
                                                label={"Discapacidad *"}
                                                valueLabel={values.disability}
                                                values={values}
                                                formData={formData}
                                                setFormData={setFormData}
                                                formDataLabel={"disability"}
                                                placeholder={"¿Tienes alguna discapacaidad?"}
                                                options={disabilities}
                                                fullWidth={true}
                                                handleChange={handleChange}
                                                setValues={setValues}
                                                handleBlur={handleBlur}
                                                error={errors.disability_id}
                                                touched={touched.disability_id}
                                                disabled={values.id == 0 ? false : true}
                                             />
                                          </Grid>

                                          <Grid xs={12}>
                                             <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                          </Grid>

                                          {/* INPUTS DE COMUNIDAD */}
                                          <InputsCommunityComponent
                                             formData={formData}
                                             setFormData={setFormData}
                                             values={values}
                                             setFieldValue={setFieldValue}
                                             setValues={setValues}
                                             handleChange={handleChange}
                                             handleBlur={handleBlur}
                                             errors={errors}
                                             touched={touched}
                                             columnsByTextField={3}
                                             disabled={values.id == 0 ? false : true}
                                          />

                                          {/* <LoadingButton
                                             type="submit"
                                             disabled={isSubmitting}
                                             loading={isSubmitting}
                                             // loadingPosition="start"
                                             variant="contained"
                                             fullWidth
                                             size="large"
                                             >
                                                Registrar o Guardar
                                             </LoadingButton> */}
                                       </Grid>
                                       {!(folio > 0) && <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 3 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit3}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          {/* Escuela */}
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <Select2Component
                                                idName={"school_id"}
                                                label={"Escuela *"}
                                                valueLabel={values.school_full}
                                                values={values}
                                                formData={formData}
                                                setFormData={setFormData}
                                                formDataLabel={"school_full"}
                                                placeholder={"Selecciona una opción..."}
                                                options={schools}
                                                fullWidth={true}
                                                handleChange={handleChange}
                                                setValues={setValues}
                                                handleBlur={handleBlur}
                                                error={errors.school_id}
                                                touched={touched.school_id}
                                                disabled={values.id == 0 ? false : true}
                                                // inputref={inputRefSchoolId}
                                             />
                                          </Grid>
                                          {/* Grado */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="grade"
                                                name="grade"
                                                label="Grado de Estudio (año)*"
                                                type="number"
                                                value={values.grade}
                                                placeholder="3"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                inputProps={{ maxLength: 1, min: 1, max: 6 }}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.grade && touched.grade}
                                                helperText={errors.grade && touched.grade && showErrorInput(3, errors.grade)}
                                             />
                                          </Grid>
                                          {/* Promedio */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="average"
                                                name="average"
                                                label="Promedio *"
                                                type="number"
                                                value={values.average}
                                                placeholder="10.00"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                inputProps={{ step: 0.01, min: 0, max: 100 }}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.average && touched.average}
                                                helperText={errors.average && touched.average && showErrorInput(3, errors.average)}
                                             />
                                          </Grid>
                                          {/* Comentarios */}
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <TextField
                                                id="comments"
                                                name="comments"
                                                label="Comentarios (opcional)"
                                                type="text"
                                                value={values.comments}
                                                placeholder="¿Deseas dejar algún comentario o mensaje?"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                multiline
                                                rows={5}
                                                inputProps={{}}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.comments && touched.comments}
                                                helperText={errors.comments && touched.comments && showErrorInput(3, errors.comments)}
                                             />
                                          </Grid>
                                       </Grid>
                                       {!(folio > 0) && <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 4 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit4}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          {/* LISTADO */}
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <Typography variant="h2" mb={2}>
                                                ¿Quienes viven actualmente con el alumno?
                                             </Typography>
                                             <FamilyDT becaId={folio} setFieldValue={setFieldValue} values={values} />
                                          </Grid>

                                          {/* Ingresos Extra */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="extra_income"
                                                name="extra_income"
                                                label="Ingresos Extra *"
                                                type="number"
                                                value={values.extra_income}
                                                placeholder="1,500.00"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                // disabled={values.id == 0 ? false : true}
                                                error={errors.extra_income && touched.extra_income}
                                                helperText={errors.extra_income && touched.extra_income && showErrorInput(4, errors.extra_income)}
                                             />
                                          </Grid>
                                          {/* Ingreso Mensuales Totales */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="monthly_income"
                                                name="monthly_income"
                                                label="Ingresos Mensuales TOTALES *"
                                                type="number"
                                                value={values.monthly_income}
                                                placeholder="9,999.00"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                disabled={true}
                                                error={errors.monthly_income && touched.monthly_income}
                                                helperText={errors.monthly_income && touched.monthly_income && showErrorInput(4, errors.monthly_income)}
                                             />
                                          </Grid>
                                       </Grid>

                                       {folio > 0 && <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 5 && (
                              <Formik initialValues={formData} /* validationSchema={validationSchemas(activeStep + 1)} */ onSubmit={onSubmit5}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <Typography variant="h4" component={"p"} mb={1}>
                                                Persona(s) que sostiene el hogar (Padre, Madre, Abuelo)
                                             </Typography>
                                             <Typography variant="h4" component="p">
                                                Detalle de gastos <span style={{ fontWeight: "bolder", textDecorationLine: "underline" }}>MENSUALES Familiares:</span>
                                             </Typography>
                                          </Grid>

                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             {/* Alimentación */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="b3_food"
                                                   label="Alimentación (despensa) * $"
                                                   type="number"
                                                   value={values.b3_food}
                                                   placeholder="Ingrese el gasto mensual de alimentos"
                                                   setFieldValue={setFieldValue}
                                                   onChange={(e) => {
                                                      handleChange(e);
                                                      handleChangeTotal(e, values, setFieldValue);
                                                   }}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   // disabled={values.id == 0 ? false : true}
                                                   error={errors.b3_food}
                                                   touched={touched.b3_food}
                                                   step={5}
                                                   setStepFailed={setStepFailed}
                                                   size="normal"
                                                   // error={errors.b3_food && touched.b3_food}
                                                   // helperText={errors.b3_food && touched.b3_food && showErrorInput(4, errors.b3_food)}
                                                />
                                             </Grid>
                                             {/* Transporte */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="b3_transport"
                                                   label="Transporte * $"
                                                   type="number"
                                                   value={values.b3_transport}
                                                   placeholder="Ingrese el gasto mensual de transporte"
                                                   setFieldValue={setFieldValue}
                                                   onChange={(e) => {
                                                      handleChange(e);
                                                      handleChangeTotal(e, values, setFieldValue);
                                                   }}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   // disabled={values.id == 0 ? false : true}
                                                   error={errors.b3_transport}
                                                   touched={touched.b3_transport}
                                                   setStepFailed={setStepFailed}
                                                   step={5}
                                                   size="normal"
                                                   // error={errors.b3_transport && touched.b3_transport}
                                                   // helperText={errors.b3_transport && touched.b3_transport && showErrorInput(4, errors.b3_transport)}
                                                />
                                             </Grid>
                                             {/* Vivienda */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="b3_living_place"
                                                   label="Vivienda (renta, infonavit) * $"
                                                   type="number"
                                                   value={values.b3_living_place}
                                                   placeholder="Ingrese el gasto mensual en pago de vivienda"
                                                   setFieldValue={setFieldValue}
                                                   onChange={(e) => {
                                                      handleChange(e);
                                                      handleChangeTotal(e, values, setFieldValue);
                                                   }}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   // disabled={values.id == 0 ? false : true}
                                                   error={errors.b3_living_place}
                                                   touched={touched.b3_living_place}
                                                   setStepFailed={setStepFailed}
                                                   step={5}
                                                   size="normal"
                                                   // error={errors.b3_living_place && touched.b3_living_place}
                                                   // helperText={errors.b3_living_place && touched.b3_living_place && showErrorInput(4, errors.b3_living_place)}
                                                />
                                             </Grid>
                                          </Grid>
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             {/* Servicios */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="b3_services"
                                                   label="Servicios (agua y luz) * $"
                                                   type="number"
                                                   value={values.b3_services}
                                                   placeholder="Ingrese el gasto mensual de alimentos"
                                                   setFieldValue={setFieldValue}
                                                   onChange={(e) => {
                                                      handleChange(e);
                                                      handleChangeTotal(e, values, setFieldValue);
                                                   }}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   // disabled={values.id == 0 ? false : true}
                                                   error={errors.b3_services}
                                                   touched={touched.b3_services}
                                                   setStepFailed={setStepFailed}
                                                   step={5}
                                                   size="normal"
                                                   // error={errors.b3_services && touched.b3_services}
                                                   // helperText={errors.b3_services && touched.b3_services && showErrorInput(4, errors.b3_services)}
                                                />
                                             </Grid>
                                             {/* Automovil */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="b3_automobile"
                                                   label="Automóvil * $"
                                                   type="number"
                                                   value={values.b3_automobile}
                                                   placeholder="Ingrese el gasto mensual de su automóvi"
                                                   setFieldValue={setFieldValue}
                                                   onChange={(e) => {
                                                      handleChange(e);
                                                      handleChangeTotal(e, values, setFieldValue);
                                                   }}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   // disabled={values.id == 0 ? false : true}
                                                   error={errors.b3_automobile}
                                                   touched={touched.b3_automobile}
                                                   setStepFailed={setStepFailed}
                                                   step={5}
                                                   size="normal"
                                                   // error={errors.b3_automobile && touched.b3_automobile}
                                                   // helperText={errors.b3_automobile && touched.b3_automobile && showErrorInput(4, errors.b3_automobile)}
                                                />
                                             </Grid>
                                             {/* Gastos Extras */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}></Grid>
                                          </Grid>

                                          {/* Egresos Mensuales Totales */}
                                          <Grid xs={12} xsOffset={6} md={6} sx={{ mb: 3 }}>
                                             <InputComponentv2
                                                idName={"total_expenses"}
                                                label={"TOTAL DE EGRESOS $"}
                                                type="number"
                                                value={values.total_expenses}
                                                placeholder={"0.00"}
                                                setFieldValue={setFieldValue}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.total_expenses}
                                                touched={touched.total_expenses}
                                                disabled={true}
                                                setStepFailed={setStepFailed}
                                                step={5}
                                                size="normal"
                                                inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                             />
                                          </Grid>
                                       </Grid>

                                       {folio > 0 && <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 6 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit6}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <ol>
                                                {/* La casa es */}
                                                <FormControl fullWidth sx={{ mb: 5 }}>
                                                   <FormLabel id="b4_house_is-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>La casa donde vives es:</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {/* <ToggleButtonGroup color="primary" value={houseIs} exclusive onClick={handleHouseIs}>
                                                <ToggleButton value="1@Propia">Propia</ToggleButton>
                                                <ToggleButton value="2@Prestada">Prestada</ToggleButton>
                                                <ToggleButton value="3@Alquilada">Alquilada</ToggleButton>
                                                <ToggleButton value="4@Otra">Otra</ToggleButton>
                                             </ToggleButtonGroup> */}
                                                   <RadioGroup
                                                      row
                                                      aria-labelledby="b4_house_is-label"
                                                      id="b4_house_is"
                                                      name="b4_house_is"
                                                      value={values.b4_house_is}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                   >
                                                      <FormControlLabel sx={{ mr: 5 }} value="1@Propia" control={<Radio />} label="Propia" />
                                                      <FormControlLabel sx={{ mr: 5 }} value="2@Prestada" control={<Radio />} label="Prestada" />
                                                      <FormControlLabel sx={{ mr: 5 }} value="3@Alquilada" control={<Radio />} label="Alquilada" />
                                                      <FormControlLabel sx={{ mr: 5 }} value="4@Otra" control={<Radio />} label="Otra" />
                                                   </RadioGroup>
                                                   {touched.b4_house_is && errors.b4_house_is && (
                                                      <FormHelperText error id="ht-b4_house_is">
                                                         {errors.b4_house_is}
                                                      </FormHelperText>
                                                   )}
                                                </FormControl>

                                                {/* Material del techo */}
                                                <FormControl fullWidth sx={{ mb: 5 }}>
                                                   <FormLabel id="b4_roof_material-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>Material del techo de la vivienda (si está hecho de más de un matgerial, marca el que predomine):</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {/* <ToggleButtonGroup color="primary" value={houseIs} exclusive onClick={handleHouseIs}>
                                                <ToggleButton value="1@Lamina">Lamina (de cartón, de asbesto, madera)</ToggleButton>
                                                <ToggleButton value="2@Concreto">Firme de concreto</ToggleButton>
                                             </ToggleButtonGroup> */}
                                                   <RadioGroup
                                                      row
                                                      aria-labelledby="b4_roof_material-label"
                                                      id="b4_roof_material"
                                                      name="b4_roof_material"
                                                      value={values.b4_roof_material}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                   >
                                                      <FormControlLabel
                                                         sx={{ mr: 5 }}
                                                         value="1@Lamina"
                                                         control={<Radio />}
                                                         label="Lamina (de cartón, de asbesto, madera)"
                                                      />
                                                      <FormControlLabel sx={{ mr: 5 }} value="2@Concreto" control={<Radio />} label="Firme de concreto" />
                                                   </RadioGroup>
                                                   {touched.b4_roof_material && errors.b4_roof_material && (
                                                      <FormHelperText error id="ht-b4_roof_material">
                                                         {errors.b4_roof_material}
                                                      </FormHelperText>
                                                   )}
                                                </FormControl>

                                                {/* Material del techo */}
                                                <FormControl fullWidth sx={{ mb: 5 }}>
                                                   <FormLabel id="b4_floor_material-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>Material del piso de la vivienda (si está hecho de más de un matgerial, marca el que predomine):</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {/* <ToggleButtonGroup color="primary" value={houseIs} exclusive onClick={handleHouseIs}>
                                                <ToggleButton value="1@Tierra">Tierra</ToggleButton>
                                                <ToggleButton value="2@Cemento">Cemento</ToggleButton>
                                                <ToggleButton value="3@Mosaico">Mosaico, loseta, madera laminada</ToggleButton>
                                             </ToggleButtonGroup> */}
                                                   <RadioGroup
                                                      row
                                                      aria-labelledby="b4_floor_material-label"
                                                      id="b4_floor_material"
                                                      name="b4_floor_material"
                                                      value={values.b4_floor_material}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                   >
                                                      <FormControlLabel sx={{ mr: 5 }} value="1@Tierra" control={<Radio />} label="Tierra" />
                                                      <FormControlLabel sx={{ mr: 5 }} value="2@Cemento" control={<Radio />} label="Cemento" />
                                                      <FormControlLabel
                                                         sx={{ mr: 5 }}
                                                         value="2@Mosaico"
                                                         control={<Radio />}
                                                         label="Mosaico, loseta, madera laminada"
                                                      />
                                                   </RadioGroup>
                                                   {touched.b4_floor_material && errors.b4_floor_material && (
                                                      <FormHelperText error id="ht-b4_floor_material">
                                                         {errors.b4_floor_material}
                                                      </FormHelperText>
                                                   )}
                                                </FormControl>
                                             </ol>
                                          </Grid>
                                       </Grid>

                                       {folio > 0 && <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 7 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit7}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <ol>
                                                {/* Equipamiento de la casa */}
                                                <FormControl fullWidth sx={{ mb: 3 }}>
                                                   <FormLabel id="household_equipment-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>
                                                            Señala el número de los siguientes aparatos con que cuentas en casa (en caso de no tener, marca cero) 0 1 2
                                                            3 4+ :
                                                         </li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {touched.household_equipment && errors.household_equipment && (
                                                      <FormHelperText error id="ht-household_equipment">
                                                         {errors.household_equipment}
                                                      </FormHelperText>
                                                   )}
                                                   <Grid container spacing={2}>
                                                      <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                         {/* Camas */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_beds"
                                                               label="Camas"
                                                               type="number"
                                                               value={values.b5_beds}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_beds}
                                                               touched={touched.b5_beds}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                               // error={errors.b5_beds && touched.b5_beds}
                                                               // helperText={errors.b5_beds && touched.b5_beds && showErrorInput(4, errors.b5_beds)}
                                                            />
                                                         </Grid>
                                                         {/* Lavadoras */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_washing_machines"
                                                               label="Lavadoras"
                                                               type="number"
                                                               value={values.b5_washing_machines}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_washing_machines}
                                                               touched={touched.b5_washing_machines}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Calentador de agua (boiler) */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_boilers"
                                                               label="Calentador de agua (boiler)"
                                                               type="number"
                                                               value={values.b5_boilers}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_boilers}
                                                               touched={touched.b5_boilers}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Televisores */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_tvs"
                                                               label="Televisores"
                                                               type="number"
                                                               value={values.b5_tvs}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_tvs}
                                                               touched={touched.b5_tvs}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Computadoras */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_pcs"
                                                               label="Computadoras"
                                                               type="number"
                                                               value={values.b5_pcs}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_pcs}
                                                               touched={touched.b5_pcs}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                      </Grid>
                                                      <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                         {/* Teléfonos (local o celular) */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_phones"
                                                               label="Teléfonos (local o celular)"
                                                               type="number"
                                                               value={values.b5_phones}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_phones}
                                                               touched={touched.b5_phones}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Reproductores de Música */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_music_player"
                                                               label="Reproductores de Música"
                                                               type="number"
                                                               value={values.b5_music_player}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_music_player}
                                                               touched={touched.b5_music_player}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Estufas */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_stoves"
                                                               label="Estufas"
                                                               type="number"
                                                               value={values.b5_stoves}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_stoves}
                                                               touched={touched.b5_stoves}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Refrigeradores */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="b5_refrigerators"
                                                               label="Refrigeradores"
                                                               type="number"
                                                               value={values.b5_refrigerators}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               // disabled={values.id == 0 ? false : true}
                                                               error={errors.b5_refrigerators}
                                                               touched={touched.b5_refrigerators}
                                                               setStepFailed={setStepFailed}
                                                               step={7}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                      </Grid>
                                                   </Grid>
                                                </FormControl>

                                                {/* Equipamiento de la casa */}
                                                <FormControl fullWidth sx={{ mb: 3 }}>
                                                   <FormLabel id="household_equipment-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>¿Cuáles son los servicios con que cuentas en tu casa?</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {touched.household_equipment && errors.household_equipment && (
                                                      <FormHelperText error id="ht-household_equipment">
                                                         {errors.household_equipment}
                                                      </FormHelperText>
                                                   )}
                                                   <Grid container spacing={2}>
                                                      <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                         <FormGroup>
                                                            {/* Agua Potable */}
                                                            <FormControlLabel
                                                               control={<Checkbox checked={values.b5_drinking_water || false} />}
                                                               label="Agua Potable"
                                                               id="b5_drinking_water"
                                                               name="b5_drinking_water"
                                                               value={true}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               // disabled={values.id == 0 ? false : true}
                                                               // error={errors.b5_drinking_water}
                                                               // touched={touched.b5_drinking_water}
                                                            />
                                                            {/* {
                                                               touched.b5_drinking_water && errors.b5_drinking_water && showErrorInput(7, errors.b5_drinking_water)
                                                               // <FormHelperText error id="ht-b5_drinking_water">
                                                               //    {errors.b5_drinking_water}
                                                               // </FormHelperText>
                                                            } */}
                                                            {/* Luz Eléctrica */}
                                                            <FormControlLabel
                                                               control={<Checkbox checked={values.b5_electric_light || false} />}
                                                               label="Luz Eléctrica"
                                                               id="b5_electric_light"
                                                               name="b5_electric_light"
                                                               value={true}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               // disabled={values.id == 0 ? false : true}
                                                            />
                                                            {/* Drenaje */}
                                                            <FormControlLabel
                                                               control={<Checkbox checked={values.b5_sewer_system || false} />}
                                                               label="Drenaje"
                                                               id="b5_sewer_system"
                                                               name="b5_sewer_system"
                                                               value={true}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               // disabled={values.id == 0 ? false : true}
                                                            />
                                                            {/* Pavimento */}
                                                            <FormControlLabel
                                                               control={<Checkbox checked={values.b5_pavement || false} />}
                                                               label="Pavimento"
                                                               id="b5_pavement"
                                                               name="b5_pavement"
                                                               value={true}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               // disabled={values.id == 0 ? false : true}
                                                            />
                                                         </FormGroup>
                                                      </Grid>
                                                      <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                         <FormGroup>
                                                            {/* Automóvil */}
                                                            <FormControlLabel
                                                               control={<Checkbox checked={values.b5_automobile || false} />}
                                                               label="Automóvil"
                                                               id="b5_automobile"
                                                               name="b5_automobile"
                                                               value={true}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               // disabled={values.id == 0 ? false : true}
                                                            />
                                                            {/* Línea Telefónica */}
                                                            <FormControlLabel
                                                               control={<Checkbox checked={values.b5_phone_line || false} />}
                                                               label="Línea Telefónica"
                                                               id="b5_phone_line"
                                                               name="b5_phone_line"
                                                               value={true}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               // disabled={values.id == 0 ? false : true}
                                                            />
                                                            {/* Internet */}
                                                            <FormControlLabel
                                                               control={<Checkbox checked={values.b5_internet || false} />}
                                                               label="Internet"
                                                               id="b5_internet"
                                                               name="b5_internet"
                                                               value={true}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               // disabled={values.id == 0 ? false : true}
                                                            />
                                                         </FormGroup>
                                                      </Grid>
                                                   </Grid>
                                                </FormControl>
                                             </ol>
                                          </Grid>
                                       </Grid>

                                       {folio > 0 && <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 8 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit8}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <ol>
                                                {/* Programa de Becas */}
                                                <FormControl fullWidth sx={{ mb: 3 }}>
                                                   <FormLabel id="scholarship_program-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>¿Tu familia es beneficiaria de algunas de las siguientes becas?</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {touched.scholarship_program && errors.scholarship_program && (
                                                      <FormHelperText error id="ht-scholarship_program">
                                                         {errors.scholarship_program}
                                                      </FormHelperText>
                                                   )}
                                                   <Grid xs={12} md={12} sx={{ mb: 1 }}>
                                                      <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                                                         {/* Beca de Transporte */}
                                                         <FormControlLabel
                                                            control={<Checkbox checked={values.b6_beca_transport || false} />}
                                                            label="Beca de Transporte"
                                                            id="b6_beca_transport"
                                                            name="b6_beca_transport"
                                                            value={true}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            // disabled={values.id == 0 ? false : true}
                                                            sx={{ mr: 10 }}
                                                         />
                                                         {/* Beca para el Bienestar Benito Juárez */}
                                                         <FormControlLabel
                                                            control={<Checkbox checked={values.b6_beca_benito_juarez || false} />}
                                                            label="Beca para el Bienestar Benito Juárez"
                                                            id="b6_beca_benito_juarez"
                                                            name="b6_beca_benito_juarez"
                                                            value={true}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            // disabled={values.id == 0 ? false : true}
                                                            sx={{ mr: 10 }}
                                                         />
                                                         {/* Beca Jóvenes Construyendo el Futuro */}
                                                         <FormControlLabel
                                                            control={<Checkbox checked={values.b6_beca_jovenes || false} />}
                                                            label="Beca Jóvenes Construyendo el Futuro"
                                                            id="b6_beca_jovenes"
                                                            name="b6_beca_jovenes"
                                                            value={true}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            // disabled={values.id == 0 ? false : true}
                                                            sx={{ mr: 10 }}
                                                         />
                                                         {/* Otra */}
                                                         <FormControlLabel
                                                            control={<Checkbox checked={values.b6_other || false} />}
                                                            label="Otra"
                                                            id="b6_other"
                                                            name="b6_other"
                                                            value={true}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            // disabled={values.id == 0 ? false : true}
                                                            sx={{ mr: 10 }}
                                                         />
                                                      </FormGroup>
                                                   </Grid>
                                                </FormControl>
                                             </ol>

                                             {/* Bajo Protesta */}
                                             <FormControlLabel
                                                control={<Checkbox checked={values.under_protest || false} />}
                                                label="Bajo Protesta de decir la verdad, manifiesto que la información proporcionada en esta solicitud es verídica."
                                                id="under_protest"
                                                name="under_protest"
                                                value={true}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                // disabled={values.id == 0 ? false : true}
                                                error={errors.under_protest}
                                                touched={touched.under_protest}
                                             />
                                             {touched.under_protest && errors.under_protest && showErrorInput(8, errors.under_protest, true)}
                                          </Grid>
                                       </Grid>

                                       {folio > 0 && <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 9 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit9}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "70%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                       onBlur={onBlurCapture}
                                    >
                                       <Grid container spacing={2} sx={{ height: "90%", overflowY: "auto" }}>
                                          {/* IMAGEN DE INE TUTOR */}
                                          <>
                                             <Grid xs={12} md={6} sx={{}}>
                                                <InputFileComponent
                                                   idName="b7_img_tutor_ine"
                                                   label="Foto INE del tutor *"
                                                   filePreviews={imgTutorIne}
                                                   setFilePreviews={setImgTutorIne}
                                                   error={errors.b7_img_tutor_ine}
                                                   touched={touched.b7_img_tutor_ine}
                                                   multiple={false}
                                                   accept={"image/*"}
                                                />
                                             </Grid>
                                             {auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         field={"b7_approved_tutor_ine"}
                                                         approved={values.b7_approved_tutor_ine}
                                                         name="INE del tutor"
                                                      />
                                                   </Grid>
                                                   {/* Comentarios */}
                                                   <Grid
                                                      xs={8}
                                                      md={4}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <TextField
                                                         id="b7_comments_tutor_ine"
                                                         name="b7_comments_tutor_ine"
                                                         label="Causa del rechazo del documento"
                                                         type="text"
                                                         value={values.b7_comments_tutor_ine}
                                                         placeholder="Escribe el detalle del porque rechazaste este documento..."
                                                         onChange={handleChange}
                                                         onBlur={handleBlur}
                                                         fullWidth
                                                         multiline
                                                         rows={5}
                                                         inputProps={{}}
                                                         // disabled={values.id == 0 ? false : true}
                                                         error={errors.b7_comments_tutor_ine && touched.b7_comments_tutor_ine}
                                                         helperText={
                                                            errors.b7_comments_tutor_ine &&
                                                            touched.b7_comments_tutor_ine &&
                                                            showErrorInput(9, errors.b7_comments_tutor_ine)
                                                         }
                                                      />
                                                   </Grid>
                                                </>
                                             )}
                                          </>
                                          {/* IMAGEN DE CARTA PODER TUTOR */}
                                          {isTutor && (
                                             <>
                                                <Grid xs={12}>
                                                   <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                                </Grid>
                                                <Grid xs={12} sx={{ mb: 1 }}>
                                                   <Typography variant="h4">Al no ser familiar directo favor de cargar el documento de Carta Poder</Typography>
                                                </Grid>
                                                <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                                   <InputFileComponent
                                                      idName="b7_img_tutor_power_letter"
                                                      label="Foto Carta Poder del tutor *"
                                                      filePreviews={imgTutorPowerLetter}
                                                      setFilePreviews={setImgTutorPowerLetter}
                                                      error={errors.b7_img_tutor_power_letter}
                                                      touched={touched.b7_img_tutor_power_letter}
                                                      multiple={false}
                                                      accept={"image/*"}
                                                   />
                                                </Grid>
                                                {auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && (
                                                   <>
                                                      {/* Botones */}
                                                      <Grid
                                                         xs={4}
                                                         md={2}
                                                         sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                      >
                                                         <ButtonsApprovedDocument
                                                            setFieldValue={setFieldValue}
                                                            field={"b7_approved_tutor_power_letter"}
                                                            approved={values.b7_approved_tutor_power_letter}
                                                            name="Carta Poder"
                                                         />
                                                      </Grid>
                                                      {/* Comentarios */}
                                                      <Grid
                                                         xs={8}
                                                         md={4}
                                                         sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                      >
                                                         <TextField
                                                            id="b7_comments_tutor_power_letter"
                                                            name="b7_comments_tutor_power_letter"
                                                            label="Causa del rechazo del documento"
                                                            type="text"
                                                            value={values.b7_comments_tutor_power_letter}
                                                            placeholder="Escribe el detalle del porque rechazaste este documento..."
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            fullWidth
                                                            multiline
                                                            rows={5}
                                                            inputProps={{}}
                                                            // disabled={values.id == 0 ? false : true}
                                                            error={errors.b7_comments_tutor_power_letter && touched.b7_comments_tutor_power_letter}
                                                            helperText={
                                                               errors.b7_comments_tutor_power_letter &&
                                                               touched.b7_comments_tutor_power_letter &&
                                                               showErrorInput(9, errors.b7_comments_tutor_power_letter)
                                                            }
                                                         />
                                                      </Grid>
                                                   </>
                                                )}
                                             </>
                                          )}
                                          {/* IMAGEN DEL COMPROBANTE DE DOMICILIO */}
                                          <>
                                             <Grid xs={12}>
                                                <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                             </Grid>
                                             <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                                <InputFileComponent
                                                   idName="b7_img_proof_address"
                                                   label="Foto Comprobante de Domicilio *"
                                                   filePreviews={imgProofAddress}
                                                   setFilePreviews={setImgProofAddress}
                                                   error={errors.b7_img_proof_address}
                                                   touched={touched.b7_img_proof_address}
                                                   multiple={false}
                                                   accept={"image/*"}
                                                />
                                             </Grid>
                                             {auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         field={"b7_approved_proof_address"}
                                                         approved={values.b7_approved_proof_address}
                                                         name="Comprobante de Domicilio"
                                                      />
                                                   </Grid>
                                                   {/* Comentarios */}
                                                   <Grid
                                                      xs={8}
                                                      md={4}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <TextField
                                                         id="b7_comments_proof_address"
                                                         name="b7_comments_proof_address"
                                                         label="Causa del rechazo del documento"
                                                         type="text"
                                                         value={values.b7_comments_proof_address}
                                                         placeholder="Escribe el detalle del porque rechazaste este documento..."
                                                         onChange={handleChange}
                                                         onBlur={handleBlur}
                                                         fullWidth
                                                         multiline
                                                         rows={5}
                                                         inputProps={{}}
                                                         // disabled={values.id == 0 ? false : true}
                                                         error={errors.b7_comments_proof_address && touched.b7_comments_proof_address}
                                                         helperText={
                                                            errors.b7_comments_proof_address &&
                                                            touched.b7_comments_proof_address &&
                                                            showErrorInput(9, errors.b7_comments_proof_address)
                                                         }
                                                      />
                                                   </Grid>
                                                </>
                                             )}
                                          </>
                                          {/* IMAGEN DE LA CURP */}
                                          <>
                                             <Grid xs={12}>
                                                <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                             </Grid>
                                             <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                                <InputFileComponent
                                                   idName="b7_img_curp"
                                                   label="Foto de la CURP *"
                                                   filePreviews={imgCurp}
                                                   setFilePreviews={setImgCurp}
                                                   error={errors.b7_img_curp}
                                                   touched={touched.b7_img_curp}
                                                   multiple={false}
                                                   accept={"image/*"}
                                                />
                                             </Grid>
                                             {auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         field={"b7_approved_curp"}
                                                         approved={values.b7_approved_curp}
                                                         name="CURP"
                                                      />
                                                   </Grid>
                                                   {/* Comentarios */}
                                                   <Grid
                                                      xs={8}
                                                      md={4}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <TextField
                                                         id="b7_comments_curp"
                                                         name="b7_comments_curp"
                                                         label="Causa del rechazo del documento"
                                                         type="text"
                                                         value={values.b7_comments_curp}
                                                         placeholder="Escribe el detalle del porque rechazaste este documento..."
                                                         onChange={handleChange}
                                                         onBlur={handleBlur}
                                                         fullWidth
                                                         multiline
                                                         rows={5}
                                                         inputProps={{}}
                                                         // disabled={values.id == 0 ? false : true}
                                                         error={errors.b7_comments_curp && touched.b7_comments_curp}
                                                         helperText={errors.b7_comments_curp && touched.b7_comments_curp && showErrorInput(9, errors.b7_comments_curp)}
                                                      />
                                                   </Grid>
                                                </>
                                             )}
                                          </>
                                          {/* IMAGEN DE LA ACTA DE NACIMIENTO */}
                                          <>
                                             <Grid xs={12}>
                                                <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                             </Grid>
                                             <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                                <InputFileComponent
                                                   idName="b7_img_birth_certificate"
                                                   label="Foto de la Acta de Nacimiento *"
                                                   filePreviews={imgBirthCertificate}
                                                   setFilePreviews={setImgBirthCertificate}
                                                   error={errors.b7_img_birth_certificate}
                                                   touched={touched.b7_img_birth_certificate}
                                                   multiple={false}
                                                   accept={"image/*"}
                                                />
                                             </Grid>
                                             {auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         field={"b7_approved_birth_certificate"}
                                                         approved={values.b7_approved_birth_certificate}
                                                         name="Acta de Nacimiento"
                                                      />
                                                   </Grid>
                                                   {/* Comentarios */}
                                                   <Grid
                                                      xs={8}
                                                      md={4}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <TextField
                                                         id="b7_comments_birth_certificate"
                                                         name="b7_comments_birth_certificate"
                                                         label="Causa del rechazo del documento"
                                                         type="text"
                                                         value={values.b7_comments_birth_certificate}
                                                         placeholder="Escribe el detalle del porque rechazaste este documento..."
                                                         onChange={handleChange}
                                                         onBlur={handleBlur}
                                                         fullWidth
                                                         multiline
                                                         rows={5}
                                                         inputProps={{}}
                                                         // disabled={values.id == 0 ? false : true}
                                                         error={errors.b7_comments_birth_certificate && touched.b7_comments_birth_certificate}
                                                         helperText={
                                                            errors.b7_comments_birth_certificate &&
                                                            touched.b7_comments_birth_certificate &&
                                                            showErrorInput(9, errors.b7_comments_birth_certificate)
                                                         }
                                                      />
                                                   </Grid>
                                                </>
                                             )}
                                          </>
                                          {/* IMAGEN DEL CERTIFICADO ESTUDIANTIL */}
                                          <>
                                             <Grid xs={12}>
                                                <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                             </Grid>
                                             <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                                <InputFileComponent
                                                   idName="b7_img_academic_transcript"
                                                   label="Foto del Certificado Estudiantil con Calificaciones *"
                                                   filePreviews={imgAcademicTranscript}
                                                   setFilePreviews={setImgAcademicTranscript}
                                                   error={errors.b7_img_academic_transcript}
                                                   touched={touched.b7_img_academic_transcript}
                                                   multiple={false}
                                                   accept={"image/*"}
                                                />
                                             </Grid>
                                             {auth.role_id <= ROLE_ADMIN && formData.status == "TERMINADA" && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         field={"b7_approved_academic_transcript"}
                                                         approved={values.b7_approved_academic_transcript}
                                                         name="Acta de Nacimiento"
                                                      />
                                                   </Grid>
                                                   {/* Comentarios */}
                                                   <Grid
                                                      xs={8}
                                                      md={4}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <TextField
                                                         id="b7_comments_academic_transcript"
                                                         name="b7_comments_academic_transcript"
                                                         label="Causa del rechazo del documento"
                                                         type="text"
                                                         value={values.b7_comments_academic_transcript}
                                                         placeholder="Escribe el detalle del porque rechazaste este documento..."
                                                         onChange={handleChange}
                                                         onBlur={handleBlur}
                                                         fullWidth
                                                         multiline
                                                         rows={5}
                                                         inputProps={{}}
                                                         // disabled={values.id == 0 ? false : true}
                                                         error={errors.b7_comments_academic_transcript && touched.b7_comments_academic_transcript}
                                                         helperText={
                                                            errors.b7_comments_academic_transcript &&
                                                            touched.b7_comments_academic_transcript &&
                                                            showErrorInput(9, errors.b7_comments_academic_transcript)
                                                         }
                                                      />
                                                   </Grid>
                                                </>
                                             )}
                                          </>
                                       </Grid>
                                       <Button type="button" color="info" id="btnModify" sx={{ mt: 1, display: "none" }} onClick={() => handleModify(setValues)}>
                                          setValues
                                       </Button>
                                       {folio > 0 && ["", "ALTA"].includes(formData.status) && (
                                          <ButtonsBeforeOrNext isSubmitting={isSubmitting} setValues={setValues} />
                                       )}
                                       {auth.role_id < ROLE_ADMIN && folio > 0 && ["TERMINADA", "EN REVISION"].includes(formData.status) && (
                                          <Box sx={{ display: "flex", flexDirection: "row-reverse", pt: 2 }}>
                                             <Button color="primary" variant="contained" onClick={handleClickFinishReview} sx={{ mr: 1 }}>
                                                TERMINAR REVISIÓN
                                             </Button>
                                             <Button color="secondary" variant="contained" onClick={handleClickSavehReview} sx={{ mr: 1 }}>
                                                GUARDAR
                                             </Button>
                                          </Box>
                                       )}
                                    </Box>
                                 )}
                              </Formik>
                           )}
                        </Box>
                     </Fragment>
                  )}
               </Box>
            </>
         )}
      </Box>
   );
};

export default RequestBecaView;
