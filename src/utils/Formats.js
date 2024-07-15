import moment from "moment";
import Toast from "./Toast";

moment.locale("es");

//#region /** FECHAS - FORMATEADO */
function validateRangeDates(action, input_initial_date, input_final_date) {
   let current_date = new Date();
   yesterday = new Date(current_date.setDate(current_date.getDate() - 1));
   yesterday = new Date(yesterday.setHours(23, 59, 59));
   yesterday = yesterday.getTime();

   date1 = new Date(input_initial_date.val());
   date1 = new Date(date1.setDate(date1.getDate() + 1));
   date1 = new Date(date1.setHours(0, 0, 0));
   data_date1 = new Date(date1).getTime();

   date2 = new Date(input_final_date.val());
   date2 = new Date(date2.setDate(date2.getDate() + 1));
   date2 = new Date(date2.setHours(11, 59, 59));
   data_date2 = new Date(date2).getTime();

   if (action == "create") {
      if (data_date1 <= yesterday) {
         showToast("warning", "No puedes publicar con fecha anterior a hoy.");
         input_initial_date.focus();
         return false;
      }
   }
   if (data_date1 > data_date2) {
      showToast("warning", "Rango de fechas inválido.");
      input_final_date.focus();
      return false;
   }
   return true;
}

function binaryDateTimeFormat(the_date) {
   let date = new Date(parseInt(the_date.substr(6)));
   let datetime = moment(date).format("MM-DD-YYYY h:mm:ss a");
   // let datetime = new Intl.DateTimeFormat("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric', hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(date);

   return datetime;
}

export function formatDatetime(the_date, long_format = true, format = null) {
   if (the_date == null) return "Sin Fecha";
   moment.locale("es");
   let date = new Date(the_date);
   let datetime;

   if (the_date.length <= 10) {
      date = new Date(date.setDate(date.getDate() + 1));
      return (datetime = moment(date).format("DD-MM-YYYY"));
      // return datetime = new Intl.DateTimeFormat("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric'}).format(date);
   }

   date = new Date(the_date);
   const formato = !format ? (long_format ? "DD-MM-YYYY h:mm:ss a" : "DD-MM-YYYY") : format;
   return (datetime = moment(date).format(formato));
   // return datetime = new Intl.DateTimeFormat("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric', hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(date);
}

export function formatDatetimeToSQL(the_date) {
   let datetime = moment(the_date).format("YYYY-MM-DDTh:mm:ss");
   return datetime;
}
//#endregion /** FECHAS - FORMATEADO */

export function formatCurrency(amount, MX = true, show_currency = true) {
   let divisa = "MXN";
   let total = new Intl.NumberFormat("es-MX").format(amount);
   if (!MX) {
      divisa = "USD";
      total = new Intl.NumberFormat("en-US").format(amount);
   }

   if (!total.includes(".")) total += ".00";
   let decimales = total.split(".").reverse();
   if (decimales[0].length == 1) total += "0";
   if (amount == 0) total == "0.00";
   show_currency ? (total = `$${total} ${divisa}`) : (total = `$${total}`);

   return total;
}
export function formatearCantidadDeRenglones(tds) {
   $.each(tds, function (i, elemento) {
      let td = $(elemento);
      let cantidad = td.text();
      let cantidad_formateada = formatCurrency(cantidad);
      td.html(`${cantidad_formateada}`);
   });
}

export function formatPhone(phone) {
   if (!phone) return "Sin numero";
   return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 8)}${phone.slice(-2)}`;
}

export function formatToLowerCase(event) {
   const newText = event.target.value.toLowerCase();
   return newText;
}
export function formatToUpperCase(event) {
   const newText = event.target.value.toUpperCase();
   return newText;
}

export const handleInputFormik = async (e, setFieldValue, input, toUpper = true) => {
   try {
      const newText = toUpper ? await formatToUpperCase(e) : await formatToLowerCase(e);
      setFieldValue(input, newText);
   } catch (error) {
      console.log(error);
      Toast.Error(error);
   }
};
export const handleInputStringCase = async (e, setState, toUpper = true) => {
   try {
      const newText = toUpper ? await formatToUpperCase(e) : await formatToLowerCase(e);
      setState(newText);
   } catch (error) {
      console.log(error);
      Toast.Error(error);
   }
};

export const splitArroba = (string, returnFirst = true) => {
   try {
      const array = string.split("@");
      const value = returnFirst ? array[0] : array.reverse()[0];
      return value;
   } catch (error) {
      console.log(error);
      Toast.Error(error);
   }
};

/**
 * const groupedData = groupBy(data, "category");
 *
 * @param {array} data - la data
 * @param {string} key - nombre de la propiedad para filtrar
 * @param {boolean} returnArray - retornar el valor como array o como objeto
 * @param {boolean} consoleLogResult - por si quieres ver el resultaod en consola
 * @returns La data filtrada
 */
export const groupBy = (data, key, returnArray, consoleLogResult = false) => {
   let result = data.reduce((result, currentValue) => {
      const keys = key.includes(".") && key.split(".");

      // Extraer el valor clave
      const keyValue = keys ? currentValue[keys[0]][keys[1]] : currentValue[key];

      // Si el valor clave no existe en el objeto de resultado, cree datos para él
      if (!result[keyValue]) {
         result[keyValue] = [];
      }

      // Agregue el valor actual a los datos correspondientes.
      result[keyValue].push(currentValue);

      return result;
   }, {});
   if (returnArray) result = Object.entries(result);

   if (consoleLogResult) console.log(`🚀 ~ groupBy ~ result ${returnArray ? "array" : "object"}:`, result);
   return result;
};

/**
 *
 * @param {array<objecT>} data - para arreglos de objetos [{}]
 * @param {string} key - nombre de la propiedad por la cual se desea filtrar
 * @returns {array}
 */
export const unifyBy = (data, key) => {
   return Array.from(new Map(data.map((item) => [item[key], item])).values());
};

export const cutLines = (text) => {
   const lines = text.split(/\r\n|\n/);
   return lines;
};

const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
/**
 * Transformará la cantidad de un número y la retornará en texto, por el momento limitada hasta el 99,999.99
 * @param {number} number
 */
export const numberToText = (number) => {
   try {
      return convertirNumeroATexto(number);

      function convertirNumeroATexto(numero) {
         let [enteros, decimales] = numero.toString().split(".");

         let textoEnteros = convertirParteEntera(enteros);
         let textoDecimales = convertirParteDecimal(decimales);

         let resultado = `son ${textoEnteros} peso${parseInt(enteros) !== 1 ? "s" : ""}`;
         if (textoDecimales) {
            resultado += ` con ${textoDecimales} centavo${parseInt(decimales) !== 1 ? "s" : ""}`;
         }

         return resultado;
      }

      function convertirParteEntera(numero) {
         if (numero === "0") return "cero";

         let partes = [];
         let num = parseInt(numero, 10);
         // console.log("🚀 ~ convertirParteEntera ~ num:", num);

         if (num >= 10000 && num < 20000) {
            partes.push(`${especiales[parseInt(num.toString().slice(0, 2)) - 10]} mil`);
            num = num % 1000;
         } else if (num >= 20000 && num <= 100000) {
            const miles = Math.floor(num / 1000);
            if (miles >= 30) partes.push(`${decenas[Math.floor(parseInt(num.toString().slice(0, 2)) / 10)]}`);
            num = num % 10000;

            if (miles === 20) {
               partes.push("veinte mil");
               num = num % 1000;
            } else if (miles === 21) {
               partes.push("veintiún mil");
               num = num % 1000;
            } else if (miles >= 22 && miles < 30) {
               partes.push(`veinti${unidades[Math.floor(num / 1000)]} mil`);
               num = num % 1000;
            } else {
               if (miles % 10 > 0) partes.push("y");
               if (miles % 10 === 1) partes.push("un mil");
               else partes.push(`${unidades[Math.floor(num / 1000)]} mil`);
               num = num % 1000;
            }
         } else if (num >= 1000) {
            partes.push(`${unidades[Math.floor(num / 1000)]} mil`);
            num = num % 1000;
         }

         if (num >= 100) {
            if (num >= 101 && num < 200) {
               partes.push("ciento");
            } else {
               partes.push(centenas[Math.floor(num / 100)]);
            }
            num = num % 100;
         }

         if (num >= 10 && num < 20) {
            partes.push(especiales[num - 10]);
         } else {
            const dec = Math.floor(num / 10);
            if (dec >= 3) partes.push(decenas[Math.floor(num / 10)]);
            if (dec === 2) {
               const uni = num % 10;
               num = num % 10;

               if (uni === 0) partes.push("veinte");
               else if (uni === 1) partes.push("veintiún");
               else partes.push(`veinti${unidades[num]}`);
            } else {
               num = num % 10;
               if (dec >= 3 && num > 0) partes.push("y");
               if (includesInArray(partes, ["cien", "ciento", "mil"]) && num === 1) partes.push("un");
               else partes.push(unidades[num]);
            }
         }

         return partes
            .filter((p) => p !== "")
            .join(" ")
            .trim();
      }

      function convertirParteDecimal(numero) {
         if (!numero) return "";

         if (numero.length === 1) {
            numero += "0";
         }

         return convertirParteEntera(numero);
      }
   } catch (error) {
      console.log("🚀 ~ includesInArray ~ error:", error);
      Toast.Error(error);
   }
};

/**
 * Esta función nos ayuda a saber si almenos un valor de un array se encuentra en otro array o todos los valores, segun se indique en allValues
 * @param {[*]} array1 - Array que se desea inspeccionar
 * @param {[*]} array2 - Array de valores a buscar
 * @param {boolean} allValues - Indicar si deseas que coinsidan todos los valores del array2 (true) o almenos uno (false)
 * @returns {boolean}
 */
export const includesInArray = (array1, array2, allValues = false) => {
   try {
      if (allValues) return array2.every((element) => array1.includes(element));
      else return array2.map((element) => array1.includes(element));
   } catch (error) {
      console.log("🚀 ~ includesInArray ~ error:", error);
      Toast.Error(error);
   }
};
