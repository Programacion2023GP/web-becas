import { useFormikContext } from "formik";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { InputComponent } from "../../../components/Form/FormikComponents";
import { useGlobalContext } from "../../../context/GlobalContext";
import { Typography } from "@mui/material";
import FamilyDT from "./FamilyDT";

const InputsFormik4 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext }) => {
   useGlobalContext();

   const formik = useFormikContext();

   // useEffect(() => {});

   return (
      <>
         <Grid width={"100%"} xs={12} spacing={2} height={"67vh"} MaxHeight={"67vh"} overflow={"auto"}>
            <Grid xs={12} container spacing={2}>
               {/* LISTADO */}
               <Grid xs={12} md={12} sx={{ mb: 3 }}>
                  <Typography variant="h2" mb={2}>
                     ¿Quienes viven actualmente con el alumno?
                  </Typography>
                  <FamilyDT becaId={folio} setFieldValue={formik.setFieldValue} values={formik.values} />
               </Grid>

               {/* Ingresos Extra */}
               <InputComponent
                  col={6}
                  idName={"extra_income"}
                  label={"Ingresos Extra *"}
                  type="number"
                  placeholder={"1,500.00"}
                  inputProps={{ step: 0.01, min: 0, max: 100000 }}
               />

               {/* Ingreso Mensuales Totales */}
               <InputComponent
                  col={6}
                  idName={"monthly_income"}
                  label={"Ingresos Mensuales TOTALES *"}
                  type="number"
                  placeholder={"9,999.00"}
                  inputProps={{ step: 0.01, min: 0, max: 100000 }}
                  disabled={true}
                  variant="filled"
               />
            </Grid>
         </Grid>

         {folio > 0 && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik4;
