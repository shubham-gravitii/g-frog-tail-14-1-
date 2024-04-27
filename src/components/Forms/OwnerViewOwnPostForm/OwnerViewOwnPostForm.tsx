/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
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
import * as Constants from "../../../utils/constants"
import { Web3Storage } from 'web3.storage'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';
import Carousel from 'react-bootstrap/Carousel';
import ImageUpload from '../../ImageEditor/index';
import { toast } from 'react-toastify';
import Overlays from '../../../components/Overlays'

interface StorageCidItem {
    cid: string;
    wh_id: string;
    owner_entity_id: string;
    is_thumbnail: string;
    is_active: string;
    is_verified: string;
}
import Client from "./Client"
const OwnerViewOwnPostForm = ({ Basic_Details }) => {

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
        {
            title: "Image Details",
            onClick: () => {
                setStep(3);
                console.log('onClick', 3)

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
                .get(Constants.local_api_gateway_host + `/rentalDetails/?WH_ID=${id}`)
                .then((response) => {
                    const userData = response.data;
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
                .get(Constants.local_api_gateway_host + `/specificationDetails/?WH_ID=${id}`)
                .then((response) => {
                    const userData = response.data;
                    setWarehouseSpecificationFields(userData.response[0]);
                    resolve();
                })
                .catch((error) => {
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
            imageUrls.push(response.data.url);
            imagesData.push(String(response.data.url))
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

    const handleGeocoordinates=(lat,long)=>{
        const Lat=parseFloat(lat);
        const Long=parseFloat(long);
        setWarehouseFields((prev) => ({
            ...prev,
            "wh_gps_coordinates":`${Long} ${Lat}`,
            "latitude":Lat,
            "longitude":Long
        }));
        setTimeout(()=>console.table(warehouseFields),3000);
        
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

    const handleSetImagesData = (newValue: any) => {
        setImagesData(newValue);
        console.log(imagesData)
    }

    const handleSetNewImagesData = (newValue: any) => {
        setNewImages(newValue);
        console.log(newImages)

    }

    const handleSetFileListData = (newValue: any) => {
        setFileList(newValue);
        console.log(fileList)

    }

    const handleSetDeletedCidData = (newValue: any) => {
        setDeletedCid(newValue);
    }

    const imageUploadBackend = async (compressedFile) => {
        try {
            console.log(compressedFile)
            const formData = new FormData();
            formData.append('file', compressedFile);

            const response = await axios.post(
                Constants.local_api_gateway_host + '/imageCID',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: '*/*',
                    },
                }
            );

            return response.data.cid;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const storeImageDetailsAWS = async (cid) => {
        const { wh_id, owner_entity_id } = warehouseFields;

        const article = { title: "React POST Request Example" };

        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };

        try {

            const updatedImageDetails = "CID=" + cid + "&WH_ID="
                + wh_id + "&OWNER_ENTITY_ID=" + owner_entity_id
                + "&IS_THUMBNAIL=" + "true" + "&IS_ACTIVE=" +
                Constants.isActive + "&IS_VERIFIED=" + Constants.isVerified;

            console.log(updatedImageDetails)
            const response = await axios.post(
                Constants.local_api_gateway_host + '/mediaStorageCID/?' + updatedImageDetails,
                article,
                {
                    headers,
                }
            );
            if (response.status === 200) {
                console.log('Image details stored successfully:', response.data);
                return response.data; // You can return the response if needed
            } else {
                console.error('Error storing image details');
                return Promise.reject('Error storing image details');
            }
        } catch (error) {
            console.error('Error storing image details:', error);
        }
    };

    const compressAndUploadImages = async () => {
        const newCids = [];
        console.log(newImages);

        for (const selectedImage of newImages) {
            if (selectedImage) {
                try {
                    const formData = new FormData();
                    formData.append('image', selectedImage);

                    const response = await fetch('http://localhost:3001/api/compress-images', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const blob = await response.blob();

                        const compressedFile = new File([blob], selectedImage.name);

                        const cid = await imageUploadBackend(compressedFile)
                        await storeImageDetailsAWS(cid);

                        newCids.push(cid);

                        console.log("Uploaded to Web3 Storage:", cid);
                    } else {
                        console.error('Error uploading image');
                        return Promise.reject('Error uploading image');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    notifyError("Error updating warehouse data")

                    return;
                }
            }
        }


        notifySuccess("Your details are updated, refresh to see changes");

        setNewImagesCID(newCids);
        console.log(newImagesCID);
    };

    const deleteImages = (cid) => {

        const article = { title: "React POST Request Example" };

        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };

        return new Promise((resolve, reject) => {
            axios
                .put(Constants.local_api_gateway_host + '/mediaStorageCID/?CID=' + cid + "&IS_ACTIVE=" +
                    "False", article,
                    {
                        headers,
                    })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const handleSubmit = (e) => {
        console.log(warehouseFields.wh_gps_coordinates);
        e.preventDefault();
        notifyInfo("Your Details will be updated soon")
        const deletedCid = imagesData.filter(url => !newCID.some(obj => obj.url === url));

        console.log("Form Submitted")
        console.log(warehouseFields)
        console.log(warehouseRentalFields)
        console.log(warehouseSpecificationFields)
        console.log(imagesData)
        console.log(newImages)
        console.log(newCID)
        console.log(deletedCid)
        let coordinates = warehouseFields.wh_gps_coordinates.split(" ");
        warehouseFields.latitude = coordinates[1];
        warehouseFields.longitude = coordinates[0];

        try {
            compressAndUploadImages();

            const article = { title: "React PUT Request Example" };

            const headers = {
                Authorization: "Bearer mytoken",
                accept: "application/json",
            };
            const warehouseId = warehouseFields.wh_id;

            const updatedBasicDetails = "&WH_NAME=" + warehouseFields.wh_name + "&WH_TOTAL_SPACE=" + warehouseFields.wh_total_space + "&WH_LAND_AREA="
                + warehouseFields.wh_land_area + "&WH_ADDRESS=" + warehouseFields.wh_address + "&latitude=" + warehouseFields.latitude + "&longitude=" + warehouseFields.longitude
                + "&WH_TYPE=" + warehouseFields.wh_type+"&WH_GPS_COORDINATES="+warehouseFields.wh_gps_coordinates;

            const updatedRentalDetails = "&WBH_RENTAL_AVAILABLE_DATE=" + warehouseRentalFields.wh_rental_available_date + "&WH_MIN_LEASE=" + warehouseRentalFields.wh_min_lease
                + "&WH_MAX_LEASE=" + warehouseRentalFields.wh_max_lease + "&WH_RENTAL_RATE=" + warehouseRentalFields.wh_rental_rate
                + "&WH_RENTAL_UNIT=" + warehouseRentalFields.wh_rental_unit + "&WH_SECURITY_DEPOSIT=" + warehouseRentalFields.wh_security_deposit
                + "&WH_LOCK_IN_PERIOD=" + warehouseRentalFields.wh_lock_in_period + "&WH_RENTAL_INCREMENT=" + warehouseRentalFields.wh_rental_increment
                + "&WH_NOTICE_PERIOD=" + warehouseRentalFields.wh_notice_period + "&WH_RENT_FREE_PERIOD=" + warehouseRentalFields.wh_rent_free_period;

            const updatedSpecificationDetails = "&WH_ROOF_HEIGHT=" + warehouseSpecificationFields.wh_roof_height + "&WH_ROOF_TYPE=" + warehouseSpecificationFields.wh_roof_type
                + "&WH_ELECTRICAL=" + warehouseSpecificationFields.wh_electrical + "&WH_FLOORING_TYPE=" + warehouseSpecificationFields.wh_flooring_type
                + "&WH_LOADING_DOCK_COUNT=" + warehouseSpecificationFields.wh_loading_dock_count + "&WH_LOADING_DOCK_HEIGHT=" + warehouseSpecificationFields.wh_loading_dock_height
                + "&WH_LOADING_DOCK_SIZE=" + warehouseSpecificationFields.wh_loading_dock_size + "&WH_AGE=" + warehouseSpecificationFields.wh_age
                + "&WH_HVAC=" + warehouseSpecificationFields.wh_hvac;

                console.log(updatedBasicDetails);
                const requests = [
                    axios.put(Constants.local_api_gateway_host + "/basicDetails/?WH_ID=" + warehouseId + updatedBasicDetails, article,
                        {
                            headers,
                        }),
                    axios.put(Constants.local_api_gateway_host + "/rentalDetails/?WH_RENTAL_ID=" + warehouseRentalFields.wh_rental_id + updatedRentalDetails, article,
                        {
                            headers,
                        }),
                    axios.put(Constants.local_api_gateway_host + "/specificationDetails/?WH_ID=" + warehouseId + updatedSpecificationDetails, article,
                        {
                            headers,
                        }),
                ];
            if (deletedCid.length > 0) {
                const cidRegex = /https:\/\/ipfs\.io\/ipfs\/([^/]+)\//;

                for (const url of deletedCid) {
                    //This is to extract CID from each URL for API Deletion call
                    const match = url.match(cidRegex);
                    if (match) {
                        const cid = match[1];
                        console.log(cid)
                        requests.push(deleteImages(cid));
                    }
                    console.log(url)
                }
            }
            console.log(requests)

            Promise.all(requests)
                .then(responses => {
                    console.log('Warehouse data updated successfully');
                })
                .catch(error => {
                    notifyError("Error updating warehouse data")
                    console.error('Error updating warehouse data:', error);
                });

        } catch (error) {
            console.log(error);
        }

    }


    const openImageInNewTab = (url) => {
        window.open(url, '_blank');
    };


    return (
        <>

            <div>
                {imagesLoaded && imagesData ? (
                    <Carousel>
                        {imagesData.map((url, index) => (



                            <Carousel.Item onClick={() => openImageInNewTab(url)} key={index} style={{ cursor: 'pointer' }}>
                                <img className="d-block w-100" src={url} alt={`Image ${index}`}
                                />
                            </Carousel.Item>

                        ))}
                    </Carousel>
                ) : (
                    <p>Loading images...</p>
                )}
            </div>

            {step !== 4 && (
                <Stepper steps={steps} activeStep={step} />
            )}

            <Form onSubmit={handleSubmit}>

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
                                <Form.Label>Warehouse Address</Form.Label>
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
                               <Form.Label>Warehouse Location <Overlays message={"Mark position on map to help us locate you.Green(previous location) and blue(position to be changed)"}/></Form.Label>
                               <Client handleGeocoordinates={handleGeocoordinates} GPS={warehouseFields?.wh_gps_coordinates}/>
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
                        <Button
                            type="button"
                            className='m-2 btn btn-info'
                            onClick={() => setStep(step + 1)}
                        >
                            Next
                        </Button>
                    </>
                }

                {/* Images */}
                {step === 3 &&
                    <>
                        <Row className='mt-5'>
                            {
                                imagesData && <ImageUpload
                                    ImagesData={imagesData}
                                    setFileListState={handleSetFileListData}
                                    setNewImageState={handleSetNewImagesData}
                                    setDeletedImageState={handleSetDeletedCidData}
                                />

                            }
                        </Row>
                        <Button
                            type="button"
                            className='m-2 btn btn-info'
                            onClick={() => setStep(step - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            type="submit"
                            className='m-2 btn btn-success '
                        >
                            Submit
                        </Button>
                    </>
                }
            </Form>

        </>
    )
}

export default OwnerViewOwnPostForm
// {imagesData.map((url, index) => (
//     <div key={index}>
//         <img src={url} alt={`Image ${index}`} />
//     </div>
// ))}