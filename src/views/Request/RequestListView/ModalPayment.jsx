import * as Yup from "yup";

import { Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import Toast from "../../../utils/Toast";
import { DatePickerComponent, FileInputComponent, FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useRelationshipContext } from "../../../context/RelationshipContext";
import { MonetizationOn } from "@mui/icons-material";
import { formatDatetimeToSQL, numberToText } from "../../../utils/Formats";

function ModalPayment({ obj, open, setOpen, statusCurrent, modalTitle, maxWidth,  }) {
   const { setLoadingAction } = useGlobalContext();
   const { updateStatusBeca } = useRequestBecaContext();
   const { relationships, getRelationshipsSelectIndex } = useRelationshipContext();

   const formikRef = useRef();
   const initialValues = {
      id: 0,
      beca_id: obj.id,
      relationship_id: "",
      paid_to: "",
      amount_paid: "",
      img_evidence: "",
      paid_feedback: "",
      paid_at: ""
   };
   const [formData, setFormData] = useState(initialValues);
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
      setImgEvidence([]);
      setFormData(initialValues);
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         console.log("🚀 ~ onSubmit ~ imgEvidence:", imgEvidence);
         values.img_evidence = imgEvidence.length == 0 ? "" : imgEvidence[0].file;
         // values.paid_at = formatDatetimeToSQL(new Date());
         // return console.log("values", values);

         setLoadingAction(true);
         const axiosResponse = await updateStatusBeca(obj.folio, "PAGANDO", values, statusCurrent);

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
      } finally {
         setSubmitting(false);
         setLoadingAction(false);
      }
   };

   const handleChangeAmountPaid = (value) => {
      if (value.length == 0) return setTextValue("");
      setTextValue(numberToText(parseFloat(value)));
   };

   const validationSchema = Yup.object().shape({
      relationship_id: Yup.string().trim().required("Parentesco requerido"),
      paid_to: Yup.string().trim().required("Nombre de quien recibe del Pago 1 requerido"),
      amount_paid: Yup.number().min(0, "Está cantidad no es aceptable. ").required("Monto requerido")
      // img_evidence: Yup.string().trim().required("Retroalimentación del Rechazo requerido"),
   });

   useEffect(() => {
      console.log("🚀 ~ useEffect ~ formData:", formData);
   }, []);

   return (
      <ModalComponent open={open} setOpen={setOpen} modalTitle={`${modalTitle} A FOLIO #${obj.folio}`} maxWidth={maxWidth} height={"65vh"}>
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
            <Select2Component
               col={5}
               idName={"relationship_id"}
               label={"parentesco *"}
               options={relationships}
               pluralName={"parentescos"}
               refreshSelect={getRelationshipsSelectIndex}
            />
            <InputComponent col={7} idName={"paid_to"} label={"Nombre de quien Recibio el pago *"} placeholder={"Nombre Completo"} textStyleCase={true} />
            <InputComponent
               col={2}
               idName={"amount_paid"}
               label={"Monto *"}
               placeholder={"$999.99"}
               type={"numeric"}
               icon={<MonetizationOn />}
               handleChangeExtra={handleChangeAmountPaid}
            />
            <Grid container md={10}>
               <Typography color={"GrayText"} sx={{ display: "flex", alignItems: "center", fontStyle: "italic", fontWeight: "bolder" }}>
                  {textValue}
               </Typography>
            </Grid>
            <FileInputComponent
               col={4}
               idName="img_evidence"
               label="Evidencia del pago *"
               filePreviews={imgEvidence}
               setFilePreviews={setImgEvidence}
               multiple={false}
               accept={"image/*"}
               fileSizeMax={3}
            />
            {/* MODIFICAR (handleModify) ---> setObjImg(formData.img_evidence, setImgEvidence); */}
            <InputComponent
               col={8}
               idName={"paid_feedback"}
               label={"Comentarios (opcional)"}
               placeholder={"Escriba comentarios u observaciones si existen..."}
               textStyleCase={null}
               rows={8}
            />
         </FormikComponent>
      </ModalComponent>
   );
}

export default ModalPayment;
