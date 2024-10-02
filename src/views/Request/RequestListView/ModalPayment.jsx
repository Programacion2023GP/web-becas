import * as Yup from "yup";

import { Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import Toast from "../../../utils/Toast";
import {
   DatePickerComponent,
   FileInputComponent,
   FormikComponent,
   InputComponent,
   RadioButtonComponent,
   Select2Component
} from "../../../components/Form/FormikComponents";
import { useRelationshipContext } from "../../../context/RelationshipContext";
import { MonetizationOn } from "@mui/icons-material";
import { formatDatetimeToSQL, numberToText } from "../../../utils/Formats";
import { validateImageRequired } from "../../../utils/Validations";
import ImageZoomComponent from "../../../components/ImageZoomComponent";

function ModalPayment({ obj, open, setOpen, statusCurrent, modalTitle, numPago, maxWidth }) {
   const { setLoadingAction } = useGlobalContext();
   const { updateStatusBeca } = useRequestBecaContext();

   const formikRef = useRef();
   const initialValues = {
      id: 0,
      beca_id: obj.id,
      paid_to_tutor: true,
      amount_paid: "",
      img_evidence: "",
      paid_feedback: "",
      paid_at: ""
   };
   const [formData, setFormData] = useState(initialValues);
   const [imgEvidence, setImgEvidence] = useState([]);
   const [imgIneShown, setImgIneShown] = useState(obj.b7_img_tutor_ine);
   const [imgIneBackShown, setImgIneBackShown] = useState(obj.b7_img_tutor_ine_back);

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
         // console.log("🚀 ~ onSubmit ~ imgEvidence:", imgEvidence);
         values.img_evidence = imgEvidence.length == 0 ? "" : imgEvidence[0].file;
         // values.paid_at = formatDatetimeToSQL(new Date());
         // return console.log("values", values);
         if (!validateImageRequired(values.img_evidence, "La foto de EVIDENCIA es requerida")) return;

         setLoadingAction(true);
         const axiosResponse = await updateStatusBeca(obj.folio, `PAGO ${numPago}`, values, null, numPago);

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
      paid_to_tutor: Yup.string().trim().required(`Nombre de quien recibe el Pago ${numPago} requerido`),
      amount_paid: Yup.number().min(0, "Está cantidad no es aceptable. ").required("Monto requerido")
      // img_evidence: Yup.string().trim().required("Retroalimentación del Rechazo requerido"),
   });

   const handleChangePaidTo = (idName, value) => {
      if (value) {
         setImgIneShown(obj.b7_img_tutor_ine);
         setImgIneBackShown(obj.b7_img_tutor_ine_back);
      } else {
         setImgIneShown(obj.b7_img_second_ref);
         setImgIneBackShown(obj.b7_img_second_ref_back);
      }
   };

   useEffect(() => {
      // console.log("🚀 ~ useEffect ~ obj:", obj);
      // console.log("🚀 ~ useEffect ~ formData:", formData);
   }, [imgIneShown]);

   return (
      <ModalComponent
         open={open}
         setOpen={setOpen}
         modalTitle={`${modalTitle} A FOLIO #${obj.folio} - ${obj.name} ${obj.paternal_last_name} ${obj.maternal_last_name}`}
         maxWidth={maxWidth}
         height={"90vh"}
      >
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

            <Grid container>
               <Grid md={8}>
                  <RadioButtonComponent
                     col={12}
                     idName={"paid_to_tutor"}
                     title={"¿Quien recibio el apoyo?"}
                     options={
                        obj.second_ref === "Familiar"
                           ? [
                                { value: true, label: `TUTOR - ${obj.tutor_name} ${obj.tutor_paternal_last_name} ${obj.tutor_maternal_last_name}` },
                                { value: false, label: `${obj.second_ref_relationship} - ${obj.second_ref_fullname}` }
                             ]
                           : [{ value: true, label: `TUTOR - ${obj.tutor_name} ${obj.tutor_paternal_last_name} ${obj.tutor_maternal_last_name}` }]
                     }
                     handleGetValue={handleChangePaidTo}
                     alignItems="start"
                  />
                  <Grid container md={12}>
                     <InputComponent
                        col={2.5}
                        idName={"amount_paid"}
                        label={"Monto *"}
                        placeholder={"$999.99"}
                        type={"number"}
                        icon={<MonetizationOn />}
                        handleChangeExtra={handleChangeAmountPaid}
                     />
                     <Typography color={"GrayText"} sx={{ display: "flex", alignItems: "center", fontStyle: "italic", fontWeight: "bolder" }}>
                        {textValue}
                     </Typography>
                  </Grid>
                  <FileInputComponent
                     col={10}
                     idName="img_evidence"
                     label="Evidencia del pago *"
                     filePreviews={imgEvidence}
                     setFilePreviews={setImgEvidence}
                     multiple={false}
                     accept={"image/*"}
                     fileSizeMax={5}
                  />
                  {/* MODIFICAR (handleModify) ---> setObjImg(formData.img_evidence, setImgEvidence); */}
                  <InputComponent
                     col={10}
                     idName={"paid_feedback"}
                     label={"Comentarios (opcional)"}
                     placeholder={"Escriba comentarios u observaciones si existen..."}
                     textStyleCase={null}
                     rows={5}
                  />
               </Grid>
               <Grid md={4} sx={{ overflowY: "auto", height: "64vh" }}>
                  <Typography textAlign={"center"} fontWeight={"bolder"} variant="h4" mb={2}>
                     INE DE LA PERSONA SELECCIONADA A RECOGER EL APOYO
                  </Typography>
                  <ImageZoomComponent imgUrl={imgIneShown} imgName={"INE Frontal"} left={"13%"} />
                  <ImageZoomComponent imgUrl={imgIneBackShown} imgName={"INE Trasera"} left={"13%"} />
               </Grid>
            </Grid>
         </FormikComponent>
      </ModalComponent>
   );
}

export default ModalPayment;
