// @ts-nocheck 
'use client'
import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Alert, Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
// import "@vtaits/react-color-picker/dist/index.css"
// import "react-datepicker/dist/react-datepicker.css"
// import "flatpickr/dist/themes/material_blue.css"
import { TS } from "../../../utils/currentTimestamp";
import * as Constants from "../../../utils/constants";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { checkUserExists, updateUserDocument } from "../../../firebase/firebase"
import ReactLoading from 'react-loading';


//Auth
import { useAuth } from "../../../contexts/UserContext";

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { UniqueID } from "../../../utils/uuidGenerate";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { notify } from "../../../utils/notifications";
const OwnerProfile = () => {
    const [start, setstart] = useState(true);
    const router = useRouter()
    const { currentUser, handleUpdateUserAttributes } = useAuth()
    console.log(currentUser)
    const [userExistsDB, setUserExistsDB] = useState(false);
    const [ownerDetail, setOwnerDetails] = useState({
        'owner_id': currentUser?.userID,
        'owner_entity_id': currentUser?.userID || currentUser.sub || '',
        'owner_id_created_timestamp': TS(),
        'owner_full_name': currentUser?.userFullName || '',
        'owner_phone_number': currentUser?.phoneNumber || '',
        'owner_email_id': currentUser?.email || '',
        'owner_address': '',
        'owner_id_doc_type': '',
        'owner_id_doc_number': '',
        'owner_entity_type': '',
        'owner_entity_name': '',
        'owner_entity_registration_number': '',
        'owner_entity_registered_address': '',
        'owner_entity_pan': '',
        'is_active': Constants.isActive,
        'is_verified': Constants.isVerified,
        'gst_number': '',
        // 'username': currentUser?.username || '' // Not saved in owner details table
    })
    console.log("ownerDetail")
    console.log(ownerDetail)
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [fullNameError, setFullNameError] = useState("");
    const [idDocNumberError, setIdDocNumberError] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageGST, seterrorMessageGST] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenEntityType, setDropdownOpenEntityType] = useState(false);
    const [modal, setModal] = useState(false)
    const panInputRef = useRef(null);
    const fullNameInputRef = useRef(null);
    const idDocNumberInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const phoneNumberInputRef = useRef(null);
    const [deleteModal, setdeleteModal] = useState(false);
    const deleteToggle = () => {
        setdeleteModal(!deleteModal);
    }



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
                .get(Constants.local_api_gateway_host + `/ownerDetails`)
                .then((response) => {
                    const userExists = response.data.response.response.length > 0;
                    setUserExistsDB(userExists)
                    console.log(userExists)

                    if (userExists) {
                        console.log("inside if-->")
                        const updatedOwnerDetails = {
                            ...response.data.response.response[0],
                            // username: currentUser.username,
                        };
                        const ownerDetailTemp=ownerDetail;
                        for(const key in updatedOwnerDetails){
                            if(updatedOwnerDetails[key]=='undefined'){
                                updatedOwnerDetails[key]='';
                            }
                        }
                        ownerDetailTemp.gst_number=updatedOwnerDetails.gst_number;
                        ownerDetailTemp.owner_address=updatedOwnerDetails.owner_address;
                        ownerDetailTemp.owner_entity_name=updatedOwnerDetails.owner_entity_name;
                        ownerDetailTemp.owner_entity_pan=updatedOwnerDetails.owner_entity_pan;
                        ownerDetailTemp.owner_entity_registered_address=updatedOwnerDetails.owner_entity_registered_address;
                        ownerDetailTemp.owner_entity_registration_number=updatedOwnerDetails.owner_entity_registration_number;
                        ownerDetailTemp.owner_entity_type=updatedOwnerDetails.owner_entity_type;
                        ownerDetailTemp.owner_full_name=updatedOwnerDetails.owner_full_name;
                        ownerDetailTemp.owner_id_doc_number=updatedOwnerDetails.owner_id_doc_number;
                        ownerDetailTemp.owner_id_doc_type=updatedOwnerDetails.owner_id_doc_type;
                        ownerDetailTemp.owner_phone_number=updatedOwnerDetails.owner_phone_number;
                        ownerDetailTemp.username=ownerDetail.username;
                        console.log("Updated owner details")
                        console.log(updatedOwnerDetails)
                        console.log(ownerDetail)
                        console.log(ownerDetailTemp)
                        setOwnerDetails(ownerDetailTemp);

                    }
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    const handleOwnerDetailsChange = (e: any) => {
        const { name, value } = e.target;
        setOwnerDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateGst = (input) => {
        const gstinFormat = /^([0-9]){2}([A-Z]){5}([0-9]){4}([A-Z]){1}([0-9A-Z]){1}([Z]){1}([0-9A-Z]){1}?$/;
        if (gstinFormat.test(input)) {
            seterrorMessageGST('');
        } else {
            seterrorMessageGST('Please Enter Valid GSTIN Number');
        }
    }
    const validatePAN = (input) => {
        const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
        if (regpan.test(input)) {
            setErrorMessage('');
        } else {
            setErrorMessage('Please enter correct PAN Card Number');
        }
    };

    const validateEmail = (email) => {
        const regex = /^[\w-]+(\.[\w-]+)*@(gmail|outlook|yahoo)\.com$/i;
        return regex.test(email);
    };

    const validatePhoneNumber = (number) => {
        const regex = /^[1-9][0-9]{9}$/;
        if (regex.test(number)) {
            setPhoneNumberError('');
        } else {
            setPhoneNumberError('Please enter a 10-digit phone number that does not start with 0');
        }
    };

    const validateAndConfirm = () => {
        if (ownerDetail.owner_full_name.trim() === "") {
            setFullNameError("Please enter your full name.");
            notifyInfo("Please enter your full name.")
            fullNameInputRef.current.focus();
            // const position = fullNameInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else if (ownerDetail.owner_email_id.trim() === "" || emailError !== "") {
            setEmailError("Please enter a valid Email ID.");
            notifyInfo("Please enter a valid Email ID.")
            emailInputRef.current.focus();
            // const position = emailInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else if (ownerDetail.owner_phone_number.trim() === "" || phoneNumberError !== "") {
            setPhoneNumberError("Please enter a valid Phone Number.");
            notifyInfo("Please enter a valid Phone Number.");
            phoneNumberInputRef.current.focus();
            // const position = phoneNumberInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else if (ownerDetail.owner_entity_pan.trim() === "" || errorMessage !== "") {
            setErrorMessage("Please enter the correct PAN Card format.");
            notifyInfo("Please enter a valid PAN Card Number.");
            panInputRef.current.focus();
            // const position = panInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else if (ownerDetail.gst_number.trim() === "" || errorMessageGST !== "") {
            setErrorMessage("Please enter the correct GST Card format.");
            notifyInfo("Please enter a valid GST Card Number.");
            panInputRef.current.focus();
            // const position = panInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        }
        else if (ownerDetail.owner_id_doc_number.trim() === "") {
            setIdDocNumberError("Please enter your ID Document Number.");
            notifyInfo("Please enter your ID Document Number.");
            idDocNumberInputRef.current.focus();
            // const position = idDocNumberInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        }
        else {
            // setCoDetails(); // call your existing setCoDetails function here
            togglemodal()
        }

    };

    const togglemodal = () => {
        setModal(!modal);
    };

    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState);
    };
    const toggleDropdownEntityType = () => {
        setDropdownOpenEntityType((prevState) => !prevState);
    };

    useEffect(() => {
        try {
            const id = ownerDetail.owner_entity_id
            getOwnerDetails(id)

        } catch (error) {
            console.log(error)
        }
    }, [start])


    const checkUsernameExists = async (username) => {
        try {

            const response = await axios.get(Constants.local_api_gateway_host + `/customerUsername?USER_NAME=${username}`);
            console.log("check username exists--->")
            console.log(username)
            console.log(response.data.response)
            return response.data.response;
        } catch (error) {
            console.log(error);
            return error;
        }

    }

    const checkAllDetailsSubmitted = () => {
        // Exclude the 'is_active', 'is_verified', and 'username' fields from the check
        const fieldsToCheck = { ...ownerDetail };
        delete fieldsToCheck.is_active;
        delete fieldsToCheck.is_verified;

        // Check if all fields are filled
        const allFieldsFilled = Object.values(fieldsToCheck).every(value => value !== '');

        return allFieldsFilled;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkAllDetailsSubmitted()) {
            notifyInfo("Please fill all the details before submitting");
        }

        notifyInfo("Your Details will be updated soon")
        setLoading(true)
        console.log("Form Submitted")
        console.log(
            ownerDetail
        )


        try {

            const usernameExists = await checkUsernameExists(ownerDetail.username);
            if(usernameExists){

                alert("Cannot create user, username already in use");
                setLoading(false);
                return;
            }
            if (usernameExists && !userExistsDB && ownerDetail.username !== currentUser.username) {
                notifyError("Cannot create user, username already in use")
                setLoading(false)
                return;
            }
            // await updateUserDocument(currentUser.userID, fieldsToUpdate);
            console.log('User document updated successfully');
            console.log(ownerDetail)
            handleUpdateUserAttributes(ownerDetail);
            // setOwnerDetails(...ownerDetail,[])
            //Backend Calls
            const article = { title: 'React PUT USER PROFILE' };

            const headers = {
                'Authorization': 'Bearer mytoken',
                'accept': 'application/json'
            };

            const updatedUserDetails = '?WALLET_ADDRESS=' + ownerDetail.owner_entity_id + '&USER_ROLE=' + currentUser.userRole + '&EMAIL_ADDRESS=' + ownerDetail.owner_email_id + '&USER_NAME=' + ownerDetail.username + '&IS_ACTIVE=' + Constants.isActive;

            const updatedOwnerDetails = "?OWNER_ENTITY_ID=" + ownerDetail.owner_entity_id + "&OWNER_ID=" + ownerDetail.owner_id + "&OWNER_ID_CREATED_TIMESTAMP=" + ownerDetail.owner_id_created_timestamp +
                "&OWNER_FULL_NAME=" + ownerDetail.owner_full_name + "&OWNER_PHONE_NUMBER=" + ownerDetail.owner_phone_number +
                "&OWNER_EMAIL_ID=" + ownerDetail.owner_email_id + "&OWNER_ADDRESS=" + ownerDetail.owner_address + "&OWNER_ID_DOC_TYPE=" +
                ownerDetail.owner_id_doc_type + "&OWNER_ID_DOC_NUMBER=" + ownerDetail.owner_id_doc_number + "&OWNER_ENTITY_TYPE=" + ownerDetail.owner_entity_type +
                "&OWNER_ENTITY_NAME=" + ownerDetail.owner_entity_name + "&OWNER_ENTITY_REGISTRATION_NUMBER=" + ownerDetail.owner_entity_registration_number +
                "&OWNER_ENTITY_REGISTERED_ADDRESS=" + ownerDetail.owner_entity_registered_address + "&OWNER_ENTITY_PAN=" + ownerDetail.owner_entity_pan + "&GST_NUMBER=" + ownerDetail.gst_number + '&IS_ACTIVE=' + Constants.isActive + '&IS_VERIFIED=' + Constants.isVerified;
            console.log(updatedUserDetails)
            console.log(userExistsDB)
            console.log(updatedOwnerDetails)

            const requests = [
                userExistsDB ?
                    axios.put(Constants.local_api_gateway_host + "/ownerDetails" + updatedOwnerDetails, article, {
                        headers,
                    }) :
                    axios.post(Constants.local_api_gateway_host + "/ownerDetails" + updatedOwnerDetails, {
                        headers,
                    }),

                userExistsDB ?
                    axios.put(Constants.local_api_gateway_host + "/userProfile" + updatedUserDetails, article, {
                        headers,
                    }) :
                    axios.post(Constants.local_api_gateway_host + "/userProfile" + updatedUserDetails, {
                        headers,
                    }),
            ];
            console.log(requests)
            axios.all(requests).then(axios.spread((responseOne, responseTwo) => {
                console.log(responseOne);
                console.log(responseTwo);
                notifySuccess('User data added successfully');
                router.push('/')

            })).catch(errors => {
                console.log(errors);
                notifyError("Error updating User data");
            });

        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <>
            <Container fluid={true} className="header__area py-4"
             style={{
                //backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://images.pexels.com/photos/192364/pexels-photo-192364.jpeg?auto=compress&cs=tinysrgb&w=600')",
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://i.pinimg.com/564x/f9/91/52/f99152427167715436079e80e751da8f.jpg')",
                backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', color: '#ffffff'}}>
                <form onSubmit={handleSubmit}>
                    <Row className="justify-content-center align-self-center">
                        <Col xs="11" sm="8" md="7" lg="5" xl="4">
                            <Card style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                backdropFilter: 'blur(10px)', 
                                padding: '20px',
                                borderRadius: '10px', 
                                boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)' 
                            }}>
                                <CardBody>
                                    <h4 className="card-title text-center">Profile details</h4>
                                    <p className="card-title-desc"></p>
                                    <FormGroup className="mb-4">
                                        <div className="mt-3">
                                            <p className="mb-10 select2-container">
                                                <Label style={{color:"#058283"}}>Role</Label>
                                            </p>

                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={currentUser ? currentUser.userRole : ''}
                                                name="userRole"
                                                id="userRole"
                                                readOnly={true}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-muted mb-10">
                                            <Label style={{color:"#058283"}}>User Name</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={30}
                                                onChange={handleOwnerDetailsChange}
                                                placeholder="Enter username"
                                                name="username"
                                                id="username"
                                                defaultValue={currentUser ? currentUser.username : ''}
                                                required
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-muted mb-10">
                                            <Label style={{color:"#058283"}}>User's Full Name</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={30}
                                                onChange={handleOwnerDetailsChange}
                                                placeholder="Enter Full Name"
                                                name="owner_full_name"
                                                id="owner_full_name"
                                                defaultValue={ownerDetail.owner_full_name}
                                                required
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-muted mb-10">
                                            <Label style={{color:"#058283"}}>Email ID</Label>
                                            </p>
                                            <Input
                                                readOnly={true}
                                                type="text"
                                                maxLength={50}
                                                onChange={handleOwnerDetailsChange}
                                                placeholder="Email ID"
                                                name="owner_email_id"
                                                id="owner_email_id"
                                                defaultValue={ownerDetail.owner_email_id}
                                                required
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-muted mb-10">
                                                <Label style={{color:"#058283"}}>Phone Number</Label>
                                                <p style={{ color: 'red', fontSize: '17px' }}>{phoneNumberError}</p>
                                            </p>

                                            <Input
                                                type="text"
                                                maxLength={10}
                                                defaultValue={ownerDetail.owner_phone_number}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    const newPhoneNumber = event.target.value;
                                                    handleOwnerDetailsChange(event);
                                                    validatePhoneNumber(newPhoneNumber);
                                                }}
                                                name="owner_phone_number"
                                                id="owner_phone_number"
                                            />
                                        </div>

                                        {/* <div className="mt-3">
                                            <p className="text-muted m-b-15">
                                               <Label style={{color:"#058283"}}>User ID</Label>
                                            </p>
                                            <Input
                                                type="text"
                                                maxLength={50}
                                                defaultValue={currentUser ? (currentUser.userID || currentUser.sub) : ''}
                                                name="userID"
                                                id="userID"
                                                readOnly={true}
                                            />
                                        </div> */}

                                    </FormGroup>


                                    <div className="text-center">
                                        <Button
                                            color="dark"
                                            className="btn btn-info  "
                                            onClick={togglemodal}
                                        >
                                            Add Details to complete your Profile
                                        </Button>
                                    </div>

                                    <Modal
                                        isOpen={modal}
                                        role="dialog"
                                        size="lg"
                                        autoFocus={true}
                                        centered
                                        id="companyDetailsModal"
                                        toggle={togglemodal}>
                                        <div className="modal-content">
                                            <ModalHeader toggle={togglemodal}>
                                                Owner Details Section
                                            </ModalHeader>

                                            <ModalBody>

                                                <div className="grid-container">
                                                    {/* <div className="grid-item">
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label> Owner Entity ID</Label>
                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={100}
                                                                defaultValue={ownerDetail.owner_entity_id}
                                                                name="owner_entity_id"
                                                                id="owner_entity_id"
                                                                readOnly={true}
                                                            />
                                                        </div>

                                                    </div> */}
                                                    <div className="grid-item">
                                                        {/* Full Name input field */}

                                                        {/* Full Name input field */}

                                                        <div className="mt-3">

                                                            <p className="mb-3 select2-container">
                                                                <Label>Full Name</Label>


                                                            </p>
                                                            {fullNameError && <span className="error-message1">{fullNameError}</span>}

                                                            <Input
                                                                ref={fullNameInputRef}

                                                                type="text"
                                                                maxLength={100}
                                                                defaultValue={ownerDetail.owner_full_name}
                                                                onChange={handleOwnerDetailsChange}
                                                                name="owner_full_name"
                                                                id="owner_full_name"

                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <div className="grid-item">
                                                        // Phone Number input field 
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label> Owner ID</Label>
                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={100}
                                                                defaultValue={ownerDetail.owner_id}
                                                                name="owner_id"
                                                                id="owner_id"
                                                                readOnly={true}
                                                            />
                                                        </div>

                                                    </div>*/}
                                                    {/* <div className="grid-item">
                                                        //Owner Entity ID input field 
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label>Created Timestamp</Label>
                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={50}
                                                                defaultValue={ownerDetail.owner_id_created_timestamp}
                                                                name="owner_id_created_timestamp"
                                                                id="owner_id_created_timestamp"
                                                                readOnly={true}
                                                            />
                                                        </div>
                                                    </div> */}
                                                    <div className="grid-item">

                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label>Email ID</Label>
                                                            </p>
                                                            <p style={{ color: 'red', fontSize: '17px' }}>{emailError}</p>



                                                            <Input
                                                                ref={emailInputRef}
                                                                readOnly={true}
                                                                type="email"
                                                                maxLength={50}
                                                                defaultValue={ownerDetail.owner_email_id}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const email = event.target.value;
                                                                    if (validateEmail(email)) {
                                                                        setEmailError('');
                                                                    } else {
                                                                        setEmailError('Please enter a Gmail, Outlook, or Yahoo email address');
                                                                    }
                                                                    handleOwnerDetailsChange(event)
                                                                }}
                                                                name="owner_email_id"
                                                                id="owner_email_id"

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid-item">
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label>Phone Number</Label>
                                                                <p style={{ color: 'red', fontSize: '17px' }}>{phoneNumberError}</p>
                                                            </p>


                                                            <Input
                                                                ref={phoneNumberInputRef}
                                                                type="text"
                                                                maxLength={10}
                                                                defaultValue={ownerDetail.owner_phone_number}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    handleOwnerDetailsChange(event)
                                                                    validatePhoneNumber(event.target.value)
                                                                }}

                                                                name="owner_phone_number"
                                                                id="owner_phone_number"

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid-item">
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label>PAN</Label>
                                                                <p style={{ color: 'red', fontSize: '17px' }}>{errorMessage}</p>
                                                            </p>
                                                            <Input
                                                                ref={panInputRef}
                                                                type="text"
                                                                maxLength={50}
                                                                defaultValue={ownerDetail.owner_entity_pan}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    handleOwnerDetailsChange(event)
                                                                    validatePAN(event.target.value);
                                                                }}
                                                                name="owner_entity_pan"
                                                                id="owner_entity_pan"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 mx-3">
                                                        <p className="mb-3 select2-container">
                                                            <Label>ID Document Type</Label>
                                                        </p>
                                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                                            <DropdownToggle caret color="info" className="sexy-dropdown">
                                                                {ownerDetail.owner_id_doc_type || 'Select ID Document Type'}
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_id_doc_type = 'Aadhar Card'
                                                                    }}
                                                                >
                                                                    Aadhar Card
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_id_doc_type = 'Voter ID'
                                                                    }}
                                                                >
                                                                    Voter ID
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_id_doc_type = 'Driving License'
                                                                    }}
                                                                >
                                                                    Driving License
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_id_doc_type = 'LLPIN'
                                                                    }}
                                                                >
                                                                    LLPIN
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_id_doc_type = 'CIN'
                                                                    }}
                                                                >
                                                                    CIN
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                    <div className="mt-3 mx-3">
                                                        <p className="mb-3 select2-container">
                                                            <Label>Managing Entity Type</Label>
                                                        </p>
                                                        <Dropdown isOpen={dropdownOpenEntityType} toggle={toggleDropdownEntityType}>
                                                            <DropdownToggle caret color="info" className="sexy-dropdown">
                                                                {ownerDetail.owner_entity_type || 'Select Managing Entity Type'}
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Individual'
                                                                    }}
                                                                >
                                                                    Individual
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Firm'
                                                                    }}
                                                                >
                                                                    Firm
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Partnership'
                                                                    }}
                                                                >
                                                                    Partnership
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Company'
                                                                    }}
                                                                >
                                                                    Company
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Cooperative Society'
                                                                    }}
                                                                >
                                                                    Cooperative Society
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Others'
                                                                    }}
                                                                >
                                                                    Others
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                    {/* <div className="mt-3 mx-3">
                                                        <p className="mb-3 select2-container">
                                                            <Label>Managing Entity Type</Label>
                                                        </p>
                                                        <Dropdown isOpen={dropdownOpenEntityType} toggle={toggleDropdownEntityType}>
                                                            <DropdownToggle caret color="info" className="sexy-dropdown">
                                                                {ownerDetail.owner_entity_type || 'Select Managing Entity Type'}
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Individual'
                                                                    }}
                                                                >
                                                                    Individual
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Firm'
                                                                    }}
                                                                >
                                                                    Firm
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Partnership'
                                                                    }}
                                                                >
                                                                    Partnership
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Company'
                                                                    }}
                                                                >
                                                                    Company
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Cooperative Society'
                                                                    }}
                                                                >
                                                                    Cooperative Society
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        ownerDetail.owner_entity_type = 'Others'
                                                                    }}
                                                                >
                                                                    Others
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div> */}

                                                    <div className="mt-3 mx-3">
                                                        <p className="mb-3 select2-container">
                                                            <Label>ID Document Number</Label>
                                                        </p>
                                                        {ownerDetail.owner_id_doc_number && <span className="error-message1">{idDocNumberError}</span>}
                                                        <Input
                                                            ref={idDocNumberInputRef}
                                                            type="text"
                                                            maxLength={50}
                                                            defaultValue={ownerDetail.owner_id_doc_number}
                                                            onChange={handleOwnerDetailsChange}
                                                            name="owner_id_doc_number"
                                                            id="owner_id_doc_number"
                                                            placeholder={`Please Enter Your ${ownerDetail.owner_id_doc_number || 'ID Document'} Number`}
                                                        />
                                                    </div>
                                                    {/* previous Entity Type changed to a dropdown  below */}
                                                    {/* <div className="grid-item">
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label>Entity Type</Label>
                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={50}
                                                                defaultValue={ownerDetail.owner_entity_type}
                                                                onChange={handleOwnerDetailsChange}
                                                                name="owner_entity_type"
                                                                id="owner_entity_type"
                                                            />
                                                        </div>
                                                    </div> */}

                                                    <div className="grid-item">
                                                        <div className="mt-0">
                                                            <p className="mb-3 select2-container">
                                                                <Label>Managing Entity Name</Label>
                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={50}
                                                                defaultValue={ownerDetail.owner_entity_name}
                                                                onChange={handleOwnerDetailsChange}
                                                                name="owner_entity_name"
                                                                id="owner_entity_name"

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid-item">
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label>WDRA Registration Number</Label>

                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={50}
                                                                defaultValue={ownerDetail.owner_entity_registration_number}
                                                                onChange={handleOwnerDetailsChange}
                                                                name="owner_entity_registration_number"
                                                                id="owner_entity_registration_number"
                                                            />
                                                        </div>

                                                    </div>
                                                    <div className="grid-item">
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label>Registered Address</Label>
                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={50}
                                                                defaultValue={ownerDetail.owner_entity_registered_address}
                                                                onChange={handleOwnerDetailsChange}
                                                                name="owner_entity_registered_address"
                                                                id="owner_entity_registered_address"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="grid-item">
                                                        <div className="mt-3">
                                                            <p className="mb-3 select2-container">
                                                                <Label>GST Number</Label>
                                                                <p style={{ color: 'red', fontSize: '17px' }}>{errorMessageGST}</p>

                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={50}
                                                                defaultValue={ownerDetail.gst_number}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    handleOwnerDetailsChange(event)
                                                                    validateGst(event.target.value);
                                                                }}
                                                                name="gst_number"
                                                                id="gst_number"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="grid-item">
                                                        <div className="">
                                                            <p className="mb-3 select2-container">
                                                                <Label>Address</Label>
                                                            </p>
                                                            <Input
                                                                type="text"
                                                                maxLength={250}
                                                                defaultValue={ownerDetail.owner_address}
                                                                onChange={handleOwnerDetailsChange}
                                                                name="owner_address"
                                                                id="owner_address"
                                                                style={{ width: '100%', minHeight: '100px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <br />
                                                <Button color="dark" className="btn btn-info" onClick={togglemodal}>
                                                    Skip for now
                                                </Button>
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <Button color="dark" className="btn btn-info " onClick={validateAndConfirm}>
                                                    Confirm
                                                </Button>
                                            </ModalBody>

                                        </div>
                                    </Modal>
                                    <div className="">

                                        <div className="pt-3 text-center">
                                            <Button color="danger" onClick={deleteToggle} className="mt-2 ">
                                                Delete Profile
                                            </Button>
                                        </div>
                                        <Modal isOpen={deleteModal} toggle={deleteToggle} className={""}>
                                            <ModalHeader toggle={deleteToggle}
                                            // close={closeBtn}
                                            >
                                                Delete Profile
                                            </ModalHeader>
                                            <ModalBody>
                                                Do you really want to delete your profile?
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="danger" onClick={() => {
                                                    deleteToggle();
                                                    console.log("deleteProfile")
                                                    //logic
                                                }}>
                                                    Delete Profile
                                                </Button>{' '}
                                                <Button color="secondary" onClick={deleteToggle}>
                                                    Cancel
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                    </div>

                                </CardBody>
                                <div className="mt-3">
                                    {
                                        loading ?
                                            <>
                                                <div className="column d-flex align-items-xl-center justify-content-center">
                                                    <h3 className="m-3 p-3"> <ReactLoading type="spinningBubbles" color="#1a152e" /></h3>
                                                </div>
                                            </> :
                                            <>
                                                <button type='submit' className="m-btn m-btn-4 w-100">Save</button>
                                            </>
                                    }
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </form>
            </Container>
        </>
    )
}

export default OwnerProfile
