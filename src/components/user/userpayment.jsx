import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  Loader2,
  Package,
  RefreshCw,
  Wallet,
} from "lucide-react";

import axiosInstance from "../../axiosconfig/axiosconfig";

const PAGE_SIZE = 10;

const FILTERS = [
  { label: "All", value: "" },
  { label: "Paid", value: "paid" },
  { label: "Not completed", value: "created" },
  { label: "Failed", value: "failed" },
];

const STATUS_STYLE = {
  paid: { dot: "bg-emerald-500", label: "Paid" },
  created: { dot: "bg-amber-500", label: "Not completed" },
  failed: { dot: "bg-red-500", label: "Failed" },
};

/* ---------- helpers ---------- */

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDateTime = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const amountOf = (p) => p.totalAmount ?? p.amount;

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status?.toLowerCase()] || {
    dot: "bg-gray-400",
    label: status || "Unknown",
  };

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const Thumb = ({ item, size = "h-10 w-10" }) => (
  <div
    className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100`}
  >
    {item?.image?.url ? (
      <img
        src={item.image.url}
        alt={item.productName || "Product"}
        className="h-full w-full object-contain p-1"
      />
    ) : (
      <Package size={16} className="text-gray-400" />
    )}
  </div>
);

/* ---------- page ---------- */

export default function Payments() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    limit: PAGE_SIZE,
  });

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      // NOTE: change the path if your payment router is mounted somewhere else
      const res = await axiosInstance.get("/user/payment/my-payments", {
        params: {
          page,
          limit: PAGE_SIZE,
          ...(status ? { status } : {}),
        },
      });

      setPayments(res.payments || []);
      setPagination(
        res.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalPayments: 0,
          limit: PAGE_SIZE,
        }
      );
    } catch (err) {
      console.error("My Payments Error:", err);
      setError(
        err.message || err.error || "Unable to load your payment history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    setExpandedId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const changeFilter = (value) => {
    setPage(1);
    setStatus(value);
  };

  const downloadInvoice = async (payment) => {
    try {
      setDownloadingId(payment._id);

      // loaded only when needed, so jsPDF isn't part of the main bundle
      const { generateInvoicePdf } = await import(
        "../user/generatepdf"
      );

      generateInvoicePdf({
        payment,
        customer: { name: user.name, email: user.email },
      });
    } catch (err) {
      console.error("Invoice Error:", err);
      alert("Could not create the invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="mx-auto max-w-6xl pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment history
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {pagination.totalPayments}{" "}
            {pagination.totalPayments === 1 ? "payment" : "payments"}
            {status ? ` · ${STATUS_STYLE[status]?.label}` : ""}. Download an
            invoice for any paid order.
          </p>
        </div>

        {/* Filters */}
        <div
          className="flex w-full gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 sm:w-auto"
          role="tablist"
          aria-label="Filter payments by status"
        >
          {FILTERS.map((f) => (
            <button
              key={f.label}
              role="tab"
              aria-selected={status === f.value}
              onClick={() => changeFilter(f.value)}
              className={`shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                status === f.value
                  ? "bg-[#FFE45C] text-black"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* column heads (desktop) */}
        <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-medium text-gray-500 md:grid">
          <div className="col-span-4">Products</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Invoice</div>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse gap-4 px-5 py-5">
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/4 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <CircleAlert size={28} className="text-red-500" />
            <p className="mt-3 text-sm font-medium text-gray-900">
              We couldn’t load your payments
            </p>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchPayments}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Wallet size={30} className="text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-900">
              {status ? "No payments with this status" : "No payments yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {status
                ? "Try a different filter to see your other payments."
                : "Your payments will show up here once you place an order."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {payments.map((payment) => {
              const items = payment.items || [];
              const first = items[0];
              const extra = items.length - 1;
              const isOpen = expandedId === payment._id;
              const isPaid = payment.status?.toLowerCase() === "paid";

              return (
                <li key={payment._id}>
                  {/* summary row */}
                  <div className="grid grid-cols-12 items-center gap-x-4 gap-y-3 px-5 py-4">
                    {/* products */}
                    <button
                      onClick={() =>
                        setExpandedId(isOpen ? null : payment._id)
                      }
                      aria-expanded={isOpen}
                      className="col-span-12 flex min-w-0 items-center gap-3 text-left md:col-span-4"
                    >
                      <Thumb item={first} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {first?.productName || "Product"}
                          {extra > 0 && (
                            <span className="font-normal text-gray-500">
                              {" "}
                              +{extra} more
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {payment.orderId
                            ? `Order #${payment.orderId}`
                            : "Order not generated"}
                        </p>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-gray-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div className="col-span-6 text-sm text-gray-600 md:col-span-2">
                      {formatDateTime(payment.createdAt)}
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <StatusBadge status={payment.status} />
                    </div>

                    <div className="col-span-6 text-sm font-semibold tabular-nums md:col-span-2 md:text-right">
                      {formatCurrency(amountOf(payment), payment.currency)}
                    </div>

                    <div className="col-span-6 flex justify-end md:col-span-2">
                      {isPaid ? (
                        <button
                          onClick={() => downloadInvoice(payment)}
                          disabled={downloadingId === payment._id}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-[#FFE45C] disabled:opacity-60"
                        >
                          {downloadingId === payment._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Download size={14} />
                          )}
                          Invoice PDF
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Only for paid orders
                        </span>
                      )}
                    </div>
                  </div>

                  {/* expanded details */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5">
                      <div className="grid gap-6 lg:grid-cols-3">
                        {/* items */}
                        <div className="lg:col-span-2">
                          <p className="text-sm font-semibold text-gray-900">
                            Products in this payment
                          </p>

                          <ul className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
                            {items.map((item, idx) => (
                              <li
                                key={`${item.productId}-${idx}`}
                                className="flex items-center gap-3 px-4 py-3"
                              >
                                <Thumb item={item} size="h-11 w-11" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {item.productName || "Product"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.productCode
                                      ? `${item.productCode} · `
                                      : ""}
                                    {formatCurrency(item.price)} ×{" "}
                                    {item.qty}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold tabular-nums">
                                  {formatCurrency(
                                    item.subtotal ??
                                      (item.price || 0) * (item.qty || 0)
                                  )}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* payment info */}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Payment details
                          </p>

                          <dl className="mt-3 space-y-2.5 text-sm">
                            {[
                              ["Payment ID", payment.razorpayPaymentId || "Not completed"],
                              ["Razorpay order", payment.razorpayOrderId],
                              ["Order ID", payment.orderId || "Not generated"],
                              ["Method", payment.paymentMethod || "Online"],
                              ["Total items", payment.totalItems ?? items.length],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="flex justify-between gap-3"
                              >
                                <dt className="text-gray-500">{label}</dt>
                                <dd className="max-w-[60%] truncate text-right font-medium capitalize text-gray-900">
                                  {value}
                                </dd>
                              </div>
                            ))}

                            <div className="flex justify-between gap-3 border-t border-gray-200 pt-3">
                              <dt className="font-medium text-gray-900">
                                Total
                              </dt>
                              <dd className="font-semibold tabular-nums">
                                {formatCurrency(
                                  amountOf(payment),
                                  payment.currency
                                )}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3.5">
            <p className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page >= pagination.totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}