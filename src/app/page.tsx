// @ts-nocheck
// This is a home page (/ route)

import Head from 'next/head';
import Landing from '../components/Board/Landing';
import { useAuth } from '../contexts/UserContext';
import {Col, Container, Row } from "reactstrap"



//<ConnectionProvider endpoint={network}></ConnectionProvider>

////////

import HomePage from './home-page/index'






function Home() {
  // const { currentUser } = useAuth();  
  const currentUser=null
  return (
    <>
      <Head>
        <title>Gravitii</title>
        <meta name="description" content="Brought to you by team Gravitii" />
      </Head>
      {(currentUser && currentUser.userID) ? <div style={{ backgroundImage: `url("https://img.freepik.com/free-vector/warehouse-store-interior-logistics-cargo-goods-delivery-postal-service-storehouse-with-rolling-shatter-gates-racks-with-parcels-boxes-palettes-front-view-cartoon-vector-illustration_107791-9825.jpg?t=st=1708795550~exp=1708799150~hmac=519bd7ab9ec17c8e92f4146d22ae4bf5f78c36d455445f2ca37d12c48166dea7&w=1380")`,
                      backgroundSize: 'cover',backgroundPosition: 'center', color: '#ffffff'}} className="header__area black-bg py-3"><Landing /></div> : <HomePage />}
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