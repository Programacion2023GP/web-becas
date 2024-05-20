import { useFormikContext } from "formik";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { CheckboxComponent, InputComponent, RadioButtonComponent } from "../../../components/Form/FormikComponents";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { useGlobalContext } from "../../../context/GlobalContext";
import { FormControl, FormGroup, FormLabel, Typography } from "@mui/material";

const InputsFormik7 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext }) => {
   useGlobalContext();
   const { formData, setFormData } = useRequestBecaContext();

   const formik = useFormikContext();

   // useEffect(() => {});

   return (
      <>
         <Grid xs={12} md={12} sx={{ mb: 3 }}>
            <ol>
               {/* Equipamiento de la casa */}
               <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel id="household_equipment-label">
                     <Typography variant="h4" component={"p"}>
                        <li>Señala el número de los siguientes aparatos con que cuentas en casa (en caso de no tener, marca cero) 0 1 2 3 4+ :</li>
                     </Typography>
                  </FormLabel>
                  <Grid container spacing={2}>
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        {/* Camas */}
                        <InputComponent
                           col={6}
                           idName={"b5_beds"}
                           label={"Camas"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                        {/* Lavadoras */}
                        <InputComponent
                           col={6}
                           idName={"b5_washing_machines"}
                           label={"Lavadoras"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                        {/* Calentador de agua (boiler) */}
                        <InputComponent
                           col={6}
                           idName={"b5_boilers"}
                           label={"Calentador de agua (boiler)"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                        {/* Televisores */}
                        <InputComponent
                           col={6}
                           idName={"b5_tvs"}
                           label={"Televisores"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                        {/* Computadoras */}
                        <InputComponent
                           col={6}
                           idName={"b5_pcs"}
                           label={"Computadoras"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                     </Grid>
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        {/* Teléfonos (local o celular) */}
                        <InputComponent
                           col={6}
                           idName={"b5_phones"}
                           label={"Teléfonos (local o celular)"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                        {/* Reproductores de Música */}
                        <InputComponent
                           col={6}
                           idName={"b5_music_player"}
                           label={"Reproductores de Música"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                        {/* Estufas */}
                        <InputComponent
                           col={6}
                           idName={"b5_stoves"}
                           label={"Estufas"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                        {/* Refrigeradores */}
                        <InputComponent
                           col={6}
                           idName={"b5_refrigerators"}
                           label={"Refrigeradores"}
                           placeholder={"0"}
                           type="number"
                           onChange={(e) => {
                              formik.handleChange(e);
                              handleChangeTotal(e, formik.values, formik.setFieldValue);
                           }}
                           inputProps={{ min: 0, max: 100000 }}
                           styleInput={3}
                        />
                     </Grid>
                  </Grid>
               </FormControl>

               {/* Equipamiento de la casa */}
               <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
                  <FormLabel id="household_equipment-label">
                     <Typography variant="h4" component={"p"} mb={1}>
                        <li>¿Cuáles son los servicios con que cuentas en tu casa?</li>
                     </Typography>
                  </FormLabel>
                  <Grid container spacing={0}>
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        {/* Agua Potable */}
                        <CheckboxComponent col={12} idName={"b5_drinking_water"} label={"Agua Potable"} value={true} marginBottom={-0.5} />
                        {/* Luz Eléctrica */}
                        <CheckboxComponent col={12} idName={"b5_electric_light"} label={"Luz Eléctrica"} value={true} marginBottom={-0.5} />
                        {/* Drenaje */}
                        <CheckboxComponent col={12} idName={"b5_sewer_system"} label={"Drenaje"} value={true} marginBottom={-0.5} />
                        {/* Pavimento */}
                        <CheckboxComponent col={12} idName={"b5_pavement"} label={"Pavimento"} value={true} marginBottom={-0.5} />
                     </Grid>
                     <Grid xs={12} md={6} sx={{ mb: 1 }}>
                        {/* Automóvil */}
                        <CheckboxComponent col={12} idName={"b5_automobile"} label={"Automóvil"} value={true} marginBottom={-0.5} />

                        {/* Línea Telefónica */}
                        <CheckboxComponent col={12} idName={"b5_phone_line"} label={"Línea Telefónica"} value={true} marginBottom={-0.5} />

                        {/* Internet */}
                        <CheckboxComponent col={12} idName={"b5_internet"} label={"Internet"} value={true} marginBottom={-0.5} />
                     </Grid>
                  </Grid>
               </FormControl>
            </ol>
         </Grid>

         {folio > 0 && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik7;
