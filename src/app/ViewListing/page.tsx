// @ts-nocheck
'use client'
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import Footer from '../../components/Home/Footer'
import {
  Container,
} from "react-bootstrap";
import "@vtaits/react-color-picker/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import "flatpickr/dist/themes/material_blue.css";
import withAuth from "../../utils/urlAuth";
import { useAuth } from "../../contexts/UserContext";
import ReactLoading from 'react-loading';
import ViewListing from "../../components/ViewListing/index"; 

const RateExplorer = () => {
  const { currentUser, loading } = useAuth()


  useEffect(() => {

  }, [loading]);



  if(loading) {
    return <>
      <div className="column d-flex align-items-xl-center justify-content-center">
        <h3 className="m-3 p-3"> <ReactLoading type="spinningBubbles" color="#1a152e" /></h3>
      </div>
    </>
  }

  return (
    <>
      <React.Fragment>
        <div style={{ minHeight: "100vh" }} className="black-bg">
          <meta httpEquiv="cache-control" content="no-cache" />
          <meta httpEquiv="expires" content="0" />
          <meta httpEquiv="pragma" content="no-cache" />
          {currentUser ?
            <>
              <ViewListing />
            </> : <>
              <div className="column d-flex align-items-xl-center justify-content-center">
                <h3 className="m-3 p-3">Please LogIn to continue</h3>
              </div>
            </>
          }
        </div>

        
      </React.Fragment>
    </>
  );
};
export default RateExplorer;
