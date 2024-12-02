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
import axios from "axios";

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

  useEffect(() => {
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
        const { lat, lng } = feature.geometry.coordinates[0][0]; // Adjust this depending on your GeoJSON structure

        // Fetch weather data for the feature
        fetchWeatherData(lat, lng).then(weatherData => {
          // Bind tooltip with weather info
          layer.bindTooltip(
            `Barangay: ${feature.properties.name}<br>Population: ${feature.properties.density}<br>Weather: ${weatherData ? `${weatherData.main.temp} °C, ${weatherData.weather[0].description}` : 'Data not available'}`,
            {
              permanent: false,
              direction: "bottom",
              offset: [0, -60],
            }
          );
        });

        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature,
        });
      },
    });

    geojsonLayer.addTo(map);
    geojsonRef.current = geojsonLayer;

    return () => {
      map.removeLayer(geojsonLayer);
    };
  }, [map, data]);

  const fetchWeatherData = async (lat, lon) => {
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
        }
      });
      return response.data; // Return the weather data
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null; // Return null if there's an error
    }
  };

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '3',
      fillOpacity: 0.7,
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
    { id: 1, location: [6.12147838674842, 125.12525082465096], category: "barangay", name: "Apopong Barangay", imageUrl: "/barangay-apopong-img.png"},
    { id: 1, location: [6.124170567182694, 125.22102920748065], category: "barangay", name: "Baluan Barangay" },
    { id: 1, location: [6.238621561157615, 125.26070734234182], category: "barangay", name: "Batolomeng Barangay" }, 
    { id: 1, location: [6.115696024644673, 125.23468761966745], category: "barangay", name: "Buayan Barangay" }, 
    { id: 1, location: [6.1052878090458025, 125.19544266736634], category: "barangay", name: "Bula Barangay" }, 
    { id: 2, location: [6.123952493129296, 125.12945652082574], category: "clinic", name: "Panis Maternity Clinic", imageUrl: "/panis-maternity-clinic.jpg" },
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
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = '0a176ad6a4c613ead4f5aa247c6a2d38';
  
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric', // Use 'imperial' for Fahrenheit
        }
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null); // Reset weather data on error
    }
  };
  const handleMarkerClick = async (marker) => {
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
      position: marker.location // Ensure the position is set
    });

    // Fetch weather data for the selected marker's position
    if (marker.location) {
      const { lat, lng } = { lat: marker.location[0], lng: marker.location[1] }; // Adjust if needed
      await fetchWeatherData(lat, lng); // Fetch weather data
    }
  };
  
  useEffect(() => {
    if (selectedMarkerDetails) {
      const { lat, lng } = selectedMarkerDetails.position; // Extract position from selected marker details
      fetchWeatherData(lat, lng); // Fetch weather data for selected marker position
    }
  }, [selectedMarkerDetails]);

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
           <StartEndSearch 
            selectedMarkerDetails={selectedMarkerDetails}
           />
           
            
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
                        {weatherData && (
                          <div>
                            <h4>Weather Details:</h4>
                            <p>Temperature: {weatherData.main.temp} °C</p>
                            <p>Condition: {weatherData.weather[0].description}</p>
                            <p>Humidity: {weatherData.main.humidity}%</p>
                            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                          </div>
                        )}
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
              <div class="flex justify-center">
                	<div
                		class="card  min-w-sm max-w-sm border  transition-shadow test  shadow-lg hover:shadow-shadow-xl w-full bg-gray-100 opacity-90 text-gray-900 rounded-lg">
                		<h2 class="text-md mb-2 px-4 pt-4 text-gray-900">
                			<div class="flex justify-between">
                				<div class="badge relative top-0">
                        <span className="text-lg font-semibold">{selectedMarkerDetails.name}</span>
                					</div>
                				
                			</div>
                		</h2>

                		<div class="flex items-center p-4">
                    <img src={selectedMarkerDetails.imageUrl} alt={selectedMarkerDetails.name} style={{ width: '100vh', height: 'auto' }} />
                			
                		</div>
                		<div class="text-md pb-4 px-4">
                			<div class="flex justify-between items-center">
                				<div class="space-y-1">
                        <p>Status: {selectedMarkerDetails.status}</p>
                        {weatherData && (
                           <div className="">
                             <h3>Weather Details:</h3>
                             <p>Weather: {weatherData.weather[0].description}</p>
                             <p>Humidity: {weatherData.main.humidity}%</p>
                             <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                           </div>
                         )}
                					<span class="flex space-x-2 items-center"><svg height="20" width="20" viewBox="0 0 32 32" class="fill-current"><path d="M13,30a5.0057,5.0057,0,0,1-5-5h2a3,3,0,1,0,3-3H4V20h9a5,5,0,0,1,0,10Z"></path><path d="M25 25a5.0057 5.0057 0 01-5-5h2a3 3 0 103-3H2V15H25a5 5 0 010 10zM21 12H6V10H21a3 3 0 10-3-3H16a5 5 0 115 5z"></path></svg> <span>27km/h</span></span><span class="flex space-x-2 items-center"><svg height="20" width="20" viewBox="0 0 32 32" class="fill-current"><path d="M16,24V22a3.2965,3.2965,0,0,0,3-3h2A5.2668,5.2668,0,0,1,16,24Z"></path><path d="M16,28a9.0114,9.0114,0,0,1-9-9,9.9843,9.9843,0,0,1,1.4941-4.9554L15.1528,3.4367a1.04,1.04,0,0,1,1.6944,0l6.6289,10.5564A10.0633,10.0633,0,0,1,25,19,9.0114,9.0114,0,0,1,16,28ZM16,5.8483l-5.7817,9.2079A7.9771,7.9771,0,0,0,9,19a7,7,0,0,0,14,0,8.0615,8.0615,0,0,0-1.248-3.9953Z"></path></svg> <span>32%</span></span>
                				</div>
                				<div>
                					<h1 class="text-4xl">{weatherData && ( <p> {weatherData.main.temp}°C</p> )}</h1>
                				</div>
                			</div>
                		</div>
                	</div>
                </div>
              
              
            
             
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