//@ts-nocheck
import React, { useState } from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Container, Col, Row, FormGroup, Input, UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
 
 

const RecordOwner = ({
  
  owner_full_name,
  owner_phone_number,
  owner_email_id,
  owner_address,
  owner_id_doc_type,
  owner_id_doc_number,
  owner_entity_type,
  owner_entity_name,
  owner_entity_registration_number,
  owner_entity_registered_address,
  owner_entity_pan
 
}) => {
  //const name = data.name
  const [modal, setModal] = useState(false);
  const [modals, setModals]= useState(false)
  const [edit, setEdit] = useState(false)
  const [modalData ,setModalData] = useState({Name:owner_full_name, Phone:owner_phone_number,email:owner_email_id,edit: true})


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
                    <h6 className="text-truncate mb-4 mb-lg-3">Name:{owner_full_name}
                    </h6>
                    <h6 className="text-truncate mb-4 mb-lg-3"> Phone:{owner_phone_number}
                    </h6>
                
                    <h6 className="text-truncate mb-4 mb-lg-3">Email:{owner_email_id}
                    </h6>
                    


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
                </Col>
              </Row>

            
              <Modal style={{screenY:"scroll"}}
                                            isOpen={modals}
                                            role="dialog"
                                            size="lg"
                                            autoFocus={true}
                                            centered
                                            id="requirementsDetailsModal"
                                            toggle={togglemodal}>
                                            <div className="modal-content">
                                                <ModalHeader toggle={togglemodal}>
                                             Requirement Details Posted By Owner
                                                </ModalHeader>
                                                <ModalBody>
                                                    <div className="mt-3">
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                          Owner Address
                                                            </p>
                                                            <Input
                                                             value={owner_address}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                           Owner ID Document Type
                                                            </p>
                                                            <Input
                                                                value={owner_id_doc_type}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Owner ID Doc Number
                                                            </p>
                                                            <Input
                                                                value={owner_id_doc_number}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                          Owner Entity Type
                                                            </p>
                                                            <Input
                                                                value={owner_entity_type}
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                         Owner Entity Name
                                                            </p>
                                                            <Input
                                                               value={owner_entity_name} 
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                         Owner Entity Registration Number
                                                            </p>
                                                            <Input
                                                               value={owner_entity_registration_number} 
                                                            />
                                                        </div>
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            Owner Entity Registered Address
                                                            </p>
                                                            <Input
                                                               value={owner_entity_registered_address} 
                                                            />
                                                        </div>
                                                        
                                                        <div className="mt-3">
                                                            <p className="text-muted m-b-15">
                                                            PAN Card Number
                                                            </p>
                                                            <Input
                                                               value={owner_entity_pan} 
                                                            />
                                                        </div>
                                                        
                                                        
                                                        <br></br>
                                                        <Button
                                                            color="dark"
                                                            className="btn btn-info"
                                                            onClick={togglemodal}
                                                        >
                                                         Edit
                                                        </Button>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <Button
                                                         color="warning"
                                                         className="btn btn-info "
                                                             onClick={togglemodal}
                      >
                 delete
                      </Button>
                                                    </div>
                                                </ModalBody>
                                            </div>
                                        </Modal>
             
            </CardBody>
          </Card>
        </Col>
<br></br><br></br><br></br>

 
        

        





      </React.Fragment>
      {/* <div className="mt-3">
              <Button
                color="primary"
                onClick={() => handlePageChange(pageNumber - 1)}
              >
                Previous
              </Button>
              <Button color="secondary" disabled>
                {pageNumber}
              </Button>
              <Button
                color="primary"
                onClick={() => handlePageChange(pageNumber + 1)}
              >
                Next
              </Button>
              </div> */}
    </>
  )
}

RecordOwner.propTypes = {
  data: PropTypes.any,
  datas:PropTypes.any
}


export default RecordOwner;
