import { createContext, useContext, useEffect, useState } from "react";
// import { Axios } from "./AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";
import axios from "axios";

const axiosMyCommunity = axios;
const CommunityContext = createContext();

const formDataInitialState = {
   id: 0,
   name: "", //community
   postalCode: "",
   type: "",
   zone: "",
   municipalities_id: "",
   perimeter_id: "",

   perimeter: "Selecciona una opción...",
   municipality: "Selecciona una opción..."
};

export default function CommunityContextProvider({ children }) {
   const singularName = "Comunidad"; //Escribirlo siempre letra Capital
   const pluralName = "Comunidades"; //Escribirlo siempre letra Capital

   const [formTitle, setFormTitle] = useState(`REGISTRAR ${singularName}`);
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");

   const [communities, setCommunities] = useState([]);
   const [community, setCommunity] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en resetFormData:", error);
      }
   };
   const resetCommunity = () => {
      try {
         setCommunity(formDataInitialState);
      } catch (error) {
         console.log("Error en resetCommunity:", error);
      }
   };

   const getCommunities = async () => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/comunidades`);
         // console.log("axiosData", axiosData);
         res.result.communities = axiosData.data.data.result;
         setCommunities(axiosData.data.data.result);
         // console.log("communities", communities);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const showCommunity = async (id) => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/comunidades/${id}`);
         console.log("axiosData", axiosData);
         res = axiosData.data.data;
         setCommunity(res.result);
         setFormData(res.result);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const createCommunity = async (community) => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.post(`${import.meta.env.VITE_API_CP}/perimetros/create`, community);
         res = axiosData.data.data;
         getCommunities();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateCommunity = async (community) => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.post(`${import.meta.env.VITE_API_CP}/perimetros/update/${community.id}`, community);
         // console.log("axiosData", axiosData);
         res = axiosData.data.data;
         getCommunities();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteCommunity = async (id) => {
      let res = CorrectRes;
      try {
         console.log("no hay por el momento");
         // const axiosData = await Axios.delete(`/communities/${id}`);
         // // console.log("deleteCommunity() axiosData", axiosData.data);
         // getCommunities();
         // res = axiosData.data.data;
         // console.log("res", res);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const assignPerimeterToCommunity = async (id, community_id) => {
      let res = CorrectRes;
      try {
         const axiosData = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/perimetros/${id}/assignToCommunity/${community_id}`);
         console.log("axiosData", axiosData);
         res = axiosData.data.data;
         setCommunity(res.result);
         setFormData(res.result);
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   // useEffect(() => {
   //    console.log("el useEffect de CommunityContext");
   //    getCommunities();
   // });

   return (
      <CommunityContext.Provider
         value={{
            communities,
            community,
            formData,
            resetFormData,
            resetCommunity,
            getCommunities,
            showCommunity,
            createCommunity,
            updateCommunity,
            deleteCommunity,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle,
            singularName,
            pluralName,
            assignPerimeterToCommunity
         }}
      >
         {children}
      </CommunityContext.Provider>
   );
}
export const useCommunityContext = () => useContext(CommunityContext);
