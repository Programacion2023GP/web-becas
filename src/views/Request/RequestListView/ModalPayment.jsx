import { Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { formatDatetimeToSQL, numberToText } from "../../../utils/Formats";
import Toast from "../../../utils/Toast";
import { DatePickerComponent, FileInputComponent, FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useRelationshipContext } from "../../../context/RelationshipContext";
import { MonetizationOn } from "@mui/icons-material";

function ModalPayment({ folio, open, setOpen, statusCurrent, modalTitle, maxWidth }) {
   const { setLoadingAction } = useGlobalContext();
   const { updateStatusBeca } = useRequestBecaContext();
   const { relationships, getRelationshipsSelectIndex } = useRelationshipContext();

   const formikRef = useRef();
   const [formData, setFormData] = useState({
      // folio: folio,
      rejected_feedback: "",
      rejected_at: ""
   });
   const [imgEvidence, setImgEvidence] = useState([]);
   const [textValue, setTextValue] = useState("");

   const handleCancel = (resetForm) => {
      try {
         if (resetForm) resetForm();
         resetFormData();
         setOpen(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const resetFormData = () => {
      formData.rejected_feedback = "";
      formData.rejected_at = "";
      setImgEvidence([]);
      setFormData({
         // folio: 0,
         rejected_feedback: "",
         rejected_at: ""
      });
      console.log("limpiao");
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         values.img_evidence = imgEvidence.length == 0 ? "" : imgEvidence[0].file;

         // console.log("values", values);
         setLoadingAction(true);
         const axiosResponse = await updateStatusBeca(folio, "RECHAZADA", values, statusCurrent);

         if (axiosResponse.status_code === 200) {
            resetForm();
            resetFormData();
         }
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         setOpen(false);
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

   const handleChangeAmountPaid = (value) => {
      if (value.length == 0) return setTextValue("");
      setTextValue(numberToText(parseFloat(value)));
   };

   const validationSchema = Yup.object().shape({
      rejected_feedback: Yup.string().trim().required("Retroalimentación del Rechazo requerido")
   });

   useEffect(() => {
      // console.log("ModalPayment");
   }, []);

   return (
      <ModalComponent open={open} setOpen={setOpen} modalTitle={modalTitle} maxWidth={maxWidth} height={"65vh"}>
         <FormikComponent
            key={"formikComponent"}
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            textBtnSubmit={"PAGAR"}
            formikRef={formikRef}
            handleCancel={handleCancel}
            maxHeight={"80%"}
         >
            <InputComponent col={12} idName={"id"} label={"ID"} placeholder={"ID"} textStyleCase={true} hidden={true} />
            <DatePickerComponent col={12} idName={"fec"} label={"Fecha y Hora de Pago"} format={"dddd d MMMM YYYY hh:mm a"} disabled={true} />
            <Select2Component
               col={5}
               idName={"relationship_id"}
               label={"Parentezco *"}
               options={relationships}
               pluralName={"Parentezcos"}
               refreshSelect={getRelationshipsSelectIndex}
            />
            <InputComponent col={7} idName={"paid_to"} label={"Nombre de quien Recibio el pago *"} placeholder={"Nombre Completo"} textStyleCase={true} />
            <InputComponent
               col={2}
               idName={"amount_paid"}
               label={"Monto"}
               placeholder={"$999.99"}
               type={"numeric"}
               icon={<MonetizationOn />}
               handleChangeExtra={handleChangeAmountPaid}
            />
            <Typography color={"GrayText"} sx={{ display: "flex", alignItems: "center", fontStyle: "italic" }}>
               {textValue}
            </Typography>
            <FileInputComponent
               idName="img_evidence"
               label="Evidencia del pago *"
               filePreviews={imgEvidence}
               setFilePreviews={setImgEvidence}
               multiple={false}
               accept={"image/*"}
            />
            {/* ENVIAR (onSubmit) ----------> */}
            {/* MODIFICAR (handleModify) ---> setObjImg(formData.img_evidence, setImgEvidence); */}
            {/* RESET ---------------------->  */}
            <InputComponent
               col={12}
               idName={"paid_feedback"}
               label={"Comentarios (opcional)"}
               placeholder={"Escriba comentarios u observaciones si existen..."}
               textStyleCase={null}
               rows={3}
            />
         </FormikComponent>
      </ModalComponent>
   );
}

export default ModalPayment;
