// @ts-nocheck
"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

import { fetchUserAttributes, updateUserAttributes ,fetchAuthSession  } from 'aws-amplify/auth';
import { at } from 'lodash';
export const AuthContext = createContext({
  currentUser: null,
  logIn: () => { },
  logOut: () => { },
});

const USER = {
  username: "",
  email: "",
  userID: "",
  phoneNumber: "",
  userRole: "",
  userFullName: "",
  customerId: "",
};

export function useAuth() {
  return useContext(AuthContext);
}


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(USER);
  const [loading, setLoading] = useState(true);

  async function handleUpdateUserAttributes(
    user
  ) {
    try {
      const updatedUser = {
        email: user.owner_email_id,
        preferred_username: user.username,
        phone_number: "+91" + user.owner_phone_number,
      }
      const attributes = await updateUserAttributes({
        userAttributes: updatedUser,
      });
      console.log(attributes);
    } catch (error) {
      console.log(error);
    }
  }

  async function currentAuthenticatedUser() {

    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);
      return { username, userId, signInDetails}
    } catch (err) {
      console.log(err);
    }

  }

  async function currentSession() {
    try {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      console.log("Access Token")
      console.log(accessToken)
      console.log(idToken)
      console.log("Access Token")
    } catch (err) {
      console.log(err);
    }
  }
  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log(userAttributes)
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...userAttributes,
        userRole: userAttributes['custom:Role'],
        username: userAttributes.preferred_username,
        phoneNumber: userAttributes.phone_number,
        userID: userAttributes.sub,
      }));      
                        
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(prev => ({ ...prev, ...JSON.parse(storedUser) }));
    }
    
    async function fetchData() {
      await handleFetchUserAttributes();
      currentAuthenticatedUser();
      currentSession();
      setLoading(false);
    }
  
    fetchData();
  }, []);
  
  

  const logIn = (newUser) => {
    setCurrentUser(prev => ({ ...prev, ...newUser }));
    localStorage.setItem('user', JSON.stringify(currentUser));
  }

  const logOut = async() => {
    setCurrentUser({});
    await signOut();
    localStorage.removeItem('user');
  }



  const value = {
    currentUser,
    logOut,
    logIn,
    loading,
    handleUpdateUserAttributes,
    currentAuthenticatedUser,
    handleFetchUserAttributes
    // forgotPassword,
    // updateUser, 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}