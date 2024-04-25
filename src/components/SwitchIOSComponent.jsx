import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const SwitchIOSComponent = ({ checked, label, height = 26 }) => {
   const width = Math.ceil(height * 1.6); //42
   const boxSizingSize = Math.ceil(height * 0.825); //22

   const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(({ theme }) => ({
      width: width,
      height: height,
      padding: 0,
      "& .MuiSwitch-switchBase": {
         padding: 0,
         margin: 2,
         transitionDuration: "300ms",
         "&.Mui-checked": {
            transform: "translateX(16px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
               backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
               opacity: 1,
               border: 0
            },
            "&.Mui-disabled + .MuiSwitch-track": {
               opacity: 0.5
            }
         },
         "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff"
         },
         "&.Mui-disabled .MuiSwitch-thumb": {
            color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600]
         },
         "&.Mui-disabled + .MuiSwitch-track": {
            opacity: theme.palette.mode === "light" ? 0.7 : 0.3
         }
      },
      "& .MuiSwitch-thumb": {
         boxSizing: "border-box",
         width: boxSizingSize,
         height: boxSizingSize
      },
      "& .MuiSwitch-track": {
         borderRadius: height / 2,
         backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
         opacity: 1,
         transition: theme.transitions.create(["background-color"], {
            duration: 500
         })
      }
   }));

   return <FormControlLabel control={<IOSSwitch sx={{ m: 0, p: 0, mr: 1 }} defaultChecked={checked} />} label={label} />;
};
export default SwitchIOSComponent;
