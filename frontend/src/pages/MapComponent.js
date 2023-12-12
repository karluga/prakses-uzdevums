// MapComponent.js
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Polyline,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { formatDrivingTime } from "../utils.js";

const containerStyle = {
  width: "100%",
  height: "300px",
};
const librariesArray = ["geometry"];

function MapComponent({ route }) {
  const [map, setMap] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [drivingTime, setDrivingTime] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: librariesArray,
  });

  useEffect(() => {
    if (map && route && route.start && route.end) {
      // Use the DirectionsService to get driving directions
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: route.start.lat, lng: route.start.lng },
          destination: { lat: route.end.lat, lng: route.end.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            // Extract and set the driving time from the result
            const timeInSeconds = result.routes[0].legs[0].duration.value;
            const timeInMinutes = Math.ceil(timeInSeconds / 60);
            setDrivingTime(timeInMinutes);
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        }
      );
    }
  }, [map, route]);

  useEffect(() => {
    if (isLoaded && route && route.decoded_route.points) {
      const bounds = new window.google.maps.LatLngBounds();
      route.decoded_route.points.forEach((point) => {
        bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
      });

      setMap((prevMap) => {
        if (prevMap) {
          prevMap.fitBounds(bounds);
        }
        return prevMap;
      });
    }
  }, [isLoaded, route]);

  useEffect(() => {
    if (map && route && route.decoded_route.points) {
      const path = route.decoded_route.points.map((point) => ({
        lat: point.lat,
        lng: point.lng,
      }));

      new window.google.maps.Polyline({
        path,
        map,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      // Mark starting and ending points with markers
      if (route.start && route.start.lat && route.start.lng) {
        new window.google.maps.Marker({
          position: { lat: route.start.lat, lng: route.start.lng },
          map,
          title: "Start",
          icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green marker for start
        });
      }

      if (route.end && route.end.lat && route.end.lng) {
        new window.google.maps.Marker({
          position: { lat: route.end.lat, lng: route.end.lng },
          map,
          title: "End",
          icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Red marker for end
        });
      }
    }
  }, [map, route]);

  if (loadError) {
    return <div>Error loading maps: {loadError.message}</div>;
  }

  return (
    <>
      <div>
        {apiError && <div>Error: {apiError.msg}</div>}
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={route.decoded_route.points[0] || { lat: 0, lng: 0 }}
            zoom={10}
            onLoad={(map) => setMap(map)}
          />
        )}
      </div>
      <div className="details">
        <div className="measurement distance">
          <span className="text-main">
            {(route.distance / 1000).toFixed(2)}
          </span>
          <span className="text-muted">Km driven</span>
        </div>
        <div className="measurement time">
          <span className="text-main">
            {formatDrivingTime(route.start.time, route.end.time)}
          </span>
          <span className="text-muted">Driving time</span>
        </div>
        <div className="measurement estimated">
          <span className="text-main">
            {drivingTime !== null ? `${drivingTime}m` : "Calculating..."}
          </span>
          <span className="text-muted">Estimated</span>
        </div>
      </div>
    </>
  );
}

export default MapComponent;