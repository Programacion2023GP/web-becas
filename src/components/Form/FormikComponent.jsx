import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Box, Button, ButtonGroup, Card, CardContent, Typography } from "@mui/material";
import { Formik } from "formik";
import { useEffect } from "react";

export const FormikComponent = ({ initialValues = {}, validationSchema = {}, onSubmit, children, textBtnSubmit }) => {
   return (
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
         {({ handleSubmit, isSubmitting }) => (
            <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
               <Grid width={"100%"} height={"79vh"} MaxHeight={"79vh"} overflow={"auto"}>
                  {children}
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
               <Button
                  type="reset"
                  variant="outlined"
                  color="error"
                  fullWidth
                  size="large"
                  sx={{ mt: 1 }}
                  // onClick={() => handleCancel(resetForm)}
               >
                  CANCELAR
               </Button>
               {/* </ButtonGroup> */}
            </Grid>
         )}
      </Formik>
   );
};
