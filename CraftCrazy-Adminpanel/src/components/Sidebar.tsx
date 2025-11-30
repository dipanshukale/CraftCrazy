import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Package,
  Users,
  ClipboardList,
  MessageSquare,
  Star,
  Menu,
  ArrowLeftCircle,
  ArrowRightCircle,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isSidebarOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  isCollapsed,
  toggleSidebar,
  toggleCollapse,
}) => {
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    dashboard: true,
    products: false,
    orders: false,
    customers: false,
    invoices: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // ✅ FIX: precise active path check
  const isActive = (path: string) => location.pathname === path;

  const menuItemClass = (path: string) =>
    `relative flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all duration-300 ${isActive(path)
      ? "bg-gradient-to-r from-[#845EF7] to-[#B197FC] text-white shadow-[0_0_15px_#845EF760]"
      : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  const sectionButtonClass =
    "w-full flex justify-between items-center px-5 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300";

  // Auto open sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isSidebarOpen) toggleSidebar();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 text-white bg-[#7b2ff7] rounded-md shadow-md md:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className={`${isCollapsed ? "w-20" : "w-64"
              } h-screen fixed left-0 top-0 z-50 flex flex-col
            bg-gradient-to-b from-[#10002b]/90 to-[#240046]/90
            backdrop-blur-xl border-r border-r-white/10 text-gray-200 transition-all duration-300`}
          >
            {/* Header */}
            <div className="p-5 flex justify-between items-center border-b border-white/10">
              {!isCollapsed && (
                <h1 className="text-xl font-semibold bg-gradient-to-r from-[#B197FC] to-[#845EF7] bg-clip-text text-transparent tracking-wide">
                  Crafti<span className="text-white">Crazy</span>
                </h1>
              )}
              <button
                onClick={toggleCollapse}
                className="text-gray-400 hover:text-white transition-all"
              >
                {isCollapsed ? (
                  <ArrowRightCircle size={22} />
                ) : (
                  <ArrowLeftCircle size={22} />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-4 px-2 space-y-2 pb-20 overflow-y-visible">
              {/* Dashboard */}
              <div>
                <button
                  onClick={() => toggleMenu("dashboard")}
                  className={`${sectionButtonClass} ${isCollapsed ? "justify-center px-0" : ""
                    }`}
                >
                  <div
                    className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
                      }`}
                  >
                    <Home size={18} />
                    {!isCollapsed && <span>Dashboard</span>}
                  </div>
                  {!isCollapsed &&
                    (openMenus.dashboard ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </button>

                <AnimatePresence initial={false}>
                  {openMenus.dashboard && !isCollapsed && (
                    <motion.div
                      key="dashboard-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pl-10 flex flex-col mt-2 space-y-1 overflow-hidden"
                    >
                      <Link to="/dashboard" className={menuItemClass("/dashboard")}>
                        Overview
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Products */}
              <div>
                <button
                  onClick={() => toggleMenu("products")}
                  className={`${sectionButtonClass} ${isCollapsed ? "justify-center px-0" : ""
                    }`}
                >
                  <div
                    className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
                      }`}
                  >
                    <Package size={18} />
                    {!isCollapsed && <span>Products</span>}
                  </div>
                  {!isCollapsed &&
                    (openMenus.products ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </button>

                <AnimatePresence initial={false}>
                  {openMenus.products && !isCollapsed && (
                    <motion.div
                      key="products-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pl-10 flex flex-col mt-2 space-y-1 overflow-hidden"
                    >
                      <Link to="/allproducts" className={menuItemClass("/allproducts")}>
                        All Products
                      </Link>
                      <Link to="/addproducts" className={menuItemClass("/addproducts")}>
                        Add Product
                      </Link>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Orders */}
              <div>
                <button
                  onClick={() => toggleMenu("orders")}
                  className={`${sectionButtonClass} ${isCollapsed ? "justify-center px-0" : ""
                    }`}
                >
                  <div
                    className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
                      }`}
                  >
                    <ClipboardList size={18} />
                    {!isCollapsed && <span>Orders</span>}
                  </div>
                  {!isCollapsed &&
                    (openMenus.orders ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </button>

                <AnimatePresence initial={false}>
                  {openMenus.orders && !isCollapsed && (
                    <motion.div
                      key="orders-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pl-10 flex flex-col mt-2 space-y-1 overflow-hidden"
                    >
                      <Link to="/orders" className={menuItemClass("/orders")}>
                        All Orders
                      </Link>
                       <Link to="/demand" className={menuItemClass("/demand")}>
                        Customer Demand
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ✅ Invoices Section with toggle */}
              <div>
                <button
                  onClick={() => toggleMenu("invoices")}
                  className={`${sectionButtonClass} ${isCollapsed ? "justify-center px-0" : ""
                    }`}
                >
                  <div
                    className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
                      }`}
                  >
                    <FileText size={18} />
                    {!isCollapsed && <span>Invoices</span>}
                  </div>
                  {!isCollapsed &&
                    (openMenus.invoices ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </button>

                <AnimatePresence initial={false}>
                  {openMenus.invoices && !isCollapsed && (
                    <motion.div
                      key="invoices-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pl-10 flex flex-col mt-2 space-y-1 overflow-hidden"
                    >
                      <Link to="/ListInvoice" className={menuItemClass("/ListInvoice")}>
                        All Invoices
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Customers */}
              <div>
                <button
                  onClick={() => toggleMenu("customers")}
                  className={`${sectionButtonClass} ${isCollapsed ? "justify-center px-0" : ""
                    }`}
                >
                  <div
                    className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
                      }`}
                  >
                    <Users size={18} />
                    {!isCollapsed && <span>Customers</span>}
                  </div>
                  {!isCollapsed &&
                    (openMenus.customers ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </button>

                <AnimatePresence initial={false}>
                  {openMenus.customers && !isCollapsed && (
                    <motion.div
                      key="customers-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pl-10 flex flex-col mt-2 space-y-1 overflow-hidden"
                    >
                      <Link to="/AllCustomer" className={menuItemClass("/AllCustomer")}>
                        All Customers
                      </Link>
                      <Link to="/review" className={menuItemClass("/review")}>
                        Reviews & Feedback
                      </Link>
                      <Link to="/contact" className={menuItemClass("/contact")}>
                        Customer Contact
                      </Link>


                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Footer */}
            {!isCollapsed && (
              <div className="p-4 border-t border-white/10 text-xs text-gray-400 text-center mt-auto">
                © 2025 CraftiCrazy Admin
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
