// @ts-nocheck
// GoogleMapComponent.tsx

import React, { useEffect } from 'react';
import './assets/style.css';

declare global {
  interface Window {
    initMap: () => void;
  }
}

declare var google: any;

const GoogleMapComponent: React.FC = () => {

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = () => {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly";
    script.defer = true;
    document.body.appendChild(script);
  }

  window.initMap = initMap;

  function initMap() {
    const myLatlng = { lat: -25.363, lng: 131.044 };

    const map = new (window as any).google.maps.Map(document.getElementById("map")!, {
        zoom: 4,
        center: myLatlng,
      });
      

    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: myLatlng,
    });

    infoWindow.open(map);

    map.addListener("click", (mapsMouseEvent) => {
      infoWindow.close();
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infoWindow.open(map);
    });
  }

  return (
    <div id="map"></div>
  );
}

export default GoogleMapComponent;
