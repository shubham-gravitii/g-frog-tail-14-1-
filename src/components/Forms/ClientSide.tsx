//@ts-nocheck
import { MapContainer, TileLayer, useMap, useMapEvents ,Marker,Popup} from 'react-leaflet';
import React,{useState} from 'react';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as Constants from '../../utils/constants'
import axios from 'axios';
const ClientSideMap = ({ Lattitude, Longitude, setCoordinates,warehouseId,ownerId }) => {
  const [coordinates,setcoordinates]=useState("");
  const [center,setcenter]=useState({lat:parseInt(Lattitude) ,lng:parseInt(Longitude)});
  const [Lat,setLat]=useState("");
  const [Long,setLong]=useState("");
  const [show,setshow]=useState(false);
  const [apiKey, setapiKey] = useState("");
  const [tokenType, settokenType] = useState("");
  const [geocoordinates,setgeocoordinates]=useState("");
  const [add,setadd]=useState("");
  const zoom_level=17;
  
  const MarkerIcon=L.icon({
    iconUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_tYFQFPiPxkEzKMhnNiBw9a5KZ5eRXPqqTe8DS-sHDQ&s',
    iconSize:[35,45],
  });
  

  const tokenapiurl='https://outpost.mappls.com/api/security/oauth/token';
  fetch(tokenapiurl, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
      "grant_type":"client_credentials",
      "client_id":"33OkryzDZsLmY5Qq1v7O-VS3J7sWiORkeP3kaayXZrVnTyHNGA7w_jqsPp1F_VvUh9DG9Wdev5-rcD1UK9TGh88Y-huop64c",
      "client_secret":"lrFxI-iSEg-9Ubd2NOJc07oiLhJzWUvCjb6pb0WX369MwdvHxkw4_VX67g2sfjQuKVjekxzAyzG77tizX5ZcPgw4HqY4iVeo98lzUnA1Pls="
    }),
  })
  .then(res => res.json())
  .then(data => {
    setapiKey(data.access_token);
    settokenType(data.token_type);
  })
  .catch(error => {
    console.error('Error:', error);
  });

 const handleYes=async ()=>{
  console.log(warehouseId );
  console.log(ownerId );
  await fetch(Constants.api_gateway_host + '/wh_geo_coordinates/?WH_ID='+ warehouseId +'&GEOCORDINATES='+geocoordinates+'&OWNER_ENTITY_ID='+ownerId+'&IS_ACTIVE='+'true'+'&IS_VERIFIED='+'true', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
     .then((response) => response.json())
     .then((data) => {
        console.log(data);
     })
     .catch((err) => {
        console.log(err.message);
     });
     setshow(false);
 }

//  const findaddress=async ()=>{
//   try {
//     const response = await axios.get(
//       ` https://bridge.gravitii.in/api12/advancedmaps/v1/${apiKey}/rev_geocode?lat=${parseFloat(Lat)}&lng=${parseFloat(Long)}`,
//       {  
//         headers: {
//           'Authorization':`Bearer ${apiKey}`,
//           'Accept': '*',
//         },
//       }
//     );
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
//  }

  const MapClickEvent = () => {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setcenter(event.latlng);
        setLat(event.latlng.lat.toFixed(6));
        setLong(event.latlng.lng.toFixed(6));
        setgeocoordinates(`${Lat},${Long}`);
        console.log(geocoordinates);
        setshow(true);
        setcoordinates(`lat: ${lat.toFixed(6)},lng: ${lng.toFixed(6)}`);
        setPosition(event.latlng);
        // findaddress();
        map.setView([lat, lng]);

      }
    });
  }
  return (<>
    <p>The recorded Lattitude is  {Lat}  </p>
    <p>The recorded Longitude is  {Long} </p>
    <p>The address you pointed is {add} </p>
    {show && (<>
      <p>Do you confirm your location?<Button onClick={handleYes}>Yes</Button></p>
      </>
    )}
    <MapContainer center={center} zoom={zoom_level} maxZoom={25} style={{ height: "80vh", width: "100%" }}> 
      <MapClickEvent  />
      <TileLayer
        url="https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=bMP2o7lkp4TELOawJGjmB9CtkgnyIo3x"
        attribution='Map data &copy; <a href="https://www.tomtom.com/">TomTom</a> contributors'
      />
      </MapContainer>
    </>
  );
};

export default ClientSideMap;
