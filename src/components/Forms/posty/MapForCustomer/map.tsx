//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import { Button } from 'react-bootstrap';
import Logo from "../../assets/images/map-marker-svgrepo-com.svg";


const Mapplsmap = ({ Lattitude, Longitude, Address, onChildData }) => {
  const router = useRouter();
  const [center, setcenter] = useState({ lat: parseFloat(Lattitude), lng: parseFloat(Longitude) });
  const [location, setlocation] = useState(Address);
  const [Lat, setLat] = useState(Lattitude);
  const [Long, setLong] = useState(Longitude);
  const [show, setshow] = useState(true);
  const [apiKey, setapiKey] = useState("");
  const [tokenType, settokenType] = useState("");
  const [confirmNo, setconfirmNo] = useState(false);
  const zoom_level = 17;
  const mapRef = useRef();

  //To show icon that is being displayed on the map
  const MarkerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    console.log("Lattitude:", Lattitude);
    console.log("Longitude:", Longitude);
    console.log("Center:", center);
    setcenter({ lat: parseFloat(Lattitude), lng: parseFloat(Longitude) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Lattitude, Longitude]);

  //custom functional component to be used in the map
  const UpdateCenter = ({ center }) => {
    const map = useMap();
    map.setView([center.lat, center.lng], 13);
    return (
      <Marker position={center} icon={MarkerIcon}>
        <Popup>{`${center.lat},${center.lng}`}</Popup>
      </Marker>
    );
  };

  //custom functional component to get the geocoordinates from the map when we click on the map
  const MapClickEvent = () => {
    const map = useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setcenter({ lat: event.latlng.lat.toFixed(6), lng: event.latlng.lng.toFixed(6) });
        setLat(event.latlng.lat.toFixed(6));
        setLong(event.latlng.lng.toFixed(6));
        setshow(false);
        map.setView([lat, lng]);
      }
    })
  }

  //general function 
  const handleConfirm = async () => {
    setconfirmNo(true);
    onChildData(confirmNo); //send the data of confirmation to the client.tsx
    router.push({
      pathname: "/posty",
      query: { data: JSON.stringify(center) },
    });
  }

  return (
    <>
      <div className='row p-1'>
        {!confirmNo && <>
          <div className='col-lg-6'> <p>Do you confirm Your Location?</p> </div>
          <div className='col-lg-1' > <Button onClick={handleConfirm} style={{ background: 'green' }}>Confirm</Button> </div>
        </>}

      </div>
      <p >The recorded coordinates are {center.lat}, {center.lng}</p>
      <MapContainer center={center} zoom={zoom_level} maxZoom={25} scrollWheelZoom={true} style={{ height: "50vh", width: "100%",zIndex:"0" }} ref={mapRef}>
        <UpdateCenter center={center} />
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