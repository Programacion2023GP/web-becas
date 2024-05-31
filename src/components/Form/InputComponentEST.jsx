import React, { useContext, useEffect } from "react";
/// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Field, useFormikContext } from "formik"; // Importa el hook useFormikContext
import InputMask from "react-input-mask";
import { handleInputFormik } from "../../utils/Formats";
import { Grid } from "@mui/material";

export const InputComponentEST = ({
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
   ...props
}) => {
   const formik = useFormikContext(); // Obtiene el contexto de Formik
   const errors = formik.errors;
   const error = formik.touched[idName] && formik.errors[idName] ? formik.errors[idName] : null;
   const isError = error == null ? false : true;

   useEffect(() => {
      console.log("isError", isError);
   }, [idName]);

   return (
      <Grid
         item
         xs={12}
         md={col}
         sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBottom ? `${marginBottom} 0` : 2 }}
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
