import { Autocomplete, FormControl, FormHelperText, TextField } from "@mui/material";
import Toast from "../../utils/Toast";
import { useEffect } from "react";
import { Field } from "formik";

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
         // handleChangeValueSuccess={handleChange...}
         handleBlur={handleBlur}
         error={errors.brand_id}
         touched={touched.brand_id}
         disabled={false}
      />
   </Grid>
 */

// =================== COMPONENTE =======================
const Select2Component = ({
   idName,
   label,
   valueLabel,
   formDataLabel,
   placeholder,
   options = [{ id: 0, label: "Selecciona una opción..." }],
   fullWidth,
   handleChangeValueSuccess,
   handleBlur,
   error,
   touched,
   disabled = false
   // inputref = null
}) => {
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
         // console.log(value);
         if (!value) {
            setFieldValue(idName, 0);
            setFieldValue(formDataLabel, "Selecciona una opción...");
            valueLabel = "Selecciona una opción...";
            return;
         }
         if (typeof value === "object") {
            // values[idName] = value.id;
            setFieldValue(idName, value.id);
            // values[formDataLabel] = value.label;
            setFieldValue(formDataLabel, value.label);
            valueLabel = value.label;
         } else {
            // values[formDataLabel] = value;
            setFieldValue(formDataLabel, value);
            valueLabel = value;
         }
         // console.log("values", values);
         // // await setFormData(values);
         // // await setValues(values);

         if (handleChangeValueSuccess) handleChangeValueSuccess(value, setFieldValue); //en esta funcion
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // console.log("useEffect");
   }, [valueLabel]);

   return (
      <FormControl fullWidth>
         <Field id={idName} name={idName}>
            {({ field, form }) => (
               <Autocomplete
                  disablePortal
                  openOnFocus
                  label={label}
                  placeholder={placeholder}
                  options={options || ["Selecciona una opción..."]}
                  {...field}
                  value={valueLabel || "Selecciona una opción..."}
                  defaultValue={valueLabel || "Selecciona una opción..."}
                  onChange={(_, newValue) => {
                     // form.setFieldValue(field.name, newValue);
                     handleChangeValue(newValue, form.setFieldValue);
                  }}
                  onBlur={handleBlur}
                  fullWidth={fullWidth || true}
                  isOptionEqualToValue={isOptionEqualToValue}
                  renderInput={(params) => <TextField {...params} label={label} />}
                  disabled={disabled}
                  error={error && touched}
               />
            )}
         </Field>

         {touched && error && (
            <FormHelperText error id={`ht-${idName}`}>
               {error}
            </FormHelperText>
         )}
      </FormControl>
   );
};

const Select2Component1 = ({
   idName,
   label,
   valueLabel,
   values,
   formData,
   setFormData,
   formDataLabel,
   placeholder,
   options,
   fullWidth,
   handleChange,
   handleChangeValueSuccess,
   setValues,
   // setFieldValue,
   handleBlur,
   error,
   touched,
   disabled = false
   // inputref = null
}) => {
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
         // console.log(value);
         if (!value) {
            setFieldValue(idName, 0);
            setFieldValue(formDataLabel, "Selecciona una opción...");
            valueLabel = "Selecciona una opción...";
            return;
         }
         if (typeof value === "object") {
            // values[idName] = value.id;
            setFieldValue(idName, value.id);
            // values[formDataLabel] = value.label;
            setFieldValue(formDataLabel, value.label);
            valueLabel = value.label;
         } else {
            // values[formDataLabel] = value;
            setFieldValue(formDataLabel, value);
            valueLabel = value;
         }
         // console.log("values", values);
         // // await setFormData(values);
         // // await setValues(values);

         if (handleChangeValueSuccess) handleChangeValueSuccess(value, setFieldValue); //en esta funcion
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      // console.log("useEffect");
   }, [valueLabel]);

   return (
      <FormControl fullWidth>
         <Field id={idName} name={idName}>
            {({ field, form }) => (
               <Autocomplete
                  disablePortal
                  openOnFocus
                  label={label}
                  placeholder={placeholder}
                  options={options}
                  // value={field.value}
                  {...field}
                  value={valueLabel || "Selecciona una opción..."}
                  defaultValue={valueLabel || "Selecciona una opción..."}
                  onChange={(_, newValue) => {
                     // form.setFieldValue(field.name, newValue);
                     handleChangeValue(newValue, form.setFieldValue);
                  }}
                  // onChange={(_, newValue) => form.setFieldValue(field.name, newValue)}
                  onBlur={handleBlur}
                  fullWidth={fullWidth || true}
                  isOptionEqualToValue={isOptionEqualToValue}
                  renderInput={(params) => <TextField {...params} label={label} />}
                  disabled={disabled}
                  error={error && touched}
               />
            )}
         </Field>

         {touched && error && (
            <FormHelperText error id={`ht-${idName}`}>
               {error}
            </FormHelperText>
         )}
      </FormControl>
   );
};
export default Select2Component;
