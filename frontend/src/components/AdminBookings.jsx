import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import {
  RefreshIcon,
  TruckIcon,
  UserIcon,
  LocationMarkerIcon,
  ClockIcon,
  XIcon,
} from "@heroicons/react/outline";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all bookings for admin-owned vehicles
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Group by customer
  const grouped = useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      const customer = b.customerId;
      const key = customer?._id || "unknown";
      if (!map.has(key)) {
        map.set(key, {
          customer,
          items: [],
        });
      }
      map.get(key).items.push(b);
    });
    return Array.from(map.values());
  }, [bookings]);

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setMessage("Booking cancelled successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getStatus = (endTime) => (new Date(endTime) < new Date() ? "completed" : "active");

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Vehicle Bookings</h1>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <RefreshIcon className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      )}

      {/* Message */}
      {!loading && message && (
        <p className="text-center font-medium mb-4 text-green-600">{message}</p>
      )}

      {/* Empty */}
      {!loading && bookings.length === 0 && (
        <p className="text-center text-gray-500 font-medium">No bookings found.</p>
      )}

      {/* Grouped by customer */}
      {!loading &&
        grouped.map(({ customer, items }) => (
          <div key={customer?._id || "unknown"} className="mb-10">
            {/* Customer header */}
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {customer?.name || "Unknown User"}{" "}
                <span className="text-sm text-gray-500">
                  {customer?.email ? `(${customer.email})` : ""}
                </span>
              </h2>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((booking) => {
                const status = getStatus(booking.endTime);
                return (
                  <div
                    key={booking._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 relative"
                  >
                    {/* Cancel */}
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      title="Cancel Booking"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>

                    {/* Vehicle */}
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                        <TruckIcon className="w-6 h-6" />
                      </div>
                      <h3 className="ml-4 text-lg font-bold text-gray-800">
                        {booking.vehicleId?.name || "Unknown Vehicle"}
                      </h3>
                    </div>

                    {/* Status */}
                    <StatusBadge status={status} />

                    {/* Route */}
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

                    {/* Times */}
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
          </div>
        ))}
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
