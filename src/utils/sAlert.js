import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { colorPrimaryDark, colorSecondaryDark } from "../context/GlobalContext";

const Success = (msg, timer = 1500) => {
   withReactContent(Swal).fire({
      icon: "success",
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: colorPrimaryDark, // "#3e3e3e"
      showConfirmButton: timer == null ? true : false,
      timer,
      confirmButtonText: "<b>OK</b>"
   });
};

const Error = (msg) => {
   withReactContent(Swal).fire({
      icon: "error",
      title: `Error!`,
      html: `${msg}`,
      confirmButtonColor: colorPrimaryDark, // "#3e3e3e"
      confirmButtonText: "<b>OK</b>"
   });
};

const Info = (msg) => {
   withReactContent(Swal).fire({
      icon: "info",
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: colorPrimaryDark, // "#3e3e3e"
      confirmButtonText: "<b>OK</b>"
   });
};

const Warning = (msg) => {
   withReactContent(Swal).fire({
      icon: "warning",
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: colorPrimaryDark, // "#3e3e3e"
      confirmButtonText: "<b>OK</b>"
   });
};
const Question = (msg, confirmText, cancelText) => {
   let res = null;
   withReactContent(Swal)
      .fire({
         icon: "question",
         html: `<h3>${msg}</h3>`,
         confirmButtonText: `<b>${confirmText}<b/>` || "<b>Si, eliminar!<b/>",
         confirmButtonColor: colorPrimaryDark, //"green",
         showCancelButton: true,
         cancelButtonText: `<b>${cancelText}<b/>` || "<b>No, cancelar!<b/>",
         reverseButtons: true
      })
      .then((result) => {
         return (res = result);
      });
   return res;
};

const Customizable = (msg, icon, showConfirmButton = false, timer = 1500) => {
   withReactContent(Swal).fire({
      icon,
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: colorPrimaryDark, //"#3e3e3e",
      showConfirmButton,
      timer,
      confirmButtonText: "<b>OK</b>"
   });
};

export const QuestionAlertConfig = (msg, confirmText = "Si, eliminar!", cancelText = "No, cancelar!", showCancelButton = true) => {
   return {
      icon: "question",
      html: `<h3>${msg}</h3>`,
      confirmButtonText: `<b>${confirmText}<b/>` || "<b>Si, eliminar!<b/>",
      confirmButtonColor: colorPrimaryDark, //"green",
      showCancelButton: showCancelButton,
      cancelButtonText: `<b>${cancelText}<b/>` || "<b>No, cancelar!<b/>",
      reverseButtons: true
   };
};

export default {
   Success,
   Error,
   Info,
   Warning,
   Question,
   Customizable
};
