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
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        
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
    <Toaster
  position="top-right"
  toastOptions={{
    success: {
      style: {
        background: '#4CAF50',
        color: '#fff',
        fontSize: '1rem',
        padding: '16px 24px',
        minWidth: '280px',
        borderRadius: '8px',
      },
    },
    error: {
      style: {
        background: '#F44336',
        color: '#fff',
        fontSize: '1rem',
        padding: '16px 24px',
        minWidth: '280px',
        borderRadius: '8px',
      },
    },
    style: {
      fontSize: '1rem',
      padding: '16px 24px',
      minWidth: '280px',
      borderRadius: '8px',
    },
  }}
/>

    </Router>
  );
}

export default App;
