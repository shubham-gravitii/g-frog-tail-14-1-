// @ts-nocheck
'use client'
import React, { useEffect, useState } from "react";
import Footer from '../../components/Home/Footer'
import { useAuth } from "../../contexts/UserContext";
import ReactLoading from 'react-loading';
import { Container } from "reactstrap";
import OwnerViewOwnPost from "../../components/ViewOwnPost/Owner/OwnerViewOwnPost";
import CustomerViewOwnPost from "../../components/ViewOwnPost/Customer/CustomerViewOwnPost";


const ViewOwnPost = () => {
    const { currentUser, loading } = useAuth()
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
            <Container style={{ minHeight: "100vh" }} fluid={true}>
                <meta httpEquiv="cache-control" content="no-cache" />
                <meta httpEquiv="expires" content="0" />
                <meta httpEquiv="pragma" content="no-cache" />

                {currentUser ?
                    <>
                        {currentUser.userRole === "Owner" && <OwnerViewOwnPost />}
                        {currentUser.userRole === "Customer" && <CustomerViewOwnPost />}
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

export default ViewOwnPost;