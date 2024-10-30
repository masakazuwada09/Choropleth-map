import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from './libs/gensanBarangay';

const BarangayMap = () => {
    
  useEffect(() => {
    // Create the map instance with a unique id
    const map = L.map('barangay-map').setView([37.8, -96], 4);

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add the GeoJSON layer (assuming statesData is correctly loaded)
    L.geoJson(statesData).addTo(map);

    // Cleanup function to remove the map on component unmount
    return () => {
      map.remove();
    };
  }, []);

  
  // Use a unique id for the map container
  return <div id="barangay-map" style={{ height: '500px', width: '100%' }}></div>;
};

export default BarangayMap;
