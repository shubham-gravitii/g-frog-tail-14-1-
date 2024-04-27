"use client"
// @ts-nocheck
import { useRouter } from "next/router";
import moment from "moment";
import React, { useEffect, useState } from "react";
//new added 
import {
    Button,
    Tooltip,
    Modal,
    Form,
    Image,
    OverlayTrigger,
} from "react-bootstrap";
import Select from 'react-select';

import 'leaflet/dist/leaflet.css';

import MapComponent from '../CityMap';

import ReactLoading from 'react-loading';




import { Marker } from "react-leaflet";

// import { Suspense } from 'react';
// const MapComponent = React.lazy(() => import('./CityMap'));

// // In your component render method
// <Suspense fallback={<div>Loading...</div>}>
//   <MapComponent />
// </Suspense>

// import { geocode } from '@tomtom-international/web-sdk-services';




import {
    Card,
    CardBody,
    Col,
    Container,
    // Form,
    FormGroup,
    Input,
    InputGroup,
    Label,
    Row,
    ModalHeader,
    ModalBody,
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "reactstrap";
import "@vtaits/react-color-picker/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import { add, min } from "date-fns";

import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import axios from "axios";
import { useForm } from "react-hook-form";
import MetaTags from "react-meta-tags";
import SolClient from "../../Web3Client/SolClient";
import Client from "./MapForOwner/ClientMap";
import Success from "../Common/Success";
import Error from "../../Common/Error";
import initializeHello from "../Home/Header";
import RateRecords from "../Board/RateRecords";
import { stringify } from "querystring";



import { useAuth } from "../../../contexts/UserContext";

// import addNotification from "react-push-notification";

import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
    useWallet,
    WalletProvider,
    ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { AutoConnectProvider } from "../../components/AutoConnectProvider";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as Constants from "../../../utils/constants";
import { UniqueID } from "../../../utils/uuidGenerate";
import { TS } from "../../../utils/currentTimestamp";
import { findDOMNode } from "react-dom";

const network = clusterApiUrl(Constants.solana_network);

const wallets = [new PhantomWalletAdapter()];

import { Web3Storage } from "web3.storage";
import imageCompression from "browser-image-compression";
function getAccessToken() {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZENzNFOTc0ODY5MTY0MWNhMGE0RDE1MjQ4Njk1ZjY5OTYyOWNmNzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTE3NjE1NDI3MzQsIm5hbWUiOiJncmF2aXRpaS10b2hlZWQifQ.LY3z01m_qicP0SvdmOUHKM7Giyyq0DWrUBWOTZtk-c4"
    // return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ3ODIxZUVjQTIwYmMxNGVBRjcxNzdBQ2I0OTJFMTQwQTA4MDQzRDQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTA5Njc1OTI2MDQsIm5hbWUiOiJzdG9yaW5nSW1nIn0.RPu3oXrS2-l9DJHLWGdnpGBuV4r1MvMd1MRiiqzKJn4"; // Replace with your actual access token
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
}

async function uploadFile(file) {
    try {
        console.log("Uploading file:", file.name);
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        const client = makeStorageClient();
        const cid = await client.put([compressedFile]);
        console.log("Uploaded to Web3 Storage:", cid);
        return cid;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

const ImageUploadModal = ({ show, onClose, onLocalUpload }) => {
    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (e) => {
        const files = e.target.files;
        const newSelectedImages = [...selectedImages];
        for (const file of files) {
            newSelectedImages.push(file);
        }
        setSelectedImages(newSelectedImages);
    };

    const handleLocalUpload = async () => {
        try {
            const uploadedImages = [];
            for (const image of selectedImages) {
                if (image.type.startsWith("image/")) {
                    const localImageUrl = URL.createObjectURL(image);
                    localStorage.setItem(`image_${image.name}`, localImageUrl); // Mark the image entries in localStorage
                    uploadedImages.push(image);
                    console.log("Stored locally:", image.name);
                } else {
                    console.log("Skipping non-image file:", image.name);
                }
            }
            onLocalUpload(uploadedImages);
            setSelectedImages([]);
            onClose();
        } catch (error) {
            console.error("Error uploading images locally:", error);
            alert("Failed to upload images locally.");
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Upload Images</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: "flex", flexWrap: "wrap", padding: "10px 0" }}>
                    {selectedImages.map((image, index) => (
                        <Image
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            style={{
                                maxWidth: "100px",
                                margin: "7px",
                            }}
                            thumbnail
                        />
                    ))}
                    <Form>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Form.Control
                                id="imageUpload"
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                            <Button
                                variant="primary"
                                onClick={() => document.getElementById("imageUpload").click()}
                                style={{
                                    background: "lightgray",
                                    border: "none",
                                    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                                    width: "80px",
                                    height: "80px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "30px",
                                    cursor: "pointer",
                                }}
                            >
                                +
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleLocalUpload}>
                    Upload Images
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export const opts = {
    preflightCommitment: "processed",
};

const NewPostOwner = () => {
    const wallet = useWallet();
    const { currentUser, loading } = useAuth()
    const itemsPerPage = Constants.paginationPostPerPage;
    const [totalPages, setTotalPages] = useState()
    const [walletAddress, setWalletAddress] = useState<
        HTMLInputElement | void | string
    >("");
    const [usrRole, setUsrRole] = useState<HTMLInputElement | void | string>("");
    const [customerCreatedTimestamp, setCustomerCreatedTimestamp] = useState<HTMLInputElement | void | string>("");

    // if (
    //   (usrRole.length == 0 || usrRole == null || usrRole == "") &&
    //   walletAddress != "" &&
    //   walletAddress != null
    // ) {
    //   const headers = {
    //     Authorization: "Bearer mytoken",
    //     accept: "application/json",
    //   };

    //   axios
    //     .get(
    //       Constants.api_gateway_host +
    //       "/user_profile/?WALLET_ADDRESS=" +
    //       walletAddress,
    //       { headers }
    //     )
    //     .then((res) => {
    //       //console.log(JSON.parse(res.request.response).response[0].user_role)
    //       //redirect logic
    //       if (res.status == 200) {
    //         var roleVal = JSON.parse(res.request.response).response[0].user_role;
    //         console.log("roleVal--->", roleVal);
    //         setUsrRole(roleVal);

    //         setBrokerID("GB-" + walletAddress.toString().substring(0, 26));
    //         setCarrierID("GC-" + walletAddress.toString().substring(0, 26));
    //         setMotID(UniqueID(roleVal));
    //         setIDLoad(UniqueID(roleVal));
    //         setTimestamp(TS());
    //         setOwnerEntityId(UniqueID(roleVal));
    //         setOwnerId("GWO-"+walletAddress.toString().substring(0, 26));
    //         setOwnerIdCreatedTimestamp(TS())
    //        // setWhId("GWI-"+walletAddress.toString().substring(0, 26));
    //         setWhId(UniqueID(roleVal));
    //         setWhIdCreatedTimestamp(TS());
    //         setWhRentalID(UniqueID(roleVal));
    //         setWhRentalCreatedTimestamp(TS());
    //         setRequirementPostID("GWC-" + UniqueID(roleVal));
    //         setRequirementIdCreatedTimeStamp(TS());
    //         setCustomerId("GCI-"+walletAddress.toString().substring(0, 26));
    //         setCustomerCreatedTimestamp(TS());
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    //   //console.log("ID izz--->",ID);
    // }
    //console.log("pub key-->", walletAddress);
    //console.log("Role--->", usrRole);
    //console.log("ID--->",ID);

    const optionGroup =
        //['Liquids','Solids','Auto','BorderCrossing']
        [
            {
                options: [
                    { label: "Liquids", value: "Liquids" },
                    { label: "Solids", value: "Solids" },
                    { label: "Auto", value: "Auto" },
                    { label: "BorderCrossing", value: "BorderCrossing" },
                ],
            },
        ];

    const optionSourceGroup = [
        {
            label: "Illinois",
            options: [
                { label: "Springfield", value: "Springfield" },
                { label: "Chicago", value: "Chicago" },
                { label: "Rockford", value: "Rockford" },
                { label: "Champaign", value: "Champaign" },
            ],
        },
        {
            label: "Maryland",
            options: [
                { label: "Annapolis", value: "Annapolis" },
                { label: "Baltimore", value: "Baltimore" },
                { label: "Columbia", value: "Columbia" },
                { label: "Hanover", value: "Hanover" },
            ],
        },
    ];

    const optionTargetGroup = [
        {
            label: "Illinois",
            options: [
                { label: "Springfield", value: "Springfield" },
                { label: "Chicago", value: "Chicago" },
                { label: "Rockford", value: "Rockford" },
                { label: "Champaign", value: "Champaign" },
            ],
        },
        {
            label: "Maryland",
            options: [
                { label: "Annapolis", value: "Annapolis" },
                { label: "Baltimore", value: "Baltimore" },
                { label: "Columbia", value: "Columbia" },
                { label: "Hanover", value: "Hanover" },
            ],
        },
    ];
    const EquipmentGroupname = [
        {
            label: "Types",
            options: [
                { label: "RefrigeratedTrailers", value: "RefrigeratedTrailers" },
                { label: "Dryvan", value: "Dryvan" },
                { label: "BoxTruck", value: "BoxTruck" },
                { label: "FlatbedTrailer", value: "FlatbedTrailer" },
                { label: "LowboyTrailer", value: "LowboyTrailer" },
            ],
        },
    ]

    const [isLoading, setIsLoading] = useState(true);


    const router = useRouter();
    const [route, setRoute] = useState();
    const [selectedSource, setSelectedSource] = useState("");
    const [ID, setID] = useState("");
    const [BrokerID, setBrokerID] = useState("");
    const [CarrierID, setCarrierID] = useState("");
    const [MotID, setMotID] = useState("");
    const [Dates, setDates] = useState("");
    const [Timestamp, setTimestamp] = useState("");
    const [DeliveryDate, setDeliveryDate] = useState("");
    const [selectedDestination, setSelectedDestination] = useState("");
    const [distance, setdistance] = useState("");
    const [selectedEquipment, setSelectedEquipment] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [rate, setRate] = useState("");
    const [IDName, setIDName] = useState("");
    const [IDLoad, setIDLoad] = useState("");
    const [pickupdates, setpickupdates] = useState("");
    const [delivery, setdelivery] = useState("");
    const [load, setload] = useState("");
    const [Distances, setDistances] = useState("");
    const [weight, setweight] = useState("");
    const [commodity, setcommodity] = useState("");
    const [rates, setrates] = useState("");
    const [addition, setaddition] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rangeEnd, setRangeEnd] = useState("");
    const [successFlag, setSuccessFlag] = useState("");
    const [errorFlag, setErrorFlag] = useState("");
    // const [data , setDate] =  useState("") ;
    //const [userRole, setUserRole] = useState("");
    //new  useStates
    const [ownerEntityId, setOwnerEntityId] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownerIdCreatedTimestamp, setOwnerIdCreatedTimestamp] = useState("");
    const [ownerFullName, setOwnerFullName] = useState("");
    const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
    const [ownerEmailId, setOwnerEmailId] = useState("");
    const [ownerAddress, setOwnerAddress] = useState("");
    const [ownerIdDocType, setOwnerIdDocType] = useState("");
    const [ownerIdDocNumber, setOwnerIdDocNumber] = useState("");
    const [ownerEntityType, setOwnerEntityType] = useState("");
    const [ownerEntityName, setOwnerEntityName] = useState("");
    const [ownerEntityRegistrationNumber, setOwnerEntityRegistrationNumber] = useState("");
    const [ownerEntityRegisteredAddress, setOwnerEntityRegisteredAddress] = useState("");
    const [ownerEntityPAN, setOwnerEntityPAN] = useState("");
    // const [isActive, setIsActive] = useState("");
    // const [isVerified, setIsVerified] = useState("");

    //for wh_basic_details
    const [whId, setWhId] = useState("");
    const [whIdCreatedTimestamp, setWhIdCreatedTimestamp] = useState("");
    const [whName, setWhName] = useState("");
    const [whAddress, setWhAddress] = useState("");
    const [whGpsCoordinates, setWhGpsCoordinates] = useState("");
    const [whType, setWhType] = useState("");
    const [whTotalSpace, setWhTotalSpace] = useState("");
    const [whLandArea, setWhLandArea] = useState("");

    // const [isActive_basic_details, setIsActive_Basic_details] = useState("");
    // const [isVerified_basic_details, setIsVerified_Basic_details] = useState("");


    //wh_building_specification
    const [whRoofHeight, setWhRoofHeight] = useState("");
    const [whRoofType, setWhRoofType] = useState("");
    const [whHvac, setWhHvac] = useState("");
    const [whElectrical, setWhElectrical] = useState("");
    const [whFlooringType, setWhFlooringType] = useState("");
    const [whLoadingDockCount, setWhLoadingDockCount] = useState("");
    const [whLoadingDockHeight, setWhLoadingDockHeight] = useState("");
    const [whAge, setWhAge] = useState("");
    const [whLoadingDockSize, setWhLoadingDockSize] = useState("");
    // const [isActive_buil_spec, setIsActive_build_spec] = useState("");
    // const [isVerified_buil_spec, setIsVerified_build_spec] = useState("");


    //wh_rental_information
    const [whRentalID, setWhRentalID] = useState("");
    const [whRentalCreatedTimestamp, setWhRentalCreatedTimestamp] = useState("");
    const [whRentalAvailableDate, setWhRentalAvailableDate] = useState("")
    const [whMinLease, setWhMinLease] = useState("");
    const [whMaxLease, setWhMaxLease] = useState("");
    const [whRentalRate, setWhRentalRate] = useState("");
    const [whRentalUnit, setWhRentalUnit] = useState("");
    const [whSecurityDeposit, setWhSecurityDeposit] = useState("");
    const [whLockInPeriod, setWhLockInPeriod] = useState("");
    const [whRentalIncrement, setWhRentalIncrement] = useState("");
    const [whNoticePeriod, setWhNoticePeriod] = useState("");
    const [whRentFreePeriod, setWhRentFreePeriod] = useState("");

    // const [whRentalIsActive, setWhRentalIsActive] = useState("");
    // const [whRentalIsVerified, setWhRentalIsVerified] = useState("");


    const [RequirementPostID, setRequirementPostID] = useState("");
    const [RequirementIdCreatedTimeStamp, setRequirementIdCreatedTimeStamp] = useState("");
    const [RequirementStartDate, setRequirementStartDate] = useState("");
    const [RequirementLocation, setRequirementLocation] = useState("");
    const [RequirementMaxDistance, setRequirementMaxDistance] = useState("");
    const [RequirementArea, setRequirementArea] = useState("");
    const [Requirementwh, setRequirementwh] = useState("");
    const [RequirementDuration, setRequirementDuration] = useState("");
    const [RequirementOtherDetails, setRequirementOtherDetails] = useState("");
    const [RequirementRate, setRequirementRate] = useState("");
    const [CustomerId, setCustomerId] = useState("");
    const [showTooltipText, setShowTooltipText] = useState(false);
    const [landAreaUnit, setLandAreaUnit] = useState('');
    const [totalSpaceUnit, setTotalSpaceUnit] = useState('');

   
    if (
        (usrRole.length == 0 || usrRole == null || usrRole == "")
    ) {
        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };

        axios
            .get(
                Constants.api_gateway_host +
                "/user_profile/?WALLET_ADDRESS=" +
                walletAddress,
                { headers }
            )
            .then((res) => {
                //console.log(JSON.parse(res.request.response).response[0].user_role)
                //redirect logic
                if (res.status == 200) {
                    setUsrRole(currentUser.userRole);
                    var roleVal = currentUser.userRole;
                    console.log("roleVal--->", roleVal);
                    setWalletAddress(currentUser.userID);
                    setBrokerID("GB-" + walletAddress.toString().substring(0, 26));
                    setCarrierID("GC-" + walletAddress.toString().substring(0, 26));
                    setMotID(UniqueID(roleVal));
                    setIDLoad(UniqueID(roleVal));
                    setTimestamp(TS());
                    // setOwnerEntityId(UniqueID(roleVal));
                    setOwnerEntityId(currentUser.userID.toString().substring(0, 26));
                    // setOwnerEntityId(walletAddress.toString().substring(0, 26));
                    setOwnerId("GWO-" + currentUser.userID.toString().substring(0, 26));
                    setOwnerIdCreatedTimestamp(TS())
                    setWhId(UniqueID("WhId"));
                    
                    // setWhId(UniqueID(roleVal));
                    setWhIdCreatedTimestamp(TS());
                    setWhRentalID(UniqueID(roleVal));
                    setWhRentalCreatedTimestamp(TS());
                    setRequirementPostID("GWC-" + UniqueID(roleVal));
                    setRequirementIdCreatedTimeStamp(TS());
                    setCustomerId("GCI-" + currentUser.userID.toString().substring(0, 26));
                    setCustomerCreatedTimestamp(TS());
                }
            })
            .catch((err) => {
                console.log(err);
            });
        //console.log("ID izz--->",ID);
    }
    console.log(whId)

    const hideTooltipText = () => {
        setShowTooltipText(false);
    };

    const showTooltipTextOnHover = () => {
        setShowTooltipText(true);
    };

    const [showConversionBox, setShowConversionBox] = useState(false);
    const [conversionOption, setConversionOption] = useState('');
    const [inputArea, setInputArea] = useState('');
    const [convertedArea, setConvertedArea] = useState('');

    const toggleConversionBox = () => {
        setShowConversionBox(!showConversionBox);
    };

    const handleConversion = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setConversionOption(event.target.value);
        convertArea(inputArea, event.target.value);
    };

    //map
    const [city, setCity] = useState("");
    const [cityCoordinates, setCityCoordinates] = useState(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default coordinates for India

    const handleSearch = () => {
        // You can use a geocoding API to convert the city name to coordinates.
        // For this example, we will use a hardcoded list of coordinates for some Indian cities.
        const cityCoordinates: Record<string, [number, number]> = {
            Mumbai: [19.0760, 72.8777],
            Delhi: [28.7041, 77.1025],
            Bengaluru: [12.9716, 77.5946],
        };

        if (city in cityCoordinates) {
            setMapCenter(cityCoordinates[city]);
        } else {
            alert('City not found');
        }
    };
    const [mapVisible, setMapVisible] = useState(false);

    const toggleMapVisibility = () => {
        setMapVisible(!mapVisible);
    };


    const getUserLocation = async () => {
        if (city) {
            try {
                const response = await axios.get(
                    `https://apis.mapmyindia.com/advancedmaps/v1/YOUR_API_KEY/geo_code?addr=${city}`
                );
                const { lat, lng } = response.data.results[0];
                setUserLocation([lat, lng]);
            } catch (error) {
                console.log('Error retrieving city coordinates:', error);
            }
        }
    };
    const getCityCoordinates = async () => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&country=India&format=json`);
        const data = await response.json();
        if (data.length > 0) {
            setCityCoordinates({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        } else {
            alert("City not found");
        }
    };


    const convertArea = (area: string, option: string) => {
        const areaValue = parseFloat(area);
        let result = 0;

        if (isNaN(areaValue)) {
            setConvertedArea('');
            return;
        }

        switch (option) {
            case 'sqft_to_sqm':
                result = areaValue * 0.092903;
                break;
            case 'sqm_to_sqft':
                result = areaValue * 10.764;
                break;
            case 'acre_to_hectare':
                result = areaValue * 0.404686;
                break;
            case 'hectare_to_acre':
                result = areaValue * 2.47105;
                break;
            case 'acre_to_sqm':
                result = areaValue * 4046.86;
                break;
            case 'sqm_to_acre':
                result = areaValue * 0.000247105;
                break;
            case 'hectare_to_sqm':
                result = areaValue * 10000;
                break;
            case 'sqm_to_hectare':
                result = areaValue * 0.0001;
                break;
            default:
                result = 0;
        }

        setConvertedArea(result.toFixed(2));
    };

    const handleAreaInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputArea(event.target.value);
        convertArea(event.target.value, conversionOption);
    };



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
        setTotalSpaceUnit(unit.value);
    };




    //new map
    const [cityName, setCityName] = useState('');
    const handleLocationSelect = (coordinates) => {
        setWhGpsCoordinates(coordinates);
    };

    // function LocationMarker() {
    //   const [position, setPosition] = useState<[number, number] | null>(null);
    //   const map = useMapEvents({
    //     click: (e) => {
    //       setPosition(e.latlng);
    //       setWhGpsCoordinates(`${e.latlng.lat}, ${e.latlng.lng}`);
    //     },
    //   });


    //   return position === null ? null : (
    //     <Marker position={position}>
    //       {/* <Popup>
    //         {`Latitude: ${position[0]}, Longitude: ${position[1]}`}
    //       </Popup> */}
    //     </Marker>
    //   );
    // }
    const [pincode, setPincode] = React.useState('');
    const [map, setMap] = React.useState(null);
    const [latLong, setLatLong] = React.useState([26.7922, 82.1999]);
    const handlePincodeSearch = async () => {
        try {
            const targetUrl = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=50be9a80ff994f92b0a3eef116b37f93`;
            const response = await fetch(targetUrl);
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const location = data.results[0].geometry;
                const latitude = location.lat;
                const longitude = location.lng;
                if (latitude && longitude) {
                    setLatLong([latitude, longitude]);
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

                } else {
                    throw new Error('Invalid latitude or longitude');
                }
            } else {
                throw new Error('Geocoding data not available');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const MapClickEvent = ({ setCoordinates }) => {
        const map = useMapEvents({
            click: (event) => {
                const { lat, lng } = event.latlng;
                setCoordinates(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
            },
        });
        return null;
    };


    const handleMapClick = (event) => {
        setWhGpsCoordinates(event.latlng);
    };


    //setUserRole(get_user_role())

    //Code for conversion of human into Unix
    // var Stamp = moment('').valueOf();
    // console.log("conversion is " , Stamp)
    const { register, handleSubmit, reset } = useForm();
    // function successNotification (){
    //   addNotification({
    //     title: 'Success',
    //     subtitle: 'You have successfully submitted',
    //     message: 'Welcome to GeeksforGeeks',
    //     theme: 'light',
    //     closeButton:"X",
    //     backgroundTop:"green",
    //     backgroundBottom:"yellowgreen"
    //   })
    // };
    function epoch(date) {
        return Date.parse(date);
    }
    function clearFields(event) {
        Array.from(event.target).forEach((e) => (e.value = ""));
    }
    const handleMultiSelect = (selectedItems) => {
        const selects = [];
        for (let i = 0; i < selectedItems.length; i++) {
            selects.push(selectedItems[i]["value"]);
        }
        //console.log("tags are --->" + selects)
        const selectStr = JSON.stringify(selects);
        setSelectedTags(selects);
    };
    const [isCollapsed1, setIsCollapsed1] = useState(true);
    const [isCollapsed2, setIsCollapsed2] = useState(true);
    const [isCollapsed3, setIsCollapsed3] = useState(true);


    //
    // const whBasicDetailfinal = {
    //   WH_NAME: whName,
    //   WH_ADDRESS: whAddress,
    //   WH_GPS_COORDINATES: whGpsCoordinates,
    //   WH_TYPE: whType,
    //   WH_TOTAL_SPACE: whTotalSpace,
    //   WH_LAND_AREA: whLandArea,
    //   IS_ACTIVE: isActive_basic_details,
    //   IS_VERIFIED: isVerified_basic_details
    // };
    // const defaultBasicDetailValues = {
    //   WH_NAME: "",
    //   WH_ADDRESS: "",
    //   WH_GPS_COORDINATES: "",
    //   WH_TYPE: "",
    //   WH_TOTAL_SPACE: "",
    //   WH_LAND_AREA: "",
    //   IS_ACTIVE: "",
    //   IS_VERIFIED: ""
    // };


    // Define the original/default values for each field
    const whBuildingSpecsFinal = {
        WH_ROOF_HEIGHT: whRoofHeight,
        WH_ROOF_TYPE: whRoofType,
        WH_HVAC: whHvac,
        WH_ELECTRICAL: whElectrical,
        WH_FLOORING_TYPE: whFlooringType,
        WH_LOADING_DOCK_COUNT: whLoadingDockCount,
        WH_LOADING_DOCK_HEIGHT: whLoadingDockHeight,
        WH_AGE: whAge,
        WH_LOADING_DOCK_SIZE: whLoadingDockSize,
        // IS_ACTIVE: isActive_buil_spec,
        // IS_VERIFIED: isVerified_buil_spec
    };

    // Define the original/default values for each field
    const defaultBuildingSpecValues = {
        WH_ROOF_HEIGHT: "",
        WH_ROOF_TYPE: "",
        WH_HVAC: "",
        WH_ELECTRICAL: "",
        WH_FLOORING_TYPE: "",
        WH_LOADING_DOCK_COUNT: "",
        WH_LOADING_DOCK_HEIGHT: "",
        WH_AGE: "",
        WH_LOADING_DOCK_SIZE: "",
        // IS_ACTIVE: "",
        // IS_VERIFIED: ""
    };

    const whRentalDetailsFinal = {
        WH_RENTAL_AVAILABLE_DATE: whRentalAvailableDate,
        WH_MIN_LEASE: whMinLease,
        WH_MAX_LEASE: whMaxLease,
        WH_RENTAL_RATE: whRentalRate,
        WH_RENTAL_UNIT: whRentalUnit,
        WH_SECURITY_DEPOSIT: whSecurityDeposit,
        WH_LOCK_IN_PERIOD: whLockInPeriod,
        WH_RENTAL_INCREMENT: whRentalIncrement,
        WH_NOTICE_PERIOD: whNoticePeriod,
        WH_RENT_FREE_PERIOD: whRentFreePeriod,
        // WH_RENTAL_IS_ACTIVE: whRentalIsActive,
        // WH_RENTAL_IS_VERIFIED: whRentalIsVerified
    };

    // Define the original/default values for each field
    const defaultRentalDetailsValues = {
        WH_RENTAL_AVAILABLE_DATE: "",
        WH_MIN_LEASE: "",
        WH_MAX_LEASE: "",
        WH_RENTAL_RATE: "",
        WH_RENTAL_UNIT: "",
        WH_SECURITY_DEPOSIT: "",
        WH_LOCK_IN_PERIOD: "",
        WH_RENTAL_INCREMENT: "",
        WH_NOTICE_PERIOD: "",
        WH_RENT_FREE_PERIOD: "",
        // WH_RENTAL_IS_ACTIVE: "",
        // WH_RENTAL_IS_VERIFIED: ""
    };





    const CustomTooltip = (props) => (
        <Tooltip
            id="custom-tooltip"
            {...props}
            style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '5px',
                borderRadius: '4px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            This is the tooltip text
        </Tooltip>
    );




    // Compare the current value of each field with its default value
    // const fieldsChanged = Object.keys(defaultBasicDetailValues).filter(field => {
    //   const currentValue = whBasicDetailfinal[field];
    //   const defaultValue = defaultBasicDetailValues[field];
    //   return currentValue !== defaultValue;
    // }); 
    const whBasicDetailsFieldsChanged = Object.keys(defaultBuildingSpecValues).filter(
        field => {
            const currentValue = whBuildingSpecsFinal[field];
            const defaultValue = defaultBuildingSpecValues[field];
            return currentValue !== defaultValue;
        }
    );

    const buildingSpecFieldsChanged = Object.keys(defaultBuildingSpecValues).filter(
        field => {
            const currentValue = whBuildingSpecsFinal[field];
            const defaultValue = defaultBuildingSpecValues[field];
            return currentValue !== defaultValue;
        }
    );

    const rentalInfoFieldsChanged = Object.keys(defaultRentalDetailsValues).filter(field => {
        const currentValue = whRentalDetailsFinal[field];
        const defaultValue = defaultRentalDetailsValues[field];
        return currentValue !== defaultValue;
    });


    const toggleCollapse1 = (index: number) => {
        setIsCollapsed1(!isCollapsed1);

    };

    const toggleCollapse2 = (index: number) => {
        setIsCollapsed2(!isCollapsed2);




    };
    const toggleCollapse3 = (index: number) => {
        setIsCollapsed3(!isCollapsed3);


    };





    const onSubmit = async () => {
        const article = { title: "React POST Request Example" };
        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };



        if (usrRole == "Owner") {

            const params_wh_owner_details =
                "wh_owner_details/?" +
                "OWNER_ENTITY_ID=" +
                ownerEntityId +
                "&OWNER_ID=" +
                ownerId +
                "&OWNER_ID_CREATED_TIMESTAMP=" +
                ownerIdCreatedTimestamp +
                "&OWNER_FULL_NAME=" +
                ownerFullName +
                "&OWNER_PHONE_NUMBER=" +
                ownerPhoneNumber +
                "&OWNER_EMAIL_ID=" +
                ownerEmailId +
                "&OWNER_ADDRESS=" +
                ownerAddress +
                "&OWNER_ID_DOC_TYPE=" +
                ownerIdDocType +
                "&OWNER_ID_DOC_NUMBER=" +
                ownerIdDocNumber +
                "&OWNER_ENTITY_TYPE=" +
                ownerEntityType +
                "&OWNER_ENTITY_NAME=" +
                ownerEntityName +
                "&OWNER_ENTITY_REGISTRATION_NUMBER=" +
                ownerEntityRegistrationNumber +
                "&OWNER_ENTITY_REGISTERED_ADDRESS=" +
                ownerEntityRegisteredAddress +
                "&OWNER_ENTITY_PAN=" +
                ownerEntityPAN +
                '&IS_ACTIVE=' +
                Constants.isActive +
                '&IS_VERIFIED=' +
                Constants.isVerified;

            const hostname = Constants.api_gateway_host;
            axios
                .post(Constants.api_gateway_host + "/" + params_wh_owner_details, article, {
                    headers,
                })
                .then((response) => {
                    console.log(response);
                    console.log(response.data);
                    // successNotification();
                    alert("you have filled the form !");
                    // alert(final_string)
                    // router.push("/ViewPosts");
                    clearFields(event);
                    // setSuccessFlag("true");
                })
                .catch((err) => {
                    console.log("error-->", err);
                    // setErrorFlag
                    clearFields(event);

                })


            // wh_ownwer_details_string
            const temp_wh_basic_details =
                (whBasicDetailsFieldsChanged.includes("WH_NAME") ? "&WH_NAME=" + whName : "") +
                (whBasicDetailsFieldsChanged.includes("WH_ADDRESS") ? "&WH_ADDRESS=" + whAddress : "") +
                (whBasicDetailsFieldsChanged.includes("WH_GPS_COORDINATES") ? "&WH_GPS_COORDINATES=" + whGpsCoordinates : "") +
                (whBasicDetailsFieldsChanged.includes("WH_TYPE") ? "&WH_TYPE=" + whType : "") +
                (whBasicDetailsFieldsChanged.includes("WH_TOTAL_SPACE") ? "&WH_TOTAL_SPACE=" + whTotalSpace : "") +
                (whBasicDetailsFieldsChanged.includes("WH_LAND_AREA") ? "&WH_LAND_AREA=" + whLandArea : "") +
                (whBasicDetailsFieldsChanged.includes("IS_ACTIVE") ? "&IS_ACTIVE=" + isActive_basic_details : "") +
                (whBasicDetailsFieldsChanged.includes("IS_VERIFIED") ? "&IS_VERIFIED=" + isVerified_basic_details : "");

            if (temp_wh_basic_details.trim().length !== 0) {
                const params_wh_basic_details = "wh_basic_details/?" + "WH_ID=" + whId + "&WH_ID_CREATED_TIMESTAMP=" + whIdCreatedTimestamp + "&OWNER_ENTITY_ID=" + ownerEntityId + temp_wh_basic_details;
                console.log("Wh basic" + params_wh_basic_details)
                const hostname = Constants.api_gateway_host;
                axios
                    .post(Constants.api_gateway_host + "/" + params_wh_basic_details, article, {
                        headers,
                    })
                    .then((response) => {
                        console.log(response);
                        console.log(response.data);
                        // successNotification();
                        // alert("you have filled the form !");
                        // alert(final_string)
                        // router.push("/ViewPosts");
                        clearFields(event);
                        // setSuccessFlag("true");
                    })
                    .catch((err) => {
                        console.log("error-->", err);
                        // setErrorFlag
                        clearFields(event);

                    })

            }
            else {
                const alternative_wh_basic_details = "wh_basic_details/?" + "WH_ID=" + whId + "&OWNER_ENTITY_ID=" + ownerEntityId + temp_wh_basic_details;
                console.log(alternative_wh_basic_details)
                axios
                    .post(Constants.api_gateway_host + "/" + alternative_wh_basic_details, article, {
                        headers,
                    })
                    .then((response) => {
                        console.log(response);
                        console.log(response.data);
                        // successNotification();
                        // alert("you have filled the form !");
                        // alert(final_string)
                        // router.push("/ViewPosts");
                        clearFields(event);
                        // setSuccessFlag("true");
                    })
                    .catch((err) => {
                        console.log("error-->", err);
                        // setErrorFlag
                        clearFields(event);

                    })


            }
            const params_wh_basic_details =
                "wh_basic_details/?" +
                "WH_ID=" +
                whId +
                "&OWNER_ENTITY_ID=" +
                ownerEntityId +
                "&WH_ID_CREATED_TIMESTAMP=" +
                whIdCreatedTimestamp +
                "&WH_NAME=" +
                whName +
                "&WH_ADDRESS=" +
                whAddress +
                "&WH_GPS_COORDINATES=" +
                whGpsCoordinates +
                "&WH_TYPE=" +
                whType +
                "&WH_TOTAL_SPACE=" +
                whTotalSpace +
                "&WH_LAND_AREA=" +
                whLandArea +
                '&IS_ACTIVE=' +
                Constants.isActive +
                '&IS_VERIFIED=' +
                Constants.isVerified;

            const hostname_wh_basic_details = Constants.api_gateway_host;

            axios
                .post(Constants.api_gateway_host + "/" + params_wh_basic_details, article, {
                    headers,
                })
                .then((response) => {
                    console.log(response);
                    console.log(response.data);
                    // successNotification();
                    alert("you have filled the form !");
                    // alert(final_string)
                    router.push("/ViewListing");
                    clearFields(event);
                    // setSuccessFlag("true");
                })
                .catch((err) => {
                    console.log("error-->", err);
                    // setErrorFlag
                    clearFields(event);

                })





            const temp_wh_building_specification =
                (buildingSpecFieldsChanged.includes("WH_ROOF_HEIGHT") ? "WH_ROOF_HEIGHT=" + whRoofHeight : "") +
                (buildingSpecFieldsChanged.includes("WH_ROOF_TYPE") ? "&WH_ROOF_TYPE=" + whRoofType : "") +
                (buildingSpecFieldsChanged.includes("WH_HVAC") ? "&WH_HVAC=" + whHvac : "") +
                (buildingSpecFieldsChanged.includes("WH_ELECTRICAL") ? "&WH_ELECTRICAL=" + whElectrical : "") +
                (buildingSpecFieldsChanged.includes("WH_FLOORING_TYPE") ? "&WH_FLOORING_TYPE=" + whFlooringType : "") +
                (buildingSpecFieldsChanged.includes("WH_LOADING_DOCK_COUNT") ? "&WH_LOADING_DOCK_COUNT=" + whLoadingDockCount : "") +
                (buildingSpecFieldsChanged.includes("WH_LOADING_DOCK_HEIGHT") ? "&WH_LOADING_DOCK_HEIGHT=" + whLoadingDockHeight : "") +
                (buildingSpecFieldsChanged.includes("WH_AGE") ? "&WH_AGE=" + whAge : "") +
                (buildingSpecFieldsChanged.includes("WH_LOADING_DOCK_SIZE") ? "&WH_LOADING_DOCK_SIZE=" + whLoadingDockSize : "");


            if (temp_wh_building_specification !== '') {
                const params_wh_building_spec = "wh_building_specification/?" + temp_wh_building_specification + "&WH_ID=" + whId + "&IS_ACTIVE=" + Constants.isActive + "&IS_VERIFIED=" + Constants.isVerified;
                const hostname = Constants.api_gateway_host;
                axios
                    .post(Constants.api_gateway_host + "/" + params_wh_building_spec, article, {
                        headers,
                    })
                    .then((response) => {
                        console.log(response);
                        console.log(response.data);
                        // successNotification();
                        // alert("you have filled the form !");
                        // alert(final_string)
                        // router.push("/ViewPosts");
                        clearFields(event);
                        // setSuccessFlag("true");
                    })
                    .catch((err) => {
                        console.log("error-->", err);
                        // setErrorFlag
                        clearFields(event);

                    });
            }



            const temp_wh_rental_info =
                (rentalInfoFieldsChanged.includes("WH_RENTAL_AVAILABLE_DATE") ? "&WH_RENTAL_AVAILABLE_DATE=" + whRentalAvailableDate : "") +
                (rentalInfoFieldsChanged.includes("WH_MIN_LEASE") ? "&WH_MIN_LEASE=" + whMinLease : "") +
                (rentalInfoFieldsChanged.includes("WH_MAX_LEASE") ? "&WH_MAX_LEASE=" + whMaxLease : "") +
                (rentalInfoFieldsChanged.includes("WH_RENTAL_RATE") ? "&WH_RENTAL_RATE=" + whRentalRate : "") +
                (rentalInfoFieldsChanged.includes("WH_RENTAL_UNIT") ? "&WH_RENTAL_UNIT=" + whRentalUnit : "") +
                (rentalInfoFieldsChanged.includes("WH_SECURITY_DEPOSIT") ? "&WH_SECURITY_DEPOSIT=" + whSecurityDeposit : "") +
                (rentalInfoFieldsChanged.includes("WH_LOCK_IN_PERIOD") ? "&WH_LOCK_IN_PERIOD=" + whLockInPeriod : "") +
                (rentalInfoFieldsChanged.includes("WH_RENTAL_INCREMENT") ? "&WH_RENTAL_INCREMENT=" + whRentalIncrement : "") +
                (rentalInfoFieldsChanged.includes("WH_NOTICE_PERIOD") ? "&WH_NOTICE_PERIOD=" + whNoticePeriod : "") +
                (rentalInfoFieldsChanged.includes("WH_RENT_FREE_PERIOD") ? "&WH_RENT_FREE_PERIOD=" + whRentFreePeriod : "");
            // (rentalInfoFieldsChanged.includes("IS_ACTIVE_RENTAL_INFO") ? "&IS_ACTIVE_RENTAL_INFO=" + whRentalIsActive : "") +
            // (rentalInfoFieldsChanged.includes("IS_VERIFIED_RENTAL_INFO") ? "&IS_VERIFIED_RENTAL_INFO=" + whRentalIsVerified : "");

            if (temp_wh_rental_info !== '') {
                const params_wh_rental_info = "wh_rental_information/?" + "WH_RENTAL_ID=" + whRentalID + "&WH_RENTAL_ID_CREATED_TIMESTAMP=" + whRentalCreatedTimestamp + temp_wh_rental_info + "&WH_ID=" + whId + "&IS_ACTIVE=" + Constants.isActive + "&IS_VERIFIED=" + Constants.isVerified;

                const hostname = Constants.api_gateway_host;
                axios
                    .post(Constants.api_gateway_host + "/" + params_wh_rental_info, article, {
                        headers,
                    })
                    .then((response) => {
                        console.log(response);
                        console.log(response.data);
                        // successNotification();
                        //  alert("you have filled the form !");
                        // alert(final_string)
                        // router.push("/ViewPosts");
                        clearFields(event);
                        // setSuccessFlag("true");
                    })
                    .catch((err) => {
                        console.log("error-->", err);
                        // setErrorFlag
                        clearFields(event);

                    });
            }

        }

    };

    const [open, setOpen] = useState('1');

    const toggle = (id) => {
        if (open === id) {
            setOpen();
        } else {
            setOpen(id);
        }
    };



    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFiles([...event.target.files]);
    };

    const handleUpload = async () => {
        if (selectedFiles.length > 0) {
            try {
                for (const file of selectedFiles) {
                    await uploadFile(file);
                }
                alert("Images uploaded successfully!");
            } catch (error) {
                console.error("Error uploading images:", error);
                alert("Failed to upload images.");
            }
        } else {
            alert("Please select at least one image to upload.");
        }
    };

    // upload web3modal declaration
    const [modalVisible, setModalVisible] = useState(false);
    const [localImages, setLocalImages] = useState([]);
    const [uploadedCIDs, setUploadedCIDs] = useState([]);

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleLocalUpload = async (uploadedImages) => {
        setLocalImages((prevImages) => [...prevImages, ...uploadedImages]);

    };



    const uploadWeb3Api = async (imageCID: string, isThumbnail: boolean) => {
        const article = { title: "React POST Request Example" };

        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };

        const params =
            "wh_media_storage_cid/?" +
            "CID=" +
            imageCID +
            "&WH_ID=" +
            whId +
            "&OWNER_ENTITY_ID=" +
            ownerEntityId +
            "&IS_THUMBNAIL=" +
            (isThumbnail ? "True" : "False") + // Set IS_THUMBNAIL based on the isThumbnail parameter
            "&IS_ACTIVE=" +
            Constants.isActive +
            "&IS_VERIFIED=" +
            Constants.isVerified;
        console.log(params)
        try {
            const response = await axios.post(
                Constants.api_gateway_host + "/" + params,
                article,
                {
                    headers,
                }
            );
            console.log("POST request response:", response.data);
        } catch (error) {
            console.error("Error sending POST request:", error);
        }
    };

    const handleWeb3Upload = async () => {
        try {
            const successfullyUploadedCIDs = []; // Store CIDs that are successfully uploaded

            for (const key in localStorage) {
                if (localStorage.hasOwnProperty(key) && key.startsWith("image_")) {
                    const localImageUrl = localStorage[key];
                    const response = await fetch(localImageUrl);
                    console.log("local storage fetch : ");
                    console.log(response);
                    const blob = await response.blob();

                    // Forcefully set the MIME type to 'image/jpeg' for example.
                    // You can adjust this based on the expected image type.
                    const file = new File([blob], key.replace("image_", ""), {
                        type: "image/jpeg",
                    });

                    try {
                        const cid = await uploadFile(file);
                        successfullyUploadedCIDs.push(cid);

                        localStorage.removeItem(key); // Remove the entry from localStorage on successful upload
                    } catch (uploadError) {
                        console.error("Error uploading image:", uploadError);
                    }
                }
            }

            setUploadedCIDs(successfullyUploadedCIDs);
            console.log("Uploaded CIDs:", successfullyUploadedCIDs);

            // Handle thumbnail logic for the uploaded images
            for (let i = 0; i < successfullyUploadedCIDs.length; i++) {
                try {
                    const isThumbnail = i === 0; // First image is the thumbnail
                    uploadWeb3Api(successfullyUploadedCIDs[i], isThumbnail);
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (error) {
            console.error("Error uploading images to Web3 Storage:", error);
            alert("Failed to upload images to Web3 Storage.");
        }
    };



    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const getRecordsSize = async (id) => {
        const res = await axios.get(Constants.api_gateway_host + '/wh_basic_details_data_size/?OWNER_ENTITY_ID=' + id);
        const data = await res.data;
        console.log(data)    
        const wh_basic_details_data_count = data.response[0].count;
        console.log(wh_basic_details_data_count)
        setTotalPages(Math.ceil(wh_basic_details_data_count / itemsPerPage));
    }

    useEffect(() => {

    }, [loading]);

    useEffect(() => {
        
        currentUser ? (
            setUsrRole(currentUser.userRole),
            setWalletAddress(currentUser.userID),
            
            setOwnerId("GWO-" + currentUser.userID?.toString().substring(0, 26)),
            setOwnerEntityId("GWO-" + currentUser.userID?.toString().substring(0, 26))) : ('')
            try {
                getRecordsSize(currentUser.userID?.toString().substring(0, 26));
            } catch (error) {
                console.log(error)
            }
    }, []);

    if (loading) {
        // Show the loading indicator while data is being fetched

        return <>
            <div className="column d-flex align-items-xl-center justify-content-center">
                <h3 className="m-3 p-3"> <ReactLoading type="spinningBubbles" color="#1a152e" /></h3>
            </div>
        </>

    }
    return (

        <>
       
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <Accordion open={open} toggle={toggle}>
                        <AccordionItem>
                            <AccordionHeader targetId="1"> Warehouse  Basic Details</AccordionHeader>
                            <AccordionBody accordionId="1">


                                <Container fluid={true}>
                                    <div className="section__title-wrapper text-center mb-60" onClick={toggleCollapse1} style={{ cursor: "pointer" }}>
                                        <br />
                                        <h2 style={{ color: "white" }} className="section__title"></h2>
                                        <br />
                                    </div>
                                    <div className="sign__form">
                                        <SolClient />
                                        <div className="mt-3">
                                            <br></br>
                                            <h4>
                                                <label>
                                                    {" "}
                                                    <b>Warehouse Basic Details Form</b>
                                                </label>
                                            </h4>
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label > Warehouse ID</Label>

                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whId}
                                                name="whId"
                                                id="whId"
                                                readOnly={true}
                                            />
                                        </div>


                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Created Timestamp</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whIdCreatedTimestamp}
                                                name="whIdCreatedTimestamp"
                                                id="whIdCreatedTimestamp"
                                                readOnly={true}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Owner Entity ID</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={ownerEntityId}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setOwnerEntityId(event.target.value);
                                                }}
                                                name="ownerEntityId"
                                                id="ownerEntityId"
                                                readOnly={true}
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Label>Warehouse Name</Label>
                                                    <div className="hover-text">
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Button
                                                                variant="link"
                                                                style={{
                                                                    backgroundColor: '#2196F3',
                                                                    borderRadius: '50%',
                                                                    border: '1px solid white',
                                                                    color: 'white',
                                                                    padding: '0.1rem',
                                                                    marginLeft: '1rem',
                                                                    marginBottom: '0.5rem',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    fontSize: '0.8rem',
                                                                }}
                                                                onMouseEnter={showTooltipTextOnHover}
                                                            >
                                                                i
                                                            </Button>
                                                            {showTooltipText && (
                                                                <span className="tooltip-text">
                                                                    This is the tooltip text
                                                                    <button className="got-it-button" onClick={hideTooltipText}>
                                                                        Got it
                                                                    </button>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whName}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhName(event.target.value);
                                                }}
                                                name="whName"
                                                id="whName"
                                            />
                                        </div>


                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Warehouse Address</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whAddress}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhAddress(event.target.value);
                                                }}
                                                name="whAddress"
                                                id="whAddress"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>GPS Coordinates</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whGpsCoordinates}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhGpsCoordinates(event.target.value);
                                                }}
                                                name="whGpsCoordinates"
                                                id="whGpsCoordinates"
                                            />
                                            <br></br>
                                            <button type="button" className="btn btn-secondary btn-lg" onClick={toggleMapVisibility}>
                                                Use Map For Help
                                            </button>
                                            {mapVisible && (
                                                <><br></br>
                                                    <div className="mt-3">
                                                        <p className="mb-3 select2-container">
                                                            <Label>Enter Your WareHouse Location Pincode</Label></p>
                                                        <Input
                                                            type="text"
                                                            maxLength={6}
                                                            value={pincode}
                                                            onChange={(event) => {
                                                                setPincode(event.target.value);
                                                            }}
                                                            name="pincode"
                                                            id="pincode"
                                                        />
                                                        <br></br>
                                                        <button className="btn btn-primary btn-lg" onClick={handlePincodeSearch}>
                                                            Search
                                                        </button>
                                                        <br></br>
                                                        <MapComponent lat={latLong[0]} lng={latLong[1]} setCoordinates={setWhGpsCoordinates} />
                                                    </div>
                                                </>
                                            )}
                                        </div>


                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>wareHouse Type</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whType}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhType(event.target.value);
                                                }}
                                                name="whType"
                                                id="whType"
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <p className="mb-3">
                                                <Label>Total Space</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                onChange={(event) => {
                                                    setWhTotalSpace(event.target.value + ' ' + totalSpaceUnit);
                                                }}
                                                name="whTotalSpace"
                                                id="whTotalSpace"
                                            />
                                            <Select
                                                options={units}
                                                onChange={handleLandAreaUnitChange}
                                                placeholder="Select unit"
                                                className="unit-dropdown"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3">
                                                <Label>Land Area</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                onChange={(event) => {
                                                    setInputArea(event.target.value + ' ' + landAreaUnit);
                                                }}
                                                name="whLandArea"
                                                id="whLandArea"
                                            />
                                            <Select
                                                options={units}
                                                onChange={handleTotalSpaceUnitChange}
                                                placeholder="Select unit"
                                                className="unit-dropdown"
                                            />

                                            <button
                                                className="conversion-button"
                                                style={{
                                                    backgroundColor: 'white',
                                                    color: 'black',
                                                    padding: '10px 20px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #4CAF50',
                                                    marginTop: '15px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                }}
                                                onClick={toggleConversionBox}
                                            >
                                                Need Help In Conversion
                                            </button>
                                            {showConversionBox && (
                                                <div
                                                    className="conversion-box"
                                                    style={{
                                                        backgroundColor: '#f9f9f9',
                                                        borderRadius: '8px',
                                                        padding: '20px',
                                                        marginTop: '10px',
                                                        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
                                                    }}
                                                >
                                                    <select
                                                        value={conversionOption}
                                                        onChange={handleConversion}
                                                        style={{
                                                            borderRadius: '4px',
                                                            border: '1px solid #ccc',
                                                            padding: '8px 12px',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        <option value="">Select conversion option</option>
                                                        <option value="sqft_to_sqm">Square feet to square meters</option>
                                                        <option value="sqm_to_sqft">Square meters to square feet</option>
                                                        <option value="acre_to_hectare">Acres to hectares</option>
                                                        <option value="hectare_to_acre">Hectares to acres</option>
                                                        <option value="acre_to_sqm">Acres to square meters</option>
                                                        <option value="sqm_to_acre">Square meters to acres</option>
                                                        <option value="hectare_to_sqm">Hectares to square meters</option>
                                                        <option value="sqm_to_hectare">Square meters to hectares</option>
                                                    </select>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}
                                                    ><Input
                                                            type="text"
                                                            maxLength={50}
                                                            value={inputArea}
                                                            onChange={handleAreaInput}
                                                            style={{
                                                                width: '40%',
                                                                marginRight: '10px',
                                                            }}
                                                        />
                                                        <span style={{ marginRight: '10px' }}>→</span>
                                                        <Input
                                                            type="text"
                                                            maxLength={50}
                                                            value={convertedArea}
                                                            readOnly
                                                            style={{
                                                                width: '40%',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>


                                    </div>


                                </Container>
                            </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionHeader targetId="2">Warehouse Building Specification</AccordionHeader>
                            <AccordionBody accordionId="2">







                                <Container fluid={true}>
                                    <div
                                        className="section__title-wrapper text-center mb-60"
                                        onClick={toggleCollapse2}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <br />
                                        <h2 style={{ color: "white" }} className="section__title">

                                        </h2>
                                        <br />
                                    </div>

                                    <div className="sign__form">
                                        <SolClient />
                                        <div className="mt-3">
                                            <br></br>
                                            <h4>
                                                <label>
                                                    {" "}
                                                    <b>Building Specifications Form</b>
                                                </label>
                                            </h4>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label> WH Roof Height</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whRoofHeight}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhRoofHeight(event.target.value);
                                                    }}
                                                    name="whRoofHeight"
                                                    id="whRoofHeight"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>WH Roof Type</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whRoofType}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhRoofType(event.target.value);
                                                    }}
                                                    name="whRoofType"
                                                    id="whRoofType"
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <p className="mb-3 select2-container">
                                                    <Label>WH HVAC</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whHvac}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhHvac(event.target.value);
                                                    }}
                                                    name="whHvac"
                                                    id="whHvac"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>WH Electrical</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whElectrical}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhElectrical(event.target.value);
                                                    }}
                                                    name="whElectrical"
                                                    id="whElectrical"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>WH Flooring Type</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whFlooringType}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhFlooringType(event.target.value);
                                                    }}
                                                    name="whFlooringType"
                                                    id="whFlooringType"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>WH Loading Dock Count</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whLoadingDockCount}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhLoadingDockCount(event.target.value);
                                                    }}
                                                    name="whLoadingDockCount"
                                                    id="whLoadingDockCount"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>WH Loading Dock Height</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whLoadingDockHeight}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhLoadingDockHeight(event.target.value);
                                                    }}
                                                    name="whLoadingDockHeight"
                                                    id="whLoadingDockHeight"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>WH Age</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whAge}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhAge(event.target.value);
                                                    }}
                                                    name="whAge"
                                                    id="whAge"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>WH Loading Dock Size</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whLoadingDockSize}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setWhLoadingDockSize(event.target.value);
                                                    }}
                                                    name="whLoadingDockSize"
                                                    id="whLoadingDockSize"
                                                />
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>WareHouse Id</Label>
                                                </p>
                                                <Input
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={whId}
                                                    // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    //   setWhId(event.target.value);
                                                    // }}
                                                    name="whId"
                                                    id="whId"
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <Button onClick={handleOpenModal}>
                                                    Open Image Upload Modal
                                                </Button>
                                                <ImageUploadModal
                                                    show={modalVisible}
                                                    onClose={handleModalClose}
                                                    onLocalUpload={handleLocalUpload}
                                                />
                                                <br />
                                                <Button className="mt-1" onClick={handleWeb3Upload}>
                                                    Submit
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </Container>
                            </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionHeader targetId="3">Warehouse Rental Specification</AccordionHeader>
                            <AccordionBody accordionId="3">
                                <Container fluid={true}>
                                    <div
                                        className="section__title-wrapper text-center mb-60"
                                        onClick={toggleCollapse3}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <br />
                                        <h2 style={{ color: "white" }} className="section__title">

                                        </h2>
                                        <br />
                                    </div>

                                    <div className="sign__form">
                                        <SolClient />
                                        <div className="mt-3">
                                            <br />
                                            <h4>
                                                <label>
                                                    {" "}
                                                    <b>Warehouse Rental Information Form</b>
                                                </label>
                                            </h4>
                                        </div>

                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label> Warehouse Rental ID</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whRentalID}
                                                name="whRentalID"
                                                id="whRentalID"
                                                readOnly={true}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Rental Created Timestamp</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whRentalCreatedTimestamp}
                                                name="whRentalCreatedTimestamp"
                                                id="whRentalCreatedTimestamp"
                                                readOnly={true}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Available For Rent Date</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whRentalAvailableDate}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhRentalAvailableDate(event.target.value);
                                                }}
                                                name="whRentalAvailableDate"
                                                id="whRentalAvailableDate"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Minimum Lease Duration</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whMinLease}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhMinLease(event.target.value);
                                                }}
                                                name="whMinLease"
                                                id="whMinLease"
                                            />
                                        </div>


                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Maximum Lease Duration</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whMaxLease}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhMaxLease(event.target.value);
                                                }}
                                                name="whMaxLease"
                                                id="whMaxLease"
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Rental Rate</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whRentalRate}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhRentalRate(event.target.value);
                                                }}
                                                name="whRentalRate"
                                                id="whRentalRate"
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Rental Unit</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whRentalUnit}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhRentalUnit(event.target.value);
                                                }}
                                                name="whRentalUnit"
                                                id="whRentalUnit"
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Security Deposit</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whSecurityDeposit}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhSecurityDeposit(event.target.value);
                                                }}
                                                name="whSecurityDeposit"
                                                id="whSecurityDeposit"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Lock-In Period</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whLockInPeriod}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhLockInPeriod(event.target.value);
                                                }}
                                                name="whLockInPeriod"
                                                id="whLockInPeriod"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Rental Increment</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whRentalIncrement}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhRentalIncrement(event.target.value);
                                                }}
                                                name="whRentalIncrement"
                                                id="whRentalIncrement"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Notice Period</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whNoticePeriod}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhNoticePeriod(event.target.value);
                                                }}
                                                name="whNoticePeriod"
                                                id="whNoticePeriod"
                                            />

                                        </div>
                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>Rent Free Period</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whRentFreePeriod}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhRentFreePeriod(event.target.value);
                                                }}
                                                name="whRentFreePeriod"
                                                id="whRentFreePeriod"
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <p className="mb-3 select2-container">
                                                <Label>WareHouse ID</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={whId}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setWhId(event.target.value);
                                                }}
                                                name="whId"
                                                id="whId"
                                            />
                                        </div>

                    </div>


                                </Container>
                            </AccordionBody>
                        </AccordionItem>
                    </Accordion>

                    <div className="mt-3">
                        <br></br>
                        <button type="submit" className="m-btn m-btn-4 w-100">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>

    )
}

export default NewPostOwner;