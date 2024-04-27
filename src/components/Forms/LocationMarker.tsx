import React, { useState, useEffect } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  // Use useEffect to trigger location update when the component mounts
  useEffect(() => {
    map.locate();
  }, [map]);

  const handleLocationFound = (e) => {
    const { lat, lng } = e.latlng;
    setPosition(e.latlng);
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    map.flyTo(e.latlng, map.getZoom());
  };

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

export default LocationMarker;
