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

export function formatDatetime(the_date, long_format = true) {
   if (the_date == null) return "Sin Fecha";
   let date = new Date(the_date);
   let datetime;

   if (the_date.length <= 10) {
      date = new Date(date.setDate(date.getDate() + 1));
      return (datetime = moment(date).format("DD-MM-YYYY"));
      // return datetime = new Intl.DateTimeFormat("es-MX", { day: '2-digit', month: '2-digit', year: 'numeric'}).format(date);
   }

   date = new Date(the_date);
   const formato = long_format ? "DD-MM-YYYY h:mm:ss a" : "DD-MM-YYYY";
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
   return `(${phone.slice(0, 3)})${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(-2)}`;
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
