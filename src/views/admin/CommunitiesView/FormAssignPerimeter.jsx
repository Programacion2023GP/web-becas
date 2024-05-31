import { Field, Formik } from "formik";
import * as Yup from "yup";

/// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Grid,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   FormControlLabel,
   FormLabel,
   InputLabel,
   MenuItem,
   Radio,
   RadioGroup,
   Select,
   Switch,
   TextField,
   Toolbar,
   Typography,
   Tooltip,
   IconButton
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useMemo, useState } from "react";
import { useCommunityContext } from "../../../context/CommunityContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import { handleInputFormik } from "../../../utils/Formats";
import { usePerimeterContext } from "../../../context/PerimeterContext";
// import InputComponent from "../Form/InputComponent";
import { IconX } from "@tabler/icons-react";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const CommunityFormAssignPerimeter = ({ openDialog, setOpenDialog }) => {
   const { setLoadingAction } = useGlobalContext();
   const {
      singularName,
      community,
      communities,
      createCommunity,
      updateCommunity,
      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      assignPerimeterToCommunity
   } = useCommunityContext();

   const { perimeters, getPerimetersSelectIndex } = usePerimeterContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const handleChangeCheckAdd = (e) => {
      try {
         const active = e.target.checked;
         localStorage.setItem("checkAdd", active);
         setCheckAdd(active);
         setColorLabelcheck("");
         if (!active) setColorLabelcheck("#ccc");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // values.id = community_id;
         // return console.log("values", values);
         setLoadingAction(true);
         let axiosResponse = await assignPerimeterToCommunity(values.perimeter_id, values.id);
         resetForm();
         resetFormData();
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd) setOpenDialog(false);
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

   const handleReset = (resetForm, setFieldValue, id) => {
      try {
         resetForm();
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = (setValues, setFieldValue) => {
      try {
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
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      perimeter_id: Yup.number().min(1, "Ésta opción no es valida").required("Perímetro requerido"),
      perimeter: Yup.string().trim().required("Perímetro requerido")
   });

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <Dialog fullWidth maxWidth={"sm"} open={openDialog} onClose={() => setOpenDialog(false)}>
         {/* <DialogTitle> */}
         <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
               {community && `Asignar Perimetro a ${community.name}`}
            </Typography>
            <Tooltip title={`Cerrar ventana`} placement="top">
               <IconButton edge="end" color="inherit" onClick={() => setOpenDialog(false)} aria-label="close">
                  <IconX />
               </IconButton>
            </Tooltip>
         </Toolbar>
         {/* </DialogTitle> */}
         <DialogContent sx={{ paddingBlock: 10, paddingInline: 5 }}>
            {/* <DialogContentText>You can set my maximum width and whether to adapt or not.</DialogContentText> */}

            {/* Perímetro */}
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit} flexDirection={"row-reverse"}>
                     <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} />
                     <Grid item xs={12} md={12} sx={{ mb: 1 }}>
                        <Select2Component
                           idName={"perimeter_id"}
                           label={"Perímetro *"}
                           valueLabel={values.perimeter}
                           formDataLabel={"perimeter"}
                           placeholder={"Selecciona una opción..."}
                           options={perimeters}
                           fullWidth={true}
                           // handleChangeValueSuccess={handleChangeLevel}
                           handleBlur={handleBlur}
                           error={errors.perimeter_id}
                           touched={touched.perimeter_id}
                           disabled={false}
                           pluralName={"Perímetros"}
                           refreshSelect={getPerimetersSelectIndex}
                        />
                     </Grid>
                     <Grid>
                        <DialogActions>
                           <Button type="submit" disabled={isSubmitting} onClick={() => Toast.Success("Guardado")}>
                              Asignar
                           </Button>
                           <Button type="button" color="info" fullWidth id="btnModify" sx={{ mt: 1, display: "none" }} onClick={() => handleModify(setValues)}>
                              setValues
                           </Button>
                        </DialogActions>
                     </Grid>
                  </Grid>
               )}
            </Formik>
         </DialogContent>
      </Dialog>
   );
};
export default CommunityFormAssignPerimeter;
