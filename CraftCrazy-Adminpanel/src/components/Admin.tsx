import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen transition-all duration-300">

      {/* Sidebar with correct props */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 sm:p-8">{children}</main>
      </div>

    </div>
  );
};

export default AdminLayout;
