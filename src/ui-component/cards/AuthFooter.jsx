// material-ui
import { Link, Typography, Stack } from "@mui/material";

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
   <Stack direction="row" justifyContent="space-between">
      <Typography variant="subtitle2" component={Link} href="#" target="_blank" underline="hover"></Typography>
      <Typography variant="subtitle2" component={Link} href="https://gomezpalacio.gob.mx/" target="_blank" underline="hover" sx={{ color: "whitesmoke" }}>
         R. Ayuntamiento de Gomez Palacio &copy; 2022-2025
      </Typography>
   </Stack>
);

export default AuthFooter;
