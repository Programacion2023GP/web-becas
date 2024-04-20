import React, { useContext, useEffect } from "react";
import { Grid, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Field, useFormikContext } from "formik"; // Importar Field y useFormikContext de Formik

export const RadioButtonComponent = ({
   col,
   name,
   title,
   hidden,
   options,
   loading = false,
   handleGetValue,
   rowLayout = true // Cambiar a false para poner en columnas
}) => {
   const { values, errors, touched, handleChange, handleBlur } = useFormikContext(); // Obtener valores, errores y funciones de Formik

   useEffect(() => {}, [title, name, values[name]]);

   const isError = touched[name] && errors[name];
   const handleValue = (name, value) => {
      if (handleGetValue) {
         handleGetValue(name, value);
      }
   };
   return (
      <Grid item xs={12} md={col} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center" }}>
         <Typography
            variant="subtitle1"
            align="center"
            color="textPrimary"
            sx={{ marginBottom: "1rem" }} // Agregar espacio debajo del título
         >
            {title}
         </Typography>
         <RadioGroup
            name={name}
            value={values[name]} // Usar el valor del formulario
            defaultValue={1}
            onChange={handleChange} // Usar la función de cambio de Formik
            onBlur={handleBlur} // Usar la función de desenfoque de Formik
            sx={{ flexDirection: rowLayout ? "row" : "column" }} // Ajustar la dirección del grupo de radio
         >
            {options.map((option, index) => (
               <FormControlLabel
                  key={index}
                  value={option.value}
                  onClick={() => {
                     //  console.log("hola", handleGetValue);
                     handleValue(name, option.value);
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
         </RadioGroup>
         {isError && (
            <Typography variant="body2" color="error">
               {errors[name]}
            </Typography>
         )}
         {loading && <CircularProgress sx={{ position: "absolute", top: "40%", left: "40%" }} />}
      </Grid>
   );
};
