import { useFormikContext } from "formik";
/// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Grid, FormControl, FormGroup, FormLabel, Typography } from "@mui/material";
import { CheckboxComponent, InputComponent, RadioButtonComponent } from "../../../components/Form/FormikComponents";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { useGlobalContext } from "../../../context/GlobalContext";

const InputsFormik8 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext }) => {
   useGlobalContext();
   const { formData, setFormData } = useRequestBecaContext();

   const formik = useFormikContext();

   // useEffect(() => {});

   return (
      <>
         <Grid width={"100%"} xs={12} spacing={2} height={"67vh"} MaxHeight={"67vh"} overflow={"auto"}>
            <Grid item xs={12} container spacing={2}>
               <Grid item xs={12} md={12} sx={{ mb: 3 }}>
                  <ol>
                     {/* Programa de Becas */}
                     <FormControl fullWidth sx={{ mb: 3 }}>
                        <FormLabel id="household_equipment-label">
                           <Typography variant="h4" component={"p"}>
                              <li>¿Tu familia es beneficiaria de algunas de las siguientes becas?</li>
                           </Typography>
                        </FormLabel>
                        <Grid container spacing={2}>
                           {/* Beca de Transporte */}
                           <CheckboxComponent idName={"b6_beca_transport"} label={"Beca de Transporte"} value={true} sx={{ mr: 10 }} rowLayout={false} />

                           {/* Beca para el Bienestar Benito Juárez */}
                           <CheckboxComponent
                              idName={"b6_beca_benito_juarez"}
                              label={"Beca para el Bienestar Benito Juárez"}
                              value={true}
                              sx={{ mr: 10 }}
                              rowLayout={false}
                           />

                           {/* Beca Jóvenes Construyendo el Futuro */}
                           <CheckboxComponent
                              idName={"b6_beca_jovenes"}
                              label={"Beca Jóvenes Construyendo el Futuro"}
                              value={true}
                              sx={{ mr: 10 }}
                              rowLayout={false}
                           />

                           {/* Otra */}
                           <CheckboxComponent idName={"b6_other"} label={"Otra"} value={true} sx={{ mr: 10 }} rowLayout={false} />
                        </Grid>
                     </FormControl>
                  </ol>

                  {/* Bajo Protesta */}
                  <CheckboxComponent
                     col={12}
                     idName={"under_protest"}
                     label={"Bajo Protesta de decir la verdad, manifiesto que la información proporcionada en esta solicitud es verídica."}
                     value={true}
                  />
               </Grid>
            </Grid>
         </Grid>

         {folio > 0 && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik8;
