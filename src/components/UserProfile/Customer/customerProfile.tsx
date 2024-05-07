// @ts-nocheck 
'use client'
import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Alert, Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
// import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
// import "flatpickr/dist/themes/material_blue.css"
import { TS } from "../../../utils/currentTimestamp";
import * as Constants from "../../../utils/constants";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactLoading from 'react-loading';

//Auth
import { useAuth } from "../../../contexts/UserContext";

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { UniqueID } from "../../../utils/uuidGenerate";

const CustomerProfile = () => {
  const [start, setstart] = useState(true);
  const router = useRouter()
  const { currentUser, handleUpdateUserAttributes } = useAuth()
  const [userExistsDB, setUserExistsDB] = useState(false);
  console.log("Current User")
  console.log(currentUser)
  const [customerDetail, setCustomerDetails] = useState({
    'customer_id': currentUser.userID,
    'customer_id_created_timestamp': TS(),
    'customer_full_name': currentUser?.userFullName || '',
    'customer_phone_number': currentUser?.phoneNumber || '',
    'customer_email_id': currentUser?.email || '',
    'customer_entity': currentUser.userID,
    'customer_entity_name': '',
    'customer_entity_registered_address': '',
    'customer_entity_pan': '',
    'customer_id_doc_number': '',
    'customer_id_doc_type': '',
    'is_active': Constants.isActive,
    'is_verified': Constants.isVerified,
    'gst_number': '',
    'username': currentUser?.username || '' // Not saved in owner details table

  });
  console.log("customerDetail")
  console.log(customerDetail)
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [fullNameError, setFullNameError] = useState("");
  const [idDocNumberError, setIdDocNumberError] = useState("");
  const [errorMessageGST, seterrorMessageGST] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
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

  const getCustomerDetails = (id) => {
    return new Promise<void>((resolve, reject) => {
      axios
        .get(Constants.local_api_gateway_host + `/customerDetails`)
        .then((response) => {
          const userExists = response.data.response.response.length > 0;
          console.log("get customer details ----->")
          // console.log(userExists)
          setUserExistsDB(userExists)
          // console.log(response)
          const updatedCustomeDetails = {
            ...response.data.response.response[0],
          };
          console.log("updated customer details")
          // console.log(updatedCustomeDetails)
          // console.log(customerDetail)
          if (userExists) {
            const customerDetailTemp=customerDetail;
            //setting all undefined fields empty in updatedCustomeDetails

            for(const key in updatedCustomeDetails){
              if(updatedCustomeDetails[key]=='undefined'){
                updatedCustomeDetails[key]='';
              }
            }
            customerDetailTemp.customer_entity_pan=updatedCustomeDetails.customer_entity_pan;
            customerDetailTemp.customer_entity_registered_address=updatedCustomeDetails.customer_entity_registered_address;
            customerDetailTemp.customer_full_name=updatedCustomeDetails.customer_full_name;
            customerDetailTemp.customer_id_doc_number=updatedCustomeDetails.customer_id_doc_number;
            customerDetailTemp.customer_id_doc_type=updatedCustomeDetails.customer_id_doc_type;
            customerDetailTemp.customer_phone_number=updatedCustomeDetails.customer_phone_number;
            customerDetailTemp.gst_number=updatedCustomeDetails.gst_number;
            console.log("inside if")
            console.log(updatedCustomeDetails)
            setCustomerDetails(customerDetailTemp);
            console.log(customerDetail)

          }
          resolve();
        })
        .catch((error) => {
          console.log("Error in get customer details")
          console.error(error);
          reject(error);
        });
    });
  };

  const handleCustomerDetailsChange = (e: any) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
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
    if (customerDetail.customer_full_name.trim() === "") {
      setFullNameError("Please enter your full name.");
      fullNameInputRef.current.focus();
      // const position = fullNameInputRef.current.offsetTop;
      // window.scrollTo({ top: position - 100, behavior: "smooth" });
    } else if (customerDetail.customer_email_id.trim() === "" || emailError !== "") {
      setEmailError("Please enter a valid Email ID.");
      emailInputRef.current.focus();
      // const position = emailInputRef.current.offsetTop;
      // window.scrollTo({ top: position - 100, behavior: "smooth" });
    } else if (customerDetail.customer_phone_number.trim() === "" || phoneNumberError !== "") {
      setPhoneNumberError("Please enter a valid Phone Number.");
      phoneNumberInputRef.current.focus();
      // const position = phoneNumberInputRef.current.offsetTop;
      // window.scrollTo({ top: position - 100, behavior: "smooth" });
    } else if (customerDetail.customer_entity_pan.trim() === "" || errorMessage !== "") {
      setErrorMessage("Please enter the correct PAN Card format.");
      panInputRef.current.focus();
      // const position = panInputRef.current.offsetTop;
      // window.scrollTo({ top: position - 100, behavior: "smooth" });
    } else if (customerDetail.gst_number.trim() === "" || errorMessageGST !== "") {
      setErrorMessage("Please enter the correct GST Card format.");
      notifyInfo("Please enter a valid GST Card Number.");
      panInputRef.current.focus();
      // const position = panInputRef.current.offsetTop;
      // window.scrollTo({ top: position - 100, behavior: "smooth" });
    } else if (customerDetail.customer_id_doc_number.trim() === "") {
      setIdDocNumberError("Please enter your ID Document Number.");
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
      const id = customerDetail.customer_id
      getCustomerDetails(id)

    } catch (error) {
      console.log(error)
    }
  }, [start])

  const checkUsernameExists = async (username) => {
    console.log("handleSubmit")
    console.log(username)
    try {
      const response = await axios.get(Constants.local_api_gateway_host + `/customerUsername/?USER_NAME=${username}`);
      console.log("Response from checkUsernameExists")
      console.log(response.data.response)
      return response.data.response;
    } catch (error) {
      console.log("Error in check Username Exists")
      console.log(error.message);
      return error;
    }

  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    notifyInfo("Your Details will be updated soon")
    setLoading(true)
    console.log("Form Submitted")
    console.log(
      customerDetail
    )



    try {
      const usernameExists = await checkUsernameExists(customerDetail.username);
      console.log(usernameExists)
      if(usernameExists){
        console.log("usernameExists")
      }
      console.log(!userExistsDB)
      console.log("Username")
      console.log(customerDetail.username)
      console.log(currentUser.username)
      if(usernameExists){
        // notifyError("Cannot create user, username already in use")
        alert("Cannot create user, username already in use ")
        setLoading(false)
        return;
      }
      // if(!userExistsDB){
      //   notifyError("Cannot create user, username already in use")
      //   setLoading(false)
      //   return;
      // }
      // if ( !userExistsDB && customerDetail.username !== currentUser.username) {
      //   notifyError("Cannot create user, username already in use")
      //   setLoading(false)
      //   return;
      // }
      console.log("Customer details after cannot create user")
      console.log(customerDetail)
      handleUpdateUserAttributes(customerDetail);
      customerDetail.customer_id=currentUser.userID
      //Backend Calls
      const article = { title: 'React PUT USER PROFILE' };
      const headers = {
        'Authorization': 'Bearer mytoken',
        'accept': 'application/json'
      };
      const updatedUserDetails = '?WALLET_ADDRESS=' + currentUser.userID + '&USER_ROLE=' + currentUser.userRole + '&EMAIL_ADDRESS=' + currentUser.email + '&USER_NAME=' + customerDetail.username + '&IS_ACTIVE=' + Constants.isActive;

      const updatedCustomerDetails = "?CUSTOMER_ID=" + currentUser.userID + "&CUSTOMER_ID_CREATED_TIMESTAMP=" + customerDetail.customer_id_created_timestamp +
        "&CUSTOMER_FULL_NAME=" + customerDetail.customer_full_name + "&CUSTOMER_PHONE_NUMBER=" + customerDetail.customer_phone_number +
        "&CUSTOMER_EMAIL_ID=" + currentUser.email + "&CUSTOMER_ENTITY=" + customerDetail.customer_entity + "&CUSTOMER_ENTITY_NAME=" +
        customerDetail.customer_entity_name + "&CUSTOMER_ENTITY_PAN=" + customerDetail.customer_entity_pan + "&CUSTOMER_ENTITY_REGISTERED_ADDRESS=" + customerDetail.customer_entity_registered_address +
        '&CUSTOMER_ID_DOC_TYPE=' + customerDetail.customer_id_doc_type + '&CUSTOMER_ID_DOC_NUMBER=' + customerDetail.customer_id_doc_number + "&GST_NUMBER=" + customerDetail.gst_number +
        '&IS_ACTIVE=' + Constants.isActive + '&IS_VERIFIED=' + Constants.isVerified;
      console.log("user exist db")
      console.log(userExistsDB)
      console.log(updatedCustomerDetails)
      console.log(updatedUserDetails)
      const requests = [
        userExistsDB ?
          axios.put(Constants.local_api_gateway_host + "/customerDetails/" + updatedCustomerDetails, article, {
            headers,
          }) :
          axios.post(Constants.local_api_gateway_host + "/customerDetails/" + updatedCustomerDetails, {
            headers,
          }),

        userExistsDB ?
          axios.put(Constants.local_api_gateway_host + "/userProfile/" + updatedUserDetails, article, {
            headers,
          }) :
          axios.post(Constants.local_api_gateway_host + "/userProfile/" + updatedUserDetails, {
            headers,
          }),
      ];
      console.log("Request sent")
      axios.all(requests)
        .then(axios.spread((responseOne, responseTwo) => {
          console.log(responseOne);
          console.log(responseTwo);
          notifySuccess('User data added successfully');
          router.push('/')
        }))
        .catch(errors => {
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
      <Container fluid={true} className="header__area py-4" style={{
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
                      <p className="select2-container">
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
                      <Label  style={{color:"#058283"}}>User Name</Label>
                      </p>
                      <Input
                        type="text"
                        maxLength={30}
                        onChange={handleCustomerDetailsChange}
                        placeholder="Enter Username"
                        name="username"
                        id="username"
                        defaultValue={currentUser ? currentUser.username : ''}
                        required
                      />
                    </div>
                    <div className="mt-3">
                    <p className="text-muted mb-10">
                      <Label  style={{color:"#058283"}}>User Full Name</Label>
                      </p>
                      <Input
                        type="text"
                        maxLength={30}
                        onChange={handleCustomerDetailsChange}
                        placeholder="Enter Full Name"
                        name="customer_full_name"
                        id="customer_full_name"
                        defaultValue={customerDetail.customer_full_name}
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
                        onChange={handleCustomerDetailsChange}
                        placeholder="Email ID"
                        name="customer_email_id"
                        id="customer_email_id"
                        defaultValue={customerDetail.customer_email_id}
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
                        defaultValue={customerDetail.customer_phone_number}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const newPhoneNumber = event.target.value;
                          handleCustomerDetailsChange(event);
                          validatePhoneNumber(newPhoneNumber);
                        }}
                        name="customer_phone_number"
                        id="customer_phone_number"
                      />
                    </div>

                    {/* <div className="mt-3">
                      <p className="text-muted m-b-15">
                        <Label style={{color:"#058283"}}>User ID</Label>
                      </p>
                      <Input
                        type="text"
                        maxLength={50}
                        defaultValue={currentUser ? currentUser.userID : ''}
                        name="userID"
                        id="userID"
                        readOnly={true}
                      />
                    </div> */}

                  </FormGroup>


                  <div className="text-center">
                    <Button
                      color="dark"
                      className="btn btn-info "
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
                        Customer Details Section
                      </ModalHeader>

                      <ModalBody>

                        <div className="grid-container">
                          <div className="grid-item">
                            <div className="mt-3">
                              <p className="mb-3 select2-container">
                                <Label> Customer Entity Type</Label>
                              </p>

                              <Dropdown isOpen={dropdownOpenEntityType} toggle={toggleDropdownEntityType}>
                                <DropdownToggle caret color="info" className="sexy-dropdown">
                                  {customerDetail.customer_entity || 'Select Customer Entity Type'}
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_entity = 'Individual'
                                    }}
                                  >
                                    Individual
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_entity = 'Firm'
                                    }}
                                  >
                                    Firm
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_entity = 'Company'
                                    }}
                                  >
                                    Company
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_entity = 'Partnership'
                                    }}
                                  >
                                    Partnership
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_entity = 'Others'
                                    }}
                                  >
                                    Others
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>

                          </div>
                          <div className="grid-item">
                            <div className="mt-3">

                              <p className="mb-3 select2-container">
                                <Label>Full Name</Label>


                              </p>
                              {fullNameError && <span className="error-message1">{fullNameError}</span>}

                              <Input
                                ref={fullNameInputRef}

                                type="text"
                                maxLength={100}
                                defaultValue={customerDetail.customer_full_name}
                                onChange={handleCustomerDetailsChange}
                                name="customer_full_name"
                                id="customer_full_name"

                              />
                            </div>
                          </div>
                          {/* <div className="grid-item">
                            {/* Phone Number input field */}
                          {/* <div className="mt-3">
                              <p className="mb-3 select2-container">
                                <Label> Customer ID</Label>
                              </p>
                              <Input
                                type="text"
                                maxLength={100}
                                defaultValue={customerDetail.customer_id}
                                name="customer_id"
                                id="customer_id"
                                readOnly={true}
                              />
                            </div>

                           </div>  */}
                          {/* <div className="grid-item">
                            {/* Customer Entity ID input field  */}
                          {/*<div className="mt-3">
                              <p className="mb-3 select2-container">
                                <Label>Created Timestamp</Label>
                              </p>
                              <Input
                                type="text"
                                maxLength={50}
                                defaultValue={customerDetail.customer_id_created_timestamp}
                                name="customer_id_created_timestamp"
                                id="customer_id_created_timestamp"
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
                                defaultValue={customerDetail.customer_email_id}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  const email = event.target.value;
                                  if (validateEmail(email)) {
                                    setEmailError('');
                                  } else {
                                    setEmailError('Please enter a Gmail, Outlook, or Yahoo email address');
                                  }
                                  handleCustomerDetailsChange(event)
                                }}
                                name="customer_email_id"
                                id="customer_email_id"

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
                                defaultValue={customerDetail.customer_phone_number}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  handleCustomerDetailsChange(event)
                                  validatePhoneNumber(event.target.value)
                                }}

                                name="customer_phone_number"
                                id="customer_phone_number"

                              />
                            </div>
                          </div>
                          <div className="grid-item">
                            <div className="mt-1">
                              <p className="mb-3 select2-container">
                                <Label>ID Document Type</Label>
                              </p>
                              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                <DropdownToggle caret color="info" className="sexy-dropdown">
                                  {customerDetail.customer_id_doc_type || 'Select ID Document Type'}
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_id_doc_type = 'Aadhar Card'
                                    }}
                                  >
                                    Aadhar Card
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_id_doc_type = 'Voter ID'
                                    }}
                                  >
                                    Voter ID
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_id_doc_type = 'Driving License'
                                    }}
                                  >
                                    Driving License
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_id_doc_type = 'LLPIN'
                                    }}
                                  >
                                    LLPIN
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      customerDetail.customer_id_doc_type = 'CIN'
                                    }}
                                  >
                                    CIN
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="mb-3 select2-container">
                              <Label>ID Document Number</Label>
                            </p>
                            {customerDetail.customer_id_doc_number && <span className="error-message1">{idDocNumberError}</span>}
                            <Input
                              ref={idDocNumberInputRef}
                              type="text"
                              maxLength={50}
                              defaultValue={customerDetail.customer_id_doc_number}
                              onChange={handleCustomerDetailsChange}
                              name="customer_id_doc_number"
                              id="customer_id_doc_number"
                              placeholder={`Please Enter Your ${customerDetail.customer_id_doc_number || 'ID Document'} Number`}
                            />
                          </div>


                          <div className="grid-item">
                            <div className="mt-3">
                              <p className="mb-3 select2-container">
                                <Label>Entity Name</Label>
                              </p>
                              <Input
                                type="text"
                                maxLength={50}
                                defaultValue={customerDetail.customer_entity_name}
                                onChange={handleCustomerDetailsChange}
                                name="customer_entity_name"
                                id="customer_entity_name"

                              />
                            </div>
                          </div>
                          <div className="grid-item">
                            <div className="mt-3">
                              <p className="mb-3 select2-container">
                                <Label>Office Address</Label>

                              </p>
                              <Input
                                type="text"
                                maxLength={50}
                                defaultValue={customerDetail.customer_entity_registered_address}
                                onChange={handleCustomerDetailsChange}
                                name="customer_entity_registered_address"
                                id="customer_entity_registered_address"
                              />
                            </div>

                          </div>

                          <div className="grid-item">
                            <div className="mt-0">
                              <p className="mb-3 select2-container">
                                <Label>PAN</Label>
                                <p style={{ color: 'red', fontSize: '17px' }}>{errorMessage}</p>
                              </p>
                              <Input
                                ref={panInputRef}
                                type="text"
                                maxLength={50}
                                defaultValue={customerDetail.customer_entity_pan}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  handleCustomerDetailsChange(event)
                                  validatePAN(event.target.value);
                                }}
                                name="customer_entity_pan"
                                id="customer_entity_pan"
                              />
                            </div>
                          </div>
                          <div className="grid-item">
                            <div className="">
                              <p className="mb-3 select2-container">
                                <Label>GST Number</Label>
                                <p style={{ color: 'red', fontSize: '17px' }}>{errorMessageGST}</p>
                              </p>
                              <Input
                                type="text"
                                maxLength={50}
                                defaultValue={customerDetail.gst_number}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  handleCustomerDetailsChange(event)
                                  validateGst(event.target.value);
                              }}
                                name="gst_number"
                                id="gst_number"
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
                        </Button>
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

export default CustomerProfile
