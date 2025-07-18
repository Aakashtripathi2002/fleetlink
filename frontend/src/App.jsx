import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserBookings from "./components/UserBookings";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Admin dashboard + nested routes (vehicles, add, bookings, etc.) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User area */}
        <Route
  path="/user/*"
  element={
    <ProtectedRoute user={user} role="user">
      <UserDashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute user={user} role="user">
              <UserBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
