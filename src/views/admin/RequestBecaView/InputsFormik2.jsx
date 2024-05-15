import { useFormikContext } from "formik";
import DatePickerComponent, { DividerComponent, InputComponent, RadioButtonComponent, Select2Component } from "../../../components/Form/FormikComponents";
import Toast from "../../../utils/Toast";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import sAlert from "../../../utils/sAlert";
import { useEffect } from "react";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
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

   const handleChangeCURP = async (e, values, setFieldValue) => {
      try {
         let curp = e.target.value.toUpperCase();
         // if (curp.length < 1) return Toast.Info("El campo CURP esta vacío");
         if (curp.length < 18) return;
         debugger;

         let axiosReponse = await getStudentByCURP(curp);
         console.log("🚀 ~ handleChangeCURP ~ axiosReponse:", axiosReponse.result);
         console.log("🚀 ~ handleChangeCURP ~ values:", values);
         console.log("🚀 ~ handleChangeCURP ~ formData:", formData);

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

         // hacer consulta a la api de Comunidad para sacar la localidad
         formData.community_id = axiosReponse.result.community_id;
         await setFieldValue("community_id", formData.community_id);
         await setFormData({ ...formData, ...values });
         console.log("🚀 ~ handleChangeCURP ~ formData:", formData);

         // if (formData.community_id > 0) {
         //    getCommunity(
         //       formData.zip,
         //       setFieldValue,
         //       formData.community_id,
         //       formData,
         //       setFormData,
         //       setDisabledState,
         //       setDisabledCity,
         //       setDisabledColony,
         //       setShowLoading,
         //       setDataStates,
         //       setDataCities,
         //       setDataColonies,
         //       setDataColoniesComplete
         //    );
         // }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const formik = useFormikContext();

   // useEffect(() => {});

   return (
      <>
         {/* CURP */}
         <InputComponent
            col={4}
            idName={"curp"}
            label={"CURP *"}
            placeholder={"Escribe tu CURP"}
            onChange={(e) => {
               handleChangeCURP(e, formik.values, formik.setValues, formik.setFieldValue);
            }}
            inputProps={{ maxLength: 18 }}
            textStyleCase={true}
            // disabled={formik.values.id == 0 ? false : true}
            // inputRef={inputRefCurp}
         />
         {/* Nombre del Alumno */}
         <InputComponent
            col={8}
            idName={"name"}
            label={"Nombre del Alumno *"}
            placeholder={"Escribe el nombre del alumno"}
            textStyleCase={true}
            // disabled={formik.values.id == 0 ? false : true}
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
         <DatePickerComponent col={4} idName={"birthdate"} label={"Fecha de Nacimiento *"} format={"DD/MM/YYYY"} disabled={formik.values.id == 0 ? false : true} />

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
         {/* <Grid xs={12} md={4} sx={{ mb: 1 }}>
            <FormControl fullWidth sx={{ alignItems: "center" }} disabled={formik.values.id == 0 ? false : true}>
               <FormLabel id="gender-label">Género</FormLabel>
               <RadioGroup row aria-labelledby="gender-label" id="gender" name="gender" value={formik.values.gender} onChange={handleChange} onBlur={handleBlur}>
                  <FormControlLabel value="MASCULINO" control={<Radio />} label="Masculino" />
                  <FormControlLabel value="FEMENINO" control={<Radio />} label="Femenino" />
               </RadioGroup>
               {touched.gender && errors.gender && showErrorInput(2, errors.gender, true)}
            </FormControl>
         </Grid> */}

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
         {/* <Grid xs={12} md={4} sx={{ mb: 1 }}>
            <Select2Component
               idName={"disability_id"}
               label={"Discapacidad *"}
               valueLabel={formik.values.disability}
               values={formik.values}
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
               disabled={formik.values.id == 0 ? false : true}
               pluralName={"Discapacidades"}
               refreshSelect={getDisabilitiesSelectIndex}
            />
         </Grid> */}

         <DividerComponent />

         {/* INPUTS DE COMUNIDAD */}
         <InputsCommunityComponent
            formData={formData}
            setFormData={formik.setFormData}
            values={formik.values}
            setFieldValue={formik.setFieldValue}
            setValues={formik.setValues}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            columnsByTextField={3}
            disabled={formik.values.id == 0 ? false : true}
         />
         <Button
            onClick={() => {
               console.log("formik.values", formik.values);
               console.log("formData", formData);
            }}
         >
            Boton X
         </Button>
         {!(folio > 0) && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik2;
