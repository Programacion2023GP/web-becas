import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Button,
   DialogContentText,
   Divider,
   FormControlLabel,
   FormLabel,
   InputLabel,
   List,
   ListItemText,
   MenuItem,
   Radio,
   RadioGroup,
   Select,
   Switch,
   TextField,
   Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Fragment, useMemo, useState } from "react";
import { useAnswerScoreContext } from "../../../context/AnswerScoreContext";
import { Box, width } from "@mui/system";
import { useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { handleInputFormik } from "../../../utils/Formats";
import TabsComponent from "../../../components/TabsComponent";
import { SliderWithScoreComponent } from "../../../components/SliderComponent";
import { InputComponentv3 } from "../../../components/Form/InputComponent2";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const AnswerScoreForm = () => {
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const {
      singularName,
      answerScores,
      createAnswerScore,
      updateAnswerScore,
      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle
   } = useAnswerScoreContext();
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
         // return console.log("values", values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createAnswerScore(values);
         else axiosResponse = await updateAnswerScore(values);
         resetForm();
         resetFormData();
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
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
         if (formData.description) formData.description == null && (formData.description = "");
         setValues(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         console.log("handleCancel");
         resetForm();
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      answerScore: Yup.string().trim().required("Nivel requerido")
   });

   const [values1, setValues1] = useState([0, 10]);

   const handleChangeContinue = (values) => {
      console.log("values", values);
      setValues1(values);
      console.log("values1", values1);
   };

   const ItemContainer = ({
      question = "¿La pregunta?",
      optionsByRange = false,
      options = [{ score: 0, label: "opcion 1", type: "number", placeholder: "0", idName: "or1" }],
      optionsRange = [{ width: 300, min: 1, max: 20, defaultValue: [1, 5], values: [1, 5], handleChangeContinue: handleChangeContinue, idName: "op1" }]
   }) => {
      return (
         <>
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                  <Grid container spacing={2} component={"form"} onSubmit={handleSubmit} display={"flex"} alignItems={"center"}>
                     {/* <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} /> */}
                     <ListItemText
                        primary={
                           <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} mb={1} mt={1}>
                              <Typography variant="h4" component={"b"}>
                                 {question}
                              </Typography>
                              <ButtonGroup>
                                 <LoadingButton
                                    type="submit"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    // loadingPosition="start"
                                    variant="contained"
                                    // fullWidth
                                    size="small"
                                 >
                                    {textBtnSubmit}
                                 </LoadingButton>
                                 <Button type="reset" variant="outlined" color="error" size="small" onClick={() => handleCancel(resetForm)}>
                                    CANCELAR
                                 </Button>
                              </ButtonGroup>
                              <Button
                                 type="button"
                                 color="info"
                                 fullWidth
                                 id={`btnModify_${question}`}
                                 sx={{ mt: 1, display: "none" }}
                                 onClick={() => handleModify(setValues)}
                              >
                                 setValues
                              </Button>
                           </Box>
                        }
                        secondary={
                           <Fragment>
                              {optionsByRange ? (
                                 <Box sx={{ width: "100%", display: "flex", overflowX: "auto", mb: 2 }}>
                                    {optionsRange.map((or, index) => (
                                       <SliderWithScoreComponent
                                          key={index}
                                          width={`${100 / optionsRange.length}%`}
                                          min={or.min}
                                          max={or.max}
                                          defaultValue={or.defaultValue}
                                          values={or.values}
                                          handleChangeContinue={or.handleChangeContinue}
                                          idName={or.idName}
                                          valueInput={values[or.idName]}
                                          setFieldValue={setFieldValue}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={errors[or.idName]}
                                          touched={touched[or.idName]}
                                       />
                                    ))}
                                 </Box>
                              ) : (
                                 <Box sx={{ width: "100%", display: "flex", overflowX: "auto", mb: 5 }}>
                                    {options.map((op, index) => (
                                       <>
                                          <InputComponentv3
                                             key={index}
                                             idName={op.idName}
                                             label={op.label}
                                             type={op.type}
                                             value={op.score}
                                             placeholder="0"
                                             setFieldValue={setFieldValue}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors[op.idName]}
                                             touched={touched[op.idName]}
                                             inputProps={{ min: 0, max: 100 }}
                                             // disabled={values.id == 0 ? false : true}
                                             // setStepFailed={{}}
                                             // step={7}
                                             size="normal"
                                             // error={errors.b5_beds && touched.b5_beds}
                                             // helperText={errors.b5_beds && touched.b5_beds && showErrorInput(4, errors.b5_beds)}
                                          />
                                          <Divider orientation="vertical" sx={{ mx: 1 }} />
                                       </>
                                    ))}
                                 </Box>
                              )}
                           </Fragment>
                        }
                     />
                  </Grid>
               )}
            </Formik>
            <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
         </>
      );
   };
   const ListFamilies = () => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="Cantidad de miembros en la casa"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 20, defaultValue: [1, 7], values: [1, 7], handleChangeContinue: handleChangeContinue, idName: "familia_1_op1" },
                     { width: 300, min: 1, max: 20, defaultValue: [8, 14], values: [8, 14], handleChangeContinue: handleChangeContinue, idName: "familia_1_op2" },
                     { width: 300, min: 1, max: 20, defaultValue: [15, 20], values: [15, 20], handleChangeContinue: handleChangeContinue, idName: "familia_1_op3" }
                  ]}
               />
            </DialogContentText>
         </List>
      );
   };
   const ListEconomic = () => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="Ingresos totales menusales"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [1000, 4500],
                        values: [1000, 4500],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economia_1_op1"
                     },
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [4501, 7500],
                        values: [4501, 7500],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economia_1_op2"
                     },
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [7501, 10000],
                        values: [7501, 10000],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economia_1_op3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Egresos totales menusales"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [1000, 4500],
                        values: [1000, 4500],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economia_2_op1"
                     },
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [4501, 7500],
                        values: [4501, 7500],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economia_2_op2"
                     },
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [7501, 10000],
                        values: [7501, 10000],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economia_2_op3"
                     }
                  ]}
               />
            </DialogContentText>
         </List>
      );
   };
   const ListHouse = () => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="La casa donde vives es:"
                  optionsByRange={false}
                  options={[
                     { score: 0, label: "Propia", type: "number", placeholder: "0", idName: "vivienda_1_1" },
                     { score: 0, label: "Prestada", type: "number", placeholder: "0", idName: "vivienda_1_2" },
                     { score: 0, label: "Alquilada", type: "number", placeholder: "0", idName: "vivienda_1_3" },
                     { score: 0, label: "Otra", type: "number", placeholder: "0", idName: "vivienda_1_4" }
                  ]}
               />
               <ItemContainer
                  question="Material del techo de la vivienda (si está hecho de más de un material, marca el que predomine):"
                  optionsByRange={false}
                  options={[
                     { score: 0, label: "Lamina (de cartón, de asbesto, madera)", type: "number", placeholder: "0", idName: "vivienda_2_1" },
                     { score: 0, label: "Firme de concreto", type: "number", placeholder: "0", idName: "vivienda_2_2" }
                  ]}
               />
               <ItemContainer
                  question="Material del piso de la vivienda (si está hecho de más de un material, marca el que predomine):"
                  optionsByRange={false}
                  options={[
                     { score: 0, label: "Tierra", type: "number", placeholder: "0", idName: "vivienda_3_1" },
                     { score: 0, label: "Cemento", type: "number", placeholder: "0", idName: "vivienda_3_2" },
                     { score: 0, label: "Mosaico, loseta, madera laminada", type: "number", placeholder: "0", idName: "vivienda_3_3" }
                  ]}
               />
            </DialogContentText>
         </List>
      );
   };
   const ListHouseholdEquipment = () => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="Camas"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_1_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_1_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_1_op3" }
                  ]}
               />
               <ItemContainer
                  question="Lavadoras"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_2_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_2_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_2_op3" }
                  ]}
               />
               <ItemContainer
                  question="Calentador de agua (boiler)"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_3_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_3_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_3_op3" }
                  ]}
               />
               <ItemContainer
                  question="Televisores"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_4_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_4_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_4_op3" }
                  ]}
               />
               <ItemContainer
                  question="Computadoras"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_5_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_5_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_5_op3" }
                  ]}
               />
               <ItemContainer
                  question="Teléfonos (local o celular)"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_6_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_6_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_6_op3" }
                  ]}
               />
               <ItemContainer
                  question="Reproductores de Música"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_7_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_7_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_7_op3" }
                  ]}
               />
               <ItemContainer
                  question="Estufas"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_8_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_8_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_8_op3" }
                  ]}
               />
               <ItemContainer
                  question="Refrigeradores"
                  optionsByRange={true}
                  optionsRange={[
                     { width: 300, min: 1, max: 10, defaultValue: [1, 3], values: [1, 3], handleChangeContinue: handleChangeContinue, idName: "equipamiento_9_op1" },
                     { width: 300, min: 1, max: 10, defaultValue: [4, 6], values: [4, 6], handleChangeContinue: handleChangeContinue, idName: "equipamiento_9_op2" },
                     { width: 300, min: 1, max: 10, defaultValue: [7, 10], values: [7, 10], handleChangeContinue: handleChangeContinue, idName: "equipamiento_9_op3" }
                  ]}
               />
               <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
               <ItemContainer
                  question="Ponderar Servicios:"
                  optionsByRange={false}
                  options={[
                     { score: 0, label: "Agua Potable", type: "number", placeholder: "0", idName: "servicios_1" },
                     { score: 0, label: "Luz Eléctrica", type: "number", placeholder: "0", idName: "servicios_2" },
                     { score: 0, label: "Drenaje", type: "number", placeholder: "0", idName: "servicios_3" },
                     { score: 0, label: "Pavimento", type: "number", placeholder: "0", idName: "servicios_4" },
                     { score: 0, label: "Automóvil", type: "number", placeholder: "0", idName: "servicios_5" },
                     { score: 0, label: "Línea Telefónica", type: "number", placeholder: "0", idName: "servicios_6" },
                     { score: 0, label: "Internet", type: "number", placeholder: "0", idName: "servicios_7" }
                  ]}
               />
            </DialogContentText>
         </List>
      );
   };
   const ListBecas = () => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="¿Algún familiar cuenta con alguna otra beca?"
                  optionsByRange={false}
                  options={[
                     { score: 0, label: "Beca de Transporte", type: "number", placeholder: "0", idName: "becas_1" },
                     { score: 0, label: "Beca para el Bienestar Benito Juárez ", type: "number", placeholder: "0", idName: "becas_2" },
                     { score: 0, label: "Beca Jóvenes Construyendo el Futuro", type: "number", placeholder: "0", idName: "becas_3" },
                     { score: 0, label: "Otra", type: "number", placeholder: "0", idName: "becas_4" }
                  ]}
               />
            </DialogContentText>
         </List>
      );
   };

   const titles = ["DATOS FAMILIARES", "DATOS ECONÓMICOS", "DATOS DE VIVIENDA", "EQUIPAMIENTO DOMÉSTICO", "PRGRAMA DE BECAS"];
   const containers = [<ListFamilies />, <ListEconomic />, <ListHouse />, <ListHouseholdEquipment />, <ListBecas />];

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return <TabsComponent TabsTitles={titles} TabsContainer={containers} />;
};
export default AnswerScoreForm;
