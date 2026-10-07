import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

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

const LocationController = ({ setMap, location }) => {
  const map = useMap();

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  useEffect(() => {
    if (
      location &&
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number'
    ) {
      map.setView(
        [location.latitude, location.longitude],
        16
      );
    }
  }, [location, map]);

  return null;
};

const LocationPicker = ({ location, setLocation }) => {
  const [map, setMap] = useState(null);

  const hasLocation =
    location &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number';

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const newLocation = {
          latitude,
          longitude
        };

        setLocation(newLocation);

        if (map) {
          map.setView(
            [latitude, longitude],
            16
          );
        }
      },
      () => {
        return;
      }
    );
  };

  return (
    <div className="location-picker">

      <p className="location-picker-label">
        Pickup Location
      </p>

      <MapContainer
        className="location-map"
        center={
          hasLocation
            ? [location.latitude, location.longitude]
            : [26.0667, 50.5577]
        }
        zoom={hasLocation ? 16 : 11}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationController
          setMap={setMap}
          location={hasLocation ? location : null}
        />

        <LocationMarker
          setLocation={setLocation}
        />

        {hasLocation && (
          <Marker
            position={[
              location.latitude,
              location.longitude
            ]}
            icon={defaultIcon}
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

      {hasLocation && (
        <p className="location-picker-value">
          Location selected
        </p>
      )}

    </div>
  );
};

export default LocationPicker;