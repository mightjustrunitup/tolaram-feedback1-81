
import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  locationName: string | null;
  error: string | null;
  loading: boolean;
  permissionGranted: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    locationName: null,
    error: null,
    loading: false,
    permissionGranted: false
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false
      }));
      return false;
    }

    setState(prev => ({ ...prev, loading: true }));
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Try to get a readable location name using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          // Extract location details from the response
          const locationName = data.display_name || 
            `${data.address?.city || data.address?.town || data.address?.state || 'Unknown location'}`;
            
          setState({
            latitude,
            longitude,
            accuracy,
            locationName,
            loading: false,
            error: null,
            permissionGranted: true
          });
        } catch (error) {
          // If geocoding fails, still save the coordinates
          setState({
            latitude,
            longitude,
            accuracy,
            locationName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            loading: false,
            error: null,
            permissionGranted: true
          });
        }
      },
      (error) => {
        let errorMessage = "Unknown error occurred";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
          permissionGranted: false
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    
    return true;
  };
  
  return {
    ...state,
    requestLocation
  };
}
