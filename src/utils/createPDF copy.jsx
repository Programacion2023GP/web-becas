import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";

const PdfComponent = ({ pdf, service }) => {
   const [downloadOptions, setDownloadOptions] = useState({
      margin: 1,
      filename: "newfile.pdf",
      image: {
         type: "png",
         quality: 1,
         width: 600
      },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
         unit: "cm",
         format: "letter",
         orientation: "portrait",
         scrollY: 0
      }
   });

   const pdfEl = useRef(null);

   useEffect(() => {
      const subscription = service.data$.subscribe((data) => {
         // Do something with the data, maybe update state?
      });

      return () => {
         subscription.unsubscribe();
      };
   }, [service]);

   const downloadPDF = () => {
      const pEl = document.getElementById("pEl");
      const clone = pEl.innerHTML;
      const title = pdf.title ? pdf.title : "Reporte";

      setDownloadOptions({
         ...downloadOptions,
         filename: title
      });

      html2pdf().from(clone).set(downloadOptions).save();
   };

   const chunkArray = (array, chunkSize) => {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
         result.push(array.slice(i, i + chunkSize));
      }
      return result;
   };

   return <div>{/* Your React JSX goes here */}</div>;
};

export default PdfComponent;
