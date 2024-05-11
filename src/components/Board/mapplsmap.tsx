//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
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
import L from "leaflet";
import axios from "axios";
import * as Constants from "../../utils/constants";
import { useAuth } from "../../contexts/UserContext"; 
import { useRouter } from "next/navigation";

const Mapplsmap = ({Lattitude, Longitude}) => {
  const mapRef = useRef();
  const router=useRouter();
  const responsearray = [];
  const [markersArray,setmarkersArray]=useState([]);
  const [center, setcenter] = useState({lat: parseFloat(Lattitude), lng: parseFloat(Longitude)});
  console.log(center)
  const [lat,setLat]=useState("");
  const [long,setLong]=useState("");
  const [radius, setradius] = useState(200);
  const [zoom,setZoom] = useState(10);
  const {currentUser}=useAuth();

  useEffect(() => {
    console.log("Lattitude:", Lattitude);
    console.log("Longitude:", Longitude);
    console.log("Center:", center);
    setcenter({ lat: parseFloat(Lattitude), lng: parseFloat(Longitude) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Lattitude, Longitude]);
  
  //icons to show on the map of red color and blue color
  const MarkerIcon = new L.Icon({
    iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const markericon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
  });

  // runs whenever lattitude,longitude or radius changes
  useEffect(() => {
    if(currentUser==null)
    {
      router.push({pathname:'/login'});
    }
    else if(currentUser.userRole==='Owner'){
      setmarkersArray([]);
      markersCustomers();
    }
    else{
      setmarkersArray([]);
      markers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Lattitude, Longitude, radius, center ]);

  //two functions used to find distance and put it into proper format

  //1) to find the warehouses that lie within the radius
  const markers = async () => {
    try {
      console.log("center in the map");
      console.log(center);
      if(radius>=0 && radius<=50)
      {setZoom(25);}
      else if(radius>=50 && radius<=100)
      {setZoom(20);}
      else if(radius>=100 && radius<=150)
      {setZoom(15);}
      else{setZoom(10);}
      const usingRadius = radius * 1000;
      const res = await axios.get(
        Constants.api_gateway_host +
          `/wh_basic_details_gis/?latitude=${center.lat}&longitude=${center.lng}&WH_RADIUS=${usingRadius}`
      );
      const newdata = await res.data;
      console.table(newdata);
      console.log(newdata.response);
      newdata.response.map((item) => {
        responsearray.push(item.wh_gps_coordinates);
      });
      await placeLocationsInFormat(responsearray);
    } catch (err) {
      console.log(err);
    }
  };
  
  const markersCustomers=async ()=>{
    try {
      console.log("center in the map");
      console.log(center);
      if(radius>=0 && radius<=50)
      {setZoom(25);}
      else if(radius>=50 && radius<=100)
      {setZoom(20);}
      else if(radius>=100 && radius<=150)
      {setZoom(15);}
      else{setZoom(10);}
      const usingRadius = radius * 1000;
      const res = await axios.get(
        Constants.api_gateway_host +
          `/wh_requirement_details_gis/?latitude=${center.lat}&longitude=${center.lng}&WH_RADIUS=${usingRadius}`
      );
      const newdata = await res.data;
      console.table(newdata);
      newdata.response.map((item) => {
        if(item.wh_gps_coordinates!==null){
        responsearray.push(item.wh_gps_coordinates);
        }
      });
      console.log(responsearray);
      await placeLocationsInFormat(responsearray);
    } catch (err) {
      console.log(err);
    }
  };


  const placeLocationsInFormat = (Array) => {
    Array.map((item) => {
      console.log(item);
      let number = item.split(" ");
      if (number.length === 2) {
        let number1 = parseFloat(number[0]);
        let number2 = parseFloat(number[1]);
        setmarkersArray(prevMarkersArray => [...prevMarkersArray, { lat: number2, lng: number1 }]);
      }
    });
    // console.log(MarkersArrayAll);
    // console.log(Array.length);
  };

  //LEAFLET CUSTOM FUNCTIONS
  //1) to locate initially the users location by asking through the browser
  const MapClickEvent = () => {
    const map = useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setcenter({lat:event.latlng.lat.toFixed(6),lng:event.latlng.lng.toFixed(6)});
        setLat(event.latlng.lat.toFixed(6));
        setLong(event.latlng.lng.toFixed(6));
        map.setView([lat, lng],zoom);
      } })
  }

  //2)To update center of the map and the icon
  const UpdateCenter = ({ center}) => {
    console.log("Updated");
    const map = useMap();
    map.setView([center.lat, center.lng], 13);
    return (
      <Marker position={{ lat: center.lat, lng: center.lng }} icon={MarkerIcon}>
        <Popup>{`This is searched by you ${center.lat},${center.lng}`}</Popup>
      </Marker>
    );
  };

  //3) placing blue icons on the map is done by this
  const PlacingBlueMarkers = ({markers}) => {
    console.log("Placing Blue Markers function at places");
    console.log(markers);
    return markers.map((location, index) => {
      return (
        <Marker key={index} position={location} icon={markericon}>
          <Popup>{`${location.lat} ; ${location.lng}`}</Popup>
        </Marker>
      );
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-8">
          <p>Radius(in km)</p> 
        </div>
        <div className="col-lg-2 p-0 w-25">
          <Input type="Number" className="p-1" value={radius} min="1" max="200" onChange={(e) => setradius(e.target.value)}/>
        </div>
      </div>
      <MapContainer center={center} zoom={zoom}  scrollWheelZoom={true} style={{ height: "100%", width: "100%" }} ref={mapRef}>
        <MapClickEvent />
        <UpdateCenter center={center}/>
        <PlacingBlueMarkers markers={markersArray}/>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         attribution='&copy; <a href="https://www.mapmyindia.com/">MapmyIndia</a>'/>
      </MapContainer>
    </>
  );
};

export default Mapplsmap;