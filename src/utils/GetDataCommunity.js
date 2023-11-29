import axios from "axios";
import Toast from "./Toast";

export const GetDataCommunity = async (community_id) => {
   const axiosMyCommunity = axios;
   const { data } = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/cp/colonia/${community_id}`);

   if (data.data.status_code != 200) {
      Toast.Error(data.data.alert_text);
      return null;
   }
   return data.data.result;
   // formData.zip = data.data.result.CodigoPostal;
   // formData.state = data.data.result.Estado;
   // formData.city = data.data.result.Municipio;
   // formData.colony = data.data.result.Colonia;
   // // formData.colony = community_id;
   // await setFormData(formData);
   // zip = formData.zip;
};
