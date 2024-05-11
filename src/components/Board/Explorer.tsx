// @ts-nocheck
import React, { useEffect,useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap"
import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
import Select from "react-select"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import RecordCard from "./RecordCardCarrier";
import { RequestAirdrop } from "../Airdrop/RequestAirdrop";

import { ReactReduxContext } from 'react-redux'


const Board = ({onSearch}) => { 

    const { store } = useContext(ReactReduxContext)
      
    const [selectedSource, setSelectedSource] = useState('')
    const [selectedDestination, setSelectedDestination] = useState('')
    const [selectedTimestamp , setSelectedTimestamp] = useState('')
    const [data , setData] = useState([])
    const [globalData , setGlobalData] = useState([])
    const [daterange , setDaterange] = useState("")

    

    const getRecords = async()=>{
        const res =   await fetch('https://g-badger.herokuapp.com/carrier_mot/')
        const data =  await res.json()
        setData(data.response)
        setGlobalData(data.response)
    
        console.log("store is --->")
        console.log(store);
      }
        useEffect(()=>{
        getRecords()
        // eslint-disable-next-line react-hooks/exhaustive-deps
     },[])


    // Changing the time of human and machine 
    function Unix_timestamp(t)
    {
    var dt = new Date(t*1000);
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();
    return hr+ ':' + m.substr(-2) + ':' + s.substr(-2);  
    }
    console.log("the change time is ", Unix_timestamp(1663729083));
    console.log("store is--->")
    console.log(store);
    const dateStr = '2022-06-22';   
    const date = new Date(dateStr);
    console.log(date); 
    
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

    // get this list from the API call later
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
    const handlesearch = ()=>{
        const temp = globalData.filter((f)=>{
            return f.carrier_mot_pickup_date === selectedSource 

        });
        console.log("Data for is" , temp , selectedSource , globalData)
        setData(temp)
    }
    // @ts-nocheck  
    return (
        <>
            <React.Fragment>

            <section className="categoryarea black-bg pt-80 pb-80"
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
            </section>
                <Container fluid={true} className="header__area black-bg">
                    <form>
                        <Row className="justify-content-center align-self-center">
                            <Col lg="4">
                            <Card>
                                    
                                    <CardBody>
                                    
                                        <h4 className="card-title"> Board Explorer for Carrier</h4>
                                        <p className="card-title-desc"></p>
                                        <FormGroup className="mb-4">
                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>Date Range</Label>

                                                </p>
                                                <InputGroup>
                                                
                                                    <Flatpickr

                                                        className="form-control d-block"
                                                        placeholder="choose your dates"
                                                        onChange={(selectedDates, dateStr, Unix_timestamp) => {
                                                            const firstDate = selectedDates;
                                                            setDaterange(firstDate)
                                                            console.log("date iss" ,{ firstDate, dateStr,Unix_timestamp});
                                                
                                                            }}
                                                        options={{
                                                            mode: "range",
                                                            dateFormat: "Y-m-d"
                                                        }}
                                                        
                                                    />
                                                   
                                                    {selectedTimestamp}

                                                    
                                                    
                                                </InputGroup>
                                                
                                            
                                            </div>
                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>Source</Label>
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
                                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                        setSelectedDestination(event['value']);
                                                    }}
                                                    options={optionTargetGroup}
                                                    classNamePrefix="select3-selection"
                                                />
                                            </div>
                                        </FormGroup>

                                        <Button
                                            color="dark"
                                            className="btn btn-dark w-100" 
                                            onClick={()=> onSearch(handlesearch)}
                                        >
                                            Search
                                        </Button>
                                        
                                    </CardBody>

                                </Card>

                            </Col>
                        </Row>
                    </form>
                    <Row>
                    {/* {data.map((f,i)=>{
              return  <RecordCards distance={f.carrier_mot_total_distance}type={f.carrier_mot_equipment_type} destination={f.carrier_mot_destination
              } origin={f.carrier_mot_origin
              } />
            })} */}
                 {/* {data.map((e,i)=>{
              return  <RecordCard typename={e.broker_load_distance}type={e.broker_load_equipment_type} destination={e.broker_load_destination
              } origin={e.broker_load_origin} />
            })} */}
                    </Row>
                </Container>
            </React.Fragment>
        </>
    );
}

export default Board;
