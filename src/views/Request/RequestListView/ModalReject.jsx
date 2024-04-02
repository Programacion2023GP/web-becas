import { Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import { ModalComponent } from "../../../components/ModalComponent";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { formatDatetimeToSQL } from "../../../utils/Formats";
import Toast from "../../../utils/Toast";

function ModalReject({ folio, open, setOpen, statusCurrent }) {
   const { setLoadingAction } = useGlobalContext();
   const { updateStatusBeca } = useRequestBecaContext();

   const formikRef = useRef();
   const [formData, setFormData] = useState({
      // folio: folio,
      rejected_feedback: "",
      rejected_at: ""
   });

   const resetFormData = () => {
      formData.rejected_feedback = "";
      formData.rejected_at = "";
      setFormData({
         // folio: 0,
         rejected_feedback: "",
         rejected_at: ""
      });
      console.log("limpiao");
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         values.rejected_at = formatDatetimeToSQL(new Date());
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

   const validationSchema = Yup.object().shape({
      rejected_feedback: Yup.string().trim().required("Retroalimentación del Rechazo requerido")
   });

   useEffect(() => {
      // console.log("ModalReject");
   }, []);

   return (
      <ModalComponent open={open} setOpen={setOpen} modalTitle="RECHAZAR SOLICITUD" maxWidth="sm">
         <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit} innerRef={formikRef}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
               <Grid container spacing={2} component={"form"} onSubmit={handleSubmit} mx={1} my={1}>
                  {/* Retroalimentación del Rechazo */}
                  <Grid xs={12} md={12} sx={{ mb: 0 }}>
                     <TextField
                        id="rejected_feedback"
                        name="rejected_feedback"
                        label="Retroalimentación del Rechazo *"
                        type="text"
                        value={values.rejected_feedback}
                        placeholder="Se rechazo porque..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        // onInput={(e) => handleInputFormik(e, setFieldValue, "rejected_feedback", true)}
                        multiline
                        rows={3}
                        fullWidth
                        error={errors.rejected_feedback && touched.rejected_feedback}
                        helperText={errors.rejected_feedback && touched.rejected_feedback && errors.rejected_feedback}
                     />
                  </Grid>

                  <LoadingButton
                     type="submit"
                     disabled={isSubmitting}
                     loading={isSubmitting}
                     // loadingPosition="start"
                     variant="text"
                     size="large"
                  >
                     ACEPTAR
                  </LoadingButton>
               </Grid>
            )}
         </Formik>
      </ModalComponent>
   );
}

export default ModalReject;
