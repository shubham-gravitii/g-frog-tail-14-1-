// @ts-nocheck

// ref from recordcardcarrier
// pass paramters from wh details
// name address type totalspace-frist page

import React, { useState } from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Container, Col, Row, Input, UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
//import images from "/src/assets/images"

// import InnerImageZoom from 'react-inner-image-zoom';
import "react-slideshow-image/dist/styles.css";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { Component } from "react";
// ...


const RecordCardCustomer = ({details}) => {
  //const name = data.name
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false)
  const {wh_id, wh_rental_id, wh_rental_id_created_timestamp, wh_rental_available_date,  wh_min_lease,  wh_max_lease,  wh_rental_rate, wh_rental_unit, wh_security_deposit, wh_lock_in_period, wh_rental_increment, wh_notice_period, wh_rent_free_period, is_active, is_verified,thumbnail_cid } = details;
  // const [modalData, setModalData] = useState({ name: ID, capacity: NAME, rate: ADDRESS, edit: false })

  const togglemodal = () => {
    setModal(!modal);
  };
  console.log("RecordCardCustomer: " + details)


  const fadeImages = [
    "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  return (

    <>

      <React.Fragment>
        <Col xl="6" sm="5">
          <Card>
            <CardBody>
              <Row>
                <Col>
                
                  <div className="column front-image">


                    <div>

                      {/* Record #{data.carrier_id
                    } */}
                                        <div className="warehousethumbnail"> <img src={fadeImages[0]} /></div>

                      <h6 className="text-truncate mb-4 mb-lg">Warehouse ID: {wh_id}</h6>
                      <h6 className="text-truncate mb-4 mb-lg">Warehouse Rental ID: {wh_rental_id}</h6>
                      <h6 className="text-truncate mb-4 mb-lg"
                      >Warehouse Available Date:{wh_rental_available_date} </h6>



                      <h6 className="text-truncate mb-4 mb-lg">Warehouse Rent rate: {wh_rental_rate}</h6>

                      {/* <h6 className="text-truncate mb-4 mb-lg">Warehouse Type: {TYPE}</h6>
                  
                    <h6 className="text-truncate mb-4 mb-lg">Warehouse Total Space: {TOTAL_SPACE}</h6> */}

                      <ul className="list-inline mb-0">
                        <Button
                          color="info"
                          className="btn btn-info "
                          onClick={togglemodal}
                        >
                          View More Details
                        </Button>
                      </ul>

                    </div>
                  </div>

                </Col>
              </Row>
              <Modal
                isOpen={modal}
                role="dialog"
                size="lg"
                autoFocus={true}
                centered
                id="companyDetailsModal"
                toggle={togglemodal}>
                <div className="modal-content">

                  {/*                 
                <div  className="warehouseimages">
                <TransformWrapper>
        <TransformComponent>
    <img src={fadeImages[1]} id="imageid" />
        </TransformComponent>
      </TransformWrapper>
                </div>
                <div  className="warehouseimages">
                <TransformWrapper>
        <TransformComponent>
         <img src={fadeImages[2]} id="imageid"/>
        </TransformComponent>
      </TransformWrapper> 
                </div>
            </Carousel> */}

                  <ModalHeader toggle={togglemodal}>
                    Details for Carriers
                  </ModalHeader>
                  <div className="carousel-wrapper">

                    <TransformWrapper>
                      <TransformComponent>
                        <Carousel>
                          <div className="warehouseimages">
                            <img src={fadeImages[0]} alt="test" /></div>
                          <div className="warehouseimages">
                            <img src={fadeImages[1]} alt="test" /></div>
                          <div className="warehouseimages">
                            <img src={fadeImages[2]} alt="test" /></div>
                        </Carousel>
                      </TransformComponent>
                    </TransformWrapper>
                  </div>
                  <ModalBody >

                    <div className="mt-3" id="wh_up">
                      <div className="mt-3">

                        <p className="text-muted m-b-15">
                          Warehouse ID :{wh_id}
                        </p>

                      </div>
                      {wh_rental_id_created_timestamp != null && wh_rental_id_created_timestamp != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15" >
                            Created Time Stamp : {wh_rental_id_created_timestamp}
                          </p>

                        </div>)}
                      {/* {GPS_COORDINATES!=null && GPS_COORDINATES!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            GPS Coordinates : {GPS_COORDINATES}
                                                            </p>
                                                           
                                                        </div>)}
                                                        {LAND_AREA!=null && LAND_AREA!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Land Area : {LAND_AREA}
                                                            </p>
                                                           
                                                        </div>)}
                                                        {ENTITY_ID!=null && ENTITY_ID!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Entity ID : {ENTITY_ID}
                                                            </p>
                                                            
                                                        </div>)} */}
                      {is_active != null && is_active != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Active : {is_active}
                          </p>

                        </div>)}
                      {is_verified != null && is_verified != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Verified : {is_verified}
                          </p>

                        </div>)}
                      {wh_rental_id != null && wh_rental_id != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Rental ID : {wh_rental_id}
                          </p>

                        </div>)}
                      {wh_rental_id_created_timestamp != null && wh_rental_id_created_timestamp != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Rental ID Created Timestamp : {wh_rental_id_created_timestamp}
                          </p>

                        </div>)}
                      {wh_min_lease != null && wh_min_lease != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Min Lease : {wh_min_lease}
                          </p>

                        </div>)}
                      {wh_max_lease != null && wh_max_lease != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Max Lease: {wh_max_lease}
                          </p>

                        </div>)}
                      {wh_rental_rate != null && wh_rental_rate != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Rental Rate : {wh_rental_rate}
                          </p>

                        </div>)}
                      {wh_rental_unit != null && wh_rental_unit != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Rental Unit : {wh_rental_unit}
                          </p>

                        </div>)}
                      {wh_security_deposit != null && wh_security_deposit != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Security Deposit : {wh_security_deposit}
                          </p>

                        </div>)}
                      {wh_lock_in_period != null && wh_lock_in_period != "" && (

                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Lock In Period : {wh_lock_in_period}
                          </p>

                        </div>)}
                      {wh_rent_free_period != null && wh_rent_free_period != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Rental Free Period : {wh_rent_free_period}
                          </p>

                        </div>)}
                      {wh_notice_period != null && wh_notice_period != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Notice Period : {wh_notice_period}
                          </p>

                        </div>)}
                      {wh_rental_increment != null && wh_rental_increment != "" && (
                        <div className="mt-3">
                          <p className="text-muted m-b-15">
                            Rental Increment : {wh_rental_increment}
                          </p>

                        </div>)}
                      {/* {ROOF_HEIGHT!=null && ROOF_HEIGHT!="" &&(
                                                        
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Roof Height : {ROOF_HEIGHT} 
                                                            </p>
                                                            
                                                        </div>)}
                                                        {ROOF_TYPE!=null && ROOF_TYPE!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Roof Type : {ROOF_TYPE} 
                                                            </p>
                                                            
                                                        </div>)}
                                                        {HVAC!=null && HVAC!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                           Hvac : {HVAC} 
                                                            </p>
                                                            
                                                        </div>)}
                                                         {ELECTRICAL!=null && ELECTRICAL!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Electrical: {ELECTRICAL} 
                                                            </p>
                                                            
                                                        </div>)}
                                                        {FLOORING_TYPE!=null && FLOORING_TYPE!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Flooring Type: {FLOORING_TYPE} 
                                                            </p>
                                                            
                                                        </div>)}
                                                        {LOADING_DOCK_COUNT!=null && LOADING_DOCK_COUNT!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Loading Dock Count: {LOADING_DOCK_COUNT} 
                                                            </p>
                                                            
                                                        </div>)}
                                                        {LOADING_DOCK_HEIGHT!=null && LOADING_DOCK_HEIGHT!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Loading Dock Height: {LOADING_DOCK_HEIGHT} 
                                                            </p>
                                                            
                                                        </div>)}
                                                        {AGE!=null && AGE!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Age : {AGE} 
                                                            </p>
                                                            
                                                        </div>)}
                                                        {LOADING_DOCK_SIZE!=null && LOADING_DOCK_SIZE!="" &&(
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Loading Dock Size : {LOADING_DOCK_SIZE} 
                                                            </p>
                                                            
                                                        </div>)}
                                                         */}

                      <br></br>
                      <Button
                        color="dark"
                        className="btn btn-info"
                        onClick={togglemodal}
                      >
                        Book
                      </Button>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button
                        color="warning"
                        className="btn btn-info "
                        onClick={togglemodal}
                      >
                        Negotiate
                      </Button>
                    </div>
                  </ModalBody>
                </div>
              </Modal>
              {/*this is a reactstrap package used for a popup form*/}
              {/* <Modal
                isOpen={modal}
                role="dialog"
                size="lg"
                autoFocus={true}
                centered
                id="verificationModal"
                toggle={togglemodal}>
                <div className="modal-content">
                  <ModalHeader toggle={togglemodal}>
                    Details
                  </ModalHeader>
                  <ModalBody>
                    <div id="kyc-verify-wizard" className="wizard clearfix">
                      <div className="steps clearfix">
                        Name:
                        <input type="text" readOnly={edit ? true : false} value={destination}
                        />
                        <br></br>
                        Capacity: {destination}
                        <br></br>
                        Rate: <input type="text" onChange={(e) => {
                          setModalData((prev) => {
                            return { ...prev, rate: e.target.value }
                          })
                        }} readOnly={!modalData.edit} value={modalData.rate}
                        />
                        <br></br>
                        <br></br>
                      </div>

                      {modalData.rate && modalData.capacity && modalData.name ? "" : <>
                      <Button onClick={() => console.log("confirm value is", modalData)} color="success" className="btn-rounded ">
                        Confirm
                      </Button>
                        <Button onClick={() => {
                          // alert("you can edit the form now !!")
                          setModalData((prev) => {
                            return { ...prev, edit: true }
                          })
                        }} color="warning" className="btn-rounded ">
                          Negotiate
                        </Button></>}
                    </div>

                  </ModalBody>
                </div>
              </Modal> */}
            </CardBody>
          </Card>
          <br></br>
        </Col>
      </React.Fragment>
    </>
  )
}

RecordCardCustomer.propTypes = {
  data: PropTypes.any,
  datas: PropTypes.any
}


export default RecordCardCustomer
