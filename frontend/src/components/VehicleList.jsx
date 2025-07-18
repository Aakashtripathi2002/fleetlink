import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  TruckIcon,
  ScaleIcon,
  RefreshIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";

const API_BASE = "http://localhost:5000"; // Replace with your backend URL

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/vehicles/my-vehicles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicles(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch vehicles");
      toast.error(error.response?.data?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Delete flow ---------------- */
  const handleDeleteClick = (id) => {
    setDeleteVehicleId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteVehicleId) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/vehicles/${deleteVehicleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicles((prev) => prev.filter((v) => v._id !== deleteVehicleId));
      toast.success("Vehicle deleted.");
      setShowDeleteModal(false);
      setDeleteVehicleId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ---------------- Edit flow ---------------- */
  const handleEditClick = (vehicle) => {
    setEditVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editVehicle?.name || !editVehicle?.capacityKg || !editVehicle?.tyres) {
      toast.error("All fields are required");
      return;
    }
    setUpdateLoading(true);
    try {
      await axios.put(`${API_BASE}/api/vehicles/${editVehicle._id}`, editVehicle, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicles((prev) =>
        prev.map((v) => (v._id === editVehicle._id ? editVehicle : v))
      );
      toast.success("Vehicle updated.");
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-7xl bg-transparent">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
        My Vehicles
      </h1>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <RefreshIcon className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      )}

      {!loading && message && (
        <p className="text-center text-red-500 font-medium py-4">{message}</p>
      )}

      {!loading && vehicles.length === 0 && !message && (
        <div className="text-center py-10">
          <p className="text-gray-500 font-medium mb-4">No vehicles found</p>
        </div>
      )}

      {!loading && vehicles.length > 0 && (
        <div className="hidden xl:block overflow-x-auto bg-white shadow rounded-lg mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <Th>Name</Th>
                <Th>Capacity (KG)</Th>
                <Th>Tyres</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50">
                  <Td>
                    <div className="flex items-center gap-2">
                      <TruckIcon className="w-5 h-5 text-blue-600" />
                      {v.name}
                    </div>
                  </Td>
                  <Td>{v.capacityKg}</Td>
                  <Td>{v.tyres}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(v)}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(v._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Edit Modal (blur) ---------- */}
      {showEditModal && editVehicle && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
            <input
              type="text"
              placeholder="Name"
              value={editVehicle.name}
              onChange={(e) =>
                setEditVehicle({ ...editVehicle, name: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Capacity (KG)"
              value={editVehicle.capacityKg}
              onChange={(e) =>
                setEditVehicle({ ...editVehicle, capacityKg: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Tyres"
              value={editVehicle.tyres}
              onChange={(e) =>
                setEditVehicle({ ...editVehicle, tyres: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Delete Modal (blur) ---------- */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Vehicle</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Table cell helpers ---------- */
function Th({ children }) {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
    >
      {children}
    </th>
  );
}

function Td({ children }) {
  return <td className="px-6 py-4 text-sm text-gray-800">{children}</td>;
}
