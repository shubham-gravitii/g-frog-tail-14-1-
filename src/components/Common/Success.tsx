// @ts-nocheck 
import React, { useEffect, useState } from "react";
import axios from 'axios';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Alert, Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row, Modal, ModalHeader, ModalBody } from "reactstrap"
import "@vtaits/react-color-picker/dist/index.css"
import "react-datepicker/dist/react-datepicker.css"
import "flatpickr/dist/themes/material_blue.css"

const Success = () => {

    return (
        <>
            <Container fluid={true}>
                <Card>
                    <CardBody>
                        <Row>
                            <div className="text-center mb-10">
                                Success!
                            </div>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </>

    );
}
export default Success;