// @ts-nocheck
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
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
} from "reactstrap";
import "leaflet/dist/leaflet.css";
import { apiKey } from "airtable";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";

const Mapplsmap = dynamic(() => import("./mapplsmap"), { ssr: false });
const Client = () => {
  // const responsearray=[];
  // const markersarray=[];
  const [names, setNames] = useState([]);
  const [apiKey, setapiKey] = useState("");
  const [tokenType, settokenType] = useState("");
  const [addressSearch, setaddressSearch] = useState("");
  const [Lat, setLat] = useState(28.644800);
  const [Long, setLong] = useState(77.216721);
  const [showlist, setshowlist] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLong(longitude);
        },
        error => console.error('Error getting location:', error.message)
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
  }, []);

  //function to convert geocoordinates like 29'34''56  to  29.3456 for further operations
  const changetolat = (cord) => {
    const parts = cord.split(/\D+/);
    if (parts.length >= 4) {
      const degrees = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseFloat(parts[2]);
      const direction = parts[3].toUpperCase();
      const decimal = degrees + minutes / 60 + seconds / 3600;

      if (direction === "S" || direction === "W") {
        return -decimal.toFixed(6);
      } else {
        return decimal.toFixed(6);
      }
    }
  };

  //function to handle the search of any particular location by converting it to lattitude and longitude
  const handleMap = (name) => {
    setshowlist(false);
    // Assuming '/api/geocode' endpoint is correctly set up as previously discussed
    fetch('/api/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    .then(response => response.json())
    .then(data => {
      setLat(data.lat);
      setLong(data.lng);
      // Assuming setWhGpsCoordinates and setconfirm are handled elsewhere or adjusted accordingly
    })
    .catch(error => console.error('Error:', error));
  };


  const handleAddressSearch = async (e: any) => {
    const query = e.target.value;
    setaddressSearch(query);
    setshowlist(true);

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
  };


  return (
    <>
      <div className="p-1 w-100 ">
        <div className="row justify-content-end">
          <div className="col-lg-10 col-md-10 col-sm-8 ">
            <input
              type="text"
              value={addressSearch}
              className="form-control d-block p-1 mb-2 w-90 select2-container "
              placeholder="Search for Address"
              onChange={handleAddressSearch}
            />
          </div>
          <div className="col-lg-2 col-md-2 col-sm-4">
            <Button
              onClick={() => handleMap(addressSearch)}
              style={{ backgroundColor: "#2196F3" }}
            >
              <AiOutlineSearch />
            </Button>
          </div>
        </div>


        {/* <Button color="dark" className="btn btn-dark w-20" onClick={handleSearch}>Show</Button> */}
        {showlist && (
          <div className="row">
            <ul className="col-lg-11 col-md-10 col-sm-8">
              {names.map((result) => (
                <li
                  className=" d-block p-1 mb-2 w-90 "
                  onClick={() => {
                    setshowlist(false);
                    const name = result.placeName + " " + result.placeAddress;
                    setaddressSearch(name);
                    handleMap(name);
                  }}
                  key={result.eLoc}
                >
                  {result.placeName},{result.placeAddress}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ height: "60vh", width: "100%" }} className="p-4 me-4">
        <Mapplsmap Lattitude={Lat} Longitude={Long}/>
      </div>
    </>
  );
};

export default Client;
