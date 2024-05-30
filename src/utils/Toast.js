import { enqueueSnackbar } from "notistack";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Success = (msg, horizontal = "right", vertical = "bottom") =>
   enqueueSnackbar(msg, { variant: "success", autoHideDuration: 2500, anchorOrigin: { horizontal, vertical } });
const Error = (msg, horizontal = "right", vertical = "bottom") =>
   enqueueSnackbar(msg, { variant: "error", autoHideDuration: 2500, anchorOrigin: { horizontal, vertical } });
const Info = (msg, horizontal = "right", vertical = "bottom") =>
   enqueueSnackbar(msg, { variant: "info", autoHideDuration: 2500, anchorOrigin: { horizontal, vertical } });
const Warning = (msg, horizontal = "right", vertical = "bottom") =>
   enqueueSnackbar(msg, { variant: "warning", autoHideDuration: 2500, anchorOrigin: { horizontal, vertical } });
const Default = (msg, horizontal = "right", vertical = "bottom") =>
   enqueueSnackbar(msg, { variant: "default", autoHideDuration: 2500, anchorOrigin: { horizontal, vertical } });
const Customizable = (msg, icon = "default", horizontal = "right", vertical = "bottom") =>
   enqueueSnackbar(msg, { variant: icon, autoHideDuration: 2500, anchorOrigin: { horizontal, vertical } });

const Sweet = (msg, icon, position) => {
   const Toast = withReactContent(Swal).mixin({
      toast: true,
      position: position || "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
         toast.addEventListener("mouseenter", Swal.stopTimer);
         toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
   });
   Toast.fire({
      icon,
      title: msg
   });
};

export default {
   Success,
   Error,
   Info,
   Warning,
   Default,
   Customizable,
   Sweet
};
