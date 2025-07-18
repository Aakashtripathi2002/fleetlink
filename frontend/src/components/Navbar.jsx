import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

function Navbar({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    setMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-2xl font-bold tracking-wide hover:text-yellow-300 transition duration-200"
        >
          FleetLink
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-white">
                Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-white hover:text-yellow-300 font-medium transition duration-200"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 shadow-md transition duration-200"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Account Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
            aria-label="Open account menu"
          >
            {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Account Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 text-white shadow-lg">
          <div className="flex flex-col space-y-4 px-4 py-6">
            {user ? (
              <>
                <span>
                  Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-yellow-300 font-medium"
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 shadow-md transition duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
