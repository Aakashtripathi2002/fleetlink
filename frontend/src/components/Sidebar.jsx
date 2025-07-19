import { Link } from "react-router-dom";
import { XIcon } from "@heroicons/react/outline";

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <div className="hidden md:flex flex-col bg-blue-900 text-white w-64 min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/dashboard/vehicles" className="hover:bg-blue-700 p-2 rounded">
            Vehicle List
          </Link>
          <Link to="/dashboard/add-vehicle" className="hover:bg-blue-700 p-2 rounded">
            Add Vehicle
          </Link>
          <Link to="/dashboard/bookings" className="hover:bg-blue-700 p-2 rounded">
            Bookings
          </Link>
        </nav>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          ></div>
          <div className="relative bg-blue-900 text-white w-64 p-4 flex flex-col z-50">
            <button
              className="absolute top-4 right-4"
              onClick={onClose}
            >
              <XIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
            <nav className="flex flex-col gap-4">
              <Link
                to="/dashboard/vehicles"
                onClick={onClose}
                className="hover:bg-blue-700 p-2 rounded"
              >
                Vehicle List
              </Link>
              <Link
                to="/dashboard/add-vehicle"
                onClick={onClose}
                className="hover:bg-blue-700 p-2 rounded"
              >
                Add Vehicle
              </Link>
              <Link
                to="/dashboard/bookings"
                onClick={onClose}
                className="hover:bg-blue-700 p-2 rounded"
              >
                Bookings
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
