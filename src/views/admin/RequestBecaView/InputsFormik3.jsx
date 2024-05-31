import { useFormikContext } from "formik";
/// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Grid } from "@mui/material";
import { InputComponent, Select2Component } from "../../../components/Form/FormikComponents";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useSchoolContext } from "../../../context/SchoolContext";

const InputsFormik3 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext }) => {
   useGlobalContext();
   const { schools, getSchoolsSelectIndex } = useSchoolContext();

   const formik = useFormikContext();

   // useEffect(() => {
   //    console.log("🚀 ~ InputsFormik3 ~ schools:", schools);
   // });

   return (
      <>
         <Grid width={"100%"} xs={12} spacing={2} height={"67vh"} MaxHeight={"67vh"} overflow={"auto"}>
            <Grid item xs={12} container spacing={2}>
               {/* Escuela */}
               <Select2Component
                  col={12}
                  idName={"school_id"}
                  label={"Escuela *"}
                  options={schools}
                  refreshSelect={getSchoolsSelectIndex}
                  pluralName={"Escuelas"}
                  disabled={formik.values.id == 0 ? false : true}
               />

               {/* Grado */}
               <InputComponent
                  col={6}
                  idName={"grade"}
                  label={"Grado de Estudio (año) *"}
                  type={"number"}
                  placeholder={"3"}
                  inputProps={{ maxLength: 1, min: 1, max: 6 }}
                  disabled={formik.values.id == 0 ? false : true}
               />

               {/* Promedio */}
               <InputComponent
                  col={6}
                  idName={"average"}
                  label={"Promedio *"}
                  placeholder={"10.00"}
                  inputProps={{ step: 0.01, min: 0, max: 100 }}
                  disabled={formik.values.id == 0 ? false : true}
               />

               {/* Comentarios */}
               <InputComponent
                  col={12}
                  idName={"comments"}
                  label={"Comentarios (opcionales)"}
                  placeholder={"'Deseas dejar algún comentario o mensaje?"}
                  rows={5}
                  disabled={formik.values.id == 0 ? false : true}
               />
            </Grid>
         </Grid>

         {!(folio > 0) && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik3;
