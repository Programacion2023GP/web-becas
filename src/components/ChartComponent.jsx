import { useState, useEffect } from "react";
import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";

function ChartComponentDefault(data) {
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      Highcharts3D(Highcharts);

      // Simulación de datos ficticios para graficar
      const fakeData = {
         options: [
            { age: "18-25", causa: "Depresión" },
            { age: "26-35", causa: "Ansiedad" },
            { age: "36-45", causa: "Problemas económicos" },
            { age: "46-55", causa: "Problemas familiares" },
            { age: "56-65", causa: "Soledad" }
         ]
      };

      const causasContador = {};
      const violenceContador = {};

      fakeData.options.forEach((item) => {
         const causa = item.age;
         const violencia = item.causa;

         causasContador[causa] = causasContador[causa] ? causasContador[causa] + 1 : 1;
         violenceContador[violencia] = violenceContador[violencia] ? violenceContador[violencia] + 1 : 1;
      });

      const causasUnicas = Object.keys(causasContador);
      const conteosCausas = causasUnicas.map((causa) => causasContador[causa]);

      const violenceUnicas = Object.keys(violenceContador);
      const conteosViolencia = violenceUnicas.map((violencia) => violenceContador[violencia]);

      // Renderizar los gráficos con Highcharts
      Highcharts.chart("pie", {
         chart: {
            type: "pie",
            options3d: {
               enabled: true,
               alpha: 45,
               beta: 0
            }
         },
         title: {
            text: "Suicidios con Respecto a Motivos",
            align: "center"
         },

         accessibility: {
            point: {
               valueSuffix: "%"
            }
         },
         tooltip: {
            pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
         },
         plotOptions: {
            pie: {
               allowPointSelect: true,
               cursor: "pointer",
               depth: 35,
               dataLabels: {
                  enabled: true,
                  format: "{point.name}"
               }
            }
         },

         series: [
            {
               type: "pie",
               name: "Share",
               data: violenceUnicas.map((value, index) => ({
                  name: value,
                  y: conteosViolencia[index],
                  sliced: index === 2, // Marcar el tercer elemento como seleccionado
                  selected: index === 2 // Marcar el tercer elemento como seleccionado
               }))
            }
         ]
      });

      Highcharts.chart("container", {
         chart: {
            animation: true,
            type: "column",
            options3d: {
               enabled: true,
               alpha: 0,
               beta: 0,
               depth: 300,
               viewDistance: 25
            }
         },
         title: {
            text: "Suicidios con Respecto a Edades"
         },
         plotOptions: {
            column: {
               cursor: "pointer",
               dataLabels: {
                  enabled: true,
                  format: "{point.name}"
               },
               depth: 150,
               colorByPoint: true, // Habilita el color por punto para que cada barra tenga un color diferente
               allowPointSelect: false // Deshabilita la selección de puntos
            }
         },
         xAxis: {
            categories: causasUnicas,

            title: {
               text: "edades",
               align: "middle"

               // O puedes usar una cadena vacía: text: ''
            } // Nombres de las barras
         },
         yAxis: {
            title: {
               text: "total",
               align: "middle"

               // O puedes usar una cadena vacía: text: ''
            }
         },
         series: causasUnicas.map((name, index) => ({
            name: name,
            type: "column",
            data: [{ y: conteosCausas[index], color: "#" + Math.floor(Math.random() * 16777215).toString(16) }]
         }))
      });

      // Establecer isLoading después de la renderización de los gráficos
      setIsLoading(false);
   }, []);

   return (
      <div>
         <div id="pie"></div>
         <div id="container"></div>
         {isLoading ? <p>Cargando...</p> : null}
      </div>
   );
}

export default ChartComponentDefault;
