// @ts-nocheck 

import react, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { toast } from 'react-toastify';
import { ReactPhotoCollage } from "react-photo-collage";
import axios from 'axios';
import { FaAcquisitionsIncorporated } from "react-icons/fa";

const defaulThumbnail = "https://images.unsplash.com/photo-1633959592096-9d9a339b99fa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const setting = {
    width: "600px",
    height: ["250px", "170px"],
    layout: [1, 4],
    photos: [
        {
            source:
                "https://images.unsplash.com/photo-1517088455889-bfa75135412c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e5548929376f93d8b1b7a21097df03bd&auto=format&fit=crop&w=749&q=80"
        },
        {
            source:
                "https://images.unsplash.com/photo-1526656892012-7b336603ed46?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=31c8e58b58c25dfcc18452ed29b52951&auto=format&fit=crop&w=334&q=80"
        },
        {
            source:
                "https://images.unsplash.com/photo-1521024221340-efe7d7fa239b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9ad8a99d809d3fa3a9e8dff3ecc81878&auto=format&fit=crop&w=750&q=80"
        },
        {
            source:
                "https://images.unsplash.com/photo-1523038793606-2fd28f837a85?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=919b76f4229e41416653aeb10e84e94a&auto=format&fit=crop&w=334&q=80"
        },
        {
            source:
                "https://images.unsplash.com/photo-1516832970803-325be7a92aa5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=93d7ac9abad6167aecb49ebd67fd5b6d&auto=format&fit=crop&w=751&q=80"
        },
        {
            source:
                "https://images.unsplash.com/photo-1526938972776-11558ad4de30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=973795a277e861265b0fabbf4a96afe2&auto=format&fit=crop&w=750&q=80"
        },
        {
            source:
                "https://images.unsplash.com/photo-1464550838636-1a3496df938b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f22dbf6c13ea7c21e803aa721437b691&auto=format&fit=crop&w=888&q=80"
        }
    ],
    showNumOfRemainingPhotos: true
};

const OneDetailPost = ({ RentalFields, BasicFields, SpecificationFields }) => {
    const [show, setShow] = useState(false);
    const [warehouseBasicFields, setWarehouseBasicFields] = useState(BasicFields);
    const [warehouseRentalFields, setWarehouseRentalFields] = useState(RentalFields);
    const [warehouseSpecificationFields, setWarehouseSpecificationFields] = useState(SpecificationFields);
    const [newCID, setDeletedCid] = useState<StorageCidItem[]>([]);
    const [imagesData, setImagesData] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [newImages, setNewImages] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [newImagesCID, setNewImagesCID] = useState([]);

    function handleShow() {
        setShow(true);
    }

    const openImageInNewTab = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div>
            <button onClick={() => handleShow()}>Show modal</button>
            <Modal show={show} size='xl' fullscreen={true} onHide={() => setShow(false)} scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>Warehouse Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        {/* Image carousal using react-collage */}
                        {/* <Row>
                            <Col className="col-md-8 col-sm-12" >
                                <Row>
                                    <Col className="col-md-6 col-sm-12" >
                                        <div >
                                            <ReactPhotoCollage {...setting} />
                                        </div>

                                    </Col>

                                    <Col className="col-md-6 col-sm-12 mt-sm-3">
                                        <Table bordered hover >

                                            <tbody>
                                                <tr>

                                                    <td>Rental Rate</td>
                                                    <td>Otto</td>

                                                </tr>
                                                <tr>

                                                    <td>Security deposit</td>
                                                    <td>Thornton</td>

                                                </tr>
                                                <tr>

                                                    <td>Notice period</td>
                                                    <td>Thornton</td>

                                                </tr>
                                                <tr>

                                                    <td>Rent free period</td>
                                                    <td>Thornton</td>

                                                </tr>
                                                <tr>

                                                    <td>Rental Inscrement</td>
                                                    <td>Thornton</td>

                                                </tr>
                                                <tr>
                                                    <td>Area offered</td>
                                                    <td>Thornton</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <Button variant="outline-info" type="button" className="mt-3 w-100">
                                            Contact
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row> */}

                        {/* Normal Carousal with image openning in new tab */}
                        <Row>
                            <Col className="col-md-8 col-12" >
                                {imagesLoaded && imagesData ? (
                                    <Carousel>
                                        {imagesData.map((url, index) => (



                                            <Carousel.Item onClick={() => openImageInNewTab(url)} key={index} style={{ cursor: 'pointer' }}>
                                                <img className="d-block w-100" src={url} alt={`Image ${index}`}
                                                />
                                                <Image className="img-fluid" src={url} alt={`Image ${index}`}
                                                />
                                            </Carousel.Item>

                                        ))}
                                    </Carousel>
                                ) : (
                                    <p>Loading images...</p>
                                )}

                            </Col>

                            <Col className="col-md-4 col-12 mt-3">
                                <Table responsive bordered hover style={{ fontSize: "18px" }}>

                                    <tbody>
                                        <tr>

                                            <td>
                                                Rental Rate</td>
                                            <td>{warehouseRentalFields?.wh_rental_rate}</td>

                                        </tr>
                                        <tr>
                                            <td>Available Date</td>
                                            <td>{warehouseRentalFields?.wh_rental_available_date}</td>
                                        </tr>

                                        <tr>
                                            <td>Security deposit</td>
                                            <td>{warehouseRentalFields?.wh_security_deposit}</td>
                                        </tr>
                                        <tr>

                                            <td>Notice period</td>
                                            <td>{warehouseRentalFields?.wh_notice_period}</td>

                                        </tr>
                                        <tr>

                                            <td>Rent free period</td>
                                            <td>{warehouseRentalFields?.wh_rent_free_period}</td>

                                        </tr>
                                        <tr>

                                            <td>Rental Inscrement</td>
                                            <td>{warehouseRentalFields?.wh_rental_increment}</td>

                                        </tr>
                                        <tr>

                                            <td>Max Lease</td>
                                            <td>{warehouseRentalFields?.wh_max_lease}</td>

                                        </tr>
                                        <tr>
                                            <td>Min Lease</td>
                                            <td>{warehouseRentalFields?.wh_min_lease}</td>
                                        </tr>
                                        <tr>
                                            <td>Lock In Period</td>
                                            <td>{warehouseRentalFields?.wh_lock_in_period}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button variant="primary" type="button" className="mt-3 w-100">
                                    Contact
                                </Button>
                                <Button variant="outline-info" type="button" className="mt-3 w-100">
                                    Send Inquiry
                                </Button>
                                {/* Map */}
                                <div className="mt-3">
                                    <iframe
                                        width="100%"
                                        height="300"
                                        frameBorder="0"
                                        scrolling="no"
                                        marginHeight="0"
                                        marginWidth="0"
                                        src={`https://maps.google.com/maps?q=${17.360556},${78.473889}&z=15&output=embed`}
                                    />
                                    </div>
                            </Col>

                        </Row>

                        <Col className="my-5">
                            <Col className="col-md-8 col-sm-12">
                                <h3>Specification Details</h3>
                                <Table>

                                    <tbody>
                                        <tr>
                                            <td>Roof Height</td>
                                            <td>Otto</td>
                                            <td>Roof Type</td>
                                            <td>Thornton</td>
                                        </tr>
                                        <tr>
                                            <td>HVAC</td>
                                            <td>Otto</td>
                                            <td>Electrical</td>
                                            <td>Thornton</td>
                                        </tr>
                                        <tr>
                                            <td>Flooring Type</td>
                                            <td>Otto</td>
                                            <td>Age</td>
                                            <td>Thornton</td>
                                        </tr>
                                        <tr>
                                            <td>Loading Dock Count</td>
                                            <td>Otto</td>
                                            <td>Loading Dock Height</td>
                                            <td>Thornton</td>
                                        </tr>
                                        <tr>
                                            <td>Loading Dock Size</td>
                                            <td>Otto</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <br />
                                <h3>Basic Details</h3>
                                <Table >

                                    <tbody>
                                        <tr>
                                            <td>Space</td>
                                            <td>Otto</td>

                                            <td>Land Area</td>
                                            <td>Thornton</td>
                                        </tr>
                                        <tr>
                                            <td>Type</td>
                                            <td>Thornton</td>
                                        </tr>

                                    </tbody>

                                </Table>
                                <br />
                                <h3>Description</h3>
                                <p style={{ fontSize: "18px" }}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                                <br />
                                <h3>Extra</h3>
                                <p style={{ fontSize: "18px" }}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                                <Table bordered hover >

                                    <tbody>
                                        <tr>

                                            <td>Rental Rate</td>
                                            <td>Otto</td>

                                        </tr>
                                        <tr>

                                            <td>Security deposit</td>
                                            <td>Thornton</td>

                                        </tr>
                                        <tr>

                                            <td>Notice period</td>
                                            <td>Thornton</td>

                                        </tr>
                                        <tr>

                                            <td>Rent free period</td>
                                            <td>Thornton</td>

                                        </tr>
                                        <tr>

                                            <td>Rental Inscrement</td>
                                            <td>Thornton</td>

                                        </tr>
                                        <tr>
                                            <td>Area offered</td>
                                            <td>Thornton</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <br />
                            </Col>
                        </Col>
                    </Container>


                </Modal.Body>
            </Modal>

        </div>
    )
}

export default OneDetailPost
