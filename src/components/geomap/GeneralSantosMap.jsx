import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { MapContainer, Marker, TileLayer, Polyline, Tooltip, useMap, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import { barangayData } from "./libs/gensanBarangay";
import useGeoLocation from "./hooks/useGeoLocation";
import { MapController } from "./MapController";
import MapSideMenu from "./MapSideMenu";
import ActionBtn from "../buttons/ActionBtn";
import MarkerManagement from "./MarkerManagement";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "lrm-google"
import StartEndSearch from "./StartEndSearch";

const userIcon = new L.Icon({
  iconUrl: '/my-location.png',
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const barangayIcon = new L.Icon({
  iconUrl: '/barangay-pin.png',
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const clinicIcon = new L.Icon({
  iconUrl: '/clinic-pin.png',
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowAnchor: [200],
});

const hospitalIcon = new L.Icon({
  iconUrl: '/hospital-pin.png',
  iconSize: [55, 51],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Choropleth data (for example purposes)
const choroplethData = {
  type: "FeatureCollection",
  features: barangayData.features.map(feature => ({
    ...feature,
    properties: {
      ...feature.properties,
      // Add any additional properties you need here
    }
  })),
};

const ChoroplethLayer = ({ data }) => {
  const map = useMap();
  const geojsonRef = useRef();

  React.useEffect(() => {
    if (!data || !data.features) {
      console.error("Invalid GeoJSON data");
      return;
    }

    const geojsonLayer = L.geoJSON(data, {
      style: {
        color: "",
        weight: 2,
        fillOpacity: 0,
        fillColor: "#b9b9b9cc",
      },
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(
          `Barangay: ${feature.properties.name}<br>Population: ${feature.properties.density}`,
          {
            permanent: false,
            direction: "bottom",
            offset: [0, -60],
          }
        );

        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      },
    });

    geojsonLayer.addTo(map);
    geojsonRef.current = geojsonLayer;

    return () => {
      map.removeLayer(geojsonLayer);
    };
  }, [map, data]);

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '3',
      fillOpacity: 0.7
    });
    layer.bringToFront();
  };

  const resetHighlight = (e) => {
    if (geojsonRef.current) {
      geojsonRef.current.resetStyle(e.target);
    }
  };

  const zoomToFeature = (e) => {
    map.fitBounds(e.target.getBounds());
  };

  return null;
};

// Search Bar Integration


const GeneralSantosMap = ({ position, setPosition, choroplethData }) => {
  const sampleReviewData = [
    { id: 1, location: [6.12147838674842, 125.12525082465096], category: "barangay", name: "Apopong Barangay", imageUrl: "/barangay-apopong-img.png", status: "Active"},
    { id: 1, location: [6.124170567182694, 125.22102920748065], category: "barangay", name: "Baluan Barangay" },
    { id: 1, location: [6.238621561157615, 125.26070734234182], category: "barangay", name: "Batolomeng Barangay" }, 
    { id: 1, location: [6.115696024644673, 125.23468761966745], category: "barangay", name: "Buayan Barangay" }, 
    { id: 1, location: [6.1052878090458025, 125.19544266736634], category: "barangay", name: "Bula Barangay" }, 
    { id: 2, location: [6.123952493129296, 125.12945652082574], category: "clinic", name: "Maternity Clinic" },
    { id: 2, location: [6.1193900720120515, 125.18162807998911], category: "clinic", name: "Medical Clinic" }, 
    { id: 2, location: [6.113158012316414, 125.17230229328233], category: "clinic", name: "ODI Medical Clinic" },
    { id: 3, location: [6.105330, 125.235000], category: "hospital", name: "General Hospital" }, 
    { id: 3, location: [6.121127443341872, 125.17942051390148], category: "hospital", name: "General Santos Hospital" },
    { id: 3, location: [6.125607844882643, 125.18002132870912], category: "hospital", name: "Dadiangas Hospital" },
    {id: 3, location: [6.0835590264497394, 125.15014535374044], category: "hospital", name: "General Hospital" }
  ];
  const mapRef = useRef(null);
  const [reviewData] = useState(sampleReviewData);
  const [selectedReview, selectReview] = useState(null);
  const [filter, setFilter] = useState("all");
  const initialZoom = 11;
  const [markers, setMarkers] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarker, setNewMarker] = useState({ name: "", category: "", position: null });
  const [tooltipVisible, setTooltipVisible] = useState({});
  const barangaydensity = L.control({position: 'bottomleft'});
  const [showSideMenu, setShowSideMenu] = useState(true);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [lineColor, setLineColor] = useState("#3388ff");
  const ZOOM_LEVEL = 9;
  const location = useGeoLocation(); 
  const [start, setStart] = useState({ lat: null, lng: null });
  const [end, setEnd] = useState({ lat: null, lng: null });
  const [selectedMarkerDetails, setSelectedMarkerDetails] = useState(null);

  const handleMarkerClick = (marker) => {
    const isAlreadySelected = selectedMarkers.some(
      (selectedMarker) => selectedMarker.id === marker.id
    );
  
    if (!isAlreadySelected) {
      if (selectedMarkers.length < 2) {
        setSelectedMarkers([...selectedMarkers, marker]);
      } else {
        setSelectedMarkers([marker]);
      }
    }
  
    // Set selected marker details for display
    setSelectedMarkerDetails({
      name: marker.name,
      imageUrl: marker.imageUrl,
      status: marker.status,
    });
  };
  


  const handleRemoveMarker = (index) => {
    setMarkers((prevMarkers) => prevMarkers.filter((_, i) => i !== index));
    setTooltipVisible((prev) => ({ ...prev, [index]: false }));
  };

  const handleAddMarkerClick = () => {
    setIsAddingMarker(true);
    setNewMarker({ name: "", category: "", position: { lat: "", lng: "" } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMarker((prev) => ({
      ...prev,
      [name]: name === "lat" || name === "lng" ? parseFloat(value) : value,
    }));
  };
  const handleButtonClick = (marker) => {
    // Add your logic here, for example, showing more details or navigating to a new page
    alert(`Button clicked for ${marker.name}`);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMarker.name && newMarker.category && newMarker.position.lat && newMarker.position.lng) {
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          position: [newMarker.position.lat, newMarker.position.lng],
          tooltip: `${newMarker.name} (${newMarker.category})`,
        },
      ]);
      setNewMarker({ name: "", category: "", position: { lat: "", lng: "" } });
      setIsAddingMarker(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

    return (
      <div>
        <div className="h-[90vh] bg-blue-500">
          
          <MapContainer
            center={[6.103330, 125.220560]}
            zoom={11}
            scrollWheelZoom={true}
            zoomControl={false}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          >
           <StartEndSearch />
           
            {selectedMarkers.length === 2 && (
              <Polyline
                positions={selectedMarkers.map(marker => marker.location)}
                pathOptions={{ color: lineColor, weight: 5 }}
              />
            )}
           {/* <div className="flex justify-center z-[1000] index-0 fixed top-0 left-0">
              {showSideMenu && (
                <MapSideMenu
                  handleAddMarkerClick={handleAddMarkerClick}
                />
              )}
            </div> */}
  
            <LayersControl position="bottomleft">
              {/* Base Layer for Tile Maps */}
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
  
              <LayersControl.BaseLayer checked name="Satellite">
                <TileLayer
                  url="https://stamen-tiles-{s}.a.ssl.fastly.net/satellite/{z}/{x}/{y}.jpg"
                  attribution='&copy; <a href="https://stamen.com">Stamen Design</a> contributors'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Terrain">
                <TileLayer
                  url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
                  attribution='&copy; <a href="https://stamen.com">Stamen Design</a> contributors'
                />
              </LayersControl.BaseLayer>
  
              <LayersControl.BaseLayer name="CartoDB Positron">
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
              </LayersControl.BaseLayer>
  
              <LayersControl.BaseLayer name="OpenTopoMap">
                <TileLayer
                  attribution='Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
  
              {/* Choropleth Layer */}
              <LayersControl.Overlay checked name="Choropleth Layer">
                <ChoroplethLayer data={barangayData} />
              </LayersControl.Overlay>
  
              {/* Layer Group for Barangay Markers */}
              <LayersControl.Overlay checked name="Barangay Markers">
            <LayerGroup>
              {sampleReviewData
                .filter((review) => review.category === "barangay")
                .map((review) => (
                  <Marker
                    key={review.id}
                    position={review.location}
                    icon={barangayIcon}
                  >
                    <Tooltip>
                      <div>
                        <h2>{review.name}</h2>
                        <img
                          src={review.imageUrl}
                          alt={review.name}
                          style={{ width: '50px', height: 'auto' }}
                        />
                        <p>Status: {review.status}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent map click event
                            handleButtonClick(review);
                          }}
                          style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}
                        >
                          More Info
                        </button>
                      </div>
                    </Tooltip>
                  </Marker>
                ))}
            </LayerGroup>
          </LayersControl.Overlay>
  
              {/* Layer Group for Clinic Markers */}
              <LayersControl.Overlay checked name="Clinic Markers">
                <LayerGroup>
                  {sampleReviewData
                    .filter((review) => review.category === "clinic")
                    .map((review) => (
                      <Marker
                        key={review.id}
                        position={review.location}
                        icon={clinicIcon}
                        eventHandlers={{
                          click: () => handleMarkerClick(review),
                        }}
                      >
                        <Tooltip>{`${review.name} (${review.category})`}</Tooltip>
                      </Marker>
                    ))}
                </LayerGroup>
              </LayersControl.Overlay>
  
              {/* Layer Group for Hospital Markers */}
              <LayersControl.Overlay checked name="Hospital Markers">
                <LayerGroup>
                  {sampleReviewData
                    .filter((review) => review.category === "hospital")
                    .map((review) => (
                      <Marker
                        key={review.id}
                        position={review.location}
                        icon={hospitalIcon}
                        eventHandlers={{
                          click: () => handleMarkerClick(review),
                        }}
                      >
                        <Tooltip>{`${review.name} (${review.category})`}</Tooltip>
                      </Marker>
                    ))}
                </LayerGroup>
              </LayersControl.Overlay>
  
              {/* Layer Group for User-Created Markers */}
              <LayersControl.Overlay checked name="User-Created Markers">
                <LayerGroup>
                  {markers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={marker.position}
                      eventHandlers={{
                        click: () => {
                          handleRemoveMarker(index);
                          setTooltipVisible((prev) => ({ ...prev, [index]: !prev[index] }));
                        },
                      }}
                    >
                      <Tooltip permanent={tooltipVisible[index]}>
                        {marker.tooltip}
                        <span
                          style={{ cursor: 'pointer', color: 'red', display: 'block', marginTop: '5px' }}
                        >
                          Remove Marker
                        </span>
                      </Tooltip>
                    </Marker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
  
              <MarkerManagement
                markers={markers}
                handleRemoveMarker={handleRemoveMarker}
                tooltipVisible={tooltipVisible}
                setTooltipVisible={setTooltipVisible}
              />
              
            </LayersControl>
            {selectedMarkerDetails && (
        <div className="marker-details">
          <h2>{selectedMarkerDetails.name}</h2>
          <img src={selectedMarkerDetails.imageUrl} alt={selectedMarkerDetails.name} style={{ width: '100px', height: 'auto' }} />
          <p>Status: {selectedMarkerDetails.status}</p>
        </div>
      )}
            
            {/* Added Markers for dynamic clicks */}
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                eventHandlers={{
                  click: () => {
                    handleRemoveMarker(index);
                    setTooltipVisible((prev) => ({ ...prev, [index]: !prev[index] }));
                  },
                }}
              >
                <Tooltip permanent={tooltipVisible[index]}>
                  {marker.tooltip}
                  <span
                    style={{ cursor: 'pointer', color: 'red', display: 'block', marginTop: '5px' }}
                  >
                    Click to Remove Marker
                  </span>
                </Tooltip>
              </Marker>
            ))}
  
            <MapController selectedReview={selectedReview} />
          </MapContainer>
        </div>
      </div>
    );
  };
  
  // Prop types validation
  GeneralSantosMap.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    setPosition: PropTypes.func.isRequired,
    choroplethData: PropTypes.object,
  };
  
  export default GeneralSantosMap;