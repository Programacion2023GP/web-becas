import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Autocomplete,
   Button,
   Divider,
   FormControlLabel,
   FormLabel,
   InputAdornment,
   InputLabel,
   MenuItem,
   Radio,
   RadioGroup,
   Select,
   TextField,
   Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";

const SchoolForm = ({ dataCities, dataColonies, textBtnSubmit }) => {
   const onSubmit = async ({ email, password }, { setSubmitting, setErrors, resetForm }) => {
      try {
         const credentialUser = await login({ email, password });
         console.log(credentialUser);
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

   const handleReset = (resetForm) => {
      resetForm();
   };

   const validationSchema = Yup.object().shape({
      schoolName: Yup.string().trim().required("Nombre de escuela requerida"),
      schoolDirector: Yup.string().trim().required("Director de escuela requerida"),
      schoolCity: Yup.string().trim().required("Ciudad requerido"),
      schoolColony: Yup.string().trim().required("Colonia/Localidad requerido"),
      schoolRadio: Yup.string().trim().required("Radio requerido")
   });

   return (
      <Formik
         initialValues={{
            schoolId: "",
            schoolCode: "",
            schoolName: "",
            schoolDirector: "",
            schoolCity: "1",
            schoolColony: "",
            schoolRadio: ""
         }}
         validationSchema={validationSchema}
         onSubmit={onSubmit}
      >
         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm }) => (
            <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
               {/* <Field id="schoolId" name="schoolId" type="hidden" value={values.schoolId} onChange={handleChange} onBlur={handleBlur} /> */}
               <Grid sm={12} md={4} sx={{ mb: 3 }}>
                  <TextField
                     id="schoolCode"
                     name="schoolCode"
                     label="Código de la Escuela"
                     type="text"
                     value={values.schoolCode}
                     placeholder="AS5D16"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     focused
                     fullWidth
                     error={errors.schoolCode && touched.schoolCode}
                     helperText={errors.schoolCode && touched.schoolCode && errors.schoolCode}
                  />
               </Grid>
               <Grid sm={12} md={8} sx={{ mb: 3 }}>
                  <TextField
                     id="schoolName"
                     name="schoolName"
                     label="Nombre de la Escuela"
                     type="text"
                     value={values.schoolName}
                     placeholder="Lazaro Cardenas del Rio"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     error={errors.schoolName && touched.schoolName}
                     helperText={errors.schoolName && touched.schoolName && errors.schoolName}
                  />
               </Grid>
               <Grid sm={12} md={12} sx={{ mb: 3 }}>
                  <TextField
                     id="schoolDirector"
                     name="schoolDirector"
                     label="Director de la escuela"
                     type="text"
                     value={values.schoolDirector}
                     placeholder="Lazaro Cardenas del Rio"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     error={errors.schoolDirector && touched.schoolDirector}
                     helperText={errors.schoolDirector && touched.schoolDirector && errors.schoolDirector}
                  />
               </Grid>
               <Grid sm={12} md={6} sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                     <InputLabel id="schoolCity-label">Ciudad</InputLabel>
                     <Select
                        id="schoolCity"
                        name="schoolCity"
                        label="Ciudad"
                        labelId="schoolCity-label"
                        value={values.schoolCity}
                        placeholder="Ciudad"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.schoolCity && touched.schoolCity}
                     >
                        <MenuItem value={null} disabled>
                           Selecciona una opción...
                        </MenuItem>
                        {dataCities.map((d) => (
                           <MenuItem key={d.id} value={d.id}>
                              {d.code} - {d.city}
                           </MenuItem>
                        ))}
                     </Select>
                     {touched.schoolCity && errors.schoolCity && (
                        <FormHelperText error id="ht-schoolCity">
                           {errors.schoolCity}
                        </FormHelperText>
                     )}
                  </FormControl>
               </Grid>
               <Grid sm={12} md={6} sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                     <InputLabel id="schoolColony-label">Colonia / Localidad</InputLabel>
                     <Select
                        id="schoolColony"
                        name="schoolColony"
                        label="Colonia / Localidad"
                        labelId="schoolColony-label"
                        value={values.schoolColony}
                        placeholder="Colonia / Localidad"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.schoolColony && touched.schoolColony}
                     >
                        <MenuItem value={null} disabled>
                           Selecciona una opción...
                        </MenuItem>
                        {dataColonies.map((d) => (
                           <MenuItem key={d.id} value={d.id}>
                              {d.code} - {d.colony}
                           </MenuItem>
                        ))}
                     </Select>
                     {touched.schoolColony && errors.schoolColony && (
                        <FormHelperText error id="ht-schoolColony">
                           {errors.schoolColony}
                        </FormHelperText>
                     )}
                  </FormControl>
                  {/* <FormControl
               fullWidth
               error={Boolean(touched.schoolColony && errors.schoolColony)}
               sx={{ height: "auto" }}
               // sx={{ ...theme.typography.customInput }}
            >
               <Autocomplete
                  disablePortal
                  id="schoolColony"
                  name="schoolColony"
                  label="Colonia / Localidad"
                  defaultValue={{ label: values.schoolColony }}
                  isOptionEqualToValue={(option, value) => option.id == value.id}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  options={top100Films}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => onChange(value)}
                  onInputChange={(event, value) => {
                     if (value && value.length >= 3) {
                        search(value).finally();
                     }
                  }}
               />
               {touched.schoolColony && errors.schoolColony && (
                  <FormHelperText error id="ht-schoolColony">
                     {errors.schoolColony}
                  </FormHelperText>
               )}
            </FormControl> */}
               </Grid>
               <Grid sm={12} md={3} sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                     <FormLabel id="schoolRadio-label">Gender</FormLabel>
                     <RadioGroup row aria-labelledby="schoolRadio-label" name="row-radio-buttons-group">
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                        <FormControlLabel value="disabled" disabled control={<Radio />} label="other" />
                     </RadioGroup>
                     {touched.schoolRadio && errors.schoolRadio && (
                        <FormHelperText error id="ht-schoolRadio">
                           {errors.schoolRadio}
                        </FormHelperText>
                     )}
                  </FormControl>
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
               <Button type="reset" variant="outlined" color="secondary" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleReset(resetForm)}>
                  CANCELAR
               </Button>
            </Grid>
         )}
      </Formik>
   );
};
export default SchoolForm;
