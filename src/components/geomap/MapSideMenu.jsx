import React, { useState, useEffect } from 'react';
import ActionBtn from '../buttons/ActionBtn'; // Assuming you have an ActionBtn component
import FlatIcon from '../FlatIcon';

const MapSideMenu = ({ handleAddMarkerClick, handleFilterChange, handlePOISearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handlePOISearch(searchTerm);
  };

  return (
    <div className="relative left-0 top-0 h-full w-64 border bg-gray-100 text-white shadow-lg p-4 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black">Map Controls</h2>
        <button onClick={() => console.log('Close side menu')}>
          {/* Icon for closing menu can be added here */}
          <FlatIcon name="close" />
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={onSearchSubmit} className="flex items-center mb-4 bg-gray-200 rounded">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search POI..."
          className="w-full p-2 bg-transparent text-white outline-none"
        />
        <button type="submit" className="p-2">
          {/* Search icon can be added here */}
          <FlatIcon name="search" />
        </button>
      </form>

      

      {/* Actions */}
      <h3 className="text-md font-semibold mb-2 text-black">Actions</h3>
      <ActionBtn
        onClick={handleAddMarkerClick}
        className="flex items-center gap-2 mb-4 text-blue-400"
      >
        Add New Marker
      </ActionBtn>

    
    </div>
  );
};

export default MapSideMenu;
