// components/AddVehicle.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AddVehicle({ inDashboard = false }) {
  const [formData, setFormData] = useState({ name: "", capacityKg: "", tyres: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/vehicles", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Vehicle added successfully!");
      setFormData({ name: "", capacityKg: "", tyres: "" });
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to add vehicle.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Layout decisions
  const outerClasses = inDashboard
    ? "relative w-full" // embedded
    : "flex items-center justify-center min-h-screen bg-gray-100 relative"; // standalone page

  const cardClasses = inDashboard
    ? "bg-white shadow-lg rounded-lg p-8 max-w-lg w-full mx-auto"
    : "bg-white shadow-lg rounded-lg p-8 max-w-lg w-full";

  return (
    <div className={outerClasses}>
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <span className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className={cardClasses}>
        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Vehicle</h3>

        <form onSubmit={handleSubmit} className="space-y-4 opacity-100">
          {/* Vehicle Name */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Vehicle Name</label>
            <input
              type="text"
              placeholder="Enter vehicle name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              disabled={loading}
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Capacity (KG)</label>
            <input
              type="number"
              placeholder="Enter capacity in KG"
              value={formData.capacityKg}
              onChange={(e) => setFormData({ ...formData, capacityKg: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              disabled={loading}
            />
          </div>

          {/* Tyres */}
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Number of Tyres</label>
            <input
              type="number"
              placeholder="Enter number of tyres"
              value={formData.tyres}
              onChange={(e) => setFormData({ ...formData, tyres: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition duration-200 flex justify-center items-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Add Vehicle"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;
