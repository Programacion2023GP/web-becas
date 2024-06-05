import { useFormikContext } from "formik";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   DatePickerComponent,
   DividerComponent,
   InputComponent,
   InputsCommunityComponent,
   RadioButtonComponent,
   Select2Component,
   getCommunity
} from "../../../components/Form/FormikComponents";
import Toast from "../../../utils/Toast";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import sAlert from "../../../utils/sAlert";
import { useEffect, useState } from "react";
import { useStudentContext } from "../../../context/StudentContext";
import { useDisabilityContext } from "../../../context/DisabilityContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import { Button } from "@mui/material";

const InputsFormik2 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext }) => {
   const { setDisabledState, setDisabledCity, setDisabledColony, setShowLoading, setDataStates, setDataCities, setDataColonies, setDataColoniesComplete } =
      useGlobalContext();
   const { formData, setFormData } = useRequestBecaContext();
   const { disabilities, getDisabilitiesSelectIndex } = useDisabilityContext();
   const { getStudentByCURP } = useStudentContext();
   const [loadingCURP, setLoadingCURP] = useState(false);

   const formik = useFormikContext();

   const handleChangeCURP = async (e, values, setFieldValue) => {
      try {
         let curp = e.target.value.toUpperCase();
         // if (curp.length < 1) return Toast.Info("El campo CURP esta vacío");
         if (curp.length < 18) return;
         setLoadingCURP(true);

         let axiosReponse = await getStudentByCURP(curp);
         // console.log("🚀 ~ handleChangeCURP ~ axiosReponse:", axiosReponse.result);

         if (axiosReponse.result == null) {
            setLoadingCURP(false);
            return sAlert.Info("El CURP ingresado no está registrado, veritifíca que este correcto para guardarse al finalizar esta solicitud.");
         }
         // debugger;

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
         setLoadingCURP(false);
      } catch (error) {
         setLoadingCURP(false);
         console.log(error);
         Toast.Error(error);
      }
   };

   // useEffect(() => {});

   return (
      <>
         <Grid width={"100%"} xs={12} spacing={2} height={"67vh"} maxHeight={"67vh"} overflow={"auto"}>
            <Grid xs={12} container spacing={2}>
               {/* CURP */}
               <InputComponent
                  col={4}
                  idName={"curp"}
                  label={"CURP *"}
                  placeholder={"Escribe tu CURP"}
                  onChange={(e) => {
                     handleChangeCURP(e, formik.values, formik.setFieldValue);
                  }}
                  inputProps={{ maxLength: 18 }}
                  textStyleCase={true}
                  disabled={formik.values.id == 0 ? false : true}
                  loading={loadingCURP}
                  focus={true}
                  // inputRef={inputRefCurp}
               />

               {/* Nombre del Alumno */}
               <InputComponent
                  col={8}
                  idName={"name"}
                  label={"Nombre del Alumno *"}
                  placeholder={"Escribe el nombre del alumno"}
                  textStyleCase={true}
                  disabled={formik.values.id == 0 ? false : true}
               />

               {/* Apellido Paterno del Alumno */}
               <InputComponent
                  col={6}
                  idName={"paternal_last_name"}
                  label={"Apellido Paterno *"}
                  placeholder={"Escribe el apellido paterno del alumno"}
                  textStyleCase={true}
                  disabled={formik.values.id == 0 ? false : true}
               />

               {/* Apellido Materno del Alumno */}
               <InputComponent
                  col={6}
                  idName={"maternal_last_name"}
                  label={"Apellido Materno *"}
                  placeholder={"Escribe el apellido materno del alumno"}
                  textStyleCase={true}
                  disabled={formik.values.id == 0 ? false : true}
               />

               {/* Fecha de Nacimiento */}
               <DatePickerComponent
                  col={4}
                  idName={"birthdate"}
                  label={"Fecha de Nacimiento *"}
                  format={"DD/MM/YYYY"}
                  disabled={formik.values.id == 0 ? false : true}
               />

               {/* Genero */}
               <RadioButtonComponent
                  col={4}
                  title={"Género"}
                  idName={"gender"}
                  options={[
                     { value: "MASCULINO", label: "Masculino" },
                     { value: "FEMENINO", label: "Femenino" }
                  ]}
                  disabled={formik.values.id == 0 ? false : true}
               />

               {/* Discapacidad */}
               <Select2Component
                  col={4}
                  idName={"disability_id"}
                  label={"¿Tienes alguna discapacaidad?"}
                  options={disabilities}
                  disabled={formik.values.id == 0 ? false : true}
                  pluralName={"Discapacidades"}
                  refreshSelect={getDisabilitiesSelectIndex}
               />

               <DividerComponent />

               {/* INPUTS DE COMUNIDAD */}
               <InputsCommunityComponent formData={formData} setFormData={setFormData} columnsByTextField={3} />
            </Grid>
         </Grid>

         {!(folio > 0) && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik2;
