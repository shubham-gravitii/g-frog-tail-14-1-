//@ts-nocheck
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Button } from 'react-bootstrap';
import Overlays from '../../../Overlays'
import {
  Card, CardBody, Col, Container, FormGroup, Input,
  InputGroup, Label,
  Row, Modal,
  ModalHeader,
  ModalBody, Accordion, AccordionBody, AccordionHeader,
  AccordionItem,
} from "reactstrap";
import axios from "axios";
import * as Constants from '../../utils/constants'
import { AiOutlineSearch } from 'react-icons/ai'


const Mapplsmap = dynamic(() => import('./map'), { ssr: false });
const Client = ({locationText,setlocationText}) => {
  
  const [searchText, setsearchText] = useState('');
  const [map, setMap] = React.useState(null);
  const [Lat, setLat] = React.useState(28.644800);
  const [Long, setLong] = React.useState(77.216721);
  const [whGpsCoordinates, setWhGpsCoordinates] = React.useState("28.644800,77.216721");
  const [confirm, setconfirm] = React.useState(false);
  const [confirmNo, setconfirmNo] = useState(false);
  const [apikey, setapikey] = useState("99deaecc5f0c49879f851cbded59ff69");
  const [MapplsapiKey, setMapplsapiKey] = useState("");
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
    console.log("COnsoling name  ------------------->")
    console.log(name)
    setlocationText(name)
    if (name === ""){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setLat(latitude);
            setLong(longitude);
            setconfirm(true);
          },
          error => console.error('Error getting location:', error.message)
        );
      } else {
        console.error('Geolocation is not supported by your browser.');
      }
    }
    else{
      setsearchText(name);
      setconfirmNo(false);
      setshowsuggest(false);
      fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      .then(response => response.json())
      .then(data => {
        console.log("logging----->")
        console.log(data)
        setLat(data.lat);
        setLong(data.lng);
        console.log("logging----->")
        setconfirm(true);
        // Assuming setWhGpsCoordinates and setconfirm are handled elsewhere or adjusted accordingly
      })
      .catch(error => console.error('Error:', error));
    }
    
  };

  

  const handleAdressChange = async (e: any) => {
    const query = e.target.value;
    setlocationText(e.target.value);
    setshowsuggest(true);
    setconfirmNo(false);
    setsearchText(e.target.value);
    setNames(prevNames => prevNames.splice(0, prevNames.length));
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
      setshowsuggest(false);
    }
  }

  const handleChildData=(data)=>{
    setconfirm(data);
    setconfirmNo(!data);
  }


  return (<>
    <div>
      <div className="row">
        <div className="col-10">
           <Input type="text" value={searchText} onChange={handleAdressChange} name="search" id="search"  /> 
        </div>
        <div className="col-1"> <Button className="btn btn-primary btn-l" onClick={() => handleSearchText(searchText)}><AiOutlineSearch /></Button></div>
      </div>
     
        {showsuggest &&
          <ul className="list-group mt-2" > 
               {names.map((result) => (
              <li className='list-group-item p-3 mb-2 d-block' style={{backgroundColor: "#f0f0f0", cursor:"pointer"}} onClick={() => {
                const name = result.placeName + " " + result.placeAddress;
                handleSearchText(name)
              }}
                key={result.eLoc}>
                {result.placeName},{result.placeAddress}
              </li>
            ))}
          </ul>
        }
        {confirm &&  ( 
          <> 
              <div  className="mt-2" style={{ width: "100%" }}> 
                <Mapplsmap Lattitude={Lat} Longitude={Long} Address={searchText} onChildData={handleChildData} />
              </div>
          
          </>)
        }
        {confirmNo &&  <p style={{ color: 'green' }}>Address added successfully</p>}
      </div>
  </> );
};

export default Client;
