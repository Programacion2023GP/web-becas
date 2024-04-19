import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Field, useFormikContext } from "formik"; // Importa el hook useFormikContext
import InputMask from "react-input-mask";
import { handleInputFormik } from "../../utils/Formats";

export const InputComponentEST = ({
   loading = false,
   col,
   label,
   idName = "idName",
   type = null,
   disabled,
   placeholder,
   leyend,
   color,
   rows,
   hidden,
   mask,
   marginBoton,
   textStyleCase = null,
   ...props
}) => {
   const formik = useFormikContext(); // Obtiene el contexto de Formik
   const errors = formik.errors;
   const isError = formik.touched[idName] && formik.errors[idName];

   const InputTextField = () => (
      <TextField
         key={"text_" + idName}
         name={idName}
         label={label}
         placeholder={placeholder}
         type={type !== null && type !== undefined ? type : "text"} // Utiliza type si está definido, de lo contrario, usa "text"
         variant="outlined"
         value={formik.values && formik.values[idName] ? formik.values[idName] : ""}
         onChange={formik.handleChange} // Utiliza el handleChange de Formik
         onBlur={(e) => {
            formik.handleBlur(e); // Usa handleBlur de Formik para manejar el blur

            // Agrega tu lógica adicional aquí
            // Por ejemplo, puedes agregar variables o eventos al contexto DebugerContext
         }}
         {...props}
         onInput={textStyleCase != null ? (e) => handleInputFormik(e, formik.setFieldValue, idName, textStyleCase) : null}
         disabled={loading || disabled}
         fullWidth
         multiline={type === null || type === undefined} // Habilita multiline solo si type no está definido
         rows={type === null || type === undefined ? rows : undefined} // Establece las filas solo si type no está definido
         error={isError}
         helperText={isError ? formik.errors[idName] : leyend}
         InputLabelProps={{
            style: color ? { color: color } : {}
         }}
      />
   );

   useEffect(() => {}, [idName]);

   return (
      <>
         <Grid
            xs={col}
            sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", position: "relative", mb: marginBoton ? `${marginBoton} 0` : 2 }}
         >
            {mask ? (
               <Field name={idName}>
                  {({ field }) => (
                     <InputMask
                        id={idName}
                        mask={mask}
                        value={formik.values && formik.values[idName] ? formik.values[idName] : ""}
                        onChange={(e) => field.onChange(e)} // Utiliza field.onChange para actualizar el valor en Formik
                        onBlur={(e) => field.onBlur(e)} // Utiliza field.onBlur para manejar el desenfoque y activar la validación
                        disabled={loading || disabled}
                     >
                        {(inputProps) => (
                           <TextField
                              {...inputProps}
                              key={"text_" + idName}
                              name={idName}
                              label={label}
                              type={type !== null && type !== undefined ? type : "text"} // Utiliza type si está definido, de lo contrario, usa "text"
                              variant="outlined"
                              fullWidth
                              {...props}
                              error={isError}
                              helperText={isError ? formik.errors[idName] : placeholder}
                              InputLabelProps={{
                                 style: color ? { color: color } : {}
                              }}
                           />
                        )}
                     </InputMask>
                  )}
               </Field>
            ) : (
               <InputTextField />
            )}
            {loading && <CircularProgress sx={{ position: "absolute", top: "40%", left: "40%" }} />}
         </Grid>
      </>
   );
};
