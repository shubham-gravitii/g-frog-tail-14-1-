//@ts-nocheck
import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Container, Col, Row, FormGroup, Input, UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from "reactstrap"
//import images from "/src/assets/images"
import Reactcollage from './ReactCollage'


// import React, { useEffect, useState } from "react"
import { Web3Storage } from 'web3.storage'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Image from "next/image"
import { ZoomIn, ZoomOut } from "react-feather"
import * as Constants from "../../utils/constants"
import { argThresholdOpts } from "moment"
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useAuth } from "../../contexts/UserContext"
import EnquiryForm from "../Forms/EnquiryForm/EnquiryForm"




const RecordCardOwner = ({ req_post_id, created_timestamp, start_date, req_location, req_max_distance, req_area, req_wh, req_duration, req_other_details, req_rate, customer_id, thumbnail }) => {

  const { currentUser } = useAuth()
  const [modal, setModal] = useState(false);
  const [modals, setModals] = useState(false)
  const [edit, setEdit] = useState(false)
  const [modalEnquiry, setModalEnquiry] = useState(false);

  const [modalData, setModalData] = useState({ name: req_post_id, capacity: req_max_distance, rate: req_area, edit: false })

  const router = useRouter();

  const toggleModalEnquiry = () => setModalEnquiry(!modalEnquiry);

  const handleEnquiryFormSubmit = () => {
    setModalEnquiry(!modalEnquiry);
  };

  const togglemodal = () => {
    {
      currentUser ? (setModals(!modals)) : (Swal.fire({
        title: 'Please Login/SignUp to continue',
        text: "To view posts please login/SignUp",
        icon: 'warning',
        confirmButtonText: 'Login/SignUp',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login')
        }
      }))
    }


  };

  const togglemodals = () => {
    setModal(!modal);
  };

  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const handlePageChange = (newPageNumber) => {
    if (newPageNumber >= 1) {
      setPageNumber(newPageNumber);
    }
  };

  return (
    <>
      <React.Fragment>
        <div className="container">

          <Card>
            <img
              src={thumbnail}
              alt="Thumbnail"
              style={{ objectFit: "cover", height: "414px"}}
              className="card-img-top"
            />
            <CardBody>
              <Row>
                <Col lg="12">
                  <div>
                    <h6 className="text-truncate mb-4 mb-lg-3">Title:{start_date}
                    </h6>
                    <h6 className="text-truncate mb-4 mb-lg-3">Requirement Start Date :{start_date}
                    </h6>
                    <h6 className="text-truncate mb-4 mb-lg-3">Requirement Location :   {req_location
                    }</h6>

                    {/* <h6 className="text-truncate mb-4 mb-lg-3"> Requirement PostID :{req_post_id}
                    </h6>
                    <h6 className=" text-truncate mb-4 mb-lg-3"> Created Timestamp :    {created_timestamp
                    }</h6> */}



                    <ul className="list-inline mb-0">
                      <Button
                        color="light"
                        className="btn btn-outline-primary btn-sm  w-100"
                        onClick={togglemodal}
                      >
                        View More Details
                      </Button>
                    </ul>
                  </div>
                </Col>
              </Row>


              <Modal style={{ screenY: "scroll" }}
                isOpen={modals}
                role="dialog"
                size="lg"
                autoFocus={true}
                centered
                id="requirementsDetailsModal"
                toggle={togglemodal}>
                <div className="modal-content">
                  <ModalHeader toggle={togglemodal}>
                    Requirement Details Posted By Customer
                  </ModalHeader>
                  {/* <Reactcollage /> */}
                  <ModalBody>
                    <div className="mt-3">
                      <div className="mt-3">
                        <p className="text-muted m-b-15">
                          Requirement Area(in sq.feet)
                        </p>
                        <Input
                          value={req_area}
                          disabled={true}
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-muted m-b-15">
                          Requirement Maximum Distance
                        </p>
                        <Input
                          value={req_max_distance}
                          disabled={true}
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-muted m-b-15">
                          Requirement WH
                        </p>
                        <Input
                          value={req_wh} disabled={true}
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-muted m-b-15">
                          Requirement Duration
                        </p>
                        <Input
                          value={req_duration} disabled={true}
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-muted m-b-15">
                          Requirement Other Details
                        </p>
                        <Input
                          value={req_other_details} disabled={true}
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-muted m-b-15">
                          Requirement Rate
                        </p>
                        <Input
                          value={req_rate} disabled={true}
                        />
                      </div>
                      {/* <div className="mt-3">
                        <p className="text-muted m-b-15">
                          Customer ID
                        </p>
                        <Input
                          value={customer_id} disabled={true}
                        />
                      </div> */}


                      <br></br>
                      <Button
                        color="dark"
                        className="btn btn-info"
                        onClick={togglemodal} disabled={true}
                      >
                        Book
                      </Button>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {customer_id != null && customer_id.trim() !== '' && (
                        <Button
                          color="warning"
                          className="btn btn-info"
                          onClick={toggleModalEnquiry}
                        >
                          Send Enquiry
                        </Button>
                      )}

                    </div>
                  </ModalBody>
                </div>
              </Modal>
            </CardBody>
          </Card>
        </div>
        <Modal isOpen={modalEnquiry} toggle={toggleModalEnquiry}>
          <ModalHeader toggle={toggleModalEnquiry}>Enquiry Form</ModalHeader>
          <ModalBody>

            <EnquiryForm
              onSubmit={handleEnquiryFormSubmit}
              userRole={"Customer"}
              user_id={customer_id}
            />
          </ModalBody>
        </Modal>

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

RecordCardOwner.propTypes = {
  data: PropTypes.any,
  datas: PropTypes.any
}


export default RecordCardOwner;
