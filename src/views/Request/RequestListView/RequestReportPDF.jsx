import { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import logo_gpd from "/src/assets/images/logo-gpd.png";
import { display, width } from "@mui/system";
import { Typography } from "@mui/material";
import { formatCurrency, formatDatetime, formatPhone, splitArroba } from "../../../utils/Formats";
import Toast from "../../../utils/Toast";
import { IconCheck } from "@tabler/icons";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
// import MyPDFComponent from "../../../utils/createPDF";
// import { Document, Page } from "@react-pdf/renderer";
// import {} from "html-pdf-client";

export default function RequestReportPDF({ obj, targetSection = "sectionRequest" }) {
   const sectionRequestRef = useRef(null);
   const sectionDocsRef = useRef(null);
   const sectionPaymentsRef = useRef(null);

   const checkCross = (value, size = 24) => {
      try {
         return value ? (
            <div className="checkCross" style={{ color: "green", fontSize: size + 5 }}>
               ✔️
            </div>
         ) : (
            <div className="checkCross" style={{ color: "red", fontSize: size }}>
               ❌
            </div>
         );
         // return value ? <CheckIcon height={size} /> : <CloseIcon fontSize="small" />;
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const titleStyle = { backgroundColor: "#364152", color: "whitesmoke", fontSize: 18, padding: 8, borderBottom: "1px solid white" },
      subtitleStyle = { backgroundColor: "#525C6A", color: "whitesmoke", fontSize: 14, padding: 6, border: "1px solid #364152" },
      valueStyle = { fontSize: 12, padding: 6, border: "1px solid #364152" },
      subtitleStyleHidden = {
         backgroundColor: "#525C6A",
         color: "whitesmoke",
         fontSize: 14,
         padding: 6,
         border: "1px solid #364152",
         display: ["RECHAZADA", "CANCELADA"].includes(obj.status) ? "block" : "none"
      },
      valueStyleHidden = { fontSize: 12, padding: 6, border: "1px solid #364152", display: ["RECHAZADA", "CANCELADA"].includes(obj.status) ? "block" : "none" };

   const tableRows = [
      //DATOS GENERALES
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Folio" },
                     { colSpan: null, style: subtitleStyle, title: "Fecha de Solicitud" },
                     { colSpan: null, style: subtitleStyle, title: "Fecha de Termino" },
                     { colSpan: null, style: subtitleStyle, title: "Estudio Socio-Económico" },
                     { colSpan: null, style: subtitleStyle, title: "Estatus de la solicitud" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: obj.folio },
                  { colSpan: null, style: valueStyle, value: formatDatetime(obj.created_at, true) },
                  { colSpan: null, style: valueStyle, value: formatDatetime(obj.end_date, true) },
                  { colSpan: null, style: valueStyle, value: obj.socioeconomic_study },
                  { colSpan: null, style: valueStyle, value: obj.status }
               ]
            },
            {
               tHeadRows: [[{ colSpan: 5, style: subtitleStyleHidden, title: obj.status == "RECHAZADA" ? "Causa del Rechazo" : "" }]],
               tBodyCells: [{ colSpan: 5, style: valueStyleHidden, value: obj.status == "RECHAZADA" ? obj.rejected_feedback : "" }]
            }
         ]
      },
      //DATOS DEL TUTOR
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 4, style: titleStyle, title: "DATOS DEL TUTOR" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "CURP" },
                     { colSpan: null, style: subtitleStyle, title: "Parentesco" },
                     { colSpan: null, style: subtitleStyle, title: "Nombre Completo" },
                     { colSpan: null, style: subtitleStyle, title: "Teléfono" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: obj.tutor_curp },
                  { colSpan: null, style: valueStyle, value: obj.tutor_relationship },
                  { colSpan: null, style: valueStyle, value: `${obj.tutor_name} ${obj.tutor_paternal_last_name} ${obj.tutor_maternal_last_name}` },
                  { colSpan: null, style: valueStyle, value: formatPhone(obj.tutor_phone) }
               ]
            },
            {
               tHeadRows:
                  obj.second_ref !== "Familiar"
                     ? [[{ colSpan: 5, style: subtitleStyle, title: "¿Se autoriza a una familiar recoger el apoyo?" }]]
                     : [
                          [{ colSpan: 5, style: subtitleStyle, title: `¿Se autoriza a una familiar recoger el apoyo? - SÍ` }],
                          [
                             { colSpan: 2, style: subtitleStyle, title: "Parentesco" },
                             { colSpan: 3, style: subtitleStyle, title: "Nombre del familiar" }
                          ]
                       ],
               tBodyCells:
                  obj.second_ref !== "Familiar"
                     ? [{ colSpan: 5, style: valueStyle, value: obj.second_ref == "Familiar" ? `SÍ` : "NO" }]
                     : [
                          {
                             colSpan: 2,
                             style: valueStyle,
                             value: obj.second_ref_relationship
                          },
                          {
                             colSpan: 3,
                             style: valueStyle,
                             value: obj.second_ref_fullname
                          }
                       ]
            }
         ]
      },
      //DATOS DEL ALUMNO
      {
         style: { pageBreakAfter: "always" },
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 5, style: titleStyle, title: "DATOS DEL ALUMNO" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "CURP" },
                     { colSpan: null, style: subtitleStyle, title: "Nombre Completo" },
                     { colSpan: null, style: subtitleStyle, title: "Fecha de Nacimeinto" },
                     { colSpan: null, style: subtitleStyle, title: "Sexo" },
                     { colSpan: null, style: subtitleStyle, title: "Discapacidad" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: obj.curp },
                  { colSpan: null, style: valueStyle, value: `${obj.name} ${obj.paternal_last_name} ${obj.maternal_last_name}` },
                  { colSpan: null, style: valueStyle, value: formatDatetime(obj.birthdate, false) },
                  { colSpan: null, style: valueStyle, value: obj.gender },
                  { colSpan: null, style: valueStyle, value: obj.disability }
               ]
            },
            {
               // MAS DATOS
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: 2, style: subtitleStyle, title: "Grado escolar" },
                     { colSpan: 3, style: subtitleStyle, title: "Promedio" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, style: valueStyle, value: obj.grade },
                  { colSpan: 3, style: valueStyle, value: obj.average }
               ]
            },
            {
               //COMUNIDAD p1
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "C.P." },
                     { colSpan: null, style: subtitleStyle, title: "Estado" },
                     { colSpan: null, style: subtitleStyle, title: "Municipio" },
                     { colSpan: 2, style: subtitleStyle, title: "Perímetro" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: obj.community.CodigoPostal },
                  { colSpan: null, style: valueStyle, value: obj.community.Estado },
                  { colSpan: null, style: valueStyle, value: obj.community.Municipio },
                  { colSpan: 2, style: valueStyle, value: obj.community.Perimetro }
               ]
            },
            {
               //COMUNIDAD p2
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: 2, style: subtitleStyle, title: "Colonia" },
                     { colSpan: 3, style: subtitleStyle, title: "Dirección" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, style: valueStyle, value: obj.community.Colonia },
                  { colSpan: 3, style: valueStyle, value: `${obj.street} #${obj.num_ext} ${obj.num_int !== "S/N" ? `N° interior: ${obj.num_int}` : ""}` }
               ]
            },
            {
               tHeadRows: [[{ colSpan: 5, style: subtitleStyle, title: "Comentarios de Solicitud" }]],
               tBodyCells: [{ colSpan: 5, style: valueStyle, value: obj.comments }]
            }
         ]
      },
      //DATOS DE LA ESCUELA
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 5, style: titleStyle, title: "DATOS DE LA ESCUELA" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Clave" },
                     { colSpan: null, style: subtitleStyle, title: "Nivel" },
                     { colSpan: null, style: subtitleStyle, title: "Nombre" },
                     { colSpan: null, style: subtitleStyle, title: "Teléfono" },
                     { colSpan: null, style: subtitleStyle, title: "Director" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: obj.code },
                  { colSpan: null, style: valueStyle, value: obj.level },
                  { colSpan: null, style: valueStyle, value: obj.school },
                  { colSpan: null, style: valueStyle, value: formatPhone(obj.phone) },
                  { colSpan: null, style: valueStyle, value: obj.director }
               ]
            },
            {
               //COMUNIDAD p1
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "C.P." },
                     { colSpan: null, style: subtitleStyle, title: "Estado" },
                     { colSpan: null, style: subtitleStyle, title: "Municipio" },
                     { colSpan: null, style: subtitleStyle, title: "Local o Foranea" },
                     { colSpan: null, style: subtitleStyle, title: "Perímetro" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: obj.school_community.CodigoPostal },
                  { colSpan: null, style: valueStyle, value: obj.school_community.Estado },
                  { colSpan: null, style: valueStyle, value: obj.school_community.Municipio },
                  { colSpan: null, style: valueStyle, value: obj.loc_for ? "LOCAL" : "FORANEA" },
                  { colSpan: null, style: valueStyle, value: obj.school_community.Perimetro }
               ]
            },
            {
               //COMUNIDAD p2
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: 2, style: subtitleStyle, title: "Colonia" },
                     { colSpan: 3, style: subtitleStyle, title: "Dirección" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, style: valueStyle, value: obj.school_community.Colonia },
                  {
                     colSpan: 3,
                     style: valueStyle,
                     value: `${obj.school_street} #${obj.school_num_ext} ${obj.school_num_int !== "S/N" ? `N° interior: ${obj.school_num_int}` : ""}`
                  }
               ]
            }
         ]
      },
      //DATOS FAMILIARES
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 4, style: titleStyle, title: "DATOS FAMILIARES" }],
                  [{ colSpan: 4, style: subtitleStyle, title: "¿Con quienes vive actualmente el alumno?" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Parentesco" },
                     { colSpan: null, style: subtitleStyle, title: "Edad (años)" },
                     { colSpan: null, style: subtitleStyle, title: "Ocupación" },
                     { colSpan: null, style: subtitleStyle, title: "Ingresos Mensuales" }
                  ]
               ],
               tBodyCells: obj.families.map((f) => [
                  { colSpan: null, style: valueStyle, value: f.relationship },
                  { colSpan: null, style: valueStyle, value: f.age },
                  { colSpan: null, style: valueStyle, value: f.occupation },
                  { colSpan: null, style: valueStyle, value: formatCurrency(f.monthly_income) }
               ])
            },
            {
               //INGRESOS
               tHeadRows: [
                  [{ colSpan: null, style: subtitleStyle, title: null }],
                  [
                     { colSpan: 2, style: subtitleStyle, title: "Otros Ingresos extras" },
                     { colSpan: 3, style: subtitleStyle, title: "Total de ingresos MENSUALES" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, style: valueStyle, value: formatCurrency(obj.extra_income) },
                  { colSpan: 3, style: valueStyle, value: formatCurrency(obj.monthly_income) }
               ]
            }
         ]
      },
      //DATOS ECONOMICOS
      {
         style: { pageBreakAfter: "always" },
         TableCellcolSpan: 6,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 6, style: titleStyle, title: "DATOS ECONÓMICOS" }],
                  [
                     {
                        colSpan: 6,
                        style: subtitleStyle,
                        title: "Persona(s) que sostiene el hogar (Padre, Madre, Abuelo) --- Detalle de gastos MENSUALES Familiares"
                     }
                  ],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Alimentaciópn (Despensa)" },
                     { colSpan: null, style: subtitleStyle, title: "Transporte" },
                     { colSpan: null, style: subtitleStyle, title: "Vivienda (renta, infonavit)" },
                     { colSpan: null, style: subtitleStyle, title: "Servicios (agua y luz)" },
                     { colSpan: null, style: subtitleStyle, title: "Automóvil" },
                     { colSpan: null, style: subtitleStyle, title: "TOTAL DE  EGRESOS" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: formatCurrency(obj.b3_food) },
                  { colSpan: null, style: valueStyle, value: formatCurrency(obj.b3_transport) },
                  { colSpan: null, style: valueStyle, value: formatCurrency(obj.b3_living_place) },
                  { colSpan: null, style: valueStyle, value: formatCurrency(obj.b3_services) },
                  { colSpan: null, style: valueStyle, value: formatCurrency(obj.b3_automobile) },
                  { colSpan: null, style: valueStyle, value: formatCurrency(obj.total_expenses) }
               ]
            }
         ]
      },
      //DATOS DE LA VIVIENDA
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 3, style: titleStyle, title: "DATOS DE LA VIVIENDA" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "La casa donde vivo es" },
                     { colSpan: null, style: subtitleStyle, title: "Material de techo" },
                     { colSpan: null, style: subtitleStyle, title: "Material del piso" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: splitArroba(obj.b4_house_is, false) },
                  { colSpan: null, style: valueStyle, value: splitArroba(obj.b4_roof_material, false) },
                  { colSpan: null, style: valueStyle, value: splitArroba(obj.b4_floor_material, false) }
               ]
            }
         ]
      },
      //EQUIPAMIENTO DOMÉSTICO
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 9, style: titleStyle, title: "EQUIPAMIENTO DOMÉSTICO" }],
                  [{ colSpan: 9, style: subtitleStyle, title: "Aparatos/Muebles con los que cuentan en casa" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Camas" },
                     { colSpan: null, style: subtitleStyle, title: "Lavadora de ropa" },
                     { colSpan: null, style: subtitleStyle, title: "Calentador de agua (boiler)" },
                     { colSpan: null, style: subtitleStyle, title: "Televisores" },
                     { colSpan: null, style: subtitleStyle, title: "Computadoras" },
                     { colSpan: null, style: subtitleStyle, title: "Teléfono local o celular" },
                     { colSpan: null, style: subtitleStyle, title: "Reprodcutor de música" },
                     { colSpan: null, style: subtitleStyle, title: "Estufa" },
                     { colSpan: null, style: subtitleStyle, title: "Refrigerador" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: obj.b5_beds },
                  { colSpan: null, style: valueStyle, value: obj.b5_washing_machines },
                  { colSpan: null, style: valueStyle, value: obj.b5_boilers },
                  { colSpan: null, style: valueStyle, value: obj.b5_tvs },
                  { colSpan: null, style: valueStyle, value: obj.b5_pcs },
                  { colSpan: null, style: valueStyle, value: obj.b5_phones },
                  { colSpan: null, style: valueStyle, value: obj.b5_music_player },
                  { colSpan: null, style: valueStyle, value: obj.b5_stoves },
                  { colSpan: null, style: valueStyle, value: obj.b5_refrigerators }
               ]
            },
            {
               tHeadRows: [
                  [
                     {
                        colSpan: 9,
                        style: subtitleStyle,
                        title: "¿Cuáles son los servicios con que cuentas en tu casa"
                     }
                  ],
                  [
                     { colSpan: 2, style: subtitleStyle, title: "Agua Potable" },
                     { colSpan: null, style: subtitleStyle, title: "Luz Eléctrica" },
                     { colSpan: null, style: subtitleStyle, title: "Drenaje" },
                     { colSpan: null, style: subtitleStyle, title: "Pavimento" },
                     { colSpan: null, style: subtitleStyle, title: "Automóvil" },
                     { colSpan: 2, style: subtitleStyle, title: "Línea Telefónica" },
                     { colSpan: null, style: subtitleStyle, title: "Internet" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, style: valueStyle, value: checkCross(obj.b5_drinking_water, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b5_electric_light, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b5_sewer_system, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b5_pavement, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b5_automobile, 20) },
                  { colSpan: 2, style: valueStyle, value: checkCross(obj.b5_phone_line, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b5_internet, 20) }
               ]
            }
         ]
      },
      //PROGRAMAS DE BECAS
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 4, style: titleStyle, title: "PROGRAMAS DE BECAS" }],
                  [
                     {
                        colSpan: 4,
                        style: subtitleStyle,
                        title: "¿Tu familia es beneficiaria de algunas de las siguientes becas?"
                     }
                  ],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Transporte" },
                     { colSpan: null, style: subtitleStyle, title: "Beca para el bienestar Benito Juárez" },
                     { colSpan: null, style: subtitleStyle, title: "Jóvenes Construyendo el futuro" },
                     { colSpan: null, style: subtitleStyle, title: "Otra" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b6_beca_transport, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b6_beca_benito_juarez, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b6_beca_jovenes, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(obj.b6_other, 20) }
               ]
            }
         ]
      }
   ];
   const dataDocs = [
      {
         idName: "b7_img_tutor_ine",
         url: obj.b7_img_tutor_ine,
         name: "INE FRONTAL del tutor",
         isTutor: false,
         haveSecondRef: false,
         infoDivider: {
            title: "DOCUMENTOS DEL TUTOR"
         }
      },
      {
         idName: "b7_img_tutor_ine_back",
         url: obj.b7_img_tutor_ine_back,
         name: "INE TRASERA del tutor",
         isTutor: false,
         haveSecondRef: false,
         infoDivider: {
            title: "DOCUMENTOS DEL TUTOR"
         }
      },
      {
         idName: "b7_img_tutor_power_letter",
         url: obj.b7_img_tutor_power_letter,
         name: "Documento Extra por Tutoria",
         isTutor: obj.tutor_relationship_id > 2 ? true : null,
         haveSecondRef: false,
         infoDivider: {
            title: "DOCUMENTO EXTRA EN CASO DE NO SER PADRE O MADRE"
         }
      },
      {
         idName: "b7_img_second_ref",
         url: obj.b7_img_second_ref,
         name: "INE FRONTAL del Familiar Autorizado (2da Opción)",
         isTutor: false,
         haveSecondRef: obj.second_ref == "Familiar" ? true : null,
         infoDivider: {
            title: "DOCUMENTO DEL FAMILIAR AUTORIZADO (2da Opción)"
         }
      },
      {
         idName: "b7_img_second_ref_back",
         url: obj.b7_img_second_ref_back,
         name: "INE TRASERA del Familiar Autorizado (2da Opción)",
         isTutor: false,
         haveSecondRef: obj.second_ref == "Familiar" ? true : null,
         infoDivider: {
            title: ""
         }
      },
      {
         idName: "b7_img_proof_address",
         url: obj.b7_img_proof_address,
         name: "Comprobante de Domicilio",
         isTutor: false,
         haveSecondRef: false,
         infoDivider: {
            title: "DATOS DEL ALUMNO"
         }
      },
      {
         idName: "b7_img_curp",
         url: obj.b7_img_curp,
         name: "CURP",
         isTutor: false,
         haveSecondRef: false,
         infoDivider: {
            title: ""
         }
      },
      {
         idName: "b7_img_birth_certificate",
         url: obj.b7_img_birth_certificate,
         name: "Acta de Nacimiento",
         isTutor: false,
         haveSecondRef: false,
         infoDivider: {
            title: ""
         }
      },
      {
         idName: "b7_img_academic_transcript",
         url: obj.b7_img_academic_transcript,
         name: "Certificado Estudiantil con Calificaciones",
         isTutor: false,
         haveSecondRef: false,
         infoDivider: {
            title: ""
         }
      }
   ];

   const [propDocs, setPropDocs] = useState([]);

   const getDocs = () => {
      try {
         const prop_docs = Object.keys(obj).filter((prop) => prop.startsWith("b7_img"));
         setPropDocs(prop_docs);
      } catch (error) {
         console.log("🚀 ~ getDocs ~ error:", error);
      }
   };

   useEffect(() => {
      // console.log(obj);
      const scrollToSection = () => {
         if (targetSection === "sectionRequest") sectionRequestRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionDocs") sectionDocsRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionPayments") {
            if (!obj.paymentDetails) return Toast.Info("no hay registros de pagos");
            sectionPaymentsRef.current.scrollIntoView({ behavior: "smooth" });
         }
      };

      scrollToSection();
      getDocs();
   }, [targetSection]);

   return (
      <Paper id="reportPaper" sx={{ width: "100%", overflow: "hidden" }}>
         <table style={{ border: "none", borderSpacing: "0", fontFamily: "Roboto" }}>
            <tbody>
               {/* ENCABEZADO */}
               <tr style={{ border: "none" }}>
                  <td align="left">
                     <img src={logo_gpd} style={{ width: "150px" }} />
                  </td>
                  <td align="center" colSpan={3}>
                     <img src={logo_gpd} style={{ width: "150px" }} />
                  </td>
                  <td align="right">
                     <img src={logo_gpd} style={{ width: "150px" }} />
                  </td>
               </tr>
               <tr style={{ border: "none" }} ref={sectionRequestRef}>
                  <td colSpan={5} align="center">
                     <h1 style={{ fontWeight: "bolder", fontSize: "35px" }}>DIRECCIÓN DE EDUCACIÓN</h1>
                     <h3>
                        PROGRAMA DE BECAS MUNICIPALES <br />
                        <span style={{ fontWeight: "500" }}>ESTUDIO-SOCIOECONOMICO</span>
                     </h3>
                  </td>
               </tr>
               <tr>
                  <td colSpan={5} align="center" style={{ marginBottom: "25px" }}>
                     <p align="justify" style={{ fontWeight: "normal", maxWidth: "100%" }}>
                        El presente cuestionario tiene por objetivo conocer el perfil de los aspirantes a obtener una beca del
                        <b> R. Ayuntamiento de Gómez Palacio</b>. La información proporcionada aquí debe ser completamente verdadera, por ello, lee con atención cada
                        pregunta y contesta adecuadamente.
                     </p>
                  </td>
               </tr>
               {/* DATOS */}
               {tableRows.map((tr, trIndex) => (
                  <tr key={`tr1_${trIndex}`} style={tr.style}>
                     <td key={`tc1_${trIndex}`} colSpan={tr.TableCellcolSpan}>
                        <table key={`table1_${trIndex}`} style={{ borderSpacing: "0", width: "100%", marginBottom: "35px" }}>
                           {tr.table.map((t, tIndex) => (
                              <>
                                 <thead key={`th1_${tIndex}`}>
                                    {t.tHeadRows.map((thr, thrIndex) => {
                                       if (thr[0]?.title === null) return null;
                                       return (
                                          <tr key={`thr_tr_${thrIndex}`}>
                                             {thr.map((tcTitle, innerIndex) => (
                                                <th key={`arrayTHCell_${thrIndex}_${innerIndex}`} colSpan={tcTitle.colSpan} align="center" style={tcTitle.style}>
                                                   {tcTitle.title}
                                                </th>
                                             ))}
                                          </tr>
                                       );
                                    })}
                                 </thead>
                                 <tbody key={`tb_${tIndex}`}>
                                    {t.tBodyCells.map((tc, tbIndex) => {
                                       if (Array.isArray(tc)) {
                                          return (
                                             <tr role="checkbox" tabIndex={-1} key={`tb_tr_${tbIndex}`}>
                                                {tc.map((tcValue, innerIndex) => (
                                                   <td key={`arrayTBCell_${tbIndex}_${innerIndex}`} colSpan={tcValue.colSpan} align="center" style={tcValue.style}>
                                                      {tcValue.value}
                                                   </td>
                                                ))}
                                             </tr>
                                          );
                                       } else if (typeof tc === "object") {
                                          return (
                                             <td key={`objectTBCell_${tbIndex}`} colSpan={tc.colSpan} align="center" style={tc.style}>
                                                {tc.value}
                                             </td>
                                          );
                                       }
                                    })}
                                 </tbody>
                              </>
                           ))}
                        </table>
                     </td>
                  </tr>
               ))}
               <tr>
                  <td colSpan={5}>
                     <p style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "bolder" }}>Nota:</span> El usuario a declarado bajo protesta de decir la verdad, manifiesto que la información
                        proporcionada en esta solicitud es verídica.
                     </p>
                  </td>
               </tr>
               <tr style={{ height: "50px" }}></tr> {/* SEPARADOR */}
               {/* <tr>
                  <td colSpan={5}>
                     <p style={{ textAlign: "center", fontWeight: "bolder" }}>___________________________________________________________</p>
                     <p style={{ textAlign: "center", fontWeight: "bolder" }}>NOMBRE Y FIRMA DEL PADRE, MADRE O TUTOR.</p>
                  </td>
               </tr> */}
               {/* DOCUMENTOS */}
               <tr style={{ border: "none", pageBreakBefore: "always" }} ref={sectionDocsRef}>
                  <td colSpan={5} align="center">
                     <h2 style={{ fontWeight: "bolder", fontSize: "30px" }} id="section-docs">
                        DOCUMENTOS ADJUNTOS
                     </h2>
                  </td>
               </tr>
               {dataDocs &&
                  dataDocs.map((item, index) => (
                     <tr style={index > 1 ? { border: "none", pageBreakAfter: "always" } : { border: "none" }}>
                        <td colSpan={5} align="center">
                           {item.isTutor === true && (
                              <h5 style={{ display: "block", width: "100%", mb: 1 }}>
                                 Al no ser familiar directo favor de cargar algúno de los siguientes documentos <br />
                                 <small>Carta de dependencia económica del DIF &nbsp;|&nbsp; Hoja custodia &nbsp;|&nbsp; Acta de defunción del padre o madre</small>
                              </h5>
                           )}
                           {item.haveSecondRef === true && item.infoDivider.title != "" && (
                              <>
                                 <h5 style={{ display: "block", width: "100%", mb: 1 }}>Se eligio un Familiar como 2da opción para recoger el apoyo</h5>
                              </>
                           )}
                           {![item.isTutor, item.haveSecondRef].includes(null) && (
                              <div className="containerImg">
                                 <div className="title">{item.name}</div>
                                 <img src={`${import.meta.env.VITE_HOST}/${item.url}`} style={{ maxWidth: "90%" }} />
                                 {/* <p className="caption"></p> */}
                              </div>
                           )}
                        </td>
                     </tr>
                  ))}
               {/* REGISTROS DE PAGOS */}
               {obj.paymentDetails && (
                  <>
                     <tr style={{ border: "none", pageBreakBefore: "always" }} ref={sectionPaymentsRef}>
                        <td colSpan={5} align="center">
                           <h2 style={{ fontWeight: "bolder", fontSize: "30px" }}>REGISTROS DE PAGOS</h2>
                        </td>
                     </tr>
                     {obj.paymentDetails.map((item, indexPay) => (
                        <tr style={indexPay > 0 ? { border: "none", pageBreakBefore: "always" } : { border: "none" }}>
                           <td key={`tc1_${indexPay}`} colSpan={5}>
                              <table key={`table1_${indexPay}`} style={{ borderSpacing: "0", width: "100%", marginBottom: "35px" }}>
                                 <thead key={`th1_${indexPay}`}>
                                    <tr>
                                       <th colSpan={5} align="center" style={titleStyle}>
                                          PAGO {item.payment_number}
                                       </th>
                                    </tr>
                                    <tr>
                                       <th colSpan={0} align="center" style={subtitleStyle}>
                                          Parentesco
                                       </th>
                                       <th colSpan={0} align="center" style={subtitleStyle}>
                                          Nombre de Quien Recibio el Pago
                                       </th>
                                       <th colSpan={0} align="center" style={subtitleStyle}>
                                          Monto
                                       </th>
                                       <th colSpan={0} align="center" style={subtitleStyle}>
                                          Fecha de Entrega
                                       </th>
                                    </tr>
                                 </thead>
                                 <tbody key={`tb_${indexPay}`}>
                                    <tr role="checkbox" tabIndex={-1}>
                                       <td colSpan={0} align="center" style={valueStyle}>
                                          {item.paid_to_tutor ? "TUTOR" : obj.second_ref_relationship}
                                       </td>
                                       <td colSpan={0} align="center" style={valueStyle}>
                                          {item.paid_to_tutor
                                             ? `${obj.tutor_name} ${obj.tutor_paternal_last_name} ${obj.tutor_maternal_last_name}`
                                             : obj.second_ref_fullname}
                                          {item.second_ref_fullname}
                                       </td>
                                       <td colSpan={0} align="center" style={valueStyle}>
                                          {formatCurrency(item.amount_paid)}
                                       </td>
                                       <td colSpan={0} align="center" style={valueStyle}>
                                          {formatDatetime(item.created_at)}
                                       </td>
                                    </tr>
                                    <tr>
                                       <th colSpan={4} align="center" style={subtitleStyle}>
                                          Comentarios
                                       </th>
                                    </tr>
                                    <tr role="checkbox" tabIndex={-1}>
                                       <td colSpan={4} align="center" style={valueStyle}>
                                          {item.paid_feedback}
                                       </td>
                                    </tr>
                                    <tr>
                                       <th colSpan={4} align="center" style={subtitleStyle}>
                                          Evidencia
                                       </th>
                                    </tr>
                                    <tr role="checkbox" tabIndex={-1}>
                                       <td colSpan={4} align="center" style={valueStyle}>
                                          <div className="containerImg" style={{ border: "none" }}>
                                             <img src={`${import.meta.env.VITE_HOST}/${item.img_evidence}`} style={{ maxWidth: "90%" }} />
                                          </div>
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                           </td>
                        </tr>
                     ))}
                  </>
               )}
            </tbody>
         </table>
      </Paper>
   );
}

const first = (second) => {
   <TableBody>
      {/* DATOS */}
      {tableRows.map((tr, trIndex) => (
         <>
            <TableRow key={`tr1_${trIndex}`}>
               <TableCell key={`tc1_${trIndex}`} colSpan={tr.TableCellcolSpan}>
                  <Table key={`table1_${trIndex}`}>
                     {tr.table.map((t, tIndex) => (
                        <>
                           <TableHead key={`th1_${tIndex}`}>
                              {t.tHeadRows.map((thr, thrIndex) => {
                                 if (thr[0].title === null) return;
                                 return (
                                    <TableRow key={`thr_tr_${thrIndex}`}>
                                       {thr.map((tcTitle, innerIndex) => (
                                          <TableCell key={`arrayTHCell_${thrIndex}_${innerIndex}`} colSpan={tcTitle.colSpan} align={"center"} style={tcTitle.style}>
                                             {tcTitle.title}
                                          </TableCell>
                                       ))}
                                    </TableRow>
                                 );
                              })}
                           </TableHead>
                           <TableBody key={`tb_${tIndex}`}>
                              {t.tBodyCells.map((tc, tbIndex) => {
                                 if (Array.isArray(tc)) {
                                    return (
                                       <TableRow role="checkbox" tabIndex={-1} key={`tb_tr_${tbIndex}`}>
                                          {tc.map((tcValue, innerIndex) => (
                                             <TableCell key={`arrayTBCell_${tbIndex}_${innerIndex}`} colSpan={tcValue.colSpan} align={"center"} style={tcValue.style}>
                                                {tcValue.value}
                                             </TableCell>
                                          ))}
                                       </TableRow>
                                    );
                                 } else if (typeof tc === "object")
                                    return (
                                       <TableCell key={`objectTBCell_${tbIndex}`} colSpan={tc.colSpan} align={"center"} style={tc.style}>
                                          {tc.value}
                                       </TableCell>
                                    );
                              })}
                           </TableBody>
                        </>
                     ))}
                  </Table>
               </TableCell>
            </TableRow>
            <div style={{ pageBreaBbefore: "always" }}></div>
            {/* {trIndex % 3 == 0 && <div className="page-break"></div>} */}
         </>
      ))}
      <TableRow>
         <TableCell colSpan={5}>
            <Typography textAlign={"center"}>
               <span style={{ fontWeight: "bolder" }}>Nota:</span> El usuario a declarado bajo protesta de decir la verdad, manifiesto que la información proporcionada
               en esta solicitud es verídica.
            </Typography>
         </TableCell>
      </TableRow>
      <TableRow sx={{ height: 20 }}></TableRow> {/* SEPARADOR */}
      {/* <TableRow>
         <TableCell colSpan={5}>
            <Typography textAlign={"center"} style={{ fontWeight: "bolder" }}>
               ___________________________________________________________{" "}
            </Typography>
            <Typography textAlign={"center"} style={{ fontWeight: "bolder" }}>
               NOMBRE Y FIRMA DEL PADRE, MADRE O TUTOR.
            </Typography>
         </TableCell>
      </TableRow> */}
   </TableBody>;
};
