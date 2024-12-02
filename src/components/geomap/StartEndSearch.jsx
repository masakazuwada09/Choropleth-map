import React, { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-routing-machine";
import "lrm-google";
import FlatIcon from "../FlatIcon";

const startIcon = new L.Icon({
  iconUrl: "/start-pin.png",
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const endIcon = new L.Icon({
  iconUrl: "/end-pin.png",
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const StartEndSearch = () => {
  const map = useMap();
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [routeControl, setRouteControl] = useState(null);
  const [searchMode, setSearchMode] = useState("single"); // "start" or "end"
  const [startSearchTerm, setStartSearchTerm] = useState("My Location");
  const [endSearchTerm, setEndSearchTerm] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const startSuggestionsRef = useRef(null);
  const endSuggestionsRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [startLocationName, setStartLocationName] = useState("");
  const [endLocationName, setEndLocationName] = useState("");
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [isSwapped, setIsSwapped] = useState(false);
  const [endPlaceholder, setEndPlaceholder] = useState("End location...");
  const [originalEndPlaceholder] = useState("End location...");

  const handleSearchTermChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 2) {
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(term, (results) => {
        setSuggestions(results.map((result) => result.name));
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleUseCurrentLocation = (isStart) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = L.latLng(latitude, longitude);
  
          if (isStart) {
            setStartPosition(currentLocation);
            setStartLocationName("My Location");
            setStartSearchTerm("My Location");
  
            const marker = L.marker(currentLocation, { icon: startIcon })
              .addTo(map)
              .bindPopup("Start Location (Your Current Location)")
              .openPopup();
  
            // Set current location marker in state
            setCurrentLocationMarker(marker);
          } else {
            setEndPosition(currentLocation);
            setEndLocationName("My Location");
            setEndSearchTerm("My Location");
  
            const marker = L.marker(currentLocation, { icon: endIcon })
              .addTo(map)
              .bindPopup("End Location (Your Current Location)")
              .openPopup();
  
            // Set current location marker in state
            setCurrentLocationMarker(marker);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  
  

  const handleStartSearchTermChange = (e) => {
    const term = e.target.value;
    setStartSearchTerm(term);
  
    if (term.length > 2) {
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(term, (results) => {
        setStartSuggestions(results.map((result) => result.name));
      });
    } else {
      setStartSuggestions([]);
    }
  };
  const handleEndSearchTermChange = (e) => {
    const term = e.target.value;
    setEndSearchTerm(term);
  
    if (term.length > 2) {
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(term, (results) => {
        setEndSuggestions(results.map((result) => result.name));
      });
    } else {
      setEndSuggestions([]);
    }
  };

  const handleStartSuggestionSelect = (suggestion) => {
    setStartSearchTerm(suggestion);
    setStartSuggestions([]);
    handleStartSearch(suggestion); // Make sure to call the search function
  };

  const handleEndSuggestionSelect = (suggestion) => {
    setEndSearchTerm(suggestion);
    setEndSuggestions([]);
    handleEndSearch(suggestion); // Make sure to call the search function
  };
  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  };
  const handleSearch = (term) => {
    if (term) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]); // Keep the last 5 searches

      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(term, (results) => {
        if (results.length > 0) {
          const { center } = results[0];
          map.setView(center, 15);

          // Clear previous markers
          map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              map.removeLayer(layer);
            }
          });

          L.marker(center, { icon: locationIcon })
            .addTo(map)
            .bindPopup(term)
            .openPopup();
        } else {
          alert("Location not found.");
        }
      });

      setSearchTerm("");
      setSuggestions([]);
    }
  };
  const handleStartSearch = (term) => {
    if (term) {
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(term, (results) => {
        if (results.length > 0) {
          const { center, name } = results[0]; // Get the name of the location
          map.setView(center, 15);
          setStartPosition(center);
          setStartLocationName(name);
  
          // Update recent searches
          setRecentSearches((prev) => {
            const newSearch = { name, coords: center };
            // Remove duplicates and keep up to 10 searches
            const updatedSearches = prev.filter(search => search.name !== name);
            return [newSearch, ...updatedSearches].slice(0, 10); // Keep only the last 10 searches
          });
  
          // Add the new marker
          L.marker(center, { icon: startIcon })
            .addTo(map)
            .bindPopup(name)
            .openPopup();
        } else {
          alert("Start location not found.");
        }
      });
  
      setStartSearchTerm("");
      setStartSuggestions([]);
    }
  };
  
  

  const handleEndSearch = (term) => {
    if (term) {
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(term, (results) => {
        if (results.length > 0) {
          const { center, name } = results[0]; // Get the name of the location
          map.setView(center, 15);
  
          setEndPosition(center);
          setEndLocationName(name);
  
          // Update recent searches
          setRecentSearches((prev) => {
            const newSearch = { name, coords: center };
            // Remove duplicates and keep up to 10 searches
            const updatedSearches = prev.filter(search => search.name !== name);
            return [newSearch, ...updatedSearches].slice(0, 10); // Keep only the last 10 searches
          });
  
          // Add the new marker
          L.marker(center, { icon: endIcon })
            .addTo(map)
            .bindPopup(name)
            .openPopup();
  
          // Create route if start position exists
          if (startPosition) createRoute(startPosition, center);
        } else {
          alert("End location not found.");
        }
      });
  
      setEndSearchTerm("");
      setEndSuggestions([]);
    }
  };
  

  const handleToggleSearchTerms = () => {
    setIsSwapped(!isSwapped);

    // Swap positions and names without changing the placeholders
    const tempStart = startPosition;
    const tempStartName = startLocationName;


    setStartPosition(endPosition);
    setStartLocationName(endLocationName);
    setEndPosition(tempStart);
    setEndLocationName(tempStartName);
};
  
  
  useEffect(() => {
    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && (layer.options.icon === startIcon || layer.options.icon === endIcon)) {
        map.removeLayer(layer);
      }
    });
  
    // Add markers with updated positions
    if (startPosition) {
      L.marker(startPosition, { icon: startIcon })
        .addTo(map)
        .bindPopup(startLocationName || "Start Location")
        .openPopup();
    }
    if (endPosition) {
      L.marker(endPosition, { icon: endIcon })
        .addTo(map)
        .bindPopup(endLocationName || "End Location")
        .openPopup();
    }
  
    // If both positions are set, recreate the route
    if (startPosition && endPosition) {
      createRoute(startPosition, endPosition);
    }
  }, [startPosition, endPosition]);
  
  
  const handleSearchModeToggle = () => {
    // Check if switching from 'directions' to 'single'
    if (searchMode === 'directions') {
      clearMarkers(); // Clear the markers
      if (routeControl) {
        map.removeControl(routeControl); // Remove the route control
        setRouteControl(null); // Clear the route control state
      }
    }
    
    // Toggle search mode
    setSearchMode(prevMode => (prevMode === 'single' ? 'directions' : 'single'));
  };
  
  // Function to clear markers from the map
  const clearMarkers = () => {
    // Clear existing markers for start and end positions
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && (layer.options.icon === startIcon || layer.options.icon === endIcon)) {
        map.removeLayer(layer);
      }
    });
  };
  
  
  

  const createRoute = (start, end) => {
    if (start && end) {
      if (routeControl) {
        map.removeControl(routeControl);
      }

      const newRouteControl = L.Routing.control({
        waypoints: [L.latLng(start), L.latLng(end)],
        routeWhileDragging: true,
        createMarker: (i, waypoint) => {
          return L.marker(waypoint.latLng, { icon: i === 0 ? startIcon : endIcon });
        },
        lineOptions: { styles: [{ color: "#3388ff", weight: 5 }] },
      }).addTo(map);

      setRouteControl(newRouteControl);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };
  useEffect(() => {
    if (!startPosition) {
      handleUseCurrentLocation(true);
    }
  }, [startPosition]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startSuggestionsRef.current && !startSuggestionsRef.current.contains(event.target)) {
        setStartSuggestions([]);
      }
      if (endSuggestionsRef.current && !endSuggestionsRef.current.contains(event.target)) {
        setEndSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex-col z-[1000] left-1 index-0 absolute w-[25vh] mt-1 border shadow-md rounded-lg bg-white p-2 flex gap-2">
       

      {searchMode === "single" && (
        <>
          {/* Single Search Input */}
          <div className="flex">
  <input
    className="flex-1 p-1 rounded-md"
    type="text"
    value={searchTerm}
    onChange={handleSearchTermChange}
    placeholder="Search location..."
  />
  <button 
    className="text-gray-300 rounded-md flex items-center" 
    onClick={() => handleSearch(searchTerm)}
  >
    {/* Add an icon or text here if needed */}
  </button>

  <button 
  className={`p-2 rounded-md flex items-center ${searchMode === 'single' ? 'text-xl text-blue-500' : 'text-md text-gray-500'}`}
  onClick={handleSearchModeToggle}
  data-tip={searchMode === 'single' ? "Switch to Directions Search" : "Switch to Single Search"}
  title="Get Directions"
  >
    <FlatIcon icon={searchMode === 'single' ? "fi fi-sr-diamond-turn-right" : "fi fi-rr-cross"} />
  </button>
 
</div>

       
        </>
      )}

      {searchMode === "directions" && (
        <>
          {/* Directions Search Inputs */}
          <div className="flex w-full justify-between">
          <button
          className="p-1 bg-gray-200 text-gray-600 w-full rounded-md"
          onClick={() => handleUseCurrentLocation(true)}
        >
          Use Current Location
        </button>

        <button 
        className={`p-2 rounded-md flex items-center ${searchMode === 'single' ? 'text-xl text-blue-500' : ' text-md text-gray-500'}`}
        onClick={() => setSearchMode(prevMode => prevMode === 'single' ? 'directions' : 'single')}
        title="Close Directions"
      >
        <FlatIcon icon={searchMode === 'single' ? "fi fi-sr-diamond-turn-right" : "fi fi-rr-cross"} className="" /> 
        {searchMode === 'single' ? '' : ''}
      </button>
          </div>
         
            <div className="grid grid-cols-2 items-center gap-2">
                
              <div className="flex flex-col gap-1">

                {/*Start Input box*/}
                <div className="flex items-center gap-2">
                <FlatIcon icon="fi fi-ss-marker" className="text-lg text-gray-400"/>
                <div className={`flex-1 flex gap-2 transition-transform duration-500 ${isSwapped ? 'translate-y-8' : 'translate-y-0'}`}>
                
                    <input
                      className="flex-1 p-1 rounded-md border border-green-500"
                      type="text"
                      value={startSearchTerm}
                      onChange={handleStartSearchTermChange}
                      placeholder={startLocationName || "Start location..."} // This will show "My Location" when set
                    />

                     <button className="text-gray-300 rounded-md flex items-center" onClick={() => handleStartSearch(startSearchTerm)}>

                     </button>
                </div>
                </div>

              {/*End Input box*/}
              <div className="flex items-center gap-2">
              <FlatIcon icon="fi fi-ss-flag" className="text-lg text-gray-400"/>
              <div className={`flex-1 flex gap-2 transition-transform duration-500 ${isSwapped ? '-translate-y-8' : 'translate-y-0'}`}>
                
                  <input
                    className="flex-1 p-1 rounded-md border border-red-500"
                    type="text"
                    value={endSearchTerm}
                    onChange={handleEndSearchTermChange}
                    placeholder={endLocationName || originalEndPlaceholder} // Show name or default text
                  />
                  <button className="text-gray-300 rounded-md flex items-center" onClick={() => handleEndSearch(endSearchTerm)}>
          
                  </button>
                  </div>
               </div>
                
              </div>

                {/* Toggle Button for Search Terms */}
                <div className="flex justify-end">
                <button
              className="bg-gray-100 p-2 rounded-md rotate-90"
              onClick={handleToggleSearchTerms}
              title="Swap Start and End Locations"
            >
              <FlatIcon icon="fi fi-rr-exchange" /> {/* Use an appropriate icon for toggling */}
            </button>
                </div>
            
            </div>
        

          
            
            
          
        </>
      )}
      {/* Start Suggestions Dropdown */}
      {startSuggestions.length > 0 && (
        <div ref={startSuggestionsRef} className="suggestions bg-gray-100 border rounded-b-md absolute right-0 border-t-0 w-full mt-12 shadow-md">
          {startSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleStartSuggestionSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* End Suggestions Dropdown */}
      {endSuggestions.length > 0 && (
        <div ref={endSuggestionsRef} className="suggestions bg-gray-100 border rounded-b-md absolute right-0 border-t-0 w-full mt-12 shadow-md">
          {endSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleEndSuggestionSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div ref={suggestionsRef} className="suggestions bg-gray-100 border rounded-b-md absolute right-0 border-t-0 w-full mt-12 shadow-md">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      <div className="recent-searches mt-2">
  <h3 className="text-gray-600">Recent Searches</h3>
  <ul>
    {recentSearches.length > 0 ? (
      recentSearches.map((search, index) => (
        <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSearch(search.name)}>
          {search.name}
        </li>
      ))
    ) : (
      <li className="p-2 text-gray-400">No recent searches</li>
    )}
  </ul>
</div>


      <div className="flex justify-between mt-1">
        <button className="text-red-500" onClick={clearRecentSearches}>
          Clear Recent Searches
        </button>
        <div className="text-gray-500 text-xs">{recentSearches.length} recent searches</div>
      </div>
    </div>
  );
};

export default StartEndSearch;
