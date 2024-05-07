// @ts-nocheck
'use client'
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button, Col, Container, Row, InputGroup } from "reactstrap";
import Select from "react-select";
import { UniqueID } from "../../../utils/uuidGenerate";
import { TS } from "../../../utils/currentTimestamp";
import Stepper from "react-stepper-horizontal";
import axios from "axios";
import * as Constants from "../../../utils/constants";
import { Web3Storage } from "web3.storage";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageUpload from "../../ImageEditor/index";
import { toast } from "react-toastify";
import { useAuth } from "../../../contexts/UserContext";
import Client from "./MapForCustomer/clientside";
import { useRouter } from "next/navigation";
import ReactLoading from "react-loading";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import makeAnimated from 'react-select/animated';
import data from "../../../utils/data/data.json"
import Overlays from '../../Overlays'
import { email } from "react-admin";
const animatedComponents = makeAnimated();

const priceRanges = [
  {
    range: "A",
    minPrice: 1000,
    maxPrice: 100000,
  },
  {
    range: "B",
    minPrice: 100001,
    maxPrice: 300000,
  },
  {
    range: "C",
    minPrice: 300001,
    maxPrice: 500000,
  },
  {
    range: "D",
    minPrice: 500001,
    maxPrice: 1000000,
  },
  {
    range: "Type E",
    minPrice: 1000001,
    maxPrice: 2000000,
  },
];
const WarehouseAreaOffered = [

  { value: "FULL", name: "FULL", label: "FULL" },
  { value: "PARTIAL", name: "PARTIAL", label: "PARTIAL" }
]
const NewPostCustomer = () => {
  const router = useRouter();
  const [requiredDuration, setrequiredDuration] = useState({ "duration": "", "Unit": "" })
  const { currentUser, customerDetails } = useAuth();
  const [dataFromMaps, setdataFromMaps] = useState({});
  const [step, setStep] = useState(0);
  const [paginationId, setPaginationId] = useState("")
  const [requirementStartDate, setRequirementStartDate] = useState("");
  const [requirementDuration, setRequirementDuration] = useState(null);
  const [customerId, setCustomerId] = useState();
  const [loading, setLoading] = useState(false);
  const [requirementArea, setRequirementArea] = useState(null)
  const [requirementRate, setrequirementRate] = useState(null)
  const [locationText, setlocationText] = useState("")
  const userData = router.query?.data;                                  //accessing data from map
  const lattitude = userData ? JSON.parse(userData).lat : null;
  const longitude = userData ? JSON.parse(userData).lng : null;
  const [customerDetail, setCustomerDetails] = useState({})
  const [userExistsDB, setUserExistsDB] = useState(false);
  const [requirementDetails, setRequirementDetails] = useState({
    'requirement_post_id': UniqueID("PostId"),
    'requirement_id_created_timestamp': TS(),
    'requirement_start_date': "",
    'requirement_location': "",
    'requirement_max_distance': "",
    'requirement_area': "",
    'requirement_wh': "",
    'requirement_duration': "",
    'requirement_other_details': "",
    'requirement_rate': "",
    'requirement_age': "",
    'requirement_grade': "",
    "wh_area_offered": "",
    "latitude": "",
    "longitude": "",
    'customer_id': customerId,
    'is_active': Constants.isActive,
    'is_verified': Constants.isVerified,
    'pagination_id': paginationId,
    'wh_gps_coordinates': "",
    // 'wh_budget_key': ""
  });



  useEffect(() => {
    console.clear();
    setRequirementDetails((prev) => ({
      ...prev,
      "wh_gps_coordinates": `${longitude} ${lattitude}`,
      "longitude": `${longitude}`,
      "latitude": `${lattitude}`
    }));
    console.clear();
    console.log(lattitude);
    console.log(longitude);
  }, [lattitude, longitude]);


  setTimeout(() => console.log(requirementDetails), 2000)

  const handleRequirementDetailsChange = (e: any) => {
    const { name, value } = e.target;
    if (name == 'requirement_rate') {
      for (const priceRange of priceRanges) {
        if (value >= priceRange.minPrice && value <= priceRange.maxPrice) {
          setRequirementDetails((prev) => ({
            ...prev,
            "wh_budget_key": `${priceRange.range}`,
          }));
        }
        else {
          setRequirementDetails((prev) => ({
            ...prev,
            "wh_budget_key": `Unknown`,
          }));
        }
      }
    }
    setRequirementDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.clear();
    console.log(requirementDetails);
  };

  const steps = [
    {
      title: "First Details",
      onClick: () => {
        setStep(0);
        console.log("onClick", 0);
      },
    },
    {
      title: "Second Details",
      onClick: () => {
        setStep(1);
        console.log("onClick", 1);
      },
    },
  ];

  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyInfo = (message: string) =>
    toast.info(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyError = (message: string) =>
    toast.error(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const getPaginationId = async () => {
    try {
      const res = await axios.get(Constants.local_api_gateway_host + '/requirementDetailsSize');
      console.log("requirementDetailSize")
      console.log(res)
      const data = res.data.newData;
      console.log(data);
      const requirement_details_data_count = data.response[0].count;
      console.log(requirement_details_data_count)
      if (requirement_details_data_count === 0) {
        setPaginationId(1);
      } else {
        setPaginationId(requirement_details_data_count);
      }
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to be caught by the caller
    }
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


  const handleSubmit = (e) => {
    e.preventDefault();
    console.clear();
    console.table(requirementDetails);
    //Requirements Details
    
    requirementDetails.requirement_rate=requirementRate;
    requirementDetails.requirement_duration = requirementDuration;
    requirementDetails.requirement_start_date = requirementStartDate[0];
    requirementDetails.customer_id = customerId
    requirementDetails.requirement_area = requirementArea

    requirementDetails.pagination_id = paginationId.toString()
    let coordinates = requirementDetails.wh_gps_coordinates.split(" ");
    requirementDetails.latitude = coordinates[1];
    requirementDetails.longitude = coordinates[0];
    console.log("Logging the data requirement Details")
    console.log(requirementDetails)
    const optionalRequirementFields = ['latitude', 'longitude', 'wh_gps_coordinates', 'requirement_location', 'pagination_id', 'customer_id', 'requirement_id_created_timestamp', 'requirement_post_id', 'is_active', 'is_verified'];

    const emptyWarehouseFields = getEmptyFields(requirementDetails, optionalRequirementFields);

    if(!requirementRate?.min || !requirementRate?.max || !requirementRate?.unit){
      notifyInfo("Please fill all budget fields")
      return;
    }
    if (emptyWarehouseFields.length > 0) {
      notifyInfo(`Please fill all fields: ${emptyWarehouseFields.join(', ')}`);
      return;
    }
    if(requirementRate.min>requirementRate.max){
      notifyInfo("Budget min should be less than max")
      setrequirementRate(null)
      
      return
    }

    notifyInfo("Your Details will be posted soon");
    console.log("Form Submitted");

    try {
      const article = { title: "React POST Request Example" };
      const headers = {
        Authorization: "Bearer mytoken",
        accept: "application/json",
      };
      const newRequirementDetails =
        "REQUIREMENT_POST_ID=" +
        requirementDetails.requirement_post_id +
        "&REQUIREMENT_ID_CREATED_TIMESTAMP=" +
        requirementDetails.requirement_id_created_timestamp +
        "&REQUIREMENT_START_DATE=" +
        requirementDetails.requirement_start_date +
        "&REQUIREMENT_LOCATION=" +
        requirementDetails.requirement_location +
        "&REQUIREMENT_MAX_DISTANCE=" +
        requirementDetails.requirement_max_distance +
        "&REQUIREMENT_AREA=" +
        requirementDetails.requirement_area +
        "&REQUIREMENT_WH=" +
        requirementDetails.requirement_wh +
        "&REQUIREMENT_DURATION=" +
        requirementDetails.requirement_duration +
        "&REQUIREMENT_OTHER_DETAILS=" +
        requirementDetails.requirement_other_details +
        "&WH_GPS_COORDINATES=" +
        requirementDetails.wh_gps_coordinates +
        "&REQUIREMENT_RATE=" +
        requirementDetails.requirement_rate +
        "&PAGINATION_ID=" +
        requirementDetails.pagination_id +
        "&CUSTOMER_ID=" +
        requirementDetails.customer_id +
        "&IS_VERIFIED=" +
        Constants.isVerified +
        "&latitude=" +
        requirementDetails.latitude
        + "&longitude=" +
        requirementDetails.longitude
      "&IS_ACTIVE=" +
        Constants.isActive;
      console.table(newRequirementDetails);
      console.log("Logging new requirement details")
      const requests = [
        axios.post(
          Constants.local_api_gateway_host +
          "/requirementDetails?" +
          newRequirementDetails,
          {
            headers,
          }
        ),
      ];
      Promise.all(requests)
        .then((responses) => {
          console.log("Requirement Details added successfully");
          notifySuccess("Your details are posted");
          console.log(responses)
          router.push("/ViewPost");
        })
        .catch((error) => {
          notifyError("Error updating warehouse data");
          console.error("Error updating warehouse data:", error);
        });

    } catch (error) {
      console.log(error);
    }
  };

  function epoch(date) {
    console.log(date)
    return Date.parse(date);
  }

  const formatDates = (selectedDates) => {
    return selectedDates.map(date => date.toISOString().split('T')[0]);
  };

  const getCustomerDetails = (id) => {
    return new Promise<void>((resolve, reject) => {

      axios
        .get(Constants.local_api_gateway_host + `/customerDetails?CUSTOMER_EMAIL_ID=${id}`)
        .then((response) => {
          console.log(" response of customer id")
          console.log(response)
          const userExists = response.data.response.length > 0;
          const data = response.data.response
          setCustomerDetails(prevUser => ({
            ...prevUser,
            ...data[0]
          })); 
          console.log("Logging customer ID")
          console.log(data[0])
          setUserExistsDB(userExists)
          if (userExists) {
            setCustomerId(response.data.response[0]?.customer_id)
            console.log(response.data.response[0]?.customer_id)
            console.log(customerId)
          }
          // if (!userExists) {
          //   notifyInfo("PLease complete your profile before creating a post")
          // }
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };
  const handleRequirementRate=(e)=>{
    setrequirementRate(p=>({...p,[e.target.name]:e.target.value})
    )
  }
  const checkAllDetailsOfCustomer = () => {
    console.log(customerDetail)
    // Exclude the 'is_active', 'is_verified', and 'username' fields from the check
    const fieldsToCheck = { ...customerDetail };
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
    const fetchCustomerDetail = async () => {
      const id = currentUser.email;
      console.log(currentUser)
      await getCustomerDetails(id);
    };

    fetchCustomerDetail();
    getPaginationId();
  }, []);

  useEffect(() => {
    const allFieldsFilled = checkAllDetailsOfCustomer();
    console.log(allFieldsFilled);
    if (!allFieldsFilled) {
      setUserExistsDB(false);
      notifyInfo("Please complete your profile before creating a post");
    }
  }, [customerDetail]);


  const WarehouseTypes = [
    { value: 'Government', name: 'Government', label: 'Government' },
    { value: 'Private', name: 'Private', label: 'Private' },
    { value: 'Custom Bonded', name: 'Custom Bonded', label: 'Custom Bonded' },
    { value: 'Open Land', name: 'Open Land', label: 'Open Land' },
    { value: 'Tarped', name: 'Tarped', label: 'Tarped' },
    { value: 'Others', name: 'Others', label: 'Others' },
  ];

  // Fully Covered
  // Open Space
  // Tarped

  if (loading) {
    // Show the loading indicator while data is being fetched
    return (
      <>
        <div className="column d-flex align-items-xl-center justify-content-center">
          <h3 className="m-3 p-3">
            {" "}
            <ReactLoading type="spinningBubbles" color="#1a152e" />
          </h3>
        </div>
      </>
    );
  }


  return (
    <>


      <div className="section__title-wrapper text-center">
        <h2 className="section__title my-4">
          CREATE NEW POST
        </h2>
      </div>

      <div style={{ minHeight: "100vh" }} className="white-bg">
        <div className="Form">
          <Form onSubmit={handleSubmit}>
            <Row className="mt-5">
              <Col md={6}>

                {/* <Form.Group className="mb-3">
                   <Form.Label>Requirement Location Detail</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails.requirement_location}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_location"
                    id="requirement_location"
                  /> 
                </Form.Group> */}
                {/* <Form.Group className="mb-3">
                  <Form.Label>Requirement ID Created Time</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={
                      requirementDetails?.requirement_id_created_timestamp
                    }
                    name="requirement_id_created_timestamp"
                    id="requirement_id_created_timestamp"
                    readOnly={true}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Requirement Post ID</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails?.requirement_post_id}
                    name="requirement_post_id"
                    id="requirement_post_id"
                    readOnly={true}
                  />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Anticipated Start Date
                      {/* <Overlays message={"Select warehouse area offered"} /> */}
                    </Form.Label>
                  </p>
                  <InputGroup>
                    <Flatpickr
                      className="form-control d-block"
                      placeholder="Choose your dates"
                      onChange={(selectedDates) => {
                        setRequirementStartDate(formatDates(selectedDates));
                      }}
                      options={{
                        altInput: true,
                        dateFormat: 'Y-m-d',
                        minDate: new Date().fp_incr(1)
                      }}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Area Offered <Overlays message={"Select warehouse area offered"} />
                    </Form.Label>


                  </p>
                  {requirementDetails.wh_area_offered === "" ?
                    <Select
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      // defaultValue={{ value: warehouseRentalFields.wh_area_offered, name: warehouseRentalFields.wh_area_offered, label: warehouseRentalFields.wh_area_offered }}
                      options={WarehouseAreaOffered}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setRequirementDetails(prev => ({
                          ...prev,
                          ['wh_area_offered']: event.value
                        }));
                      }}
                    />
                    :
                    <Select
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      defaultValue={{ value: requirementDetails.wh_area_offered, name: requirementDetails.wh_area_offered, label: requirementDetails.wh_area_offered }}
                      options={WarehouseAreaOffered}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setRequirementDetails(prev => ({
                          ...prev,
                          ['wh_area_offered']: event.value
                        }));
                        console.log(requirementDetails)
                      }}
                    />}

                </Form.Group>
                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Budget <Overlays message={"Enter the range of your budget"} />
                    </Form.Label>
                  </p>
                  <Row>
                    <Col>
                      <Form.Control
                        placeholder="Min Budget/Rent "
                        type="number"
                        maxLength={8}
                        defaultValue={requirementDetails?.requirement_rate}
                        onChange={(e)=>{
                          if(e.target.value<0){
                            e.target.value=''
                          }
                          handleRequirementRate(e)
                        }}
                        name="min"
                        min={0}
                        id="requirement_rate"
                        required
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        placeholder="Max Budget/Rent "
                        type="number"
                        maxLength={8}
                        required
                        defaultValue={requirementDetails?.requirement_rate}
                        onChange={(e)=>{
                          if(e.target.value<0){
                            e.target.value=''
                          }
                          handleRequirementRate(e)
                        }}
                        name="max"
                        id="requirement_rate"
                      />
                    </Col>
                    <Col >
                      <Select
                        closeMenuOnSelect={true}
                        placeholder="Unit"

                        // isMulti
                        options={[
                          { name: "Unit", value: 'INR', label: 'INR' },
                          { name: "Unit", value: 'DOLLAR', label: 'DOLLAR' },
                          { name: "Unit", value: 'POUND', label: 'POUND' },
                          { name: "Unit", value: 'EURO', label: 'EURO' },
                        ]}
                        onChange={(e) => {
                          setrequirementRate((prev) => ({ ...prev, ['unit']: e.value }))
                        }}

                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Warehouse Grade <Overlays message={"From 1-10 scale"} />
                    </Form.Label>
                  </p>
                  <Form.Control
                    type="number"
                    min={1}
                    max={10}
                    maxLength={50}
                    placeholder="Enter grade of warehouse"
                    onChange={(e) => {
                      if (e.target.value < 1) {
                        e.target.value = '';
                      } else if (e.target.value > 10) {
                        e.target.value = '';
                      }
                      handleRequirementDetailsChange(e)
                    }}
                    name="requirement_grade"
                    id="requirement_grade"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Requirement Area
                      {/* <Overlays message={"From 1-10 scale"} /> */}
                    </Form.Label>
                  </p>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Storage Area Required"
                        maxLength={6}
                        defaultValue={requirementArea?.area}
                        onChange={(e) => {
                          setRequirementArea((prev) => ({ ...prev, ['area']: e.target.value }))
                        }}
                        name="requirement_area"
                        id="requirement_area"
                      />
                    </Col>
                    <Col >
                      <Select
                        closeMenuOnSelect={true}
                        placeholder="Select..."

                        // isMulti
                        options={[
                          { name: "Unit", value: 'sqm', label: 'Square meters' },
                          { name: "Unit", value: 'sqft', label: 'Square feet' },
                          { name: "Unit", value: 'acre', label: 'Acres' },
                          { name: "Unit", value: 'hectare', label: 'Hectares' },
                        ]}
                        onChange={(e) => {
                          setRequirementArea((prev) => ({ ...prev, ['unit']: e.value }))
                        }}

                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Requirement Address {' '}
                      <Overlays message={"Enter the location manually where you want your warehouse"} />
                    </Form.Label>
                  </p>

                  <Form.Control
                    type="text"
                    placeholder="Requirement Location"
                    defaultValue={requirementDetails?.requirement_location}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_location"
                    id="requirement_location"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Requirement Location Details
                    </Form.Label>
                  </p>
                  <Client locationText={locationText} setlocationText={setlocationText} />
                </Form.Group>

              </Col>
              <Col md={6} className="">
                <Form.Group className="mb-4">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Max Distance From Location (in Kms)
                      {/* <Overlays message={"From 1-10 scale"} /> */}
                    </Form.Label>
                  </p>
                  <Form.Control
                    type="number"
                    maxLength={50}
                    min={0}
                    defaultValue={requirementDetails?.requirement_max_distance}
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = ''
                      }
                      handleRequirementDetailsChange(e);
                    }}
                    name="requirement_max_distance"
                    id="requirement_max_distance"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Required Duration
                      {/* <Overlays message={"From 1-10 scale"} /> */}
                    </Form.Label>
                  </p>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        min={0}
                        maxLength={50}
                        placeholder="Enter required duration"
                        onChange={(e) => {
                          if (e.target.value < 0) {
                            e.target.value = '';
                          }
                          setRequirementDuration((prev) => ({ ...prev, ["duration"]: e.target.value }))
                          console.log(requirementDuration)
                        }}
                        name="requirement_duration"
                        id="requirement_age"
                      />
                    </Col>
                    <Col >
                      <Select
                        closeMenuOnSelect={true}
                        placeholder="Unit"

                        // isMulti
                        options={[
                          { name: "Unit", label: "Day", value: "Day" },
                          { name: "Unit", label: "Month", value: "Month" },
                          { name: "Unit", label: "Year", value: "Year" },
                        ]}
                        onChange={(e) => {
                          setRequirementDuration((prev) => ({ ...prev, ["unit"]: e.value }))
                          console.log(requirementDuration)
                        }}

                      />
                    </Col>
                  </Row>



                </Form.Group>
                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Warehouse Type
                      {/* <Overlays message={"From 1-10 scale"} /> */}
                    </Form.Label>
                  </p>
                  <Select
                    closeMenuOnSelect={true}
                    placeholder="Select Warehouse Type"
                    defaultValue={{ value: requirementDetails.requirement_wh, name: requirementDetails.requirement_wh, label: requirementDetails.requirement_wh }
                    }
                    // isMulti
                    options={WarehouseTypes}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setRequirementDetails(prev => ({
                        ...prev,
                        ['requirement_wh']: event.value
                      }));
                    }}
                  />
                </Form.Group>
                {/* <Form.Group className="mb-3">
                  <Form.Label>Types of WH Required</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails?.requirement_wh}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_wh"
                    id="requirement_wh"
                  />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Warehouse Age
                      {/* <Overlays message={"From 1-10 scale"} /> */}
                    </Form.Label>
                  </p>
                  <Form.Control
                    type="number"
                    min={0}

                    maxLength={50}
                    placeholder="Enter age of warehouse"
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = '';
                      }
                      handleRequirementDetailsChange(e);

                    }}
                    name="requirement_age"
                    id="requirement_age"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p className='mb-3 select2-container'>
                    <Form.Label>Other Requirements
                      {/* <Overlays message={"From 1-10 scale"} /> */}
                    </Form.Label>
                  </p>
                  <Form.Control
                    as="textarea"
                    defaultValue={requirementDetails?.requirement_other_details}
                    maxLength={500}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_other_details"
                    id="requirement_other_details"
                    rows={9}
                    style={{ height: "244px" }}

                  />
                </Form.Group>

                {/* <Form.Group className="mb-3">
                  <Form.Label>CustomerId</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={customerId}
                    onChange={handleRequirementDetailsChange}
                    name="customer_id"
                    id="customer_id"
                    readOnly={true}
                  />
                </Form.Group> */}
              </Col>
            </Row>
            <div className="text-center mt-3">
              <Button
                type="submit"
                className='m-2 btn btn-success'
                disabled={!userExistsDB}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default NewPostCustomer;
