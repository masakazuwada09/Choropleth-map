import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetchLocation = () => 
  new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject({
        code: 0,
        message: "Geolocation not supported",
      });
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });

const useGeoLocation = () => {
  const { data, error } = useSWR('geoLocation', fetchLocation, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  if (error) {
    return {
      loaded: true,
      error,
    };
  }

  return {
    loaded: !!data,
    coordinates: data
      ? { lat: data.coords.latitude, lng: data.coords.longitude }
      : { lat: "", lng: "" },
  };
};

export default useGeoLocation;
