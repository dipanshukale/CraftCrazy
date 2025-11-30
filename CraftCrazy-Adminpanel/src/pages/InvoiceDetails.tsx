import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useReactToPrint } from "react-to-print";

const MySwal = withReactContent(Swal);

interface InvoiceItem {
  name: string;
  price: number;
  quantity: number;
}

interface Invoice {
  _id?: string;
  invoiceId: string;
  client: string;
  email: string;
  dateIssued: string;
  dueDate: string;
  amount: number;
  status: string;
  items: InvoiceItem[];
  // optional fields
  phone?: string;
  address?: string;
  notes?: string;
}

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement | null>(null);


const handlePrint = useReactToPrint({
  documentTitle: `Invoice-${invoice?.invoiceId}`,
  contentRef: printRef,
});


  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://node-test-1-34fs.onrender.com/api/invoice/${id}`);
        // adapt to your API shape: some APIs wrap data in res.data.invoice
        const data: Invoice = res.data?.invoice ?? res.data;
        if (mounted) setInvoice(data);
      } catch (err) {
        console.error("Failed fetching invoice:", err);
        MySwal.fire({
          icon: "error",
          title: "Failed to load invoice",
          text: "Please try again or contact support.",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInvoice();
    return () => {
      mounted = false;
    };
  }, [id]);

  const formatRupees = (amount: number) =>
    amount.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const handleDelete = async () => {
    if (!invoice?._id) return;

    const result = await MySwal.fire({
      title: "Delete Invoice?",
      html: `<p>Invoice <strong>${invoice.invoiceId}</strong> will be permanently deleted.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      preConfirm: async () => {
        // preConfirm can return a promise; show loading inside modal
        try {
          setDeleting(true);
          await axios.delete(`https://node-test-1-34fs.onrender.com/api/invoice/${invoice._id}`);
          return true;
        } catch (err: any) {
          // show validation message inside Swal
          MySwal.showValidationMessage(err?.response?.data?.message || "Delete failed");
          throw err;
        } finally {
          setDeleting(false);
        }
      },
    });

    if (result.isConfirmed) {
      MySwal.fire({
        icon: "success",
        title: "Deleted",
        text: "Invoice was deleted successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
      // redirect back to invoice list (adjust route as needed)
      navigate("/invoices");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading invoice…</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Invoice not found.</p>
      </div>
    );
  }

  return (
    <motion.div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div ref={printRef} className="bg-white shadow-xl w-full max-w-4xl p-10 rounded-lg border print:bg-white print:shadow-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2a0a4b]">CraftiCrazy</h1>
            <p className="text-sm text-gray-600 mt-1">
              Chandrapur, Maharashtra, India
              <br />
              Phone: {invoice.phone ?? "+91 77210288815"} | Email: {"crafticrazy@gmail.com"}
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-semibold">Invoice</h2>
            <p className="text-sm text-gray-600">Invoice ID: <span className="font-medium">{invoice.invoiceId}</span></p>
            <p className="text-sm text-gray-600">Issued: {formatDate(invoice.dateIssued)}</p>
          </div>
        </div>

        {/* Client + meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-medium text-gray-700">Bill To:</h3>
            <p className="text-gray-900 font-semibold">{invoice.client}</p>
            <p className="text-gray-600 text-sm">{invoice.email}</p>
            {invoice.address && <p className="text-gray-600 text-sm">{invoice.address}</p>}
          </div>

          <div className="text-sm text-gray-600">
            <p>Due Date: <span className="font-medium">{formatDate(invoice.dueDate)}</span></p>
            <p className="mt-1">Status: <span className="font-semibold text-[#845EF7]">{invoice.status}</span></p>
            {invoice.notes && <p className="mt-2 text-gray-700">Notes: {invoice.notes}</p>}
          </div>
        </div>

        {/* Items */}
        <div className="mt-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border">
              <tr>
                <th className="text-left p-3">Item</th>
                <th className="text-center p-3">Qty</th>
                <th className="text-right p-3">Unit</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3 font-medium text-gray-700">{item.name}</td>
                  <td className="p-3 text-center text-gray-700">{item.quantity}</td>
                  <td className="p-3 text-right text-gray-700">{formatRupees(item.price)}</td>
                  <td className="p-3 text-right font-semibold">{formatRupees(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-4">
            <div className="text-right">
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold">{formatRupees(invoice.amount)}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-10 border-t pt-4">
          Thank you for your business. This invoice is system generated and requires no signature.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handlePrint}
          className="bg-[#845EF7] hover:bg-[#6f4ad8] text-white px-5 py-2 rounded-md"
          aria-label="Print Invoice"
        >
          Print Invoice
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md"
          aria-label="Go back"
        >
          Back
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
          aria-label="Delete Invoice"
        >
          {deleting ? "Deleting…" : "Delete Invoice"}
        </button>
      </div>
    </motion.div>
  );
};

export default InvoiceDetail;
