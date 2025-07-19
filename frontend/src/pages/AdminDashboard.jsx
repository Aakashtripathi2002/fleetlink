import { Routes, Route,Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import VehicleList from "../components/VehicleList";
import AddVehicle from "../components/AddVehicle";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

import AdminBookings from "../components/AdminBookings";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
  
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(true)}
      >
        <MenuIcon className="w-6 h-6" />
      </button>

     
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      
      <div className="flex-1 bg-gray-100 min-h-screen pt-20 md:pt-0 p-4 md:p-6">
        <Routes>
          <Route index element={<Navigate to="vehicles" replace />} />
          <Route path="vehicles" element={<VehicleList />} />
          <Route path="add-vehicle" element={<AddVehicle inDashboard />} />
           <Route path="bookings" element={<AdminBookings role="admin" />} />
        </Routes>
      </div>
    </div>
  );
}
