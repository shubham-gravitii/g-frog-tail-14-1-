"use client"
// @ts-nocheck
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
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

import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { AutoConnectProvider } from '../../components/AutoConnectProvider';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import * as Constants from '../../utils/constants';
import { UniqueID } from '../../utils/uuidGenerate';
import { TS } from '../../utils/currentTimestamp';

const network = clusterApiUrl(Constants.solana_network);

const wallets = [new PhantomWalletAdapter()]

export const opts = {
  preflightCommitment: "processed"
}

const NewPost = () => {

  const wallet = useWallet()

  const [walletAddress, setWalletAddress] = useState<HTMLInputElement | void | string>('')
  const [usrRole, setUsrRole] = useState<HTMLInputElement | void | string>('')

  if (walletAddress == "" || walletAddress == null) {

    async function getWalletAddress() {
      // create the provider and return it to the caller 
      const connection = new Connection(network, opts.preflightCommitment);
      const provider = new AnchorProvider(
        connection, wallet, opts.preflightCommitment,
      );
      return await provider.wallet.publicKey;
    }
    const publicKey = getWalletAddress();
    publicKey.then(value => {
      setWalletAddress(value);
      console.log(walletAddress)
    })
  }

  if ((usrRole.length == 0 || usrRole == null || usrRole == "") && (walletAddress != "" && walletAddress != null)) {
    const headers = {
      'Authorization': 'Bearer mytoken',
      'accept': 'application/json'
    };
    axios.get(Constants.api_gateway_host + "/user_profile/?WALLET_ADDRESS=" + walletAddress, { headers })
      .then((res) => {
        //console.log(JSON.parse(res.request.response).response[0].user_role)
        //redirect logic
        if (res.status == 200) {
          var roleVal = JSON.parse(res.request.response).response[0].user_role
          setUsrRole(roleVal);

          if (roleVal == "Carrier") {
            setID("GC-" + walletAddress.toString().substring(0, 26));
            setMotID(UniqueID(roleVal));

          } else if (roleVal == "Broker") {
            setID("GB-" + walletAddress.toString().substring(0, 26));
            setIDLoad(UniqueID(roleVal));
          }

          setTimestamp(TS());

        }
      }).catch((err) => {
        console.log(err);
      });
  }
  console.log("pub key-->", walletAddress);
  console.log("Role--->", usrRole);
  //console.log("ID--->",ID);

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
  const [selectedSource, setSelectedSource] = useState('')
  const [ID, setID] = useState('')
  const [MotID, setMotID] = useState('')
  const [Dates, setDates] = useState('');
  const [Timestamp, setTimestamp] = useState('')
  const [DeliveryDate, setDeliveryDate] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [distance, setdistance] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>()
  const [selectedTags, setSelectedTags] = useState([])
  const [rate, setRate] = useState("")
  const [IDName, setIDName] = useState("");
  const [IDLoad, setIDLoad] = useState("");
  const [Timestamps, setTimestamps] = useState("");
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
  // const [data , setDate] =  useState("") ;
  //const [userRole, setUserRole] = useState("");

  //setUserRole(get_user_role())

  const { register, handleSubmit, reset } = useForm();
  function clearFields(event) {
    // we have to convert event.target to array
    // we use from method to convert event.target to array
    // after that we will use forEach function to go through every input to clear it
    Array.from(event.target).forEach((e) => (e.value = ""));
  }
  const handleMultiSelect = (selectedItems) => {
    const selects = [];
    for (let i = 0; i < selectedItems.length; i++) {
      selects.push(selectedItems[i]['value']);
    }
    console.log("tags are --->" + selects)
    const selectStr = JSON.stringify(selects);
    setSelectedTags(selects);
  }

  const onSubmit = async () => {

    const article = { title: 'React POST Request Example' };
    const headers = {
      'Authorization': 'Bearer mytoken',
      'accept': 'application/json'
    };
    if (roleVal == "Carrier") {
      const params_carrier_mot = 'carrier_mot/?' + 'CARRIER_ID=' + ID + '&CARRIER_MOT_ID=' + IDLoad + '&CARRIER_MOT_CREATED_TIMESTAMP=' + Timestamps + '&CARRIER_MOT_ORIGIN=' + selectedSource + '&CARRIER_MOT_DESTINATION=' + selectedDestination + '&CARRIER_MOT_TOTAL_DISTANCE=' + distance + '&CARRIER_MOT_EQUIPMENT_TYPE=' + selectedEquipment + '&CARRIER_MOT_PICKUP_DATE=' + Dates + '&CARRIER_MOT_DELIVERY_DATE=' + DeliveryDate
      const hostname = Constants.api_gateway_host;
      axios.post(hostname + params_carrier_mot, article, { headers })
        .then((response) => {
          console.log(response)
          console.log(response.data)
        }).catch((err) => {
          console.log(err);
        });
      clearFields(event);
    } else if (roleVal == "Broker") {
      const params_broker_load = 'broker_load/?' + 'BROKER_ID=' + IDName + '&BROKER_LOAD_ID=' + MotID + '&BROKER_LOAD_CREATED_TIMESTAMP=' + Timestamp + '&BROKER_LOAD_ORIGIN=' + selectedSource + '&BROKER_LOAD_DESTINATION=' + selectedDestination + '&BROKER_LOAD_TOTAL_DISTANCE=' + Distances + '&BROKER_LOAD_EQUIPMENT_TYPE=' + selectedEquipment + '&BROKER_LOAD_PICKUP_DATE=' + pickupdates + '&BROKER_LOAD_DELIVERY_DATE=' + delivery + '&BROKER_LOAD_WEIGHT=' + weight + '&BROKER_LOAD_COMMODITY' + commodity + "&BROKER_LOAD_RATES" + rates + '&BROKER_LOAD_ADDTIONAL' + addition + '&BROKER_LOAD_LOAD' + load
      const hostnames = Constants.api_gateway_host;
      axios.post(hostnames + params_broker_load, article, { headers })
        .then((response) => {
          console.log(response)
        }).catch((err) => {
          console.log(err);
        });
    }
    //Owner
    if (roleVal == "Owner") {
      const params_wh_owner_details = 'wh_owner_details/?' + 'OWNER_ENTITY_ID=' + id + '&OWNER_ID=' + ownerId + '&OWNER_ID_CREATED_TIMESTAMP=' + timestamp + '&OWNER_FULL_NAME=' + fullName + '&OWNER_PHONE_NUMBER=' + phoneNumber + '&OWNER_EMAIL_ID=' + emailId + '&OWNER_ADDRESS=' + address + '&OWNER_ID_DOC_TYPE=' + docType + '&OWNER_ID_DOC_NUMBER=' + docNumber + '&OWNER_ENTITY_TYPE=' + entityType + '&OWNER_ENTITY_NAME=' + entityName + '&OWNER_ENTITY_REGISTRATION_NUMBER=' + regNumber + '&OWNER_ENTITY_REGISTERED_ADDRESS=' + registeredAddress + '&OWNER_ENTITY_PAN=' + pan + '&IS_ACTIVE=' + isActive + '&IS_VERIFIED=' + isVerified;
      const hostname = Constants.api_gateway_host;
      axios.post(hostname + params_wh_owner_details, article, { headers })
        .then((response) => {
          console.log(response);
          console.log(response.data);
        }).catch((err) => {
          console.log(err);
        });
      clearFields(event);
    }
    
  }

  const currentDate = new Date();
  let maxDate;

  if (endDate) {
    maxDate = currentDate;
  } else {
    const rangeMaxDate = add(new Date(), { days: 365 });
    maxDate = rangeMaxDate > currentDate ? currentDate : rangeEnd;
  }

  return (
    <>
      <React.Fragment>
                <section className="categoryarea black-bg pt-80 pb-80">
                </section>
                <Container fluid={true} className="header__area black-bg">

        <meta httpEquiv='cache-control' content='no-cache' />
        <meta httpEquiv='expires' content='0' />
        <meta httpEquiv='pragma' content='no-cache' />

        {/* to select the form for user with role as Carrier*/}
        {usrRole == "Carrier" && (
          <>
            <Container fluid={true}>
              <div className="section__title-wrapper text-center mb-60">
                <br />
                <h2 style={{ color: 'white' }} className="section__title">Your  Post</h2>
                <p style={{ color: 'white' }}>Post your load or Post your truck</p>
                <br />
              </div>
              <div className="sign__wrapper white-bg">
                <div className="sign__form">
                  <SolClient />
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
                        maxLength={50}
                        defaultValue={ID}
                        name="carrierID"
                        id="carrierID"
                        readOnly={true}
                      />
                    </div>

                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        MOT ID - Gravitii
                      </p>
                      <Input
                        type="text"
                        maxLength={50}
                        defaultValue={MotID}
                        name="motID"
                        id="motID"
                        readOnly={true}
                      />
                    </div>


                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Created Timestamp
                      </p>

                      <Input
                        type="text"
                        maxLength={50}
                        defaultValue={Timestamp}
                        name="timeStampCarrier"
                        id="timeStampCarrier"
                        readOnly={true}
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
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setdistance(event.target.value) }}
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
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setSelectedEquipment(event.target.value) }}
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
          </>
        )}

        {/* to select the form for user with role as Broker*/}
        {usrRole == "Broker" && (
          <>
            <Container fluid={true}>
              <div className="sign__wrapper white-bg">
                <div className="sign__form">
                  <SolClient />
                  <div className="mt-3">
                    <br></br>

                    <h4>
                      <label> <b>BROKER_LOAD FORM</b></label>
                    </h4>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Broker ID
                      </p>
                      <Input
                        type="text"
                        maxLength={50}
                        defaultValue={ID}
                        name="walletID"
                        id="walletID"
                        readOnly={true}
                      />
                    </div>

                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Load ID - Gravitii
                      </p>
                      <Input
                        type="text"
                        maxLength={50}
                        defaultValue={IDLoad}
                        name="loadID"
                        id="loadID"
                        readOnly={true}
                      />
                    </div>

                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Created Timestamp
                      </p>

                      <Input
                        type="text"
                        maxLength={50}
                        defaultValue={Timestamp}
                        name="timestampBroker"
                        id="timestampBroker"
                        readOnly={true}
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
                        <label>Load Pickup Date</label>
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
                          setpickupdates(dateStr)
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <p className="input-group">
                        <label>Load Delivery Date</label>
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
                          setdelivery(dateStr)
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Equipment Type
                      </p>
                      <Input
                        type="text"
                        maxLength={25}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setload(event.target.value) }}
                        name="size"
                        id="size"
                      />
                    </div>


                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Load Distance (km/hr)
                      </p>
                      <Input
                        type="text"
                        maxLength={25}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setDistances(event.target.value) }}
                        name="size"
                        id="size"
                      />
                    </div>

                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Load Weight (kg/g)
                      </p>
                      <Input
                        type="text"
                        maxLength={25}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setweight(event.target.value) }}
                        name="size"
                        id="size"
                      />
                    </div>

                    <div className="mt-3">
                      <p className="mb-3 select2-container">
                        <Label>Origin</Label>
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
                        Commodity
                      </p>
                      <Input
                        type="text"
                        maxLength={25}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setcommodity(event.target.value) }}
                        name="size"
                        id="size"
                      />
                    </div>

                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Offered Rate ($)
                      </p>
                      <Input
                        type="text"
                        maxLength={25}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setrates(event.target.value) }}
                        name="size"
                        id="size"
                      />
                    </div>

                    <div className="mt-3">
                      <p className="text-muted m-b-15">
                        Additional Requirements
                      </p>
                      <Input
                        type="text"
                        maxLength={25}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setaddition(event.target.value) }}
                        name="size"
                        id="size"
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
          </>
        )}
         {usrRole === "Owner" && (
              <>
        <Container fluid={true}>
      <div className="section__title-wrapper text-center mb-60">
        <br />
        <h2 style={{ color: "white" }} className="section__title">
          Owner Details
        </h2>
        <br />
      </div>
      <div className="sign__wrapper white-bg">
        <div className="sign__form">
          <SolClient />
          <div className="mt-3">
            <br></br>
            <h4>
              <label>
                {" "}
                <b>Owner Details Form</b>
              </label>
            </h4>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-3">
              <p className="mb-3 select2-container">
                <Label> Owner Entity ID</Label>
              </p>
              <Input
                type="text"
                maxLength={50}
                defaultValue={ownerEntityId}
                name="ownerEntityId"
                id="ownerEntityId"
                readOnly={true}
              />
            </div>

            <div className="mt-3">
              <p className="mb-3 select2-container">
                <Label> Owner ID</Label>
              </p>
              <Input
                type="text"
                maxLength={50}
                defaultValue={ownerId}
                name="ownerId"
                id="ownerId"
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
                defaultValue={ownerIdCreatedTimestamp}
                name="ownerIdCreatedTimestamp"
                id="ownerIdCreatedTimestamp"
                readOnly={true}
              />
            </div>

            <div className="mt-3">
              <p className="mb-3 select2-container">
                <Label>Full Name</Label>
              </p>
              <Input
                type="text"
                maxLength={50}
                defaultValue={ownerFullName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOwnerFullName(event.target.value);
                }}
                name="ownerFullName"
                id="ownerFullName"
              />
            </div>

            <div className="mt-3">
              <p className="mb-3 select2-container">
                <Label>Phone Number</Label>
              </p>
              <Input
                type="text"
                maxLength={50}
                defaultValue={ownerPhoneNumber}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOwnerPhoneNumber(event.target.value);
                }}
                name="ownerPhoneNumber"
                id="ownerPhoneNumber"
              />
            </div>

            <div className="mt-3">
              <p className="mb-3 select2-container">
                <Label>Email ID</Label>
              </p>
              <Input
                type="email"
                maxLength={50}
                defaultValue={ownerEmailId}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOwnerEmailId(event.target.value);
                }}
                name="ownerEmailId"
                id="ownerEmailId"
              />
            </div>

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

            <div className="mt-3">
              <p className="mb-3 select2-container">
                <Label>ID Document Type</Label>
              </p>
              <Input
                type="text"
                maxLength={50}
                defaultValue={ownerIdDocType}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOwnerIdDocType(event.target.value);
                }}
                name="ownerIdDocType"
                id="ownerIdDocType"
              />
            </div>

            <div className="mt-3">
              <p className="mb-3 select2-container">
                <Label>ID Document Number</Label>
              </p>
              <Input
                type="text"
                maxLength={50}
                defaultValue={ownerIdDocNumber}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOwnerIdDocNumber(event.target.value);
                }}
                name="ownerIdDocNumber"
                id="ownerIdDocNumber"
                />
                </div>
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

        <div className="mt-3">
          <p className="mb-3 select2-container">
            <Label>PAN</Label>
          </p>
          <Input
            type="text"
            maxLength={50}
            defaultValue={ownerEntityPAN}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setOwnerEntityPAN(event.target.value);
            }}
            name="ownerEntityPAN"
            id="ownerEntityPAN"
          />
        </div>

        <div className="mt-3">
          <p className="mb-3 select2-container">
            <Label>Is Active?</Label>
          </p>
          <Input
            type="text"
            maxLength={50}
            defaultValue={isActive}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setIsActive(event.target.value);
            }}
            name="isActive"
            id="isActive"
          />
        </div>

        <div className="mt-3">
          <p className="mb-3 select2-container">
            <Label>Is Verified?</Label>
          </p>
          <Input
            type="text"
            maxLength={50}
            defaultValue={isVerified}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setIsVerified(event.target.value);
            }}
            name="isVerified"
            id="isVerified"
          />
        </div>

        <div className="mt-3">
          <br></br>
          <button type="submit" className="m-btn m-btn-4 w-100">
            {" "}
            <span></span> Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</Container>
</>
)}


      </Container>
            </React.Fragment>
    </>
  )
}

export default NewPost
