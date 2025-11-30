import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Gift,
  Sparkles,
} from "lucide-react";
import { useCart } from "../AuthContext/CartContext";
import { useAuth } from "../AuthContext/AuthContext";
import { allProducts } from "../Data/AllProduct";

interface SubLink {
  name: string;
  href: string;
}

interface NavLink {
  name: string;
  href?: string;
  submenu?: SubLink[];
}

interface NavbarProps {
  setCartOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCartOpen }) => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ name: string; href: string }[]>([]);
  const [userDropdown, setUserDropdown] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  useEffect(() => {
    if (user) setUserData({ name: user.name, email: user.email });
  }, [user]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/login");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    if (value.trim() === "") return setResult([]);
    const filtered = allProducts.filter((p) => p.name.toLowerCase().includes(value));
    setResult(filtered);
  };

  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdown(idx);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdown(null), 250);
  };

  const links: NavLink[] = [
    { name: "New & Best Sellers", href: "/newarrivals" },
    {
      name: "Customized Hampers",
      submenu: [
        { name: "Birthday Hampers", href: "/BirthdayHamper" },
        { name: "Wedding Hampers", href: "/wedding" },
        { name: "Corporate Hampers", href: "/corporate" },
      ],
    },
    {
      name: "Photo Frames",
      submenu: [
        { name: "Wooden Frames", href: "/wooden" },
        { name: "Glass Frames", href: "/glass" },
        { name: "Resin Photo Frames", href: "/resin" },
      ],
    },
    {
      name: "Accessories",
      submenu: [
        { name: "Women Accessories", href: "/womenAss" },
        { name: "Keychains", href: "/keychain" },
        { name: "Leather Wallet", href: "/wallet" },
        { name: "Bracelets", href: "/bracelet" },
        { name: "Tote Bags", href: "/tote" },
      ],
    },
    {
      name: "Resin Art",
      submenu: [
        { name: "Resin Jewelry", href: "/resinJwell" },
        { name: "Resin Keychains", href: "/resinKeychain" },
        { name: "Resin Wall Clocks", href: "/resinclock" },
        { name: "Resin Name Plates", href: "/resinNameplate" },
        { name: "Resin Photo Frames", href: "/resinframe" },
        { name: "Resin Coasters Set", href: "/resincoasters" },
        { name: "Resin Pooja Thale", href: "/resinthale" },
      ],
    },
    {
      name: "Wedding Special",
      submenu: [
        { name: "Engagement Tray", href: "/Tray" },
        { name: "Haldi Platter", href: "/HaldiPlatter" },
        { name: "Varmala Preservation", href: "/varmala" },
      ],
    },
    {
      name: "Festival",
      submenu: [
        { name: "Diwali Hampers", href: "/diwali" },
        { name: "Christmas Specials", href: "/christmas" },
        { name: "Holi Kits", href: "/Holi" },
        { name: "Rakhi", href: "/rakhi" },
      ],
    },
    { name: "Customized", href: "/customerdemand" },
    { name: "About", href: "/aboutus" },
    { name: "Contact", href: "/contactus" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#d9c6a5]/40 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 sm:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <Gift className="w-7 h-7 text-[#7f5539]" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 animate-ping" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#7f5539]">
            Crafti<span className="text-amber-500">Crazy</span>
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Find the perfect handcrafted gift..."
              className="w-full rounded-full py-2.5 pl-5 pr-12 border text-[#432818] shadow-sm placeholder-gray-400 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7f5539] cursor-pointer" />
            {result.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-y-auto max-h-56 z-50">
                {result.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={() => {
                      setQuery("");
                      setResult([]);
                    }}
                    className="block px-4 py-2 hover:bg-amber-50 text-gray-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6">
          {userData ? (
            <div className="relative">
              <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="hover:scale-110 cursor-pointer transition-transform"
              tabIndex={-1}
            >
              <User size={22} className="text-[#7f5539]" />
            </button>

              {userDropdown && (
                <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg w-56 border border-[#e6ccb2] z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="font-semibold text-black">{userData.name}</p>
                    <p className="text-sm text-black">{userData.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-amber-50 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 font-medium text-[#7f5539] hover:text-amber-600 transition"
            >
              <User size={18} /> Login
            </Link>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="relative hover:scale-110 transition-transform cursor-pointer"
          >
            <ShoppingCart size={22} className="text-[#7f5539] cusrsor-pointer" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs font-bold rounded-full px-1">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => setCartOpen(true)} className="relative">
            <ShoppingCart size={24} className="text-[#7f5539]" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-amber-400 text-black text-xs font-bold rounded-full px-1">
                {cart.length}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} className="text-[#7f5539]">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex justify-center gap-8 font-medium text-[#432818] bg-gradient-to-r from-[#f7ede2] via-[#f8f5f2] to-[#f7ede2] py-2">
        {links.map((link, idx) => (
          <div
            key={idx}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <Link
              to={link.href ?? "#"}
              className="flex items-center gap-1 hover:text-amber-600 transition"
            >
              {link.name}
              {link.submenu && <ChevronDown size={14} />}
            </Link>
            {link.submenu && dropdown === idx && (
              <div className="absolute bg-white/95 rounded-lg shadow-md mt-2 py-2 border border-[#e6ccb2] w-56 z-50">
                {link.submenu.map((sublink, sIdx) => (
                  <Link
                    key={sIdx}
                    to={sublink.href}
                    className="block px-4 py-2 hover:bg-amber-50 text-gray-700 transition"
                  >
                    {sublink.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Nav */}
      {open && (
        <nav className="md:hidden bg-[#fffaf5] shadow-md px-6 py-4 space-y-2 animate-slide-down">
          {links.map((link, idx) => (
            <div key={idx}>
              {link.submenu ? (
                <>
                  <button
                    onClick={() =>
                      setMobileDropdown(mobileDropdown === idx ? null : idx)
                    }
                    className="flex justify-between items-center w-full py-2 text-[#432818] font-medium"
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`transform transition-transform ${mobileDropdown === idx ? "rotate-180" : ""
                        }`}
                      size={16}
                    />
                  </button>
                  {mobileDropdown === idx && (
                    <div className="pl-4 mt-1 space-y-1">
                      {link.submenu.map((sublink, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sublink.href}
                          className="block py-1 text-gray-700 hover:text-[#7f5539] transition"
                          onClick={() => setOpen(false)}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.href ?? "#"}
                  className="block py-2 text-[#432818] font-medium border-b border-gray-200 hover:bg-amber-50 transition"
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
