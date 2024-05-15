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
   Tooltip,
   RadioGroup,
   Radio,
   Checkbox,
   Divider
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
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/es";

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
               multiline={rows > 0 ? true : false}
               rows={rows && rows} // Establece las filas solo si type no está definido
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
   col,
   idName,
   title,
   hidden,
   options,
   handleGetValue,
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
      <Grid lg={col} xl={col} xs={12} md={12} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center" }}>
         <Typography variant="subtitle1" align="center" color="textPrimary" sx={{ marginBottom: "1rem" }}>
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
                           marginBottom: rowLayout ? 0 : "8px", // Espacio entre los radio buttons si están en columnas
                           "& .MuiRadio-root": {
                              color: "#1976d2"
                           },
                           "& .MuiFormControlLabel-label": {
                              color: "#1976d2",
                              fontSize: "14px"
                           },
                           "& .Mui-checked": {
                              color: "#1976d2"
                           }
                        }}
                     />
                  ))}
               </>
            )}
         </RadioGroup>
         {isError && (
            <Typography variant="body2" color="error">
               {errors[idName]}
            </Typography>
         )}
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
export const CheckboxComponent = ({ loading = false, col, label, idName, checked = false, value, disabled, rowLayout = true, color = "primary" }) => {
   const [checkedComponent, setCheckedComponent] = useState(checked); // Estado inicializado como falso
   const formik = useFormikContext();
   const isError = formik.touched[idName] && formik.errors[idName];

   useEffect(() => {
      if (checked) {
         formik.setFieldValue(idName, value);
      }
      // console.log("aqui", formik.values[idName]);
   }, [checked, formik.values[idName]]);

   return (
      <>
         {rowLayout && <Grid item xs={12} />}
         <Grid xs={col} sx={{ display: "flex", alignItems: "center", position: "relative" }}>
            <FormControlLabel
               control={
                  <Checkbox
                     name={idName}
                     checked={checkedComponent}
                     onChange={(e) => {
                        const checked = e.target.checked;
                        setCheckedComponent(checked); // Actualiza el estado del componente
                        formik.setFieldValue(idName, checked ? value : undefined);
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
const DatePickerComponent = ({ loading = false, col, idName, label, format = "DD/MM/YYYY", disabled, hidden, marginBoton, ...props }) => {
   const formik = useFormikContext();
   const { errors, touched } = formik;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName] : null;
   const isError = error == null ? false : true;
   dayjs.locale("es");

   useEffect(() => {}, [errors[idName], touched[idName]]);

   return (
      <Grid xs={12} md={col} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBoton ? `${marginBoton} 0` : 2 }}>
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

export default DatePickerComponent;
//#endregion DATEPICKER COMPONENT
