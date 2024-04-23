import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
   CircularProgress,
   FormControl,
   FormControlLabel,
   FormHelperText,
   IconButton,
   InputAdornment,
   InputLabel,
   OutlinedInput,
   Switch,
   Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { strengthColor, strengthIndicator } from "../../utils/password-strength";

export const InputPasswordCompnent = ({
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
   const isError = formik.touched[idName] ? formik.errors[idName] : false;

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

   return (
      <Grid
         xs={12}
         md={col}
         sx={{
            // backgroundColor: "yellow",
            // border: 1,
            display: hidden ? "none" : "flex",
            flexDirection: "column",
            alignItems: "start",
            position: "relative",
            mb: marginBoton ? `${marginBoton} 0` : 2,
            mt: checkedShowSwitchPassword ? -5.85 : -0.75
         }}
      >
         {/* Switch para mostrar el cambiar contraseña */}
         {checkedShowSwitchPassword && (
            <Grid sx={{ backgroundColor: "", my: 0, py: 0, mt: 2, mb: -1.75 }}>
               <FormControlLabel
                  control={<Switch />}
                  label={"Cambiar Contraseña"}
                  checked={newPasswordChecked}
                  onChange={() => setNewPasswordChecked(!newPasswordChecked)}
               />
            </Grid>
         )}
         {/* Contraseña */}
         <Grid xs={12} sx={{ backgroundColor: "" }}>
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
                     {isError ? formik.errors[idName] : helperText}
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
