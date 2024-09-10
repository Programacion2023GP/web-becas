import dayjs from "dayjs";
import sAlert from "./sAlert";
import Toast from "./Toast";
import { colorPrimaryDark } from "../context/GlobalContext";
import { formatDatetime } from "./Formats";

export const validateImageRequired = (valuesImg, msg = "Imagen requerida") => {
   if (
      valuesImg == null ||
      valuesImg == "null" ||
      valuesImg == "" ||
      valuesImg.name == "" ||
      valuesImg.name == null ||
      valuesImg.name == "null" ||
      valuesImg.name == "undefined" ||
      valuesImg.name == "[object Object]"
   ) {
      Toast.Error(msg, "center");
      return false;
   } else return true;
};

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/**
 *
 * @param {string} curp Valor del input correspondiente a la CURP
 * @returns
 */
export function validateCURP(curp) {
   const regex =
         /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
      validated = curp.match(regex);

   if (!validated)
      //Coincide con el formato general?
      return false;

   //Validar que coincida el dígito verificador
   const checkDigit = (curp17) => {
      //Fuente https://consultas.curp.gob.mx/CurpSP/
      let diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
         lngSuma = 0.0,
         lngDigito = 0.0;
      for (var i = 0; i < 17; i++) lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
      lngDigito = 10 - (lngSuma % 10);
      if (lngDigito == 10) return 0;
      return lngDigito;
   };

   if (validated[2] != checkDigit(validated[1])) return false;

   return true; //Validado
}

export const validatePermissionToRequestBeca = async (currentSettings) => {
   console.log("🚀 ~ validatePermissionToRequestBeca ~ currentSettings:", currentSettings);
   // VERIFICAR QUE HAYA CONFIGURACIÓN
   if (!currentSettings || currentSettings.start_date_request == null || currentSettings.closing_date_request == null) {
      sAlert.Info("Por el momento no se pueden realizar solcitudes, comuniquese con el departamento de Eduación");
      return false;
   }
   const today = dayjs();
   const start_date_request = dayjs(currentSettings.start_date_request);
   const closing_date_request = dayjs(currentSettings.closing_date_request);
   console.log(
      "🚀 ~ validatePermissionToRequestBeca ~ today.isBetween(start_date_request, closing_date_request, 'day', '[]'):",
      today.isBetween(start_date_request, closing_date_request, "day", "[]")
   );
   // VERIFICAR QUE ESTE EN FECHA DE SOLICITUDES
   if (!today.isBetween(start_date_request, closing_date_request, "day", "[]")) {
      sAlert.Info(
         `NO ES POSIBLE SOLICITAR BECAS EN ESTE MOMENTO 
         <br/>
         <br/>
         el tiempo de solicitar becas es del <span style="color:${colorPrimaryDark}; font-weight:bolder">${formatDatetime(
            start_date_request,
            null,
            "LL"
         )}</span> al <span style="color:${colorPrimaryDark}; font-weight:bolder">${formatDatetime(closing_date_request, null, "LL")}</span>`
      );
      return false;
   }
   // VERIFICAR QUE EL USUARIO NO HAYA PEDIDO BECA ANTERIORMENTE EN ESTE CICLO
   if (false) {
      sAlert.Info(`YA HAS REALIZADO LOS INTENTOS MÁXIMOS PERMITIDOS PARA SOLICITAR BECA. ESPERE AL SIGUIENTE CICLO.
         <br/>
         <br/>
         GRACIAS`);
      return false;
   }
   return true;
};
