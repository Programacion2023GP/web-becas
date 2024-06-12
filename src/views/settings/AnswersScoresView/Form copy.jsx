import { Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   DialogContentText,
   Divider,
   List,
   ListItemText,
   Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Fragment, cloneElement, useState } from "react";
import { useAnswerScoreContext } from "../../../context/AnswerScoreContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { SliderWithScoreComponent } from "../../../components/SliderComponent";
import { InputComponentv3 } from "../../../components/Form/InputComponent2";

// import InputComponent from "../Form/InputComponent";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
         {value === index && (
            <Box sx={{ p: 3 }}>
               <Typography>{children}</Typography>
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
         return console.log("onSubmit -> values", values);
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
      family_1_1: Yup.string().trim().required("Nivel requerido")
   });

   const [values1, setValues1] = useState([0, 10]);

   const handleChangeContinue = (values) => {
      console.log("SliderValues", values);
      setValues1(values);
      console.log("values1", values1);
   };

   const ItemContainer = ({
      question = "¿La pregunta?",
      optionsByRange = false,
      options = [{ score: 0, label: "opcion 1", type: "number", placeholder: "0", idName: "or1" }],
      optionsRange = [{ width: 300, min: 1, max: 20, defaultValue: [1, 5], values: [1, 5], handleChangeContinue: handleChangeContinue, idName: "op1" }],
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
      console.log("ItemContainer->values", values);

      return (
         <>
            {/* <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
               {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => ( */}
            <Grid container spacing={2} display={"flex"} alignItems={"center"}>
               {/* <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} /> */}
               <ListItemText
                  primary={
                     <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} py={1} sx={styleTitle}>
                        <Typography variant="h4" component={"b"}>
                           {question}
                        </Typography>
                        {/* <ButtonGroup>
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
                        </ButtonGroup> */}
                        {/* <Button
                           type="button"
                           color="info"
                           fullWidth
                           id={`btnModify_${question}`}
                           sx={{ mt: 1, display: "none" }}
                           onClick={() => handleModify(setValues)}
                        >
                           setValues
                        </Button> */}
                     </Box>
                  }
                  secondary={
                     <Fragment>
                        {optionsByRange ? (
                           <Box sx={styleContent}>
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
                           <Box sx={styleContent}>
                              {options.map((op, index) => (
                                 <>
                                    <InputComponentv3
                                       key={index}
                                       idName={op.idName}
                                       label={op.label}
                                       type={op.type}
                                       value={op.score}
                                       placeholder="0"
                                       // setFieldValue={setFieldValue}
                                       // onChange={handleChange}
                                       // onBlur={handleBlur}
                                       // error={errors[op.idName]}
                                       // touched={touched[op.idName]}
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
            {/* )}
            </Formik> */}
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
                     { width: 300, min: 1, max: 20, defaultValue: [1, 7], values: [1, 7], handleChangeContinue: handleChangeContinue, idName: "family_1_1" },
                     { width: 300, min: 1, max: 20, defaultValue: [8, 14], values: [8, 14], handleChangeContinue: handleChangeContinue, idName: "family_1_2" },
                     { width: 300, min: 1, max: 20, defaultValue: [15, 20], values: [15, 20], handleChangeContinue: handleChangeContinue, idName: "family_1_3" }
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
                        idName: "economic_1_1"
                     },
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [4501, 7500],
                        values: [4501, 7500],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economic_1_2"
                     },
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [7501, 10000],
                        values: [7501, 10000],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economic_1_3"
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
                        idName: "economic_2_1"
                     },
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [4501, 7500],
                        values: [4501, 7500],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economic_2_2"
                     },
                     {
                        width: 700,
                        min: 1000,
                        max: 10000,
                        defaultValue: [7501, 10000],
                        values: [7501, 10000],
                        handleChangeContinue: handleChangeContinue,
                        idName: "economic_2_3"
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
                     { score: 0, label: "Propia", type: "number", placeholder: "0", idName: "house_1_1" },
                     { score: 0, label: "Prestada", type: "number", placeholder: "0", idName: "house_1_2" },
                     { score: 0, label: "Alquilada", type: "number", placeholder: "0", idName: "house_1_3" },
                     { score: 0, label: "Otra", type: "number", placeholder: "0", idName: "house_1_4" }
                  ]}
               />
               <ItemContainer
                  question="Material del techo de la vivienda (si está hecho de más de un material, marca el que predomine):"
                  optionsByRange={false}
                  options={[
                     { score: 0, label: "Lámina (de cartón, de asbesto, madera)", type: "number", placeholder: "0", idName: "house_2_1" },
                     { score: 0, label: "Firme de concreto", type: "number", placeholder: "0", idName: "house_2_2" }
                  ]}
               />
               <ItemContainer
                  question="Material del piso de la vivienda (si está hecho de más de un material, marca el que predomine):"
                  optionsByRange={false}
                  options={[
                     { score: 0, label: "Tierra", type: "number", placeholder: "0", idName: "house_3_1" },
                     { score: 0, label: "Cemento", type: "number", placeholder: "0", idName: "house_3_2" },
                     { score: 0, label: "Mosaico, loseta, madera Láminada", type: "number", placeholder: "0", idName: "house_3_3" }
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
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_1_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_1_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_1_3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Lavadoras"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_2_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_2_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_2_3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Calentador de agua (boiler)"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_3_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_3_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_3_3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Televisores"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_4_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_4_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_4_3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Computadoras"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_5_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_5_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_5_3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Teléfonos (local o celular)"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_6_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_6_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_6_3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Reproductores de Música"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_7_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_7_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_7_3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Estufas"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_8_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_8_2"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [7, 10],
                        values: [7, 10],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_8_3"
                     }
                  ]}
               />
               <ItemContainer
                  question="Refrigeradores"
                  optionsByRange={true}
                  optionsRange={[
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [1, 3],
                        values: [1, 3],
                        handleChangeContinue: handleChangeContinue,
                        idName: "household_equipment_9_1"
                     },
                     {
                        width: 300,
                        min: 1,
                        max: 10,
                        defaultValue: [4, 6],
                        values: [4, 6],
                        handleChangeContinue: handleChangeContinue,
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
               />
               <Divider variant="inset" component="li" sx={{ marginLeft: "0px;" }} />
               <ItemContainer
                  question="Ponderar Servicios:"
                  optionsByRange={false}
                  options={[
                     { score: 0, label: "Agua Potable", type: "number", placeholder: "0", idName: "service_1" },
                     { score: 0, label: "Luz Eléctrica", type: "number", placeholder: "0", idName: "service_2" },
                     { score: 0, label: "Drenaje", type: "number", placeholder: "0", idName: "service_3" },
                     { score: 0, label: "Pavimento", type: "number", placeholder: "0", idName: "service_4" },
                     { score: 0, label: "Automóvil", type: "number", placeholder: "0", idName: "service_5" },
                     { score: 0, label: "Línea Telefónica", type: "number", placeholder: "0", idName: "service_6" },
                     { score: 0, label: "Internet", type: "number", placeholder: "0", idName: "service_7" }
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
                     { score: 0, label: "Beca de Transporte", type: "number", placeholder: "0", idName: "scholarship_1" },
                     { score: 0, label: "Beca para el Bienestar Benito Juárez ", type: "number", placeholder: "0", idName: "scholarship_2" },
                     { score: 0, label: "Beca Jóvenes Construyendo el Futuro", type: "number", placeholder: "0", idName: "scholarship_3" },
                     { score: 0, label: "Otra", type: "number", placeholder: "0", idName: "scholarship_4" }
                  ]}
               />
            </DialogContentText>
         </List>
      );
   };

   const TabsTitles = ["DATOS FAMILIARES", "DATOS ECONÓMICOS", "DATOS DE VIVIENDA", "EQUIPAMIENTO DOMÉSTICO", "PROGRAMA DE BECAS"];
   const TabsContainers = [<ListFamilies />, <ListEconomic />, <ListHouse />, <ListHouseholdEquipment />, <ListBecas />];

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
                     <LoadingButton
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        // loadingPosition="start"
                        variant="contained"
                        fullWidth={false}
                        sx={{ width: "auto" }}
                        size="large"
                     >
                        {"GUARDAR CONFIGURACIÓN"}
                     </LoadingButton>
                  </Tabs>
               </AppBar>
               {/* <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={handleChangeIndex}> */}
               {TabsContainers.map((container, index) => (
                  <TabPanel key={`container_${index}`} value={tabValue} index={index} dir={theme.direction}>
                     {console.log("values", values)}
                     {cloneElement(container, { values, handleBlur, handleChange, errors, touched, resetForm, setFieldValue, setValues })}
                  </TabPanel>
               ))}
               {/* </SwipeableViews> */}
            </Box>
            // <TabsComponent
            //    TabsTitles={TabsTitles}
            //    TabsContainer={TabsContainers}
            //    errors={errors}
            //    handleBlur={handleBlur}
            //    handleChange={handleChange}
            //    handleSubmit={handleSubmit}
            //    isSubmitting={isSubmitting}
            //    touched={touched}
            //    values={values}
            //    resetForm={resetForm}
            //    setFieldValue={setFieldValue}
            //    setValues={setValues}
            // />
         )}
      </Formik>
   );
};
export default AnswerScoreForm;
