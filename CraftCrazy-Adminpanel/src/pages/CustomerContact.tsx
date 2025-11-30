// src/pages/CustomerContact.tsx
import React, { useEffect, useState, useCallback, Fragment } from "react";
import axios from "axios";
import { socket } from "../socket";
import {
  Search,
  Phone,
  User,
  X,
  CheckCircle,
  Filter,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: "pending" | "resolved";
  createdAt?: string;
};

const PAGE_SIZE = 10;

const CustomerContact: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
    
    console.log("Contact Api is running...");
      const res = await axios.get(`https://node-test-1-34fs.onrender.com/api/contact/all`, { withCredentials: true });
      const data = res.data?.contacts ?? res.data?.data ?? [];
      console.log(data);
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
    fetchContacts();
  socket.on("contact-updated", fetchContacts);

  return () => {
    socket.off("contact-updated", fetchContacts);
  };
}, [fetchContacts]);

  const filtered = contacts.filter((c) => {
    const matchesFilter = statusFilter === "all" || (c.status ?? "pending") === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const start = (page - 1) * PAGE_SIZE;
  const paged = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const openDetail = (c: Contact) => {
    setSelected(c);
    setIsOpen(true);
  };

  const markResolved = async (id: string) => {
    try {
      setProcessingId(id);
      await axios.patch(`https://node-test-1-34fs.onrender.com/api/contact/update-status/${id}`, { status: "resolved" });
      setContacts((prev) => prev.map((p) => (p._id === id ? { ...p, status: "resolved" } : p)));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 bg-[#F4EAFE] min-h-screen text-[#1A1A1A]">

      <h1 className="text-3xl font-bold">Customer Contact Queries</h1>
      <p className="text-sm text-[#3a3a3a] mt-1">
        View, manage, and respond to customer inquiries in real-time.
      </p>

      {/* Search / Filters */}
      <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-500 h-5 w-5" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 bg-white"
            placeholder="Search queries..."
          />
        </div>

        <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white px-3 py-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-transparent outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white/70 backdrop-blur-md border border-purple-200 rounded-xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#8B4DFF] text-white">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3 hidden md:table-cell">Phone</th>
              <th className="px-5 py-3">Message</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {paged.map((c) => (
              <tr key={c._id} className="hover:bg-purple-50 transition">
                <td className="px-5 py-3">{c.name}<br/><span className="text-sm text-gray-500">{c.email}</span></td>
                <td className="px-5 py-3 hidden md:table-cell flex items-center gap-2"><Phone className="h-4 w-4" />{c.phone}</td>
                <td className="px-5 py-3 max-w-xs truncate">{c.message}</td>
                <td className="px-5 py-3">{c.status === "resolved" ? (
                  <span className="text-green-600 font-semibold">Resolved</span>
                ) : <span className="text-yellow-600 font-semibold">Pending</span>}</td>
                <td className="px-5 py-3">
                  <button onClick={() => openDetail(c)} className="px-3 cursor-pointer py-1 bg-[#8B4DFF] hover:bg-[#5A1AFF] text-white rounded">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-2xl max-w-xl w-full border border-purple-200 shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#5A1AFF] flex gap-2 items-center cursor-pointer"><User />{selected?.name}</h2>
                <button className="cursor-pointer" onClick={() => setIsOpen(false)}><X /></button>
              </div>
              <p className="text-sm text-gray-500">{selected?.email} • {selected?.phone}</p>

              <p className="mt-5 bg-purple-50 border border-purple-200 rounded-lg p-4 text-[#1A1A1A] whitespace-pre-wrap">{selected?.message}</p>

              <div className="mt-6 flex justify-end gap-3">
                {(selected && selected.status !== "resolved") && (
                  <button onClick={() => { markResolved(selected._id); setIsOpen(false); }} className="px-4 py-2 bg-green-600 text-white rounded">
                    Mark Resolved
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="px-4 cursor-pointer py-2 bg-gray-200 rounded">Close</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
};

export default CustomerContact;
