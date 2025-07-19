import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import {
  RefreshIcon,
  TruckIcon,
  LocationMarkerIcon,
  ClockIcon,
  XIcon,
} from "@heroicons/react/outline";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // For modal
  const [cancelLoading, setCancelLoading] = useState(false);
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);


  const confirmCancel = (booking) => setSelectedBooking(booking);

  const handleCancel = async () => {
    if (!selectedBooking) return;
    setCancelLoading(true);
    try {
      await axios.delete(`${API_BASE}/bookings/${selectedBooking._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
      toast.success("✅ Booking cancelled successfully");
      setSelectedBooking(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatus = (endTime) => (new Date(endTime) < new Date() ? "completed" : "active");

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Bookings</h1>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <RefreshIcon className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <p className="text-center text-gray-500 font-medium">No bookings found.</p>
      )}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const status = getStatus(booking.endTime);
            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 relative"
              >
                {status === "active" && (
                  <button
                    onClick={() => confirmCancel(booking)}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    title="Cancel Booking"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                    <TruckIcon className="w-6 h-6" />
                  </div>
                  <h3 className="ml-4 text-lg font-bold text-gray-800">
                    {booking.vehicleId?.name || "Unknown Vehicle"}
                  </h3>
                </div>
                <StatusBadge status={status} />
                <div className="mt-4 space-y-2 text-gray-600 font-medium">
                  <p className="flex items-center gap-2">
                    <LocationMarkerIcon className="w-5 h-5 text-green-500" />
                    From: {booking.fromPincode}
                  </p>
                  <p className="flex items-center gap-2">
                    <LocationMarkerIcon className="w-5 h-5 text-red-500" />
                    To: {booking.toPincode}
                  </p>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-blue-500" />
                    Start: {moment(booking.startTime).format("DD MMM YYYY, HH:mm")}
                  </p>
                  <p className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-purple-500" />
                    End: {moment(booking.endTime).format("DD MMM YYYY, HH:mm")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    {selectedBooking && (
  <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Are you sure you want to cancel this booking?
      </h3>
      <p className="text-gray-600 mb-6">{selectedBooking.vehicleId?.name}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setSelectedBooking(null)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
        >
          No
        </button>
        <button
          onClick={handleCancel}
          disabled={cancelLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function StatusBadge({ status }) {
  const cls =
    status === "completed"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  const label = status === "completed" ? "Completed" : "Active";
  return (
    <span
      className={`inline-block text-xs font-semibold uppercase px-2 py-1 rounded ${cls}`}
    >
      {label}
    </span>
  );
}
