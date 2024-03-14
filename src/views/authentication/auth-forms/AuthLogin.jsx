import { useContext, useState } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
   Box,
   Button,
   Checkbox,
   Divider,
   FormControl,
   FormControlLabel,
   FormHelperText,
   Grid,
   IconButton,
   InputAdornment,
   InputLabel,
   OutlinedInput,
   Stack,
   TextField,
   Typography,
   useMediaQuery
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "../../../hooks/useScriptRef";
import AnimateButton from "../../../ui-component/extended/AnimateButton";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Google from "../../../assets/others/icons/social-google.svg";
import { LoadingButton } from "@mui/lab";
// import { useAuthContext } from "../../../../context/AuthContextFirebase";
// import { login } from "../../../../config/firebase";
import { useAuthContext } from "../../../context/AuthContext";
// import { login } from "../../../../config/database";

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
   const theme = useTheme();
   const scriptedRef = useScriptRef();
   const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
   const customization = useSelector((state) => state.customization);
   const [checked, setChecked] = useState(true);
   const [inputUsername, setInputUserName] = useState(true);

   const { login, loggetInCheck } = useAuthContext();

   const googleHandler = async () => {
      console.error("Login");
   };

   const [showPassword, setShowPassword] = useState(false);
   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const handleInputUsername = (e) => {
      // console.log(e.target.value);
      if (e.target.value.includes("@")) setInputUserName(false);
      else setInputUserName(true);
      // console.log(inputUsername);
   };

   const onSubmit = async ({ email, password }, { setSubmitting, setErrors, resetForm }) => {
      try {
         await login({ email, password });
         await loggetInCheck;
         resetForm();
         if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
         }
      } catch (error) {
         console.error(error);
         if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
         }
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
      }
   };

   const validationSchemas = () => {
      let validationSchema;
      if (inputUsername)
         validationSchema = Yup.object().shape({
            email: Yup.string().trim().required("Nombre de usario o Correo requerido"),
            password: Yup.string().trim().min(6, "Mínimo 6 caracteres").required("Contraseña requerida")
         });
      else
         validationSchema = Yup.object().shape({
            email: Yup.string().email("Correo no valida").required("Nombre de usario o Correo requerido"),
            password: Yup.string().trim().min(3, "Mínimo 6 caracteres").required("Contraseña requerida")
         });
      return validationSchema;
   };

   return (
      <>
         <Grid container direction="column" justifyContent="center" spacing={2}>
            {/* <Grid item xs={12}>
               <AnimateButton>
                  <Button
                     disableElevation
                     fullWidth
                     onClick={googleHandler}
                     size="large"
                     variant="outlined"
                     sx={{
                        color: "grey.700",
                        backgroundColor: theme.palette.grey[50],
                        borderColor: theme.palette.grey[100]
                     }}
                  >
                     <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                        <img
                           src={Google}
                           alt="google"
                           width={16}
                           height={16}
                           style={{ marginRight: matchDownSM ? 8 : 16 }}
                        />
                     </Box>
                     Sign in with Google
                  </Button>
               </AnimateButton>
            </Grid> */}
            <Grid item xs={12}>
               <Box
                  sx={{
                     alignItems: "center",
                     display: "flex"
                  }}
               >
                  <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                  {/* <Button
                     variant="outlined"
                     sx={{
                        cursor: "unset",
                        m: 2,
                        py: 0.5,
                        px: 7,
                        borderColor: `${theme.palette.grey[100]} !important`,
                        color: `${theme.palette.grey[900]}!important`,
                        fontWeight: 500,
                        borderRadius: `${customization.borderRadius}px`
                     }}
                     disableRipple
                     disabled
                  >
                     OR
                  </Button> */}

                  <Divider sx={{ flexGrow: 1, my: 1 }} orientation="horizontal" />
               </Box>
            </Grid>
            {/* <Grid
               item
               xs={12}
               container
               alignItems="center"
               justifyContent="center"
            >
               <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                     Sign in with Email address
                  </Typography>
               </Box>
            </Grid> */}
         </Grid>

         <Formik
            initialValues={{
               email: "",
               password: "",
               submit: null
            }}
            validationSchema={validationSchemas}
            onSubmit={onSubmit}
         >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
               <Box onSubmit={handleSubmit} {...others} component="form">
                  <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                     <InputLabel htmlFor="email">Nombre de Usuario o Correo Electrónico</InputLabel>
                     <OutlinedInput
                        id="email"
                        name="email"
                        label="Nombre de Usuario o Correo Electrónico"
                        type={"text"}
                        value={values.email}
                        placeholder="Ingrese su nombre de usuario o correo electrónico"
                        onInput={handleInputUsername}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        inputProps={{}}
                     />
                     {touched.email && errors.email && (
                        <FormHelperText error id="ht-email">
                           {errors.email}
                        </FormHelperText>
                     )}
                  </FormControl>

                  {/* <TextField
                     id="email"
                     name="email"
                     label="Correo Electrónico"
                     type="email"
                     value={values.email}
                     placeholder="correo@ejemplo.com"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     sx={{ mb: 3 }}
                     error={errors.email && touched.email}
                     helperText={errors.email && touched.email && errors.email}
                  /> */}

                  <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                     <InputLabel htmlFor="password">Contraseña</InputLabel>
                     <OutlinedInput
                        id="password"
                        name="password"
                        label="Contraseña"
                        value={values.password}
                        type={showPassword ? "text" : "password"}
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        inputProps={{}}
                     />
                     {touched.password && errors.password && (
                        <FormHelperText error id="ht-password">
                           {errors.password}
                        </FormHelperText>
                     )}
                  </FormControl>
                  {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                     <FormControlLabel
                        control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
                        label="Recordarme"
                     />
                     <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: "none", cursor: "pointer" }}>
                        ¿Has olvidado tú contraseña?
                     </Typography>
                  </Stack> */}
                  {errors.submit && (
                     <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                     </Box>
                  )}

                  <Box sx={{ mt: 2 }}>
                     <AnimateButton>
                        <LoadingButton
                           type="submit"
                           disabled={isSubmitting}
                           loading={isSubmitting}
                           // loadingPosition="start"
                           variant="contained"
                           color="secondary"
                           fullWidth
                           size="large"
                        >
                           Iniciar Sesión
                        </LoadingButton>
                     </AnimateButton>
                  </Box>
               </Box>
            )}
         </Formik>
      </>
   );
};

export default FirebaseLogin;
