import React, { useState, useEffect } from "react";
import { getCoordinates, getRoute } from "../utils/map";
import axios from "axios";
import Map from "./Map";
import toast from "react-hot-toast"; // ✅ Import toast

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function SearchVehicle() {
  const [formData, setFormData] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(""); // ✅ Holds vehicleId being booked
  const [user, setUser] = useState(null);

  const [routeInfo, setRouteInfo] = useState({
    coordinates: [],
    distance: null,
    duration: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setVehicles([]);

    try {
      const { data } = await axios.get(`${API_BASE}/api/vehicles/available`, {
        params: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setVehicles(data.vehicles || []);
      if (!data.vehicles?.length) toast.error("No vehicles available");

      const from = await getCoordinates(formData.fromPincode);
      const to = await getCoordinates(formData.toPincode);
      const route = await getRoute({
        fromLat: from.lat,
        fromLon: from.lon,
        toLat: to.lat,
        toLon: to.lon,
      });

      setRouteInfo({
        coordinates: route.coordinates,
        distance: route.distanceMeters,
        duration: route.durationSeconds,
      });
    } catch (err) {
      console.error("[SEARCH ERROR]", err);
      toast.error(err.response?.data?.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  // ✅ Handle Booking
  const handleBook = async (vehicleId) => {
    if (!formData.fromPincode || !formData.toPincode || !formData.startTime) {
      toast.error("Please fill all fields before booking.");
      return;
    }

    setBookingLoading(vehicleId);

    try {
      const payload = {
        vehicleId,
        fromPincode: formData.fromPincode,
        toPincode: formData.toPincode,
        startTime: new Date(formData.startTime).toISOString(),
      };

      await axios.post(`${API_BASE}/api/bookings`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("✅ Booking successful!");
      setVehicles([]);
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      toast.error(backendMsg ? `Booking failed: ${backendMsg}` : "Booking failed");
    } finally {
      setBookingLoading("");
    }
  };

  const formatKm = (meters) => (!meters ? "" : `${(meters / 1000).toFixed(1)} km`);
  const formatDuration = (seconds) =>
    !seconds ? "" : seconds < 3600 ? `${Math.round(seconds / 60)} min` : `${(seconds / 3600).toFixed(1)} h`;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-center">Search Vehicles</h3>

      {!user ? (
        <p className="text-red-500 text-center">User not logged in. Please log in.</p>
      ) : (
        <>
          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <input
              type="number"
              placeholder="Capacity Required (KG)"
              value={formData.capacityRequired}
              onChange={(e) => setFormData({ ...formData, capacityRequired: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="From Pincode"
              value={formData.fromPincode}
              onChange={(e) => setFormData({ ...formData, fromPincode: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="To Pincode"
              value={formData.toPincode}
              onChange={(e) => setFormData({ ...formData, toPincode: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 col-span-full"
            >
              {searchLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                "Search Vehicles"
              )}
            </button>
          </form>

          {/* Results */}
          {vehicles.length > 0 && (
            <div>
              <h4 className="text-xl font-bold mb-4 text-gray-800">
                Available Vehicles{" "}
                {routeInfo.distance && (
                  <span className="ml-2 text-gray-500 text-sm">
                    ({formatKm(routeInfo.distance)}, {formatDuration(routeInfo.duration)})
                  </span>
                )}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                    <p className="font-semibold text-lg">{vehicle.name}</p>
                    <p className="text-gray-600">Capacity: {vehicle.capacityKg} KG</p>
                    <p className="text-gray-600">Tyres: {vehicle.tyres}</p>
                    <button
                      onClick={() => handleBook(vehicle._id)}
                      disabled={bookingLoading === vehicle._id}
                      className="bg-green-600 text-white w-full py-2 mt-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {bookingLoading === vehicle._id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Booking...
                        </span>
                      ) : (
                        "Book Now"
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="mt-6">
                <Map
                  fromPincode={formData.fromPincode}
                  toPincode={formData.toPincode}
                  overrideCoordinates={routeInfo.coordinates}
                  overrideDistance={routeInfo.distance}
                  overrideDuration={routeInfo.duration}
                  showVehicleAnimation={true}
                  darkMode={false}
                  heightClass="h-64 md:h-96 lg:h-[450px]"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
