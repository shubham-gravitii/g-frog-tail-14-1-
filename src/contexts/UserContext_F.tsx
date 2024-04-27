// @ts-nocheck 
import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  fetchUser,
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  getUserByUserID
} from "../firebase/firebase";
import {
  sendPasswordResetEmail,
} from "firebase/auth";
import axios from 'axios';
import * as Constants from "../utils/constants"

interface User {
  username: string;
  email: string;
  userID: string;
  phoneNumber: string;
  userRole: string;
  userFullName: string;
  customerId?: string;
}

interface AuthContextProps {
  currentUser: User | null | undefined;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updatedUser: User) => void;

}

const AuthContext = React.createContext<AuthContextProps>({
  currentUser: undefined,
  logout: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  updateUser: () => { }
});


export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>();
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setCurrentUser(null);
    localStorage.clear();
    return auth.signOut();
  }

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const checkTokenExpiration = () => {

    const timestamp = localStorage.getItem('userLogInTimestamp');
    const thirtyDaysInMilliseconds = 60 * 1000;
    console.log(timestamp)
    if (timestamp) {
      const currentTime = Date.now();
      const storedTime = parseInt(timestamp);
      console.log(storedTime)

      if (currentTime - storedTime >= thirtyDaysInMilliseconds) {
        logout();
        console.log("user logout after 1 minute")
        console.log("currentTime" + currentTime)
        // Token has expired
      }
    }

  };

  const updateUser = async (userID: string) => {
    try {
      const userData = await getUserByUserID(userID);
      setCurrentUser(userData as User);
      // Save user data to local storage
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("firebase current user " + userData);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }

  };



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // checkTokenExpiration();
      if (user) {
        
        const userId = user.uid;
       
        try {
          const localUserData = JSON.parse(localStorage.getItem('user'));
          const localLoginTimestamp = parseInt(localStorage.getItem('userLogInTimestamp'));
          if (localUserData && localLoginTimestamp) {
            const expirationTimeInMilliseconds =24 * 60 * 60 * 1000;
            const currentTime = Date.now();
            if (currentTime - localLoginTimestamp <= expirationTimeInMilliseconds) {
              setCurrentUser(localUserData);
              
              setLoading(false);
              console.log("Local storage current user: ", localUserData);
              return;
            } 
            else {
              logout();
            }
          }
        } catch (error) {
          console.log(error)
        }
       
      
        // Set loading to true while fetching user data
        setLoading(true);

  
        // User data doesn't exist in local storage or it is expired, fetch from Firestore
        try {
          const userData = await fetchUser(userId);
          setCurrentUser(userData as User);
          console.log(currentUser)
          
          const timestamp = Date.now();
          localStorage.setItem('userLogInTimestamp', timestamp.toString());
          localStorage.setItem('user', JSON.stringify(userData));
          console.log("Firebase current user: ", userData);
        } catch (error) {
          console.log("Error fetching user data:", error);
        } finally {
          // Set loading to false once the data is fetched or if there's an error
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setLoading(false); // Set loading to false for logged-out users
      }
    });
  
    return unsubscribe;
  }, []);
  
  
  const value: AuthContextProps = {
    currentUser,
    logout,
    forgotPassword,
    updateUser, 
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
