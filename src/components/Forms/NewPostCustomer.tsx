"use client"
// @ts-nocheck
import { useRouter } from "next/router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import * as Constants from "../../utils/constants";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import "@vtaits/react-color-picker/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import { add, min } from "date-fns";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import axios from "axios";
import { useForm } from "react-hook-form";
import MetaTags from "react-meta-tags";
import SolClient from "../Web3Client/SolClient";
import Success from "../Common/Success";
import Error from "../Common/Error";
import initializeHello from "../Home/Header";
import RateRecords from "../Board/RateRecords";
import { stringify } from "querystring";

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
import * as Constants from "../../utils/constants";
import { UniqueID } from "../../utils/uuidGenerate";
import { TS } from "../../utils/currentTimestamp";

const network = clusterApiUrl(Constants.solana_network);

const wallets = [new PhantomWalletAdapter()];

export const opts = {
  preflightCommitment: "processed",
};

const NewPost = () => {
  const wallet = useWallet();

  const [walletAddress, setWalletAddress] = useState<
    HTMLInputElement | void | string
  >("");
  const [usrRole, setUsrRole] = useState<HTMLInputElement | void | string>("");

  if (walletAddress == "" || walletAddress == null) {
    async function getWalletAddress() {
      // create the provider and return it to the caller
      const connection = new Connection(network, opts.preflightCommitment);
      const provider = new AnchorProvider(
        connection,
        wallet,
        opts.preflightCommitment
      );
      return await provider.wallet.publicKey;
    }
    const publicKey = getWalletAddress();
    publicKey.then((value) => {
      setWalletAddress(value);
      console.log(walletAddress);
    });
  }

  if (
    (usrRole.length == 0 || usrRole == null || usrRole == "") &&
    walletAddress != "" &&
    walletAddress != null
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
          var roleVal = JSON.parse(res.request.response).response[0].user_role;
          console.log("roleVal--->", roleVal);
          setUsrRole(roleVal);

          setBrokerID("GB-" + walletAddress.toString().substring(0, 26));
          setCarrierID("GC-" + walletAddress.toString().substring(0, 26));
          setMotID(UniqueID(roleVal));
          setIDLoad(UniqueID(roleVal));
          setTimestamp(TS());
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //console.log("ID izz--->",ID);
  }
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
  ];

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

  const onSubmit = async () => {
    const article = { title: "React POST Request Example" };
    const headers = {
      Authorization: "Bearer mytoken",
      accept: "application/json",
    };
    if (usrRole == "Carrier") {
      const params_carrier_mot =
        "carrier_mot/?" +
        "CARRIER_ID=" +
        CarrierID +
        "&CARRIER_MOT_ID=" +
        MotID +
        "&CARRIER_MOT_CREATED_TIMESTAMP=" +
        Timestamp +
        "&CARRIER_MOT_ORIGIN=" +
        selectedSource +
        "&CARRIER_MOT_DESTINATION=" +
        selectedDestination +
        "&CARRIER_MOT_TOTAL_DISTANCE=" +
        distance +
        "&CARRIER_MOT_EQUIPMENT_TYPE=" +
        selectedEquipment +
        "&CARRIER_MOT_PICKUP_DATE=" +
        Dates +
        "&CARRIER_MOT_DELIVERY_DATE=" +
        DeliveryDate;
      const hostname = Constants.api_gateway_host;
      axios
        .post(Constants.api_gateway_host + "/" + params_carrier_mot, article, {
          headers,
        })
        .then((response) => {
          console.log(response);
          console.log(response.data);
          // successNotification();
          alert("you have filled the form !");
          router.push("/ViewPost");
          clearFields(event);
          // setSuccessFlag("true");
        })
        .catch((err) => {
          console.log("error-->", err);
          // setErrorFlag("true");
          alert("you have filled the form !");
          clearFields(event);
        });
      //clearFields(event);
    } else if (usrRole == "Broker") {
      const params_broker_load =
        "broker_load/?" +
        "BROKER_ID=" +
        BrokerID +
        "&BROKER_LOAD_ID=" +
        IDLoad +
        "&BROKER_LOAD_CREATED_TIMESTAMP=" +
        Timestamp +
        "&BROKER_LOAD_ORIGIN=" +
        selectedSource +
        "&BROKER_LOAD_DESTINATION=" +
        selectedDestination +
        "&BROKER_LOAD_DISTANCE=" +
        Distances +
        "&BROKER_LOAD_EQUIPMENT_TYPE=" +
        selectedEquipment +
        "&BROKER_LOAD_PICKUP_DATE=" +
        pickupdates +
        "&BROKER_LOAD_DELIVERY_DATE=" +
        delivery +
        "&BROKER_LOAD_WEIGHT=" +
        weight +
        "&BROKER_LOAD_COMMODITY=" +
        commodity +
        "&BROKER_LOAD_RATE=" +
        rates +
        "&BROKER_LOAD_ADDITIONAL_REQUIREMENTS=" +
        addition;
      const hostnames = Constants.api_gateway_host;
      console.log("api call--->");
      console.log(Constants.api_gateway_host + "/" + params_broker_load);
      axios
        .post(Constants.api_gateway_host + "/" + params_broker_load, article, {
          headers,
        })
        .then((response) => {
          console.log(response);
          // successNotification();
          alert("you have filled the form !");
          router.push("/ViewPosts");
          clearFields(event);
          // setSuccessFlag("true");
        })
        .catch((err) => {
          console.log("error--->", err);
          // setErrorFlag("true");
          clearFields(event);
        });
    }else if (usrRole == "Customer") {
      const params_broker_load =
        "broker_load/?" +
        "BROKER_ID=" +
        BrokerID +
        "&BROKER_LOAD_ID=" +
        IDLoad +
        "&BROKER_LOAD_CREATED_TIMESTAMP=" +
        Timestamp +
        "&BROKER_LOAD_ORIGIN=" +
        selectedSource +
        "&BROKER_LOAD_DESTINATION=" +
        selectedDestination +
        "&BROKER_LOAD_DISTANCE=" +
        Distances +
        "&BROKER_LOAD_EQUIPMENT_TYPE=" +
        selectedEquipment +
        "&BROKER_LOAD_PICKUP_DATE=" +
        pickupdates +
        "&BROKER_LOAD_DELIVERY_DATE=" +
        delivery +
        "&BROKER_LOAD_WEIGHT=" +
        weight +
        "&BROKER_LOAD_COMMODITY=" +
        commodity +
        "&BROKER_LOAD_RATE=" +
        rates +
        "&BROKER_LOAD_ADDITIONAL_REQUIREMENTS=" +
        addition;
      const hostnames = Constants.api_gateway_host;
      console.log("api call--->");
      console.log(Constants.api_gateway_host + "/" + params_broker_load);
      axios
        .post(Constants.api_gateway_host + "/" + params_broker_load, article, {
          headers,
        })
        .then((response) => {
          console.log(response);
          // successNotification();
          alert("you have filled the form !");
          router.push("/ViewPosts");
          clearFields(event);
          // setSuccessFlag("true");
        })
        .catch((err) => {
          console.log("error--->", err);
          // setErrorFlag("true");
          clearFields(event);
        });
    }
  };

  return (
    <>
      <React.Fragment>
        <section className="categoryarea black-bg pt-80 pb-80"></section>
        <Container fluid={true} className="header__area black-bg">
          <meta httpEquiv="cache-control" content="no-cache" />
          <meta httpEquiv="expires" content="0" />
          <meta httpEquiv="pragma" content="no-cache" />

          {/* to select the form for user with role as Carrier*/}
          {/* {errorFlag == "true" && (
            <Error />
          )} */}

          {/* to select the form for user with role as Carrier*/}
          {/* {successFlag == "true" && (
            <Success />
          )} */}

          {/* to select the form for user with role as Carrier*/}
          {/* {(successFlag == "" && errorFlag == "") && usrRole == "Carrier" && ( */}
          {usrRole == "Customer" && (
            <>
              <Container fluid={true}>
                <div className="section__title-wrapper text-center mb-60">
                  <br />
                  <h2 style={{ color: "white" }} className="section__title">
                    Your Post
                  </h2>
                  <p style={{ color: "white" }}>
                    Post your load or Post your truck
                  </p>
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
                          <b>Carrier Mot Form</b>
                        </label>
                      </h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mt-3">
                        <p className="mb-3 select2-container">
                          <Label> Requirement Post ID</Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={50}
                          defaultValue={CarrierID}
                          name="carrierID"
                          id="carrierID"
                          readOnly={true}
                        />
                      </div>

                      <div className="mt-3">
                        <p className="mb-3 select2-container">
                          <Label> MOT ID - Gravitii</Label>
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
                        <p className="mb-3 select2-container">
                          <Label> Created Timestamp</Label>
                        </p>

                        {/* <p className="text-muted m-b-15">
                      Created Timestamp
                    </p> */}

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
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setSelectedSource(event["value"]);
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
                            setSelectedDestination(event["value"]);
                          }}
                          options={optionTargetGroup}
                          classNamePrefix="select3-selection"
                        />
                      </div>

                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Total Distance (In Miles)</Label>
                        </p>

                        {/* <p className="text-muted m-b-15">
                      Total Distance (Miles)
                    </p> */}
                        <Input
                          placeholder="Integer only"
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setdistance(event.target.value);
                          }}
                          name="size"
                          id="size"
                        />
                      </div>
                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Equipment Type</Label>
                        </p>
                        <Select
                          onChange={(event: React.ChangeEvent<unknown>) => {
                            setSelectedEquipment(event["value"]);
                          }}
                          options={EquipmentGroupname}
                          classNamePrefix="select3-selection"
                        />
                      </div>
                      {/* <div className="mt-3">
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
                  </div> */}

                      <div className="mt-3">
                        <br></br>

                        <h4>
                          <label>
                            {" "}
                            <b>When is it available? </b>
                          </label>
                        </h4>
                      </div>

                      <div className="mt-3">
                        <p className="input-group">
                          <label>Pickup Date</label>
                        </p>
                        <InputGroup>
                          <Flatpickr
                            className="form-control d-block"
                            // startDate={startDate}
                            // endDate={endDate}
                            // maxDate={maxDate}
                            placeholder="choose your dates"
                            onChange={(selectedDates, dateStr) => {
                              const firstDate = selectedDates[0];
                              console.log(epoch(dateStr));
                              setDates(epoch(dateStr));
                            }}
                            options={{
                              mode: "range",
                              dateFormat: "Y-m-d",
                            }}
                          />
                        </InputGroup>
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

          {/* to select the form for user with role as Broker*/}
          {/* {(successFlag == "" && errorFlag == "") && usrRole == "Broker" && ( */}
          {usrRole == "Customer" && (
            <>
              <Container fluid={true}>
                <div className="sign__wrapper white-bg">
                  <div className="sign__form">
                    <div className="mt-3">
                      <br></br>
                      <h4>
                        <label>
                          {" "}
                          <b>Customer Request Form </b>
                        </label>
                      </h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mt-3">
                        <p className="text-muted m-b-15">Requirement post  ID</p>
                        <Input
                          type="text"
                          maxLength={50}
                          defaultValue={BrokerID}
                          name="walletID"
                          id="walletID"
                          readOnly={true}
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-muted m-b-15">Created Timestamp</p>

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
                        <p className="mb-3 select3-container">
                          <Label>Requirement Location</Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setcommodity(event.target.value.replace(" ", "-"));
                          }}
                          name="size"
                          id="size"
                        />
                      </div>


                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Maximum Distance </Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setDistances(event.target.value.replace(" ", "-"));
                          }}
                          name="size"
                          id="size"
                        />
                      </div>


                      
                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Area Required </Label>
                        </p>
                        <Select
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setSelectedSource(event["value"]);
                          }}
                          options={optionSourceGroup}
                          classNamePrefix="select2-selection"
                        />
                      </div>


                      



                      

                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Type of WH Required </Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setDistances(event.target.value.replace(" ", "-"));
                          }}
                          name="size"
                          id="size"
                        />
                      </div>


                      



                      <div className="mt-3">
                        <p className="input-group">
                          <label>Duration</label>
                        </p>
                        <InputGroup>
                          <Flatpickr
                            className="form-control d-block"
                            // startDate={startDate}
                            // endDate={endDate}
                            // maxDate={maxDate}
                            placeholder="choose your dates"
                            onChange={(selectedDates, dateStr) => {
                              const firstDate = selectedDates[0];
                              console.log(epoch(dateStr));
                              setDates(epoch(dateStr));
                            }}
                            options={{
                              mode: "range",
                              dateFormat: "Y-m-d",
                            }}
                          />
                        </InputGroup>
                      </div>




                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Other details</Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setDistances(event.target.value.replace(" ", "-"));
                          }}
                          name="size"
                          id="size"
                        />
                      </div>

                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Rate</Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setDistances(event.target.value.replace(" ", "-"));
                          }}
                          name="size"
                          id="size"
                        />
                      </div>

                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Customer ID</Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setDistances(event.target.value.replace(" ", "-"));
                          }}
                          name="size"
                          id="size"
                        />
                      </div>


                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Active</Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setDistances(event.target.value.replace(" ", "-"));
                          }}
                          name="size"
                          id="size"
                        />
                      </div>
                      
                      <div className="mt-3">
                        <p className="mb-3 select3-container">
                          <Label>Verified</Label>
                        </p>
                        <Input
                          type="text"
                          maxLength={25}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setDistances(event.target.value.replace(" ", "-"));
                          }}
                          name="size"
                          id="size"
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
  );
};

export default NewPost;
