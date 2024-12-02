import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';
import { barangayData } from './libs/gensanBarangay';
import AppLayout from '../container/AppLayout';
import GeneralSantosMap from './GeneralSantosMap';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

const MapMunicipalities = () => {
  const mapRef = useRef(null);
  const geojsonRef = useRef(null);
  const [newMarker, setNewMarker] = useState({ name: "", category: "", position: null });
  const [markers, setMarkers] = useState([]);
  const [filter, setFilter] = useState("all"); // Default filter
  const [mapType, setMapType] = useState("barangay-map");
  const [position, setPosition] = useState({
    lat: 6.103330,
    lng: 125.220560,
  });
  const [showSideMenu, setShowSideMenu] = useState(true);
  
  const [reviewData] = useState([
      { id: 1, location: [6.12147838674842, 125.12525082465096], category: "barangay", name: "Apopong Barangay" },
      { id: 1, location: [6.124170567182694, 125.22102920748065], category: "barangay", name: "Baluan Barangay" },
      { id: 1, location: [6.238423115525702, 125.26087759324963], category: "barangay", name: "Batolomeng Barangay" }, 
      { id: 1, location: [6.115696024644673, 125.23468761966745], category: "barangay", name: "Buayan Barangay" }, 
      { id: 1, location: [6.1052878090458025, 125.19544266736634], category: "barangay", name: "Bula Barangay" }, 
      // Add the remaining sample data here...
    ]);

  const sampleReviewData = [
    { id: 1, location: [6.12147838674842, 125.12525082465096], category: "barangay", name: "Apopong Barangay" },
    { id: 1, location: [6.124170567182694, 125.22102920748065], category: "barangay", name: "Baluan Barangay" },
    { id: 1, location: [6.238423115525702, 125.26087759324963], category: "barangay", name: "Batolomeng Barangay" }, 
    { id: 1, location: [6.115696024644673, 125.23468761966745], category: "barangay", name: "Buayan Barangay" }, 
    { id: 1, location: [6.1052878090458025, 125.19544266736634], category: "barangay", name: "Bula Barangay" }, 
    { id: 2, location: [6.123952493129296, 125.12945652082574], category: "clinic", name: "Maternity Clinic" },
    { id: 2, location: [6.1193900720120515, 125.18162807998911], category: "clinic", name: "Medical Clinic" }, 
    { id: 2, location: [6.113158012316414, 125.17230229328233], category: "clinic", name: "ODI Medical Clinic" },
    { id: 3, location: [6.105330, 125.235000], category: "hospital", name: "General Hospital" }, 
    { id: 3, location: [6.121127443341872, 125.17942051390148], category: "hospital", name: "General Santos Hospital" },
    { id: 3, location: [6.125607844882643, 125.18002132870912], category: "hospital", name: "Dadiangas Hospital" },
    { id: 3, location: [6.0835590264497394, 125.15014535374044], category: "hospital", name: "General Hospital" }
  ];


  const [colorRanges, setColorRanges] = useState({
      0: '#FFEDA0',
      10: '#FED976',
      20: '#FEB24C',
      50: '#FD8D3C',
      100: '#FC4E2A',
      200: '#E31A1C',
      500: '#BD0026',
      1000: '#800026',
    });

  
    const toggleSideMenu = () => {
      setShowSideMenu(!showSideMenu);
    };
  
  function getColor(d) {
    return d > 1000 ? colorRanges[1000] :
           d > 500  ? colorRanges[500] :
           d > 200  ? colorRanges[200] :
           d > 100  ? colorRanges[100] :
           d > 50   ? colorRanges[50] :
           d > 20   ? colorRanges[20] :
           d > 10   ? colorRanges[10] :
                      colorRanges[0];
  }

  // Function to style each feature
  function style(feature) {
    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Parse latitude and longitude to float if they are being entered as strings
    if (name === "lat" || name === "lng") {
      setNewMarker((prev) => ({ ...prev, position: { ...prev.position, [name]: parseFloat(value) } }));
    } else {
      setNewMarker((prev) => ({ ...prev, [name]: value }));
    }
  };
  // Function to highlight a feature on mouseover
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '3',
      fillOpacity: 0.7
    });
    info.update(layer.feature.properties);
    layer.bringToFront();
  };

  // Function to reset the highlight on mouseout
  const resetHighlight = (e) => {
    if (geojsonRef.current) geojsonRef.current.resetStyle(e.target);
  };

  // Function to zoom to a feature on click
  function zoomToFeature(e) {
    mapRef.current.fitBounds(e.target.getBounds());
  }

  // Function to define what happens on each feature
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMarker.name && newMarker.category && newMarker.position) {
      // Pass the new marker to GeneralSantosMap
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          position: [newMarker.position.lat, newMarker.position.lng],
          tooltip: `${newMarker.name} (${newMarker.category})`,
        },
      ]);
      // Reset new marker state
      setNewMarker({ name: "", category: "", position: null });
      setIsAddingMarker(false);
    }
  };
  
const info = L.control();

info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info centered-info'); // create a div with class "info centered-info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = `<h4 style="color: white; font-size: 14px;">Barangay Density</h4>` + 
    (props ? `<b style="color: white; font-size: 20px;">${props.name}</b><br /><span style="font-size: 18px;">${props.density} people / mi<sup>2</sup></span>` : 
    'Hover over a barangay');
};



const barangaydensity = L.control({position: 'bottomright'});

barangaydensity.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  div.style.maxWidth = "100%"; // Restrict width for readability on mobile
  const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
  const listContainer = L.DomUtil.create('div', 'list-container', div);

  window.addEventListener('resize', () => {
    if (barangaydensity.getContainer()) {
      if (window.innerWidth <= 768) {
        barangaydensity.getContainer().style.position = "relative";
        barangaydensity.getContainer().style.bottom = "10px";
        barangaydensity.getContainer().style.left = "10px";
        barangaydensity.getContainer().style.zIndex = "1000";
        barangaydensity.getContainer().style.background = "rgba(255, 255, 255, 0.8)";
        barangaydensity.getContainer().style.padding = "10px";
        barangaydensity.getContainer().style.borderRadius = "8px";
      } else {
        barangaydensity.getContainer().style.position = "absolute";
        barangaydensity.getContainer().style.bottom = "50px";
        barangaydensity.getContainer().style.left = "10px";
        barangaydensity.getContainer().style.background = "transparent";
      }
    }
  });
  
    // Create a container for the list


    // Initialize an object to hold barangays grouped by density range
    var groupedBarangays = {};

    // Loop through the barangay data to extract names and group them by density
    barangayData.features.forEach(feature => {
        const name = feature.properties.name;
        const density = feature.properties.density;

        // Determine the density range
        for (let i = 0; i < grades.length; i++) {
            if (density > grades[i] && (i === grades.length - 1 || density <= grades[i + 1])) {
                if (!groupedBarangays[grades[i]]) {
                    groupedBarangays[grades[i]] = [];
                }
                groupedBarangays[grades[i]].push(name);
                break;
            }
        }
    });

    // Populate the list container with grouped barangay names and density intervals
    for (let i = 0; i < grades.length; i++) {
        if (groupedBarangays[grades[i]]) {
            listContainer.innerHTML +=
                '<div><i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+') + '<br>' +
                '<b>Barangays:</b><br>' + groupedBarangays[grades[i]].join(', ') + '</div><br>';
        }
    }

    return div;
};


// info.addTo(map);

useEffect(() => {
  if (mapType === "barangay-map" && !mapRef.current) {
    mapRef.current = L.map('barangay-map').setView([6.103330, 125.220560], 11);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    geojsonRef.current = L.geoJson(barangayData, {
      style,
      onEachFeature,
    }).addTo(mapRef.current);

    // Add Leaflet Control Geocoder for online geocoding search
    L.Control.geocoder({
      defaultMarkGeocode: false
    }).on('markgeocode', function(e) {
      const bbox = e.geocode.bbox;
      const poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
      ]);
      mapRef.current.fitBounds(poly.getBounds());
    }).addTo(mapRef.current);

    // Add a custom dropdown search for predefined POIs
    const poiSearchControl = L.control({ position: 'bottomleft' });
    poiSearchControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'poi-search-center');
      div.innerHTML = `
        <select id="poi-search" style="width: 200px;">
          <option value="">Select Barangay</option>
          ${reviewData.map(poi => `<option value="${poi.location}">${poi.name}</option>`).join('')}
        </select>
      `;
      return div;
    };
    poiSearchControl.addTo(mapRef.current);
    poiSearchControl.addTo(mapRef.current);

    document.getElementById('poi-search').addEventListener('change', function(e) {
      const [lat, lng] = e.target.value.split(',');
      if (lat && lng) {
        mapRef.current.setView([parseFloat(lat), parseFloat(lng)], 15);
        L.marker([parseFloat(lat), parseFloat(lng)]).addTo(mapRef.current)
          .bindPopup(e.target.options[e.target.selectedIndex].text).openPopup();
      }
    });

    info.addTo(mapRef.current);
      
      barangaydensity.addTo(mapRef.current);
  }

  return () => {
    if (mapRef.current) mapRef.current.remove();
    mapRef.current = null;
  };
}, [mapType]);

  
  // Use a unique id for the map container
  return (
    <AppLayout>
    <div className='flex flex-col h-full'>
      <div className='bg-blue-500 shadow-inner px-2 py-2 flex gap-2 items-start'>
        <label className="text-white text-sm" htmlFor="mapTypeSelect">Select Map: </label>
        <select
          id="mapTypeSelect"
          value={mapType}
          className='text-sm text-white w-[10%] bg-blue-400'
          onChange={(e) => setMapType(e.target.value)}
        >
          <option value="barangay-map">Choropleth</option>
          <option value="general-santos-map">Marker</option>
        </select>

        {/* Render ActionBtn only if the Marker option is selected */}
        {mapType === "general-santos-map" && (
          

          <>
       
          </>
        )}
      </div>

      {mapType === "barangay-map" ? (
        <div id="barangay-map" style={{ height: '100%', width: '100%' }}></div>
      ) : (
        <div style={{ height: '100%', width: '100%' }}>
          <GeneralSantosMap
            position={position}
            setPosition={(pos) => {
              setPosition({
                lat: pos.lat,
                lng: pos.lng,
              });
              setValue("lat", pos?.lat);
              setValue("lng", pos?.lng);
            }}
          />
        </div>
      )}
    </div>
  </AppLayout>
  )

};

export default MapMunicipalities;