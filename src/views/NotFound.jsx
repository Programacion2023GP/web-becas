import { Button, Container, Typography } from "@mui/material";
import Icon404 from "../components/icons/Icon404";
import { Link, useRouteError } from "react-router-dom";
import { HomeTwoTone } from "@mui/icons-material";
import ImgNotFound from "../assets/images/not-found.jpg";
import { useEffect } from "react";

const NotFound = () => {
   const error = useRouteError();
   console.log(error);
   let errorText = "",
      srcImg = "";

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
   useEffect(() => {}, []);

   return (
      <Container sx={{ textAlign: "center" }}>
         <img src={srcImg} width={"80%"} />
         <Typography variant="h1" mt={3} sx={{ fontWeight: "900" }} textTransform={"uppercase"}>
            Algo está mal
         </Typography>
         <Typography variant="body1" sx={{ width: "35%", textAlign: "center", mx: "auto", my: 3 }}>
            {errorText}
         </Typography>
         <Button variant="contained" component={Link} to="/" startIcon={<HomeTwoTone />}>
            Regresar al inicio
         </Button>
      </Container>
   );
};
export default NotFound;
