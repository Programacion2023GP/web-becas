/**
 * PARA INSTALAR
 * npm i @react-pdf/renderer --save --legacy-peer-deps
 *
 * PASSAR ARCHIVOS
 * import RobotoBold from "../assets/fonts/Roboto-Bold.ttf";
 * import RobotoRegular from "../assets/fonts/Roboto-Regular.ttf";
 * import RobotoItalic from "../assets/fonts/Roboto-Italic.ttf";
 * import ProtestRiot from "../assets/fonts/ProtestRiot-Regular.ttf";
 *
 * SI NO SE CUENTA CON LOS SIGUEINTES...
 * INSTALAR
 * @tabler/icons
 * sweetalert2
 * sweetalert2-react-content
 *
 * PEDIR
 * import backgroundImage from "../assets/images/Oficio.jpg";
 * import sinFirma from "../assets/images/sinFirma.png";
 */

// import logo from '../../assets/images/logo-gpd.png';
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import backgroundImage from "../assets/images/Oficio.jpg";
import firmademo from "../assets/images/FirmaDemo.png";
import sinFirma from "../assets/images/sinFirma.png";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Typography from "@mui/material/Typography";
import { cloneElement, forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { IconButton, Toolbar, Tooltip } from "@mui/material";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { PDFViewer } from "@react-pdf/renderer";
import { IconWindowMaximize, IconWindowMinimize, IconX } from "@tabler/icons";
import { useAuthContext } from "../context/AuthContext";
import { gpcDark, gpcLight, useGlobalContext } from "../context/GlobalContext";
import { formatDatetime } from "../utils/Formats";

import RobotoBold from "../assets/fonts/Roboto-Bold.ttf";
import RobotoRegular from "../assets/fonts/Roboto-Regular.ttf";
import RobotoItalic from "../assets/fonts/Roboto-Italic.ttf";
import ProtestRiot from "../assets/fonts/ProtestRiot-Regular.ttf";

//#region FUENTES
Font.register({
   family: "Roboto-Bold",
   src: RobotoBold
});

Font.register({
   family: "Roboto-Regular",
   src: RobotoRegular
});
Font.register({
   family: "Roboto-Italic",
   src: RobotoItalic
});

Font.register({
   family: "Protest-Riot",
   src: ProtestRiot
});

//#endregion

//#region ESTILOS
export const stylesPDF = StyleSheet.create({
   body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35
   },
   page: {
      flexDirection: "row"
      // backgroundColor: '#E4E4E4',
   },
   section: {
      margin: 10
   },
   image: {
      width: "30%",
      mmarginVertical: 15,
      marginHorizontal: 180
   },
   header: {
      fontSize: 12,
      marginTop: 10,
      textAlign: "center",
      color: "grey"
   },
   pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 10,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey"
   },
   subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: "Roboto-Bold"
   },
   title: {
      fontSize: 18,
      textAlign: "center",
      fontFamily: "Roboto-Bold"
   },
   author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 20
   },
   division: {
      fontSize: 15,
      textAlign: "center",
      fontFamily: "Roboto-Bold",
      textDecoration: "underline"
   },
   apartado: {
      fontFamily: "Roboto-Bold",
      fontSize: 15
   },
   text: {
      fontSize: 10,
      color: "#000"
   },
   pageBody: {
      position: "relative"
   },
   bgImage: {
      width: "100%",
      height: "100%"
   },
   viewBgImage: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%"
      // opacity: "0.5"
   },
   viewContainer: {
      position: "absolute",
      top: 125,
      left: 30,
      // height: 540,
      width: "90%"
   },

   folioDate: {
      fontFamily: "Roboto-Bold",
      fontSize: 12,
      textAlign: "right"
   },
   dataTitlesLeft: {
      fontSize: 12,
      fontFamily: "Roboto-Bold",
      fontWeight: "bold",
      textAlign: "left",
      marginBottom: 15
   },
   dataTitlesRigth: {
      fontSize: 12,
      fontFamily: "Roboto-Bold",
      fontWeight: "bold",
      textAlign: "right",
      marginBottom: 15
   },
   messageBody: {
      fontFamily: "Roboto-Regular",
      fontSize: 12,
      height: 300,
      textAlign: "justify",
      lineHeight: "1.5px"
      // marginBottom: 1
      // paddingHorizontal: 35
   },
   bolder: { fontFamily: "Roboto-Bold" },
   regular: { fontFamily: "Roboto-Regular" },
   italic: { fontFamily: "Roboto-Italic" },
   letterSpace: {
      letterSpacing: 5
   },
   p: {
      marginVertical: 10
   },
   center: { marginHorizontal: "auto" },
   textCenter: {
      textAlign: "center"
   },
   row: {
      display: "flex",
      flexDirection: "row"
   },
   column: {
      flexDirection: "column"
   },
   table: {
      border: "2px solid black",
      flexDirection: "row",
      marginVertical: 5,
      padding: 0
      // textAlign: "center"
   },
   cell: {
      border: "1px solid black",
      flexWrap: "wrap",
      fontSize: 10,
      textAlign: "center",
      justifyContent: "center",
      padding: 5,
      margin: "-.5 0 0 -0.5"
   },
   firmContainer: {
      fontFamily: "Roboto-Bold",
      textAlign: "center",
      fontSize: 14,
      height: 150,
      fontWeight: "heavy",
      marginLeft: 30
   },
   firma: {
      width: "200px",
      left: "50%",
      transform: "translateX(-100%)",
      marginBottom: -10
   },
   upperCase: {
      textTransform: "uppercase"
   },
   lowerCase: {
      textTransform: "lowercase"
   },
   capitalizeCase: {
      textTransform: "capitalize"
   }

   // textContent: {
   //     textAlign: "justify",
   //     lineHeight: 1.5,
   // }
});
//#endregion ESTILOS

const formDataInitial = {
   folio: "",
   date: null,
   directorFrom: "",
   departmentFrom: "",
   directorTo: "",
   departmentTo: "",
   workstationFirm: "",
   imgFirm: sinFirma,
   directorFirm: ""
};

// Componente que representa el documento OficioPDF
export const DocumentPDF = ({ children, watermark = "Departamento Emisor", formData = { formDataInitial } }) => {
   return (
      <Document>
         {/* <Page size="A4" style={stylesPDF.body} wrap>
                
            </Page> */}
         <Page size="LETTER" style={stylesPDF.page} wrap>
            {/* <View style={stylesPDF.pageBody}> */}
            <View style={stylesPDF.viewBgImage}>
               <Text style={stylesPDF.header} fixed>
                  ~ {watermark} ~
               </Text>
               <Image style={stylesPDF.bgImage} src={backgroundImage} />
            </View>
            <View style={stylesPDF.viewContainer}>
               {/* <Image style={stylesPDF.image} src={logo}></Image> */}
               {/* <Text style={stylesPDF.title}>Solicitud Ciudadana</Text>
                    <Text style={stylesPDF.author}>Sec. Particular</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={stylesPDF.author}><Text style={{ fontFamily: 'Roboto-Bold', textDecoration: 'underline' }}>Fecha de Solicitud:</Text> {"formData.fecha_solicitud"}</Text>
                        <Text style={stylesPDF.author}><Text style={{ fontFamily: 'Roboto-Bold', textDecoration: 'underline' }}>Folio:</Text> {"formData.id"}</Text>
                    </View> */}

               <View style={stylesPDF.folioDate}>
                  <Text>Folio: #{formData.folio}</Text>
                  <Text style={{ fontFamily: "Roboto-Regular" }}>Gómez Palacio, Dgo., {formData.date ? formatDatetime(formData.date, false) : "--/--/----"}</Text>
               </View>

               <View style={stylesPDF.dataTitlesLeft}>
                  <Text style={stylesPDF.upperCase}>{formData.directorFrom}</Text>
                  <Text style={stylesPDF.upperCase}>{formData.departmentFrom}</Text>
                  <Text style={stylesPDF.letterSpace}>PRESENTE.- </Text>
               </View>

               <View style={stylesPDF.dataTitlesRigth}>
                  <Text>CON ATENCIÓN A:</Text>
                  <Text style={stylesPDF.upperCase}>{formData.directorTo}</Text>
                  <Text style={stylesPDF.upperCase}>{formData.departmentTo}</Text>
               </View>

               {/* CUERPO DEL MENSAJE */}
               <View style={stylesPDF.messageBody}>{children}</View>
               {/* CUERPO DEL MENSAJE */}

               <View style={stylesPDF.firmContainer}>
                  <Text style={[stylesPDF.letterSpace, { fontSize: 10 }]}>ATENTAMENTE: </Text>
                  <Text style={stylesPDF.upperCase}>{formData.workstationFirm}</Text>
                  <Image style={stylesPDF.firma} src={formData.imgFirm ?? formDataInitial.imgFirm} />
                  <Text>______________________________________</Text>
                  <Text style={stylesPDF.upperCase}>{formData.directorFirm} </Text>
               </View>
            </View>

            <Text style={stylesPDF.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
            {/* </View> */}
         </Page>
      </Document>
   );
};

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="down" ref={ref} {...props} />;
});
export const ModalPDF = ({ children, open, setOpen, formTitle = "titulo", watermark, formData }) => {
   const { auth } = useAuthContext();
   const mySwal = withReactContent(Swal);
   const [fullScreenDialog, setFullScreenDialog] = useState(false);
   const { setLoadingAction } = useGlobalContext();

   const handleClose = () => {
      setOpen(false);
   };

   useEffect(() => {
      // console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", drivers);
   }, []);

   return (
      <div>
         <Dialog
            open={open}
            TransitionComponent={Transition}
            maxWidth={"lg"}
            keepMounted
            fullWidth
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
            fullScreen={fullScreenDialog}
         >
            <DialogTitle my={0} py={0} sx={{ backgroundColor: gpcDark, color: gpcLight }}>
               <Toolbar sx={{ py: 0 }}>
                  <Typography variant="h2" my={0} py={0} color={gpcLight} sx={{ ml: 2, flex: 1, py: 0, pt: 0, pb: 0, padding: "0px 24px !important" }}>
                     {formTitle}
                  </Typography>
                  {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
                  {"title"}
               </Typography> */}
                  {/* <Tooltip title={`Exportar Reporte a PDF`} placement="top">
                  <IconButton color="inherit" onClick={() => downloadPDF("reportPaper")}>
                     <IconFileTypePdf color="red" />
                  </IconButton>
               </Tooltip>
               <Tooltip title={`Imprimir Reporte`} placement="top">
                  <IconButton color="inherit" onClick={() => printContent("reportPaper")}>
                     <IconPrinter />
                  </IconButton>
               </Tooltip> */}
                  <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
                     <IconButton color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
                        {fullScreenDialog ? <IconWindowMinimize /> : <IconWindowMaximize />}
                     </IconButton>
                  </Tooltip>
                  <Tooltip title={`Cerrar ventana`} placement="top">
                     <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
                        <IconX />
                     </IconButton>
                  </Tooltip>
               </Toolbar>
            </DialogTitle>
            <DialogContent sx={{ pb: 0, height: "90vh" }}>
               <PDFViewer width={"100%"} height={"99%"}>
                  <DocumentPDF watermark={watermark} formData={formData}>
                     {children}
                  </DocumentPDF>
               </PDFViewer>
            </DialogContent>
         </Dialog>
      </div>
   );
};
