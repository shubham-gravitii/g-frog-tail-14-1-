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
import Overlays from '../../../Overlays'

const Mapplsmap = dynamic(() => import('./MapOwnerForm'), { ssr: false });
const Client = ({ warehouseId, ownerId,locationText,setlocationText }) => {
  const [searchText, setsearchText] = useState('');
  const [map, setMap] = React.useState(null);
  const [Lat, setLat] = React.useState("28.644800");
  const [Long, setLong] = React.useState("77.216721");
  const [whGpsCoordinates, setWhGpsCoordinates] = React.useState("28.644800,77.216721");
  const [confirm, setconfirm] = React.useState(false);
  const [confirmNo, setconfirmNo] = useState(false);
  const [apikey, setapikey] = useState("99deaecc5f0c49879f851cbded59ff69");
  const [mapVisible, setMapVisible] = useState(false);
  const [apiKey, setapiKey] = useState("");
  const [tokenType, settokenType] = useState("");
  const [names, setNames] = useState([]);
  const [showsuggest, setshowsuggest] = useState(false);


  const changetolat = (cord) => {
    const parts = cord.split(/\D+/);
    if (parts.length >= 4) {
      const degrees = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseFloat(parts[2]);
      const direction = parts[3].toUpperCase();
      const decimal = degrees + (minutes / 60) + (seconds / 3600);

      if (direction === "S" || direction === "W") {
        return -decimal.toFixed(6);
      } else {
        return decimal.toFixed(6);
      }
    }
  }


  const handleSearchText = async (name) => {
    setlocationText(name)
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

  const handleNo = () => {
    setconfirm(false);
    setconfirmNo(true);
  }

  const handleAdressChange = async (e: any) => {
    const query = e.target.value;
    setshowsuggest(true);
    setconfirmNo(false);
    setsearchText(e.target.value);
    setlocationText(e.target.value);
    setNames(prevNames => prevNames.splice(0, prevNames.length))
    if (query.length) {
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
    <div className="mt-3 " >

      <div className="mt-3">
        <p className="mb-3 select2-container">
          <Label>Warehouse Location <Overlays message={"Please share your nearest city, to help us locate you"}/>
          </Label>
        </p>
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
              <li className='p-1 mb-2 d-block' onClick={() => {
                const name = result.placeName + " " + result.placeAddress;
                handleSearchText(name)
              }}
                key={result.eLoc}>
                {result.placeName},{result.placeAddress}
              </li>
            ))}
          </ul>
        }

        {confirm && (
          <>
              <div className=' ' style={{  width: "100%" }}>
                <Mapplsmap Lattitude={Lat} Longitude={Long} Address={searchText} onChildData={handleChildData} mapStyle={{ width: '100%' }}/>
              </div>
          </>)
        }
        {confirmNo && <p style={{ color: 'green' }}>Address added successfully</p>}
        
      </div>
    </div >

  </>
  );
};

export default Client;












{/* <p className="mb-3 select2-container">
      <Label>GPS Coordinates</Label>
    </p>
    <Input
      type="text"
      maxLength={50}
      defaultValue={whGpsCoordinates}
      value={whGpsCoordinates}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setWhGpsCoordinates(event.target.value);
      }}
      name="whGpsCoordinates"
      id="whGpsCoordinates"
    />
    <br></br> */}
{/* <button className="btn btn-secondary btn-lg" onClick={ToggleMapVisibility}>
      Use Map For Help
    </button> */}