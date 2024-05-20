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
import { InputComponentEST } from "../../../components/Form/InputComponentEST";
import LogoGPD from "../../../assets/images/icon.png";
import { FormikComponent, InputComponent } from "../../../components/Form/FormikComponents";
import InputsFormik1 from "./InputsFormik1";
import InputsFormik2 from "./InputsFormik2";
import InputsFormik3 from "./InputsFormik3";
import InputsFormik4 from "./InputsFormik4";
import InputsFormik5 from "./InputsFormik5";
import InputsFormik6 from "./InputsFormik6";
import InputsFormik7 from "./InputsFormik7";
import InputsFormik8 from "./InputsFormik8";

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
   const { getTutorByCURP } = useTutorContext();
   const { formData, setFormData, resetFormData, getRequestBecasByFolio, createRequestBeca, updateRequestBeca, saveBeca, requestBeca, saveOrFinishReview } =
      useRequestBecaContext();

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
   const formik = useRef(null);

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
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", pt: 2, width: "100%" }}>
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

   const onSubmit1 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         console.log("values", values);
         await setFormData({ ...formData, ...values });
         console.log("formData-1", formData);
         console.log("formik.current.values");
         await setValues(formData);
         // console.log("formData", formData);
         // console.log("values", values);
         setStepFailed(-1);
         handleComplete();
         // setTimeout(() => {
         //    inputRefCurp.current.focus();
         // }, 500);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit2 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         values.num_int = values.num_int === "" ? "S/N" : values.num_int;

         // console.log("🚀 ~ onSubmit2 ~ values:", values);
         await setFormData({ ...formData, ...values });
         // console.log("formData-2", formData);
         await setValues(values);
         // console.log("formData", formData);
         // console.log("values", values);
         setStepFailed(-1);
         handleComplete();
         setTimeout(() => {
            inputRefSchoolId.current.focus();
         }, 500);
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

         values.b5_drinking_water = values.b5_drinking_water ? 1 : 0 || 0;
         values.b5_electric_light = values.b5_electric_light ? 1 : 0 || 0;
         values.b5_sewer_system = values.b5_sewer_system ? 1 : 0 || 0;
         values.b5_pavement = values.b5_pavement ? 1 : 0 || 0;
         values.b5_automobile = values.b5_automobile ? 1 : 0 || 0;
         values.b5_phone_line = values.b5_phone_line ? 1 : 0 || 0;
         values.b5_internet = values.b5_internet ? 1 : 0 || 0;

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
         if (values.under_protest) values.b6_finished = 1;

         values.b6_beca_transport = values.b6_beca_transport ? 1 : 0 || 0;
         values.b6_beca_benito_juarez = values.b6_beca_benito_juarez ? 1 : 0 || 0;
         values.b6_beca_jovenes = values.b6_beca_jovenes ? 1 : 0 || 0;
         values.b6_other = values.b6_other ? 1 : 0 || 0;
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
         // console.log("el formData en el onSubmit8", formData);
         // console.log("el values en el onSubmit8", values);
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
               tutor_relationship_id: Yup.number().min(1, "Esta opción no es valida").required("Parentesco del tutor requerido"),
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
               under_protest: Yup.bool().oneOf([true], "Debe aceptar Bajo Protesta para continuar").required("Bajo Protesta requerido")
            });
            break;
         case 9: // PAGINA DE DOCUMENTOS
            validationSchema = Yup.object().shape({
               // id: 0,
               // folio: Yup.number("solo números").required("Folio requerido"),
               // b7_img_tutor_ine: Yup.string().trim().required("INE requerida"),
               b7_approved_tutor_ine:
                  auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_tutor_ine: "",
               // b7_img_tutor_power_letter: isTutor && Yup.string().trim().required("Carta Poder requerida"),
               b7_approved_tutor_power_letter:
                  auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_tutor_power_letter: "",
               // b7_img_proof_address: Yup.string().trim().required("Comprobante de Domicilio requerida"),
               b7_approved_proof_address:
                  auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_proof_address: "",
               // b7_img_curp: Yup.string().trim().required("CURP requerida"),
               b7_approved_curp:
                  auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_curp: "",
               // b7_img_birth_certificate: Yup.string().trim().required("Acta de Nacimiento requerida"),
               b7_approved_birth_certificate:
                  auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && Yup.bool().required("Aprueba o Desaprueba el documento."),
               // b7_comments_birth_certificate: "",
               // b7_img_academic_transcript: Yup.string().trim().required("Constancia Estudiantil con Calificaciones requerida"),
               b7_approved_academic_transcript:
                  auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && Yup.bool().required("Aprueba o Desaprueba el documento.")
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
                     <SwitchIOSComponent checked={active} />
                  </Button>
               </Tooltip>
            )} */}
         </ButtonGroup>
      );
   };

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

   const ButtonsApprovedDocument = ({ setFieldValue, fieldApproved, fieldComments, name = "documento", approved = true }) => {
      const iconSize = 65;
      return (
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
      );
   };

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
            // console.log("holaa soy pagina9 - siTutor:", isTutor, ajaxResponse.result.requestBecas.tutor_relationship_id);
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

   useEffect(() => {
      // console.log("🚀 ~ useEffect ~ formData:", formData);
      // console.log("🚀 ~ useEffect ~ formik.current.values:", formik.current?.values);
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
   }, [formData, folio]);
   // }, [formData, pagina, activeStep]);

   return (
      <Box sx={{ width: "100%", height: "100%" }}>
         <Typography variant="h1" color={"#364152"} mb={2}>
            Solicitud de Beca
         </Typography>
         {pagina == 0 ? (
            <Box
               sx={{
                  height: "85%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
               }}
               p={2}
            >
               <img src={LogoGPD} className="bg-request-index" />
               <Typography variant="h2" mb={2} sx={{ position: "relative" }}>
                  DIRECCION DE EDUCACIÓN
               </Typography>
               <Typography variant="h3" align="justify" mb={2} sx={{ fontWeight: "normal", lineHeight: 2, maxWidth: "70%", position: "relative" }}>
                  El presente cuestionario tiene por objetivo conocer el perfil de los aspirantes a obtener una beca del <b>R. Ayuntamiento de Gómez Palacio</b>. La
                  información proporcionada de aqui debe ser completamente verdadera, por ello, lee con atención cada pregunta y contesta adecuadamente.
               </Typography>
               {auth.permissions.create && (
                  <Link to={"pagina/1"}>
                     <Button onClick={handleReset} variant="contained" size="large" fullWidth>
                        COMENZAR SOLICITUD
                     </Button>
                  </Link>
               )}
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
                        <Box sx={{ mt: 2, height: "100%" }}>
                           {activeStep + 1 == 1 && (
                              <FormikComponent
                                 key={"formikComponent1"}
                                 initialValues={formData}
                                 validationSchema={validationSchemas(activeStep + 1)}
                                 onSubmit={onSubmit1}
                                 formikRef={formik}
                                 activeStep={activeStep}
                                 setStepFailed={setStepFailed}
                                 showActionButtons={false}
                              >
                                 <InputsFormik1
                                    folio={folio}
                                    pagina={pagina}
                                    activeStep={activeStep}
                                    setStepFailed={setStepFailed}
                                    ButtonsBeforeOrNext={ButtonsBeforeOrNext}
                                 />
                              </FormikComponent>
                           )}
                           {activeStep + 1 == 2 && (
                              <FormikComponent
                                 key={"formikComponent2"}
                                 initialValues={formData}
                                 validationSchema={validationSchemas(activeStep + 1)}
                                 onSubmit={onSubmit2}
                                 formikRef={formik}
                                 activeStep={activeStep}
                                 setStepFailed={setStepFailed}
                                 showActionButtons={false}
                              >
                                 <InputsFormik2
                                    folio={folio}
                                    pagina={pagina}
                                    activeStep={activeStep}
                                    setStepFailed={setStepFailed}
                                    ButtonsBeforeOrNext={ButtonsBeforeOrNext}
                                 />
                              </FormikComponent>
                           )}
                           {activeStep + 1 == 3 && (
                              <FormikComponent
                                 key={"formikComponent3"}
                                 initialValues={formData}
                                 validationSchema={validationSchemas(activeStep + 1)}
                                 onSubmit={onSubmit3}
                                 formikRef={formik}
                                 activeStep={activeStep}
                                 setStepFailed={setStepFailed}
                                 showActionButtons={false}
                              >
                                 <InputsFormik3
                                    folio={folio}
                                    pagina={pagina}
                                    activeStep={activeStep}
                                    setStepFailed={setStepFailed}
                                    ButtonsBeforeOrNext={ButtonsBeforeOrNext}
                                 />
                              </FormikComponent>
                           )}
                           {activeStep + 1 == 4 && (
                              <FormikComponent
                                 key={"formikComponent4"}
                                 initialValues={formData}
                                 validationSchema={validationSchemas(activeStep + 1)}
                                 onSubmit={onSubmit4}
                                 formikRef={formik}
                                 activeStep={activeStep}
                                 setStepFailed={setStepFailed}
                                 showActionButtons={false}
                              >
                                 <InputsFormik4
                                    folio={folio}
                                    pagina={pagina}
                                    activeStep={activeStep}
                                    setStepFailed={setStepFailed}
                                    ButtonsBeforeOrNext={ButtonsBeforeOrNext}
                                 />
                              </FormikComponent>
                           )}
                           {activeStep + 1 == 5 && (
                              <FormikComponent
                                 key={"formikComponent5"}
                                 initialValues={formData}
                                 validationSchema={validationSchemas(activeStep + 1)}
                                 onSubmit={onSubmit5}
                                 formikRef={formik}
                                 activeStep={activeStep}
                                 setStepFailed={setStepFailed}
                                 showActionButtons={false}
                              >
                                 <InputsFormik5
                                    folio={folio}
                                    pagina={pagina}
                                    activeStep={activeStep}
                                    setStepFailed={setStepFailed}
                                    ButtonsBeforeOrNext={ButtonsBeforeOrNext}
                                 />
                              </FormikComponent>
                           )}
                           {activeStep + 1 == 6 && (
                              <FormikComponent
                                 key={"formikComponent6"}
                                 initialValues={formData}
                                 validationSchema={validationSchemas(activeStep + 1)}
                                 onSubmit={onSubmit6}
                                 formikRef={formik}
                                 activeStep={activeStep}
                                 setStepFailed={setStepFailed}
                                 showActionButtons={false}
                              >
                                 <InputsFormik6
                                    folio={folio}
                                    pagina={pagina}
                                    activeStep={activeStep}
                                    setStepFailed={setStepFailed}
                                    ButtonsBeforeOrNext={ButtonsBeforeOrNext}
                                 />
                              </FormikComponent>
                           )}
                           {activeStep + 1 == 7 && (
                              <FormikComponent
                                 key={"formikComponent7"}
                                 initialValues={formData}
                                 validationSchema={validationSchemas(activeStep + 1)}
                                 onSubmit={onSubmit7}
                                 formikRef={formik}
                                 activeStep={activeStep}
                                 setStepFailed={setStepFailed}
                                 showActionButtons={false}
                              >
                                 <InputsFormik7
                                    folio={folio}
                                    pagina={pagina}
                                    activeStep={activeStep}
                                    setStepFailed={setStepFailed}
                                    ButtonsBeforeOrNext={ButtonsBeforeOrNext}
                                 />
                              </FormikComponent>
                           )}
                           {activeStep + 1 == 8 && (
                              <FormikComponent
                                 key={"formikComponent8"}
                                 initialValues={formData}
                                 validationSchema={validationSchemas(activeStep + 1)}
                                 onSubmit={onSubmit8}
                                 formikRef={formik}
                                 activeStep={activeStep}
                                 setStepFailed={setStepFailed}
                                 showActionButtons={false}
                              >
                                 <InputsFormik8
                                    folio={folio}
                                    pagina={pagina}
                                    activeStep={activeStep}
                                    setStepFailed={setStepFailed}
                                    ButtonsBeforeOrNext={ButtonsBeforeOrNext}
                                 />
                              </FormikComponent>
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
                                             {auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         fieldApproved={"b7_approved_tutor_ine"}
                                                         fieldComments={"b7_comments_tutor_ine"}
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
                                                {auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && (
                                                   <>
                                                      {/* Botones */}
                                                      <Grid
                                                         xs={4}
                                                         md={2}
                                                         sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                      >
                                                         <ButtonsApprovedDocument
                                                            setFieldValue={setFieldValue}
                                                            fieldApproved={"b7_approved_tutor_power_letter"}
                                                            fieldComments={"b7_comments_tutor_power_letter"}
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
                                             {auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         fieldApproved={"b7_approved_proof_address"}
                                                         fieldComments={"b7_comments_proof_address"}
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
                                             {auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         fieldApproved={"b7_approved_curp"}
                                                         fieldComments={"b7_comments_curp"}
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
                                             {auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         fieldApproved={"b7_approved_birth_certificate"}
                                                         fieldComments={"b7_comments_birth_certificate"}
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
                                             {auth.role_id <= ROLE_ADMIN && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && (
                                                <>
                                                   {/* Botones */}
                                                   <Grid
                                                      xs={4}
                                                      md={2}
                                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                                   >
                                                      <ButtonsApprovedDocument
                                                         setFieldValue={setFieldValue}
                                                         fieldApproved={"b7_approved_academic_transcript"}
                                                         fieldComments={"b7_comments_academic_transcript"}
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
                                       {auth.role_id <= ROLE_ADMIN && folio > 0 && ["TERMINADA", "EN REVISIÓN"].includes(formData.status) && (
                                          <Box sx={{ display: "flex", flexDirection: "row-reverse", pt: 2 }}>
                                             <Button color="primary" variant="contained" onClick={() => handleClickFinishReview(values)} sx={{ mr: 1 }}>
                                                TERMINAR REVISIÓN
                                             </Button>
                                             <Button color="secondary" variant="contained" onClick={() => handleClickSaveReview(values)} sx={{ mr: 1 }}>
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
