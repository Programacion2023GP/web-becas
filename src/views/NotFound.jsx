import { Button, Container, Typography } from "@mui/material";
import Icon404 from "../components/icons/Icon404";
import { Link, useRouteError } from "react-router-dom";
import { HomeTwoTone } from "@mui/icons-material";
import ImgNotFound from "../assets/images/not-found.jpg";
import { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";

const NotFound = () => {
   const { setLoading, setLoadingAction } = useGlobalContext();
   const error = useRouteError();

   console.log(error);
   // alert(error);
   let errorText = "",
      errorDetail = "",
      errorStack = "",
      srcImg = "";
   if (error) {
      errorDetail = error.data;
      errorStack = error.statusText;
      if (error.error) {
         errorDetail = error.error.message;
         errorStack = error.error.stack;
      }
   }

   switch (error.status) {
      case 404:
         errorText = "¡La página que está buscando fue movida, eliminada, renombrada o podría no existir nunca!";
         srcImg = ImgNotFound;
         break;
      case 403:
         break;

      default:
         errorText = "¡La página que está buscando fue movida, eliminada, renombrada o podría no existir nunca!";
         srcImg = ImgNotFound;
         break;
   }
   useEffect(() => {
      setLoadingAction(false);
   }, []);

   return (
      <Container sx={{ textAlign: "center" }}>
         <img src={srcImg} width={"80%"} />
         <Typography variant="h1" mt={3} sx={{ fontWeight: "900" }} textTransform={"uppercase"}>
            Algo está mal
         </Typography>
         <Typography variant="body1" sx={{ width: "35%", textAlign: "center", mx: "auto", mt: 3, mb: 1 }}>
            {errorText}
         </Typography>
         <Typography variant="h6" sx={{ width: "75%", textAlign: "center", mx: "auto", mb: 3 }}>
            {errorDetail} <br />
            {errorStack}
         </Typography>
         <Button variant="contained" component={Link} to="/" startIcon={<HomeTwoTone />}>
            Regresar al inicio
         </Button>
      </Container>
   );
};
export default NotFound;
