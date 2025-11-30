import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Trash2,
  Wallet,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Invoice {
  _id?: string;
  invoiceId: string;
  client: string;
  email: string;
  dateIssued: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Due Soon";
  dueDate: string;
}

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // 🔗 Fetch invoices from backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://node-test-1-34fs.onrender.com/api/invoice/");
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // 💰 Format currency
  const formatRupees = (amount: number) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });

  // 🎨 Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Due Soon":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // 🔍 Filter invoices
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📊 Summary Calculations
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#2a0a4b]">📜 Invoice List</h1>
        <button
          onClick={() => (window.location.href = "/CreateInvoice")}
          className="flex items-center gap-2 bg-[#845EF7] text-white px-4 py-2 rounded-lg hover:bg-[#6f4ad8] transition"
        >
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-gray-700">Manage Invoices</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#845EF7]"
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading invoices...</div>
          ) : error ? (
            <div className="p-10 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="text-left py-3 px-4">Client</th>
                    <th className="text-left py-3 px-4">Invoice ID</th>
                    <th className="text-left py-3 px-4">Issued Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice._id}
                        className="border-b hover:bg-gray-50 transition duration-150 cursor-pointer"
                        onClick={() =>
                          (window.location.href = `/InvoiceDetail/${invoice._id}`)
                        }
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{invoice.client}</p>
                            <p className="text-xs text-gray-500">{invoice.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#845EF7] font-semibold">
                          {invoice.invoiceId}
                        </td>
                        <td className="py-3 px-4">{invoice.dateIssued}</td>
                        <td className="py-3 px-4">{formatRupees(invoice.amount)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{invoice.dueDate}</td>
                        <td
                          className="py-3 px-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Summary Cards */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-[#845EF7]/10 p-3 rounded-lg">
              <FileText className="text-[#845EF7]" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Invoice Amount</p>
              <h3 className="text-xl font-semibold">{formatRupees(totalAmount)}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Wallet className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid Invoices</p>
              <h3 className="text-xl font-semibold">{formatRupees(paidAmount)}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Invoices</p>
              <h3 className="text-xl font-semibold">{formatRupees(pendingAmount)}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="text-red-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue Invoices</p>
              <h3 className="text-xl font-semibold">{formatRupees(overdueAmount)}</h3>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceList;
