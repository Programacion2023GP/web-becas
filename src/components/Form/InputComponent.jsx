import PropTypes from "prop-types";
import { TextField } from "@mui/material";

import { FormControl, FormHelperText } from "@mui/material";
import { Field } from "formik";

import Typography from "@mui/material/Typography";

import { InputAdornment, OutlinedInput } from "@mui/material";
import { gpcDark, gpcLight } from "../../context/GlobalContext";
import { styled } from "@mui/material/styles";
import { shouldForwardProp } from "@mui/system";

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
   // width: 434,
   // marginLeft: 16,
   // paddingLeft: 16,
   // paddingRight: 16,
   "& input": {
      background: "#fff !important",
      paddingLeft: "10px !important"
   },
   [theme.breakpoints.down("lg")]: {
      width: 250
   },
   [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff"
   }
}));

/**
 * Input para usarse en conjunto con Formik y Yup para validaciones
 * @param {*} param0
 * @returns
 */
const InputComponent = ({
   idName,
   label,
   type,
   value,
   placeholder,
   inputProps,
   fullWidth,
   setFieldValue,
   handleChange,
   handleBlur,
   error,
   touched,
   showErrorInput = null,
   variant = "float"
}) => {
   return (
      <TextField
         id={idName}
         name={idName}
         label={label}
         type={type}
         fullWidth={fullWidth}
         value={value}
         placeholder={placeholder || "Ingresa tu info"}
         inputProps={inputProps}
         onChange={handleChange}
         onBlur={handleBlur}
         // disabled={values.id == 0 ? false : true}
         error={error && touched}
         helperText={error && touched && error}
      />
   );
};

InputComponent.PropTypes = {
   idName: PropTypes.string.isRequired,
   label: PropTypes.string.isRequired,
   type: PropTypes.oneOf([
      "checkbox",
      "color",
      "date",
      "datetime-local",
      "email",
      "hidden",
      "month",
      "number",
      "password",
      "radio",
      "range",
      "tel",
      "text",
      "time",
      "url",
      "week"
   ]),
   value: PropTypes.isRequired,
   placeholder: PropTypes.string,
   inputProps: PropTypes.object,
   fullWidth: PropTypes.oneOf([true, false]),
   handleChange: PropTypes.func().isRequired,
   handleBlur: PropTypes.func().isRequired,
   error: PropTypes.any,
   touched: PropTypes.any
};

InputComponent.defaultProps = {
   type: "text",
   placeholder: "",
   inputProps: {},
   fullWidth: true
};

export default InputComponent;
