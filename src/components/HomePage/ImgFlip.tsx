// @ts-nocheck
import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Card, CardBody, Container, Col, Row, Input, UncontrolledTooltip, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import "react-slideshow-image/dist/styles.css";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Web3Storage } from 'web3.storage'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as Constants from "../../utils/constants"
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { ReactPhotoCollage } from "react-photo-collage";
import { faK, faL } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import HomePageModal from "./form";
import { useAuth } from "../../contexts/UserContext";
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import styles from '../../styles/ImageFlip.module.css'
interface StorageCidItem {
    cid: string;
    wh_id: string;
    owner_entity_id: string;
    is_thumbnail: string;
    is_active: string;
    is_verified: string;
}

const defaulThumbnail = "https://images.unsplash.com/photo-1591795523670-5999e124d7d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";

const GalleryComponentOwnerViewOwnPost = ({ details }) => {

    const { currentUser } = useAuth();
    const router = useRouter();
    const [modal, setModal] = useState(false);
    const [data, setdata] = useState<{ img: string, i: number }>({ img: "", i: 0 });
    const [storageCid, setStorageCid] = useState<StorageCidItem[]>([]);
    const [thumnailLoading, setThumnailLoading] = useState(true);
    const [imagesLoading, setImagesLoading] = useState(true);
    const [thumbnail, setThumbnail] = useState<string>("");
    const [warehouseRentalFields, setWarehouseRentalFields] = useState({});
    const [warehouseSpecificationFields, setWarehouseSpecificationFields] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(true);


    const { wh_id, wh_name, wh_address, is_active, thumbnail_cid } = details;

    // console.log("GalleryComponent: " + details)


    const notifySuccess = (message: string) => toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    const notifyInfo = (message: string) => toast.info(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    const notifyError = (message: string) => toast.error(message, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });


    const togglemodal = () => {
        if (currentUser) {
            notifyError("Please Login to continue");
        }
        else {
            setModal(!modal);
        }
    };

    const getUserPostsRentalDetails = (id) => {
        return new Promise<void>((resolve, reject) => {
            axios
                .get(Constants.api_gateway_host + `/wh_rental_information/?WH_ID=${id}`)
                .then((response) => {
                    const userData = response.data;
                    console.log(userData.response[0]);
                    setWarehouseRentalFields(userData.response[0]);
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    const getUserPostsSpecificationDetails = (id) => {
        return new Promise<void>((resolve, reject) => {
            axios
                .get(Constants.api_gateway_host + `/wh_building_specification/?WH_ID=${id}`)
                .then((response) => {
                    const userData = response.data;
                    console.log(userData.response[0]);
                    setWarehouseSpecificationFields(userData.response[0]);
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };


    const getThumnail = async (cidnumber: string) => {
        try {
            console.log(cidnumber)
            
            const response = await axios.get(
                Constants.local_api_gateway_host + '/imageCID?cid=' + cidnumber,
            );
            // setThumbnail(response.data.url);
            console.log(response.data.url)
            setThumbnail(defaulThumbnail)
            // console.log(thumbnail)
            setThumnailLoading(false);

            console.log(response.data);
        } catch (error) {
            console.error('Error fetching image:', error);
            setThumnailLoading(false);
            setThumbnail(defaulThumbnail);
            throw error;
        }

    }

    useEffect(() => {
        getThumnail(thumbnail_cid);
    }, [])


    return (
        <div>

            {/* <div className="container" >
                <Col>
                    <Card style={{
                        backgroundColor: 'white'
                    }} >
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
                        <CardBody style={{ position: 'relative' }}>
                            <Row>
                                <Col
                                >
                                    <h6 style={{
                                        fontSize: is_active === 'True' || is_active === 'true' ? 'inherit bold' : '14px',
                                        color: is_active === 'True' || is_active === 'true' ? 'inherit' : 'white'
                                    }} className="text-truncate mb-4 mb-lg">Warehouse ID: {wh_id}</h6>
                                    <h6 style={{
                                        fontSize: is_active === 'True' || is_active === 'true' ? 'inherit bold' : '14px',
                                        color: is_active === 'True' || is_active === 'true' ? 'inherit' : 'white'
                                    }} className="text-truncate mb-4 mb-lg">Warehouse Name: {wh_name}</h6>
                                    <h6 style={{
                                        fontSize: is_active === 'True' || is_active === 'true' ? 'inherit bold' : '14px',
                                        color: is_active === 'True' || is_active === 'true' ? 'inherit' : 'white'
                                    }} className="text-truncate mb-4 mb-lg">Warehouse Address:{wh_address} </h6>
                                    
                                    <Button
                                        color="light"
                                        className="btn btn-outline-primary btn-sm"
                                        // onClick={() => togglemodal()}
                                        // onClick={() => {notifyInfo("Login to Continue");router.push("/login");}}
                                    >
                                        View More Details
                                    </Button>
                                </Col>
                               
                            </Row>
                        </CardBody>

                    </Card>

                </Col>
                <Modal
                    isOpen={modal}
                    role="dialog"
                    size="xl"
                    // fullscreen={true}
                    autoFocus={true}
                    centered
                    id="WhDetailsModal"
                    toggle={() => togglemodal()}
                >
                    <div className="modal-content">
                        <ModalHeader>Details</ModalHeader>
                        <div className="modal-body">
                            <div className="row">
                                <HomePageModal
                                    Basic_Details={details}
                                    // Rental_Details={warehouseRentalFields}
                                    // Specification_Details={warehouseSpecificationFields}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div> */}
            <div className={`${styles.flip_card}`}>
                <div className={`${styles.flip_card_inner}`}>
                    <div className={`${styles.flip_card_front}`}>
                        {thumnailLoading ? (
                            <div className="d-flex justify-content-center align-items-center w-100 h-100">
                                <Spinner animation="border" variant="light" />
                            </div>
                        ) : (
                            <img
                                src={thumbnail}
                                alt="Thumbnail"
                                className=""
                                style={{ borderRadius:"20px",height:"100%"}}
                            />
                        )}
                    </div>
                    <div className={`${styles.flip_card_back}`}>
                        <h1 className="text-black">Warehouse ID: {wh_id}</h1>
                        <p><span className="fw-bold">Warehouse Name:</span> {wh_name}</p>
                        <p><span className="fw-bold">Warehouse Address:</span> {wh_address}</p>
                    </div>
                </div>
            </div>
            

        </div>
    );
};

export default GalleryComponentOwnerViewOwnPost;
