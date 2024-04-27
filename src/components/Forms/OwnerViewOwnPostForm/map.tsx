//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Logo from "../../assets/images/map-marker-svgrepo-com.svg";
import LocationMarker from '../../LocationMarker';
import { Button } from 'reactstrap';
import { useRouter } from 'next/router';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';


const Mapplsmap = ({ Lattitude, Longitude ,onChildData, handleGeocoordinates,gps}) => {
  const router = useRouter();
  const [center, setcenter] = useState({ lat: parseFloat(Lattitude), lng: parseFloat(Longitude) });
  const [userCenter,setUserCenter]=useState(gps);
  const [Lat, setLat] = useState("");
  const [Long, setLong] = useState("");
  const [add, setadd] = useState("");
  const [confirmNo, setconfirmNo] = useState(false);
  const zoom_level = 17;
  const mapRef = useRef();
 
  //To show icon that is being displayed on the map
  const MarkerIcon = new L.Icon({
    iconUrl:"https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
    shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  useEffect(() => {
    // console.log("Lattitude:", Lattitude);
    // console.log("Longitude:", Longitude);
    // console.log("Center:", center);
    setLat(Lattitude);
    setLong(Longitude);
    setcenter({ lat: parseFloat(Lattitude), lng: parseFloat(Longitude) });
  }, [Lattitude, Longitude]);
  

  useEffect(() => {
    setadd();
  }, [add])


 //custom functional component to be used in the map
 const UpdateCenter = ({ center }) => {
  const map = useMap();
  map.setView([center.lat, center.lng], 5);
  return (
    <Marker position={center} icon={MarkerIcon}>
      <Popup>{`${center.lat},${center.lng} marked to save`}</Popup>
    </Marker>
  );
};

//to mark already located
const LocationMarker = ({ center }) => {
  const map=useMap();
  map.setView([center.lat, center.lng],5);
  return (
    <Marker position={center} icon={greenIcon}>
      <Popup>{`${center.lat},${center.lng} location already saved by user`}</Popup>
    </Marker>
  );
};

  const MapClickEvent = () => {
    const map = useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setcenter({lat:event.latlng.lat.toFixed(6),lng:event.latlng.lng.toFixed(6)});
        setLat(event.latlng.lat.toFixed(6));
        setLong(event.latlng.lng.toFixed(6));
        map.setView([lat, lng]);
      } })
  }

    //general function 
    const handleConfirm = async () => {
      setconfirmNo(true);
      console.log(Lat);
      console.log(Long);
      onChildData(confirmNo); //send the data of confirmation to the client.tsx
      console.log("Helllo");
      handleGeocoordinates(Lat, Long);
    }

  return (
    <>
        <div className='row p-1'>
        {!confirmNo && <>
           <div className='col-lg-6'> <p>Do you confirm Your Location?</p> </div>
           <div className='col-lg-1' > <Button  style={{ background: 'green' }} onClick={()=>handleConfirm()}>Confirm</Button> </div>
           </>}
        </div>
        <p>The recorded coordinates are {center.lat},{center.lng} </p>
        <MapContainer center={center} zoom={zoom_level} maxZoom={25} scrollWheelZoom={true} style={{ height: "100%", width: "100%" ,zIndex:"0",borderRadius:"10px"}} ref={mapRef}>
          <UpdateCenter center={center} />
          <LocationMarker center={userCenter}/>
          <MapClickEvent />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.mapmyindia.com/">MapmyIndia</a>'
          />
        </MapContainer>
    </>
  );
};

export default Mapplsmap;







 //reverse geocoding the address and getting the coordinates
//   const revgeocoding = async () => {
//     try {
//       const revgeocodeurl = `https://bridge.gravitii.in/api22/advancedmaps/v1/${apiKey}/rev_geocode?lat=${Lat}&lng=${Long}`;
//       await fetch(revgeocodeurl, {
//         method: 'GET',
//       })
//         .then(response => response.json())
//         .then(data => {
//           setadd(data.results[0].formatted_address);
//           console.log("here it is reverse geocoding");
//           console.log(data.results[0]);
//         })
//     }
//     catch (err) { console.log(err); }
//   }