// @ts-nocheck
'use client'
import React, { useEffect, useState } from "react";
import BgShape from '../../components/Common/BgShape';
import Header from '../../components/Home/Header';
import NewPostUser from '../../components/Forms/NewPost';
import NewPostBroker from '../../components/Forms/NewPostBroker';
import NewPostCarrier from '../../components/Forms/NewPostCarrier';
import SolClient from '../../components/Web3Client/SolClient';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { AutoConnectProvider } from '../../components/AutoConnectProvider';
import Footer from '../../components/Home/Footer'
import { useAuth } from "../../contexts/UserContext";
// import NewPostOwner from "../../components/Forms/posty/newPostOwner";
import NewPostCustomer from "../../components/Forms/posty/newPostCustomer";
import ReactLoading from 'react-loading';
import NewPostOwner from "../../components/Forms/posty/newPostOwner";
import { Container } from "reactstrap";


const NewPost = () => {
  console.log("posty")
  const { currentUser, loading } = useAuth();
  useEffect(() => {
    
  }, [loading]);

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
      <Container style={{ minHeight: "80vh" }}  fluid={false}>
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta httpEquiv="pragma" content="no-cache" />

        {currentUser ?
          <>
            {currentUser.userRole === "Owner" && <NewPostOwner />}
            {currentUser.userRole === "Customer" && <NewPostCustomer />}
          </> : <>
            <div className="column d-flex align-items-xl-center justify-content-center">
              <h3 className="m-3 p-3">Please LogIn to continue</h3>
            </div>
          </>
        }

      </Container>
      
    </>
  );

};

export default NewPost;