import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import exportingInit from "highcharts/modules/exporting"; // Importa el módulo de exportación de Highcharts

export const createChart = (id, chart, title, causas, conteos, enable3D) => {
   Highcharts3D(Highcharts);
   exportingInit(Highcharts);
   const finalChartConfig = [];

   finalChartConfig.push(configChart(chart, enable3D));
   finalChartConfig.push(configLegend());
   finalChartConfig.push(configTitle(chart, title, conteos));
   finalChartConfig.push(configPlotOptions(chart));
   finalChartConfig.push(configXaxis(chart, causas));
   finalChartConfig.push(configYaxis());
   finalChartConfig.push(configData(chart, causas, conteos));
   finalChartConfig.push({
      exporting: {
         enabled: true,
         buttons: {
            // Aquí puedes agregar tus botones personalizados
            contextButton: {
               menuItems: [
                  {
                     text: "Imprimir Gráfico", // Texto personalizado para el botón de impresión
                     onclick: function () {
                        this.print();
                     }
                  }
                  // {
                  //     text: 'Zoom', // Texto personalizado para el botón de impresión
                  //     onclick: function () {
                  //         this.zoomType();
                  //     }
                  // },
                  // {
                  //     text: 'Exponer Tabla', // Texto del botón personalizado
                  //     onclick: function () {

                  //     }
                  // },
               ]
            }
         }
      }
   });
   Highcharts.chart(id, Object.assign({}, ...finalChartConfig));
};
const configChart = (chart, enable3D) => {
   switch (chart) {
      case "column":
      case "bar":
         return {
            chart: {
               type: `${chart}`,
               animation: true,
               options3d: {
                  enabled: enable3D,
                  alpha: 10,
                  beta: 20,
                  depth: 100,
                  viewDistance: 25
               }
            }
         };
      case "pie":
         return {
            chart: {
               type: `${chart}`,
               options3d: {
                  enabled: enable3D,
                  alpha: 45,
                  beta: 0
               }
            }
         };
      default:
         return {}; // Devuelve un objeto vacío si el tipo de gráfico no es reconocido
   }
};

const configLegend = () => {
   return {
      legend: {
         bubbleLegend: {
            enabled: true,
            minSize: 20,
            maxSize: 60,
            ranges: [
               {
                  value: 14
               },
               {
                  value: 89
               }
            ]
         }
      }
   };
};

const configTitle = (chart, title, conteos) => {
   const total = conteos.reduce((total, numero) => total + numero, 0);

   switch (chart) {
      case "bar":
      case "column":
      case "line":
         return {
            title: {
               text: title
            },
            subtitle: {
               text: `total de registros: ${total}`
            }
         };
      case "pie":
      case "area":
         return {
            title: {
               text: title
            },
            subtitle: {
               text: `total de registros: ${total}`
            },
            accessibility: {
               point: {
                  valueSuffix: "%"
               }
            },
            tooltip: {
               pointFormat: `{series.name}: <b>{point.percentage:.1f}% de ${total} registros</b>`
            }
         };
   }
};

const configPlotOptions = (chart) => {
   switch (chart) {
      case "bar":
      case "column":
         return {
            plotOptions: {
               column: {
                  pointPadding: 0.2,
                  // Ajusta este valor para cambiar el espaciado entre columnas
                  cursor: "pointer",
                  dataLabels: {
                     enabled: true,
                     format: "{point.y:.0f}", // Mostrar solo números enteros
                     distance: 150, // Ajusta este valor según sea necesario
                     style: {
                        color: "black",
                        fontSize: "12px",
                        fontWeight: "bold"
                     }
                  },
                  depth: 150,
                  colorByPoint: true,
                  allowPointSelect: false
               }
            }
         };
      case "pie":
      case "area":
         return {
            plotOptions: {
               pie: {
                  allowPointSelect: true,
                  cursor: "pointer",
                  depth: 35,
                  slicedOffset: 20,
                  dataLabels: {
                     enabled: true,
                     format: `<b>{point.name}</b>: {point.percentage:.1f} % de un total de registros`, // Formato para mostrar el nombre y el porcentaje
                     distance: 30 // Distancia de las etiquetas desde el centro del pastel
                  }
               }
            }
         };
   }
};

const configXaxis = (chart, titles) => {
   switch (chart) {
      case "line":
      case "area":
         return {
            xAxis: {
               type: "category",
               categories: ["", ...titles],
               title: {
                  text: "",
                  align: "middle"
               },
               labels: {
                  autoRotation: [-45, -90],
                  style: {
                     fontSize: "13px",
                     fontFamily: "Verdana, sans-serif"
                  }
               }
            }
         };
      default:
         return {
            xAxis: {
               type: "category",
               categories: [""],
               title: {
                  text: "total",
                  align: "middle"
               },
               labels: {
                  autoRotation: [-45, -90],
                  style: {
                     fontSize: "13px",
                     fontFamily: "Verdana, sans-serif"
                  }
               }
            }
         };
   }
};
const configYaxis = () => {
   return {
      yAxis: {
         title: {
            text: "total",
            align: "middle"
         }
      }
   };
};

const configData = (chart, causas, conteos) => {
   switch (chart) {
      case "bar":
      case "column":
         return {
            series: causas.map((name, index) => ({
               name: name,
               type: chart,
               data: [{ y: conteos[index], color: "#" + Math.floor(Math.random() * 16777215).toString(16) }],
               dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: "#FFFFFF",
                  align: "right",
                  format: "{point.y:.1f}",
                  y: 0,
                  style: {
                     fontSize: "13px",
                     fontFamily: "Verdana, sans-serif"
                  }
               }
            }))
         };
      case "pie":
      case "area":
         return {
            series: [
               {
                  type: chart,
                  name: "Porcentaje obtenido",
                  data: causas.map((value, index) => ({
                     name: value,
                     y: conteos[index],
                     sliced: index === 2,
                     selected: index === 2
                  }))
               }
            ]
         };

      case "line":
         return {
            series: [
               {
                  data: conteos.map((value, index) => ({
                     y: value, // El valor del punto en la serie
                     x: index + 1 // El índice del punto más 1 (para empezar desde 1)
                  }))
               }
            ]
         };
   }
};
