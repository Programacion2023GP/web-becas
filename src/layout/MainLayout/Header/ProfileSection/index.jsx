import { useState, useRef, useEffect, forwardRef } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
   Avatar,
   Box,
   Button,
   ButtonGroup,
   Card,
   CardContent,
   Chip,
   ClickAwayListener,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Divider,
   FormControl,
   FormHelperText,
   IconButton,
   InputAdornment,
   InputLabel,
   List,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   OutlinedInput,
   Paper,
   Popper,
   Slide,
   Stack,
   Switch,
   TextField,
   Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "../../../../ui-component/cards/MainCard";
import Transitions from "../../../../ui-component/extended/Transitions";
import UpgradePlanCard from "./UpgradePlanCard";
import User1 from "../../../../assets/others/users/user-round.svg";

// assets
import { IconLogout, IconSearch, IconSettings, IconSquareAsterisk, IconUser } from "@tabler/icons";
// import { useAuthContext } from "../../../../context/AuthContextFirebase";
import { useAuthContext } from "../../../../context/AuthContext";
import Toast from "../../../../utils/Toast";
import { Formik } from "formik";
import * as Yup from "yup";
import { strengthColor, strengthIndicator } from "../../../../utils/password-strength";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { logout } from "../../../../config/firebase";

// ==============================|| PROFILE MENU ||============================== //

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileSection = () => {
   const theme = useTheme();
   const customization = useSelector((state) => state.customization);
   const navigate = useNavigate();

   const [sdm, setSdm] = useState(true);
   const [value, setValue] = useState("");
   const [notification, setNotification] = useState(false);
   const [selectedIndex, setSelectedIndex] = useState(-1);
   const [open, setOpen] = useState(false);

   // #region Boton de Contraseña
   const { setLoadingAction, openDialog, setOpenDialog, toggleDrawer } = useGlobalContext();
   const { changePasswordAuth } = useAuthContext();
   const [newPasswordChecked, setNewPasswordChecked] = useState(true);
   const [formData, setFormData] = useState({
      password: "",
      new_password: ""
   });
   const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [checkedShowSwitchPassword, setCheckedShowSwitchPassword] = useState(true);

   const [strength, setStrength] = useState(0);
   const [level, setLevel] = useState();
   const [strengthNew, setStrengthNew] = useState(0);
   const [levelNew, setLevelNew] = useState();

   const handleClickShowPassword = (setShowPassword, showPassword) => {
      setShowPassword(!showPassword);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const changePassword = (value, setStrength, setLevel) => {
      const temp = strengthIndicator(value);
      setStrength(temp);
      setLevel(strengthColor(temp));
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm, setFieldValue }) => {
      try {
         console.log("formData", formData);
         console.log("values", values);
         // return;

         setLoadingAction(true);
         const axiosResponse = await changePasswordAuth(values);
         // console.log(axiosResponse);
         if (axiosResponse.status_code == 200 && axiosResponse.alert_icon == "success") {
            await resetForm();
            setStrength(0);
         }
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("formData", formData);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         Toast.Error(error);
      } finally {
         setSubmitting(false);
      }
   };
   // #endregion Boton de Contraseña

   /**
    * anchorRef is used on different componets and specifying one type leads to other components throwing an error
    * */
   const anchorRef = useRef(null);

   const { logout } = useAuthContext();
   const authUser = JSON.parse(localStorage.getItem("auth"));
   // const full_name = authUser.username;

   const handleChangePassword = () => {
      try {
         setOpenModalChangePassword(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const handleCloseModalChangePassword = (resetForm) => {
      setOpenModalChangePassword(false);
      setStrength(0);
      setStrengthNew(0);
      if (typeof resetForm == "function") resetForm();
      setFormData({ password: "", new_password: "" });
   };
   const validationSchema = Yup.object().shape({
      password: Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida"),
      new_password: Yup.string().trim().min(6, "La Contraseña debe de tener mínimo 6 caracteres").required("Contraseña requerida")
   });

   const handleReset = (resetForm, setFieldValue, id) => {
      try {
         resetForm();
         // resetAdministrator();
         setStrength(0);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleLogout = async () => {
      // console.log("Logout");
      try {
         await logout();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
         return;
      }
      setOpen(false);
   };

   const handleListItemClick = (event, index, route = "") => {
      setSelectedIndex(index);
      handleClose(event);

      if (route && route !== "") {
         navigate(route);
      }
   };
   const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
   };

   const prevOpen = useRef(open);
   useEffect(() => {
      if (prevOpen.current === true && open === false) {
         anchorRef.current.focus();
      }

      prevOpen.current = open;
   }, [open]);

   function stringToColor(string) {
      let hash = 0;
      let i;

      /* eslint-disable no-bitwise */
      for (i = 0; i < string.length; i += 1) {
         hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = "#";

      for (i = 0; i < 3; i += 1) {
         const value = (hash >> (i * 8)) & 0xff;
         color += `00${value.toString(16)}`.slice(-2);
      }
      /* eslint-enable no-bitwise */

      return color;
   }

   function stringAvatar(name) {
      let letters = "US";
      // console.log(name);
      if (name != undefined) {
         if (name.includes(" ")) {
            letters = name.length < 3 ? "?" : `${name.split(" ")[0][0].toUpperCase()}${name.split(" ")[1][0].toUpperCase()}`;
         } else {
            letters = name.length < 2 ? "?" : `${name.substring(0, 2).toUpperCase()}`;
         }
      }

      return {
         sx: {
            bgcolor: stringToColor(letters)
         },
         children: letters
      };
   }

   return (
      <>
         <Chip
            sx={{
               height: "48px",
               alignItems: "center",
               borderRadius: "27px",
               transition: "all .2s ease-in-out",
               borderColor: theme.palette.primary.light,
               backgroundColor: theme.palette.primary.light,
               '&[aria-controls="menu-list-grow"], &:hover': {
                  borderColor: theme.palette.primary.main,
                  background: `${theme.palette.primary.main}!important`,
                  color: theme.palette.primary.light,
                  "& svg": {
                     stroke: theme.palette.primary.light
                  }
               },
               "& .MuiChip-label": {
                  lineHeight: 0
               }
            }}
            icon={
               <Avatar
                  // src={User1}
                  {...stringAvatar(authUser.username)}
                  sx={{
                     ...theme.typography.mediumAvatar,
                     margin: "8px 0 8px 8px !important",
                     cursor: "pointer"
                  }}
                  ref={anchorRef}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  color="inherit"
               />
            }
            label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
            variant="outlined"
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="primary"
         />
         <Popper
            placement="bottom-end"
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            popperOptions={{
               modifiers: [
                  {
                     name: "offset",
                     options: {
                        offset: [0, 14]
                     }
                  }
               ]
            }}
         >
            {({ TransitionProps }) => (
               <Transitions in={open} {...TransitionProps}>
                  <Paper>
                     <ClickAwayListener onClickAway={handleClose}>
                        <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                           <Box sx={{ p: 2, pb: 0 }}>
                              <Stack>
                                 <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="h4">Hey, Hola!</Typography>
                                    <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                       {authUser.username}
                                    </Typography>
                                 </Stack>
                                 {/* <Typography variant="subtitle2">Project Admin</Typography> */}
                              </Stack>
                              {/* <OutlinedInput
                                 sx={{ width: "100%", pr: 1, pl: 2, my: 2 }}
                                 id="input-search-profile"
                                 value={value}
                                 onChange={(e) => setValue(e.target.value)}
                                 placeholder="Search profile options"
                                 startAdornment={
                                    <InputAdornment position="start">
                                       <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                                    </InputAdornment>
                                 }
                                 aria-describedby="search-helper-text"
                                 inputProps={{
                                    "aria-label": "weight"
                                 }}
                              /> */}
                              <Divider sx={{ mt: 2 }} />
                           </Box>
                           {/* <PerfectScrollbar
                              style={{
                                 height: "100%",
                                 maxHeight: "calc(50vh - 250px)",
                                 overflowX: "hidden"
                              }}
                           > */}
                           <Box sx={{ p: 2, pt: 0 }}>
                              {/* <UpgradePlanCard /> */}
                              {/* <Divider /> */}
                              {/* <Card
                                    sx={{
                                       bgcolor: theme.palette.primary.light,
                                       my: 2
                                    }}
                                 >
                                    <CardContent>
                                       <Grid container spacing={3} direction="column">
                                          <Grid item>
                                             <Grid item container alignItems="center" justifyContent="space-between">
                                                <Grid item>
                                                   <Typography variant="subtitle1">Start DND Mode</Typography>
                                                </Grid>
                                                <Grid item>
                                                   <Switch color="primary" checked={sdm} onChange={(e) => setSdm(e.target.checked)} name="sdm" size="small" />
                                                </Grid>
                                             </Grid>
                                          </Grid>
                                          <Grid item>
                                             <Grid item container alignItems="center" justifyContent="space-between">
                                                <Grid item>
                                                   <Typography variant="subtitle1">Allow Notifications</Typography>
                                                </Grid>
                                                <Grid item>
                                                   <Switch checked={notification} onChange={(e) => setNotification(e.target.checked)} name="sdm" size="small" />
                                                </Grid>
                                             </Grid>
                                          </Grid>
                                       </Grid>
                                    </CardContent>
                                 </Card> */}
                              {/* <Divider /> */}
                              <List
                                 component="nav"
                                 sx={{
                                    width: "10%",
                                    maxWidth: 350,
                                    minWidth: 200,
                                    backgroundColor: theme.palette.background.paper,
                                    borderRadius: "10px",
                                    [theme.breakpoints.down("md")]: {
                                       minWidth: "100%"
                                    },
                                    "& .MuiListItemButton-root": {
                                       mt: 0.5
                                    }
                                 }}
                              >
                                 {/* <ListItemButton
                                    sx={{
                                       borderRadius: `${customization.borderRadius}px`
                                    }}
                                    selected={selectedIndex === 0}
                                    onClick={(event) => handleListItemClick(event, 0, "#")}
                                 >
                                    <ListItemIcon>
                                       <IconSettings stroke={1.5} size="1.3rem" />
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Configuraciones</Typography>} />
                                 </ListItemButton>
                                 <ListItemButton
                                    sx={{
                                       borderRadius: `${customization.borderRadius}px`
                                    }}
                                    selected={selectedIndex === 1}
                                    onClick={(event) => handleListItemClick(event, 1, "#")}
                                 >
                                    <ListItemIcon>
                                       <IconUser stroke={1.5} size="1.3rem" />
                                    </ListItemIcon>
                                    <ListItemText
                                       primary={
                                          <Grid container spacing={1} justifyContent="space-between">
                                             <Grid item>
                                                <Typography variant="body2">Perfil</Typography>
                                             </Grid>
                                          </Grid>
                                       }
                                    />
                                 </ListItemButton> */}
                                 <ListItemButton
                                    sx={{
                                       borderRadius: `${customization.borderRadius}px`
                                    }}
                                    selected={selectedIndex === 3}
                                    onClick={handleChangePassword}
                                 >
                                    <ListItemIcon>
                                       <IconSquareAsterisk stroke={1.5} size="1.3rem" />
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Cambiar Contraseña</Typography>} />
                                 </ListItemButton>
                                 <ListItemButton
                                    sx={{
                                       borderRadius: `${customization.borderRadius}px`
                                    }}
                                    selected={selectedIndex === 4}
                                    onClick={handleLogout}
                                 >
                                    <ListItemIcon>
                                       <IconLogout stroke={1.5} size="1.3rem" />
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Cerrar Sesión</Typography>} />
                                 </ListItemButton>
                              </List>
                           </Box>
                           {/* </PerfectScrollbar> */}
                        </MainCard>
                     </ClickAwayListener>
                  </Paper>
               </Transitions>
            )}
         </Popper>

         {/* FORMULARIO COMPLEMENTARIO */}
         <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
               <Dialog
                  open={openModalChangePassword}
                  TransitionComponent={Transition}
                  keepMounted
                  fullWidth
                  onClose={handleCloseModalChangePassword}
                  aria-describedby="alert-dialog-slide-description"
                  sx={{ backgroundColor: "transparent" }}
                  component={"form"}
                  onSubmit={handleSubmit}
               >
                  <DialogTitle>
                     <Typography variant="h4" component={"p"} textAlign={"center"}>
                        CAMBIAR DE CONTRASEÑA
                     </Typography>
                  </DialogTitle>
                  <DialogContent sx={{ pb: 0, height: 250 }}>
                     <Grid container spacing={2}>
                        {/* Contraseña */}
                        <Grid xs={12} sx={{ mt: 2, mb: 2 }}>
                           <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                              <InputLabel htmlFor="password">Contraseña Actual *</InputLabel>
                              <OutlinedInput
                                 id="password"
                                 name="password"
                                 label="Contraseña Actual *"
                                 type={showPassword ? "text" : "password"}
                                 value={values.password}
                                 placeholder="Ingrese su contraseña actual, minimo 6 dígitos"
                                 onBlur={handleBlur}
                                 onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value, setStrength, setLevel);
                                 }}
                                 endAdornment={
                                    <InputAdornment position="end">
                                       <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={() => handleClickShowPassword(setShowPassword, showPassword)}
                                          onMouseDown={handleMouseDownPassword}
                                          edge="end"
                                          size="large"
                                       >
                                          {showPassword ? <Visibility /> : <VisibilityOff />}
                                       </IconButton>
                                    </InputAdornment>
                                 }
                                 inputProps={{}}
                                 fullWidth
                                 // disabled={newPasswordChecked ? false : true} // DESHABILITAR CON UN CHECK
                                 // disabled={values.id == 0 ? false : true}
                                 error={errors.password && touched.password}
                              />
                              {touched.password && errors.password && (
                                 <FormHelperText error id="ht-password">
                                    {errors.password}
                                 </FormHelperText>
                              )}
                           </FormControl>
                           {strength !== 0 && (
                              <FormControl fullWidth>
                                 <Box sx={{ mb: 1 }}>
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
                        </Grid>
                        {/* Nueva Contraseña */}
                        <Grid xs={12} sx={{ mb: 1 }}>
                           <FormControl fullWidth error={Boolean(touched.new_password && errors.new_password)}>
                              <InputLabel htmlFor="new_password">Nueva Contraseña *</InputLabel>
                              <OutlinedInput
                                 id="new_password"
                                 name="new_password"
                                 label="Nueva Contraseña *"
                                 type={showNewPassword ? "text" : "password"}
                                 value={values.new_password}
                                 placeholder="Ingrese la nueva contraseña, minimo 6 dígitos"
                                 onBlur={handleBlur}
                                 onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value, setStrengthNew, setLevelNew);
                                 }}
                                 endAdornment={
                                    <InputAdornment position="end">
                                       <IconButton
                                          aria-label="toggle new_password visibility"
                                          onClick={() => handleClickShowPassword(setShowNewPassword, showNewPassword)}
                                          onMouseDown={handleMouseDownPassword}
                                          edge="end"
                                          size="large"
                                       >
                                          {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                       </IconButton>
                                    </InputAdornment>
                                 }
                                 inputProps={{}}
                                 fullWidth
                                 // disabled={newPasswordChecked ? false : true} // DESHABILITAR CON UN CHECK
                                 // disabled={values.id == 0 ? false : true}
                                 error={errors.new_password && touched.new_password}
                              />
                              {touched.new_password && errors.new_password && (
                                 <FormHelperText error id="ht-new_password">
                                    {errors.new_password}
                                 </FormHelperText>
                              )}
                           </FormControl>
                           {strengthNew !== 0 && (
                              <FormControl fullWidth>
                                 <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                       <Grid>
                                          <Box
                                             style={{ backgroundColor: levelNew?.color }}
                                             sx={{
                                                width: 85,
                                                height: 8,
                                                borderRadius: "7px"
                                             }}
                                          />
                                       </Grid>
                                       <Grid>
                                          <Typography variant="subtitle1" fontSize="0.75rem">
                                             {levelNew?.label}
                                          </Typography>
                                       </Grid>
                                    </Grid>
                                 </Box>
                              </FormControl>
                           )}
                        </Grid>
                     </Grid>
                  </DialogContent>
                  <DialogActions sx={{ my: 0, pt: 0 }}>
                     <LoadingButton
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        // loadingPosition="start"
                        variant="text"
                        fullWidth
                        size="large"
                     >
                        ACTUALIZAR
                     </LoadingButton>
                     <Button color="secondary" onClick={() => handleCloseModalChangePassword(resetForm)}>
                        Cerrar
                     </Button>
                  </DialogActions>
               </Dialog>
            )}
         </Formik>
      </>
   );
};

export default ProfileSection;
