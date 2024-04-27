import React, { useEffect } from 'react';

function GoogleMap() {
  useEffect(() => {
    // Load the Google Maps JavaScript API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    // Initialize the map
    window.initMap = () => {
      // const map = new window.google.maps.Map(document.getElementById('map'), {
      //   center: { lat: 23.345, lng: 34.567 }, // Set the initial map center
      //   zoom: 12, // Set the initial zoom level
      // });

      // You can add additional map configurations or markers here
    };

    // Clean up the script tag
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (<>
   <div id="map" style={{ height: '400px' }}>
  </div>
  </>
  );
}

export default GoogleMap;