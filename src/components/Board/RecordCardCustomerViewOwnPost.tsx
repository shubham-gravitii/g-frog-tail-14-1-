// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CustomerViewOwnPostForm from '../Forms/CustomerViewOwnPostForm/CustomerViewOwnPostForm';




const GalleryComponentCustomerViewOwnPost = ({ details, onCheckboxChange, thumbnail }) => {
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const {
        requirement_post_id,
        requirement_start_date,
        requirement_location,
        requirement_duration,
        requirement_rate,
        requirement_max_distance,
        requirement_area,
        requirement_wh,
        requirement_other_details,
        customer_id,
        is_active,
        is_verified,
    } = details;

    const handleCheckboxClick = (e) => {
        const isChecked = e.target.checked;
        onCheckboxChange(requirement_post_id, isChecked);
    };


    return (
        <>
            <div className="container">
                <Col>
                    <Card style={{
                        backgroundColor: is_active === 'True' || is_active === 'true' ? 'inherit' : '#a1a09f'
                    }}>
                        <img
                            src={thumbnail}
                            alt="Thumbnail"
                            style={{ objectFit: "cover", height: "414px"}}
                            className="card-img-top"
                        />
                        <CardBody style={{ position: 'relative' }}>
                            <Row>
                                <Col style={{ position: 'relative' }}>
                                    <CardTitle>Post Id: {requirement_post_id} </CardTitle>
                                    <h6 style={{
                                        fontSize: is_active === 'True' || is_active === 'true' ? 'inherit bold' : '14px',
                                        color: is_active === 'True' || is_active === 'true' ? 'inherit' : 'white'
                                    }} className="text-truncate mb-4 mb-lg"></h6>

                                    <h6 style={{
                                        fontSize: is_active === 'True' || is_active === 'true' ? 'inherit bold' : '14px',
                                        color: is_active === 'True' || is_active === 'true' ? 'inherit' : 'white'
                                    }}>
                                        Location: {requirement_location}

                                    </h6>
                                    <h6 style={{
                                        fontSize: is_active === 'True' || is_active === 'true' ? 'inherit bold' : '14px',
                                        color: is_active === 'True' || is_active === 'true' ? 'inherit' : 'white'
                                    }} className="text-truncate mb-4 mb-lg">Duration: {requirement_duration}</h6>

                                    <Button color="light"
                                        className="btn btn-outline-primary btn-sm" onClick={handleShowModal}>
                                        View Details
                                    </Button>


                                    <input
                                        type="checkbox"
                                        style={{
                                            position: 'absolute',
                                            bottom: '0',
                                            right: '0',
                                            marginRight: '12px'
                                        }}
                                        onChange={handleCheckboxClick}
                                    />
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                </Col>
                <Modal
                    isOpen={showModal}
                    toggle={handleCloseModal}
                    role="dialog"
                    size="xl"
                    // fullscreen={true}
                    autoFocus={true}
                    centered
                    id="WhDetailsModal">
                    <div className="modal-content">
                        <ModalHeader toggle={handleCloseModal}>Requirement Details</ModalHeader>
                        <div className="modal-body">
                            <div className="row">
                                <CustomerViewOwnPostForm
                                    requirement_details={details}
                                />
                            </div>
                        </div>
                    </div>

                </Modal>
            </div>


        </>
    )
}

export default GalleryComponentCustomerViewOwnPost
