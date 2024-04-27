
// @ts-nocheck
import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import {
    Button,
    Col,
    Container,
    FormGroup,
    Input,
    InputGroup,
    Label,
    Row,
    Modal
} from "reactstrap";
import Stepper from "react-stepper-horizontal";
import axios from 'axios';
import * as Constants from "../../utils/constants"
import { Web3Storage } from 'web3.storage'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';
import Carousel from 'react-bootstrap/Carousel';
import { toast } from 'react-toastify';
interface StorageCidItem {
    cid: string;
    wh_id: string;
    owner_entity_id: string;
    is_thumbnail: string;
    is_active: string;
    is_verified: string;
}

const HomePageModal = ({ Basic_Details }) => {

    const [step, setStep] = useState(0)
    const [warehouseFields, setWarehouseFields] = useState(Basic_Details);
    const [warehouseRentalFields, setWarehouseRentalFields] = useState();
    const [warehouseSpecificationFields, setWarehouseSpecificationFields] = useState();
    const steps = [
        {
            title: "Rental Details",
            onClick: () => {
                setStep(0);
                console.log('onClick', 0)
            }
        },
        {
            title: "Basic Details",
            onClick: () => {
                setStep(1);
                console.log('onClick', 1)
            }
        },
        {
            title: "Specification Details",
            onClick: () => {
                setStep(2);
                console.log('onClick', 2)

            }
        },

    ];
    const [storageCid, setStorageCid] = useState<StorageCidItem[]>([]);
    const [newCID, setDeletedCid] = useState<StorageCidItem[]>([]);
    const [imagesData, setImagesData] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [newImages, setNewImages] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [newImagesCID, setNewImagesCID] = useState([]);

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

    useEffect(() => {
        const warehouseId = warehouseFields.wh_id;

        Promise.all([getUserPostsRentalDetails(warehouseId), getUserPostsSpecificationDetails(warehouseId)])
            .then(() => {
            })
            .catch((error) => {
                console.error(error);
            });
        getUserImages(warehouseId)

    }, [])

    function makeStorageClient() {
        return new Web3Storage({ token: Constants.web3ApiToken });
    }

    const getImages = async (cidnumber: string) => {

        const imageUrls = [];
        try {
            console.log(cidnumber)

            const response = await axios.get(
                Constants.local_api_gateway_host + '/imageCID?cid=' + cidnumber,
            );
            imageUrls.push(response.data.presigned_url);
            imagesData.push(String(response.data.presigned_url))
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching image:', error);
            throw error;
        }
    };

    const getUserImages = async (id: string) => {
        console.log(id);
        try {
            const getRecords = async () => {
                const response = await axios.get(Constants.local_api_gateway_host + '/mediaStorageCID/?WH_ID=' + id + "&IS_ACTIVE=" +
                    Constants.isActive);
                const responseData = response.data.response as StorageCidItem[];
                setDeletedCid(responseData);
                if (responseData.length > 0) {
                    const imagePromises = responseData.map((record) => getImages(record.cid));

                    await Promise.all(imagePromises);

                    //const populatedPhotos = imagesData.map((url) => ({ source: url }));
                    // const formattedData = populatedPhotos.map(item => {
                    //     return {
                    //       source: `${item.source}`
                    //     };
                    //   });

                    // setting.photos = populatedPhotos;
                }
                console.log(imagesData)
                setImagesLoaded(true)

            }
            getRecords();
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setWarehouseFields(prev => ({
            ...prev,
            [name]: value
        }));
        setWarehouseRentalFields(prev => ({
            ...prev,
            [name]: value
        }));
        setWarehouseSpecificationFields(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>

            <div>
                {imagesLoaded && imagesData ? (
                    <Carousel>
                        {imagesData.map((url, index) => (
                            <Carousel.Item key={index}>
                                <img className="d-block w-100" src={url} alt={`Image ${index}`} />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <p>Loading images...</p>
                )}
            </div>

            {step !== 3 && (
                <Stepper steps={steps} activeStep={step} />
            )}

            <div>

                {/* wharehouse Rental Details */}
                {step === 0 &&
                    <>
                        <Row className='mt-5'>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Wharehouse Available Date</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Available Date"
                                        name='wh_rental_available_date'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_rental_available_date}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Min Lease</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Min Lease"
                                        name='wh_min_lease'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_min_lease}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Max Lease</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Max Lease"
                                        name='wh_max_lease'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_max_lease}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rental Rate Unit</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Rental Rate Unit"
                                        name='wh_rental_unit'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_rental_unit}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rental Rate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Rental Rate"
                                        name='wh_rental_rate'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_rental_rate}
                                        required={true}

                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Security Deposit</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Security Deposit"
                                        name='wh_security_deposit'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_security_deposit}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Lock In Period</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Lock In Period"
                                        name='wh_lock_in_period'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_lock_in_period}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rental Increment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Rental Increment"
                                        name='wh_rental_increment'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_rental_increment}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Notice Period</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Notice Period"
                                        name='wh_notice_period'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_notice_period}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rent Free Period</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Rent Free Period"
                                        name='wh_rent_free_period'
                                        onChange={handleChange}
                                        value={warehouseRentalFields?.wh_rent_free_period}
                                        required={true}

                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button
                            type="button"
                            className='m-2 btn btn-info'
                            onClick={() => setStep(step + 1)}
                        >
                            Next
                        </Button>
                    </>
                }

                {/* WHarehouse Basic Details */}
                {step === 1 &&
                    <>
                        <Row className='mt-5'>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Warehouse Name"
                                    name='wh_name'
                                    onChange={handleChange}
                                    value={warehouseFields?.wh_name}
                                    required={true}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Warehouse Address"
                                    name='wh_address'
                                    onChange={handleChange}
                                    value={warehouseFields?.wh_address}
                                    required={true}

                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Land Area</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Warehouse Land Area"
                                    name='wh_land_area'
                                    onChange={handleChange}
                                    value={warehouseFields?.wh_land_area}

                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Total Space</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Warehouse Total Space"
                                    name='wh_total_space'
                                    onChange={handleChange}
                                    value={warehouseFields?.wh_total_space}
                                    required={true}

                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Warehouse Type"
                                    name='wh_type'
                                    onChange={handleChange}
                                    value={warehouseFields?.wh_type}
                                    required={true}

                                />
                            </Form.Group>
                        </Row>

                        <Button
                            type="button"
                            className='m-2 btn btn-info'
                            onClick={() => setStep(step - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            type="button"
                            variant="success"
                            className='btn btn-info'
                            onClick={() => setStep(step + 1)}
                        >
                            Next
                        </Button>
                    </>
                }

                {/* Wharehouse Specification Details */}
                {step === 2 &&
                    <>
                        <Row className='mt-5'>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Roof Height</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Roof Height"
                                        name='wh_roof_height'
                                        onChange={handleChange}
                                        value={warehouseSpecificationFields?.wh_roof_height}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Roof Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Roof Type"
                                        name='wh_roof_type'
                                        onChange={handleChange}
                                        value={warehouseSpecificationFields?.wh_roof_type}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Electrical</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Electrical"
                                        name='wh_electrical'
                                        onChange={handleChange}
                                        value={warehouseSpecificationFields?.wh_electrical}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Flooring Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Flooring Type"
                                        name='wh_flooring_type'
                                        onChange={handleChange}
                                        value={warehouseSpecificationFields?.wh_flooring_type}
                                        required={true}

                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loading Dock Count</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Loading Dock Count"
                                        name='wh_loading_dock_count'
                                        onChange={handleChange}
                                        value={warehouseSpecificationFields?.wh_loading_dock_count}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loading Dock Height</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Loading Dock Count"
                                        name='wh_loading_dock_height'
                                        onChange={handleChange}
                                        value={warehouseSpecificationFields?.wh_loading_dock_height}
                                        required={true}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loading Dock Size</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Loading Dock Size"
                                        name='wh_loading_dock_size'
                                        onChange={handleChange}
                                        value={warehouseSpecificationFields?.wh_loading_dock_size}

                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Warehouse Age"
                                        name='wh_age'
                                        onChange={handleChange}
                                        value={warehouseSpecificationFields?.wh_age}
                                        required={true}

                                    />
                                </Form.Group>
                            </Col>


                        </Row>
                        <Button
                            type="button"
                            className='m-2 btn btn-info'
                            onClick={() => setStep(step - 1)}
                        >
                            Previous
                        </Button>
                    </>
                }

                {/* Images */}

            </div>

        </>
    )
}

export default HomePageModal
// {imagesData.map((url, index) => (
//     <div key={index}>
//         <img src={url} alt={`Image ${index}`} />
//     </div>
// ))}