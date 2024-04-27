import React, { useState } from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Container, Col, Row, UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
//import images from "/src/assets/images"

const RateRecords = ({ type, origin, destination, distance, ID, Date, MotID, Timestamp, DeliveryDate}) => {
  //const name = data.name
  const [modal, setModal] = useState(false);

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
                     <h6 className="text-truncate mb-4 mb-lg-5">Carrier ID : {ID
                    }</h6>
                     <h6 className="text-truncate mb-4 mb-lg-5">Mot ID : {MotID
                    }</h6>
                    <h6 className="text-truncate mb-4 mb-lg-5">Created Type : {type
                    }</h6>

                    <h6 className="text-truncate mb-4 mb-lg-5">Current Location: {origin

                    }</h6>
                     <h6 className="text-truncate mb-4 mb-lg-5">Created Timestamp: {Timestamp 

                    }</h6>
                    <h6 className="text-truncate mb-4 mb-lg-5">Destination: {destination
                    }</h6>
                    <h6 className="text-truncate mb-4 mb-lg-5">Distance: {distance
                    }</h6>
                    <h6 className="text-truncate mb-4 mb-lg-5">Date : {Date
                    }</h6>
                     <h6 className="text-truncate mb-4 mb-lg-5">Delivery Date : {DeliveryDate
                    }</h6>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <br></br>
        </Col>
      </React.Fragment>
    </>
  )
}

RateRecords.propTypes = {
  data: PropTypes.any,
  datas: PropTypes.any
}


export default RateRecords;
