import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectToAuth = (user, pathRedirect) => {
   // console.log("el redirectTo");
   const navigate = useNavigate();
   useEffect(() => {
      if (user) {
         navigate(pathRedirect);
      }
   }, [user]);
};

export const useNavigateTo = (pathRedirect) => {
   // console.log("el redirectTo");
   const navigate = useNavigate();
   navigate(pathRedirect);
};
