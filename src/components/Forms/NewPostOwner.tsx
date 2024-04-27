"use client"
// @ts-nocheck
import { useRouter } from "next/router";
import React, { useState } from "react"
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap"
import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
import { add, min } from 'date-fns';
import Select from "react-select"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import axios from 'axios'
import { useForm } from "react-hook-form";
import MetaTags from 'react-meta-tags';
import SolClient from "../Web3Client/SolClient";
import initializeHello from '../Home/Header';
import RateRecords from "../Board/RateRecords";
import { stringify } from "querystring";


import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';


const NewPost = () => {

  const optionGroup = 
  //['Liquids','Solids','Auto','BorderCrossing']
  [{
      options: [
        { label: "Liquids", value: "Liquids" },
        { label: "Solids", value: "Solids" },
        { label: "Auto", value: "Auto" },
        { label: "BorderCrossing", value: "BorderCrossing" }
      ]
    }
  ]

  const optionSourceGroup = [
    {
      label: "Illinois",
      options: [
        { label: "Springfield", value: "Springfield" },
        { label: "Chicago", value: "Chicago" },
        { label: "Rockford", value: "Rockford" },
        { label: "Champaign", value: "Champaign" }
      ]
    },
    {
      label: "Maryland",
      options: [
        { label: "Annapolis", value: "Annapolis" },
        { label: "Baltimore", value: "Baltimore" },
        { label: "Columbia", value: "Columbia" },
        { label: "Hanover", value: "Hanover" }
      ]
    }
  ]

  const optionTargetGroup = [
    {
      label: "Illinois",
      options: [
        { label: "Springfield", value: "Springfield" },
        { label: "Chicago", value: "Chicago" },
        { label: "Rockford", value: "Rockford" },
        { label: "Champaign", value: "Champaign" }
      ]
    },
    {
      label: "Maryland",
      options: [
        { label: "Annapolis", value: "Annapolis" },
        { label: "Baltimore", value: "Baltimore" },
        { label: "Columbia", value: "Columbia" },
        { label: "Hanover", value: "Hanover" }
      ]
    }
  ]

  const router = useRouter()
  const [route, setRoute] = useState()
  // const [selectedSource, setSelectedSource] = useState('')
  // const [ID, setID] = useState('')
  // const [MotID, setMotID] = useState('')
  // const [Dates , setDates] = useState('');
  // const [Timestamp, setTimestamp]= useState('')
  // const [DeliveryDate, setDeliveryDate] = useState('')
  // const [selectedDestination,setSelectedDestination] = useState('')
  // const [distance,setdistance] = useState('');
  // const [selectedEquipment,setSelectedEquipment] = useState<string>()
  // const [selectedTags,setSelectedTags] = useState([])
  // const [rate,setRate] = useState("")
  // const [IDName , setIDName] = useState("");
  // const [IDLoad, setIDLoad] = useState("");
  // const [Timestamps, setTimestamps] = useState("");
  // const [pickupdates, setpickupdates] = useState("");
  // const [delivery , setdelivery] =  useState("");
  // const [load , setload] = useState("");
  // const [Distances , setDistances]=  useState("");
  // const [weight , setweight] = useState("");
  // const [commodity , setcommodity] =  useState("");
  // const [rates , setrates] =  useState("");
  // const [addition , setaddition] = useState("");
  // const [startDate, setStartDate] =  useState("");
  // const [endDate, setEndDate] = useState("");
  // const [rangeEnd, setRangeEnd] = useState("");
  // const [data , setDate] =  useState("") ;
  

  
  


  const { register, handleSubmit,reset } = useForm();
  function clearFields(event) {
    // we have to convert event.target to array
    // we use from method to convert event.target to array
    // after that we will use forEach function to go through every input to clear it
    Array.from(event.target).forEach((e) => (e.value= ""));
  }
  const handleMultiSelect = (selectedItems) => {
    const selects = [];
    for (let i=0; i<selectedItems.length; i++) {
      selects.push(selectedItems[i]['value']);
    }
    console.log("tags are --->"+selects)
    const selectStr = JSON.stringify(selects);
    setSelectedTags(selects);
  }

  const onSubmit = async() => {
    const article = { title: 'React POST Request Example' };
    const headers = { 
        'Authorization': 'Bearer mytoken',
        'accept': 'application/json'
    };
  // const  params_carrier_mot =  'carrier_mot/?' +'CARRIER_ID='+ID+'&CARRIER_MOT_ID='+IDLoad+'&CARRIER_MOT_CREATED_TIMESTAMP='+Timestamps+'&CARRIER_MOT_ORIGIN='+selectedSource+'&CARRIER_MOT_DESTINATION='+selectedDestination+'&CARRIER_MOT_TOTAL_DISTANCE='+distance+'&CARRIER_MOT_EQUIPMENT_TYPE='+selectedEquipment+'&CARRIER_MOT_PICKUP_DATE='+Dates+'&CARRIER_MOT_DELIVERY_DATE='+DeliveryDate
  // const hostname = 'https://g-badger.herokuapp.com/'
  //   axios.post(hostname+params_carrier_mot,article, { headers })
  //         .then((response) => {
  //           console.log(response)
  //           console.log(response.data)
  //         }).catch((err) => {
  //           console.log(err);
  //         });
  // clearFields(event);

  //   const  params_broker_load =  'broker_load/?' +'BROKER_ID='+IDName+'&BROKER_LOAD_ID='+MotID+'&BROKER_LOAD_CREATED_TIMESTAMP='+Timestamp+'&BROKER_LOAD_ORIGIN='+selectedSource+'&BROKER_LOAD_DESTINATION='+selectedDestination+'&BROKER_LOAD_TOTAL_DISTANCE='+Distances+'&BROKER_LOAD_EQUIPMENT_TYPE='+selectedEquipment+'&BROKER_LOAD_PICKUP_DATE='+pickupdates+'&BROKER_LOAD_DELIVERY_DATE='+delivery+'&BROKER_LOAD_WEIGHT='+weight+'&BROKER_LOAD_COMMODITY'+commodity+"&BROKER_LOAD_RATES"+rates+'&BROKER_LOAD_ADDTIONAL'+addition+'&BROKER_LOAD_LOAD'+load
  //  const hostnames = 'https://g-badger.herokuapp.com/'
  //   axios.post(hostnames+params_broker_load,article, { headers })
  //         .then((response) => {
  //           console.log(response)
  //         }).catch((err) => {
  //           console.log(err);
  //         });
  const params_wh_owner_details = 'wh_owner_details/?'+'OWNER_ENTITY_ID=' + ownerEntityId + '&OWNER_ID=' + ownerId + '&OWNER_ID_CREATED_TIMESTAMP=' + ownerIdCreatedTimestamp + '&OWNER_FULL_NAME=' + ownerFullName + '&OWNER_PHONE_NUMBER=' + ownerPhoneNumber + '&OWNER_EMAIL_ID=' + ownerEmailId + '&OWNER_ADDRESS=' + ownerAddress + '&OWNER_ID_DOC_TYPE=' + ownerIdDocType + '&OWNER_ID_DOC_NUMBER=' + ownerIdDocNumber + '&OWNER_ENTITY_TYPE=' + ownerEntityType + '&OWNER_ENTITY_NAME=' + ownerEntityName + '&OWNER_ENTITY_REGISTRATION_NUMBER=' + ownerEntityRegistrationNumber + '&OWNER_ENTITY_REGISTERED_ADDRESS=' + ownerEntityRegisteredAddress + '&OWNER_ENTITY_PAN=' + ownerEntityPan + '&IS_ACTIVE=' + isActive + '&IS_VERIFIED=' + isVerified
  const hostname = 'https://g-badger.herokuapp.com/';
  
  axios.post(hostname + params_wh_owner_details, article, { headers })
        .then((response) => {
          console.log(response);
          console.log(response.data);
        }).catch((err) => {
          console.log(err);
        });
  clearFields(event);
  

}

const currentDate = new Date();
let maxDate;

// if (endDate) {
//   maxDate = currentDate;
// } else {
//   const rangeMaxDate = add( new Date(), { days: 365 } ); 
//   maxDate = rangeMaxDate > currentDate ? currentDate : rangeEnd;
// }


    return (
      <>
        <div className="page-content">
          
        <meta httpEquiv='cache-control' content='no-cache' />
        <meta httpEquiv='expires' content='0' />
        <meta httpEquiv='pragma' content='no-cache' />
        
        
        <Container fluid={true}>
          <div className="section__title-wrapper text-center mb-60">
            <br />
            <h2 style={{ color: 'white' }} className="section__title">Your  Post</h2>
            <p style={{ color: 'white' }}>Post your MOT</p>
            <br />
          </div>
            <div className="sign__wrapper white-bg">
            <div className="sign__form">
            <SolClient/>
            <div className="mt-3">
                    <br></br>
  
                    <h4>
                      <label> <b>CARRIER_MOT FORM</b></label>                   
                    </h4>
                  </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-3">
                    <p className="text-muted m-b-15">
                      Carrier ID
                    </p>
                    <Input
                      type="text"
                      maxLength={25}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>)=>setID(event.target.value)}
                      name="name"
                      id="name"
                      //STYLE="color: #FFFFFF; font-family: Verdana; background-color: #72A4D2; opactiy:0.1"
                    />
                  </div>

                  <div className="mt-3">
                    <p className="text-muted m-b-15">
                      MOT ID - Gravitii
                    </p>
                    <Input
                      type="text"
                      maxLength={25}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>)=>setMotID(event.target.value)}
                      name="volume"
                      id="volume"
                    />
                  </div>


                  <div className="mt-3">
                    <p className="text-muted m-b-15">
                      Created Timestamp
                    </p>
                    
                    <Input
                      //required {...register("rate")}
                      type="text"
                      maxLength={25}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setTimestamp(event.target.value)}}
                      name="rate"
                      id="rate"
                    />
                  </div>
                 
                  
                  <div className="mt-3">
                  <p className="mb-3 select2-container">
                    <Label>MOT Location</Label>
                    </p>
                    <Select
                      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                        setSelectedSource(event['value']);
                      }}
                      options={optionSourceGroup}
                      classNamePrefix="select2-selection"
                    />
                  
                  </div>
                  
                  <div className="mt-3">
                      <p className="mb-3 select3-container">
                        <Label>Destination</Label>
                      </p>
                      <Select
                        onChange={(event: React.ChangeEvent<unknown>) => {
                          setSelectedDestination(event['value']);
                        }}
                        options={optionTargetGroup}
                        classNamePrefix="select3-selection"
                      />
                  </div>

                  <div className="mt-3">
                    <p className="text-muted m-b-15">
                      Total Distance (Km/hr)
                    </p>
                    <Input
                      type="text"
                      maxLength={25}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setdistance(event.target.value)}}
                      name="size"
                      id="size"
                    />
                  </div>

                  <div className="mt-3">
                    <p className="text-muted m-b-15">
                      Equipment Type
                    </p>
                    <Input
                      type="text"
                      maxLength={25}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setSelectedEquipment(event.target.value)}}
                      name="size"
                      id="size"
                    />
                  </div>

                  <div className="mt-3">
                    <br></br>
  
                    <h4>
                      <label> <b>When is it available? </b></label>                   
                    </h4>
                  </div>

                <div className="mt-3">
                  <p className="input-group">
                    <label>Pickup Date</label>                   
                  </p>
                  <InputGroup>
              
                                                    <Flatpickr
                                                        className="form-control d-block"
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        maxDate={maxDate}
                                                        placeholder="choose your dates"
                                                        onChange={(selectedDates, dateStr, Unix_timestamp) => {
                                                            setDates(dateStr)
                                                            }}
                                                        options={{
                                                          mode: "range",
                                                          dateFormat: "Y-m-d"
                                                        }}
                                                    />
                                                </InputGroup>
                </div>

                <div className="mt-3">
                  <p className="input-group">
                    <label>Delivery Date</label>                   
                  </p>
                  <Flatpickr
                    className="form-control d-block"
                    data-enable-time
                    name="goodsreadyby"
                    placeholder="Select date and time"
                    options={{
                      enableTime: true,
                      dateFormat: "Y-m-d H:i:s"
                    }}
                    onChange={(selectedDates, dateStr, instance) => {
                      const firstDate = selectedDates[0];
                      console.log({ firstDate, dateStr });
                      setDeliveryDate(dateStr)
                    }}
                  />
                </div>

              <div className="mt-3">
                <br></br>
                <button type='submit' className="m-btn m-btn-4 w-100"> <span></span> Submit</button>
              </div>

            </form>
            </div>
            </div>
          </Container>

          {/* <Row>
          {params_carrier_mot.map((f,i)=>{
              return  <RateRecords ID={f.setID} DeliveryDate={f.setTimestamp} MotID={f.setMotID} distance={f.setdistance}type={f.setSelectedEquipment} destination={f.setSelectedDestination
              } origin={f.setSelectedSource} Date={f.setDate} Timestamp={f.setTimestamp}/>
              
            })}
            </Row> */}
        </div>
      </>
    )
}

export default NewPost
