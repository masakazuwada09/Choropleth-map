import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import ActionBtn from '../buttons/ActionBtn';

const MarkerManagement = ({ markers, handleRemoveMarker, tooltipVisible, setTooltipVisible }) => {
  return (
    <>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          eventHandlers={{
            click: () => {
              handleRemoveMarker(index);
              setTooltipVisible(prev => ({ ...prev, [index]: !prev[index] }));
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
    </>
  );
};

export default MarkerManagement;