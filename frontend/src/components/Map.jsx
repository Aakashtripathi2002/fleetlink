import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Utils
import {
  getCoordinates,
  getRoute,
  formatKm,
  formatHours,
} from "../utils/map";

/** Auto-fit bounds when positions change */
function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 1) {
      map.fitBounds(positions);
    }
  }, [positions, map]);
  return null;
}

// Custom moving icon
const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

/**
 * MovingMarker component: animates along route
 */
function MovingMarker({ positions, speed = 50 }) {
  const [index, setIndex] = useState(0);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!positions || positions.length < 2) return;

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= positions.length) {
        clearInterval(interval);
      } else {
        setIndex(current);
        if (markerRef.current) {
          markerRef.current.setLatLng(positions[current]);
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [positions, speed]);

  if (positions.length === 0) return null;

  return (
    <Marker
      position={positions[index]}
      icon={vehicleIcon}
      ref={markerRef}
    ></Marker>
  );
}

/**
 * Main Map Component
 */
export default function Map({
  fromPincode,
  toPincode,
  overrideCoordinates,
  overrideDistance,
  overrideDuration,
  className = "mt-4",
  style,
}) {
  const [coords, setCoords] = useState([]);
  const [distanceMeters, setDistanceMeters] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch route if override not provided
  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      if (!fromPincode || !toPincode) return;

      setLoading(true);
      setErrorMsg("");
      setCoords([]);
      setDistanceMeters(null);
      setDurationSeconds(null);

      try {
        const [from, to] = await Promise.all([
          getCoordinates(fromPincode),
          getCoordinates(toPincode),
        ]);

        const same = from.lat === to.lat && from.lon === to.lon;

        if (same) {
          if (!cancelled) {
            setCoords([[from.lat, from.lon]]);
            setDistanceMeters(0);
            setDurationSeconds(0);
          }
          return;
        }

        const route = await getRoute({
          fromLat: from.lat,
          fromLon: from.lon,
          toLat: to.lat,
          toLon: to.lon,
        });

        if (!cancelled) {
          setCoords(route.coordinates || []);
          setDistanceMeters(route.distanceMeters ?? null);
          setDurationSeconds(route.durationSeconds ?? null);
        }
      } catch (err) {
        console.error("Route load error:", err);
        if (!cancelled) setErrorMsg("Could not load route.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!overrideCoordinates) {
      loadRoute();
    } else {
      setCoords(overrideCoordinates);
      if (overrideDistance != null) setDistanceMeters(overrideDistance);
      if (overrideDuration != null) setDurationSeconds(overrideDuration);
    }

    return () => {
      cancelled = true;
    };
  }, [fromPincode, toPincode, overrideCoordinates, overrideDistance, overrideDuration]);

  const shownDistance = overrideDistance ?? distanceMeters;
  const shownDuration = overrideDuration ?? durationSeconds;

  const center = useMemo(() => {
    if (overrideCoordinates?.length) return overrideCoordinates[0];
    if (coords?.length) return coords[0];
    return [22.9734, 78.6569];
  }, [overrideCoordinates, coords]);

  const positions = overrideCoordinates ?? coords;

  return (
    <div className={className} style={style}>
      <h4 className="text-lg font-bold mb-2">
        Route Map{" "}
        {(shownDistance != null || shownDuration != null) && (
          <span className="text-sm font-normal text-gray-600">
            (
            {shownDistance != null ? formatKm(shownDistance) : ""}
            {shownDistance != null && shownDuration != null ? ", " : ""}
            {shownDuration != null ? formatHours(shownDuration) : ""}
            )
          </span>
        )}
      </h4>

      <MapContainer
        center={center}
        zoom={6}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {positions.length > 1 && (
          <>
            <Polyline positions={positions} color="blue" weight={4} />
            <MovingMarker positions={positions} speed={100} />
            <FitBounds positions={positions} />
          </>
        )}

        {positions.length === 1 && (
          <CircleMarker center={positions[0]} radius={5}>
            <Tooltip>Location</Tooltip>
          </CircleMarker>
        )}
      </MapContainer>

      {loading && <p className="mt-2 text-sm text-gray-500">Loading route…</p>}
      {errorMsg && <p className="mt-2 text-sm text-red-500">{errorMsg}</p>}
    </div>
  );
}
