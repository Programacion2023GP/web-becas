import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectTo = (user, pathRedirect) => { 
   // console.log("el redirectTo");
   const navigate = useNavigate();
   useEffect(() => {
      if (user) {
         navigate(pathRedirect);
      }
   }, [user]);
 }