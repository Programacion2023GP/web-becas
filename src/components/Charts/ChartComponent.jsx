{
   /* <Chart 
chart="area" 
name="valores"   
titles={["Título 1", "Título 2", "Título 3"]} 
values={[10, 20, 30]}  
card={true} 
width={5}/> */
}

import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsReact from "highcharts-react-official";
import React, { useState, useEffect } from "react";
import { createChart } from "./charts";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./Charts.css";

// import { v4 as uuidv4 } from "uuid";

// import { Card } from "primereact/card";
import { Box, Card } from "@mui/material";

export const ChartComponent = ({ chart, name, titles, values, inCard, width, enable3D = true }) => {
   const [isLoading, setIsLoading] = useState(true);
   const id = `${name}-${chart}`; //uuidv4();
   const [card, setCard] = useState(inCard);
   const widthClass = `width-${width || 10}`;
   const [showTable, SetTable] = useState(false);

   useEffect(() => {
      createChart(id, chart, name, titles, values, enable3D);

      // Establecer isLoading después de la renderización de los gráficos
      setIsLoading(false);
   }, [chart, name, titles, values, card, width]);

   return (
      <>
         {card ? (
            <Card /* title={title} */ className={widthClass} sx={{ margin: 1 }}>
               <div id={id}></div>
            </Card>
         ) : (
            <Box margin={1} className={widthClass}>
               <div id={id} />
            </Box>
         )}
      </>
   );
};
