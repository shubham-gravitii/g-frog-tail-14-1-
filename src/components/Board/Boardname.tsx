// @ts-nocheck

import React, { useEffect, useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap"
import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
import RecordList from '../../components/Board/RecordList';
import Select from "react-select"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import RecordCards from "./RecordCardCarrier";
const Boardname = () => {
    const [selectedSource, setSelectedSource] = useState('')
    const [EquipmentType, setEquipmentType] = useState('')
    const [selectedDestination, setSelectedDestination] = useState('')
    const [data , setData] = useState([])
    // const [datas, setDatas] = useState([])
    const [globalData , setGlobalData] = useState([])       

    const getRecords = async()=>{

        const res =   await fetch('https://g-badger.herokuapp.com/carrier_mot/')
        const data =  await res.json()
        setData(data.response)
        setGlobalData(data.response)
        
    
    
      }
    // const getRecordss = async()=>{

    //     const res =   await fetch('https://g-badger.herokuapp.com/broker_load/')
    //     const datas =  await res.json()
    //     // setDatas(datas.response)
    //     setGlobalData(datas.response)
    
    
    //   }
     
    
      useEffect(()=>{
         getRecords()
        //getRecordss()
      },[])

    // get this list from the API call later
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
    // console.log("data is" , data)
    // console.log("datas is", datas)

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
    const EquipmentGroupname = [
        {
            label: "Types",
            options: [
                { label: "RGNTrailer", value: "RGNTrailer" },
                { label: "RefrigeratedTrailers", value: "RefrigeratedTrailers" },
                { label: "Dryvan", value: "Dryvan" },
                { label: "BoxTruck", value: "BoxTruck" },
                {label: "FlatbedTrailer", value: "FlatbedTrailer"},
                {label: "LowboyTrailer", value: "LowboyTrailer"}
            ]
        }
    ]

    const handleSearch = ()=>{
        const temp = globalData.filter((f)=>{
            return f.carrier_mot_origin === selectedSource || f.carrier_mot_destination === selectedDestination || f.carrier_mot_equipment_type === EquipmentType

        });
        // const temp1 = globalData.filter((f) =>{
        //     return f.broker_load_origin === selectedSource



        // });
        //
       
        console.log("Data is showing" , temp , selectedSource , globalData, selectedDestination, EquipmentType) 
        setData(temp)

    }
    // @ts-nocheck
    return (
        <>
            <React.Fragment>

                <Container style={{minHeight:"100vh"}} fluid={true} className="header__area black-bg">
                    <form>
                        <Row className="justify-content-center align-self-center">
                            <Col lg="4">
                                <Card>
                                    
                                    <CardBody>
                                    
                                        <h4 className="card-title"> Board Explorer</h4>
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
                                                            console.log("date iss" ,{ firstDate, dateStr,Unix_timestamp});
                                                
                                                            }}
                                                        options={{
                                                            mode: "range",
                                                            dateFormat: "Y-m-d"
                                                        }}
                                                    />
                                                </InputGroup>
                                            </div>
                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>Source</Label>
                                                </p>
                                                <Select
                                                    onChange={(event : React.ChangeEvent<HTMLSelectElement>) => {
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
                                            <div className="mt-3">
                                                <p className="mb-3 select2-container">
                                                    <Label>Equipment Type</Label>
                                                </p>
                                                <Select
                                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                        setEquipmentType(event['value']);
                                                    }}
                                                    options={EquipmentGroupname}
                                                    classNamePrefix="select2-selection"
                                                />
                                            </div>
                                        </FormGroup>

                                        <Button
                                            color="dark"
                                            className="btn btn-dark w-100" 
                                            onClick={()=> handleSearch()}
                                        >
                                            Search
                                        </Button>
                                        
                                    </CardBody>

                                </Card>

                            </Col>
                        </Row>
                    </form>
                    <Container fluid={true} className="black-bg">
        <br></br>
          <Row>
            {data.map((f,i)=>{
              return  <RecordCards key={f} ID={f.carrier_id} DeliveryDate={f.carrier_mot_delivery_date} MotID={f.carrier_mot_id} distance={f.carrier_mot_total_distance}type={f.carrier_mot_equipment_type} destination={f.carrier_mot_destination
              } origin={f.carrier_mot_origin} Date={f.carrier_mot_pickup_date} Timestamp={f.carrier_mot_created_timestamp}/>
              
            })}
          </Row>
          <Row>
            <Col xs="12">
            </Col>
          </Row>
        </Container>
                </Container>
            </React.Fragment>
        </>
    );
}

export default Boardname;