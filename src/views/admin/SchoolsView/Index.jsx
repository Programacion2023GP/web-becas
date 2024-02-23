import SchoolForm from "./Form";
import SchoolDT from "./DataTable";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";

import { useEffect } from "react";
import { useSchoolContext } from "../../../context/SchoolContext";
import { Alert, AlertTitle, Typography } from "@mui/material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import LevelContextProvider from "../../../context/LevelContext";
import { convertSqlToSeeder } from "../../../utils/convertSqlToSeeder";

const SchoolsView = () => {
   // const { result } = useLoaderData();
   const { setLoading } = useGlobalContext();
   const { pluralName, school, getSchools } = useSchoolContext();

   useEffect(() => {
      try {
         setLoading(true);
         getSchools();
         const sqlStatements = [
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0697Z', 'PDTE ADOLFO LOPEZ MATEOS', 'CUAUHTEMOC Y ESCOBEDO COL SANTA ROSA', 86, '7143002', 1, 'MARIA GUADALUPE VAZQUEZ RAMOS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0099C', 'ESCUELA PRIMARIA 20 DE NOVIEMBRE', 'SANTIAGO LAVIN 260 PTE', 120, '7141411', 1, 'MA. GUILLERMINA CISNEROS VALDEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1579S', 'ESC. PRIM. JOSE REVUELTAS', 'C. MEZQUITES S/N', 41,'8711 91-68-06', 1, 'SERGIO IVAN GONZALEZ PUENTES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0098D', 'ESC. PRIM. PROF. BRUNO MARTINEZ', 'MORELOS NO. 260', 120, '8717 14-11-40', 1, 'MARIA ELIZABETH TRIANA CASTAÑEDA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0639J', 'ESC.PRIM. LAZARO CARDENAS', 'AV. LOPEZ MATEOS 114', 2, '714-49-17', 1, 'LAURO CARRANA MARTINEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR00931', 'FRANCISCO SARABIA', 'CALLE ZARCO 215 PTE', 120, '7141109', 1, 'MARIA TERESA ARAGON GONZALEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0067D', 'ESC. SEC. EST. VICENTE BALANDRAN MUÑOZ', 'AV. MEXICO 91 S/N', 27, '723-67-25', 1, 'MARIA DE JESUS GALVAN SALAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1709V', 'ESC. PRIM. JOSE VASCONCELOS', 'C. SAN MARTIN 485', 44, '267-30-77', 1, 'ALFREDO MARTINEZ MARTINEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0279', 'POETISA ADELA AYALA', 'AV. DE LA ROSA S/N', 0, '8717234248', 1, 'ROSA VELIA HERRERA RODRIGUEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0172V', 'ESC. PRIM. 20 DE NOVIEMBRE T.V.', 'SANTIAGO  LAVIN 260 PTE', 120, '714-14-11', 1, 'ANA LILIA LOPEZ MORENO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0863H', 'AÑO DE JUAREZ', 'CALLE MALAQUITA 105', 0, '7233434', 1, 'ENRIQUE SILVA GODOY', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0078C', 'PROF.TEODORO AGUILAR BERMEA', 'C.8A S/N', 0, '7231525', 1, 'ANA PATRICIA TAPIA MEZA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0080F', 'LEONA VICARIO', 'AV. VISTA HERMOSA S/N', 0, 'S/N', 1, 'MA. DEL REFUGIO PACHECO ALEMAN', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0298C', 'GENERAL EMILIANO ZAPATA', 'URREA Y CUAUHTEMOC S/N', 0, '7143333', 1, 'MARIO VIESCA CARREON', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0094H', 'EMILIO CARRANZA', 'AVENIDA MORELOS 206 SUR', 0,  '2102134', 1, 'MARIA SUSANA FABELA NAVA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1338U', 'CENTENARIO DE ZAPATA', 'JUAN PABLO ESTRADA S/N', 34, '4558499', 1, 'MANUEL CABELLO FLORES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1702B', 'MÉXICO', NULL, 0, NULL, 1, 'CRISTINA ALEJANDRA CHÁVEZ GUZMÁ', NULL);",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0084B', 'DISTRIBUIDORES NISSAN NO. 71', 'CASTILLO DE CHAPULTEPEC S/N', 182, NULL, 1, 'JAIME CORTES VARGAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1556H', 'ESCUELA PRIMARIA 15 DE SEPTIEMBRE', 'CLAVELES Y PRIMAVERA S/N', 65, NULL, 1, 'ALMA DELIA MIRANDA REYES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0100B', 'INSTITUTO 18 DE MARZO A', 'AV. RAYÓN 101 SUR', 120, '7141143', 1, 'JOSÉ EDUARDO ESCOBEDO ESPINOZA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0091K', 'FRANCISCO ZARCO', 'AV. ALLENDE 262 NTE', 120, '8717147653', 1, 'PABLO OCHOA NÚÑEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0068W', 'JAIME TORRES BODET', 'BLVD. JOSÉ REBOLLO ACOSTA S/N', 1, '7190868', 1, 'ARTURO LÓPEZ SALAZAR', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0168I', 'INSTITUTO 18 DE MARZO B', 'AV. RAYÓN 101 SUR', 120, '7145901', 1, 'MARÍA DEL CARMEN LARREA REZA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1525O', 'ADELA AYALA', 'AV. BRAVO Y CALLE SÉPTIMA S/N', 1029, '8712122865', 1, 'DIANA KARINA BADILLO MORALES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0077D', 'OCTAVIO PAZ', 'AV. JUSTINO SÁNCHEZ MADARIAGA S/N', 32, '7195002', 1, 'ZOILA RODRÍGUEZ GALLARDO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1720R', 'JUSTO SIERRA', 'SILLAS VOLADORAS 481', 40, '7192681', 1, 'RICARDO RODRÍGUEZ CABRALES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0012B', 'JOSÉ VASCONCELOS', 'CALZADA LUIS J. GARZA', 179, NULL, 1, 'MANUELA GÓMEZ LUNA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EJN0087H', 'CLUB ROTARIO GÓMEZ PALACIO', 'V. NICOLAS BRAVO Y CONSTITUCIÓN', 120, '07149411', 1, 'AIDEE MARGARITA TORRES BORROEL', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0041D', 'FERNANDO MONTES DE OCA', 'CALLEJÓN DEL PIRUL S/N', 184, '8713038873', 1, 'FRANCISCO SAUCEDO FAVELA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0001V', 'INSTITUTO 18 DE MARZO', 'TERRENOS DE LA ANTIGUA CASA REDONDA S/N', 17, '7144618/20', 1, 'MARÍA DE LOS ÁNGELES JAUREGUI CORREA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0707P', 'JUAN ESCUTIA', 'JOSÉ MIGUEL CASTRO CARRILLO 300', 11, NULL, 1, 'NORA ANGÉLICA VEGA MUÑIZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0708P', 'JUAN ESCUTIA', 'JOSÉ MIGUEL CASTRO CARRILLO 300', 11, NULL, 1, 'NORA ANGÉLICA VEGA MUÑIZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DRP0035T', 'ESC. PRIMARIA NIÑOS HEROES CHAPULTEPEC', 'AV. HIDALGO', 133, '8711713893', 1, 'ROSENDO GONZALEZ FRAIRE', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0855Z', 'GENERAL EMILIANO ZAPATA', 'DOM CONOCIDO', 501, NULL, 1, 'LUIS GERARDO ANDRADE BANDA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0035T', 'ESC. PRIMARIA NIÑOS HEROES DE CHAPULTEPEC', 'AV. HIDALGO', 133, '8711713893', 1, 'ROSENDO GONZALEZ FRAIRE', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0452F', 'AÑO DE FRANCISCO VILLA', 'CALLA MAYAGOITIA 155', 61, NULL, 1, 'MANUEL DE JESÚS GONZÁLEZ ALVARADO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0103Z', 'MIGUEL HIDALGO', 'AV. NICOLAS BRAVO 411 SUR', 120, '7140755', 1, 'ADRIAN HUMBERTO MORALES GONZÁLEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0052B', 'ESC. SANTIAGO LAVIN CUADRA', 'AV. PASIONARIA', 87, '7574619', 1, 'MAURILIO GUERRERO RIVERA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0065F', 'PROFR.RAFAEL VALENZUELA', 'AV.MINA S/N ENTRE CALLE 1Y3', 72, '2953514', 1, 'MA.GUADALUPE RAMOS COHETO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1773W', 'GENERAL FRANCISCO VILLA', 'BLVD DE LAS FLORES Y JULIETAS S/N', 96, '8711783132', 1, 'FRANCISCO JAVIER INSAUSTI RODRIGUEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0092J', 'ESC. CONSTITUCION 1917', 'ESCOBEDO 1150', 86, '7144987', 1, 'SONIA MURUATO ENRIQUEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0054T', 'SECUNDARIA ISAAC NEWTO', 'SOR JUANA INES DE LA CRUZ Y GUSTAVO PEAZ', 29, '7146711', 1, 'HECTOR IVAN GUAJARDO ZABALETA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0646T', 'ESC. LIC. BENITO JUAREZ', 'INDEPENDENCIA Y TRUJANO', 49, '8712307303', 1, 'ANGELICA LUJAN PONCE', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0074V', 'ESC LEONA VICARIO', 'AV VISTA HERMOSA', 1007, NULL, 1, 'JESUS ANTONIO MOTA LOPEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0093I', 'FRANCISCO SARABIA', 'CLLE ZARCO 215 PTE', 120, '7141109', 1, 'MARÍA TERESA ARAGÓN GONZÁLEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0046R', 'SIMÓN BOLIVAR', 'AV. MÉXICO 91 S/N', 27, '7231189', 1, 'IRMA ANGÉLICA VILLARREAL MORENO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1752J', 'JOSE VASCONCELOS', 'CALLE SAN MARTÍN 485', 44, NULL, 1, 'DOMINGO MIJARES GAMEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, 'CT10DPR068', 'RICARDO FLORES MAGO', 'DOMICILIO CONOCIDO EL TRIUNFO', 0, '8711242745', 1, 'NANCY ROCIO CORDOVA MIRELES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0395E', 'VICENTE GUERRERO', 'CONCIDO', 652, '8714107927', 1, 'GUILLERMINA ORTIZ ESQUIVEL', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1230C', 'JOSEFA ORTIZ DE DOMINGUEZ', 'C. VITUCULTORES S/N', 16, '1915594', 1, 'SAUL MARTINEZ VAQUERA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0034F', 'RICARDO FLORES MAGO', 'CONOCIDO', 590, '8718872767', 1, 'JOSE LUIS GALINDO CAILLAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1721Q', 'DOLORES CORREA ZAPATA', 'C. HIPOLITO 418', 80, '8717818701', 1, 'MARCOS REGALADO REYES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0063P', 'SOR JUANA INÉS DE LA CRUZ', 'CALLE MICHOACÁN Y AVENIDA PONIENTE S/N', 703, NULL, 1, 'ARANDA SANDOVL', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR111P', 'JOSÉ MARÍA MORELOS', 'AVENIDA MORELOS Y CALLE LAGUNA S/N', 1029, NULL, 1, 'LETICIA SILVA VENEGAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1111P', 'JOSÉ MARÍA MORELOS', 'AV. MORELOS Y CALLE LAGUNA S/N', 1029, NULL, 1, 'LETICIA SILVA VENEGAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0027K', 'FRANCISCO VILLA', 'GARCÍA CORONA Y CHAPALA S/N', 69, NULL, 1, 'FRANCISCO REYES RODRÍGUEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0972O', 'RICARDO FLORES MAGO', 'ALBERTO M. ALVARADO S/N', 28, '8711192555', 1, 'FRANCISCO ELISEO ROMERO MATA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1770Z', 'DOLORES CORREA ZAPATA', 'BLVD FCO VILLA', 80, NULL, 1, 'RODOLFO DAVILA PAULI', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0266J', 'PROFESORA MINERVA MARTÍNEZ', 'AV. PASIONARIA S/N', 87, '8711566644', 1, 'ERNESTO RAMOS SOTO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0019U', 'RAFAEL RAMIREZ CASTAÑEDA', 'JUAN JOSE ARREOLA S/N', 119, 'S/N', 1, 'FRANCISCO JOEL TORRES DIAZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0710D', 'VICENTE SUAREZ', 'EJIDO EL FENIX', 0, 'S/N', 1, 'MARIA ELENA SOTO CRUZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1649X', 'LAZARO CARDENAS DEL RIO', 'JOSE REBOLLO ACOSTA 58', 124, '8712715831', 1, 'HERIBERTO HERNANDEZ MARTINEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1736S', 'PRIM. MEXICO', 'AMARANTO S/N', 88, NULL, 1, 'JUAN AGUILERA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0265K', 'FELIPE ANGELES T.M.', 'DOMICILIO CONOCIDO COL FELIPE ANGELES', 27, '7142840', 1, 'PEDRO REZA SILVA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0678L', '18 DE MARZO', 'CONOCIDO', 510, '8711223718', 1, 'JUAN MANUEL CABALLERO DE SANTIAGO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0877K', 'ESC. PRIM. LIBERTAD Y PROGRESO', 'FILADELFIA GOMEZ PALACIO', 37, '8718972688', 1, 'JANETH LILIANA GARCIA HERRERA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0036L', 'ESC. PRIM. VENUSTIANO CARRANZA', 'ARMANDO DEL CASTILLO FRANCO GOMEZ PALACIO', 11, NULL, 1, 'LUIS GERARDO AVILLA PEREZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0026X', 'ESC. SEC. TECNICA 26', 'NUEVO REFUGIO GOMEZ PALACIO', 72, '8717144306', 1, 'MARIO M. LOZANO CADENA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0040E', 'ESC. PRIM. SOR JUANA INES DE LA CRUZ', 'PARQUE HUNDIDO GOMEZ PALACIO', 111, NULL, 1, 'ANGEL MARTINEZ RAMIREZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR15250', 'ESCUELA PRIMARIA ADELA AYALA', 'AVENIDA BRAVO Y CALLE SEPTIMA S/N', 188, '8712122865', 1, 'DIANA KARINA BADILLO MORALES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0769C', 'ESCUELA PRIMARIA MEXICO', 'DOMICILIO CONOCIDO', 576, '8711216028', 1, 'REYNA ISABEL FLORES CHAVEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0095G', 'ESCUELA PRIMARIA CLUB DE LEONES', 'CALLE IGNACIO RAMIREZ 475 PTE', 120, '8712677153', 1, 'ANETTE ESMERALDA CAMARILLO ROSAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0044U', 'ESCUELA SEC. GRAL. CENTENARIO DE LA REVOLUCION MEXICANA', 'BOULEVARD EL REFUGIO S/N', 130, '8712965239', 1, 'JESUS MIRANDA ESPINOZA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1481H', 'ESCUELA PRIMARIA FRANCISCO GOMEZ PALACIO', 'AVENIDA FILADELFIA S/N', 37, NULL, 1, 'EDGARDO GARCIA RAMIREZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0649Q', 'ESCUELA PRIMARIA GRAL. JESUS AGUSTIN CASTRO', 'CALLE LUZ G. DE CAMPILLO S/N', 32, '8713314935', 1, 'MIGUEL ANGEL HERNANDEZ SILVA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0061R', 'ESCUELA PRIMARIA NIÑOS HEROES DE CHAPULTEPEC', 'AVENIDA HIDALGO S/N', 133, '8712115519', 1, 'ALEJANDRO GOMEZ SALAZAR', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0067K', 'ESCUELA PRIMARIA PROFA. MARIANA LEON DE CHAVEZ', 'CALLE DE LA LLAVE 305 OTE', 120, '8717141431', 1, 'ADAN EMILIO CABRALES VALENZUEL', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0427F', 'ESCUELA PRIMARIA LUIS DONALDO COLOSIO MURRIETA', 'JOSEFA ORTIZ DE DOMINGUEZ S/N ESQ ADOLFO LOPEZ MATEOS', 63, NULL, 1, 'MARIA REYES FAVELA NAVA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0099D', 'ESCUELA PRIMARIA DON JOSE REBOLLO ACOSTA', 'BOULEVARD LAS TORRES S/N', 35043, NULL, 1, 'JOSE LUIS LOPEZ VILLEGAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0087Y', 'ESCUELA PRIMARIA GRAL. IGNACIO ZARAGOZA', 'AVENIDA MATAMOROS 313  OTE', 120, '8717145210', 1, 'GLORIA ESTELA SANCHEZ GALVA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1335X', 'ESCUELA PRIMARIA DR. HECTOR MAYAGOITIA DOMINGUEZ', 'CALLE DR. NICASIO CHAVEZ 39', 64, '8711050170', 1, 'RODOLFO CASTAÑEDA GONZALEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1339T', 'ESCUELA PRIMARIA GRAL. NICOLAS FERNANDEZ', 'CALLE JUAN PABLO ESTRADA S/N', 34, '7370970', 1, 'PABLO MANUEL CABELLO AGUERO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0642X', 'FORD11', 'MARTIRES Y LIC VERDAD', 0, '7156292', 1, 'JOSE DELFINO HERNANDEZ VISCARRA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1526', 'ANDRES QUINTANA ROO', 'AV LUIS QUINTERO Y C 30 FIDEL VELAZQUEZ', 0, '6886300', 1, 'RICARDO CASTILLA ANGELES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0015Z', 'JOSEFA ORTIZ DE DOMINGUEZ', 'AV. PETUNIAS YCALLE PIPILA  S/N', 0, '7147969', 1, 'JOSUE CRUZ CASTILLO COMPEAN', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1710K', 'DURANGO', 'JAPON 156', 1038, 'S/N', 1, 'LIDIA FAVELA RIVERA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1738Q', 'LIC. LUIS DONALDO COLOSIO MURRIETA', 'INDEPENDENCIA  S/N', 0, 'S /N', 1, 'MARIA LUISA HIDROGO GUTIERREZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0026E', 'HEROES ANONIMOS', 'EMILIANO ZAPATA S/N', 0, '7149977', 1, 'FELIX ALONSO SOLIS MARQUEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0186X', 'TELESECUNDARIA NUM 186', 'DOM. CONOCIDO 35140 LAS HUERTAS', 0, '87119293697', 1, 'RICARDO SIFUENTES MACHADO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0085M', 'FRANCISCO ZARCO', 'AMPLIACION SAN ANTONIO', 156, '7523506', 1, 'HEIDI JANETH BETANCOURT MARTINEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0287W', 'PROFR BRUNO MARTINEZ', 'MORELOS 260 SUR', 0, '8717145884', 1, 'JACQUELINE MARTINEZ SAUCEDO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0086Z', 'FRANCISCO GONZALEZ BOCANEGRA', 'FRACCIONAMIENTO URVIBILLAS', 0, '8711657599', 1, 'GUADALUPE DIAZ ROBLEDO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0428F', 'GENERAL EMILIANO ZAPATA', 'URREA Y CUAUHTEMOC', 10, '2100264', 1, 'ULISES RODOLFO ACOSTA SANCHEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0597A', 'CUAUHTEMOC', 'CONOCIDO 35100', 101, NULL, 1, 'JUAN ALBERTO JUAREZ SANTOYO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1482G', 'SILVESTRE REVUELTAS', 'AND SANTOS VALDEZ', 29, '8713294580', 1, 'MARIA DOLORES PUENTE ALLENDE', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0090L', 'E.P. GENERAL IGNACIO ZARAGOZA T.V.', 'MATAMOROS # 313 OTE', 1105, '2101250', 1, 'LUCIA VICUÑA GAMBOA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0069J', 'FERNANDO MONTES DE OCA', 'CALLEJÓN DEL PIRUL S/N', 97, NULL, 1, 'FERNANDO LARA MAGALLANES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0692E', 'PROF. EVA SAMANO DE LOPEZ MATEOS', 'IGNACIO ALTAMIRANO S/N', 50, '7142579', 1, 'JUANA VALENZUELA NORIEGA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0036S', 'PROF. GREGORIO TORRES QUINTERO', 'OLIVOS S/N', 25, NULL, 1, 'JOSÉ GUADALUPE PERALES GARCÍA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0452E', 'PROFA. MINERVA MARTÍNEZ', 'AV. PASIONARIA S/N', 87, '8712965243', 1, 'ADELA HERNÁNDEZ SOSA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0290J', 'GUADALUPE VICTORIA', 'ESCOBEDO 1130', 86, NULL, 1, 'JORGE ARMANDO PALACIOS HERRADA', 'U');",

            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0426G', 'JOSE MARIA MORELOS Y PAVO', 'AMATISTA Y PRIV. GEMENIS', 1027, '8717556216', 1, 'LUIS FERNANDO PEREZ MEZA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0005S', 'RICARDO FLORES MAGO', 'BLVD. MIGUEL ALEMAN KM 698', 120, '8717253500', 1, 'SANDRA GUADALUPE GOMEZ LOPEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1557G', 'ANDRÉS QUINTANA ROO', 'AV. LUIS QUINTERO Y CALLE 30', 32, '7195015', 1, 'ROBERTO FAVELA RIVERA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0045T', 'BICENTENARIO DE LA INDEPENDENCIA', 'DE LA TORMENTA S/N', 189, 'S/N', 1, 'BERTHA RAMIREZ GONZALEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0188V', 'TELESECUNDARIA NUM. 188', 'DOMICILIO CONOCIDO', 510, '8712629136', 1, 'JUAN ANTONIO GARCIA ROSALES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0293G', '18 DE MARZO', 'AV. RAYON # 101 SUR', 120, '7149839', 1, 'CYNTHIA BERENICE RODRIGUEZ ALDACO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0377O', 'FELIPE ÁNGELES  T.V.', 'AV. NACIONAL S/N', 27, NULL, 1, 'ELSA NELLY QUIÑONES CORREA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0039P', 'JOSE SANTOS VALDEZ', 'BOULEVARD SAN ALBERTO S/N  SAN ALBERTO CP 35015', 113, '8711427694', 1, 'JUAN ANTONIO ROCHA DUQUE', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0453E', 'IGNACIO MANUEL ALTAMIRANO', 'AV. VICTORIA S/N', 83, NULL, 1, 'SALVADOR ENRIQUE AZPILCUETA MARTÍNEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR00640', 'JOSE REVUELTAS', 'CALLE MEZQUITES LOS ALAMOS CP 35020', 1038, '2101079', 1, 'JOSE ROMO FERNANDEZ OLIVAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1627L', 'INDEPENDENCIA', 'MANZANA 8   LOTE 16', 54, NULL, 1, 'MICHEL ALEJANDRO JARA CHAVARRIA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0330V', 'GENERAL LAZARO CARDENAS DEL RIO', 'CONOCIDO CP 35016 JABONOSO', 503, '', 1, 'KARINA GUADALUPE PEÑA GONZALEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1122V', 'FERROCARRILES NACIONALES', 'FCO I MADERO Y GONZALES ORTEGA CENTRO', 120, NULL, 1, 'HIGINIA JUAREZ IBARRA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0067L', 'GREGORIO GARCIA QUINTERO', 'OLIVOS S/N', 1034, 'S/N', 1, 'ANGEL DE LA O DELGADO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1490P', 'NIÑOS HEROES', 'C. VITICULTORES S/N CARLOS HERRERA  CP. 35027', 16, NULL, 1, 'ARMANDO SUSTAITA HERNANDEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1110Q', '20 DE NOVIEMBRE', 'EJIDO BUCARELI', 0, NULL, 1, 'EDER DANIEL DE LA CRUZ LOZANO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0101A', 'PROFR RAFAEL VALENZUELA', 'AV MINA1201 NTE CP.35000', 120, '8717141634', 1, 'LUIS ARMANDO GARCIA PALACIOS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0020K', 'MELQUIADES CAMPOS ESQUIVEL', 'C. MELQUIADES CAMPOS S/N', 0, '1592020', 1, 'VIOLETA DEL ALBA ROSADO MOO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1572Z', 'DR. GUSTAVO BAZ PRADA', 'ANDADOR 28 CON 39 S/N', 32, '7197241', 1, 'EDUARDO DE LA CERDA VELAZQUEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0295E', 'GUADALUPE VICTORIA', 'ESCOBEDO 1130 OTE.', 86, NULL, 1, 'FERNANDO ULLOA REYES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0257A', 'TELESECUNDARIA 257', 'DOMICILIO CONOCIDO', 554, NULL, 1, 'BENJAMÍN LÓPEZ SALAZAR', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10PPR0038V', 'COLEGIO LOURDES DE LA LAGUNA', 'SANTIAGO LAVIN ORIENTE NUM. 524', 120, NULL, 1, 'LOURDES ZURITA MORENO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0320O', 'GENERAL LÁZARO CÁRDENAS DEL RÍO', 'CONOCIDO EJIDO TRANSPORTE Y SAN RAMÓ', 522, NULL, 1, 'JENNY CELESTE DIOSDADO VÁZQUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1739P', 'LIC.LUIS DONALDO COLOSIO MURRIETA', 'INDEPENDENCIA S/N 14 DE NOVIEMBRE', 0, '8711709908', 1, 'NORMA GONZALEZ SIFUENTES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0832O', 'JESUS GARCIA', 'CONOCIDO, C.P. 35140, VIÑEDO', 0, NULL, 1, 'LINA ESTRELLA NUÑEZ MARTINEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1406A', 'ESC. PRIM. GRAL JESUS AGUSTIN CASTRO', 'C-. LUZ G DE CAMPILLO', 32, NULL, 1, 'MARIO EFREN PERALES GARCIA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0442Y', 'ESC. PRIM. SENTIMIENTOS DE LA NACIÓ', 'GLADIOLAS S/N', 38, '159-07-45', 1, 'ENITH SALOME RIVERA SANCHEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0064O', 'ESC. PRIM. JOSE REVUELTAS T.V.', 'C. MEQUITES S/N', 1038, '210-10-79', 1, 'JOSE ROMEO FERNANDEZ OLIVAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0030Y', 'ESC. PRIM. PROFESOR  MANUEL CHAIREZ MARTINEZ', 'SAN JOSE S/N', 1028, '293-76-73', 1, 'SARA CONSUELO AGUILLON CABAÑAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0355C', 'ESC.PRIM. LIBERTAD UNIVERSAL', 'SIGLO DE TORREON S/N', 1353, NULL, 1, 'CATALINA PALACIOS MAGALLANES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1650M', 'ESC. PRIMARIA GENERAL FRANCISCO VILLA', 'AV VICTORIA S/N', 9, '1-24-85-08', 1, 'JOSE CONCEPCION NUÑEZ MENDEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0624X', 'FORD 11', 'MARTIRES Y LIC VERDAD CENTRO CP 35000', 0, '715-6292', 1, 'JOSE DELFINO HERNANDEZ VIZCARRA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1346C', 'ESC. BENITO JUAREZ', 'CONOCIDO', 529, NULL, 1, 'JESUS GARCIA CENICEROS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1113', 'LA ESPERANZA', 'AV CENTRAL', 14, NULL, 1, 'NANCY ORTIZ GOMEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0682Y', 'NICOLAS BRAVO', 'CONOCIDO', 601, NULL, 1, 'KARINA DE SANTIAGO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0068K', 'JOSE SANTOS VALDEZ', 'C JOPE Y BLVD SAN ALBERTO', 113, NULL, 1, 'PATRICIA SELENE CALZADA QUIRINO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0023O', '18 DE MARZO', 'EJIDO EL VERGEL', 510, '8712876856', 1, 'NORMA ANGELICA VALDEZ RUVALCABA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1147D', 'JOSE MARIA MORELOS Y PAVO', 'LA LUZ', 528, NULL, 1, 'MA. DEL SOCORRO HERNANDEZ JAQUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1129O', 'GLORIA Z DE DUPRE CENICEROS', 'MELQUIADES CAMPOS S/N', 23, '8712743016', 1, 'SOFIA MASCORRO RAMIREZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0051K', 'PROF. ARTURO GAMIZ GARCIA', 'S/N LETICIA HERRERA', 1040, NULL, 1, 'ERIC ORTIZ CACHO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1108B', 'ANTONIO CASO', 'TRUJANO 1171 SUR', 120, '7142969', 1, 'MARCO ANTONIO MOLINA LOPEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0530T', 'LIC. MARINO CASTILLO NAJERA', 'C. CARLOS HERRERA 115', 0, NULL, 1, 'LUCERO GUADALUPE MARQUEZ ORTEGA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0051C', 'PROFRA. MA. DOLORES TORRES GONZALEZ', 'BLVD. MIGUEL ALEMAN FTE A LA TERMOELECTRICA S/N CENTRO CP. 35070', 0, '7502290', 1, 'SARA LOPEZ ESPARZA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1772X', 'ESC. PRIM. JOSE REBOLLO ACOSTA', 'AV. GRAL IGNACIO ZARAGOZA', 76, '8713 97-61-07', 1, 'KANDY CASTAÑEDA TOVAR', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0043B', 'ESC. PRIM. JUSTO SIERRA', 'C. BENJAMIN ARGUMERO NO. 317', 451, '8712 77-1025', 1, 'MARGARITA MONARREZ RODRIGUEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0393G', 'ESC. PRIM. GRAL. MARIANO MATAMOROS', 'MOISES ALVARADO RUEDA', 56, '8712 12-98-63', 1, 'MOISES ALVARADO RUEDA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0849O', 'PRIM JOSE RAMON VALDEZ', 'AV MATAMOROS', 902, '8717250242', 1, 'EVERARDO HENANDEZ GOMEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0002U', 'MA. DOLORES CAMPILLO RINCO', 'BLVR. MIGUEL ALEMAN S/N FRENTE A TERMOELECTRICA', 23, '8717501835', 1, 'LUCIANO CHAVARRIA DOMINGUEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1483F', 'JOSEFA ORTIZ DE DOMIGUEZ', 'NICASIO CHAVEZ 39', 64, '8712576162', 1, 'ALBERTO GOITIA DIAZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0698Z', '20 DE AGOSTO', 'DOMICILIO CONOCIDO', 553, '8711135107', 1, 'ADRIANA CECILIA LÓPEZ GARCÍA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0876L', 'JOSEFA ORTIZ DE DOMINGUEZ', 'DOMICILIO CONOCIDON CP 35111 EUREKA', 1841, '8713462867', 1, 'JESUS ZUÑIGA HERNANDEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1099K', 'SEIS DE OCTUBRE', 'CONOCIDO C.P. 35101, SEIS DE OCTUBRE', 1018, '8718870070', 1, 'SAMUEL DE LA CRUZ RIVAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0604S', 'TELESECUNDARIA NUM. 604', 'CONOCIDO, BRITTINGHAM', 546, NULL, 1, 'MARINA GUADALUPE VEGA MENDIETA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1076Z', 'VICENTE GUERRERO', 'SANTA CRUZ LUJAN DGO', 565, NULL, 1, 'ARTURO RODRIGUEZ SALAZAR', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0255C', 'TELESECUNDARIA NUM. 255', 'CONOCIDO, LA LUZ', 528, NULL, 1, 'DIEGO RAMOS AGUILAR', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0684W', 'EMILIANO ZAPATA', 'SAN ALBERTO', 666, NULL, 1, 'RUBEN OLVERA SANTOS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0073H', 'MELCHOR OCAMPO', 'EJIDO CALIFORNIA', 571, NULL, 1, 'MARIO FERNANDEZ CHAVEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1118I', '7 DE JUNIO DE 1936', 'CONOCIDO C.P. 35105', 546, NULL, 1, 'CECILIA HERNANDEZ RESENDIZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0926C', 'BENITO JUAREZ', 'CONOCIDO C.P 35103', 508, '8712808601', 1, 'VICTOR MANUEL CANCHE UITZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0770S', 'GENERAL GREGORIO A GARCIA', 'GREGORIO A GARCIA', 514, NULL, 1, 'XOCHITL GUADALUPE GARCIA RODRIGUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1141J', 'LA LIBERTAD', 'CONOCIDO C.P. 35131', 1047, NULL, 1, 'KARLA LILIANA DOMINGUEZ MORENO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0256B', 'TELESECUNDARIA NUM. 256', 'SAN ALBERTO', 555, NULL, 1, 'SAUL ORTEGA MACIAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0084', 'LAZARO CARDENAS DEL RIO', 'CONOCIDO', 500, '', 1, 'EDUARDO SOTO VELAZQUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0061C', 'GENERAL LAZARO CARDENAS DEL RIO', 'SAN FELIPE', 559, NULL, 1, 'SERGIO USBALDO BAÑUELOS LIRA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0679K', '18 DE MARZO', 'VENECIA', 654, NULL, 1, 'ELIZABETH ESPINO FABELA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0459X', 'TELESECUNDARIA #459', 'EJIDO SAN TOÑA', 618, '8714985463', 1, 'JOSE CALZADA AGUILAR', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1488A', 'FRANCISCO VILLA', 'EJIDO LUJA', 565, '8714604256', 1, 'FRANCISCOZAMORA GARCIA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0875M', 'VICENTE SUAREZ', 'CONOCIDO CP 35119  LA FLOR DURANGO', 581, '8712441166', 1, 'AMADEO ROCHA JAQUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0004L', 'J. AGUSTIN CASTRO', 'SANTA CRUZ LUJA', 682, NULL, 1, 'FRANCISCO HERNANDEZ BARRERA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0162P', 'MELCHOR OCAMPO', 'EJIDO RINCONADA', 592, '8717954213', 1, 'JOSE LUIS SALAZAR ROMERO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DES0030R', 'FRANCISCO ZARCO', 'ARTURO MARTINEZ ADAME', 423, NULL, 1, 'LILIANA AURORA MASCORRO GONZALEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0634O', '18 DE MARZO', 'VENECIA', 547, NULL, 1, 'ELIAS GARCIA ORTEGA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0772Q', 'LEONA VICARIO', 'HUITRO', 664, NULL, 1, 'CECILIO VILLA ACOSTA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0547R', 'TELESECUNDARIA NUM 547', 'EL VALLE DE EUREKA', 558, NULL, 1, 'JUAN FRANCISCO CARRILLO LOPEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1121W', 'ESC. PRIM. PRIMERO DE MAYO', 'EJIDO ARCINAS', 574, NULL, 1, 'MILAGROS CEBALLOS MARTINEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0689R', 'ESC. PRIM. 29 DE OCTUBRE', 'EJIDO EL QUEMADO', 620, '', 1, 'IMELDA GARCIA RAYGOZA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0620L', 'FRANCISCO I. MADERO', 'EIDO SAN SEBASTIN Y SANTA RITA', 554, 'S/N', 1, 'JESUS MARTINEZ GONZALEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1142I', 'ESC. PRIM. TIERRA Y LIBERTAD', 'EJIDO MANILA', 551, NULL, 1, 'BRENDA ISELA GARCIA GOMEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0055S', 'ESC. SEC. TEC. MO. 55 ISIDRO GARCIA BALDERAS', 'EJIDO PUEBLO NUEVO DINAMITA DGO', 458, NULL, 1, 'ISMAEL RAMIREZ DEL TORO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1130D', 'ESC. PRIM. GRAL JESUS GARCIA GUTIERREZ', 'EJIDO COMPETENCIA', 557, '8717 35-15-85', 1, 'ALMA KARINA REYES PEREZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1136Y', 'ESC. PRIM. NUMANCIA', 'EJIDO NUMANCIA', 603, NULL, 1, 'LUIS ALBERTO URIBE CONTRERAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0691F', 'MIGUEL HIDALGO', 'DOMICILIO CONOCIDO SANTOÑA', 618, '8714596290', 1, 'EBER ROCHA LOPEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1415I', 'PEDRO SANDOVAL', 'ARTURO MARTINEZ ADAME', 583, 'SIN NUMERO', 1, 'JESUS MANUEL AGUILAR DE LA CRUZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0908', 'EMILIANO ZAPATA', 'CONOCIDO EJIDO JIMENEZ', 669, '8712629633', 1, 'SALVADOR MARES CALDERA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1131C', 'ESC. PRIM. NARCISO MENDOZA', 'OSCAR MICHELL ARREOLA VALLES', 564, NULL, 1, 'OSCAR MICHEL ARREOLA VALLES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1132B', 'ESC. PRIM. FRANCISCO SARABIA T.M.', 'EJIDO EL COMPAS', 556, NULL, 1, 'FERNANDO VLADIMIR FAVELA HERNANDEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0172U', 'TELESECUNDARIA 172', NULL, 424, NULL, 1, 'GERARDO RIOS VALLES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0460M', 'TELESECUNDARIA NUM. 460', 'DOM . CON . LA PLATA', 0, 'S/N', 1, 'ANGEL CRISTOFER MONTELONGO RENTERIA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1134Z', 'PLAN DE AYALA', 'DOM CON. LA PLATA', 0, 'S/N', 1, 'AIDE GUADALUPE RAMIREZ ROJAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1148C', 'LAZARO CARDENAS', 'DOM CON. LAZARO CARDENAS', 0, '8717680394', 1, 'EDER ISNARDO ROSALES RODRIGUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0185Y', 'TELESECUNDARIA NUM. 185', 'DOM CON. ESTACION NOE', 0, 'S/N', 1, 'MARGARITA NEVAREZ SILVA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0681Z', 'RICARDO FLORES MAGO', 'EJIDO EL TRIUNFO', 584, NULL, 1, 'NANCY ROCIO CORDOVA MIRELES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0889P', 'EMILIANO ZAPATA', 'DOM CON. BERLIN', 0, NULL, 1, 'CARLA IVONNE GONZALEZ CARREON', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1771Y', 'ESC PRIM INDEPENDENCIA', 'MANZANA', 54, '35040', 1, 'MARCO ANTONIO MOLINA LOPEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1527M', 'FRANCISCO GOMEZ PALACIO', 'AV FILADELFIA', 37, '7375084', 1, 'NIDIA AIDE ZAMORA SOTO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1668L', 'PRIM SOLIDARIDAD', 'DE LA LLUVIA S/N', 65, NULL, 1, 'ORLANDO NEGRETE VALLES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0362L', 'TELESECUNDARIA NUM 362', 'CONOCIDO', 529, NULL, 1, 'JONATHAN SAUL RODELA PALACIOS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1558F', 'GRAL. FRANCISCO J MUJICA', 'PROLONGACION MADERO Y BLVB EJERCITO MEXIXANO', 20, '8712310068', 1, 'RUTILO SOLANO MENDOZA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1125S', 'VICENTE GUERRERO', 'DOMICILIO CONOCIDO', 652, '8712360325', 1, 'VERONICA MANUELA CARRILLO ALVARADO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1348A', 'DOÑA JOSEFA ORTIZ DE DOMINGUEZ', 'MANUEL GLZ # 280', 35040, '8711740274', 1, 'MARIA TERESA DE SANTIAGO VALENZUELA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0057E', 'GENERAL FRANCISCO VILLA', 'BLVD. DE LAS FLORES Y JULIETAS', 96, 'S/N', 1, 'CARLOS FRANCISCO LOPEZ MORENO', 'U');",

            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0443Y', 'LIC. FRANCISCO GOMEZ PALACIO', 'ANDADOR J SANTOS V', 29, '4554144', 1, 'GILBERTO MONTIEL MUÑOZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0975L', 'LAZARO CARDENAS DEL RIO', 'AV. LOPEZ MATEOS # 114', 35040, '8712100307', 1, 'YASMIN GUADALUPE IBARRA QUINTERO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0187W', 'TELESECUNDARIA #187', 'SAN JOSE DEL VIÑEDO', 594, '8717884365', 1, 'NORMA RENTEREIA ATAYDE', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0253F', 'CUAUHTEMOC', 'BLV MIGUEL ALEMA', 28, '7500319', 1, 'MARIA MAGDALENA ESPINO SORIA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0803T', 'JOSE VASCONCELOS', 'QUINTA Y SEXTA S/N', 1037, NULL, 1, 'MA. CONCEPCIÓN MARTÍNEZ ARREOLA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1746Z', 'GENERAL FRANCISCO VILLA T.V.', 'AV. GUADALUPE VICTORIA S/N', 9, '8712404199', 1, 'ADALBERTO BERNAL GONZALEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0543E', 'FRANCISCO I MADERO', 'CONOCIDO, C.P. 35103', 524, '8711269092', 1, 'YAJAIRA AGUILERA DELGADO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0688S', 'HEROES DE CHAPULTEPEC', 'CONOCIDO CP 35118', 586, 'X', 1, 'MARIA MAYELA TRUJILLO NIETO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0318Z', 'JOSEFA ORTIZ DE DOMINGUEZ', 'CONOCIDO C.P.35132', 1022, '8711238029', 1, 'MERCEDES SILVIA DIAZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1100J', 'JOSE MA MORELOS', 'DOMICILIO CONOCIDO CP 35110', 571, '8713052556', 1, 'JORGE ALBERTO RODRIGUEZ DURA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0593E', 'FRANCISCO I MADERO', 'CONOCIDO, C.P. 35103', 524, '8711269092', 1, 'YAJAIRA AGUILERA DELGADO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0319X', 'TELESECUNDARIA NUM.319', 'CONOCIDO , VENECIA , GOMEZ PALACIO', 547, '00000000', 1, 'OSVALDO MADONADO MACHADO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1114M', 'MIGUEL HIDALGO', 'CONOCIDO C.P. 35123', 568, NULL, 1, 'SAHID YAZIN ACOSTA LOMAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0872P', '19 DE OCTUBRE', NULL, 409, NULL, 1, 'ILSE SANCHEZ ANDRADE', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0687T', 'ESC. PRIM. 28 DE OCTUBRE T.M.', 'EJIDO SAN FELIPE', 559, NULL, 1, 'AMPARO GUADALUPE DELGADO VILLA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0680Z', 'ESC. PRIM. RICARDO FLORES MAGO', 'EJIDO VALLE DE EUREKA', 558, '872 13 08 907', 1, 'JESUS EMILIO GUERRA GARCIA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0324I', 'TELESECUNDARIA NUM. 324', 'DOMICILIO CONOCIDO S/N', 551, 'S/N', 1, 'HECTOR ORTIZ ARELLANO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1414J', 'ESC. PRIM. 10 DE ABRIL', 'EJIDO EL CONSUELO', 567, NULL, 1, 'JORGE EDUARDO CEPEDA LOPEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1480I', 'HEROINAS MEXICANAS', 'C. PRINCIPAL S/N', 1006, '8712180890', 1, 'JOSE LUIS IBARRA QUINTERO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1240J', 'VICENTE GUERRERO', 'DOMICILIO CONOCIDO', 1033, 'S/N', 1, 'LUIS BENJAMIN ORTIZ MARTINEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0252F', 'TELESECUNDARIA NUM. 252', 'DOM CON EUREKA', 0, 'S/N', 1, 'MARTIN MUÑOZ GALVAN', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1407Z', 'AGUSTINA SANCHEZ VIELMA', 'DOM CON. SAN FELIPE', 0, '8711764641', 1, 'ANA LILIA GARCIA ORTEGA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0683X', 'GUADALUPR VICTORIA', 'EJIDO SAN IGNACIO', 566, '7196930', 1, 'WILLIAM BUENDIA VIESCA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0774O', 'ALMA CAMPESINA', 'DOM CON. DIECIOCHO DE MARZO', 0, '8713593216', 1, 'ROCELIA CAMPA DE LA CERDA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0079Q', 'PRIMARIA JESUS AGUSTIN CASTRO', 'CONOCIDO', 518, 'S/N', 1, 'DAVID IVAN CONTRERAS BALTIERREZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0677M', 'PRIMERO DE MAYO', 'DOM CON VICENTE NAVA', 0, 'S/N', 1, 'ANA KAREN HERNANDEZ GOMEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DJN0093T', 'BRUNO MARTINEZ', 'AV. INDEPENDENCIA', 16, '8717374030', 1, 'JOSEFINA SANCHEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EJN0034C', 'GUADALUPE VICTORIA', 'PATONI 1135', 86, NULL, 1, 'GUADAULPE LUNA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1138W', 'ESC. PRIM. REDENCIO', 'EJIDO NOE', 1877, '0', 1, 'NAYELI SARAY LOZANO RAMIREZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1112O', 'ESC. PRIM. GUADALUPE VICTORIA', 'EJIDO ABISINIA', 6124, NULL, 1, 'LINDA ESTRELLA ARMENDARIZ BOCANEGRA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1120X', 'ESC. PRIMARIA PROF. RAFAEL RAMIREZ', 'DOMICILIO CONOCIDO', 37, NULL, 0, 'PROFRA. MARISSA EDITH BADILLO BARRAZA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0194F', 'TELESECUNDARIA NUM. 194', 'LA LUZ DE ARAIZA, LERDO,  DURANGO', 0, NULL, 0, 'ABDON CORRAL BLANCO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR007V', 'LEONA VICARIO', 'AVENIDA VISTA HERMOSA S/N', 6123, NULL, 1, 'PROF. JESUS ANTONIO MOTA LOPEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0641Y', 'ESC.PRIM.FUTURO', 'DOMICILIO CONOCIDO', 1803, NULL, 0, 'MARIA GUADALUPE ANDRADE SALAZAR', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0387V', 'PROFA. EULALIA DE LA HOYA ENRIQUEZ', 'PROL. 20 DE NOVOEMBRE S/N', 1105, NULL, 1, 'MARIA LGA HERNANDEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1146E', 'ESCUELA PRIMARIA 6 DE NOVIEMBRE', 'DOMICILIO CONOCIDO', 1830, NULL, 1, 'KARLA ARACELI ZAMORA RODRIGUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0149U', 'TELESECUNDARIA NUM. 149', 'DOMICILIO CONOCIDO', 1830, NULL, 1, 'MARIA MAGALY AYALA FAVELA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1116K', 'PRIMARIA REDENCIO', NULL, 0, NULL, 1, 'PAMELA ELIZABETH GONZALEZ BARRAZA', NULL);",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0413B', 'TELESECUNDARIA NO. 413', 'DOM. CON. HUITRO', 1846, NULL, 1, 'RAUL GAYTAN GONZALEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1597H', 'REVOLUCION SOCIAL', 'EL RECUERDO GOMEZ PALACIO', 1832, NULL, 1, 'CLAUDIA CISNEROS DIAZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DBA0003Y', 'CEDEX H. AGUSTIN REED FDZ', 'ESCOBEDO S/N', 1092, NULL, 1, 'MARIA ANTONIETA ORTEGA GONZALEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0714Z', 'AMERICA', 'DOMICILIO CONOCIDO', 1856, NULL, 0, 'MARIA GUADALUPE CORTES VARGAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '05DES0040M', 'SEC. GRAL LAZARO CARDENAS DEL RIO', 'PORVENIR COAH', 1, NULL, 1, 'PROFR. ALFREDO ARROYO ROSALES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '05DPR0221C', 'ESC.PRIM. FRANCISCO I. MADERO', 'DOMICILIO CONOCIDO', 1, NULL, 1, 'MTRA. SANJUANA YAHAIRA ARAZCÓN RAMIREZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0461L', 'TELESECUNDARIA NUM. 461', 'DOMICILIO CONOCIDO', 1885, NULL, 1, 'LUIS SANTIAGO RAMIREZ AGUILAR', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0685V', 'ESC. FRANCISCO GONZALEZ BOCANEGRA', 'RINCON DE STA. CRUZ', 1888, NULL, 1, 'JOEL RAMIREZ ONTIVEROS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0400Z', 'BENITO JUAREZ', 'EJIDO SAN ROQUE', 0, NULL, 1, 'OLGA MELISSA LUNA GODINES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0596B', 'PRIMARIA 10 DE MAYO', 'AV GUADALUPE VICTORIA S/N', 529, '8714747204', 1, 'FLOR SALGADO CHACON', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0595C', 'PRIM 13 DE ABRIL', 'CONOCIDO', 594, NULL, 1, 'PASCUAL RAMIREZ GARCIA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0307T', 'CONSTITUCION 1917', 'ESCOBEDO', 86, NULL, 1, 'BLANCA ELENA MONTES CASTAÑEDA', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DST0049H', 'SEC EMILIANO ZAPATA', 'CONOCIDO EJ SAN RAMON', 535, NULL, 1, 'EVA PATRICIA SAENZ LEYVA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1481', 'FRANCISCO GOMEZ PALACIO', 'AV. FILADELFIA S/N', 37, 'S/N', 1, 'EDGARDO GARCIA RAMIREZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EES0050D', 'PROF. JUAN MELENDEZ MEDINA', 'CLEMENTE FLORES S/N', 159, '7469123', 1, 'GABRIEL GARDEA MONTEJANO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1489Z', 'ESC. PRIM. 14 DE NOVIEMBRE T.V.', 'EJIDO LA ESMERALDA', 590, NULL, 0, 'PASCUAL ZARATE GONZALEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0539K', 'ESC. PRIM. 14 DE NOVIEMBRE T.M.', 'EJIDO LA ESMERALDA', 590, NULL, 0, 'BEATRIZ PLACIDA ARIAS PIMENTEL', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1078Y', 'ESC. PRIM. 13 DE MARZO', 'EJIDO COL. AGRICOLA LA POPULAR', 532, NULL, 1, 'BRENDA IVETT TORRES SILVA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0314B', 'TELESECUNDARIA NUM. 314', 'DOMICILIO CONOCIDO S/N', 572, 'S/N', 1, 'JUAN GUAJARDO MONTES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1143H', 'ESC. PRIM. TENOCHTITLA', 'EJIDO MADRID', 517, NULL, 1, 'JESUS ALEJANDRO EDUARDO ORTIZ FLORES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1145F', 'ESC. PRIM. BENITO JUAREZ', 'EJIDO PASTOR ROUIX', 608, '8712 32 14-90', 1, 'MARIA DEL ROSARIO MEJIA NIETO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0548Q', 'TELESECUNDARIA NO. 548', 'EJIDO ARCINAS', 574, NULL, 1, 'SAUL CISNEROS CAMPOS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1139V', 'ESC. PRIM. MIGUEL HIDALGO', 'EJIDO LAS MASITAS', 1039, NULL, 1, 'ISIS YAZMIN MARAÑA MEJIA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1135Z', 'ESC. PRIM. MIGUEL HIDALGO', 'EJIDO PASTOR ROUAIX', 608, NULL, 1, 'GANDHI LEOBARDO HURTADO MONTOYA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0253E', 'TELESECUNDARIA NO. 253', 'EJIDO LAS LAGARTIJAS', 1364, NULL, 1, 'JOSE IGNACIO MARTINEZ NAME', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0686U', 'ESC. PRIM. MIGUEL HIDALGO', 'EJIDO EL REFUGIO', 552, NULL, 1, 'ROMAN MORENO CHAVEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0873', 'RICARDO FLORES MAGO', 'CONOCIDO', 541, NULL, 1, 'FERNADA CRUZ CAÑA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0873O', 'RICARDO FLORES MAGO', 'CONOCIDO', 541, NULL, 1, 'FERNANDA CRUZ CAÑA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1140K', '15 DE NOVIEMBRE', 'CONOCIDO', 437, NULL, 1, 'MISAEL CARRILLO SARABIA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0251G', 'TELESECUNDARIA NUM. 251', 'BUENDIA , GOMEZ PALACIO, DGO', 1813, NULL, 1, 'ROBERTO ESTRADA MACIAS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1046F', 'MÁRTIRES DE CHICAGO', 'DOMICILIO CONOCIDO EJ EL CARIÑO', 523, NULL, 1, 'KARINA BRAULIA LUEVANOS HERNÁNDEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0690G', 'CINCO DE FEBRERO', 'DOMICILIO CONOCIDO', 536, '8721008733', 1, 'JOSÉ SALOME GONZÁLEZ PACHECO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0773P', 'JOSE MA. MORELOS Y PAVON', 'DOM CON. CHIHUAHUITA', 0, 'S/N', 1, 'CELSO LUNA PADILLA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1115L', '17 DE OCTUBRE', 'DOMICILIO CONOCIDO', 545, '8721024669', 1, 'LAURA BEATRIZ ESPINO VERDI', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1232A', 'ESCUELA PRIMARIA LAZARO CARDENAS', 'CONOCIDO', 1355, 'S/N', 1, 'JOSE RIOS SANCHEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0776M', 'ESCUELA PRIMARIA LEONA VICARIO', 'CONOCIDO', 582, 'S/N', 1, 'MARIA ESTHER SOTO MORALES', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10EPR0292H', 'RAFAEL VALENZUELA', 'MINA', 120, '8717374782', 1, 'EPITACIO ORTIZ CASTREJO', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1605Z', 'GUSTAVO BAZ PRADA', 'AND 29 CON AND 38', 32, '8714552370', 1, 'SANTIAGO BARRON HERNANDEZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0361M', 'TELESECUNDARIA #361', 'EJIDO JABONOSO', 503, NULL, 1, 'GUILLERMO RENTERIA VARGAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR08730', 'RICARDO FLORES MAGO', 'EJIDO DOLORES', 541, NULL, 1, 'MARIA FERNANDA CRUZ CAÑAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10ESN0003A', 'ESCUELA SECUNDARIA VESPERTINA GUADALUPE VICTORIA', 'AV PASIONARIO STA ROSALIA', 87, NULL, 1, 'SANDRA LUZ VALENZUELA DIAZ', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1377W', 'JUAN ESCUTIA', 'JOSE MIGUEL CATRO CARRILLO # 300', 11, NULL, 1, 'YOLANDA CAMACHO CENICEROS', 'U');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0549P', 'TELESECUNDARIA NUM 549', 'CONOCIDO CP 35141', 564, '0000', 1, 'SARA HERNANDEZ ALVARADO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0771R', '17 DE JUNIO', 'CONOCIDO 35110', 544, '8721093637', 1, 'MARIA DE LA LUZ HURTANDO ANCHONDO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1133A', 'CONQUISTA PROLETARIA', 'DOMICILIO CONOCIDO', 438, '8713484546', 1, 'JOSE DAVID MARTINEZ ROBLES', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DML0007F', 'CENTRO DE ATENCION MULTIPLE C.R.E.E', 'COL NUEVA LOS ALAMOS', 91, NULL, 1, 'MARIA DEL SOCORRO ARANDA RUIZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0745T', 'FRANSISCO SARABIA', NULL, 0, NULL, 1, 'JOSE NATIVIDAD PEÑA MORENO', NULL);",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1314K', 'MIGUEL HIDALGO', 'AQUILES SERDA', 515, 'S/N', 1, 'ADAN OJEDA CAMACHO', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1117J', 'EL CONQUISTADOR DEL CIELO', 'DOMICILIO CONOCIDO', 504, '8711996878', 1, 'JOSE MARCOS MOTA CHAVEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0874', 'JOSE MA MORELOS Y P', 'CONOCIDO CP 35102', 562, '8712022123', 1, 'RICARDO RIOS VEGA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0775', 'ESC. PRM. MIGUEL HIDALGO', 'EJIDO GLORIETA', 521, '8711 05-26-41', 1, 'JUANA IMELDA VARGAS RAMIREZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0254D', 'TELESECUNDARIA NUM. 254', 'CONOCIDO EJIDO JOSE MA. MORELOS', 562, '00000', 1, 'JOSE ANGEL MORALES AGUIRRE', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR1144G', 'AGUSTIN MELGAR', 'DOMICILIO CONOCIDO', 569, NULL, 1, 'JUAN MANUEL ROMAN VAZQUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0354E', 'NIÑOS HEROES DE CHAPULTEPEC', 'DOMICILIO CONOCIDO', 1851, NULL, 1, 'MARISOL SALAZAR MIRANDA', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0399A', 'LAZARO CARDENAS', NULL, 0, NULL, 1, 'ROBERTO CARLOS LOPEZ MARINEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0871Q', 'JESUS GARCIA CORONA', 'EJIDO DINAMITA', 1821, NULL, 1, 'ROBERRO ALEJANDRO CARRILLO CONTRERAS', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0298O', 'GENERAL EMILIANO ZAPATA', NULL, 0, NULL, 1, 'MARIO VIESCA CARREO', NULL);",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DPR0426H', 'E.P. EMILIANO ZAPATA T.V.', 'EJIDO JIMENEZ', 0, NULL, 1, 'LAURA PATRICIA BRISEÑO FRAUSTO', NULL);",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DJN0471D', 'JUAN DE LA BARRERA', 'JABONOSO MPIO. GOMEZ PALACIO', 1849, NULL, 1, 'LOURDES ARGENTINA ARIAS RODRIGUEZ', 'R');",
            "INSERT INTO schools (level_id, code, school, street, community_id, phone, loc_for, director, zone) VALUES (1, '10DTV0157W', 'TELESECUNDARIA 157', NULL, 0, NULL, 1, 'MA NORMA RENTERIA ATAYO', NULL);"
         ];
         console.log(convertSqlToSeeder(sqlStatements));
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [school]);

   return (
      <>
         {/* <Alert severity="success" sx={{ mb: 1 }} >
            <AlertTitle>Titulo</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         {/* <MainCard > */}
         <Typography variant="h1" color={"#1E2126"} mb={2} textAlign={"center"}>
            {pluralName.toUpperCase()}
         </Typography>
         <SchoolDT />
         {/* </MainCard> */}

         <LevelContextProvider>
            <SchoolForm />
         </LevelContextProvider>
      </>
   );
};

// export const loaderIndexSchoolsView = async () => {
//    try {
//       const res = CorrectRes;
//       const axiosLevels = await Axios.get("/levels/selectIndex");
//       res.result.levels = axiosLevels.data.data.result;
//       res.result.levels.unshift({ id: 0, label: "Selecciona una opción..." });
//       // // console.log(res);

//       return res;
//    } catch (error) {
//       const res = ErrorRes;
//       console.log(error);
//       res.message = error;
//       res.alert_text = error;
//       sAlert.Error(error);
//       return res;
//    }
// };

export default SchoolsView;
