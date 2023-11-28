import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
   TextField,
   Typography,
   useMediaQuery
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "../../../hooks/useScriptRef";
import Google from "../../../assets/others/icons/social-google.svg";
import AnimateButton from "../../../ui-component/extended/AnimateButton";
import { strengthColor, strengthIndicator } from "../../../utils/password-strength";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { useAuthContext } from "../../../context/AuthContextFirebase";
import { useRedirectTo } from "../../../hooks/useRedirectTo";
// import { register } from "../../../config/firebase";
import { LoadingButton } from "@mui/lab";
import { useAuthContext } from "../../../context/AuthContext";
import Toast from "../../../utils/Toast";

// ===========================|| FIREBASE - REGISTER ||=========================== //

const AuthRegister = ({ ...others }) => {
   const theme = useTheme();
   const scriptedRef = useScriptRef();
   const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
   const customization = useSelector((state) => state.customization);
   const [showPassword, setShowPassword] = useState(false);
   const [checked, setChecked] = useState(true);

   const [strength, setStrength] = useState(0);
   const [level, setLevel] = useState();

   // const googleHandler = async () => {
   //    console.error("Register");
   // };

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

   useEffect(() => {
      // changePassword("123456");
   }, []);

   const { register, login, loggetInCheck } = useAuthContext();

   const onSubmit = async ({ username, email, password }, { setSubmitting, setErrors, resetForm, setStatus }) => {
      try {
         const axiosRegister = await register({ username, email, password });
         // console.log(axiosRegister);
         setStatus({ success: true });
         if (axiosRegister.status_code != 200) return Toast.Customizable(axiosRegister.alert_text, axiosRegister.alert_icon);

         await login({ email, password });
         await loggetInCheck;

         setSubmitting(false);
         resetForm();
      } catch (error) {
         console.error(error);
         setStatus({ success: false });
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const validationSchema = Yup.object().shape({
      username: Yup.string().trim().required("Nombre de Usuario requerido"),
      email: Yup.string().email("Correo no valida").required("Correo requerido"),
      password: Yup.string().trim().min(6, "Mínimo 6 caracteres").required("Contraseña requerida")
   });

   return (
      <>
         <Grid container direction="column" justifyContent="center" spacing={2}>
            {/* <Grid item xs={12}>
               <AnimateButton>
                  <Button
                     variant="outlined"
                     fullWidth
                     onClick={googleHandler}
                     size="large"
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
                     Sign up with Google
                  </Button>
               </AnimateButton>
            </Grid> */}
            <Grid item xs={12}>
               <Box sx={{ alignItems: "center", display: "flex" }}>
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
                     Sign up with Email address
                  </Typography>
               </Box>
            </Grid> */}
         </Grid>

         <Formik
            initialValues={{
               username: "",
               email: "",
               password: "",
               submit: null
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
         >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
               <Box onSubmit={handleSubmit} {...others} component="form">
                  <Grid container spacing={matchDownSM ? 0 : 2}>
                     {/* <Grid item xs={12} sm={6}>
                        <TextField
                           fullWidth
                           label="Nombre(s)"
                           margin="normal"
                           name="name"
                           type="text"
                           defaultValue=""
                           sx={{ ...theme.typography.customInput }}
                        />
                     </Grid>
                     <Grid item xs={12} sm={6}>
                        <TextField
                           fullWidth
                           label="Apellidos"
                           margin="normal"
                           name="lname"
                           type="text"
                           defaultValue=""
                           sx={{ ...theme.typography.customInput }}
                        />
                     </Grid> */}
                     {/* Nombre de Usuario */}
                     <Grid item xs={12} sm={12}>
                        <TextField
                           id="username"
                           name="username"
                           value={values.username}
                           fullWidth
                           label="Nombre de Usuario *"
                           type="text"
                           placeholder=""
                           onChange={handleChange}
                           onBlur={handleBlur}
                           sx={{ ...theme.typography.customInput }}
                           error={errors.username && touched.username}
                           helperText={errors.username && touched.username && errors.username}
                        />
                     </Grid>
                  </Grid>
                  <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                     <InputLabel htmlFor="email">Correo Electrónico *</InputLabel>
                     <OutlinedInput
                        id="email"
                        name="email"
                        label="Correo Electrónico *"
                        type="email"
                        value={values.email}
                        placeholder=""
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

                  <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                     <InputLabel htmlFor="password">Contraseña *</InputLabel>
                     <OutlinedInput
                        id="password"
                        name="password"
                        label="Contraseña *"
                        autoComplete="false"
                        value={values.password}
                        type={showPassword ? "text" : "password"}
                        onBlur={handleBlur}
                        onChange={(e) => {
                           handleChange(e);
                           changePassword(e.target.value);
                        }}
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

                  {strength !== 0 && (
                     <FormControl fullWidth>
                        <Box sx={{ mb: 2 }}>
                           <Grid container spacing={2} alignItems="center">
                              <Grid item>
                                 <Box
                                    style={{ backgroundColor: level?.color }}
                                    sx={{
                                       width: 85,
                                       height: 8,
                                       borderRadius: "7px"
                                    }}
                                 />
                              </Grid>
                              <Grid item>
                                 <Typography variant="subtitle1" fontSize="0.75rem">
                                    {level?.label}
                                 </Typography>
                              </Grid>
                           </Grid>
                        </Box>
                     </FormControl>
                  )}

                  {/* <Grid container alignItems="center" justifyContent="space-between">
                     <Grid item>
                        <FormControlLabel
                           control={
                              <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                           }
                           label={
                              <Typography variant="subtitle1">
                                 Acepte los&nbsp;
                                 <Typography variant="subtitle1" component={Link} to="#">
                                    Términos y condiciones.
                                 </Typography>
                              </Typography>
                           }
                        />
                     </Grid>
                  </Grid> */}
                  {/* {errors.submit && (
                     <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                     </Box>
                  )} */}

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
                           Registrarme
                        </LoadingButton>
                     </AnimateButton>
                  </Box>
               </Box>
            )}
         </Formik>
      </>
   );
};

export default AuthRegister;
