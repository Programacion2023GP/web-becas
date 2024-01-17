import CommunityForm from "./Form";
import CommunityDT from "./DataTable";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useCommunityContext } from "../../../context/CommunityContext";
import { Alert, AlertTitle, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { usePerimeterContext } from "../../../context/PerimeterContext";

const CommunitiesView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { getPerimetersSelectIndex } = usePerimeterContext();
   const { pluralName, community, getCommunities } = useCommunityContext();

   useEffect(() => {
      try {
         setLoading(true);
         getCommunities();
         getPerimetersSelectIndex();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [community]);

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
         <CommunityDT />
         {/* </MainCard> */}

         <CommunityForm />
      </>
   );
};

// export const loaderIndexCommunitiesView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosCommunities = await Axios.get("/communities/selectIndex");
//       res.result.communities = axiosCommunities.data.data.result;
//       res.result.communities.unshift({ id: 0, label: "Selecciona una opción..." });
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

export default CommunitiesView;
