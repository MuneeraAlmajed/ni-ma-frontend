import { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

const LocationMarker = ({ setLocation }) => {
  useMapEvents({
    click(event) {
      setLocation({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      });
    }
  });

  return null;
};

const LocationController = ({ setMap }) => {
  const map = useMap();

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
};


const LocationPicker = ({ location, setLocation }) => {
  const [map, setMap] = useState(null);

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setLocation({
        latitude,
        longitude
      });

      map.setView([latitude, longitude], 20);
    });
  };

  return (
    <div className="location-picker">
      <p className="location-picker-label">
        Pickup Location
      </p>

      <MapContainer
        className="location-map"
        center={[26.0667, 50.5577]}
        zoom={11}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationController setMap={setMap} />

        <LocationMarker setLocation={setLocation} />

        {location && (
          <Marker
            position={[
              location.latitude,
              location.longitude
            ]}
          />
        )}
      </MapContainer>

      <button
        className="current-location-button"
        type="button"
        onClick={handleCurrentLocation}
      >
        Use My Current Location
      </button>

      {location && (
        <p className="location-picker-value">
          Location selected
        </p>
      )}
    </div>
  );
};

export default LocationPicker;