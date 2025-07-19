// src/utils/map.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export async function getCoordinates(pincode) {
  if (!pincode) throw new Error("Pincode required");

  const cacheKey = `geo:${pincode}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const { data } = await axios.get(`${API_BASE}/geocode`, {
    params: { pincode },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (!data?.lat || !data?.lon) {
    throw new Error(`Could not geocode pincode ${pincode}`);
  }

  sessionStorage.setItem(cacheKey, JSON.stringify({ lat: data.lat, lon: data.lon }));
  return { lat: data.lat, lon: data.lon };
}

export async function getRoute({ fromLat, fromLon, toLat, toLon }) {
  if (
    fromLat == null ||
    fromLon == null ||
    toLat == null ||
    toLon == null
  ) {
    throw new Error("All coordinates required for routing");
  }

  const { data } = await axios.get(`${API_BASE}/route`, {
    params: { fromLat, fromLon, toLat, toLon },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

 
  let coordinates = data.coordinates;
  if (!coordinates && data.polyline) {
    coordinates = decodePolyline(data.polyline); 
  }
  if (!coordinates) throw new Error("Route missing coordinates");

  return {
    coordinates, 
    distanceMeters: data.distanceMeters,
    durationSeconds: data.durationSeconds,
  };
}

function decodePolyline(str, precision = 5) {
  let index = 0,
    lat = 0,
    lon = 0,
    coordinates = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change,
    factor = Math.pow(10, precision);

  while (index < str.length) {
    shift = 0;
    result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    latitude_change = (result & 1) ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    longitude_change = (result & 1) ? ~(result >> 1) : result >> 1;

    lat += latitude_change;
    lon += longitude_change;

    coordinates.push([lat / factor, lon / factor]);
  }
  return coordinates;
}

export function formatKm(meters) {
  if (meters == null) return "";
  return `${(meters / 1000).toFixed(1)} km`;
}
export function formatHours(seconds) {
  if (seconds == null) return "";
  const hrs = seconds / 3600;
  if (hrs < 1) {
    const mins = Math.round(seconds / 60);
    return `${mins} min`;
  }
  return `${hrs.toFixed(1)} h`;
}
