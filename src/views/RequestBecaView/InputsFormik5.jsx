import { useFormikContext } from "formik";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { InputComponent } from "../../components/Form/FormikComponents";
import { useGlobalContext } from "../../context/GlobalContext";
import { Typography } from "@mui/material";

const InputsFormik5 = ({ folio, pagina, activeStep, setStepFailed, ButtonsBeforeOrNext }) => {
   useGlobalContext();

   const formik = useFormikContext();

   const handleChangeTotal = (e, values, setFieldValue) => {
      // console.log("🚀 ~ handleChangeTotal ~ values:", values);
      console.log("a cambiar valores");
      // console.log("value", e.target.name);
      const name = e.target.name;
      const value = Number(e.target.value) || 0;
      console.log("🚀 ~ handleChangeTotal ~ value:", value);
      const b3_food = name == "b3_food" ? value : values.b3_food,
         b3_transport = name == "b3_transport" ? value : values.b3_transport,
         b3_living_place = name == "b3_living_place" ? value : values.b3_living_place,
         b3_services = name == "b3_services" ? value : values.b3_services,
         b3_automobile = name == "b3_automobile" ? value : values.b3_automobile;
      const total_expenses = Number(b3_food) + Number(b3_transport) + Number(b3_living_place) + Number(b3_services) + Number(b3_automobile);
      setFieldValue("total_expenses", total_expenses);
   };

   // useEffect(() => {});

   return (
      <>
         <Grid width={"100%"} xs={12} spacing={2} height={"67vh"} maxHeight={"67vh"} overflow={"auto"}>
            <Grid xs={12} container spacing={2}>
               <Grid xs={12} md={12} sx={{ mb: 3 }}>
                  <Typography variant="h4" component={"p"} mb={1}>
                     Persona(s) que sostiene el hogar (Padre, Madre, Abuelo)
                  </Typography>
                  <Typography variant="h4" component="p">
                     Detalle de gastos <span style={{ fontWeight: "bolder", textDecorationLine: "underline" }}>MENSUALES Familiares:</span>
                  </Typography>
               </Grid>

               <Grid xs={12} md={6} sx={{ mb: 3 }}>
                  {/* Alimentación */}
                  <InputComponent
                     col={12}
                     idName={"b3_food"}
                     label={"Alimentación (despensa) * $"}
                     placeholder={"Ingrese el gasto mensual de alimentos"}
                     type="number"
                     onChange={(e) => {
                        formik.handleChange(e);
                        handleChangeTotal(e, formik.values, formik.setFieldValue);
                     }}
                     inputProps={{ step: 0.01, min: 0, max: 100000 }}
                     styleInput={1}
                  />

                  {/* Transporte */}
                  <InputComponent
                     col={12}
                     idName={"b3_transport"}
                     label={"Transporte * $"}
                     placeholder={"Ingrese el gasto mensual de transporte"}
                     type="number"
                     onChange={(e) => {
                        formik.handleChange(e);
                        handleChangeTotal(e, formik.values, formik.setFieldValue);
                     }}
                     inputProps={{ step: 0.01, min: 0, max: 100000 }}
                     styleInput={1}
                  />
                  {/* Vivienda */}
                  <InputComponent
                     col={12}
                     idName={"b3_living_place"}
                     label={"Vivienda (renta, infonavit) * $"}
                     placeholder={"Ingrese el gasto mensual en pago de vivienda"}
                     type="number"
                     onChange={(e) => {
                        formik.handleChange(e);
                        handleChangeTotal(e, formik.values, formik.setFieldValue);
                     }}
                     inputProps={{ step: 0.01, min: 0, max: 100000 }}
                     styleInput={1}
                  />
               </Grid>

               <Grid xs={12} md={6} sx={{ mb: 3 }}>
                  {/* Servicios */}
                  <InputComponent
                     col={12}
                     idName={"b3_services"}
                     label={"Servicios (agua y luz) * $"}
                     placeholder={"Ingrese el gasto mensual de servicios"}
                     type="number"
                     onChange={(e) => {
                        formik.handleChange(e);
                        handleChangeTotal(e, formik.values, formik.setFieldValue);
                     }}
                     inputProps={{ step: 0.01, min: 0, max: 100000 }}
                     styleInput={1}
                  />

                  {/* Automovil */}
                  <InputComponent
                     col={12}
                     idName={"b3_automobile"}
                     label={"Automóvil * $"}
                     placeholder={"Ingrese el gasto mensual de de su automóvil"}
                     type="number"
                     onChange={(e) => {
                        formik.handleChange(e);
                        handleChangeTotal(e, formik.values, formik.setFieldValue);
                     }}
                     inputProps={{ step: 0.01, min: 0, max: 100000 }}
                     styleInput={1}
                  />

                  {/* Gastos Extras */}
                  <Grid xs={12} md={12} sx={{ mb: 3 }}></Grid>
               </Grid>

               {/* Egresos Mensuales Totales */}
               <InputComponent
                  xsOffset={6}
                  col={6}
                  idName={"total_expenses"}
                  label={"TOTAL DE EGRESOS $"}
                  placeholder={"0.00"}
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 100000 }}
                  disabled={true}
                  variant="filled"
                  // styleInput={1}
               />
            </Grid>
         </Grid>

         {folio > 0 && <ButtonsBeforeOrNext isSubmitting={formik.isSubmitting} setValues={formik.setValues} />}
      </>
   );
};

export default InputsFormik5;
