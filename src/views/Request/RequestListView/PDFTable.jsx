import jsPDF from "jspdf";
// import { encode } from 'base64-js';

const PDFTable = () => {
   const data = {
      numero: "123456",
      producto: "Pizza",
      canitdad: 5,
      precio: 20,
      fecha: "2023-09-11",
      cliente: "Angelo",
      total: 100.0
   };
   // Supongamos que tienes la URL de la imagen
   // const imageUrl = "https://backend.atc.gomezpalacio.gob.mx/ATC/sp-solicitudes/1/1-evidencia-1.JPG";
   const imageUrl =
      "https://w7.pngwing.com/pngs/665/882/png-transparent-spider-man-logo-spider-man-spider-web-logo-black-spider-siluet-logo-superhero-insects-monochrome.png";

   // const imgData = "data:image/JPG;base64," +  encode(imageUrl);
   const base64EncodedUrl = btoa(imageUrl);

   const pdfGenerate = () => {
      // Función para cargar una imagen desde una URL y convertirla a Base64
      const urlToBase64 = async (url) => {
         try {
            // Cargar la imagen desde la URL
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            // Convertir el array buffer a Base64
            const base64Image = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
            // Devolver la URL Base64
            return `data:${response.headers.get("content-type")};base64,${base64Image}`;
         } catch (error) {
            console.error("Error al convertir la URL a Base64:", error);
            return null;
         }
      };

      // Ejemplo de uso
      urlToBase64(imageUrl)
         .then((base64) => {
            console.log("URL Base64:", base64);
            // Aquí puedes utilizar la URL Base64 para mostrar la imagen en tu aplicación
         })
         .catch((error) => console.error("Error:", error));

      const doc = new jsPDF();

      // Encabezados de la factura
      doc.addImage(base64EncodedUrl, "JPG", 10, 100, 100, 100);
      doc.text(`Factura`, 95, 20);
      doc.text(`N° Factura: ${data.numero}`, 10, 20);
      doc.text(`Fecha: ${data.fecha}`, 10, 30);
      doc.text(`Cliente: ${data.cliente}`, 10, 40);
      doc.text(`Total: ${data.total}`, 10, 50);

      // Guardar el pdf con un nombre esprecifico
      doc.save(`factura_${data.numero}.pdf`);
   };

   return (
      <>
         <img src={imageUrl} height={100} />
         <h1>FACTURA</h1>
         <p>N° Factura: {data.numero} </p>
         <p>Fecha: {data.fecha}</p>
         <p>Cliente: {data.cliente}</p>
         <p>Total: {data.total}</p>
         <button onClick={pdfGenerate}>Generar PDF</button>
      </>
   );
};

export default PDFTable;
