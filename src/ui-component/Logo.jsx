// material-ui
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logoGPD from "../assets/images/logo-gpd.png";

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */
// import { logo } from "../assets/images/logo-gpd.png";

// ==============================|| LOGO SVG ||============================== //

const Logo = ({ width = "50%" }) => {
   const theme = useTheme();

   return (
      <Box sx={{ mx: "auto", textAlign: "center" }}>
         <img src={logoGPD} alt="LogoGPD" width={width} />
      </Box>
   );
};

export default Logo;
