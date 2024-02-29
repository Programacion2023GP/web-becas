import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { IconEqual } from "@tabler/icons";
import { Divider } from "@mui/material";
import { InputComponentv3 } from "./Form/InputComponent2";
import { useState } from "react";

function ValueLabelComponent(props) {
   const { children, value } = props;

   return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
         {children}
      </Tooltip>
   );
}

ValueLabelComponent.propTypes = {
   children: PropTypes.element.isRequired,
   value: PropTypes.number.isRequired
};

const iOSBoxShadow = "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const IOSSlider = styled(Slider)(({ theme }) => ({
   color: theme.palette.mode === "dark" ? "#0a84ff" : "#007bff",
   height: 5,
   padding: "15px 0",
   "& .MuiSlider-thumb": {
      height: 20,
      width: 20,
      backgroundColor: "#fff",
      boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
      "&:focus, &:hover, &.Mui-active": {
         boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
         // Reset on touch devices, it doesn't add specificity
         "@media (hover: none)": {
            boxShadow: iOSBoxShadow
         }
      },
      "&:before": {
         boxShadow: "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)"
      }
   },
   "& .MuiSlider-valueLabel": {
      fontSize: 12,
      fontWeight: "normal",
      top: -6,
      backgroundColor: "unset",
      color: theme.palette.text.primary,
      "&::before": {
         display: "none"
      },
      "& *": {
         background: "transparent",
         color: theme.palette.mode === "dark" ? "#fff" : "#000"
      }
   },
   "& .MuiSlider-track": {
      border: "none",
      height: 5
   },
   "& .MuiSlider-rail": {
      opacity: 0.5,
      boxShadow: "inset 0px 0px 4px -2px #000",
      backgroundColor: "#d0d0d0"
   }
}));

const PrettoSlider = styled(Slider)({
   color: "#52af77",
   height: 3, //8,
   "& .MuiSlider-track": {
      border: "none"
   },
   "& .MuiSlider-thumb": {
      height: 17, //24,
      width: 17, //24,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
         boxShadow: "inherit"
      },
      "&::before": {
         display: "none"
      }
   },
   "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize: 12,
      background: "unset",
      padding: 0,
      width: 23, //32,
      height: 23, //32,
      borderRadius: "50% 50% 50% 0",
      backgroundColor: "#52af77",
      transformOrigin: "bottom left",
      transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
      "&::before": { display: "none" },
      "&.MuiSlider-valueLabelOpen": {
         transform: "translate(50%, -70%) rotate(-45deg) scale(1)"
      },
      "& > *": {
         transform: "rotate(45deg)"
      }
   }
});

const AirbnbSlider = styled(Slider)(({ theme }) => ({
   color: "#3a8589",
   height: 3,
   padding: "13px 0",
   "& .MuiSlider-thumb": {
      height: 27,
      width: 27,
      backgroundColor: "#fff",
      border: "1px solid currentColor",
      "&:hover": {
         boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)"
      },
      "& .airbnb-bar": {
         height: 9,
         width: 1,
         backgroundColor: "currentColor",
         marginLeft: 1,
         marginRight: 1
      }
   },
   "& .MuiSlider-track": {
      height: 3
   },
   "& .MuiSlider-rail": {
      color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
      opacity: theme.palette.mode === "dark" ? undefined : 1,
      height: 3
   }
}));

function AirbnbThumbComponent(props) {
   const { children, ...other } = props;
   return (
      <SliderThumb {...other}>
         {children}
         <span className="airbnb-bar" />
         <span className="airbnb-bar" />
         <span className="airbnb-bar" />
      </SliderThumb>
   );
}

AirbnbThumbComponent.propTypes = {
   children: PropTypes.node
};

const SliderComponent = ({ width = 150, min = 0, max = 100, defaultValue = [20, 40], values, setValues }) => {
   const handleChange = (e) => {
      // console.log(e);
      const values = e.target.value;
      console.log(values);
      setValues(values);
   };
   console.log(values);
   return (
      <Box sx={{ width: width, my: 3 }}>
         <PrettoSlider valueLabelDisplay="on" aria-label="pretto slider" size="small" defaultValue={defaultValue} onChange={handleChange} min={min} max={max} />
      </Box>
   );
};

export const SliderWithScoreComponent = ({ width = 150, min = 0, max = 100, defaultValue = [20, 40], values, handleChangeContinue, idName }) => {
   const [value, setValue] = useState(defaultValue);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };
   const handleChangeCommitted = async (event, newValue) => {
      console.log("Slider value after change:", newValue);
      // handleChangeContinue(newValue);
   };
   return (
      <Box sx={{ width: width, my: 3, display: "flex" }}>
         <PrettoSlider
            id={`slide_${idName}`}
            name={`slide_${idName}`}
            valueLabelDisplay="on"
            aria-label="pretto slider"
            aria-labelledby="continuous-slider"
            size="small"
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommitted}
            min={min}
            max={max}
            marks={[
               {
                  value: min,
                  label: `${min}`
               },
               {
                  value: max,
                  label: `${max}`
               }
            ]}
         />
         <IconEqual style={{ marginLeft: 10, marginTop: 4 }} width={150} />
         <InputComponentv3
            idName={idName}
            label={"pts."}
            type="number"
            value=""
            placeholder={"0"}
            setFieldValue={""}
            onChange={""}
            onBlur={""}
            error={""}
            touched={""}
         />

         <Divider orientation="vertical" sx={{ mx: 1 }} />
      </Box>
   );
};
export default SliderComponent;

export function CustomizedSlider() {
   return (
      <Box sx={{ width: 320 }}>
         <Typography gutterBottom>iOS</Typography>
         <IOSSlider aria-label="ios slider" defaultValue={60} valueLabelDisplay="on" />
         <Box sx={{ m: 3 }} />
         <Typography gutterBottom>pretto.fr</Typography>
         <PrettoSlider valueLabelDisplay="on" aria-label="pretto slider" defaultValue={[20, 40]} />
         <Box sx={{ m: 3 }} />
         <Typography gutterBottom>Tooltip value label</Typography>
         <Slider
            valueLabelDisplay="auto"
            slots={{
               valueLabel: ValueLabelComponent
            }}
            aria-label="custom thumb label"
            defaultValue={20}
         />
         <Box sx={{ m: 3 }} />
         <Typography gutterBottom>Airbnb</Typography>
         <AirbnbSlider
            slots={{ thumb: AirbnbThumbComponent }}
            getAriaLabel={(index) => (index === 0 ? "Minimum price" : "Maximum price")}
            valueLabelDisplay="on"
            defaultValue={[20, 40]}
         />
      </Box>
   );
}
