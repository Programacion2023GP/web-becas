import DisabilityForm from "./Form";
import DisabilityDT from "./DataTable";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useDisabilityContext } from "../../../context/DisabilityContext";
import { Alert, AlertTitle, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";

const DisabilitiesView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, disability, getDisabilities } = useDisabilityContext();

   useEffect(() => {
      try {
         setLoading(true);
         getDisabilities();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [disability]);

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
         <DisabilityDT />
         {/* </MainCard> */}

         <DisabilityForm />
      </>
   );
};

// export const loaderIndexDisabilitiesView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosDisabilities = await Axios.get("/disabilitys/selectIndex");
//       res.result.disabilitys = axiosDisabilities.data.data.result;
//       res.result.disabilitys.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default DisabilitiesView;
