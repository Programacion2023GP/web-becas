import Toast from "./Toast";

export const validateSetImage = (valuesImg, msg = "Imagen requerida") => {
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
      Toast.Error(msg);
      return false;
   } else return true;
};
