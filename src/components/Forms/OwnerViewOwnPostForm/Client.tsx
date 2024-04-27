//@ts-nocheck
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import {
  Card, CardBody, Col, Container, FormGroup, Input, InputGroup, Label, Row, Modal, ModalHeader, ModalBody, Accordion, AccordionBody, AccordionHeader,
  AccordionItem,
} from "reactstrap";

import axios from "axios";
import * as Constants from '../../../../utils/constants'
import MapComponent from '../../CityMap';
import { AiOutlineSearch } from 'react-icons/ai'
import Overlays from '../../../components/Overlays'

const Mapplsmap = dynamic(() => import('./map'), { ssr: false });

const Client = ({ handleGeocoordinates,GPS}) => {
  const [searchText, setsearchText] = useState('');
  const [Lat, setLat] = React.useState("28.644800");
  const [Long, setLong] = React.useState("77.216721");
  const [confirm, setconfirm] = React.useState(false);
  const [confirmNo, setconfirmNo] = useState(false);
  const [names, setNames] = useState([]);
  const [showsuggest, setshowsuggest] = useState(false);
  const [gps,setGps]=useState({});
  console.table(GPS);
  useEffect(() => {
    const coord=GPS.split(" ");
    console.log(coord);
    setGps({lat:parseFloat(coord[1]),lng:parseFloat(coord[0])});
  },[GPS])
  
  const handleSearchText = async (name) => {
    setconfirmNo(false);
    setshowsuggest(false);
    setsearchText(name);
    fetch('/api/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    .then(response => response.json())
    .then(data => {
      setLat(data.lat);
      setLong(data.lng);
      setconfirm(true);
      // Assuming setWhGpsCoordinates and setconfirm are handled elsewhere or adjusted accordingly
    })
    .catch(error => console.error('Error:', error));
  };


  const handleAdressChange = async (e: any) => {
    const query = e.target.value;
    console.log(query)
    setsearchText(e.target.value);
    setshowsuggest(true);
    setconfirmNo(false);
    setNames(prevNames => prevNames.splice(0, prevNames.length))
    if (query.length>2) {
      try {
        // Secure server-side call to fetch suggestions
        const response = await axios.post('/api/addressSearch', { query });
        setNames(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNames([]);
      }
    } else {
      setNames([]);
    }
  }


  const handleChildData = (data) => {
    setconfirm(data);
    setconfirmNo(!data);
  }
  return (<>
   
        <Row>
              <Col xs={9} lg={10}>
                <Input type="text"
                  value={searchText}
                  onChange={handleAdressChange}
                  name="search"
                  id="search"
                  placeholder='Warehouse location'
                />
              </Col>
              <Col>
                <Button className="btn btn-primary btn-l" onClick={() => handleSearchText(searchText)}><AiOutlineSearch /></Button>
              </Col>
        </Row>
        {showsuggest &&
          <ul >
            {names.map((result) => (
              <li className='p-1 mb-2 d-block' onClick={() => {const name = result.placeName + " " + result.placeAddress; handleSearchText(name)}}
                key={result.eLoc}>
                {result.placeName},{result.placeAddress}
              </li>
            ))}
          </ul>
        }
        {confirm && (
          <>
            <div className='mb-5 mb-sm-5'>
              <div className='mb-5 pb-4' style={{ height: "50vh", width: "100%" }}>
                <Mapplsmap Lattitude={Lat} Longitude={Long} Address={searchText} onChildData={handleChildData} handleGeocoordinates={handleGeocoordinates}  gps={gps}/>
              </div>
            </div>
          </>)
        }
        {confirmNo && <p style={{ color: 'green' }}>Address added successfully</p>}
      
  </>
  );
};

export default Client;
