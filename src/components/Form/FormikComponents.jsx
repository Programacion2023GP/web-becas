import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import React, { forwardRef, useEffect, useState } from "react";
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
   Tooltip
} from "@mui/material";
import { Formik, Field, useFormikContext } from "formik";
import InputMask from "react-input-mask";
// import CircularProgress from "@mui/material/CircularProgress";
import { handleInputFormik } from "../../utils/Formats";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { strengthColor, strengthIndicator } from "../../utils/password-strength";
import Toast from "../../utils/Toast";
import { IconReload } from "@tabler/icons";
import SwitchIOSComponent from "../SwitchIOSComponent";

//#region FORMIK COMPONENT
//#region IMPORTS
// import { LoadingButton } from "@mui/lab";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
// import { Button } from "@mui/material";
// import { Formik } from "formik";
// import { useEffect } from "react";
//#endregion IMPORTS

export const FormikComponent = forwardRef(
   ({ initialValues = {}, validationSchema = {}, onSubmit, children, textBtnSubmit, formikRef = null, handleCancel, showActionButtons = true }, ref) => {
      useEffect(() => {
         // console.log("useEffect del FormikComponent");
      }, []);

      return (
         <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} innerRef={formikRef == null ? ref : formikRef}>
            {({ handleSubmit, isSubmitting, resetForm }) => (
               <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
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

export const InputComponent = ({
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
   marginBoton,
   textStyleCase = null,
   ...props
}) => {
   const formik = useFormikContext(); // Obtiene el contexto de Formik
   const errors = formik.errors;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName] : null;
   const isError = error == null ? false : true;

   useEffect(() => {
      // console.log("isError", isError);
   }, [idName]);

   return (
      <Grid xs={12} md={col} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBoton ? `${marginBoton} 0` : 2 }}>
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
            <TextField
               key={idName}
               name={idName}
               label={label}
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
               multiline={type === null || type === undefined} // Habilita multiline solo si type no está definido
               rows={type === null || type === undefined ? rows : undefined} // Establece las filas solo si type no está definido
               error={isError}
               helperText={isError ? error : helperText}
               InputLabelProps={{
                  style: color ? { color: color } : {}
               }}
            />
         )}
         {loading && <CircularProgress sx={{ position: "absolute", top: "40%", left: "40%" }} />}
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
   marginBoton,
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
            mb: marginBoton ? `${marginBoton} 0` : 2,
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
   marginBoton,
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
            <Grid xs={12} md={col} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBoton ? `${marginBoton} 0` : 2 }}>
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

                  {isError && (
                     <FormHelperText error id={`ht-${idName}`}>
                        {isError ? error : helperText}
                     </FormHelperText>
                  )}
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
   marginBoton,
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
      <Grid xs={12} md={col} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "start", mb: marginBoton ? `${marginBoton} 0` : 2 }}>
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
