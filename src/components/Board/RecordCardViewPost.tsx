// @ts-nocheck 
import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Card, CardBody, UncontrolledTooltip, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import "react-slideshow-image/dist/styles.css";
// import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Web3Storage } from 'web3.storage'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as Constants from "../../utils/constants"
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { ReactPhotoCollage } from "react-photo-collage";
import EnquiryForm from "../Forms/EnquiryForm/EnquiryForm";
import ImageCarousal from "../ImageCarousal/imageCarousal"
import OneDetailPost from "../OneDetailPost/OneDetailPost";

interface StorageCidItem {
    cid: string;
    wh_id: string;
    owner_entity_id: string;
    is_thumbnail: string;
    is_active: string;
    is_verified: string;
}

const setting = {
    width: '100%',
    height: ['450px', '170px'],
    layout: [1, 3],
    photos: [],
    showNumOfRemainingPhotos: true
};

const defaulThumbnail = "https://images.unsplash.com/photo-1591795523670-5999e124d7d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
const fadeImages = [
    "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=600",
];

const GalleryComponent = ({ RentalFields }) => {
console.log(RentalFields)
    const [modal, setModal] = useState(false);
    const [modalEnquiry, setModalEnquiry] = useState(false);
    const [thumnailLoading, setThumnailLoading] = useState(true);
    const [imagesLoading, setImagesLoading] = useState(true);
    const [thumbnail, setThumbnail] = useState<string>("");
    const [warehouseBasicFields, setWarehouseBasicFields] = useState();
    const [warehouseRentalFields, setWarehouseRentalFields] = useState(RentalFields);
    const [warehouseSpecificationFields, setWarehouseSpecificationFields] = useState();
    const [imagesData, setImagesData] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [storageCid, setStorageCid] = useState<StorageCidItem[]>([]);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    // const [images, setImages] = useState<{ img: Array<string>, i: number }>({ img: [], i: 0 });
    const [images, setImages] = useState<{ img: string[] }>({ img: [] });

    const { wh_id, wh_rental_id, wh_rental_id_created_timestamp, wh_rental_available_date, wh_min_lease, wh_max_lease, wh_rental_rate, wh_rental_unit, wh_security_deposit, wh_lock_in_period, wh_rental_increment, wh_notice_period, wh_rent_free_period, is_active, is_verified, thumbnail_cid } = RentalFields;

    const togglemodal = async (id: string) => {
        setModal(!modal);
        console.log(id);

        try {
            getBasicData(wh_id); 
            getRecords(wh_id);
            getSpecData(wh_id);  

            if (setting.photos.length === 0) {
                setImagesLoading(false)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleModalEnquiry = () => {
        setModalEnquiry(!modalEnquiry)};

    const handleEnquiryFormSubmit = () => {
        setModalEnquiry(!modalEnquiry);
    };

   
    const getRecords = async (wh_id) => {
        setImagesData([])
        const response = await axios.get(Constants.local_api_gateway_host + '/mediaStorageCID/?WH_ID=' + wh_id);
        const responseData = response.data.response as StorageCidItem[];
        setStorageCid(responseData);

        if (responseData?.length > 0) {
            const imagePromises = responseData.map((record) => getImages(record.cid));

            await Promise.all(imagePromises);

            setImagesLoading(false);


            const populatedPhotos = imagesData.map((url) => ({ source: url }));
            const formattedData = populatedPhotos.map(item => {
                return {
                    source: `${item.source}`
                };
            });

            console.log(formattedData);
            setting.photos = formattedData;
        }
        console.log(setting.photos)

    }

    const getBasicData = async (wh_id) => {

        const res = await axios.get(Constants.local_api_gateway_host + '/basicDetails/', {
            params: {
                WH_ID: wh_id,
            }
        });
        const data = await res.data;
        console.log(data.response[0]);

        setWarehouseBasicFields(data.response[0]);
        const [longitude, latitude] = data.response[0].wh_gps_coordinates.split(" ");
        setLatitude(latitude);
        setLongitude(longitude);
        console.log(latitude, longitude)
    }

    const getSpecData = async (wh_id) => {

        const res = await axios.get(Constants.local_api_gateway_host + '/specificationDetails/', {
            params: {
                WH_ID: wh_id,
            }
        });
        const data = await res.data;
        console.log(data.response[0]);
        setWarehouseSpecificationFields(data.response[0]);

    }


    const getImages = async (cidnumber: string) => {

        const imageUrls = [];
        try {
            console.log(cidnumber)

            const response = await axios.get(
                Constants.local_api_gateway_host + '/imageCID?cid=' + cidnumber,
            );
            imageUrls.push(response.data.presigned_url);
            // imagesData.push(String(response.data.presigned_url))
            setImagesData((prevData) => [...prevData, String(response.data.presigned_url)]);

            console.log(response.data);
        } catch (error) {
            console.error('Error fetching image:', error);
            throw error;
        }

    };

    const getThumnail = async (cidnumber: string) => {
        try {

            const response = await axios.get(
                Constants.local_api_gateway_host + '/imageCID?cid=' + cidnumber,
            );
            console.log(response)
            if(response.status==500){
                setThumbnail(defaulThumbnail)
            }
            else{

                setThumbnail(response.data.url);
            }
            setThumnailLoading(false);

        } catch (error) {
            console.error('Error fetching image:', error);
            setThumnailLoading(false);
            setThumbnail(defaulThumbnail);
            throw error;
        }

    }

    useEffect(() => {
        try {

            getThumnail(thumbnail_cid);

        } catch (error) {
            console.log(error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const openImageInNewTab = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div>

            <Container>
                <Col>
                    <Card >
                        {thumnailLoading ? (
                            <div className="text-center">
                                <Spinner animation="grow" />
                            </div>
                        ) : (
                            <img
                                src={thumbnail}
                                alt="Thumbnail"
                                className="card-img-top"
                            />
                        )}
                        <CardBody>
                            <Row>
                                <Col>
                                    {/* <h3 className="font-weight-bold text-md-left">WareHouse Chennai</h3>
                                    <p className="font-weight-normal text-sm-left mb-4 mb-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, voluptas quam dicta iusto, blanditiis</p> */}
                                    {/* <h6 className="text-truncate mb-4 mb-lg">Warehouse ID: {wh_id}</h6> */}
                                    <h6 className="text-truncate mb-3">Rent: {wh_rental_rate}</h6>
                                    <h6 className="text-truncate mb-4">Available Date:{wh_rental_available_date} </h6>
                                    <Button
                                        className="w-100"
                                        onClick={() => togglemodal(wh_id)}
                                    >
                                        View More Details
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                </Col>
                <Modal
                    isOpen={true}
                    role="dialog"
                    size="xl"
                    autoFocus={true}
                    centered
                    id="WhDetailsModal"
                    toggle={() => togglemodal(wh_id)}
                >
                    <div className="modal-content">
                        <ModalHeader toggle={() => togglemodal(wh_id)}>Details for Carriers</ModalHeader>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    {wh_id != null && wh_id != "" && (
                                        <div className="mt-3">
                                            <p className="text-muted m-b-15" >
                                                Warehouse ID : {wh_id}
                                            </p>
                                        </div>)}
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
                                    <br></br>
                                    <Button
                                        color="dark"
                                        className="btn btn-info"
                                    // onClick={togglemodal}
                                    >
                                        Book
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                    {wh_id != null && wh_id.trim() !== '' && (
                                        <Button
                                            color="warning"
                                            className="btn btn-info"
                                            onClick={toggleModalEnquiry}
                                        >
                                            Send Enquiry
                                        </Button>
                                    )}
                                </div>
                                <div className="col-md-6">

                                    <div className="col">
                                        <div className="row-lg-6">
                                            {imagesLoading ? (
                                                <div className="text-center">
                                                    <Spinner animation="grow" />
                                                </div>
                                            ) : (
                                                <ReactPhotoCollage {...setting} />
                                                // <ImageCarousal Images={imagesData} />
                                            )}
                                        </div>
                                        {/* <div className="row-lg-6">
                                            <p className="m-4 text-lg-start text-black">
Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio dicta voluptatum, sit autem assumenda, praesentium cum iusto rerum amet facere magnam pariatur vitae ipsum ex sequi nostrum doloremque saepe, velit numquam voluptatem aut rem suscipit? Quo, vitae. Maxime at voluptates nulla ea, delectus placeat, temporibus, voluptate cupiditate commodi dolore in.                                            </p>
                                        </div> */}
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* Email Enquiry Modal */}
                <Modal show={modalEnquiry} toggle={toggleModalEnquiry}  >
                    <ModalHeader toggle={toggleModalEnquiry}>Enquiry Form</ModalHeader>
                    <ModalBody>
                        <EnquiryForm
                            onSubmit={handleEnquiryFormSubmit}
                            userRole={"Owner"}
                            user_id={wh_id}
                        />
                    </ModalBody>
                </Modal>


                {/* Post Modal */}
                <Modal show={modal} size='xl' fullscreen={true} onHide={() => setModal(false)} scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title className="font-weight-bold">{warehouseBasicFields?.wh_name}
                        {/* <p>{warehouseBasicFields?.wh_address}</p> */}

                        </Modal.Title>
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
                                    {wh_id != null && wh_id.trim() !== '' && (

                                        <Button variant="outline-info" type="button" className="mt-3 w-100" onClick={toggleModalEnquiry}>
                                            Send Inquiry
                                        </Button>
                                    )}
                                        <div className="mt-3">
                                    <iframe
                                        width="100%"
                                        height="300"
                                        src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
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
                                                <td>{warehouseSpecificationFields?.wh_roof_height}</td>
                                                <td>Roof Type</td>
                                                <td>{warehouseSpecificationFields?.wh_roof_type}</td>
                                            </tr>
                                            <tr>
                                                <td>HVAC</td>
                                                <td>{warehouseSpecificationFields?.wh_hvac}</td>
                                                <td>Electrical</td>
                                                <td>{warehouseSpecificationFields?.wh_electrical}</td>
                                            </tr>
                                            <tr>
                                                <td>Flooring Type</td>
                                                <td>{warehouseSpecificationFields?.wh_flooring_type}</td>
                                                <td>Age</td>
                                                <td>{warehouseSpecificationFields?.wh_age}</td>
                                            </tr>
                                            <tr>
                                                <td>Loading Dock Count</td>
                                                <td>{warehouseSpecificationFields?.wh_loading_dock_count}</td>
                                                <td>Loading Dock Height</td>
                                                <td>{warehouseSpecificationFields?.wh_loading_dock_height}</td>
                                            </tr>
                                            <tr>
                                                <td>Loading Dock Size</td>
                                                <td>{warehouseSpecificationFields?.wh_loading_dock_size}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <br />
                                    <h3>Basic Details</h3>
                                    <Table >

                                        <tbody>
                                            <tr>
                                                <td>Space</td>
                                                <td>{warehouseBasicFields?.wh_total_space}</td>

                                                <td>Land Area</td>
                                                <td>{warehouseBasicFields?.wh_land_area}</td>
                                            </tr>
                                            <tr>
                                                <td>Type</td>
                                                <td>{warehouseBasicFields?.wh_type}</td>
                                            </tr>

                                        </tbody>

                                    </Table>
                                    <br />
                                    <h3>Description</h3>
                                    <p style={{ fontSize: "18px" }}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </p>
                                    <br />
                              
                                </Col>
                            </Col>
                        </Container>


                    </Modal.Body>
                </Modal>
            </Container>

        </div>
    );
};

export default GalleryComponent;
