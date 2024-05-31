import { LoadingButton } from "@mui/lab";
/// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Button, Grid } from "@mui/material";
import { Formik } from "formik";
import { useEffect } from "react";
export const FormikComponent = ({ initialValues = {}, validationSchema = {}, onSubmit, children, textBtnSubmit, formikRef = null, handleCancel }) => {
   useEffect(() => {
      console.log("useEffect del FormikComponent");
   }, []);

   return (
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} innerRef={formikRef}>
         {({ handleSubmit, isSubmitting, resetForm }) => (
            <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
               <Grid item xs={12} width={"100%"} spacing={2} height={"79vh"} MaxHeight={"79vh"} overflow={"auto"}>
                  <Grid item xs={12} container spacing={2}>
                     {children}
                  </Grid>
               </Grid>
               <LoadingButton
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  // loadingPosition="start"
                  variant="contained"
                  fullWidth
                  size="large"
               >
                  {textBtnSubmit}
               </LoadingButton>
               {/* <ButtonGroup variant="outlined" fullWidth> */}
               <Button type="reset" variant="outlined" color="error" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleCancel(resetForm)}>
                  CANCELAR
               </Button>
               {/* </ButtonGroup> */}
            </Grid>
         )}
      </Formik>
   );
};
