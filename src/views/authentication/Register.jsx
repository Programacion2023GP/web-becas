import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthWrapper from "./AuthWrapper";
import AuthCardWrapper from "./AuthCardWrapper";
import Logo from "../../ui-component/Logo";
import AuthRegister from "./auth-forms/AuthRegister";
import AuthFooter from "../../ui-component/cards/AuthFooter";
import { useRedirectTo } from "../../hooks/useRedirectTo";
// import { useAuthContext } from "../../context/AuthContextFirebase";
import { useAuthContext } from "../../context/AuthContext";
import { useGlobalContext } from "../../context/GlobalContext";
import { useEffect } from "react";

// assets

// ===============================|| AUTH3 - REGISTER ||=============================== //

const Register = () => {
   const { auth } = useAuthContext();
   const { setLoading } = useGlobalContext();
   useRedirectTo(auth, "/admin");

   useEffect(() => {
      setLoading(false);
   }, []);

   const theme = useTheme();
   const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

   return (
      <AuthWrapper className="bg-login">
         <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh" }}>
            <Grid item xs={12} sx={{ zIndex: 2 }}>
               <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "calc(100vh - 68px)" }}>
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
                                          ¡REGISTRATE!
                                       </Typography>
                                       <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? "center" : "inherit"}>
                                          Ingresa los datos siguientes
                                       </Typography>
                                    </Stack>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={12}>
                              <AuthRegister />
                           </Grid>
                           <Grid item xs={12}>
                              <Divider />
                           </Grid>
                           <Grid item xs={12}>
                              <Grid item container direction="column" alignItems="center" xs={12}>
                                 <Typography component={Link} to="/login" variant="subtitle1" sx={{ textDecoration: "none" }}>
                                    Ya tengo cuenta, Ingresar
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
   );
};

export default Register;
