import { useFormikContext } from "formik";
import { InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useRelationshipContext } from "../../../context/RelationshipContext";
import { useTutorContext } from "../../../context/TutorContext";
import Toast from "../../../utils/Toast";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import sAlert from "../../../utils/sAlert";
import { useEffect } from "react";

const InputsFormik1 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext }) => {
   const { formData, setFormData } = useRequestBecaContext();
   const { relationships, getRelationshipsSelectIndex } = useRelationshipContext();
   const { getTutorByCURP } = useTutorContext();

   const handleChangeTutorCURP = async (e, values, setFieldValue) => {
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
         // await setFieldValue("tutor_relationship", axiosReponse.result.relationship);
         // await setFieldValue("tutor_curp", axiosReponse.result.tutor_curp);
         await setFieldValue("tutor_name", axiosReponse.result.tutor_name);
         await setFieldValue("tutor_paternal_last_name", axiosReponse.result.tutor_paternal_last_name);
         await setFieldValue("tutor_maternal_last_name", axiosReponse.result.tutor_maternal_last_name);
         await setFieldValue("tutor_phone", axiosReponse.result.tutor_phone);

         await setFormData({ ...formData, ...values });
         // console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const handleChangeRelationships = (inputName, relationship, setFieldValue) => setIsTutor(relationship.id > 2 ? true : false);

   useEffect(() => {});

   const formik = useFormikContext();
   return (
      <>
         {/* CURP tutor */}
         <InputComponent
            col={6}
            idName={"tutor_curp"}
            label={"CURP *"}
            placeholder={"Escribe tu CURP"}
            textStyleCase={true}
            onChange={(e) => {
               handleChangeTutorCURP(e, formik.values, formik.setFieldValue);
            }}
            disabled={formik.values.id == 0 ? false : true}
         />
         {/* Parentesco */}
         <Select2Component
            col={6}
            idName={"tutor_relationship_id"}
            label={"Parentesco *"}
            options={relationships}
            handleChangeValueSuccess={handleChangeRelationships}
            disabled={formik.values.id == 0 ? false : true}
            pluralName={"Parentescos"}
            refreshSelect={getRelationshipsSelectIndex}
         />
         {/* Nombre Tutor */}
         <InputComponent
            col={6}
            idName={"tutor_name"}
            label={"Nombre del Tutor *"}
            placeholder={"Escribir nombre completo"}
            disabled={formik.values.id == 0 ? false : true}
         />

         {/* Apellido Paterno Tutor */}
         <InputComponent
            col={6}
            idName={"tutor_paternal_last_name"}
            label={"Apellido Paterno del Tutor *"}
            placeholder={"Escribe tu primer apellido"}
            textStyleCase={true}
            disabled={formik.values.id == 0 ? false : true}
         />
         {/* Apellido Materno Tutor */}
         <InputComponent
            col={6}
            idName={"tutor_maternal_last_name"}
            label={"Apellido Materno del Tutor *"}
            placeholder={"Escbribe tu segundo apellido"}
            textStyleCase={true}
            disabled={formik.values.id == 0 ? false : true}
         />
         {/* Tel Tutor */}
         <InputComponent
            col={6}
            idName={"tutor_phone"}
            label={"Teléfono Tutor *"}
            placeholder={"10 dígitos"}
            inputProps={{ maxLength: 10 }}
            disabled={formik.values.id == 0 ? false : true}
         />
         {!(folio > 0) && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik1;
