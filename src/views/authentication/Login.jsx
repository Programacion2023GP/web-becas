import { Link, Navigate } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthWrapper from "./AuthWrapper";
import AuthCardWrapper from "./AuthCardWrapper";
import AuthLogin from "./auth-forms/AuthLogin";
import Logo from "../../ui-component/Logo";
import AuthFooter from "../../ui-component/cards/AuthFooter";
// import { useAuthContext } from "../../../../context/AuthContextFirebase";
import { useRedirectTo } from "../../hooks/useRedirectTo";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { useGlobalContext } from "../../context/GlobalContext";

// assets

// ================================|| AUTH3 - LOGIN ||================================ //
const Login = () => {
   const { auth } = useAuthContext();
   const { setLoading } = useGlobalContext();
   // useRedirectTo(auth, "/admin");

   useEffect(() => {
      setLoading(false);
      setTimeout(() => {
         setLoading(false);
      }, 5000);
   }, []);

   const theme = useTheme();
   const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

   return auth ? (
      <Navigate to={auth.page_index ?? "/admin"} />
   ) : (
      <>
         <AuthWrapper className="bg-login" sx={{ backgroundColor: "transparent !important" }}>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh", zIndex: 20, backgroundColor: "transparent !important" }}>
               <Grid item xs={12} sx={{ zIndex: 20 }}>
                  <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "calc(100vh - 68px)", zIndex: 20 }}>
                     <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                        <AuthCardWrapper>
                           <Grid container spacing={2} alignItems="center" justifyContent="center">
                              <Grid item sx={{ mb: 3 }}>
                                 {/* <Link to="#"> */}
                                 <Logo />
                                 {/* </Link> */}
                              </Grid>
                              <Grid item xs={12}>
                                 <Grid container direction={matchDownSM ? "column-reverse" : "row"} alignItems="center" justifyContent="center">
                                    <Grid item>
                                       <Stack alignItems="center" justifyContent="center" spacing={1}>
                                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? "h3" : "h2"}>
                                             Hola, bienvenido
                                          </Typography>
                                          <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? "center" : "inherit"}>
                                             Ingrese sus credenciales para continuar
                                          </Typography>
                                       </Stack>
                                    </Grid>
                                 </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                 <AuthLogin />
                              </Grid>
                              <Grid item xs={12}>
                                 <Divider />
                              </Grid>
                              <Grid item xs={12}>
                                 <Grid item container direction="column" alignItems="center" xs={12}>
                                    <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: "none" }}>
                                       ¿No tienes una cuenta?
                                    </Typography>
                                 </Grid>
                              </Grid>
                           </Grid>
                        </AuthCardWrapper>
                     </Grid>
                  </Grid>
               </Grid>
               <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                  <AuthFooter />
               </Grid>
            </Grid>
         </AuthWrapper>
      </>
   );
};

export default Login;
