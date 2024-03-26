import { Autocomplete, FormControl, FormHelperText, IconButton, TextField, Tooltip } from "@mui/material";
import Toast from "../../utils/Toast";
import { useEffect, useState } from "react";
import { Field } from "formik";
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

// =================== COMPONENTE =======================
const Select2Component = ({
   idName,
   label,
   valueLabel,
   formDataLabel,
   placeholder,
   options,
   fullWidth,
   handleChangeValueSuccess,
   handleBlur,
   error,
   touched,
   disabled = false,
   // inputref = null
   pluralName,
   refreshSelect = null,
   refreshSelectParams = null
}) => {
   const [loading, setLoading] = useState(false);

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
      // console.log("useEffect");
   }, [valueLabel]);

   return (
      <FormControl fullWidth>
         <Box display={"flex"}>
            <Field id={idName} name={idName}>
               {({ field, form }) => (
                  <Autocomplete
                     key={`select_${idName}`}
                     loading={loading}
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
            {refreshSelect && (
               <Tooltip title={`Actualizar ${pluralName}`} placement="top">
                  <IconButton type="button" variant="text" color="primary" sx={{ borderRadius: "12px", mr: 1 }} onClick={handleClickRefresh}>
                     <IconReload />
                  </IconButton>
               </Tooltip>
            )}
         </Box>

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

   // <Autocomplete
   //          disablePortal
   //          openOnFocus
   //          id={idName}
   //          name={idName}
   //          label={label}
   //          placeholder={placeholder}
   //          options={options}
   //          // getOptionLabel={(option) => option.toString()}
   //          isOptionEqualToValue={isOptionEqualToValue}
   //          renderInput={(params) => <TextField {...params} label={label} />}
   //          onChange={(e, newValue, reason, details) => {
   //             handleChange(e, newValue, reason, details);
   //             handleChangeValue(newValue, setValues);
   //          }}
   //          onBlur={handleBlur}
   //          fullWidth={fullWidth || true}
   //          // disabled={values.id == 0 ? false : true}
   //          disabled={disabled}
   //          // inputRef={inputref}
   //          error={error && touched}
   //          defaultValue={valueLabel || "Selecciona una opción..."}
   //          value={valueLabel || "Selecciona una opción..."}
   //       />

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
