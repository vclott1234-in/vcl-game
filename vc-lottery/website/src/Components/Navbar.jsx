import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `block px-4 py-3 rounded transition ${
      isActive ? "bg-blue-500 text-white" : "hover:bg-orange-400/30 text-white"
    }`;

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#e4552b] min-h-screen text-white flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-orange-300">
          <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center font-semibold">
            Img
          </div>
          <div className="ml-3 text-lg font-semibold">VC KHATA</div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3">
          <NavLink to="/" end className={navClass}>
            👥 Users
          </NavLink>

          <NavLink to="/add-user" className={navClass}>
            ➕ Add User
          </NavLink>

          <NavLink to="/winners" className={navClass}>
            🏆 Winners
          </NavLink>

          <NavLink to="/schedule" className={navClass}>
            📅 Schedule
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage users and profiles</p>
          </div>

          <div className="relative" ref={dropdownRef}>
            <img
              src="/vite.svg"
              alt="Profile"
              onClick={() => setDropdownOpen((p) => !p)}
              className="w-10 h-10 rounded-full border shadow cursor-pointer"
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded border text-gray-700 z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
