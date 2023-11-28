import * as React from "react";
import PropTypes from "prop-types";
import ReactInputMask from "react-input-mask";
import { NumericFormat } from "react-number-format";

export const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
   const { onChange, ...other } = props;
   return (
      <ReactInputMask
         {...other}
         mask="(###)###-##-##"
         definitions={{
            "#": /[1-9]/
         }}
         inputRef={ref}
         onAccept={(value) => onChange({ target: { name: props.name, value } })}
         overwrite
      />
   );
});

// TextMaskCustom.propTypes = {
//    name: PropTypes.string.isRequired,
//    onChange: PropTypes.func.isRequired
// };

export const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(props, ref) {
   const { onChange, ...other } = props;

   return (
      <NumericFormat
         {...other}
         getInputRef={ref}
         onValueChange={(values) => {
            onChange({
               target: {
                  name: props.name,
                  value: values.value
               }
            });
         }}
         thousandSeparator
         valueIsNumericString
         prefix="$"
      />
   );
});

NumericFormatCustom.propTypes = {
   name: PropTypes.string.isRequired,
   onChange: PropTypes.func.isRequired
};
