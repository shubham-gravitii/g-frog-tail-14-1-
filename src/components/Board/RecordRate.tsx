import React, { useState } from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Container, Col, Row, UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
//import images from "/src/assets/images"

const RecordRate = ({ RC_ID, bl_origin, bl_destination, ol_equipment_type, rc_Timestamp }) => {
  //const name = data.name
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false)

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
                <Col lg="5">
                  <div>

                    {/* Record #{data.carrier_id
                    } */}
                     <h6 className="text-truncate mb-4 mb-lg-5">RC ID : {RC_ID
                    }</h6>
                     <h6 className="text-truncate mb-4 mb-lg-5">Origin : {bl_origin
                    }</h6>
                    <h6 className="text-truncate mb-4 mb-lg-5">Destination: {bl_destination
                    }</h6>

                    <h6 className="text-truncate mb-4 mb-lg-5">Equipment Type: {ol_equipment_type
                    }</h6>
                     <h6 className="text-truncate mb-4 mb-lg-5">Created Timestamp: {rc_Timestamp 
                    }</h6>
                    
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item me-3">
                        <h6 className="font-size-14" id="amountTooltip">
                          <i className="bx bx-money me-1 text-muted" />Final Rate

                        </h6>
                      </li>
                      <li className="list-inline-item">
                        <h5 className="font-size-14" id="duedateTooltip">
                          <i className="bx bx-calendar me-1 text-muted" />
                          {/* {data.startdate} */}
                          <UncontrolledTooltip
                            placement="top"
                            target="duedateTooltip"
                          >
                            Due Date
                          </UncontrolledTooltip>
                        </h5>
                      </li>
                      <Button
                        color="info"
                        className="btn btn-info "
                        onClick={togglemodal}
                      >
                        view
                      </Button>
                    </ul>
                  </div>
                </Col>
              </Row>

              {/*this is a reactstrap package used for a popup form*/}
            
            </CardBody>
          </Card>
          <br></br>
        </Col>
      </React.Fragment>
    </>
  )
}

RecordRate.propTypes = {
  data: PropTypes.any,
  datas: PropTypes.any
}


export default RecordRate ;