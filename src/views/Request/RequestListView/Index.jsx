import { useEffect, useState } from "react";
import { ROLE_CIUDADANO, useGlobalContext } from "../../../context/GlobalContext";
import { Box, Typography } from "@mui/material";

import { useRequestBecaContext } from "../../../context/RequestBecaContext";

import RequestBecaDT from "./RequestDT";
import { useAuthContext } from "../../../context/AuthContext";
import { useParams } from "react-router";
import { useRelationshipContext } from "../../../context/RelationshipContext";

const RequestListView = () => {
   const { status } = useParams();
   const { auth } = useAuthContext();
   const { setLoading } = useGlobalContext();

   const { getRequestBecas } = useRequestBecaContext();
   const [data, setData] = useState([]);
   const [dataUpload, setDataUpload] = useState(false);
   const { getRelationshipsSelectIndex } = useRelationshipContext();

   useEffect(() => {
      setLoading(true);
      getRequestBecas(status);
      getRelationshipsSelectIndex();
      // console.log("useEffect - formData", requestBecas);
   }, [status]);

   return (
      <Box sx={{ width: "100%", height: "100%" }}>
         <Typography variant="h1" color={"#364152"} mb={2} textAlign={"center"}>
            {auth.role_id === ROLE_CIUDADANO ? "MIS SOLICITUDES".toUpperCase() : "LISTADO DE SOLICITUDES".toUpperCase()} <br />
            {status != null && (
               <Typography>
                  <b>STATUS: </b>
                  {status == "en-revision"
                     ? "TERMINADA O EN REVISIÓN"
                     : status == "en-evaluacion"
                     ? "EN EVALUACIÓN"
                     : status == "aprobadas"
                     ? "APROBADA"
                     : status == "pagadas"
                     ? "PAGADA"
                     : status == "entregadas"
                     ? "ENTREGADA"
                     : status == "rechazadas"
                     ? "RECHAZADA"
                     : status == "canceladas"
                     ? "CANCELADA"
                     : ""}
               </Typography>
            )}
         </Typography>
         <RequestBecaDT status={status} />
      </Box>
   );
};

export default RequestListView;
