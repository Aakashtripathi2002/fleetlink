import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { RefreshIcon, TruckIcon, LocationMarkerIcon, ClockIcon, XIcon } from "@heroicons/react/outline";

function Bookings({ role }) {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(bookings.filter((b) => b._id !== bookingId));
      setMessage("Booking cancelled successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {role === "admin" ? "All Vehicle Bookings" : "My Bookings"}
      </h1>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <RefreshIcon className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      )}

      {/* Message */}
      {!loading && message && (
        <p className="text-center font-medium mb-4 text-green-600">{message}</p>
      )}

      {/* No Data */}
      {!loading && bookings.length === 0 && (
        <p className="text-center text-gray-500 font-medium">No bookings found</p>
      )}

      {/* Bookings List */}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6 relative"
            >
              {/* Cancel Button */}
              <button
                onClick={() => handleCancel(booking._id)}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                title="Cancel Booking"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* Vehicle Name */}
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <TruckIcon className="w-6 h-6" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-800">
                  {booking.vehicleId?.name || "Unknown Vehicle"}
                </h2>
              </div>

              {/* Route Info */}
              <div className="space-y-2 text-gray-600 font-medium">
                <p className="flex items-center gap-2">
                  <LocationMarkerIcon className="w-5 h-5 text-green-500" />
                  From: {booking.fromPincode}
                </p>
                <p className="flex items-center gap-2">
                  <LocationMarkerIcon className="w-5 h-5 text-red-500" />
                  To: {booking.toPincode}
                </p>
              </div>

              {/* Timing Info */}
              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 text-blue-500" />
                  Start: {moment(booking.startTime).format("DD MMM YYYY, HH:mm")}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 text-purple-500" />
                  End: {moment(booking.endTime).format("DD MMM YYYY, HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
