import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { MapController } from "./MapController";

function App() {
  // my data which includes the location
  const [reviewData, setReviewData] = useState([]);
  const [selectedReview, selectReview] = useState(null);

  // Set the initial center and zoom level for the map
  const initialCenter = [59.914, 10.734]; // Oslo coordinates
  const initialZoom = 13; // Set your desired initial zoom level

  return (
    <div>
      {/* other components ... */}

      <MapContainer
        id="map"
        center={initialCenter} // Set the initial center of the map
        zoom={initialZoom} // Set the initial zoom level of the map
        style={{ height: "100vh", width: "100%" }} // Optional: make the map full height and width
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedReview={selectedReview} />

        {reviewData.map((review) => {
          return (
            <Marker
              key={review.id} // Make sure to provide a unique key
              position={review.location}
              eventHandlers={{
                click: () => {
                  selectReview(review);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
