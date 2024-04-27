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
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { toast } from 'react-toastify';
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Client from "./Client"
import Overlays from '../../../components/Overlays'

const CustomerViewOwnPostForm = ({ requirement_details }) => {
  const [requirementDetails, setRequirementDetails] = useState(requirement_details);
  const [requirementStartDate, setRequirementStartDate] = useState(requirementDetails?.requirement_start_date);
  const [requirementDuration, setRequirementDuration] = useState(requirementDetails?.requirement_duration);
  const [loading, setLoading] = useState(false);

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

  const handleRequirementDetailsChange = (e: any) => {
    const { name, value } = e.target;
    setRequirementDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(requirementDetails);
  const handleGeocoordinates=(lat,long)=>{
    console.table(requirementDetails);
    const Lat=parseFloat(lat);
    const Long=parseFloat(long);
    setRequirementDetails((prev) => ({
        ...prev,
        "wh_gps_coordinates":`${Long} ${Lat}`,
        "latitude":Lat,
        "longitude":Long
    }));
    setTimeout(()=>console.log(requirementDetails),3000)
}


  const handleSubmit = (e) => {
    e.preventDefault();
    console.clear();
    notifyInfo("Your Details will be posted soon");
    console.log("Form Submitted");

    //Requirements Details
    if (requirementDetails.requirement_duration !== requirementDuration) {
      requirementDetails.requirement_duration = requirementDuration;
    }
    const newStartDate = requirementStartDate[0];
    if (requirementDetails.requirement_start_date !== newStartDate) {
      requirementDetails.requirement_start_date = newStartDate;
    }
    let coordinates = requirementDetails.wh_gps_coordinates.split(" ");
    requirementDetails.latitude = coordinates[1];
    requirementDetails.longitude = coordinates[0];
    console.log(requirementDetails);

    try {
      const article = { title: "React PUT Request Example" };

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
        "&latitude=" +
        requirementDetails.latitude +
        "&longitude=" +
        requirementDetails.longitude +
        "&REQUIREMENT_OTHER_DETAILS=" +
        requirementDetails.requirement_other_details +
        "&WH_GPS_COORDINATES=" +
        requirementDetails.wh_gps_coordinates +
        "&REQUIREMENT_RATE=" +
        requirementDetails.requirement_rate +
        "&CUSTOMER_ID=" +
        requirementDetails.customer_id +
        "&IS_VERIFIED=" +
        Constants.isVerified +
        "&IS_ACTIVE=" +
        Constants.isActive;
      console.log(newRequirementDetails);

      const requests = [
        axios.put(
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
        })
        .catch((error) => {
          notifyError("Error updating warehouse data");
          console.error("Error updating warehouse data:", error);
        });

      // router.push("/ViewPost");
    } catch (error) {
      console.log(error);
    }
  };

  const formatDates = (selectedDates) => {
    return selectedDates.map(date => date.toISOString().split('T')[0]);
  };

  return (
    <>
      <Container fluid={true} className="white-bg">
        <div className="Form">
          <Form onSubmit={handleSubmit}>
            <Row className="mt-5">
              <Col md={6}>
                
                <Form.Group className="mb-3">
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
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Requirement Start Date</Form.Label>
                  <InputGroup>
                    <Flatpickr
                      className="form-control d-block"
                      defaultValue={
                        requirementDetails?.requirement_start_date
                      }
                      placeholder="Choose your dates"
                      onChange={(selectedDates) => {
                        setRequirementStartDate(formatDates(selectedDates));
                      }}
                      options={{
                        altInput: true,
                      }}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>MAX Distance</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails?.requirement_max_distance}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_max_distance"
                    id="requirement_max_distance"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Requirement Address Detail</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails.requirement_location}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_location"
                    id="requirement_location"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                   <Form.Label>Requirement Location <Overlays message={"Mark position on map to help us locate you.Green(previous location) and blue(position to be changed)"}/></Form.Label>
                     <Client handleGeocoordinates={handleGeocoordinates} GPS={requirementDetails?.wh_gps_coordinates}/>
                </Form.Group> 

              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Requirement Area</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails?.requirement_area}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_area"
                    id="requirement_area"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Types of WH Required</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails?.requirement_wh}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_wh"
                    id="requirement_wh"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Required Duration</Form.Label>
                  <InputGroup>
                    <Flatpickr
                      className="form-control d-block"
                      placeholder="Choose your dates"
                      defaultValue={
                        requirementDetails?.requirement_duration
                      }
                      onChange={(selectedDates, dateStr) => {
                        const firstDate = selectedDates[0];
                        // console.log(epoch(dateStr));
                        console.log(dateStr)
                        setRequirementDuration(dateStr);
                      }}
                      options={{
                        mode: 'range',
                        dateFormat: 'Y-m-d',
                      }}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Required Other Details</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails?.requirement_other_details}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_other_details"
                    id="requirement_other_details"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Required Rate</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails?.requirement_rate}
                    onChange={handleRequirementDetailsChange}
                    name="requirement_rate"
                    id="requirement_rate"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>CustomerId</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    defaultValue={requirementDetails.customer_id}
                    onChange={handleRequirementDetailsChange}
                    name="customer_id"
                    id="customer_id"
                    readOnly={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center mt-3">
              <Button
                type="submit"
                className='m-2 btn btn-success '
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  )
}

export default CustomerViewOwnPostForm
