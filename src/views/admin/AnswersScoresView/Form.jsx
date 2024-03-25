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
   Tooltip,
   Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SwipeableDrawer } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { Fragment, cloneElement, useMemo, useState } from "react";
import { useAnswerScoreContext } from "../../../context/AnswerScoreContext";
import { Box } from "@mui/system";
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
import { useTheme } from "@mui/material/styles";
import PropTypes, { number } from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { IconArrowsHorizontal, IconEqual } from "@tabler/icons";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`full-width-tabpanel-${index}`}
         aria-labelledby={`full-width-tab-${index}`}
         {...other}
         style={{ borderRadius: 100 }}
      >
         {value === index && (
            <Box sx={{ p: 3, maxHeight: "73vh", overflowY: "auto" }} component={"div"}>
               {children}
            </Box>
         )}
      </div>
   );
}

TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.number.isRequired,
   value: PropTypes.number.isRequired
};

function a11yProps(index) {
   return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`
   };
}

const styleContentScores = { width: "100%", display: "flex", overflowX: "auto", pt: 2, px: 2, borderRadius: "0  0 5px 5px" };

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

   // #region COMPONENTES
   const ItemContainer = ({
      question = "¿La pregunta?",
      optionsByRange = false,
      options = [{ idName: "or1", label: "opcion 1", type: "number", placeholder: "0" }],
      optionsRange = [{ idName: "op1" }],
      values,
      handleBlur,
      handleChange,
      errors,
      touched,
      resetForm,
      setFieldValue,
      setValues
   }) => {
      const styleTitle = { backgroundColor: "#E9ECEF", pl: 1, borderRadius: "5px 5px 0  0" };
      const styleContent = { width: "100%", display: "flex", overflowX: "auto", p: 2, mb: 2, backgroundColor: "#E9ECEF", borderRadius: "0  0 5px 5px" };
      const widthInput = "75px";

      return (
         <>
            <Grid container spacing={2} display={"flex"} alignItems={"center"}>
               {/* <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} /> */}
               <ListItemText
                  component={"div"}
                  primary={
                     <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} py={1} sx={styleTitle}>
                        <Typography variant="h4" component={"b"}>
                           {question}
                        </Typography>
                     </Box>
                  }
                  secondary={
                     <>
                        {optionsByRange ? (
                           <Box key={`div_question_${question}}`} sx={styleContent} component={"div"}>
                              {optionsRange.map((or, index) => {
                                 // console.log(or);
                                 return (
                                    <>
                                       <Box
                                          key={`div_question_multiple_${index}}`}
                                          component={"div"}
                                          sx={{
                                             width: `${100 / optionsRange.length}%`,
                                             my: 3,
                                             mx: 2,
                                             display: "flex",
                                             alignItems: "center",
                                             justifyContent: "center"
                                          }}
                                       >
                                          <InputComponentv3
                                             key={`${or.idName}_min`}
                                             idName={`${or.idName}_min`}
                                             label={""}
                                             type="number"
                                             value={values[`${or.idName}_min`]}
                                             placeholder={"0"}
                                             setFieldValue={setFieldValue}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors[`${or.idName}_min`]}
                                             touched={touched[`${or.idName}_min`]}
                                             fullWidth={false}
                                             sx={{ width: widthInput, minWidth: widthInput }}
                                          />
                                          <IconArrowsHorizontal
                                             key={`${or.idName}_iconArrow`}
                                             style={{ marginLeft: 5, marginRight: 15, marginTop: 4, minWidth: 25 }}
                                          />
                                          <InputComponentv3
                                             key={`${or.idName}_max`}
                                             idName={`${or.idName}_max`}
                                             label={""}
                                             type="number"
                                             value={values[`${or.idName}_max`]}
                                             placeholder={"0"}
                                             setFieldValue={setFieldValue}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors[`${or.idName}_max`]}
                                             touched={touched[`${or.idName}_max`]}
                                             fullWidth={false}
                                             sx={{ width: widthInput, minWidth: widthInput }}
                                          />
                                          <IconEqual style={{ marginLeft: 5, marginRight: 15, marginTop: 4 }} />
                                          <InputComponentv3
                                             key={`${or.idName}`}
                                             idName={`${or.idName}`}
                                             label={"pts."}
                                             type="number"
                                             value={values[`${or.idName}`]}
                                             placeholder={"0"}
                                             setFieldValue={setFieldValue}
                                             onChange={(e) => {
                                                handleChange(e);
                                                handleChangePts(e, values, setFieldValue);
                                             }}
                                             onBlur={handleBlur}
                                             error={errors[`${or.idName}`]}
                                             touched={touched[`${or.idName}`]}
                                             fullWidth={false}
                                             sx={{ width: widthInput, minWidth: widthInput }}
                                          />
                                       </Box>
                                       {index + 1 < optionsRange.length && (
                                          <Divider orientation="vertical" sx={{ mr: 2, border: "1px solid", height: 75, alignSelf: "center" }} />
                                       )}
                                    </>
                                 );
                              })}
                           </Box>
                        ) : (
                           <Box key={`div_question_${question}}`} sx={styleContent} component={"div"}>
                              {options.map((op, index) => (
                                 <>
                                    <Box
                                       key={`div_question_${index}}`}
                                       sx={{ width: `${100 / options.length}%`, my: 3, mx: 2, display: "flex", alignItems: "center", justifyContent: "center" }}
                                       component={"div"}
                                    >
                                       <InputComponentv3
                                          key={`${op.idName}`}
                                          idName={`${op.idName}`}
                                          label={`pts. - ${op.label}`}
                                          type={op.type}
                                          value={values[`${op.idName}`]}
                                          placeholder={"0"}
                                          setFieldValue={setFieldValue}
                                          onChange={(e) => {
                                             handleChange(e);
                                             handleChangePts(e, values, setFieldValue);
                                          }}
                                          onBlur={handleBlur}
                                          error={errors[`${op.idName}`]}
                                          touched={touched[`${op.idName}`]}
                                          fullWidth={false}
                                          sx={{ width: "50px", minWidth: "50px" }}
                                       />
                                    </Box>
                                    {index + 1 < options.length && (
                                       <Divider orientation="vertical" sx={{ mr: 2, border: "1px solid", height: 75, alignSelf: "center" }} />
                                    )}
                                 </>
                              ))}
                           </Box>
                        )}
                     </>
                  }
               />
            </Grid>
            <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
         </>
      );
   };
   const ListFamilies = ({ values, handleBlur, handleChange, errors, touched, resetForm, setFieldValue, setValues }) => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="Cantidad de miembros en la casa"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "family_1_1"
                     },
                     {
                        idName: "family_1_2"
                     },
                     {
                        idName: "family_1_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
            </DialogContentText>
         </List>
      );
   };
   const ListEconomic = ({ values, handleBlur, handleChange, errors, touched, resetForm, setFieldValue, setValues }) => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="Ingresos totales menusales"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "economic_1_1"
                     },
                     {
                        idName: "economic_1_2"
                     },
                     {
                        idName: "economic_1_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Egresos totales menusales"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "economic_2_1"
                     },
                     {
                        idName: "economic_2_2"
                     },
                     {
                        idName: "economic_2_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
            </DialogContentText>
         </List>
      );
   };
   const ListHouse = ({ values, handleBlur, handleChange, errors, touched, resetForm, setFieldValue, setValues }) => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="La casa donde vives es:"
                  optionsByRange={false}
                  options={[
                     { idName: "house_1_1", label: "Propia", type: "number", placeholder: "0" },
                     { idName: "house_1_2", label: "Prestada", type: "number", placeholder: "0" },
                     { idName: "house_1_3", label: "Alquilada", type: "number", placeholder: "0" },
                     { idName: "house_1_4", label: "Otra", type: "number", placeholder: "0" }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Material del techo de la vivienda (si está hecho de más de un material, marca el que predomine):"
                  optionsByRange={false}
                  options={[
                     { idName: "house_2_1", label: "Lámina (de cartón, de asbesto, madera)", type: "number", placeholder: "0" },
                     { idName: "house_2_2", label: "Firme de concreto", type: "number", placeholder: "0" }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Material del piso de la vivienda (si está hecho de más de un material, marca el que predomine):"
                  optionsByRange={false}
                  options={[
                     { idName: "house_3_1", label: "Tierra", type: "number", placeholder: "0" },
                     { idName: "house_3_2", label: "Cemento", type: "number", placeholder: "0" },
                     { idName: "house_3_3", label: "Mosaico, loseta, madera Láminada", type: "number", placeholder: "0" }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
            </DialogContentText>
         </List>
      );
   };
   const ListHouseholdEquipment = ({ values, handleBlur, handleChange, errors, touched, resetForm, setFieldValue, setValues }) => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="Camas"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_1_1"
                     },
                     {
                        idName: "household_equipment_1_2"
                     },
                     {
                        idName: "household_equipment_1_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Lavadoras"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_2_1"
                     },
                     {
                        idName: "household_equipment_2_2"
                     },
                     {
                        idName: "household_equipment_2_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Calentador de agua (boiler)"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_3_1"
                     },
                     {
                        idName: "household_equipment_3_2"
                     },
                     {
                        idName: "household_equipment_3_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Televisores"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_4_1"
                     },
                     {
                        idName: "household_equipment_4_2"
                     },
                     {
                        idName: "household_equipment_4_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Computadoras"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_5_1"
                     },
                     {
                        idName: "household_equipment_5_2"
                     },
                     {
                        idName: "household_equipment_5_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Teléfonos (local o celular)"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_6_1"
                     },
                     {
                        idName: "household_equipment_6_2"
                     },
                     {
                        idName: "household_equipment_6_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Reproductores de Música"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_7_1"
                     },
                     {
                        idName: "household_equipment_7_2"
                     },
                     {
                        idName: "household_equipment_7_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Estufas"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_8_1"
                     },
                     {
                        idName: "household_equipment_8_2"
                     },
                     {
                        idName: "household_equipment_8_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <ItemContainer
                  question="Refrigeradores"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        idName: "household_equipment_9_1"
                     },
                     {
                        idName: "household_equipment_9_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_9_3"
                     }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
               <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
               <ItemContainer
                  question="Ponderar Servicios:"
                  optionsByRange={false}
                  options={[
                     { idName: "service_1", label: "Agua Potable", type: "number", placeholder: "0", score: 0 },
                     { idName: "service_2", label: "Luz Eléctrica", type: "number", placeholder: "0", score: 0 },
                     { idName: "service_3", label: "Drenaje", type: "number", placeholder: "0", score: 0 },
                     { idName: "service_4", label: "Pavimento", type: "number", placeholder: "0", score: 0 },
                     { idName: "service_5", label: "Automóvil", type: "number", placeholder: "0", score: 0 },
                     { idName: "service_6", label: "Línea Telefónica", type: "number", placeholder: "0", score: 0 },
                     { idName: "service_7", label: "Internet", type: "number", placeholder: "0", score: 0 }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
            </DialogContentText>
         </List>
      );
   };
   const ListBecas = ({ values, handleBlur, handleChange, errors, touched, resetForm, setFieldValue, setValues }) => {
      return (
         <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <DialogContentText id="alert-dialog-slide-description" component={"div"}>
               <ItemContainer
                  question="¿Algún familiar cuenta con alguna otra beca?"
                  optionsByRange={false}
                  options={[
                     { idName: "scholarship_1", label: "Beca de Transporte", type: "number", placeholder: "0" },
                     { idName: "scholarship_2", label: "Beca para el Bienestar Benito Juárez ", type: "number", placeholder: "0" },
                     { idName: "scholarship_3", label: "Beca Jóvenes Construyendo el Futuro", type: "number", placeholder: "0" },
                     { idName: "scholarship_4", label: "Otra", type: "number", placeholder: "0" }
                  ]}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  errors={errors}
                  touched={touched}
                  resetForm={resetForm}
                  setFieldValue={setFieldValue}
                  setValues={setValues}
               />
            </DialogContentText>
         </List>
      );
   };

   const TabsTitles = ["DATOS FAMILIARES", "DATOS ECONÓMICOS", "DATOS DE VIVIENDA", "EQUIPAMIENTO DOMÉSTICO", "PROGRAMA DE BECAS"];
   const TabsContainers = [<ListFamilies />, <ListEconomic />, <ListHouse />, <ListHouseholdEquipment />, <ListBecas />];
   //#endregion COMPONENTES

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

   const handleChangePts = (e, values, setFieldValue) => {
      // const value = e.target.value;
      // values.family_1_1
      // setFieldValue("total_score");
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         if (textBtnSubmit == "NUEVA") values.id = 0;

         // console.log("onSubmit -> values", values);
         setLoadingAction(false);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createAnswerScore(values);
         else axiosResponse = await updateAnswerScore(values);
         // console.log(axiosResponse);
         if (axiosResponse.status_code === 200) {
            values.id = axiosResponse.result.id;
            // resetForm();
            // resetFormData();
            // setTextBtnSumbit("AGREGAR");
            // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         }
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // if (!checkAdd) setOpenDialog(false);
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
      family_1_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      family_1_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      family_1_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      family_1_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      family_1_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      family_1_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      family_1_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      family_1_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      family_1_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),

      economic_1_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      economic_1_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      economic_1_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      economic_1_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      economic_1_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      economic_1_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      economic_1_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      economic_1_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      economic_1_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      economic_2_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      economic_2_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      economic_2_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      economic_2_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      economic_2_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      economic_2_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      economic_2_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      economic_2_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      economic_2_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),

      house_1_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      house_1_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      house_1_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      house_1_4: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      house_2_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      house_2_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      house_3_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      house_3_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      house_3_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),

      household_equipment_1_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_1_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_1_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_1_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_1_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_1_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_1_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_1_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_1_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_2_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_2_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_2_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_2_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_2_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_2_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_2_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_2_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_2_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_3_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_3_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_3_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_3_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_3_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_3_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_3_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_3_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_3_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_4_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_4_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_4_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_4_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_4_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_4_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_4_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_4_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_4_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_5_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_5_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_5_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_5_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_5_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_5_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_5_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_5_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_5_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_6_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_6_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_6_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_6_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_6_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_6_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_6_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_6_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_6_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_7_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_7_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_7_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_7_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_7_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_7_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_7_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_7_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_7_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_8_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_8_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_8_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_8_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_8_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_8_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_8_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_8_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_8_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_9_1_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_9_1_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_9_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_9_2_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_9_2_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_9_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      household_equipment_9_3_min: Yup.number().min(0, "Éste valor no es valido").required("Valor Mínimo requerido"),
      household_equipment_9_3_max: Yup.number().min(0, "Éste valor no es valido").required("Valor Máximo requerido"),
      household_equipment_9_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),

      service_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      service_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      service_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      service_4: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      service_5: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      service_6: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      service_7: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),

      scholarship_1: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      scholarship_2: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      scholarship_3: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido"),
      scholarship_4: Yup.number().min(0, "Éste valor no es valido").required("Ponderación requerido")
   });

   const handleChangeContinue = (values) => {
      console.log("SliderValues", values);
      setValues1(values);
      console.log("values1", values1);
   };

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   const theme = useTheme();
   const [tabValue, setTabValue] = useState(0);

   const handleChangeTab = (event, newValue) => {
      setTabValue(newValue);
   };

   return (
      <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
            <Box sx={{ bgcolor: "background.paper", width: "100%" }} component={"form"} onSubmit={handleSubmit}>
               <AppBar position="static">
                  <Tabs
                     value={tabValue}
                     onChange={handleChangeTab}
                     sx={{ backgroundColor: "green" }}
                     indicatorColor="secondary"
                     textColor="inherit"
                     variant="fullWidth"
                     aria-label="full width tabs example"
                  >
                     {TabsTitles.map((title, index) => (
                        <Tab key={`title_${index}`} label={title} {...a11yProps(index)} />
                     ))}
                     <ButtonGroup variant="outlined" sx={{ width: "auto" }}>
                        <Tooltip title="GUARDAR CONFIGURACIÓN" placement="top">
                           <LoadingButton
                              type="submit"
                              disabled={isSubmitting}
                              loading={isSubmitting}
                              // loadingPosition="start"
                              variant="contained"
                              fullWidth={false}
                              sx={{ width: "auto" }}
                              size="large"
                              onClick={() => setTextBtnSumbit("GUARDAR")}
                           >
                              {"GUARDAR"}
                           </LoadingButton>
                        </Tooltip>
                        <Tooltip title="NUEVA CONFIGURACIÓN" placement="top">
                           <LoadingButton
                              type="submit"
                              disabled={isSubmitting}
                              loading={isSubmitting}
                              // loadingPosition="start"
                              variant="contained"
                              fullWidth={false}
                              sx={{ width: "auto" }}
                              size="large"
                              color="warning"
                              onClick={() => setTextBtnSumbit("NUEVA")}
                           >
                              {"NUEVA"}
                           </LoadingButton>
                        </Tooltip>
                     </ButtonGroup>

                     <Button type="button" color="info" fullWidth id="btnModify" sx={{ mt: 1, display: "none" }} onClick={() => handleModify(setValues)}>
                        setValues
                     </Button>
                  </Tabs>
               </AppBar>
               <Typography mt={1} textAlign={"center"} variant="h5">
                  Puntajes mínimos para estudios socio-economicos...
               </Typography>
               <Box key={`div_scores}`} sx={styleContentScores} component={"div"}>
                  <Box
                     key={`div_score_low}`}
                     sx={{
                        width: `${100 / 3}%`,
                        mx: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                     }}
                     component={"div"}
                  >
                     <InputComponentv3
                        key={`low_score`}
                        idName={`low_score`}
                        label={`BAJO`}
                        type={number}
                        value={values[`low_score`]}
                        placeholder={"0"}
                        setFieldValue={setFieldValue}
                        onChange={(e) => {
                           handleChange(e);
                           // handleChangePts(e, values, setFieldValue);
                        }}
                        onBlur={handleBlur}
                        error={errors[`low_score`]}
                        touched={touched[`low_score`]}
                        fullWidth={false}
                        sx={{ width: "50px", minWidth: "50px" }}
                     />
                  </Box>
                  <Box
                     key={`div_score_medium_low}`}
                     sx={{
                        width: `${100 / 3}%`,
                        mx: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                     }}
                     component={"div"}
                  >
                     <InputComponentv3
                        key={`medium_low_score`}
                        idName={`medium_low_score`}
                        label={`MEDIO-BAJO`}
                        type={number}
                        value={values[`medium_low_score`]}
                        placeholder={"0"}
                        setFieldValue={setFieldValue}
                        onChange={(e) => {
                           handleChange(e);
                           // handleChangePts(e, values, setFieldValue);
                        }}
                        onBlur={handleBlur}
                        error={errors[`medium_low_score`]}
                        touched={touched[`medium_low_score`]}
                        fullWidth={false}
                        sx={{ width: "50px", minWidth: "50px" }}
                     />
                  </Box>
                  <Box
                     key={`div_score_medium}`}
                     sx={{
                        width: `${100 / 3}%`,
                        mx: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                     }}
                     component={"div"}
                  >
                     <InputComponentv3
                        key={`medium_score`}
                        idName={`medium_score`}
                        label={`MEDIO`}
                        type={number}
                        value={values[`medium_score`]}
                        placeholder={"0"}
                        setFieldValue={setFieldValue}
                        onChange={(e) => {
                           handleChange(e);
                           // handleChangePts(e, values, setFieldValue);
                        }}
                        onBlur={handleBlur}
                        error={errors[`medium_score`]}
                        touched={touched[`medium_score`]}
                        fullWidth={false}
                        sx={{ width: "50px", minWidth: "50px" }}
                     />
                  </Box>
               </Box>
               {/* <Typography variant="h3" align={"end"} mr={3} mt={2} mb={1}>
                  Puntaje Acumulado: {values.total_score ?? 0}
               </Typography> */}
               {TabsContainers.map((content, index) => (
                  <TabPanel key={`container_${index}`} value={tabValue} index={index} dir={theme.direction}>
                     {cloneElement(content, { values, handleBlur, handleChange, errors, touched, resetForm, setFieldValue, setValues })}
                  </TabPanel>
               ))}
            </Box>
         )}
      </Formik>
   );
};
export default AnswerScoreForm;
