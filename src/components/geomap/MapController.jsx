import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapController = ({  selectedReview }, props) => {
  const map = useMap();
  const flyToDuration = 1.5;

  const flyTo = (location) => {
    map.flyTo(location, 15, {
      animate: true,
      duration: flyToDuration,
    });
  };

  const flyToCenter = () => {
    map.flyTo([59.914, 10.734], 13, {
      animate: true,
      duration: flyToDuration,
    });
  };

  useEffect(() => {
    map.eachLayer(async (layer) => {
      if (layer instanceof L.Marker) {
        if (layer.position == props.selectedReview.location) {
          await sleep(flyToDuration * 1000 + 100);
          layer.bounce();
        } else {
          layer.stopBouncing();
        }
      }
    });
  }, [props.selectedReview]);


  return null;
};

export { MapController };
