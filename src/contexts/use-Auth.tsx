'use client'
import { useContext } from "react";
import { AuthContext } from "./UserContext";
 function useAuth() {
    return useContext(AuthContext);
  }
  export default useAuth