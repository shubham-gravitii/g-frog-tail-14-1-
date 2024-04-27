import React, { useState } from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Container, Col, Row,Input,  UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
//import images from "/src/assets/images"

const RecordCardofcarrier = ({ type, origin, destination, distance, ID, Date, MotID, Timestamp, DeliveryDate}) => {
  //const name = data.name
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false)
  const [modalData, setModalData] = useState({ name: type, capacity: destination, rate: distance, edit: false })

  const togglemodal = () => {
    setModal(!modal);
  };

  return (
    <>
      <React.Fragment>
        <Col xl="6" sm="5">
          <Card>
            <CardBody>
              <Row>
                <Col>
                  <div>

                    {/* Record #{data.carrier_id
                    } */}
                     <h6 className="text-truncate mb-4 mb-lg">Carrier ID : {ID
                    }</h6>
                     {/* <h6 className="text-truncate mb-4 mb-lg-5">Mot ID : {MotID
                    }</h6> */}
                    {/* <h6 className="text-truncate mb-4 mb-lg-5">Equipment Type: {type
                    }</h6> */}

                    <h6 className="text-truncate mb-4 mb-lg">Current Location: {origin

                    }</h6>
                     {/* <h6 className="text-truncate mb-4 mb-lg-5">Created Timestamp: {Timestamp 

                    }</h6> */}
                    <h6 className="text-truncate mb-4 mb-lg">Destination: {destination
                    }</h6>
                    <h6 className="text-truncate mb-4 mb-lg">Distance (In Miles): {distance
                    }</h6>
                    {/* <h6 className="text-truncate mb-4 mb-lg-5">Date : {Date
                    }</h6> */}
                     <h6 className="text-truncate mb-4 mb-lg  ">Delivery Date : {DeliveryDate
                    }</h6>
                    <ul className="list-inline mb-0">
                      <Button
                        color="info"
                        className="btn btn-info "
                        onClick={togglemodal}
                      >
                    View More Detials
                      </Button>
                    </ul>
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
                                                <ModalHeader toggle={togglemodal}>
                                                Details for Carriers
                                                </ModalHeader>
                                                <ModalBody>
                                                    <div className="mt-3">
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Carrier ID 
                                                            </p>
                                                            <Input
                                                             value={ID}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Mot ID
                                                            </p>
                                                            <Input
                                                                value={MotID}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            EQUIPMENT TYPE : 
                                                            </p>
                                                            <Input
                                                                value={type}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Current Location 
                                                            </p>
                                                            <Input
                                                                value={origin}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Created Timestamp
                                                            </p>
                                                            <Input
                                                               value={Timestamp} 
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Destination
                                                            </p>
                                                            <Input
                                                               value={destination} 
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            LOAD DISTANCE (In miles)
                                                            </p>
                                                            <Input
                                                               value={distance} 
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Date 
                                                            </p>
                                                            <Input
                                                               value= {Date}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Delivery Date
                                                            </p>
                                                            <Input
                                                               value= {DeliveryDate}
                                                            />
                                                        </div>
                                                        
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

RecordCardofcarrier.propTypes = {
  data: PropTypes.any,
  datas: PropTypes.any
}


export default RecordCardofcarrier
