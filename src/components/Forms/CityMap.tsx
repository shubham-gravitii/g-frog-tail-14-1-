//@ts-nocheck
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const ClientSideMap = dynamic(() => import('./ClientSide'), { ssr: false });

const MapComponent = ({ Lattitude, Longitude, setCoordinates ,warehouseId,ownerId}) => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <p>Click on the map to get the geo-coordinates!!</p>
      <ClientSideMap Lattitude={Lattitude} Longitude={Longitude} setCoordinates={setCoordinates} warehouseId={warehouseId} ownerId={ownerId}/>
    </div>
  );
};

export default MapComponent;

