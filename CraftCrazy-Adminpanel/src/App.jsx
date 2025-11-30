// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Order";
import AddProduct from "./pages/Addproducts";
import AllProducts from "./pages/Allproducts";
import ProductDetail from "./pages/ProductDetails";
import Customers from "./pages/Customers";
import Notifications from "./pages/Notifications";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetails from "./pages/InvoiceDetails";
import CustomerContact from "./pages/CustomerContact";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./middleware/protectedRoute";
import CustomerReviewsPage from "./pages/Review";
import DemandOrderPage from "./pages/DemandOrderpage"
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppRoutes() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar only when logged in */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 h-full z-40">
          <Sidebar
            isSidebarOpen={true}
            isCollapsed={isCollapsed}
            toggleSidebar={() => {}}
            toggleCollapse={() => setIsCollapsed(prev => !prev)}
          />
        </div>
      )}

      {/* Main Layout */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isAuthenticated ? (isCollapsed ? "ml-20" : "ml-64") : "ml-0"}`}>
        {/* Navbar only when logged in */}
        {isAuthenticated && (
          <div className="fixed top-0 right-0 left-0 z-30 bg-white shadow-sm">
            <Navbar />
          </div>
        )}

        <main className={`${isAuthenticated ? "mt-16 p-6 overflow-y-auto" : "p-6"}`}>
          <Routes>
            <Route path="/admin-login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AdminLogin />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/admin-login" replace />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/addproducts" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/allproducts" element={<ProtectedRoute><AllProducts /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/AllCustomer" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><CustomerReviewsPage /></ProtectedRoute>} />
            <Route path="/notification" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/ListInvoice" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
            <Route path="/InvoiceDetail/:id" element={<ProtectedRoute><InvoiceDetails /></ProtectedRoute>} />
            <Route path="/demand" element={<ProtectedRoute><DemandOrderPage /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><CustomerContact /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
