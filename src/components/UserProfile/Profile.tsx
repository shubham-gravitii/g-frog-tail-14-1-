// @ts-nocheck 
"use client"
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
//prev
import OwnerProfile1 from "./Owner/prevOwnerProfile";
import CustomerProfile1 from "./Customer/prevCustomerProfile";
//new
import OwnerProfile from "./Owner/ownerProfile";
import CustomerProfile from "./Customer/customerProfile";
import ReactLoading from 'react-loading';

const Profile = () => {
  const { currentUser, loading } = useAuth()

  useEffect(() => {

  }, [loading]);
  useEffect(() => {

  }, []);

  if (loading) {
    return <>
      <div className="column d-flex align-items-xl-center justify-content-center">
        <h3 className="m-3 p-3"> <ReactLoading type="spinningBubbles" color="#1a152e" /></h3>
      </div>
    </>

  }
  return (
    <>
      {/* <section className="categoryarea black-bg pt-80 pb-80"></section> */}

      {currentUser ?
        <>
          {/* {currentUser.userRole === "Owner" && <OwnerProfile1 />} */}
          {/* {currentUser.userRole === "Customer" && <CustomerProfile1 />} */}
          {currentUser.userRole === "Owner" && <OwnerProfile />}
          {currentUser.userRole === "Customer" && <CustomerProfile />}
        </> : <>
          <div className="column d-flex align-items-xl-center justify-content-center">
            <h3 className="m-3 p-3">Please LogIn to continue</h3>
          </div>
        </>}



    </>

  )
}

export default Profile
