import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Success = (msg, timer = 1500) => {
   withReactContent(Swal).fire({
      icon: "success",
      html: `<h3>${msg}</h3>`,
      showConfirmButton: timer == null ? true : false,
      timer
   });
};

const Error = (msg) => {
   withReactContent(Swal).fire({
      icon: "error",
      title: `Error!`,
      html: `${msg}`,
      confirmButtonColor: "#3e3e3e"
   });
};

const Info = (msg) => {
   withReactContent(Swal).fire({
      icon: "info",
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: "#3e3e3e"
   });
};

const Warning = (msg) => {
   withReactContent(Swal).fire({
      icon: "warning",
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: "#3e3e3e"
   });
};
const Question = (msg, confirmText, cancelText) => {
   let res = null;
   withReactContent(Swal)
      .fire({
         icon: "question",
         html: `<h3>${msg}</h3>`,
         confirmButtonText: confirmText || "Si, eliminar!",
         confirmButtonColor: "green",
         showCancelButton: true,
         cancelButtonText: cancelText || "No, cancelar!",
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
      confirmButtonColor: "#3e3e3e",
      showConfirmButton,
      timer
   });
};

export const QuestionAlertConfig = (msg, confirmText, cancelText, showCancelButton = true) => {
   return {
      icon: "question",
      html: `<h3>${msg}</h3>`,
      confirmButtonText: `<b>${confirmText}<b/>` || "<b>Si, eliminar!<b/>",
      confirmButtonColor: "green",
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
