import { NavLink } from "react-router-dom";
import { XIcon, SearchIcon, ClipboardListIcon } from "@heroicons/react/outline";

export default function UserSidebar({ mobileOpen, onClose }) {
  const base = "p-2 rounded transition font-medium";
  const active = "bg-blue-700";
  const hover = "hover:bg-blue-700";

  return (
    <>
      <aside className="hidden md:flex flex-col bg-blue-900 text-white w-64 min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-8">User Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="/user/search"
            className={({ isActive }) => `${base} ${isActive ? active : hover}`}
          >
            <div className="flex items-center gap-3">
              <SearchIcon className="w-5 h-5" />
              <span>Search Vehicle</span>
            </div>
          </NavLink>
          <NavLink
            to="/user/bookings"
            className={({ isActive }) => `${base} ${isActive ? active : hover}`}
          >
            <div className="flex items-center gap-3">
              <ClipboardListIcon className="w-5 h-5" />
              <span>My Bookings</span>
            </div>
          </NavLink>
        </nav>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative bg-blue-900 text-white w-64 p-4 flex flex-col z-50">
            <button
              className="absolute top-4 right-4"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-8">User Dashboard</h2>
            <nav className="flex flex-col gap-4">
              <NavLink
                to="/user/search"
                onClick={onClose}
                className={({ isActive }) => `${base} ${isActive ? active : hover}`}
              >
                <div className="flex items-center gap-3">
                  <SearchIcon className="w-5 h-5" />
                  <span>Search Vehicle</span>
                </div>
              </NavLink>
              <NavLink
                to="/user/bookings"
                onClick={onClose}
                className={({ isActive }) => `${base} ${isActive ? active : hover}`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardListIcon className="w-5 h-5" />
                  <span>My Bookings</span>
                </div>
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
