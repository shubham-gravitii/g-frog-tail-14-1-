
// @ts-nocheck
'use client'
import React, { useState, useEffect, useContext } from 'react'
import FormData from 'form-data'
import Form from 'react-bootstrap/Form';
import Overlays from '../../Overlays'
import Button1 from 'react-bootstrap/Button';
import LoadingContext from '../../../contexts/LoadingContext'
import {
    Button,
    Col,
    Container,
    Row,
    InputGroup,
    Label
} from "reactstrap";
import Select from 'react-select';
import { UniqueID } from '../../../utils/uuidGenerate';
import { TS } from '../../../utils/currentTimestamp';
import Stepper from "react-stepper-horizontal";
import axios from 'axios';
import * as Constants from "../../../utils/constants"
import { Web3Storage } from 'web3.storage'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageUpload from '../../ImageEditor/index';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/UserContext';
import Client from './MapForOwner/ClientMap';
import { useRouter } from "next/navigation";
import ReactLoading from 'react-loading';
import { makePostRequest } from '../../../utils/apiConstant/apiConstant';
import { tableNames } from "../../../utils/apiConstant/apiTablesNames"
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import makeAnimated from 'react-select/animated';
import { da, fi } from 'date-fns/locale';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
const animatedComponents = makeAnimated();


interface StorageCidItem {
    cid: string;
    wh_id: string;
    owner_entity_id: string;
    is_thumbnail: string;
    is_active: string;
    is_verified: string;
}

const NewPostOwner = () => {
    const { setloading } = useContext(LoadingContext)
    const { currentUser } = useAuth()
    const router = useRouter();
    const [dataFromMaps, setdataFromMaps] = useState({});
    const [basicDetailsPaginationId, setBasicDetailsPaginationId] = useState()
    const [rentalDetailsPaginationId, setRentalDetailsPaginationId] = useState()
    const [specificationDetailsPaginationId, setSpecificationDetailsPaginationId] = useState()
    const [userExistsDB, setUserExistsDB] = useState(false);

    const [maxDuration, setmaxDuration] = useState({
        "duration": "",
        "Unit": ""
    })
    const [minDuration, setminDuration] = useState({
        "duration": "",
        "Unit": ""
    })
    const [noticePeriod, setnoticePeriod] = useState({
        "duration": "",
        "Unit": ""
    })
    const userData = router.query?.data;                                  //accessing data from map
    const lattitude = userData ? JSON.parse(userData).lat : null;
    const longitude = userData ? JSON.parse(userData).lng : null;
    const [ownerDetail, setOwnerDetails] = useState({})
    const [locationText, setlocationText] = useState("")
    const [warehouseFields, setWarehouseFields] = useState({
        "wh_id": UniqueID("WhId"),
        "wh_id_created_timestamp": TS(),
        "wh_name": "",
        "wh_address": "",
        "latitude": "",
        "longitude": "",
        "wh_type": "",
        "wh_total_space": "",
        // "wh_land_area": "",
        "owner_entity_id": currentUser?.userID,
        "is_active": Constants.isActive,
        "is_verified": Constants.isVerified,
        "pagination_id": basicDetailsPaginationId,
        "thumbnail_cid": ""
    });
    const [warehouseRentalFields, setWarehouseRentalFields] = useState({
        "wh_rental_id": UniqueID("RentalId"),
        "wh_rental_id_created_timestamp": TS(),
        "wh_rental_available_date": "",
        "wh_min_lease": "",
        "wh_max_lease": "",
        "wh_rental_rate": "",
        "wh_rental_unit": "Indian Rupees",
        "wh_security_deposit": "",
        "wh_lock_in_period": "",
        "wh_rental_increment": "",
        "wh_notice_period": "",
        "wh_area_offered": "",
        "wh_rent_free_period": "NULL",
        "wh_id": "",
        "thumbnail_cid": "",
        "is_active": Constants.isActive,
        "is_verified": Constants.isVerified,
        "pagination_id": rentalDetailsPaginationId
    });
    const [warehouseSpecificationFields, setWarehouseSpecificationFields] = useState({
        "wh_roof_height": "",
        "wh_roof_type": "",
        "wh_hvac": "",
        "wh_electrical": "",
        "wh_flooring_type": "",
        "wh_loading_dock_count": "",
        "wh_loading_dock_height": "NULL",
        "wh_age": "",
        "wh_loading_dock_size": "",
        "is_active": Constants.isActive,
        "is_verified": Constants.isVerified,
        "wh_id": "",
        "thumbnail_cid": "",
        "pagination_id": specificationDetailsPaginationId
    });
    const [loadingDockDimensions, setLoadingDockDimensions] = useState({
        "Length": "",
        "Bredth": "",
        "Height": "",
        "Unit": ""

    })

    useEffect(() => {
        setWarehouseRentalFields((prev) => ({ ...prev, ['wh_max_lease']: maxDuration }))
        console.log(maxDuration)
        console.log(warehouseRentalFields)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxDuration])
    useEffect(() => {
        setWarehouseRentalFields((prev) => ({ ...prev, ['wh_min_lease']: minDuration }))
        console.log(minDuration)
        console.log(warehouseRentalFields)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minDuration])
    useEffect(() => {

        setWarehouseRentalFields((prev) => ({ ...prev, ['wh_notice_period']: noticePeriod }))
        console.log(noticePeriod)
        console.log(warehouseRentalFields)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noticePeriod])

    useEffect(() => {
        console.clear();
        setWarehouseFields((prev) => ({
            ...prev,
            "wh_gps_coordinates": `${longitude} ${lattitude}`,
            "longitude": `${longitude}`,
            "latitude": `${lattitude}`,
        }));
        // console.log(lattitude);
        // console.log(longitude);

    }, [lattitude, longitude]);

    const [landAreaUnit, setLandAreaUnit] = useState('');
    const [totalSpaceUnit, setTotalSpaceUnit] = useState('');
    const [specRoofHeight, setSpecRoofHeight] = useState('');
    const [specRoofType, setSpecRoofType] = useState('');
    // const [specAge, setSpecAge] = useState('');
    const [step, setStep] = useState(0)
    const [imagesData, setImagesData] = useState([]);
    const [newCID, setDeletedCid] = useState<StorageCidItem[]>([]);
    const [newImages, setNewImages] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [newImagesCID, setNewImagesCID] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalSpaceUnitParent, settotalSpaceUnitParent] = useState({

    })
    const durationUnit = [
        { value: "Day", name: 'Unit', label: "Day" },
        { value: "Month", name: 'Unit', label: "Month" },
        { value: "Year", name: 'Unit', label: "Year" },
    ]
    const WarehouseTypes = [
        { value: 'Government', name: 'Government', label: 'Government' },
        { value: 'Private', name: 'Private', label: 'Private' },
        { value: 'Open Land', name: 'Open Land', label: 'Open Land' },
        { value: 'Tarped', name: 'Tarped', label: 'Tarped' },
        { value: 'Certified Warehouse', name: 'Certified Warehouse', label: 'Certified Warehouse' },
        { value: 'Others', name: 'Others', label: 'Others' },
    ];

    const RentalPeriods = [
        { value: '1 month', name: '1 month', label: '1 month' },
        { value: '3 Months', name: '3 Months', label: '3 Months' },
        { value: '6 Months', name: '6 Months', label: '6 Months' },
        { value: '1 Year', name: '1 Year', label: '1 Year' },
        { value: 'More then a year', name: 'More then a year', label: 'More then a year' },

    ];
    const LockInPeriod = [
        { value: 'Yes', name: 'Yes', label: "Yes" },
        { value: 'No', name: 'No', label: "No" }
    ]
    const WarehouseAreaOffered = [

        { value: "FULL", name: "FULL", label: "FULL" },
        { value: "PARTIAL", name: "PARTIAL", label: "PARTIAL" }
    ]

    const RentalUnits = [
        { value: 'Indian Rupees', name: 'Indian Rupees', label: 'Indian Rupees' },
    ];

    const SpecificationRoofHeight = [
        { value: 'Meters', name: 'Meters', label: 'Meters' },
        { value: 'Feet', name: 'Feet', label: 'Feet' },
        { value: 'Yards', name: 'Yards', label: 'Yards' },
    ];
    const SpecificationLoadingDockDimentions = [
        { value: 'Meters', name: 'Unit', label: 'Meters' },
        { value: 'Feet', name: 'Unit', label: 'Feet' },
        { value: 'Yards', name: 'Unit', label: 'Yards' },
    ];

    const SpecificationRoofType = [
        { value: 'Flat roof', name: 'Flat roof', label: 'Flat roof' },
        { value: 'Hip roof', name: 'Hip roof', label: 'Hip roof' },
        { value: 'Metal roofing', name: 'Metal roofing', label: 'Metal roofingf' },
        { value: 'Others', name: 'Others', label: 'Others' },
    ];

    const SpecificationAge = [
        { value: '1 Month', name: '1 Month', label: '1 Month' },
        { value: '3 Months', name: '3 Months', label: '3 Months' },
        { value: '6 Months', name: '6 Months', label: '6 Months' },
        { value: '1 year', name: '1 year', label: '1 year' },
        { value: 'More then a year', name: 'More then a year', label: 'More then a year' },

    ];
    const WarehouseAge = [
        { value: 'less than a year', name: 'less than a year', label: 'less than a year' },
        { value: '1 to 5 years', name: '1 to 5 years', label: '1 to 5 years' },
        { value: '5 to 10 years', name: '5 to 10 years', label: '5 to 10 years' },
        { value: '10 to 15 years', name: '10 to 15 years', label: '10 to 15 years' },
        { value: '15 to 20 years', name: '15 to 20 years', label: '15 to 20 years' },
        { value: 'More than 20 years', name: 'More than 20 years', label: 'More than 20 years' },

    ];

    const steps = [
        {
            title: "Basic Details",
            onClick: () => {
                setStep(0);
                console.log('onClick', 0)
            }
        },
        {
            title: "Rental Details",
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

    const getOwnerDetails = (id) => {

        return new Promise<void>((resolve, reject) => {
            axios
                .get(Constants.local_api_gateway_host + `/ownerDetails?OWNER_ENTITY_ID=${id}`)
                .then((response) => {
                    const userExists = response.data.response.response.length > 0;
                    const data = response.data.response.response
                    console.log(data)
                    setUserExistsDB(userExists)
                    setOwnerDetails(prevUser => ({
                        ...prevUser,
                        ...data[0]
                    }));
                    // if (!userExists) {
                    //     notifyInfo("PLease complete your profile before creating a post")
                    // }
                    resolve();
                    console.log(data[0])
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    const getBasicDetailRecordsSize = async () => {
        try {
            const res = await axios.get(Constants.local_api_gateway_host + '/basicDetailsSize/');
            const data = await res.data;
            const wh_basic_details_data_count = data.response[0].count;
            console.log(wh_basic_details_data_count)
            setBasicDetailsPaginationId(wh_basic_details_data_count);
            console.log(basicDetailsPaginationId)
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const getRentalDetailRecordsSize = async () => {
        try {
            const res = await axios.get(Constants.local_api_gateway_host + '/rentalDetailsSize/');
            const data = await res.data;
            console.log("rental detail size")
            console.log(data)
            const wh_rental_details_data_count = data.response[0].count;
            console.log(wh_rental_details_data_count)
            setRentalDetailsPaginationId(wh_rental_details_data_count)
            console.log(rentalDetailsPaginationId)
        } catch (error) {
            console.error("Error fetching data: ", error);
        }


    }

    const getSpecificationDetailRecordsSize = async () => {
        try {
            const res = await axios.get(Constants.local_api_gateway_host + '/specificationDetailsSize/');

            const data = await res.data.response;
            console.log("getSpecificationDetails")
            console.log(data)
            const wh_specification_details_data_count = data.response[0].count;
            console.log(wh_specification_details_data_count)
            setSpecificationDetailsPaginationId(wh_specification_details_data_count)
            console.log(specificationDetailsPaginationId)
        } catch (error) {
            console.error("Error fetching data: ", error);
        }


    }

    const checkAllDetailsOfOwner = () => {
        // Exclude the 'is_active', 'is_verified', and 'username' fields from the check
        const fieldsToCheck = { ...ownerDetail };
        delete fieldsToCheck.is_active;
        delete fieldsToCheck.is_verified;

        // Check if all fields are filled
        console.log(fieldsToCheck)
        const allFieldsFilled = Object.entries(fieldsToCheck).every(([key, value]) => {
            const isFilled = value !== '' && value !== null && value !== undefined;
            if (!isFilled) {
                console.log(`Field ${key} is not filled:`, value);
            }
            return isFilled;
        });

        return allFieldsFilled;
    };

    useEffect(() => {
        const allFieldsFilled = checkAllDetailsOfOwner();
        if (!allFieldsFilled) {
            setUserExistsDB(false);
            notifyInfo("Please complete your profile before creating a post");
        } else {
            setUserExistsDB(true);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerDetail]);

    // useEffect(() => {
    //     // Assuming setloading is a state updater function for loading state

    //     // setloading(true); // If you're managing loading state, uncomment this line

    //     const fetchData = async () => {
    //         try {
    //             //To check if user Exists
    //             const id = currentUser.userID;
    //             // await getOwnerDetails(id);

    //             // //To set the pagination Id we need to fetch the size of table
    //             // await getRentalDetailRecordsSize();
    //             // await getBasicDetailRecordsSize();
    //             // await getSpecificationDetailRecordsSize();

    //             // setloading(false); // If you're managing loading state, uncomment this line
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             // Handle error appropriately, e.g., set error state or display an error message
    //         }
    //     };

    //     fetchData();


    // }, []);
    useEffect(() => {
        // setloading(true)
        try {
            //To check if user Exists
            const fetchOwnerDetails = async () => {
                const id = currentUser.userID
                await getOwnerDetails(id);
            }
            fetchOwnerDetails();


            //To set the pagination Id we need to fetch the size of table
            getRentalDetailRecordsSize();
            getBasicDetailRecordsSize();
            getSpecificationDetailRecordsSize();
        } catch (error) {
            console.log(error)
        }
        // setloading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleBasicWarehouseChange = (e: any) => {
        const { name, value } = e.target;
        setWarehouseFields(prev => ({
            ...prev,
            [name]: value
        }));
        console.log(warehouseFields);
    };

    const handleRentalWarehouseChange = (e: any) => {
        const { name, value } = e.target;

        setWarehouseRentalFields(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSpecificationWarehouseChange = (e: any) => {
        const { name, value } = e.target;
        setLoadingDockDimensions(prev => ({ ...prev, [name]: value }))
        setWarehouseSpecificationFields(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleLoadingDockDimensions = (e: any) => {
        // console.log(e)
        const { name, value } = e.target;
        setLoadingDockDimensions(prev => ({ ...prev, [name]: value }))
        // console.log(loadingDockDimensions)

    };
    const handleLoadingDockDimensionsUnit = (e: any) => {
        setLoadingDockDimensions(prev => ({ ...prev, [e.name]: e.value }));
    }
    useEffect(() => {
        setWarehouseSpecificationFields(prev => ({
            ...prev,
            "wh_loading_dock_size": loadingDockDimensions
        }));
        // console.log(warehouseSpecificationFields)
        // console.log(loadingDockDimensions)
    }, [loadingDockDimensions])


    const units = [
        { value: 'sqm', label: 'Square meters' },
        { value: 'sqft', label: 'Square feet' },
        { value: 'acre', label: 'Acres' },
        { value: 'hectare', label: 'Hectares' },
    ];

    const handleLandAreaUnitChange = (unit) => {
        setLandAreaUnit(unit.value);
    };

    const handleTotalSpaceUnitChange = (unit) => {
        setTotalSpaceUnit(unit);
    };

    //Images Processing Section

    const imageUploadBackend = async (compressedFile,fileExtension) => {
        try {
            console.log(compressedFile)
            const formData = new FormData();
            formData.append('file', compressedFile);

            const response = await axios.post(
                Constants.local_api_gateway_host + '/imageCID/?fileExtension='+fileExtension,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: '*/*',
                    },
                }
            );
            console.log("image cid response")
            console.log(response)
            return response.data.res;
        } catch (error) {
            console.error('Error uploading image:', error.message);
            throw error;
        }
    };
    // const imageUploadBackend = async (compressedFile, fileType) => {
    //     try {
    //         console.log(compressedFile);
    //         const formData = new FormData();
    
    //         let filename = 'filename'; // Default filename
    //         let mimeType = 'application/octet-stream'; // Default MIME type
    
    //         // Set filename and MIME type based on the provided fileType
    //         if (fileType === 'png') {
    //             filename += '.png';
    //             mimeType = 'image/png';
    //         } else if (fileType === 'jpeg' || fileType === 'jpg') {
    //             filename += '.jpg';
    //             mimeType = 'image/jpeg';
    //         }
    
    //         if (typeof compressedFile === 'string') {
    //             // Convert from Base64 to Blob if compressedFile is a Base64 string
    //             const byteCharacters = atob(compressedFile);
    //             const byteNumbers = new Array(byteCharacters.length);
    //             for (let i = 0; i < byteCharacters.length; i++) {
    //                 byteNumbers[i] = byteCharacters.charCodeAt(i);
    //             }
    //             const byteArray = new Uint8Array(byteNumbers);
    //             const blob = new Blob([byteArray], { type: mimeType });
    
    //             formData.append('file', blob, filename);
    //         } else {
    //             // If compressedFile is already a Buffer or Blob
    //             formData.append('file', compressedFile, filename);
    //         }
    
    //         const response = await axios.post(
    //             Constants.local_api_gateway_host + '/imageCID',
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                     Accept: '/',
    //                 },
    //             }
    //         );
    
    //         console.log("image cid response");
    //         console.log(response);
    //         return response.data.res;
    //     } catch (error) {
    //         console.error('Error uploading image:', error.message);
    //         throw error;
    //     }
    // };

    const storeImageDetailsWeb3 = async (cid) => {
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
    function getExtension(filename) {
        return filename.split('.').pop()
      }
    const compressAndUploadImages = async () => {
        const newCids = [];
        console.log("compressAndUpload")
        console.log(newImages);

        for (const selectedImage of newImages) {
            if (selectedImage) {
                try {
                    console.log("Try")
                    console.log(selectedImage)
                    const formData = new FormData();
                    formData.append('image', selectedImage);
                    const response = await fetch(Constants.local_api_gateway_host + '/compressImages', {
                        method: 'POST',
                        body: formData,
                    });
                    const fileExtension=getExtension(selectedImage["name"]);

                    // const data=await response.json();

                    console.log("TryResponse")
                    console.log(response)
                    // console.log(data)
                    if (response.ok) {
                        const blob = await response.blob();
                        
                        const compressedFile = new File([blob], selectedImage.name);
                        // const compressedFile=response.data
                        console.log("blob")
                        // console.log(blob)
                        console.log(compressedFile)
                        // const client = makeStorageClient();
                        const cid = await imageUploadBackend(compressedFile,fileExtension);
                        console.log("Compressed image cid")
                        console.log(cid)
                        // await storeImageDetailsWeb3(cid);

                        newCids.push(cid);

                        console.log("Uploaded to AWS Storage:", cid);
                    } else {
                        console.error('Error uploading image');
                        return Promise.reject('Error uploading image');
                    }
                } catch (error) {
                    console.error('Error uploading the image:', error);
                    notifyError("Error updating warehouse data")

                    return;
                }
            }
        }
        notifySuccess("Your details are added");
        setNewImagesCID(newCids);
        console.log(newCids)
        console.log(newImagesCID);
        return newCids
    }

    const handleSetFileListData = (newValue: any) => {
        setFileList(newValue);
        console.log(fileList)
    }

    const handleSetNewImagesData = (newValue: any) => {
        setNewImages(newValue);
        console.log(newImages)
    }

    const handleSetDeletedCidData = (newValue: any) => {
        setDeletedCid(newValue);
    }

    const imageUploadDatabase = (cid, isThumbnail) => {
        const article = { title: "React POST Request Example" };

        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };

        console.log(isThumbnail);

        return new Promise((resolve, reject) => {
            axios
                .post(
                    Constants.local_api_gateway_host +
                    "/mediaStorageCID/?CID=" +
                    cid +
                    "&WH_ID=" +
                    warehouseFields.wh_id +
                    "&OWNER_ENTITY_ID=" +
                    warehouseFields.owner_entity_id +
                    "&IS_THUMBNAIL=" +
                    isThumbnail +
                    "&IS_VERIFIED=" +
                    Constants.isVerified +
                    "&IS_ACTIVE=" +
                    Constants.isActive,
                    article,
                    {
                        headers,
                    }
                )
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };


    const getEmptyFields = (fields, optionalFields = []) => {
        const emptyFields = [];

        for (const key in fields) {
            if (!optionalFields.includes(key) && !fields[key]) {
                emptyFields.push(key);
            }
        }

        return emptyFields;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        console.log("Form Submitted")

        // Basic Details
        warehouseFields.pagination_id = basicDetailsPaginationId;
        if (warehouseFields.wh_land_area) {
            warehouseFields.wh_land_area = warehouseFields.wh_land_area + ' ' + landAreaUnit;
        }
        if (warehouseFields.wh_total_space) {
            warehouseFields.wh_total_space = warehouseFields.wh_total_space + ' ' + totalSpaceUnit.value;
        }

        //Rental Details
        warehouseRentalFields.pagination_id = rentalDetailsPaginationId
        warehouseRentalFields.wh_id = warehouseFields.wh_id

        //Specification Details
        warehouseSpecificationFields.pagination_id = specificationDetailsPaginationId
        warehouseSpecificationFields.wh_roof_type = specRoofType
        if (warehouseSpecificationFields.wh_roof_height) {
            warehouseSpecificationFields.wh_roof_height = warehouseSpecificationFields.wh_roof_height + ' ' + specRoofHeight;
        }
        warehouseSpecificationFields.wh_id = warehouseFields.wh_id

        // console.table(warehouseFields)
        // console.table(warehouseRentalFields)
        // console.table(warehouseSpecificationFields)


        //Checking for empty fields
        const optionalWarehouseFields = ['wh_gps_coordinates', 'wh_address', 'pagination_id', 'wh_geom', 'thumbnail_cid', 'longitude', 'latitude'];
        const optionalWarehouseRentalFields = ['thumbnail_cid', 'pagination_id'];
        const optionalWarehouseSpecificationFields = ['pagination_id', 'thumbnail_cid'];

        const emptyWarehouseFields = getEmptyFields(warehouseFields, optionalWarehouseFields);
        const emptyWarehouseRentalFields = getEmptyFields(warehouseRentalFields, optionalWarehouseRentalFields);
        const emptyWarehouseSpecificationFields = getEmptyFields(warehouseSpecificationFields, optionalWarehouseSpecificationFields);


        if (emptyWarehouseFields.length > 0) {
            notifyInfo(`Empty fields in warehouseFields: ${emptyWarehouseFields.join(', ')}`);
            setLoading(false)
            return;
        }

        if (emptyWarehouseRentalFields.length > 0) {
            notifyInfo(`Empty fields in warehouseRentalFields: ${emptyWarehouseRentalFields.join(', ')}`);
            setLoading(false)
            return;
        }

        if (emptyWarehouseSpecificationFields.length > 0) {
            notifyInfo(`Empty fields in warehouseSpecificationFields: ${emptyWarehouseSpecificationFields.join(', ')}`);
            setLoading(false)
            return;
        }

        notifyInfo("Your Details will be updated soon")


        try {
            //compressAndUploadImages();
            const thumbnailCID = await compressAndUploadImages();
            console.log(thumbnailCID)
            if (thumbnailCID && thumbnailCID[0] !== undefined) {
                warehouseFields.thumbnail_cid = thumbnailCID[0];
                warehouseRentalFields.thumbnail_cid = thumbnailCID[0]
            }


            console.log(warehouseFields.thumbnail_cid)

            const article = { title: "React POST Request Example" };

            const headers = {
                Authorization: "Bearer mytoken",
                accept: "application/json",
            };

            const warehouseId = warehouseFields.wh_id;
            console.log(warehouseFields)

            const updatedBasicDetails = "&WH_NAME=" + warehouseFields.wh_name + "&WH_TOTAL_SPACE=" + warehouseFields.wh_total_space + "&WH_LAND_AREA="
                + warehouseFields.wh_land_area + "&WH_ADDRESS=" + warehouseFields.wh_address + "&WH_TYPE=" + warehouseFields.wh_type + "&latitude=" + "11"
                //  warehouseFields.latitude
                + "&WH_ID_CREATED_TIMESTAMP=" + warehouseFields.wh_id_created_timestamp + "&OWNER_ENTITY_ID=" + warehouseFields.owner_entity_id
                + "&longitude=" + "11"
                // warehouseFields.longitude
                 + "&PAGINATION_ID=" + warehouseFields.pagination_id + "&THUMBNAIL_CID=" + warehouseFields.thumbnail_cid
                + "&IS_VERIFIED=" + Constants.isVerified + "&IS_ACTIVE=" + Constants.isActive;

            const updatedRentalDetails = "&WH_ID=" + warehouseRentalFields.wh_id + "&WH_RENTAL_AVAILABLE_DATE=" + warehouseRentalFields.wh_rental_available_date
                + "&WH_MIN_LEASE=" + warehouseRentalFields.wh_min_lease + "&WH_MAX_LEASE=" + warehouseRentalFields.wh_max_lease
                + "&WH_RENTAL_RATE=" + warehouseRentalFields.wh_rental_rate + "&WH_RENTAL_UNIT=" + warehouseRentalFields.wh_rental_unit + "&WH_SECURITY_DEPOSIT="
                + warehouseRentalFields.wh_security_deposit + "&WH_LOCK_IN_PERIOD=" + warehouseRentalFields.wh_lock_in_period + "&WH_RENTAL_INCREMENT=" + warehouseRentalFields.wh_rental_increment
                + "&WH_NOTICE_PERIOD=" + warehouseRentalFields.wh_notice_period + "&WH_RENT_FREE_PERIOD=" + warehouseRentalFields.wh_rent_free_period
                + "&WH_RENTAL_ID_CREATED_TIMESTAMP=" + warehouseRentalFields.wh_rental_id_created_timestamp + "&PAGINATION_ID=" + warehouseRentalFields.pagination_id
                + "&THUMBNAIL_CID=" + warehouseRentalFields.thumbnail_cid + "&IS_VERIFIED=" + Constants.isVerified + "&IS_ACTIVE=" + Constants.isActive;

            const updatedSpecificationDetails = "&WH_ROOF_HEIGHT=" + warehouseSpecificationFields.wh_roof_height + "&WH_ROOF_TYPE=" + warehouseSpecificationFields.wh_roof_type
                + "&WH_ELECTRICAL=" + warehouseSpecificationFields.wh_electrical + "&WH_FLOORING_TYPE=" + warehouseSpecificationFields.wh_flooring_type
                + "&WH_LOADING_DOCK_COUNT=" + warehouseSpecificationFields.wh_loading_dock_count + "&WH_LOADING_DOCK_HEIGHT=" + "11"
                + "&WH_LOADING_DOCK_SIZE=" + warehouseSpecificationFields.wh_loading_dock_size + "&WH_AGE=" + warehouseSpecificationFields.wh_age + "&PAGINATION_ID=" + warehouseSpecificationFields.pagination_id
                + "&WH_HVAC=" + warehouseSpecificationFields.wh_hvac + "&IS_VERIFIED=" + Constants.isVerified + "&IS_ACTIVE=" + Constants.isActive;

            console.table(updatedBasicDetails)
            console.table(updatedRentalDetails)
            console.table(updatedSpecificationDetails)
            const requests = [
                axios.post(Constants.local_api_gateway_host + "/basicDetails/?WH_ID=" + warehouseId + updatedBasicDetails, article,
                    {
                        headers,
                    }),
                axios.post(Constants.local_api_gateway_host + "/rentalDetails/?WH_RENTAL_ID=" + warehouseRentalFields.wh_rental_id + updatedRentalDetails, article,
                    {
                        headers,
                    }),
                axios.post(Constants.local_api_gateway_host + "/specificationDetails/?WH_ID=" + warehouseId + updatedSpecificationDetails, article,
                    {
                        headers,
                    }),
            ];


            // This is to put CID from each images for API PUT call
            thumbnailCID.forEach((cid, index) => {
                console.log(cid)
                const isThumbnail = index === 0 ? "True" : "False";
                console.log(isThumbnail)
                requests.push(imageUploadDatabase(cid, isThumbnail));
                console.log(cid);
            });

            console.log(thumbnailCID)
            console.log(requests)

            // makePostRequest(tableNames.WH_BASIC_DETAILS + "/?WH_ID=" + warehouseId, updatedBasicDetails).then(response => {
            //     if (response) {
            //         console.log('Response:', response);
            //     } 
            // })
            // .catch(error => console.error('Error:', error));


            // Swap the first and third elements to ensure the first request is executed first
            const [firstRequest, ...restRequests] = requests;
            const reorderedRequests = [restRequests.pop(), ...restRequests];

            Promise.all(reorderedRequests)
                .then(responses => {
                    console.log('Warehouse data added successfully');
                    console.log(response)
                })
                .catch(error => {
                    // notifyError("Error updating warehouse data")
                    console.error('Error updating warehouse data:', error);
                });
            router.push("/ViewListing");

        } catch (error) {
            console.log("try error");
            console.log(error);
        }
        setLoading(false)
    }

    const formatDates = (selectedDates) => {
        return selectedDates.map(date => date.toISOString().split('T')[0]);
    };

    if (!userExistsDB) {

        return (
            <>
                <div className='d-flex flex-column justify-content-center align-items-center text-center m-3 p-3' style={{ height: "90vh", fontSize: "20px" }}>
                    <h1>Please complete your profile first.</h1>
                    <br />
                    <p>
                        After completion of the profile a user can create a post.
                    </p>
                    <a href='/create-profile' className='mt-3'>
                        <Button1
                            type="button"
                            variant="primary"
                        >
                            Edit Profile
                        </Button1>
                    </a>

                </div>
            </>
        )
    }
    if (userExistsDB) {
        return (
            <>

                <div className="white-bg m-4 rounded-lg ">
                    {/* <div className='d-flex justify-content-center align-items-center position-absolute z-index-1' style={{width:"70vw",height:"80vh"}}>
                    <div className='d-flex flex-column justify-content-center align-items-center text-center' style={{ height: "80vh", fontSize: "20px", backdropFilter: "20px", position: "absolute" }}>
                        <h1>Please complete your profile first.</h1>
                        <br />
                        <p>
                            After completion of the profile a user can create a post.
                        </p>
                    </div>
                </div> */}
                    <meta httpEquiv="cache-control" content="no-cache" />
                    <meta httpEquiv="expires" content="0" />
                    <meta httpEquiv="pragma" content="no-cache" />
                    {step !== 4 && (
                        <Stepper steps={steps} activeStep={step} />
                    )}

                    <Form noValidate onSubmit={handleSubmit} className='mt-40' >

                        {/* wharehouse Basic Details */}
                        {step === 0 &&

                            <>
                                <Row className='mt-5'>
                                    <Col lg={6}>
                                        {/* <Form.Group className="mb-3">
                                        <Form.Label>Warehouse ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Warehouse ID"
                                            name='wh_id'
                                            onChange={handleBasicWarehouseChange}
                                            value={warehouseFields?.wh_id}
                                            required
                                            disabled={true}
                                        />
                                    </Form.Group> */}
                                        {/* <Form.Group className="mb-3">
                                        <Form.Label>Created Timestamp</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Created Timestamp"
                                            name='wh_id_created_timestamp'
                                            onChange={handleBasicWarehouseChange}
                                            value={warehouseFields?.wh_id_created_timestamp}
                                            required={true}
                                            disabled={true}
                                        />
                                    </Form.Group> */}
                                        {/* <Form.Group className="mb-3">
                                        <Form.Label>Owner Entity ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Owner Entity ID"
                                            name='owner_entity_id'
                                            onChange={handleBasicWarehouseChange}
                                            value={warehouseFields?.owner_entity_id}
                                            required={true}
                                            disabled={true}
                                        />
                                    </Form.Group> */}
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Warehouse Category<Overlays message={"Please mention the type of warehouse"} />
                                                </Form.Label>
                                            </p>
                                            {warehouseFields.wh_type === "" ?
                                                <Select
                                                    xxl={10}
                                                    closeMenuOnSelect={true}
                                                    components={animatedComponents}
                                                    // defaultValue={{ value: warehouseFields.wh_type, name: warehouseFields.wh_type, label: warehouseFields.wh_type }
                                                    // }
                                                    placeholder="Select..."
                                                    options={WarehouseTypes}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        console.log(warehouseFields.wh_type)
                                                        setWarehouseFields(prev => ({
                                                            ...prev,
                                                            ['wh_type']: event.value
                                                        }));
                                                    }}
                                                /> :
                                                <Select
                                                    xxl={10}
                                                    closeMenuOnSelect={true}
                                                    components={animatedComponents}
                                                    defaultValue={{ value: warehouseFields.wh_type, name: warehouseFields.wh_type, label: warehouseFields.wh_type }
                                                    }
                                                    options={WarehouseTypes}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        console.log(warehouseFields.wh_type)
                                                        setWarehouseFields(prev => ({
                                                            ...prev,
                                                            ['wh_type']: event.value
                                                        }));
                                                    }}
                                                />
                                            }


                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Warehouse Address <Overlays message={"Enter the address manually of your warehouse"} /></Form.Label>
                                            </p>
                                            <Form.Control
                                                type="text"
                                                name='wh_address'
                                                onChange={handleBasicWarehouseChange}
                                                value={warehouseFields?.wh_address}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Client warehouseId={warehouseFields.wh_id} ownerId={warehouseFields?.ownerEntityId} locationText={locationText} setlocationText={setlocationText} />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6}>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Warehouse Name <Overlays message={"Warehouse Name"} /></Form.Label>


                                            </p>
                                            <Form.Control
                                                type="text"
                                                name='wh_name'
                                                onChange={handleBasicWarehouseChange}
                                                value={warehouseFields?.wh_name}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Total Storage Area <Overlays message={"Total area which you can utilise to store your goods"} />
                                                </Form.Label>

                                            </p>
                                            <Row>
                                                <Col>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Enter value"
                                                        name='wh_total_space'
                                                        onChange={handleBasicWarehouseChange}
                                                        value={warehouseFields?.wh_total_space}
                                                        required

                                                    />
                                                </Col>
                                                <Col>
                                                    {totalSpaceUnit === "" ? <Select
                                                        options={units}
                                                        onChange={handleTotalSpaceUnitChange}
                                                        placeholder="Select unit"
                                                        className="unit-dropdown"
                                                    /> : <Select
                                                        options={units}
                                                        defaultValue={{ value: totalSpaceUnit.value, label: totalSpaceUnit.label }}
                                                        onChange={handleTotalSpaceUnitChange}
                                                        className="unit-dropdown"
                                                    />}

                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Area Offered <Overlays message={"Select warehouse area offered"} />
                                                </Form.Label>


                                            </p>
                                            {warehouseRentalFields.wh_area_offered === "" ?
                                                <Select
                                                    closeMenuOnSelect={true}
                                                    components={animatedComponents}
                                                    // defaultValue={{ value: warehouseRentalFields.wh_area_offered, name: warehouseRentalFields.wh_area_offered, label: warehouseRentalFields.wh_area_offered }}
                                                    options={WarehouseAreaOffered}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWarehouseRentalFields(prev => ({
                                                            ...prev,
                                                            ['wh_area_offered']: event.value
                                                        }));
                                                    }}
                                                />
                                                :
                                                <Select
                                                    closeMenuOnSelect={true}
                                                    components={animatedComponents}
                                                    defaultValue={{ value: warehouseRentalFields.wh_area_offered, name: warehouseRentalFields.wh_area_offered, label: warehouseRentalFields.wh_area_offered }}
                                                    options={WarehouseAreaOffered}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWarehouseRentalFields(prev => ({
                                                            ...prev,
                                                            ['wh_area_offered']: event.value
                                                        }));
                                                    }}
                                                />}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="text-center mt-3">
                                    <Button
                                        type="button"
                                        variant="success"
                                        className='btn btn-info text-white'
                                        onClick={() => setStep(step + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>

                            </>
                        }

                        {/* WHarehouse Rental Details */}
                        {step === 1 &&
                            <>
                                <Row className='mt-5'>
                                    <Col lg={6}>
                                        {/* <Form.Group className="mb-3">
                                        <Form.Label>Warehouse Rental ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Wharehouse Rental ID"
                                            name='wh_rental_id'
                                            onChange={handleRentalWarehouseChange}
                                            value={warehouseRentalFields?.wh_rental_id}
                                            required={true}
                                            disabled={true}
                                        />
                                    </Form.Group> */}
                                        {/* <Form.Group className="mb-3">
                                        <Form.Label>Rental Created Timestamp</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Rental Created Timestamp"
                                            name='wh_rental_id_created_timestamp'
                                            onChange={handleRentalWarehouseChange}
                                            value={warehouseRentalFields?.wh_rental_id_created_timestamp}
                                            required={true}
                                            disabled={true}
                                        />
                                    </Form.Group> */}

                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Monthly Rent  <Overlays message={"in Indian Rupees "} /> </Form.Label>
                                            </p>
                                            <Form.Control
                                                type="number"
                                                placeholder="Rent Amount"
                                                name='wh_rental_rate'
                                                onChange={handleRentalWarehouseChange}
                                                value={warehouseRentalFields?.wh_rental_rate}
                                                required={true}

                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Rental start Date <Overlays message={"Nearest Available for Rent Date"} />
                                                </Form.Label>
                                            </p>
                                            <InputGroup>
                                                <Flatpickr
                                                    className="form-control d-block"
                                                    placeholder="Rental start date"
                                                    defaultValue={warehouseRentalFields?.wh_rental_available_date}
                                                    onChange={(selectedDates) => {
                                                        setWarehouseRentalFields(prev => ({
                                                            ...prev,
                                                            ['wh_rental_available_date']: formatDates(selectedDates)[0]
                                                        }));
                                                        console.log(formatDates(selectedDates)[0])
                                                    }}

                                                    options={{
                                                        altInput: true,
                                                        minDate: 'today',

                                                    }}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Minimum Duration <Overlays message={"Minimum period for which warehouse will be leased"} /></Form.Label>
                                            </p>
                                            <Row>
                                                <Col>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder=""
                                                        name='duration'
                                                        onChange={(e) => {
                                                            setminDuration((prev) => ({ ...prev, ['duration']: e.target.value }))
                                                        }}
                                                        value={minDuration.duration}
                                                        required={true}

                                                    />
                                                </Col>
                                                {/* <Col >
                                                    {minDuration.Unit === "" ? <Select
                                                        closeMenuOnSelect={true}
                                                        components={animatedComponents}
                                                        placeholder="Unit"
                                                        options={durationUnit}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            setminDuration((prev) => ({ ...prev, ['Unit']: event.value }))
                                                        }}
                                                    /> : <Select
                                                        closeMenuOnSelect={true}
                                                        components={animatedComponents}
                                                        defaultValue={{ value: minDuration.Unit, label: minDuration.Unit }}
                                                        placeholder="Unit"
                                                        options={durationUnit}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            setminDuration((prev) => ({ ...prev, ['Unit']: event.value }))
                                                            console.log(minDuration)
                                                        }}
                                                    />}
                                                </Col> */}
                                            </Row>
                                            {/* <Select
                                            closeMenuOnSelect={true}
                                            components={animatedComponents}
                                            defaultValue={{ value: warehouseRentalFields.wh_min_lease, name: warehouseRentalFields.wh_min_lease, label: warehouseRentalFields.wh_min_lease }}
                                            placeholder="Select Minimum Lease Duration"
                                            options={RentalPeriods}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setWarehouseRentalFields(prev => ({
                                                    ...prev,
                                                    ['wh_min_lease']: event.value
                                                }));
                                            }}
                                        /> */}
                                        </Form.Group>

                                        {/* <Form.Group className="mb-3">
                                        <p className='mb-3 select2-container'>
                                            <Form.Label>Rent Free Period, if any</Form.Label>
                                        </p>
                                        <Select
                                            closeMenuOnSelect={true}
                                            components={animatedComponents}
                                            defaultValue={{ value: warehouseRentalFields.wh_max_lease, name: warehouseRentalFields.wh_max_lease, label: warehouseRentalFields.wh_max_lease }}
                                            placeholder="Select Maximum Lease Duration"
                                            options={RentalPeriods}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setWarehouseRentalFields(prev => ({
                                                    ...prev,
                                                    ['wh_rent_free_period']: event.value
                                                }));
                                            }}
                                        />
                                    </Form.Group> */}
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Lock In Period <Overlays message={""} /></Form.Label>
                                            </p>
                                            <Select
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                                defaultValue={{ value: warehouseRentalFields.wh_lock_in_period, name: warehouseRentalFields.wh_lock_in_period, label: warehouseRentalFields.wh_lock_in_period }}
                                                placeholder="Select Lock In Period"
                                                options={LockInPeriod}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWarehouseRentalFields(prev => ({
                                                        ...prev,
                                                        ['wh_lock_in_period']: event.value
                                                    }));
                                                }}
                                            />
                                        </Form.Group>


                                    </Col>

                                    <Col lg={6}>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Rental Rate <Overlays message={"Security Deposit"} /></Form.Label>
                                            </p>
                                            <Form.Control
                                                type="number"
                                                name='wh_security_deposit'
                                                onChange={handleRentalWarehouseChange}
                                                value={warehouseRentalFields?.wh_security_deposit}
                                                required={true}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Rental Increment <Overlays message={'Rate of increment per year'} /></Form.Label>
                                            </p>
                                            <Form.Control
                                                type="text"
                                                name='wh_rental_increment'
                                                onChange={handleRentalWarehouseChange}
                                                value={warehouseRentalFields?.wh_rental_increment}
                                                required={true}

                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Maximum Duration <Overlays message={'Maximum period for which warehouse will be leased'} /></Form.Label>
                                            </p>
                                            <Row>
                                                <Col>
                                                    <Form.Control
                                                        type="text"
                                                        name='wh_rental_increment'
                                                        onChange={(e) => {
                                                            setmaxDuration((prev) => ({ ...prev, ['duration']: e.target.value }))
                                                        }}
                                                        value={maxDuration.duration}
                                                        required={true}

                                                    />
                                                </Col>
                                                <Col >
                                                    {maxDuration.Unit === "" ? <Select
                                                        closeMenuOnSelect={true}
                                                        components={animatedComponents}
                                                        placeholder="Select Unit"
                                                        options={durationUnit}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            setmaxDuration((prev) => ({ ...prev, ['Unit']: event.value }))
                                                        }}
                                                    /> : <Select
                                                        closeMenuOnSelect={true}
                                                        components={animatedComponents}
                                                        defaultValue={{ value: maxDuration.Unit, label: maxDuration.Unit }}
                                                        placeholder="Unit"
                                                        options={durationUnit}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            setmaxDuration((prev) => ({ ...prev, ['Unit']: event.value }))
                                                        }}
                                                    />}

                                                </Col>
                                            </Row>

                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Notice Period <Overlays message={"Time required by either party to modify the contract"} /></Form.Label>
                                            </p>
                                            <Row>
                                                <Col>
                                                    <Form.Control
                                                        type="text"

                                                        name='wh_notice_period'
                                                        onChange={(e) => {
                                                            setnoticePeriod((prev) => ({ ...prev, ['duration']: e.target.value }))
                                                        }}
                                                        value={noticePeriod.duration}
                                                        required={true}

                                                    />
                                                </Col>
                                                <Col >
                                                    {noticePeriod.Unit === "" ? <Select
                                                        closeMenuOnSelect={true}
                                                        components={animatedComponents}

                                                        placeholder="Select Unit"
                                                        options={durationUnit}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            setnoticePeriod((prev) => ({ ...prev, ['Unit']: event.value }))
                                                        }}
                                                    /> : <Select
                                                        closeMenuOnSelect={true}
                                                        components={animatedComponents}
                                                        defaultValue={{ value: noticePeriod.Unit, label: noticePeriod.Unit }}

                                                        placeholder="Unit"
                                                        options={durationUnit}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            setnoticePeriod((prev) => ({ ...prev, ['Unit']: event.value }))
                                                        }}
                                                    />}

                                                </Col>
                                            </Row>
                                            {/* <Select
                                            closeMenuOnSelect={true}
                                            components={animatedComponents}
                                            // defaultValue={{ value: warehouseRentalFields.wh_notice_period, name: warehouseRentalFields.wh_notice_period, label: warehouseRentalFields.wh_notice_period }}
                                            placeholder="Time required by either party to modify the contract"
                                            options={RentalPeriods}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setWarehouseRentalFields(prev => ({
                                                    ...prev,
                                                    ['wh_notice_period']: event.value
                                                }));
                                            }}
                                        /> */}

                                        </Form.Group>

                                        {/* <Form.Group className="mb-3">
                                        <p className='mb-3 select2-container'>
                                            <Form.Label>Rental Unit</Form.Label>
                                        </p>
                                        <Select
                                            closeMenuOnSelect={true}
                                            components={animatedComponents}
                                            defaultValue={{ value: warehouseRentalFields.wh_rental_unit, name: warehouseRentalFields.wh_rental_unit, label: warehouseRentalFields.wh_rental_unit }}
                                            placeholder="Select Rental Unit"
                                            options={RentalUnits}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setWarehouseRentalFields(prev => ({
                                                    ...prev,
                                                    ['wh_rental_unit']: event.value
                                                }));
                                            }}
                                        />
                                    </Form.Group> */}


                                    </Col>
                                </Row>
                                <div className="text-center mt-3">
                                    <Button
                                        type="button"
                                        className='m-2 btn btn-info text-white'
                                        onClick={() => setStep(step - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        type="button"
                                        className='m-2 btn btn-info text-white'
                                        onClick={() => setStep(step + 1)}
                                    >
                                        Next
                                    </Button>

                                </div>

                            </>
                        }

                        {/* Wharehouse Specification Details */}
                        {step === 2 &&
                            <>
                                <Row className='mt-5'>
                                    <Col lg={6}>
                                        <Form.Group className="mb-3">

                                            <Row>
                                                <p className='mb-3 select2-container'>
                                                    <Form.Label>Roof Height <Overlays message={"Warehouse Roof Height"} /></Form.Label>
                                                </p>
                                            </Row>
                                            <Row>
                                                <Col>

                                                    <Form.Control
                                                        type="text"
                                                        name='wh_roof_height'
                                                        onChange={handleSpecificationWarehouseChange}
                                                        value={warehouseSpecificationFields?.wh_roof_height}
                                                        required={true}
                                                    />
                                                </Col>
                                                <Col >
                                                    {specRoofHeight === "" ?
                                                        <Select
                                                            className='mt-0'
                                                            closeMenuOnSelect={true}
                                                            components={animatedComponents}
                                                            // defaultValue={{ name: specRoofHeight, label: specRoofHeight }}
                                                            placeholder="Select Unit"
                                                            options={SpecificationRoofHeight}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                setSpecRoofHeight(event.value)
                                                                console.log(event.value)
                                                            }}
                                                        />
                                                        :
                                                        <Select
                                                            className='mt-0'
                                                            closeMenuOnSelect={true}
                                                            components={animatedComponents}
                                                            defaultValue={{ name: specRoofHeight, label: specRoofHeight }}
                                                            // placeholder="Unit"
                                                            options={SpecificationRoofHeight}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                setSpecRoofHeight(event.value)
                                                                console.log(event.value)
                                                            }}
                                                        />
                                                    }
                                                </Col>
                                            </Row>
                                        </Form.Group>


                                        <Form.Group className="mb-3">
                                            <Row>
                                                <p className='mb-3 select2-container'>
                                                    <Form.Label>Roof Type <Overlays message={"Warehouse Roof Type"} /></Form.Label>
                                                </p>
                                            </Row>
                                            <Row>
                                                {specRoofType === "" ?
                                                    <Select
                                                        closeMenuOnSelect={true}
                                                        components={animatedComponents}
                                                        // defaultValue={{ value: specRoofType, name: specRoofType, label: specRoofType }}

                                                        placeholder="Select..."
                                                        options={SpecificationRoofType}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            setSpecRoofType(event.value)
                                                            console.log(event.value)
                                                        }}
                                                    />
                                                    :
                                                    <Select
                                                        closeMenuOnSelect={true}
                                                        components={animatedComponents}
                                                        defaultValue={{ value: specRoofType, name: specRoofType, label: specRoofType }}

                                                        // placeholder="Select..."
                                                        options={SpecificationRoofType}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            setSpecRoofType(event.value)
                                                            console.log(event.value)
                                                        }}
                                                    />
                                                }

                                            </Row>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Electrical <Overlays message={"Single Phase, Three Phase or Transformer"} /></Form.Label>
                                            </p>
                                            <Form.Control
                                                type="text"
                                                name='wh_electrical'
                                                onChange={handleSpecificationWarehouseChange}
                                                value={warehouseSpecificationFields?.wh_electrical}
                                                required={true}

                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Flooring Type <Overlays message={"Warehouse Flooring Type"} /></Form.Label>
                                            </p>
                                            <Form.Control
                                                type="text"
                                                // placeholder="Warehouse Flooring Type"
                                                name='wh_flooring_type'
                                                onChange={handleSpecificationWarehouseChange}
                                                value={warehouseSpecificationFields?.wh_flooring_type}
                                                required={true}

                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6}>
                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Loading Dock Count <Overlays message={"Warehouse Loading Dock Count"} /></Form.Label>
                                            </p>
                                            <Form.Control
                                                type="number"
                                                name='wh_loading_dock_count'
                                                onChange={handleSpecificationWarehouseChange}
                                                value={warehouseSpecificationFields?.wh_loading_dock_count}
                                                required={true}

                                            />
                                        </Form.Group>
                                        {/* <Form.Group className="mb-3">
                                        <Form.Label>Loading Dock Width</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Warehouse Loading Dock Width"
                                            name='wh_loading_dock_height'
                                            onChange={handleSpecificationWarehouseChange}
                                            value={warehouseSpecificationFields?.wh_loading_dock_height}
                                            required={true}

                                        />
                                    </Form.Group> */}

                                        <Form.Group className="mb-3">
                                            <p className='mb-3 select2-container'>
                                                <Form.Label>Loading Dock Dimensions <Overlays message={"(Length x Bredth x Height)"} /></Form.Label>
                                            </p>
                                            <Row className='mb-3'>
                                                <Col>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Dimentions (in meters)"
                                                        name='Length'
                                                        // onChange={handleLoadingDockDimensions}
                                                        onChange={(e)=>{
                                                            setLoadingDockDimensions(e.target.value);
                                                        }}
                                                        value={loadingDockDimensions}
                                                    />
                                                </Col>
                                                {/* <Col>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Length"
                                                        name='Length'
                                                        onChange={handleLoadingDockDimensions}
                                                        value={loadingDockDimensions?.Length}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Bredth"
                                                        name='Bredth'
                                                        onChange={handleLoadingDockDimensions}
                                                        value={loadingDockDimensions?.Bredth}
                                                    />
                                                </Col> */}
                                            </Row>
                                            {/* <Row >
                                                <Col>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Height"
                                                        name='Height'
                                                        onChange={handleLoadingDockDimensions}
                                                        value={loadingDockDimensions?.Height}
                                                    />
                                                </Col>
                                                <Col >
                                                    {loadingDockDimensions.Unit === "" ?
                                                        <Select
                                                            className='mt-0'
                                                            closeMenuOnSelect={true}
                                                            components={animatedComponents}
                                                            placeholder="Unit"
                                                            options={SpecificationLoadingDockDimentions}
                                                            onChange={handleLoadingDockDimensionsUnit}
                                                        />
                                                        :
                                                        <Select
                                                            className='mt-0'
                                                            closeMenuOnSelect={true}
                                                            components={animatedComponents}
                                                            defaultValue={{ label: loadingDockDimensions.Unit }}
                                                            placeholder="Unit"
                                                            options={SpecificationLoadingDockDimentions}
                                                            onChange={handleLoadingDockDimensionsUnit}
                                                        />
                                                    }


                                                </Col> */}

                                        {/* </Row> */}
                                        {/* <Form.Control
                                            type="text"
                                            placeholder="Warehouse Loading Dock Size"
                                            name='loadingDockDimentions'
                                            onChange={handleLoadingDockDimensions}
                                            value={loadingDockDimensions?.Length}

                                        /> */}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <p className='mb-3 select2-container'>
                                            <Form.Label>Age <Overlays message={"Age of the warehouse"} /></Form.Label>
                                        </p>
                                        {warehouseSpecificationFields.wh_age === "" ?
                                            <Select
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                                placeholder="Select..."
                                                // defaultValue={{ value: warehouseSpecificationFields.wh_age, name: warehouseSpecificationFields.wh_age, label: warehouseSpecificationFields.wh_age }}
                                                options={WarehouseAge}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWarehouseSpecificationFields(prev => ({
                                                        ...prev,
                                                        ['wh_age']: event.value
                                                    }));
                                                    console.log(warehouseSpecificationFields)

                                                }}
                                            />
                                            :
                                            <Select
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                                defaultValue={{ value: warehouseSpecificationFields.wh_age, name: warehouseSpecificationFields.wh_age, label: warehouseSpecificationFields.wh_age }}
                                                options={WarehouseAge}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWarehouseSpecificationFields(prev => ({
                                                        ...prev,
                                                        ['wh_age']: event.value
                                                    }));
                                                    console.log(warehouseSpecificationFields)

                                                }}
                                            />
                                        }

                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <p className='mb-3 select2-container'>
                                            <Form.Label>HVAC <Overlays message={"Warehouse Heating, ventilation, and air conditioning "} />
                                            </Form.Label>
                                        </p>

                                        {warehouseSpecificationFields.wh_hvac === "" ?
                                            <Select
                                                closeMenuOnSelect={true}
                                                required={true}
                                                components={animatedComponents}
                                                placeholder="Select"
                                                options={[{ name: "wh_hvac", label: "Yes", value: "Yes" }, { name: "wh_hvac", label: "No", value: "No" }]}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWarehouseSpecificationFields(prev => ({
                                                        ...prev,
                                                        ['wh_hvac']: event.value
                                                    }));
                                                }}
                                            />
                                            :
                                            <Select
                                                closeMenuOnSelect={true}
                                                required={true}
                                                components={animatedComponents}
                                                placeholder="Warehouse HVAC"
                                                defaultValue={{ name: "wh_hvac", value: warehouseSpecificationFields.wh_hvac, label: warehouseSpecificationFields.wh_hvac }}
                                                options={[{ name: "wh_hvac", label: "Yes", value: "Yes" }, { name: "wh_hvac", label: "No", value: "No" }]}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWarehouseSpecificationFields(prev => ({
                                                        ...prev,
                                                        ['wh_hvac']: event.value
                                                    }));
                                                }}
                                            />
                                        }

                                    </Form.Group>
                                </Col>


                            </Row>
                        <div className="text-center mt-3">
                            <Button
                                type="button"
                                className='m-2 btn btn-info text-white'
                                onClick={() => setStep(step - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                type="button"
                                className='m-2 btn btn-info text-white'
                                onClick={() => setStep(step + 1)}
                            >
                                Next
                            </Button>
                        </div>


                    </>
                        }

                    {/* Images */}
                    {step === 3 &&
                        <>
                            <div className='d-flex justify-content-center'>
                                <Row className='mt-5'>
                                    <h6 className='m-2 pb-4 d-flex justify-content-center'>By default first image is taken as thumbnail</h6>
                                    <ImageUpload
                                        ImagesData={imagesData}
                                        setFileListState={handleSetFileListData}
                                        setNewImageState={handleSetNewImagesData}
                                        setDeletedImageState={handleSetDeletedCidData}

                                    />


                                </Row>
                            </div>
                            {loading ?
                                <>
                                    <div className="text-center mt-3">
                                        <div className="column d-flex align-items-xl-center justify-content-center">
                                            <h3 className="m-3 p-3"> <ReactLoading type="spinningBubbles" color="#1a152e" /></h3>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="text-center ">
                                        <Button
                                            type="button"
                                            className='m-2 btn btn-info text-white'
                                            onClick={() => setStep(step - 1)}
                                        >
                                            Previous
                                        </Button>

                                        <Button
                                            type="submit"
                                            className='m-2 btn btn-success text-white '
                                            disabled={!userExistsDB}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </>
                            }


                        </>
                    }
                </Form>
            </div >

            </>
        )
    }
};

export default NewPostOwner;