import LevelForm from "./Form";
import LevelDT from "./DataTable";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useLevelContext } from "../../../context/LevelContext";
import { Alert, AlertTitle, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";

const LevelsView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, level, getLevels } = useLevelContext();

   useEffect(() => {
      try {
         setLoading(true);
         getLevels();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [level]);

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
         <LevelDT />
         {/* </MainCard> */}

         <LevelForm />
      </>
   );
};

// export const loaderIndexLevelsView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosLevels = await Axios.get("/levels/selectIndex");
//       res.result.levels = axiosLevels.data.data.result;
//       res.result.levels.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default LevelsView;
