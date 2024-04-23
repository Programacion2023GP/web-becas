import Grid from "@mui/system/Unstable_Grid/Grid";
import { Autocomplete, CircularProgress, FormControl, FormHelperText, IconButton, TextField, Tooltip } from "@mui/material";
import Toast from "../../utils/Toast";
import { useEffect, useState } from "react";
import { Field, useFormikContext } from "formik";
import { IconReload } from "@tabler/icons";
import { Box } from "@mui/system";

/**
 *
 * {/* Marca *}
   <Grid xs={12} md={6} sx={{ mb: 2 }}>
      <Select2Component
         idName={"brand_id"}
         label={"Marca *"}
         valueLabel={values.brand}
         formDataLabel={"brand"}
         placeholder={"Selecciona una opción..."}
         options={dataBrands}
         fullWidth={true}
         // handleChangeValueSuccess={handleChangeBrands}
         handleBlur={handleBlur}
         error={errors.brand_id}
         touched={touched.brand_id}
         disabled={false}
         pluralName={""}
         refreshSelect={getSelectIndex}
      />
   </Grid>
 */

/**
 *
 * {/* Marca *}
   <Select2Component col={6} idName={"marca"} label={"Marca *"} options={dataBrands} refreshSelect={} />
 */

// =================== COMPONENTE =======================
const Select2Component = ({
   col,
   idName,
   label,
   placeholder,
   options = [],
   disabled,
   size = "medium",

   helperText,
   // loading = false,
   // setLoading,
   color,
   hidden,
   variant = "outlined",
   marginBoton,
   namePropLabel = "label",
   fullWidth,
   pluralName,
   refreshSelect = null,
   refreshSelectParams = null,
   handleGetValue = null,
   handleChangeValueSuccess,
   ...props
}) => {
   const formik = useFormikContext(); // Obtiene el contexto de Formik
   const errors = formik.errors;
   const isError = formik.touched[idName] ? formik.errors[idName] : false;

   const [dataOptions, setDataOptions] = useState([]);
   const [labelValue, setLabelValue] = useState("Selecciona una opción...");
   const [loading, setLoading] = useState(false);

   const handleValue = (name, value) => {
      if (handleGetValue) {
         handleGetValue(name, value);
      }
   };

   const isOptionEqualToValue = (option, value) => {
      // console.log("option", option);
      // console.log("value", value);
      if (option.label) {
         if (typeof value === "string") return option.label === value;
         else {
            // console.log(value);
            // value = option.label;
            // console.log(value);
            return option.id === value;
         }
      } else return option === value;
   };
   // const handleChangeValue = async (value, setValues) => {
   const handleChangeValue = async (value, setFieldValue) => {
      try {
         // console.log("Select2Component->handleChangeValue->value", value);
         if (!value) {
            formik.setFieldValue(idName, 0);
            setLabelValue("Selecciona una opción...");
            return;
         }
         const selectedOption = dataOptions.find((option) =>
            typeof value === "object" ? option.label.trim() === value.label.trim() : option.trim() === value.trim()
         );
         // handleValue(idName, typeof value === "object" ? selectedOption.id : selectedOption);
         formik.setFieldValue(idName, typeof value === "object" ? selectedOption.id : selectedOption);
         setLabelValue(typeof value === "object" ? selectedOption.label : selectedOption);
         // console.log("values", values);

         if (handleChangeValueSuccess) {
            setLoading(true);
            await handleChangeValueSuccess(idName, selectedOption, setFieldValue);
            setLoading(false);
         } //en esta funcion
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickRefresh = async () => {
      try {
         setLoading(true);
         await refreshSelect(refreshSelectParams);
         setLoading(false);
         Toast.Success("Actualizada");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      setLoading(true);
      const _options = [{ id: 0, label: "Selecciona una opción..." }];
      // console.log(options);
      options.map((option, index) => {
         _options.push({ id: option.id, label: option[namePropLabel] });
         if (option.id === formik.values.idName) setLabelValue(option[namePropLabel]);
         if (index == options.length - 1 && labelValue == "Selecciona una opción...") setLabelValue(option[namePropLabel]);
      });
      setDataOptions(_options);
      Number(formik.values[idName]) == 0 && setLabelValue("Selecciona una opción...");
      setLoading(false);

      if (Array.isArray(options) && options.length > 0) {
         setLoading(false);
      }
      if (!Array.isArray(options)) {
         options = [];
         setLoading(false);
      }
   }, [options, formik.values[idName]]);

   return (
      <>
         {dataOptions.length > 0 && (
            <Grid xs={12} md={col} sx={{ display: hidden ? "none" : "flex", flexDirection: "column", alignItems: "center", mb: marginBoton ? `${marginBoton} 0` : 2 }}>
               <FormControl fullWidth>
                  <Box display={"flex"}>
                     <Field id={idName} name={idName}>
                        {({ field }) => (
                           <Autocomplete
                              key={`select_${idName}`}
                              disablePortal
                              openOnFocus
                              label={label}
                              placeholder={placeholder}
                              options={dataOptions}
                              size={size}
                              // getOptionLabel={(option) => option.label}
                              // isOptionEqualToValue={(option, value) => option && value && option.id === value.id}
                              {...field}
                              value={Number(formik.values[idName]) > 0 ? dataOptions.find((option) => option.id === formik.values[idName])?.label : labelValue}
                              defaultValue={Number(formik.values[idName]) > 0 ? dataOptions.find((option) => option.id === formik.values[idName])?.label : labelValue}
                              // defaultValue={labelValue || "Selecciona una opción..."}
                              onChange={(_, newValue) => {
                                 handleChangeValue(newValue, formik.setFieldValue);
                              }}
                              onBlur={formik.handleBlur}
                              fullWidth={fullWidth || true}
                              isOptionEqualToValue={isOptionEqualToValue}
                              renderInput={(params) => <TextField {...params} label={label} error={isError} />}
                              disabled={disabled || loading}
                              error={isError}
                           />
                        )}
                     </Field>
                     {refreshSelect && (
                        <Tooltip title={`Actualizar ${pluralName}`} placement="top">
                           <IconButton
                              type="button"
                              variant="text"
                              color="primary"
                              sx={{ borderRadius: "12px", mr: 1 }}
                              onClick={handleClickRefresh}
                              disabled={disabled || loading}
                           >
                              <IconReload />
                           </IconButton>
                        </Tooltip>
                     )}
                  </Box>

                  {isError && (
                     <FormHelperText error id={`ht-${idName}`}>
                        {isError ? formik.errors[idName] : helperText}
                     </FormHelperText>
                  )}
                  {loading && <CircularProgress sx={{ position: "absolute", top: "10%", left: "60%" }} />}
               </FormControl>
            </Grid>
         )}
      </>
   );
};

export default Select2Component;
