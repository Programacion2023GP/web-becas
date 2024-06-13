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

import { v4 as uuidv4 } from "uuid";

import { Card } from "primereact/card";

export const ChartComponent = (props) => {
   const [isLoading, setIsLoading] = useState(true);
   const id = uuidv4();
   const [card, setCard] = useState(props.card);
   const widthClass = `width-${props.width || 10}`;
   const [showTable, SetTable] = useState(false);

   useEffect(() => {
      createChart(id, props.chart, props.name, props.titles, props.values);

      // Establecer isLoading después de la renderización de los gráficos
      setIsLoading(false);
   }, [props.chart, props.name, props.titles, props.values, props.card, props.width]);

   return (
      <>
         <br />
         {card ? (
            <Card title={props.title} className={widthClass}>
               <div id={id}></div>
            </Card>
         ) : (
            <div className={widthClass}>
               <div id={id} />
            </div>
         )}
      </>
   );
};
