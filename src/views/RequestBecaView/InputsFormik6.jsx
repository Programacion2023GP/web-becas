import { useFormikContext } from "formik";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { InputComponent, RadioButtonComponent } from "../../components/Form/FormikComponents";
import { useRequestBecaContext } from "../../context/RequestBecaContext";
import { useGlobalContext } from "../../context/GlobalContext";
import { Typography } from "@mui/material";

const InputsFormik6 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext }) => {
   useGlobalContext();
   const { formData, setFormData } = useRequestBecaContext();

   const formik = useFormikContext();

   // useEffect(() => {});

   return (
      <>
         <Grid width={"100%"} xs={12} spacing={2} height={"67vh"} maxHeight={"67vh"} overflow={"auto"}>
            <Grid xs={12} container spacing={2}>
               <Grid xs={12} md={12} sx={{ mb: 3 }}>
                  <ol>
                     {/* La casa es */}
                     <RadioButtonComponent
                        col={12}
                        idName={"b4_house_is"}
                        alignItems="start"
                        title={
                           <Typography variant="h4" component={"p"}>
                              <li>La casa donde vives es:</li>
                           </Typography>
                        }
                        options={[
                           { value: "1@Propia", label: "Propia" },
                           { value: "2@Prestada", label: "Prestada" },
                           { value: "3@Alquilada", label: "Alquilada" },
                           { value: "4@Otra", label: "Otra" }
                        ]}
                     />

                     {/* Material del techo */}
                     <RadioButtonComponent
                        col={12}
                        idName={"b4_roof_material"}
                        alignItems="start"
                        title={
                           <Typography variant="h4" component={"p"}>
                              <li>Material del techo de la vivienda (si está hecho de más de un material, marca el que predomine):</li>
                           </Typography>
                        }
                        options={[
                           { value: "1@Lámina", label: "Lámina (de cartón, de asbesto, madera)" },
                           { value: "2@Concreto", label: "Firme de concreto" }
                        ]}
                     />

                     {/* Material del techo */}
                     <RadioButtonComponent
                        col={12}
                        idName={"b4_floor_material"}
                        alignItems="start"
                        title={
                           <Typography variant="h4" component={"p"}>
                              <li>La casa donde vives es:</li>
                           </Typography>
                        }
                        options={[
                           { value: "1@Tierra", label: "Tierra" },
                           { value: "2@Cemento", label: "Cemento" },
                           { value: "3@Mosaico", label: "Mosaico, loseta, madera Láminada" }
                        ]}
                     />
                  </ol>
               </Grid>
            </Grid>
         </Grid>

         {folio > 0 && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik6;
