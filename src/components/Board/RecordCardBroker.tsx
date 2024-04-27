//@ts-nocheck
import React, { useEffect, useState } from "react"
import { ReactPhotoCollage } from "react-photo-collage"
import { Web3Storage } from 'web3.storage'
import PropTypes from "prop-types"
import { Card, CardBody, Container, Col, Row, FormGroup, Input, UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
import Reactcollage from './ReactCollage'
//import images from "/src/assets/images"

const RecordCardforBroker = ({ typename,IDName,Timestamps,delivery,origin,  load, weight, pickupdates,  IDLoad, destination,destinations, commodity, Distances ,rates, addition,  Date}) => {
  //const name = data.name
  const [modal, setModal] = useState(false);
  const [modals, setModals]= useState(false)
  const [edit, setEdit] = useState(false)
  const [modalData ,setModalData] = useState({name:typename , capacity:destination  , rate:rates , edit:false})


  const togglemodal = () => {
    setModals(!modals);
  };
  const togglemodals = () => {
    setModal(!modal);
  };
  

  
 

  return (
    <>
      <React.Fragment>
        <Col xl="6" sm="5">
          <Card>
            <CardBody>
              <Row>
                <Col lg="12">
                  <div>
                    <h6 className="text-truncate mb-4 mb-lg-3">EQUIPMENT TYPE :  {load
                    }</h6>
                    <h6 className="text-truncate mb-4 mb-lg-3">DISTANCE (In Miles):   {Distances
                    }</h6>
                    {/* <h6 className="mb-4 mb-lg-5">BROKER_LOAD_WEIGHT :   {weight
                    }</h6> */}
                    <h6 className="text-truncate mb-4 mb-lg-3">ORIGIN :  {origin
                    }</h6>
                    <h6 className=" text-truncate mb-4 mb-lg-3">DESTINATION :    {destinations
                    }</h6>
                    <h6 className=" text-truncate mb-4 mb-lg-3">RATE ($): {rates
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

              <Modal style={{screenY:"scroll"}}
                                            isOpen={modals}
                                            role="dialog"
                                            size="lg"
                                            autoFocus={true}
                                            centered
                                            id="companyDetailsModal"
                                            toggle={togglemodal}>
                                            <div className="modal-content">
                                                <ModalHeader toggle={togglemodal}>
                                                Details for Broker
                                                </ModalHeader>
                                                <ModalBody>
                                                   <Reactcollage/>
                                                    <div className="mt-3">
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER ID
                                                            </p>
                                                            <Input
                                                             value={IDName}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER LOAD ID
                                                            </p>
                                                            <Input
                                                                value={IDLoad}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            EQUIPMENT TYPE : 
                                                            </p>
                                                            <Input
                                                                value={load}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER LOAD PICKUP DATE :
                                                            </p>
                                                            <Input
                                                                value={pickupdates}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            LOAD DISTANCE :
                                                            </p>
                                                            <Input
                                                               value={Distances} 
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            LOAD ORIGIN :  
                                                            </p>
                                                            <Input
                                                               value={origin} 
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            LOAD DISTANCE :
                                                            </p>
                                                            <Input
                                                               value={Distances} 
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER LOAD DESTINATION :
                                                            </p>
                                                            <Input
                                                               value= {destinations}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER LOAD RATE :
                                                            </p>
                                                            <Input
                                                               value= {rates}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER LOAD CREATED TIMESTAMP :
                                                            </p>
                                                            <Input
                                                               value= {Timestamps}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER LOAD ADDITIONAL REQUIREMENTS :
                                                            </p>
                                                            <Input
                                                               value= {addition}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER LOAD COMMODITY : 
                                                            </p>
                                                            <Input
                                                               value= {commodity}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            BROKER LOAD DELIVERY DATE : 
                                                            </p>
                                                            <Input
                                                               value= {delivery}
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
              {/* <Modal
                isOpen={modal}
                role="dialog"
                size="lg"
                autoFocus={true}
                centered
                id="verificationModal"
                toggle={togglemodals}>
                <div className="modal-content">
                  <ModalHeader toggle={togglemodals}>
                  You can change the values here !! 
                  </ModalHeader>
                  <ModalBody>
                    <div id="kyc-verify-wizard" className="wizard clearfix">
                      <div className="steps clearfix">
                      Broker ID : 
                        <input value={IDName}
                        />
                        <br></br>
                        BROKER LOAD ID
                        <input value={IDLoad}
                        />
                        <br></br>
                      EQUIPMENT_TYPE : 
                        <input  value={load}
                         />
                         <br></br>
                        LOAD_DISTANCE : < input value={Distances} 
                        />
                        <br></br>
                        LOAD_ORIGIN :  <input value={origin}
                        />
                        <br></br>
                        BROKER_LOAD_DESTINATION : <input value={destinations}
                        />
                        <br></br>
                        BROKER_LOAD_RATE : <input type="text"  onChange={(e)=>{
                          setModalData((prev)=>{
                            return {...prev , rate : e.target.value}
                          })
                        }} readOnly={!modalData.edit}  value={modalData.rate}
                        />
                        <br></br>
                        BROKER_LOAD_CREATED_TIMESTAMP : < input value={Timestamps} 
                        />
                        <br></br>
                        BROKER_LOAD_ADDITIONAL_REQUIREMENTS : <input value={addition}
                        />
                        <br></br>
                        BROKER_LOAD_COMMODITY : <input value={commodity}
                        />
                        <br></br>
                        BROKER_LOAD_DELIVERY_DATE : <input value={delivery}
                        />
                        </div>
                      <Button
                       onClick={()=>{
                        // alert("you can edit the form now !!")
                        setModalData((prev)=>{
                          return {...prev , edit:true}
                        })
                      }} color="warning" className="btn-rounded ">
                        Negotiate
                      </Button>
                    </div>

                  </ModalBody>
                </div>
              </Modal> */}
              
              {/*this is a reactstrap package used for a popup form*/}
              {/* <Modal
                isOpen={modals}
                role="dialog"
                size="lg"
                autoFocus={true}
                centered
                id="verificationModal"
                
                toggle={togglemodal}>
                <div className="modal-content">
                  <ModalHeader toggle={togglemodal}>
                    Details for Broker
                  </ModalHeader>
                  <ModalBody>
                    <div id="kyc-verify-wizard" className="wizard clearfix">
                      <div className="steps clearfix">
                      Broker ID : 
                        <input value={IDName}
                        />
                        <br></br>
                        BROKER LOAD ID
                        <input value={IDLoad}
                        />
                        <br></br>
                      EQUIPMENT TYPE : 
                        <input  value={load}
                         />
                         <br></br>
                         BROKER LOAD PICKUP DATE :
                         <input value={pickupdates}
                         />
                         <br></br>
                        LOAD DISTANCE : < input value={Distances} 
                        />
                        <br></br>
                        LOAD ORIGIN :  <input value={origin}
                        />
                        <br></br>
                        BROKER LOAD DESTINATION : <input value={destinations}
                        />
                        <br></br>
                        BROKER LOAD RATE : <input value={rates}
                        />
                        <br></br>
                        BROKER LOAD CREATED TIMESTAMP : < input value={Timestamps} 
                        />
                        <br></br>
                        BROKER LOAD ADDITIONAL REQUIREMENTS : <input value={addition}
                        />
                        <br></br>
                        BROKER LOAD COMMODITY : <input value={commodity}
                        />
                        <br></br>
                        BROKER LOAD DELIVERY DATE : <input value={delivery}
                        />
                        </div>
                        <Button
                        color="info"
                        className="btn btn-info "
                        onClick={togglemodals}
                      >
                Book
                      </Button>
                      <Button
                        color="warning"
                        className="btn btn-info "
                        onClick={togglemodals}
                      >
                  Negotiate
                      </Button>

                    </div>

                  </ModalBody>
                </div>
              </Modal> */}
            </CardBody>
          </Card>
        </Col>
      </React.Fragment>
    </>
  )
}

RecordCardforBroker.propTypes = {
  data: PropTypes.any,
  datas:PropTypes.any
}


export default RecordCardforBroker
