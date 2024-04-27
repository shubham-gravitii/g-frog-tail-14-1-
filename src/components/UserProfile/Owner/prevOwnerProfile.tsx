"use client"
// @ts-nocheck 
import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Alert, Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row, Modal, ModalHeader, ModalBody } from "reactstrap"
import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
import Success from "../../Common/Success";
import Error from "../../Common/Error";
import "flatpickr/dist/themes/material_blue.css"
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { TS } from "../../../utils/currentTimestamp";
import * as Constants from "../../../utils/constants";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { checkUserExists, updateUserDocument } from "../../../firebase/firebase"

import Swal from 'sweetalert2';



//Auth
import { useAuth } from "../../../contexts/UserContext";

import { setUserRole } from "../../../redux/web3/roleSlice";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';



const OwnerProfile = () => {
    const { register, handleSubmit, reset } = useForm();
    //Auth
    const { currentUser, updateUser } = useAuth()
    const router = useRouter();

    const [selectedRole, setSelectedRole] = useState(currentUser ? currentUser.userRole : 'Customer')
    const [walletAddress, setWalletAddress] = useState<HTMLInputElement | void | string>()
    const [userFullName, setUserFullName] = useState<HTMLInputElement | void | string>(currentUser ? currentUser.userFullName : '')
    const [username, setUsername] = useState<HTMLInputElement | void | string>(currentUser ? currentUser.username : '')
    const [emailID, setEmailID] = useState<HTMLInputElement | void | string>(currentUser ? currentUser.email : '')
    const [phoneNumber, setPhoneNumber] = useState<HTMLInputElement | void | string>(currentUser ? currentUser.phoneNumber : '')
    const [userID, setUserID] = useState<HTMLInputElement | void | string>(currentUser ? currentUser.userID : '')
    const [skipVal, setSkipVal] = useState(false)
    const [modal, setModal] = useState(false)
    const [coDetailsFlag, setCoDetailsFlag] = useState(false)
    const [successFlag, setSuccessFlag] = useState("");
    const [errorFlag, setErrorFlag] = useState("");
    //owner usestates
    const [ownerEntityId, setOwnerEntityId] = useState("");
    const [ownerId, setOwnerId] = useState("");
    // const [ownerIdCreatedTimestamp, setOwnerIdCreatedTimestamp] = useState("");
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
    const ownerIdCreatedTimestamp = TS();
    // const ownerEntityId=UniqueID('Owner'),ownerId="GWO-"+walletAddress?.toString().substring(0, 26), ownerIdCreatedTimestamp=TS();
    //const [validationMessage, setValidationMessage] = useState("");
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const panInputRef = useRef(null);
    const fullNameInputRef = useRef(null);
    const idDocNumberInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const phoneNumberInputRef = useRef(null);
    const [fullNameError, setFullNameError] = useState("");
    const [idDocNumberError, setIdDocNumberError] = useState("");
    const modalBodyRef = useRef(null);
    //toastify notification
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
    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState);
    };
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
        return regex.test(number);
    };
    //const [emailID, setEmailID] = useState<HTMLInputElement | void | string>('')
    const togglemodal = () => {
        setModal(!modal);
    };
    // close the modal form if the user is not interested
    const toggleskip = () => {
        setSkipVal(!skipVal);
        setModal(!modal);
    };
    const setCoDetails = () => {
        setCoDetailsFlag(true);
        setModal(!modal);
        //alert(coDetailsFlag)
    };
    useEffect(() => {
        currentUser ? (setUsername(currentUser.username),
            setUserFullName(currentUser.userFullName),
            setPhoneNumber(currentUser.phoneNumber),
            setEmailID(currentUser.email),
            setUserRole(currentUser.userRole),
            setWalletAddress(currentUser.userID),
            setOwnerId("GWO-" + currentUser.userID?.toString().substring(0, 26)),
            setOwnerEntityId("GWO-" + currentUser.userID?.toString().substring(0, 26))) : ('')
    }, []);
    const validateAndConfirm = () => {
        if (ownerFullName.trim() === "") {
            setFullNameError("Please enter your full name.");
            fullNameInputRef.current.focus();
            // const position = fullNameInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else if (ownerEmailId.trim() === "" || emailError !== "") {
            setEmailError("Please enter a valid Email ID.");
            emailInputRef.current.focus();
            // const position = emailInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else if (ownerPhoneNumber.trim() === "" || phoneNumberError !== "") {
            setPhoneNumberError("Please enter a valid Phone Number.");
            phoneNumberInputRef.current.focus();
            // const position = phoneNumberInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else if (ownerEntityPAN.trim() === "" || errorMessage !== "") {
            setErrorMessage("Please enter the correct PAN Card format.");
            panInputRef.current.focus();
            // const position = panInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else if (ownerIdDocNumber.trim() === "") {
            setIdDocNumberError("Please enter your ID Document Number.");
            idDocNumberInputRef.current.focus();
            // const position = idDocNumberInputRef.current.offsetTop;
            // window.scrollTo({ top: position - 100, behavior: "smooth" });
        } else {
            setCoDetails(); // call your existing setCoDetails function here
        }
    };
    function Unix_timestamp(t) {
        var dt = new Date(t * 1000);
        var hr = dt.getHours();
        var m = "0" + dt.getMinutes();
        var s = "0" + dt.getSeconds();
        return hr + ':' + m.substr(-2) + ':' + s.substr(-2);
    }
    console.log("the change time is ", Unix_timestamp(1663729083));
    const dateStr = '2022-06-22';
    const date = new Date(dateStr);
    console.log(date);


    const onSubmit = async (form, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const article = { title: 'React POST USER PROFILE' };
        const headers = {
            'Authorization': 'Bearer mytoken',
            'accept': 'application/json'
        };
        console.log(username)
        console.log(userFullName)
        console.log(phoneNumber)
        console.log(emailID)
        console.log(selectedRole)
        const fieldsToUpdate = {};
        if (username !== currentUser.username) {
            fieldsToUpdate.username = username;
        }
        if (userFullName !== currentUser.userFullName) {
            fieldsToUpdate.userFullName = userFullName;
        }
        if (phoneNumber !== currentUser.phoneNumber) {
            fieldsToUpdate.phoneNumber = phoneNumber;
        }
        if (emailID !== currentUser.email) {
            fieldsToUpdate.email = emailID;
        }
        if (selectedRole !== currentUser.userRole) {
            fieldsToUpdate.userRole = selectedRole;
        }


        let one = Constants.api_gateway_host + '/user_profile/?WALLET_ADDRESS=' + userID + '&USER_ROLE=' + selectedRole + '&EMAIL_ADDRESS=' + emailID + '&USER_NAME=' + username
        try {
            console.log(fieldsToUpdate)
            const userExists = await checkUserExists(emailID, phoneNumber, username, currentUser.userID);

            if (userExists.emailExists && emailID != currentUser.email) {
                notifyError("Cannot create user, email already in use")
                console.log(emailID)
                return;
            }

            if (userExists.phoneExists && phoneNumber != currentUser.phoneNumber) {
                notifyError("Cannot create user, phone number already in use")

                return;
            }

            if (userExists.usernameExists && username != currentUser.username) {
                notifyError("Cannot create user, username already in use")
                return;
            }
            await updateUserDocument(currentUser.userID, fieldsToUpdate);
            console.log('User document updated successfully');
            updateUser(currentUser.userID);
            if (coDetailsFlag == true) {
                const post_params = ""
                const post_uri = ""

                if (selectedRole == 'Owner') {
                    post_params =
                        "?OWNER_ENTITY_ID=" +
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
                    post_uri = Constants.api_gateway_host + '/wh_owner_details'
                }

                let two = post_uri + post_params

                const requestOne = axios.post(one, article, { headers });
                const requestTwo = axios.post(two, article, { headers });


                axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
                    const responseOne = responses[0]
                    const responseTwo = responses[1]
                    console.log(responseOne)
                    console.log(responseTwo)
                    setSuccessFlag("true");
                })).catch(errors => {
                    console.log(errors)
                    setErrorFlag("true");
                })
            } else {
                axios.put(one, article, { headers })
                    .then((response) => {
                        console.log(response)
                        //redirect logic
                        if (response.status == 200) {
                            // window.location = "/" 
                            // navigate("/", { replace: true });
                            // window.location.assign("/posty");
                            // setSuccessFlag("true");
                            notifySuccess("User Updated")
                            router.push("/")
                        }
                    }).catch((err) => {
                        console.log(err);
                        setErrorFlag("true");
                    });
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <React.Fragment>
                <section className="categoryarea black-bg pt-80 pb-80">
                </section>

                {/* to select the form for user with role as Carrier*/}
                {errorFlag == "true" && (
                    <Error />
                )}

                {/* to select the form for user with role as Carrier*/}
                {successFlag == "true" && (
                    <Success />
                )}

                {/* to select the form for user with role as Carrier*/}
                {(successFlag == "" && errorFlag == "") && (
                    <>
                        <Container fluid={true} className="header__area black-bg">


                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row className="justify-content-center align-self-center">
                                    <Col lg="4">
                                        <Card>
                                            <CardBody>
                                                <h4 className="card-title">Profile details</h4>
                                                <p className="card-title-desc"></p>
                                                <FormGroup className="mb-4">
                                                    <div className="mt-3">
                                                        <p className="mb-3 select2-container">
                                                            <Label>Role</Label>
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
                                                        <p className="text-muted m-b-15">
                                                            User Name
                                                        </p>
                                                        <Input
                                                            type="text"
                                                            maxLength={30}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                                                            placeholder="none"
                                                            name="username"
                                                            id="username"
                                                            defaultValue={currentUser ? currentUser.username : ''}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mt-3">
                                                        <p className="text-muted m-b-15">
                                                            User Full Name
                                                        </p>
                                                        <Input
                                                            type="text"
                                                            maxLength={30}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserFullName(event.target.value)}
                                                            placeholder="none"
                                                            name="userFullName"
                                                            id="userFullName"
                                                            defaultValue={currentUser ? currentUser.userFullName : ''}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mt-3">
                                                        <p className="text-muted m-b-15">
                                                            Email ID
                                                        </p>
                                                        <Input
                                                            type="text"
                                                            maxLength={50}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmailID(event.target.value)}
                                                            placeholder="none"
                                                            name="emailID"
                                                            id="emailID"
                                                            defaultValue={currentUser ? currentUser.email : ''}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mt-3">
                                                        <p className="text-muted m-b-15">
                                                            <Label>Phone Number</Label>
                                                        </p>
                                                        <p style={{ color: 'red', fontSize: '17px' }}>{phoneNumberError}</p>


                                                        <Input
                                                            type="text"
                                                            maxLength={14}
                                                            defaultValue={currentUser ? currentUser.phoneNumber : ''}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                const phoneNumber = event.target.value;

                                                                setPhoneNumber(phoneNumber);
                                                            }}

                                                            name="ownerPhoneNumber"
                                                            id="ownerPhoneNumber"

                                                        />
                                                    </div>

                                                    <div className="mt-3">
                                                        <p className="text-muted m-b-15">
                                                            User ID
                                                        </p>
                                                        <Input
                                                            type="text"
                                                            maxLength={50}
                                                            defaultValue={currentUser ? currentUser.userID : ''}
                                                            name="walletID"
                                                            id="walletID"
                                                            readOnly={true}
                                                        />
                                                    </div>

                                                </FormGroup>


                                                <Button
                                                    color="dark"
                                                    className="btn btn-info "
                                                    onClick={togglemodal}
                                                >
                                                    Add Details to complete your Profile
                                                </Button>


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

                                                        <div ref={modalBodyRef}>
                                                            <ModalBody>

                                                                <div className="grid-container">
                                                                    <div className="grid-item">
                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label> Owner Entity ID</Label>
                                                                            </p>
                                                                            <Input
                                                                                type="text"
                                                                                maxLength={100}
                                                                                defaultValue={ownerEntityId}
                                                                                name="ownerEntityId"
                                                                                id="ownerEntityId"
                                                                                readOnly={true}
                                                                            />
                                                                        </div>

                                                                    </div>
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
                                                                                defaultValue={ownerFullName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    setOwnerFullName(event.target.value);
                                                                                }}
                                                                                name="ownerFullName"
                                                                                id="ownerFullName"

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid-item">
                                                                        {/* Phone Number input field */}
                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label> Owner ID</Label>
                                                                            </p>
                                                                            <Input
                                                                                type="text"
                                                                                maxLength={100}
                                                                                defaultValue={ownerId}
                                                                                name="ownerId"
                                                                                id="ownerId"
                                                                                readOnly={true}
                                                                            />
                                                                        </div>

                                                                    </div>
                                                                    <div className="grid-item">
                                                                        {/* Owner Entity ID input field */}
                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label>Created Timestamp</Label>
                                                                            </p>
                                                                            <Input
                                                                                type="text"
                                                                                maxLength={50}
                                                                                defaultValue={ownerIdCreatedTimestamp}
                                                                                name="ownerIdCreatedTimestamp"
                                                                                id="ownerIdCreatedTimestamp"
                                                                                readOnly={true}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid-item">

                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label>Email ID</Label>
                                                                            </p>
                                                                            <p style={{ color: 'red', fontSize: '17px' }}>{emailError}</p>



                                                                            <Input
                                                                                ref={emailInputRef}
                                                                                type="email"
                                                                                maxLength={50}
                                                                                defaultValue={ownerEmailId}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    const email = event.target.value;
                                                                                    if (validateEmail(email)) {
                                                                                        setEmailError('');
                                                                                    } else {
                                                                                        setEmailError('Please enter a Gmail, Outlook, or Yahoo email address');
                                                                                    }
                                                                                    setOwnerEmailId(email);
                                                                                }}
                                                                                name="ownerEmailId"
                                                                                id="ownerEmailId"

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid-item">
                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label>Phone Number</Label>
                                                                            </p>
                                                                            <p style={{ color: 'red', fontSize: '17px' }}>{phoneNumberError}</p>


                                                                            <Input
                                                                                ref={phoneNumberInputRef}
                                                                                type="text"
                                                                                maxLength={50}
                                                                                defaultValue={ownerPhoneNumber}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    const phoneNumber = event.target.value;
                                                                                    if (validatePhoneNumber(phoneNumber)) {
                                                                                        setPhoneNumberError('');
                                                                                    } else {
                                                                                        setPhoneNumberError('Please enter a 10-digit phone number that does not start with 0');
                                                                                    }
                                                                                    setOwnerPhoneNumber(phoneNumber);
                                                                                }}

                                                                                name="ownerPhoneNumber"
                                                                                id="ownerPhoneNumber"

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid-item">
                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label>Address</Label>
                                                                            </p>
                                                                            <Input
                                                                                type="text"
                                                                                maxLength={50}
                                                                                defaultValue={ownerAddress}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    setOwnerAddress(event.target.value);
                                                                                }}
                                                                                name="ownerAddress"
                                                                                id="ownerAddress"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-3">
                                                                        <p className="mb-3 select2-container">
                                                                            <Label>ID Document Type</Label>
                                                                        </p>
                                                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                                                            <DropdownToggle caret color="info" className="sexy-dropdown">
                                                                                {ownerIdDocType || 'Select ID Document Type'}
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                <DropdownItem
                                                                                    onClick={() => {
                                                                                        setOwnerIdDocType('Aadhar Card');
                                                                                    }}
                                                                                >
                                                                                    Aadhar Card
                                                                                </DropdownItem>
                                                                                <DropdownItem
                                                                                    onClick={() => {
                                                                                        setOwnerIdDocType('Voter ID');
                                                                                    }}
                                                                                >
                                                                                    Voter ID
                                                                                </DropdownItem>
                                                                                <DropdownItem
                                                                                    onClick={() => {
                                                                                        setOwnerIdDocType('Driving License');
                                                                                    }}
                                                                                >
                                                                                    Driving License
                                                                                </DropdownItem>
                                                                            </DropdownMenu>
                                                                        </Dropdown>
                                                                    </div>


                                                                    <div className="mt-3">
                                                                        <p className="mb-3 select2-container">
                                                                            <Label>ID Document Number</Label>
                                                                        </p>
                                                                        {idDocNumberError && <span className="error-message1">{idDocNumberError}</span>}
                                                                        <Input
                                                                            ref={idDocNumberInputRef}
                                                                            type="text"
                                                                            maxLength={50}
                                                                            defaultValue={ownerIdDocNumber}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                setOwnerIdDocNumber(event.target.value);
                                                                            }}
                                                                            name="ownerIdDocNumber"
                                                                            id="ownerIdDocNumber"
                                                                            placeholder={`Please Enter Your ${ownerIdDocType || 'ID Document'} Number`}
                                                                        />
                                                                    </div>

                                                                    <div className="grid-item">
                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label>Entity Type</Label>
                                                                            </p>
                                                                            <Input
                                                                                type="text"
                                                                                maxLength={50}
                                                                                defaultValue={ownerEntityType}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    setOwnerEntityType(event.target.value);
                                                                                }}
                                                                                name="ownerEntityType"
                                                                                id="ownerEntityType"

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid-item">
                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label>Entity Name</Label>
                                                                            </p>
                                                                            <Input
                                                                                type="text"
                                                                                maxLength={50}
                                                                                defaultValue={ownerEntityName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    setOwnerEntityName(event.target.value);
                                                                                }}
                                                                                name="ownerEntityName"
                                                                                id="ownerEntityName"

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid-item">
                                                                        <div className="mt-3">
                                                                            <p className="mb-3 select2-container">
                                                                                <Label>Registration Number</Label>

                                                                            </p>
                                                                            <Input
                                                                                type="text"
                                                                                maxLength={50}
                                                                                defaultValue={ownerEntityRegistrationNumber}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    setOwnerEntityRegistrationNumber(event.target.value);
                                                                                }}
                                                                                name="ownerEntityRegistrationNumber"
                                                                                id="ownerEntityRegistrationNumber"
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
                                                                                defaultValue={ownerEntityRegisteredAddress}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    setOwnerEntityRegisteredAddress(event.target.value);
                                                                                }}
                                                                                name="ownerEntityRegisteredAddress"
                                                                                id="ownerEntityRegisteredAddress"
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
                                                                                defaultValue={ownerEntityPAN}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    setOwnerEntityPAN(event.target.value);
                                                                                    validatePAN(event.target.value);
                                                                                }}
                                                                                name="ownerEntityPAN"
                                                                                id="ownerEntityPAN"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <br />
                                                                <Button color="dark" className="btn btn-info" onClick={toggleskip}>
                                                                    Skip for now
                                                                </Button>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                <Button color="dark" className="btn btn-info " onClick={validateAndConfirm}>
                                                                    Confirm
                                                                </Button>
                                                            </ModalBody>
                                                        </div>
                                                    </div>
                                                </Modal>
                                           </CardBody>
                                            <div className="mt-3">
                                                <br></br>
                                                <button type='submit' className="m-btn m-btn-4 w-100"> <span></span> Save</button>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </form>
                        </Container>
                    </>
                )}

            </React.Fragment>
        </>
    )
}

export default OwnerProfile;
