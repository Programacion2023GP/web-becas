import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { formatDatetime } from "../utils/Formats";

const ClockComponent = ({ stylesBox }) => {
   const [currentDatetime, setCurrenDatetime] = useState(new Date());

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrenDatetime(new Date());
      }, 1000);

      return () => clearInterval(interval);
   }, []);

   return (
      <Box sx={stylesBox}>
         <Typography color={"whitesmoke"} fontWeight={"semibold"} variant="h4">
            {formatDatetime(currentDatetime, true, "dddd DD/MM/YYYY h:mm:ss a")}
            {/* {currentDatetime.toLocaleDateString()} {currentDatetime.toLocaleTimeString()} */}
         </Typography>
      </Box>
   );
};

export default ClockComponent;