import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

const ValuePreview = ({ col, title, value }) => {
   return (
      <Grid xs={12} md={col} m={2}>
         <Typography variant="h5" mb={0.5}>
            {title}
         </Typography>
         <Typography variant="h4">{value}</Typography>
      </Grid>
   );
};

export default ValuePreview;
