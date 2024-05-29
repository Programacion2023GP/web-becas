import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import React, { forwardRef, useEffect, useState, useCallback } from "react";
import {
   Button,
   TextField,
   CircularProgress,
   FormControl,
   FormControlLabel,
   FormHelperText,
   IconButton,
   InputAdornment,
   InputLabel,
   OutlinedInput,
   Switch,
   Typography,
   Box,
   Autocomplete,
   Tooltip,
   RadioGroup,
   Radio,
   Checkbox,
   Divider
} from "@mui/material";
import { Formik, Field, useFormikContext } from "formik";
import InputMask from "react-input-mask";
import propTypes from "prop-types";
// import CircularProgress from "@mui/material/CircularProgress";
import { handleInputFormik } from "../../utils/Formats";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../utils/password-strength";
import Toast from "../../utils/Toast";
import { IconReload } from "@tabler/icons";
import SwitchIOSComponent from "../SwitchIOSComponent";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/es";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useGlobalContext } from "../../context/GlobalContext";
// import Select2Component from "./Select2Component";
// import { InputAdornment, OutlinedInput } from "@mui/material";
import { shouldForwardProp, styled } from "@mui/system";
const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
   // width: 434,
   // marginLeft: 16,
   // paddingLeft: 16,
   // paddingRight: 16,
   "& input": {
      background: "#fff !important",
      paddingLeft: "10px !important"
   },
   [theme.breakpoints.down("lg")]: {
      width: 250
   },
   [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff"
   }
}));

export const DividerComponent = () => (
   <Grid xs={12}>
      <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
   </Grid>
);

//#region FORMIK COMPONENT
//#region IMPORTS
// import { LoadingButton } from "@mui/lab";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
// import { Button } from "@mui/material";
// import { Formik } from "formik";
// import { useEffect } from "react";
//#endregion IMPORTS

// =================== COMPONENTE =======================
export const FormikComponent = forwardRef(
   (
      {
         initialValues = {},
         validationSchema = {},
         onSubmit,
         children,
         textBtnSubmit,
         formikRef = null,
         handleCancel,
         showActionButtons = true,
         activeStep = null,
         setStepFailed = null
      },
      ref
   ) => {
      useEffect(() => {
         // console.log("useEffect del FormikComponent");
      }, []);

      const onBlur = () => {
         if (activeStep && setStepFailed) {
            if (Object.keys(formikRef.current.errors).length > 0) setStepFailed(activeStep);
            else setStepFailed(-1);
         }
      };
      const onChange = () => {
         if (activeStep && setStepFailed) {
            if (Object.keys(formikRef.current.errors).length > 0) setStepFailed(activeStep);
            else setStepFailed(-1);
         }
      };

      return (
         <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} innerRef={formikRef == null ? ref : formikRef}>
            {({ handleSubmit, isSubmitting, resetForm }) => (
               <Grid container spacing={2} component={"form"} onSubmit={handleSubmit} onBlur={onBlur} onChangeCapture={onChange}>
                  {!showActionButtons ? (
                     <Grid xs={12} container spacing={2}>
                        {children}
                     </Grid>
                  ) : (
                     <>
                        <Grid width={"100%"} xs={12} spacing={2} height={"79vh"} MaxHeight={"79vh"} overflow={"auto"}>
                           <Grid xs={12} container spacing={2}>
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
                     </>
                  )}
               </Grid>
            )}
         </Formik>
      );
   }
);
//#endregion FORMIK COMPONENT

//#region INPUT COMPONENT
//#region IMPORTS
// import React, { useEffect, useState } from "react";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
// import TextField from "@mui/material/TextField";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Field, useFormikContext } from "formik"; // Importa el hook useFormikContext
// import InputMask from "react-input-mask";
// import { handleInputFormik } from "../../utils/Formats";
//#endregion IMPORTS

// =================== COMPONENTE =======================
export const InputComponent = ({
   xsOffset = null,
   col,
   idName = "idName",
   label,
   type = null,
   disabled,
   placeholder,
   helperText,
   color,
   rows,
   loading = false,
   hidden,
   mask,
   variant = "outlined",
   marginBottom,
   textStyleCase = null,
   styleInput = 1,
   size = "medium",
   ...props
}) => {
   const formik = useFormikContext(); // Obtiene el contexto de Formik
   const errors = formik.errors;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName] : null;
   const isError = error == null ? false : true;

   let flexDirection = "column";
   let alignItems = "center";
   let sxInput = {};

   if (styleInput == 2) {
      flexDirection = "column";
      alignItems = "center";
      sxInput = { backgroundColor: "#1F2227" };
   } else if (styleInput == 3) {
      flexDirection = "row";
      alignItems = "flex-end";
      variant = "standard";
      sxInput = { textAlign: "center", maxWidth: "50px", my: 0, py: 0 };
      marginBottom = -2.5;
      size = "small";
   }

   useEffect(() => {
      // console.log("isError", isError);
   }, [idName, formik.values[idName]]);

   return (
      <Grid
         xs={12}
         xsOffset={xsOffset}
         md={col}
         sx={{ display: hidden ? "none" : "flex", flexDirection: flexDirection, alignItems: alignItems, mb: marginBottom ? marginBottom : 2 }}
      >
         {mask ? (
            <Field name={idName}>
               {({ field }) => (
                  <InputMask
                     id={`${idName}_mask`}
                     mask={mask}
                     value={formik.values && formik.values[idName] ? formik.values[idName] : ""}
                     onChange={(e) => field.onChange(e)} // Utiliza field.onChange para actualizar el valor en Formik
                     onBlur={(e) => field.onBlur(e)} // Utiliza field.onBlur para manejar el desenfoque y activar la validación
                     disabled={loading || disabled}
                  >
                     {(inputProps) => (
                        <TextField
                           {...inputProps}
                           key={idName}
                           name={idName}
                           label={label}
                           type={type !== null && type !== undefined ? type : "text"} // Utiliza type si está definido, de lo contrario, usa "text"
                           variant={variant}
                           onInput={(e) => {
                              textStyleCase != null ? handleInputFormik(e, formik.setFieldValue, idName, textStyleCase) : null;
                           }}
                           fullWidth
                           {...props}
                           error={error}
                           helperText={isError ? error : helperText}
                           InputLabelProps={{
                              style: color ? { color: color } : {}
                           }}
                        />
                     )}
                  </InputMask>
               )}
            </Field>
         ) : (
            <>
               {styleInput == 2 ? (
                  <OutlineInputStyle
                     key={idName}
                     name={idName}
                     label={styleInput == 1 && label}
                     placeholder={placeholder}
                     type={type !== null && type !== undefined ? type : "text"} // Utiliza type si está definido, de lo contrario, usa "text"
                     variant={variant}
                     value={formik.values && formik.values[idName] ? formik.values[idName] : ""}
                     onChange={formik.handleChange} // Utiliza el handleChange de Formik
                     onBlur={(e) => {
                        formik.handleBlur(e); // Usa handleBlur de Formik para manejar el blur

                        // Agrega tu lógica adicional aquí
                        // Por ejemplo, puedes agregar variables o eventos al contexto DebugerContext
                     }}
                     onInput={(e) => {
                        textStyleCase != null ? handleInputFormik(e, formik.setFieldValue, idName, textStyleCase) : null;
                     }}
                     {...props}
                     disabled={loading || disabled}
                     fullWidth
                     multiline={rows > 0 ? true : false}
                     rows={rows && rows} // Establece las filas solo si type no está definido
                     error={isError}
                     helperText={isError ? error : helperText}
                     InputLabelProps={{
                        style: color ? { color: color } : {}
                     }}
                     size={size}
                     sx={sxInput}
                     startAdornment={
                        // <Tooltip title={""} placement={"top"}>
                        <InputAdornment position="start" sx={{ ml: 0.5 }}>
                           <Typography sx={{ color: "whitesmoke", fontWeight: "bolder", fontSize: 14 }}>{label}</Typography>
                           {/* <IconSearch stroke={2.5} size="1.5rem" color={theme.palette.grey[500]} /> */}
                        </InputAdornment>
                        // </Tooltip>
                     }
                  />
               ) : (
                  <TextField
                     key={idName}
                     name={idName}
                     label={styleInput == 1 && label}
                     placeholder={placeholder}
                     type={type !== null && type !== undefined ? type : "text"} // Utiliza type si está definido, de lo contrario, usa "text"
                     variant={variant}
                     value={formik.values && formik.values[idName] ? formik.values[idName] : ""}
                     onChange={formik.handleChange} // Utiliza el handleChange de Formik
                     onBlur={(e) => {
                        formik.handleBlur(e); // Usa handleBlur de Formik para manejar el blur

                        // Agrega tu lógica adicional aquí
                        // Por ejemplo, puedes agregar variables o eventos al contexto DebugerContext
                     }}
                     onInput={(e) => {
                        textStyleCase != null ? handleInputFormik(e, formik.setFieldValue, idName, textStyleCase) : null;
                     }}
                     {...props}
                     disabled={loading || disabled}
                     fullWidth
                     multiline={rows > 0 ? true : false}
                     rows={rows && rows} // Establece las filas solo si type no está definido
                     error={isError}
                     helperText={isError ? error : helperText}
                     InputLabelProps={{
                        style: color ? { color: color } : {}
                     }}
                     size={size}
                     sx={sxInput}
                     startAdornment={
                        // <Tooltip title={""} placement={"top"}>
                        <InputAdornment position="start" sx={{ ml: 0.5 }}>
                           <Typography sx={{ color: "whitesmoke", fontWeight: "bolder", fontSize: 14 }}>{label}</Typography>
                           {/* <IconSearch stroke={2.5} size="1.5rem" color={theme.palette.grey[500]} /> */}
                        </InputAdornment>
                        // </Tooltip>
                     }
                  />
               )}
               {styleInput == 3 && (
                  <Typography variant="body1" component="label" htmlFor={idName} ml={1}>
                     {label}
                  </Typography>
               )}
            </>
         )}
         {loading && <CircularProgress sx={{ position: "relative", top: "-50%", left: "40%" }} />}
      </Grid>
   );
};
//#endregion INPUT COMPONENT

//#region PASSWORD COMPONENT
//#region IMPORTS
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import {
//    CircularProgress,
//    FormControl,
//    FormControlLabel,
//    FormHelperText,
//    IconButton,
//    InputAdornment,
//    InputLabel,
//    OutlinedInput,
//    Switch,
//    Typography
// } from "@mui/material";
// import Grid from "@mui/material/Unstable_Grid2";
// import { Box } from "@mui/system";
// import { useFormikContext } from "formik";
// import { useEffect, useState } from "react";
// import { strengthColor, strengthIndicator } from "../../utils/password-strength";
//#endregion IMPORTS

// =================== COMPONENTE =======================
export const PasswordCompnent = ({
   col,
   label,
   idName,
   disabled,
   placeholder,
   helperText,
   color,
   loading = false,
   hidden,
   variant = "outlined",
   marginBottom,
   textStyleCase = null,
   newPasswordChecked,
   setNewPasswordChecked,
   checkedShowSwitchPassword = false,
   ...props
}) => {
   const formik = useFormikContext(); // Obtiene el contexto de Formik
   const errors = formik.errors;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName] : null;
   const isError = error == null ? false : true;

   // #region Boton de Contraseña
   const [showPassword, setShowPassword] = useState(false);
   // const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(true);

   const [strength, setStrength] = useState(0);
   const [level, setLevel] = useState();
   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const changePassword = (value) => {
      const temp = strengthIndicator(value);
      setStrength(temp);
      setLevel(strengthColor(temp));
   };
   // #endregion Boton de Contraseña

   useEffect(() => {}, [idName]);

   useEffect(() => {
      if (formik.values[idName] == "" || !newPasswordChecked) setStrength(0);
   }, [newPasswordChecked, formik.values[idName]]);

   return (
      <Grid
         xs={12}
         md={col}
         sx={{
            // backgroundColor: "yellow",
            // border: 1,
            display: hidden ? "none" : "flex",
            flexDirection: "column",
            alignItems: "end",
            position: "relative",
            pt: 0,
            p: 0,
            mb: marginBottom ? `${marginBottom} 0` : 2,
            mt: checkedShowSwitchPassword ? -3 : -0
         }}
      >
         {/* Switch para mostrar el cambiar contraseña */}
         {checkedShowSwitchPassword && (
            <Grid sx={{ backgroundColor: "", my: 0, py: 0, mt: 0, pt: 0, mb: -1.75 }}>
               <FormControlLabel
                  control={<Switch />}
                  label={"Cambiar Contraseña"}
                  checked={newPasswordChecked}
                  onChange={() => setNewPasswordChecked(!newPasswordChecked)}
               />
            </Grid>
         )}
         {/* Contraseña */}
         <Grid xs={12} sx={{ backgroundColor: "", p: 1 }}>
            <FormControl fullWidth error={isError}>
               <InputLabel htmlFor={idName}>{label || "Contraseña *"}</InputLabel>
               <OutlinedInput
                  key={idName}
                  id={idName}
                  name={idName}
                  label={label || "Contraseña *"}
                  placeholder={placeholder || "Ingrese su contraseña, minimo 6 dígitos"}
                  type={showPassword ? "text" : "password"}
                  variant={variant}
                  value={formik.values && formik.values[idName] ? formik.values[idName] : ""}
                  onChange={(e) => {
                     formik.handleChange(e);
                     changePassword(e.target.value);
                  }} // Utiliza el handleChange de Formik
                  onBlur={(e) => {
                     formik.handleBlur(e); // Usa handleBlur de Formik para manejar el blur

                     // Agrega tu lógica adicional aquí
                     // Por ejemplo, puedes agregar variables o eventos al contexto DebugerContext
                  }}
                  onInput={(e) => {
                     textStyleCase != null ? handleInputFormik(e, formik.setFieldValue, idName, textStyleCase) : null;
                  }}
                  {...props}
                  disabled={newPasswordChecked ? false : true}
                  fullWidth
                  endAdornment={
                     <InputAdornment position="end">
                        <IconButton
                           aria-label="toggle password visibility"
                           onClick={handleClickShowPassword}
                           onMouseDown={handleMouseDownPassword}
                           edge="end"
                           size="large"
                        >
                           {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                     </InputAdornment>
                  }
                  inputProps={{
                     style: color ? { color: color } : {}
                  }}
                  error={isError}
               />
               {isError && (
                  <FormHelperText error id="ht-password">
                     {isError ? error : helperText}
                  </FormHelperText>
               )}
            </FormControl>
            {strength !== 0 && (
               <FormControl fullWidth>
                  <Box sx={{ mb: 2 }}>
                     <Grid container spacing={2} alignItems="center">
                        <Grid>
                           <Box
                              style={{ backgroundColor: level?.color }}
                              sx={{
                                 width: 85,
                                 height: 8,
                                 borderRadius: "7px"
                              }}
                           />
                        </Grid>
                        <Grid>
                           <Typography variant="subtitle1" fontSize="0.75rem">
                              {level?.label}
                           </Typography>
                        </Grid>
                     </Grid>
                  </Box>
               </FormControl>
            )}
            {loading && <CircularProgress sx={{ position: "absolute", top: "13%", left: "40%" }} />}
         </Grid>
      </Grid>
   );
};
//#endregion PASSWORD COMPONENT

//#region SELECT2 COMPONENT
//#region IMPORTS
// import Grid from "@mui/system/Unstable_Grid/Grid";
// import { Autocomplete, CircularProgress, FormControl, FormHelperText, IconButton, TextField, Tooltip } from "@mui/material";
// import Toast from "../../utils/Toast";
// import { useEffect, useState } from "react";
// import { Field, useFormikContext } from "formik";
// import { IconReload } from "@tabler/icons";
// import { Box } from "@mui/system";
//#endregion IMPORTS

/**
 *
 * {/* Marca *}
   <Select2Component col={6} idName={"marca"} label={"Marca *"} options={dataBrands} refreshSelect={} />
 */

// =================== COMPONENTE =======================
export const Select2Component = ({
   col,
   idName,
   label,
   placeholder,
   options = [],
   disabled,
   size = "medium",

   helperText,
   // loading = false,
   // setLoading,
   color,
   hidden,
   variant = "outlined",
   marginBottom,
   namePropLabel = "label",
   fullWidth,
   pluralName,
   refreshSelect = null,
   refreshSelectParams = null,
   handleGetValue = null,
   handleChangeValueSuccess,
   ...props
}) => {
   const formik = useFormikContext(); // Obtiene el contexto de Formik
   const errors = formik.errors;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName] : null;
   const isError = error == null ? false : true;

   const [dataOptions, setDataOptions] = useState([]);
   const [labelValue, setLabelValue] = useState("Selecciona una opción...");
   const [loading, setLoading] = useState(false);

   const handleValue = (name, value) => {
      if (handleGetValue) {
         handleGetValue(name, value);
      }
   };

   const isOptionEqualToValue = (option, value) => {
      // console.log("option", option);
      // console.log("value", value);
      if (option.label) {
         if (typeof value === "string") return option.label === value;
         else {
            // console.log(value);
            // value = option.label;
            // console.log(value);
            return option.id === value;
         }
      } else return option === value;
   };
   // const handleChangeValue = async (value, setValues) => {
   const handleChangeValue = async (value, setFieldValue) => {
      try {
         // console.log("Select2Component->handleChangeValue->value", value);

         if (!value) {
            formik.setFieldValue(idName, 0);
            setLabelValue("Selecciona una opción...");
            return;
         }
         const selectedOption = dataOptions.find((option) =>
            typeof value === "object" ? option.label.trim() === value.label.trim() : option.trim() === value.trim()
         );
         // handleValue(idName, typeof value === "object" ? selectedOption.id : selectedOption);
         formik.setFieldValue(idName, typeof value === "object" ? selectedOption.id : selectedOption);
         setLabelValue(typeof value === "object" ? selectedOption.label : selectedOption);
         // console.log("values", values);

         if (handleChangeValueSuccess) {
            setLoading(true);
            await handleChangeValueSuccess(idName, selectedOption, setFieldValue);
            setLoading(false);
         } //en esta funcion
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickRefresh = async () => {
      try {
         setLoading(true);
         await refreshSelect(refreshSelectParams);
         setLoading(false);
         Toast.Success("Actualizada");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // console.log("error", error);
      // console.log("isError", isError);
      setLoading(true);
      const _options = [{ id: 0, label: "Selecciona una opción..." }];
      // console.log(options);
      options.map((option, index) => {
         _options.push({ id: option.id, label: option[namePropLabel] });
         if (option.id === formik.values.idName) setLabelValue(option[namePropLabel]);
         if (index == options.length - 1 && labelValue == "Selecciona una opción...") setLabelValue(option[namePropLabel]);
      });
      setDataOptions(_options);
      // }
      Number(formik.values[idName]) == 0 && setLabelValue("Selecciona una opción...");
      setLoading(false);

      if (Array.isArray(options) && options.length > 0) {
         setLoading(false);
      }
      if (!Array.isArray(options)) {
         options = [];
         setLoading(false);
      }
   }, [options, formik.values[idName]]);

   return (
      <>
         {dataOptions.length > 0 && (
            <Grid
               xs={12}
               md={col}
               sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBottom ? `${marginBottom} 0` : 2 }}
            >
               <FormControl fullWidth>
                  <Box display={"flex"}>
                     <Field id={idName} name={idName}>
                        {({ field }) => (
                           <Autocomplete
                              key={`select_${idName}`}
                              disablePortal
                              openOnFocus
                              label={label}
                              placeholder={placeholder}
                              options={dataOptions}
                              size={size}
                              // getOptionLabel={(option) => option.label}
                              // isOptionEqualToValue={(option, value) => option && value && option.id === value.id}
                              {...field}
                              value={Number(formik.values[idName]) > 0 ? dataOptions.find((option) => option.id === formik.values[idName])?.label : labelValue}
                              defaultValue={Number(formik.values[idName]) > 0 ? dataOptions.find((option) => option.id === formik.values[idName])?.label : labelValue}
                              // defaultValue={labelValue || "Selecciona una opción..."}
                              onChange={(_, newValue) => {
                                 handleChangeValue(newValue, formik.setFieldValue);
                              }}
                              onBlur={formik.handleBlur}
                              fullWidth={fullWidth || true}
                              isOptionEqualToValue={isOptionEqualToValue}
                              renderInput={(params) => <TextField {...params} label={label} error={isError} />}
                              disabled={disabled || loading}
                              error={isError ? isError : undefined}
                           />
                        )}
                     </Field>
                     {refreshSelect && (
                        <Tooltip title={`Actualizar ${pluralName}`} placement="top">
                           <IconButton
                              type="button"
                              variant="text"
                              color="primary"
                              sx={{ borderRadius: "12px", mr: 1 }}
                              onClick={handleClickRefresh}
                              disabled={disabled || loading}
                           >
                              <IconReload />
                           </IconButton>
                        </Tooltip>
                     )}
                  </Box>
                  <FormHelperText error={isError} id={`ht-${idName}`}>
                     {isError ? error : helperText}
                  </FormHelperText>
                  {loading && <CircularProgress sx={{ position: "absolute", top: "10%", left: "60%" }} />}
               </FormControl>
            </Grid>
         )}
      </>
   );
};
//#endregion SELECT2 COMPONENT

//#region SWITCH COMPONENT
//#region IMPORTS
// import React, { useEffect, useState } from "react";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
// import TextField from "@mui/material/TextField";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Field, useFormikContext } from "formik"; // Importa el hook useFormikContext
// import InputMask from "react-input-mask";
// import { handleInputFormik } from "../../utils/Formats";
//#endregion IMPORTS

// =================== COMPONENTE =======================
export const SwitchComponent = ({
   col,
   idName,
   label,
   disabled,
   textEnable = "Activo",
   textDisable = "Inactivo",
   // helperText,
   color,
   loading = false,
   hidden,
   marginBottom,
   ...props
}) => {
   const formik = useFormikContext(); // Obtiene el contexto de Formik
   const errors = formik.errors;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName] : null;
   const isError = error == null ? false : true;

   useEffect(() => {
      // console.log("formik.values[idName]", formik.values[idName]);
   }, [idName]);

   return (
      <Grid xs={12} md={col} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "start", mb: marginBottom ? `${marginBottom} 0` : 2 }}>
         <Tooltip title={formik.values[idName] ? textEnable : textDisable} placement="right">
            <Button color="dark" onClick={() => formik.setFieldValue(idName, !Boolean(formik.values[idName]))}>
               <SwitchIOSComponent checked={Boolean(formik.values[idName])} label={label} />
            </Button>
         </Tooltip>
         {loading && <CircularProgress sx={{ position: "relative", top: "-50%", left: "20%" }} />}
      </Grid>
   );
};
//#endregion SWITCH COMPONENT

//#region RADIO COMPONENT
//#region IMPORTS
// import React, { useEffect, useState } from "react";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
// import { RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Field, useFormikContext } from "formik"; // Importar Field y useFormikContext de Formik
// import { Ngif } from "../conditionals/Ngif";
//#endregion IMPORTS

// =================== COMPONENTE =======================
export const RadioButtonComponent = ({
   // loading = false,
   xsOffset,
   col,
   idName,
   title,
   options,
   helperText,
   hidden,
   handleGetValue,
   alignItems = "center",
   marginBottom = 2,
   rowLayout = true // Cambiar a false para poner en columnas
}) => {
   const { values, errors, touched, handleChange, handleBlur } = useFormikContext(); // Obtener valores, errores y funciones de Formik
   const [loading, setLoading] = useState(false);
   useEffect(() => {
      if (Array.isArray(options) && options.length > 0) {
         setLoading(false);
      }
      if (Array.isArray(options) && options.length == 0) {
         setLoading(true);
      }
      if (!Array.isArray(options)) {
         setLoading(true);
         options = [];
      }
   }, [title, idName, values[idName], options]);

   const isError = touched[idName] && errors[idName];
   const handleValue = (idName, value) => {
      if (handleGetValue) {
         handleGetValue(idName, value);
      }
   };
   return (
      <Grid
         xsOffset={xsOffset}
         lg={col}
         xl={col}
         xs={12}
         md={12}
         sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: alignItems }}
         mb={marginBottom ?? 2}
      >
         <Typography variant="subtitle1" align="center" color="textPrimary" sx={{ mb: 0 }}>
            {title}
         </Typography>
         <RadioGroup
            name={idName}
            value={values[idName]} // Usar el valor del formulario
            onChange={handleChange} // Usar la función de cambio de Formik
            onBlur={handleBlur} // Usar la función de desenfoque de Formik
            sx={{ flexDirection: rowLayout ? "row" : "column" }} // Ajustar la dirección del grupo de radio
         >
            {options.length > 0 && (
               <>
                  {options.map((option, index) => (
                     <FormControlLabel
                        key={index}
                        value={option.value}
                        onClick={() => {
                           //  console.log("hola", handleGetValue);
                           handleValue(idName, option.value);
                        }}
                        control={<Radio />}
                        label={option.label}
                        disabled={loading}
                        sx={{
                           mr: rowLayout && 5,
                           marginBottom: rowLayout ? 0 : "8px", // Espacio entre los radio buttons si están en columnas
                           "& .MuiRadio-root": {
                              color: "#c5c8cc" //"#1976d2"
                           },
                           "& .MuiFormControlLabel-label": {
                              color: "#1E2126", //"#1976d2",
                              fontSize: "14px"
                           },
                           "& .Mui-checked": {
                              color: "#1E2126" //"#1976d2"
                           }
                        }}
                     />
                  ))}
               </>
            )}
         </RadioGroup>
         <FormHelperText error={isError} id={`ht-${idName}`}>
            {isError ? error : helperText}
         </FormHelperText>
         {loading && <CircularProgress sx={{ position: "absolute", bottom: "20%", left: "50%" }} />}
      </Grid>
   );
};
//#endregion RADIO COMPONENT

//#region CHECK COMPONENT
//#region IMPORTS
// import { useEffect, useState } from "react";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
// import { FormControlLabel, Checkbox, CircularProgress, Typography } from "@mui/material";
// import { useFormikContext } from "formik";
//#endregion IMPORTS

// =================== COMPONENTE =======================
export const CheckboxComponent = ({
   loading = false,
   col,
   label,
   idName,
   checked = null,
   value,
   disabled,
   rowLayout = true,
   color = "primary",
   marginBottom,
   ...props
}) => {
   const [checkedComponent, setCheckedComponent] = useState(checked); // Estado inicializado como falso
   const formik = useFormikContext();
   const isError = formik.touched[idName] && formik.errors[idName];

   useEffect(() => {
      if (checked == null) {
         setCheckedComponent(formik.values[idName]);
      }
      // } else {
      //    formik.setFieldValue(idName, value);
      // }
      // console.log("aqui", formik.values[idName]);
   }, [checked, formik.values[idName]]);

   return (
      <>
         {rowLayout && <Grid item xs={12} />}
         <Grid xs={col} sx={{ display: "flex", alignItems: "center", position: "relative", mb: marginBottom ? marginBottom : 2 }}>
            <FormControlLabel
               control={
                  <Checkbox
                     name={idName}
                     checked={checkedComponent}
                     onChange={(e) => {
                        const checked = e.target.checked;
                        setCheckedComponent(checked); // Actualiza el estado del componente
                        formik.setFieldValue(idName, checked ? value : false);
                     }}
                     disabled={loading || disabled}
                     color={color}
                  />
               }
               label={label}
               sx={{
                  marginRight: rowLayout ? "16px" : 0,
                  marginBottom: rowLayout ? 0 : "8px",
                  "& .MuiSvgIcon-root": {
                     fontSize: "1.5rem"
                  },
                  "& .MuiTypography-body1": {
                     fontSize: "14px"
                  }
               }}
               {...props}
            />
            {loading && <CircularProgress sx={{ position: "absolute", top: "40%", left: "40%" }} />}
            <Typography sx={{ color: isError ? "red" : "gray" }} variant="subtitle2" color="initial">
               {isError}
            </Typography>
         </Grid>
      </>
   );
};
//#endregion CHECK COMPONENT

//#region DATEPICKER COMPONENT
//#region IMPORTS
// import { FormControl, FormHelperText } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
// import dayjs from "dayjs";
// import { Field, useFormikContext } from "formik";
// import { useEffect } from "react";
// import "dayjs/locale/es";
//#endregion IMPORTS

// =================== COMPONENTE =======================
export const DatePickerComponent = ({ loading = false, col, idName, label, format = "DD/MM/YYYY", disabled, hidden, marginBottom, ...props }) => {
   const formik = useFormikContext();
   const { errors, touched } = formik;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName] : null;
   const isError = error == null ? false : true;
   dayjs.locale("es");

   useEffect(() => {}, [errors[idName], touched[idName]]);

   return (
      <Grid xs={12} md={col} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBottom ? `${marginBottom} 0` : 2 }}>
         <FormControl fullWidth sx={{ margin: "1rem 0" }}>
            <Field name={idName} id={idName}>
               {({ field, form }) => (
                  <>
                     <DatePicker
                        label={label}
                        value={dayjs(field.value) || null}
                        // format={format}
                        onChange={(date) => form.setFieldValue(field.name, dayjs(date).format("YYYY-MM-DD"))}
                        error={errors[idName] && touched[idName]}
                        disabled={loading || disabled}
                     />
                     {touched[idName] && errors[idName] && (
                        <FormHelperText error id={`ht-${idName}`}>
                           {errors[idName]}
                        </FormHelperText>
                     )}
                  </>
               )}
            </Field>
         </FormControl>
      </Grid>
   );
};
//#endregion DATEPICKER COMPONENT

//#region INPUTS COMUNNITY COMPONENT
//#region IMPORTS
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
// import { Field } from "formik";
// import Toast from "../../utils/Toast";
// import { CircularProgress, TextField } from "@mui/material";
// import { handleInputFormik } from "../../utils/Formats";
// import { useEffect } from "react";
// import axios from "axios";
// import { useGlobalContext } from "../../context/GlobalContext";
// import Select2Component from "./Select2Component";
//#endregion IMPORTS

/** ESTRUCTURTAS PARA IMPORTAR EL COMPONENTE
 * hay que importar ciertos sets de GlobalContext
  const {
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      // setDataColoniesComplete
   } = useGlobalContext();


 * esta es la estructura del componente a insertar
   <InputsCommunityComponent
      formData={formData}
      setFormData={setFormData}
      values={values}
      setValues={setValues}
      setFieldValue={setFieldValue}
      handleChange={handleChange}
      handleBlur={handleBlur}
      errors={errors}
      touched={touched}
   />

   * esta es la estructura para la funcion getCommunity al editar (handleModify)
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
      // setDataColoniesComplete
   );
*/

export const getCommunityById = async (community_id) => {
   const axiosMyCommunity = axios;
   const { data } = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/cp/colonia/${community_id}`);
   // console.log(data.data);
   return data.data.result;
};

export const getCommunity = async (
   zip,
   setFieldValue,
   community_id = null,
   formData,
   setFormData,
   setDisabledState,
   setDisabledCity,
   setDisabledColony,
   setShowLoading,
   setDataStates,
   setDataCities,
   setDataColonies
   // setDataColoniesComplete
) => {
   try {
      // let _community_id = null;
      setShowLoading(true);
      setDisabledState(true);
      setDisabledCity(true);
      setDisabledColony(true);
      let states = []; //["Selecciona una opción..."];
      let cities = []; //["Selecciona una opción..."];
      let colonies = []; // ["Selecciona una opción..."];
      // let coloniesComplete = ["Selecciona una opción..."];
      setDataStates(states);
      setDataCities(cities);
      setDataColonies(colonies);
      // setDataColoniesComplete(coloniesComplete);
      setFieldValue("state", 0);
      setFieldValue("city", 0);
      setFieldValue("colony", 0); //"Selecciona una opción...");
      formData.street !== "" && setFieldValue("street", formData.street);
      formData.num_ext !== "" && setFieldValue("num_ext", formData.num_ext);
      formData.num_int !== "" && setFieldValue("num_int", formData.num_int);
      if (community_id) {
         const axiosMyCommunity = axios;
         const { data } = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/cp/colonia/${community_id}`);

         if (data.data.status_code != 200) return Toast.Error(data.data.alert_text);
         formData.zip = data.data.result.CodigoPostal;
         formData.state = data.data.result.Estado;
         formData.city = data.data.result.Municipio;
         formData.colony = data.data.result.Colonia;
         // formData.colony = community_id;
         await setFormData(formData);
         zip = formData.zip;
      }
      if (zip.length > 1) {
         const axiosCommunities = axios;
         const axiosRes = await axiosCommunities.get(`${import.meta.env.VITE_API_CP}/cp/${zip}`);
         if (axiosRes.data.data.status_code != 200) return Toast.Error(axiosRes.data.data.alert_text);
         await axiosRes.data.data.result.map((d) => {
            states.push({ id: d.Estado, label: d.Estado });
            cities.push({ id: d.Municipio, label: d.Municipio });
            colonies.push({ id: d.id, label: d.Colonia });
            // coloniesComplete.push({ id: d.id, label: d.Colonia });
         });
      }

      // LIMPIAR DUPLICADOS
      // states = [...new Set(states)];
      // cities = [...new Set(cities)];
      // colonies = [...new Set(colonies)];
      // coloniesComplete = [...new Set(coloniesComplete)];
      states = await Array.from(new Map(states.map((item) => [item.id, item])).values());
      cities = await Array.from(new Map(cities.map((item) => [item.id, item])).values());
      colonies = await Array.from(new Map(colonies.map((item) => [item.id, item])).values());

      // if (zip !== "" && states.length === 1) {
      //    setShowLoading(false);
      //    return Toast.Info("No hay comunidades registradas con este C.P.");
      // }
      if (states.length > 2) setDisabledState(false);
      if (cities.length > 2) setDisabledCity(false);
      if (colonies.length > 1) setDisabledColony(false);
      setDataStates(states);
      setDataCities(cities);
      setDataColonies(colonies);
      // setDataColoniesComplete(coloniesComplete);
      setFieldValue("colony", colonies[0]);
      setFieldValue("zip", community_id ? formData.zip : zip);
      setFieldValue("state", community_id ? formData.state : states.length == 1 ? states[0] : states[1]);
      setFieldValue("city", community_id ? formData.city : cities.length == 1 ? cities[0] : cities[1]);
      setFieldValue("colony", community_id ? formData.colony : colonies.length == 2 ? colonies[1] : colonies[0]);
      // if (!community_id) setFieldValue("community_id", colonies.length == 2 && coloniesComplete[1].id);
      // setFieldValue("colony", community_id ? community_id : colonies[0]["id"]);
      setShowLoading(false);
   } catch (error) {
      console.log(error);
      Toast.Error(error);
      setShowLoading(false);
   }
};

/**
 * Estos Inputs, deben de estar dentro de Formik, validados con Yup y dentro de grillas
 * @param {*} param0
 * @returns community_id: int
 */
// =================== COMPONENTE =======================
export const InputsCommunityComponent = ({
   // loading = false,
   // setLoading,
   formData,
   setFormData,
   hidden,
   variant = "outlined",
   marginBottom,
   columnsByTextField = 6,
   registerCommunity = false,
   ...props
}) => {
   const {
      setCursorLoading,
      disabledState,
      setDisabledState,
      disabledCity,
      setDisabledCity,
      disabledColony,
      setDisabledColony,
      showLoading,
      setShowLoading,
      dataStates,
      setDataStates,
      dataCities,
      setDataCities,
      dataColonies,
      setDataColonies
      // dataColoniesComplete,
      // setDataColoniesComplete
   } = useGlobalContext();
   const formik = useFormikContext();

   const handleKeyUpZip = async (e, setFieldValue, community_id = null) => {
      try {
         const zip = e.target.value;
         if (e.target.value == "0") {
            await getCommunity(
               zip,
               setFieldValue,
               community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies
               // setDataColoniesComplete
            );
         } else {
            setDisabledColony(true);
            setFieldValue("state", 0); //"Selecciona una opción...");
            setFieldValue("city", 0); //"Selecciona una opción...");
            setFieldValue("colony", 0); //"Selecciona una opción...");
         }
         if (e.key === "Enter" || e.keyCode === 13) return;
         if (e.target.value.length == 0) return Toast.Info("C.P. vacio.");

         if (e.target.value.length == 5) {
            await getCommunity(
               zip,
               setFieldValue,
               community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies
               // setDataColoniesComplete
            );
         } else {
            setDisabledColony(true);
            setFieldValue("state", 0); //"Selecciona una opción...");
            setFieldValue("city", 0); //"Selecciona una opción...");
            setFieldValue("colony", 0); //"Selecciona una opción...");
         }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
         // setCursorLoading(false);
         setShowLoading(false);
      }
   };
   const handleChangeColony = async (inputName, colony, setFieldValue) => {
      try {
         console.log(dataColonies);
         // // const community_selected = dataColoniesComplete.find((c) => c.label === colony);
         // const community_selected = dataColonies.find((c) => c.id === colony.id);
         // values.community_id = community_selected.id;
         // setFieldValue("community_id", community_selected.id);
         setFieldValue("community_id", colony.id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {}, [formData, formik.values]);

   return (
      <>
         {/* community_id */}
         <InputComponent col={12} idName={"community_id"} label={"Id Comunidad"} placeholder={""} hidden={true} />

         {/* Comunidad */}
         <Grid container spacing={2} xs={12} sx={{ p: 1 }}>
            {/* C.P. */}
            <InputComponent
               col={columnsByTextField}
               idName={"zip"}
               label={"Código Postal *"}
               placeholder={"35000"}
               inputProps={{ maxLength: 5 }}
               onKeyUp={(e) => handleKeyUpZip(e, formik.setFieldValue)}
               disabled={showLoading}
               loading={showLoading}
            />

            {/* Estado */}
            <Select2Component col={columnsByTextField} idName={"state"} label={"Estado *"} options={dataStates} disabled={disabledState} />

            {/* Ciduad */}
            <Select2Component col={columnsByTextField} idName={"city"} label={"Ciudad *"} options={dataCities} disabled={disabledCity} />

            {/* Colonia */}
            {!registerCommunity && (
               <Select2Component
                  col={columnsByTextField}
                  idName={"colony"}
                  label={"Colonia *"}
                  options={dataColonies}
                  handleChangeValueSuccess={handleChangeColony}
                  disabled={disabledColony}
               />
            )}
         </Grid>
         {/* Calle */}
         {!registerCommunity && (
            <InputComponent col={4} idName={"street"} label={"Calle *"} placeholder={"Calle de las Garzas"} textStyleCase={true} /* disabled={disabledColony} */ />
         )}
         {/* No. Ext. */}
         {!registerCommunity && (
            <InputComponent col={4} idName={"num_ext"} label={"No. Ext. *"} placeholder={"S/N"} textStyleCase={true} /* disabled={disabledColony} */ />
         )}
         {/* No. Int. */}
         {!registerCommunity && (
            <InputComponent col={4} idName={"num_int"} label={"No. Int. *"} placeholder={"S/N"} textStyleCase={true} /* disabled={disabledColony} */ />
         )}
      </>
   );
};
//#endregion INPUTS COMMUNITY COMPONENT

//#region INPUT FILE (Drag&Drop)
//#region IMPORTS
// import { FormControl, FormHelperText, TextField, Typography, Box} from "@mui/material";
// import { Box } from "@mui/system";
// import propTypes from "prop-types";
// import { useCallback, useState } from "react";
// import Toast from "../../utils/Toast";
// import { Field } from "formik";
// import { useDropzone } from "react-dropzone";
//#endregion IMPORTS

// #region ESTILOS
// /* CONTENEDOR DE IMAGENES */
// .dropzone-container {
//    display: flex;
//    flex-direction: column;
//    align-items: center;
//    gap: 1rem;
//    width: 100%;
// }

// .dropzone {
//    border: 5px dashed #1455cb;
//    border-radius: 14px;
//    padding: 0.5rem;
//    text-align: center;
//    cursor: pointer;
//    width: 100%;
//    transition: all 0.3s ease-in-out;
// }
// .dropzone:hover {
//    border: 5px solid #1455cb;
//    background-color: #e9ecefb9;
// }

// .dropzone p {
//    font-size: 1rem;
// }

// .file-preview {
//    display: flex;
//    flex-wrap: wrap;
//    justify-content: center;
//    /* flex-direction: column; */
//    gap: 15px;
//    background-color: #e9ecef;
//    border-radius: 12px;
//    max-width: 100%;
//    overflow-x: auto;
//    /* margin-top: 5px; */
//    /* overflow-y: scroll; */
//    max-height: 350px;
// }
// .file-preview .preview-img {
//    max-width: 100px;
//    max-height: 100px;
//    object-fit: cover;
//    /* border: 1px solid #ddd; */
// }
// .file-preview .preview-pdf {
//    margin-top: 18px;
//    /* max-width: 100px;
//    max-height: 100px;
//    */
//    object-fit: cover;
//    /* border: 1px solid #ddd; */
// }

// .preview-item {
//    position: relative;
//    width: 95%; /*150px;*/
//    text-align: center;
// }

// .progress-bar {
//    width: 100%;
//    height: 10px;
//    background-color: #ddd;
// }

// .progress-bar-fill {
//    height: 100%;
//    background-color: #007bff;
// }

// .remove-button {
//    position: absolute;
//    width: 100%;
//    height: 100%;
//    top: 0%;
//    right: 0%;
//    background-color: transparent;
//    color: transparent; /* Color del icono de eliminar */
//    border: none;
//    border-radius: 12px;
//    font-weight: bolder;
//    cursor: pointer;
//    font-size: 20px;
//    transition: all 0.3s ease-in-out;
// }

// .remove-button:hover {
//    background-color: #777777a1; /* Color de fondo al pasar el ratón */
//    color: #e9ecef; /* Color del icono de eliminar al pasar el ratón */
// }

// .remove-pdf-button {
//    position: absolute;
//    width: 100%;
//    /* height: 100%; */
//    top: 0%;
//    right: 0%;
//    background-color: rgb(139, 19, 19);
//    color: whitesmoke; /* Color del icono de eliminar */
//    border: none;
//    border-radius: 12px 12px 0 0;
//    margin-bottom: 100px;
//    font-weight: bolder;
//    cursor: pointer;
//    font-size: 25px;
//    transition: all 0.3s ease-in-out;
// }
// /* CONTENEDOR DE IMAGENES */
// #endregion

export const setObjImg = (img, setImg) => {
   if (["", null, undefined].includes(img)) return setImg([]);
   // console.log("setObjImg --> ", img, " <--");
   const imgObj = {
      file: {
         name: `${img}`
      },
      dataURL: `${import.meta.env.VITE_HOST}/${img}`
   };
   setImg([imgObj]);
};

/**
 * const [imgFile, setImgFile] = useState([]);
 * 
 * <FileInputComponent
      idName="img_path"
      label="Foto de la marca"
      filePreviews={imgFile}
      setFilePreviews={setImgFile}
      error={errors.img_path}
      touched={touched.img_path}
      multiple={false}
      accept={"image/*"}
   />
*
* ENVIAR (onSubmit) ----------> values.img_preview = imgFile.length == 0 ? "" : imgFile[0].file;
* MODIFICAR (handleModify) ---> setObjImg(formData.img_preview, setImgFile);
* RESET ----------------------> setImgFile([]);
*
*/
//  ===================================== COMPONENTE =====================================
const MB = 1048576; //2621440=2.5MB

export const FileInputComponent = ({
   xsOffset = null,
   // loading = false,
   col,
   idName,
   label,
   helperText,
   disabled,
   hidden,
   marginBottom,
   color,
   // styleInput = 1,
   filePreviews,
   setFilePreviews,
   multiple,
   maxImages = -1,
   accept = null,
   ...props
}) => {
   const formik = useFormikContext();
   const isError = formik.touched[idName] && formik.errors[idName];

   const [uploadProgress, setUploadProgress] = useState(0);
   // const [filePreviews, setFilePreviews] = useState([]);
   const [ttShow, setTtShow] = useState("");
   const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

   const validationQuantityImages = () => {
      if (multiple) {
         if (maxImages != -1) {
            if (filePreviews.length >= maxImages) {
               console.log("maxImages", maxImages);
               Toast.Info(`Solo se permiten cargar ${maxImages} imagenes.`);
               return false;
            }
         }
      } else {
         if (filePreviews.length >= 1) {
            Toast.Info(`Solo se permite cargar una imagen.`);
            return false;
         }
      }
      return true;
   };

   const onDrop = useCallback((acceptedFiles) => {
      setFilePreviews([]);
      // if (multiple) if (!validationQuantityImages()) return
      // Puedes manejar los archivos aceptados aquí y mostrar las vistas previas.
      acceptedFiles.forEach((file) => {
         const reader = new FileReader();

         if (file.size >= MB) return Toast.Info("el archivo es demasiado pesado, intenta con un archivo menor a 1MB");

         reader.onload = async (e) => {
            const preview = {
               file,
               dataURL: reader.result
            };
            // if (multiple) if (!validationQuantityImages) return;

            // if (multiple) await setFilePreviews((prevPreviews) => [...prevPreviews, preview]);
            // else
            await setFilePreviews([preview]);
            // console.log(filePreviews);
         };

         reader.readAsDataURL(file);
      });
   }, []);

   const simulateUpload = () => {
      // Simulamos la carga con un temporizador.
      setTimeout(() => {
         const progress = uploadProgress + 10;
         setUploadProgress(progress);

         if (progress < 100) {
            // Si no se ha alcanzado el 100% de progreso, simulamos más carga.
            simulateUpload();
         } else {
            // Cuando se completa la carga, restablecemos el progreso.
            setUploadProgress(0);
         }
      }, 1000);
   };
   const handleRemoveImage = async (fileToRemove) => {
      if (disabled) return;
      // Filtra la lista de vistas previas para eliminar el archivo seleccionado.
      // console.log(filePreviews);
      // setFilePreviews((prevPreviews) => prevPreviews.filter((preview) => preview.file !== fileToRemove));
      await setFilePreviews([]);
      // console.log(filePreviews);
   };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop
   });

   const handleMouseEnter = () => {
      setTtShow("tt_show");
   };
   const handleMouseLeave = () => {
      setTtShow("");
   };

   useEffect(() => {
      // console.log("isError", isError);
   }, [idName, formik.values[idName]]);

   return (
      <>
         <Grid
            xs={12}
            xsOffset={xsOffset}
            md={col}
            sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBottom ? marginBottom : 2 }}
         >
            <FormControl fullWidth sx={{}}>
               <Typography variant="p" mb={1} sx={{ fontWeight: "bolder" }} htmlFor={idName} color={color}>
                  {label}
               </Typography>

               <Field name={idName} id={idName}>
                  {({ field, form }) => (
                     <>
                        <div className={"dropzone-container"}>
                           <div {...getRootProps({ className: color === "red" ? "dropzone-error" : "dropzone" })}>
                              <input {...getInputProps()} multiple={multiple} accept={accept} disabled={disabled} />
                              <p style={{ display: filePreviews.length > 0 ? "none" : "block", fontStyle: "italic" }}>
                                 Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos
                              </p>

                              {/* Vista previa de la imagen o PDF */}
                              <aside className={`file-preview`}>
                                 {filePreviews.map((preview) => (
                                    <div key={preview.file.name} className={"preview-item"}>
                                       {preview.file.name.includes(".pdf") || preview.file.name.includes(".PDF") ? (
                                          <>
                                             <embed
                                                className={"preview-pdf"}
                                                src={preview.dataURL}
                                                type="application/pdf"
                                                width="100%"
                                                height="500px"
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                             />
                                             {preview.file.name !== "undefined" && (
                                                <embed
                                                   className={`tooltip_imagen ${ttShow}`}
                                                   src={preview.dataURL}
                                                   type="application/pdf"
                                                   width="50%"
                                                   height="80%"
                                                   onMouseEnter={handleMouseEnter}
                                                   onMouseLeave={handleMouseLeave}
                                                />
                                             )}
                                             <div
                                                className={"remove-pdf-button"}
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   handleRemoveImage(preview.file);
                                                }}
                                                aria-disabled={disabled}
                                             >
                                                {!disabled && "Eliminar"}
                                             </div>
                                          </>
                                       ) : (
                                          <>
                                             <img className={"preview-img"} src={preview.dataURL} alt={preview.file.name} />
                                             {preview.file.name !== "undefined" && (
                                                <img
                                                   width={"50%"}
                                                   src={preview.dataURL}
                                                   alt={preview.file.name}
                                                   srcSet=""
                                                   className={`tooltip_imagen ${ttShow}`}
                                                   onMouseEnter={handleMouseEnter}
                                                   onMouseLeave={handleMouseLeave}
                                                />
                                             )}
                                             <div
                                                className={"remove-button"}
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   handleRemoveImage(preview.file);
                                                }}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                             >
                                                {!disabled && "Eliminar"}
                                             </div>
                                          </>
                                       )}
                                    </div>
                                 ))}
                              </aside>
                           </div>
                           <small style={{ marginTop: "-10px", fontStyle: "italic", fontSize: "11px" }}>
                              Tamaño maximo del archivo soportado: <b>1MB MAX.</b>
                           </small>
                        </div>
                        <Typography variant="body1" component="label" htmlFor={idName} ml={1}>
                           {isError ? formik.errors[idName] : helperText}
                        </Typography>
                     </>
                  )}
               </Field>
            </FormControl>
         </Grid>
      </>
   );
};

export const FileInputComponentORIGINAL = ({ idName, label, inputProps, filePreviews, setFilePreviews, error, touched, multiple, maxImages = -1, accept = null }) => {
   const [uploadProgress, setUploadProgress] = useState(0);
   // const [filePreviews, setFilePreviews] = useState([]);
   const [ttShow, setTtShow] = useState("");
   const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

   const validationQuantityImages = () => {
      if (multiple) {
         if (maxImages != -1) {
            if (filePreviews.length >= maxImages) {
               console.log("maxImages", maxImages);
               Toast.Info(`Solo se permiten cargar ${maxImages} imagenes.`);
               return false;
            }
         }
      } else {
         if (filePreviews.length >= 1) {
            Toast.Info(`Solo se permite cargar una imagen.`);
            return false;
         }
      }
      return true;
   };

   const onDrop = useCallback((acceptedFiles) => {
      setFilePreviews([]);
      // if (multiple) if (!validationQuantityImages()) return
      // Puedes manejar los archivos aceptados aquí y mostrar las vistas previas.
      acceptedFiles.forEach((file) => {
         const reader = new FileReader();

         if (file.size >= MB) return Toast.Info("el archivo es demasiado pesado, intenta con un archivo menor a 1MB");

         reader.onload = async (e) => {
            const preview = {
               file,
               dataURL: reader.result
            };
            // if (multiple) if (!validationQuantityImages) return;

            // if (multiple) await setFilePreviews((prevPreviews) => [...prevPreviews, preview]);
            // else
            await setFilePreviews([preview]);
            // console.log(filePreviews);
         };

         reader.readAsDataURL(file);
      });
   }, []);

   const simulateUpload = () => {
      // Simulamos la carga con un temporizador.
      setTimeout(() => {
         const progress = uploadProgress + 10;
         setUploadProgress(progress);

         if (progress < 100) {
            // Si no se ha alcanzado el 100% de progreso, simulamos más carga.
            simulateUpload();
         } else {
            // Cuando se completa la carga, restablecemos el progreso.
            setUploadProgress(0);
         }
      }, 1000);
   };
   const handleRemoveImage = async (fileToRemove) => {
      // Filtra la lista de vistas previas para eliminar el archivo seleccionado.
      // console.log(filePreviews);
      // setFilePreviews((prevPreviews) => prevPreviews.filter((preview) => preview.file !== fileToRemove));
      await setFilePreviews([]);
      // console.log(filePreviews);
   };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop
   });

   const handleMouseEnter = () => {
      setTtShow("tt_show");
   };
   const handleMouseLeave = () => {
      setTtShow("");
   };

   return (
      <>
         <FormControl fullWidth sx={{}}>
            <Typography variant="p" mb={1} sx={{ fontWeight: "bolder" }} htmlFor={idName}>
               {label}
            </Typography>

            <Field name={idName} id={idName}>
               {({ field, form }) => (
                  <>
                     <div className="dropzone-container">
                        <div {...getRootProps({ className: "dropzone" })}>
                           <input {...getInputProps()} multiple={multiple} accept={accept} />
                           <p style={{ display: filePreviews.length > 0 ? "none" : "block", fontStyle: "italic" }}>
                              Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos
                           </p>

                           {/* Vista previa de la imagen o PDF */}
                           <aside className="file-preview">
                              {filePreviews.map((preview) => (
                                 <div key={preview.file.name} className="preview-item">
                                    {preview.file.name.includes(".pdf") || preview.file.name.includes(".PDF") ? (
                                       <>
                                          <embed
                                             className="preview-pdf"
                                             src={preview.dataURL}
                                             type="application/pdf"
                                             width="100%"
                                             height="500px"
                                             onMouseEnter={handleMouseEnter}
                                             onMouseLeave={handleMouseLeave}
                                          />
                                          {preview.file.name !== "undefined" && (
                                             <embed
                                                className={`tooltip_imagen ${ttShow}`}
                                                src={preview.dataURL}
                                                type="application/pdf"
                                                width="50%"
                                                height="80%"
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                             />
                                          )}
                                          <div
                                             className="remove-pdf-button"
                                             onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveImage(preview.file);
                                             }}
                                          >
                                             Eliminar
                                          </div>
                                       </>
                                    ) : (
                                       <>
                                          <img className="preview-img" src={preview.dataURL} alt={preview.file.name} />
                                          {preview.file.name !== "undefined" && (
                                             <img
                                                width={"50%"}
                                                src={preview.dataURL}
                                                alt={preview.file.name}
                                                srcSet=""
                                                className={`tooltip_imagen ${ttShow}`}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                             />
                                          )}
                                          <div
                                             className="remove-button"
                                             onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveImage(preview.file);
                                             }}
                                             onMouseEnter={handleMouseEnter}
                                             onMouseLeave={handleMouseLeave}
                                          >
                                             Eliminar
                                          </div>
                                       </>
                                    )}
                                 </div>
                              ))}
                           </aside>
                        </div>
                        <small style={{ marginTop: "-10px", fontStyle: "italic", fontSize: "11px" }}>
                           Tamaño maximo del archivo soportado: <b>1MB MAX.</b>
                        </small>
                     </div>
                     {touched && error && (
                        <FormHelperText error id={`ht-${idName}`}>
                           {error}
                        </FormHelperText>
                     )}
                  </>
               )}
            </Field>
         </FormControl>
      </>
   );
};

const FileInputComponent1 = ({
   idName,
   label,
   placeholder,
   handleChange,
   handleBlur,
   inputProps,
   setFieldValue,
   setImgFile,
   imagePreview,
   setImagePreview,
   error,
   touched
}) => {
   const handleChangeImg = (event) => {
      // if (event.target.files)
      const file = event.target.files[0]; // Obtenemos el primer archivo del campo de entrada
      setImgFile(file);

      if (file) {
         const reader = new FileReader();

         reader.onload = (e) => {
            setImagePreview(e.target.result);
         };

         reader.readAsDataURL(file);
      }
   };

   return (
      <>
         <TextField
            id={idName}
            name={idName}
            label={label}
            type="file"
            // value={value}
            placeholder={placeholder}
            onChange={(e) => {
               handleChange(e);
               handleChangeImg(e, setFieldValue);
            }}
            onBlur={handleBlur}
            variant="standard"
            inputProps={inputProps}
            fullWidth
            // disabled={values.id == 0 ? false : true}
            // inputRef={(el) => (inputsRef.current[0] = el)}
            // inputRef={inputRefVehicle}
            error={error && touched}
            helperText={error && touched && error}
         />

         {/* Vista previa de la imagen */}
         <Box textAlign={"center"} sx={{ bgcolor: "#E9ECEF", borderRadius: "0  0 12px 12px" }}>
            {imagePreview && <img alt="Vista previa de la imagen" src={imagePreview} style={{ maxWidth: 250, maxHeight: 250 }} />}
         </Box>
      </>
   );
};

FileInputComponent.propTypes = {
   idName: propTypes.string.isRequired,
   label: propTypes.string.isRequired,
   inputProps: propTypes.object,
   // filePreviews: propTypes.any.isRequired,
   // setFilePreviews: propTypes.func.isRequired,
   error: propTypes.any,
   touched: propTypes.any,
   multiple: propTypes.bool,
   maxImages: propTypes.number
};
//#endregion INPUT FILE (Drag&Drop)
