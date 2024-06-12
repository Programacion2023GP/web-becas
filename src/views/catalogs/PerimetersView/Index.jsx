import PerimeterForm from "./Form";
import PerimeterDT from "./DataTable";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { usePerimeterContext } from "../../../context/PerimeterContext";
import { Alert, AlertTitle, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";

const PerimetersView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, perimeter, getPerimeters } = usePerimeterContext();

   useEffect(() => {
      try {
         setLoading(true);
         getPerimeters();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [perimeter]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         <PerimeterDT />
         {/* </MainCard> */}

         <PerimeterForm />
      </>
   );
};

// export const loaderIndexPerimetersView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosPerimeters = await Axios.get("/perimeters/selectIndex");
//       res.result.perimeters = axiosPerimeters.data.data.result;
//       res.result.perimeters.unshift({ id: 0, label: "Selecciona una opción..." });
//       // // console.log(res);

//       return res;
//    } catch (error) {
//       const res = ErrorRes;
//       console.log(error);
//       res.message = error;
//       res.alert_text = error;
//       sAlert.Error(error);
//       return res;
//    }
// };

export default PerimetersView;
