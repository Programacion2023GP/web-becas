import Toast from "./Toast";

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
