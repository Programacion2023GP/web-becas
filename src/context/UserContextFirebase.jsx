import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

// Configuracion de FireBase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
   const [user, setUser] = useState(false);

   useEffect(() => {
      const unsuscribe = onAuthStateChanged(auth, (user) => {
         console.log("user", user);
         setUser(user);
      });
      // console.log("user", user);
      // setUser(user);
      console.log("unsuscribe", unsuscribe);

      // return user;
      return unsuscribe;
   }, [user]);

   if (user === false) return; //<p>Cargando...</p>;

   return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

export const useUserContext = () => useContext(UserContext);
