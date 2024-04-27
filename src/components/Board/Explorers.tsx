// @ts-nocheck
import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap"
import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
import Select from "react-select"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"


const Boardname = ({onSearch}) => {
    const [selectedSource, setSelectedSource] = useState('')
    const [selectedDestination, setSelectedDestination] = useState('')

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
    // @ts-nocheck
    return (
        <>
            <React.Fragment>

                <Container fluid={true} className="header__area black-bg">
                    <form>
                        <Row className="justify-content-center align-self-center">
                            <Col lg="4">
                            <Card className="bg-dark text-white">
                                    
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
                                        </FormGroup>

                                        <Button
                                            color="dark"
                                            className="btn btn-dark w-100" 
                                            onClick={()=> onSearch(selectedSource)}
                                        >
                                            Search
                                        </Button>
                                        
                                    </CardBody>

                                </Card>

                            </Col>
                        </Row>
                    </form>
                </Container>
            </React.Fragment>
        </>
    );
}

export default Boardname;
