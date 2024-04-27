// @ts-nocheck
'use client'
import axios from 'axios'
import React, { useEffect, useState, useMemo } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap"
// import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
// import "flatpickr/dist/themes/material_blue.css"
import RecordCardBroker from './RecordCardBroker';
import RecordCardCarrier from './RecordCardCarrier';

import * as Constants from '../../utils/constants';

import Client from "./clientsidemappls";
import SearchBoards from "./SearchBoards";
import {useContext} from 'react'
import LoadingContext from '../../contexts/LoadingContext'
import Footer from '../Home/Footer';


export const opts = {
    preflightCommitment: "processed"
}

const Landing = () => {
    const {setloading}=useContext(LoadingContext)

    const [walletAddress, setWalletAddress] = useState<HTMLInputElement | void | string>('')
    const [usrRole, setUsrRole] = useState<HTMLInputElement | void | string>('')

    // if (walletAddress == "" || walletAddress == null) {
    //     async function getWalletAddress() {
    //     // create the provider and return it to the caller 
    //     const connection = new Connection(network, opts.preflightCommitment);
    //     const provider = new AnchorProvider(
    //         connection, wallet, opts.preflightCommitment,
    //     );
    //     return await provider.wallet.publicKey;
    //     }
    //     const publicKey = getWalletAddress();
    //     publicKey.then(value => {
    //     setWalletAddress(value);
    //     console.log(walletAddress)
    //     })
    // }
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
                    setUsrRole(JSON.parse(res.request.response).response[0].user_role);
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    const [selectedSource, setSelectedSource] = useState('')
    const [selectedDestination, setSelectedDestination] = useState('')
    const [selectedTimestamp, setSelectedTimestamp] = useState('')
    const [data, setData] = useState([])
    const [globalData, setGlobalData] = useState([])
    const [daterange, setDaterange] = useState("")
    const [showFilter, setShowFilter] = useState("")



    const getRecords = async () => {
        setloading(true);
        console.log(usrRole);

        if (usrRole == "Carrier") {
            var query_string = ""

            // conditions to frame a query string based on the filters
            if (selectedSource != null && selectedSource != "" && selectedDestination != null && selectedDestination != "" && selectedTimestamp == null && selectedTimestamp == "") {
                query_string = "?BROKER_LOAD_ORIGIN=" + selectedSource + "&BROKER_LOAD_DESTINATION=" + selectedDestination
            } else if (selectedSource != null && selectedSource != "" && selectedDestination == null && selectedDestination == "" && selectedTimestamp == null && selectedTimestamp == "") {
                query_string = "?BROKER_LOAD_ORIGIN=" + selectedSource + "&BROKER_LOAD_DESTINATION=" + selectedDestination
            }

            query_string = "?BROKER_LOAD_ORIGIN=" + selectedSource + "&BROKER_LOAD_DESTINATION=" + selectedDestination

            console.log("query_string-->", Constants.api_gateway_host + '/broker_load/' + query_string);

            const res = await fetch(Constants.api_gateway_host + '/broker_load/' + query_string)
            const data = await res.json()
            setData(data.response)
            setGlobalData(data.response)

        } else if (usrRole == "Broker") {
            var query_string = ""

            if (selectedSource != null && selectedSource != "" && selectedDestination != null && selectedDestination != "" && selectedTimestamp == null && selectedTimestamp == "") {
                query_string = "?CARRIER_MOT_ORIGIN=" + selectedSource + "&CARRIER_MOT_DESTINATION=" + selectedDestination
            } else if (selectedSource != null && selectedSource != "" && selectedDestination == null && selectedDestination == "" && selectedTimestamp == null && selectedTimestamp == "") {
                query_string = "?CARRIER_MOT_ORIGIN=" + selectedSource + "&CARRIER_MOT_DESTINATION=" + selectedDestination
            }

            query_string = "?CARRIER_MOT_ORIGIN=" + selectedSource + "&CARRIER_MOT_DESTINATION=" + selectedDestination

            console.log("query_string-->", Constants.api_gateway_host + '/carrier_mot/' + query_string);

            const res = await fetch(Constants.api_gateway_host + '/carrier_mot/' + query_string)
            const data = await res.json()
            setData(data.response)
            setGlobalData(data.response)
        }
        //for Owner role

        if (usrRole == "Owner") {
            var query_string = ""

            // conditions to frame a query string based on the filters
            if (selectedSource != null && selectedSource != "" && selectedDestination != null && selectedDestination != "" && selectedTimestamp == null && selectedTimestamp == "") {
                query_string = "?OWNER_ADDRESS=" + selectedSource + "&OWNER_ENTITY_NAME=" + selectedDestination
            } else if (selectedSource != null && selectedSource != "" && selectedDestination == null && selectedDestination == "" && selectedTimestamp == null && selectedTimestamp == "") {
                query_string = "?OWNER_ADDRESS=" + selectedSource
            }

            console.log("query_string-->", Constants.api_gateway_host + '/owner_details/' + query_string);

            const res = await fetch(Constants.api_gateway_host + '/owner_details/' + query_string)
            const data = await res.json()
            setData(data.response)
            setGlobalData(data.response)
        } 
        setloading(false);   
    }
    const onSearch = (source: string) => {
        const filterd = globalData.filter((f) => {
            return f.broker_load_origin === source
        })
        console.log("filterd from home", filterd, source)
        setShowFilter(false)
        setData(filterd)
        getRecords();
    }

    console.log(" my data", data)

    // Changing the time of human and machine 
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

    const [searchAddress, setSearchAddress] = useState("");

    const handlesearch = () => {
        const temp = globalData.filter((f) => {
            return f.carrier_mot_pickup_date === selectedSource

        });
        console.log("Data for is", temp, selectedSource, globalData)
        setData(temp)
    }


   const [showmap,setshowmap]=useState(false);
   const [buttoncontent,setbuttoncontent]=useState("SEARCH USING MAPS");
   const handlemapbutton=()=>{
    console.log("handle maps");
    setshowmap(!showmap);
    if(buttoncontent==="SEARCH USING MAPS")
    {setbuttoncontent("CLOSE MAPS");}
    if(buttoncontent==="CLOSE MAPS")
    {setbuttoncontent("SEARCH USING MAPS");}
   }

   
    return (
        <>

            <React.Fragment>
                {/* <section className="categoryarea black-bg pt-80 pb-80"
                    style={{ backgroundSize: 'cover', backgroundPosition: 'center', }}>
                    <div className="row">
                        <div className="sectiontitle-wrapper text-center mb-5">
                            <p style={{ color: "Grey" }}>click airdrop to fund your dev account</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <RequestAirdrop />
                        </div>
                    </div>
                </section> */}


                <Container fluid={true}>
                    
                <Row className="justify-content-center align-self-center m-5">
                            <Col lg="7" md="7" sm="10" xl="6" >
                                <div style={{ borderRadius: '10px',border:'4px solid #A85DF4' }}>
                                <Card >
                                <CardBody style={{backgroundColor:'#CA76F4'}}>
                                        <h4 className=" text-center card-title " style={{ fontWeight: 'semi-bold' }}>BOARD EXPLORER </h4>
                                        <p className="card-title-desc"></p>
                                        <FormGroup className="mb-4 ms-2">
                                     
                                            <SearchBoards/>
                                            <div className="p-3">
                                            <Row className="justify-content-center">
                                                <p className="text-center">OR</p>  
                                            </Row>
                                            <Row className="justify-content-center">
                                              <Button
                                               type="button"
                                               className="m-btn m-btn-4 w-60 m-2"
                                               style={{ backgroundColor: "#4A2FBE"}}
                                               onClick={handlemapbutton}
                                               >
                                              {buttoncontent}
                                              </Button>
                                            </Row>
                                            </div>
                                            {showmap &&
                                            <div className=" p-3 mb-4 ">
                                                
                                                  {/* <Row>
                                             <AddressSuggestionsSource
                                              onSourceAddressChange={setSourceAddress}/>
                                             {console.log("sourceAddress--->",sourceAddress)}
                                                  </Row> */}
                                                  
                                                  <Client/>
                                            </div>
                                           }
                                        </FormGroup>
{/* 
                                        <Button
                                            color="dark"
                                            className="btn btn-dark w-100"
                                            onClick={() => onSearch(handlesearch)}
                                        >
                                            Search
                                        </Button> */}
                                    </CardBody>
                                </Card>
                                </div>
                            </Col>
                        </Row>
                    


                    {usrRole == "Broker" && (
                        <>
                            <Container fluid={true} className="black-bg">
                                <br></br>
                                <Row>
                                    {data.map((f, i) => {
                                        return <RecordCardCarrier key={f} ID={f.carrier_id} DeliveryDate={f.carrier_mot_delivery_date} MotID={f.carrier_mot_id} distance={f.carrier_mot_total_distance} type={f.carrier_mot_equipment_type} destination={f.carrier_mot_destination
                                        } origin={f.carrier_mot_origin} Date={f.carrier_mot_pickup_date} Timestamp={f.carrier_mot_created_timestamp} />
                                    })}
                                </Row>
                                <Row>
                                    <Col xs="12">
                                    </Col>
                                </Row>
                            </Container>
                        </>
                    )}

                    {usrRole == "Carrier" && (
                        <>
                            <Container fluid={true} className="black-bg">
                                <br></br>
                                <Row>
                                    {data.map((e, i) => {
                                        return <RecordCardBroker key={e} IDName={e.broker_id} pickupdates={e.broker_load_pickup_date} origin={e.broker_load_origin} IDLoad={e.broker_load_id} Timestamps={e.broker_load_created_timestamp} delivery={e.broker_load_delivery_date} load={e.broker_load_equipment_type} weight={e.broker_load_weight}
                                            destinations={e.broker_load_destination} commodity={e.broker_load_commodity} Distances={e.broker_load_distance} rates={e.broker_load_rate} addition={e.broker_load_additional_requirements} />

                                    })}
                                </Row>
                                <Row>
                                    <Col xs="12">
                                    </Col>
                                </Row>
                            </Container>
                        </>
                    )}
                    
                </Container>
                
            </React.Fragment>
        </>
    );
}

export default Landing;


// import React, { useEffect, useState } from "react";
// import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";
// import HomePage from "../HomePage/HomePage"; 
// const Landing=()=>{

//     return(
//     <>
//      <HomePage/>
//     </>
//     );
// }
// export default Landing;