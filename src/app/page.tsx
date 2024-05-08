// @ts-nocheck
"use client"
// This is a home page (/ route)

import Head from 'next/head';
import Landing from '../components/Board/Landing';
import { useAuth } from '../contexts/UserContext';
import {Col, Container, Row } from "reactstrap"



//<ConnectionProvider endpoint={network}></ConnectionProvider>

////////

import HomePage from './home-page/index'




function Home() {
  const { currentUser } = useAuth();  
  // const currentUser=null
  return (
    <>
      <Head>
        <title>Gravitii</title>
        <meta name="description" content="Brought to you by team Gravitii" />
      </Head>
      {(currentUser && currentUser.userID) ? <div 
      style={{ 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://img.freepik.com/free-photo/warehouse-industrial-building-interior-with-people-forklifts-handling-goods-storage-area_342744-1498.jpg?size=626&ext=jpg&ga=GA1.1.1152159487.1713118502&semt=ais')",
        //backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1446694292248-2c2a7e575b1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhbnNwb3J0fGVufDB8fDB8fHww')",
        backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', color: '#ffffff'}} className="header__area black-bg py-3"><Landing /></div> : <HomePage />}
      <Container fluid={true} className="black-bg">
        <Row>
          <Col xs="12">
          </Col>
        </Row>
      </Container>
      {/* <Pagination count={10} /> */}
    </>
  )
}

export default Home;