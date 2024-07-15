import * as Yup from "yup";

import { useEffect, useRef, useState } from "react";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import Toast from "../../../utils/Toast";
import { FormikComponent, InputComponent } from "../../../components/Form/FormikComponents";

const initialValues = {
   id: 0,
   folio: 0,
   rejected_feedback: ""
};

function ModalPayment({ folio, open, setOpen, statusCurrent, modalTitle, maxWidth }) {
   const { setLoadingAction } = useGlobalContext();
   const { updateStatusBeca } = useRequestBecaContext();

   const formikRef = useRef();
   const [formData, setFormData] = useState(initialValues);

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
      setFormData(initialValues);
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
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
      } finally {
         setSubmitting(false);
      }
   };

   const validationSchema = Yup.object().shape({
      rejected_feedback: Yup.string().trim().required("Retroalimentación del Rechazo requerido")
   });

   useEffect(() => {
      setFormData({ ...formData, folio: folio });
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
            
            <InputComponent col={6} idName={"beca_paid_id"} label={"# Folio"} placeholder={"0"} textStyleCase={true} />

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
