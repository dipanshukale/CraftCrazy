import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { useAuth } from "../contexts/AuthContext";

interface AdminData {
  name: string;
  role: string;
  avatar: string;
}

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [notifications, setNotifications] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);


  // Search states
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [activeSearch, setActiveSearch] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch admin profile
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/profile")
      .then((res) => setAdmin(res.data))
      .catch(() =>
        setAdmin({
          name: "Admin User",
          role: "Dashboard Manager",
          avatar: "http://localhost:5173/logo.png",
        })
      );
  }, []);

  // Debounced Search
  const fetchSearch = useRef(
    debounce(async (value: string) => {
      if (!value.trim()) {
        setResults([]);
        return;
      }

      const res = await axios.get(`https://node-test-1-34fs.onrender.com/api/products?q=${value}`);
      setResults(res.data);
    }, 400)
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    fetchSearch(e.target.value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setShowDropdown(false);
        setActiveSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const handleLogout = () => {
    logout();
    navigate("/admin-login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-[#2a0a4b] shadow-md backdrop-blur-lg">
      <div className="flex justify-between items-center px-4 py-3">

        {/* LEFT: Sidebar Toggle */}
        <button onClick={toggleSidebar} className="md:hidden p-2 text-[#2a0a4b]">
          <Menu size={22} />
        </button>

        {/* CENTER: Search */}
        <div className="relative hidden md:block flex-1 max-w-sm mx-auto">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={query}
            onChange={handleSearchChange}
            onFocus={() => setActiveSearch(true)}
            type="text"
            placeholder="Search to check if a user, order, or product exists…"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-[#2a0a4b] placeholder:text-sm"
          />

          {/* Search Results Dropdown */}
          {activeSearch && results.length > 0 && (
            <div className="absolute bg-white top-12 w-full border rounded-lg shadow-md max-h-60 overflow-auto z-50">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 flex justify-between cursor-pointer"
                  onClick={() => {
                    navigate(`/details/${item._id}?type=${item.type}`);
                    setQuery("");
                    setResults([]);
                    setActiveSearch(false);
                  }}
                >
                  <span>{item.name}</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 text-white rounded-full">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Notifications + Profile */}
        <div ref={dropdownRef} className="flex gap-4 items-center ml-auto">

          {/* Profile Dropdown */}
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 border px-3 py-1 rounded-full cursor-pointer"
          >
            <img src={admin?.avatar} className="w-8 h-8 rounded-full" />
            <span>{admin?.name}</span>
            <ChevronDown size={15} />
          </div>

          {showDropdown && (
            <div className="absolute top-14 right-4 bg-white shadow-md border rounded-lg w-44 py-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                <LogOut className="inline mr-2" size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
