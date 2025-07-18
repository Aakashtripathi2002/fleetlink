import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import UserSidebar from "../components/UserSidebar";
import UserSearchPage from "./UserSearchPage"; 
import UserBookings from "../components/UserBookings";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
          <p className="text-red-500 font-medium">
            User not logged in. Please log in again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex pt-20"> {/* space for global fixed navbar */}
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-20 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(true)}
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <UserSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <main className="flex-1 min-h-screen bg-gray-100 p-4 md:p-6">
        {/* Welcome header (desktop) */}
        <div className="hidden md:block mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h2>
          <p className="text-gray-600">Role: {user.role}</p>
        </div>

        <Routes>
          {/* default redirect when at /user */}
          <Route index element={<Navigate to="search" replace />} />
          <Route path="search" element={<UserSearchPage user={user} />} />
          <Route path="bookings" element={<UserBookings user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default UserDashboard;
