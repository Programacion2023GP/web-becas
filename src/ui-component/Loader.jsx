// material-ui
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

// styles
const LoaderWrapper = styled("div")({
   position: "fixed",
   top: 0,
   left: 0,
   zIndex: 1301,
   width: "100%"
});

// ==============================|| LOADER ||============================== //
const Loader = () => (
   <>
      <LoaderWrapper>
         <LinearProgress color="primary" />
      </LoaderWrapper>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 10000 }} open={true}>
         <Typography variant="h1" sx={{ color: "#fff" }}>
            CARGANDO... <CircularProgress color="inherit" />
         </Typography>
      </Backdrop>
   </>
);

export default Loader;
