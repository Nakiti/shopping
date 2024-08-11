"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
   const [currentUser, setCurrentUser] = useState(() => {
      if (typeof window !== "undefined") {
         return JSON.parse(sessionStorage.getItem("user")) || null;
      }
      return null;
   });

   const login = async (inputs) => {
      const response = await axios.post("http://localhost:4000/user/login", inputs);
      setCurrentUser(response.data);
   };

   const logout = async () => {
      try {
         await axios.post("http://localhost:4000/user/logout");
         sessionStorage.removeItem("user")
         sessionStorage.removeItem("data")
      } catch (e) {
         console.log(e)
      }
      setCurrentUser(null);
   };

   useEffect(() => {
      if (typeof window !== "undefined") {
         sessionStorage.setItem("user", JSON.stringify(currentUser));
      }
   }, [currentUser]);

   return (
      <AuthContext.Provider value={{currentUser, login, logout}}>
         {children}
      </AuthContext.Provider>
   );
}
