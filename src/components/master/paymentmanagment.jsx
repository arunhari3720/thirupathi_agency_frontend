
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig/axiosconfig";

import {
  CreditCard,
  Search,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  UserRound,
  Package,
  Receipt,
  IndianRupee,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
  Wallet,
} from "lucide-react";

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);

  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/master-data/payments",
        {
          params: {
            page,
            limit,
            search: search.trim() || undefined,
            status: status !== "all" ? status : undefined,
            paymentMethod: paymentMethod.trim() || undefined,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
          },
        }
      );

      setPayments(response.payments || []);

      setPagination(
        response.pagination || {
          totalRecords: 0,
          currentPage: 1,
          totalPages: 1,
          limit,
        }
      );
    } catch (err) {
      console.error("Fetch Payments Error:", err);

      setError(
        err?.message || "Unable to fetch payments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 350);

    return () => clearTimeout(timer);
  }, [
    page,
    limit,
    search,
    status,
    paymentMethod,
    dateFrom,
    dateTo,
  ]);

  // Helpers
  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAmount = (payment) => {
    return payment?.totalAmount ?? payment?.amount ?? 0;
  };

  const getStatusStyle = (value) => {
    const styles = {
      paid: "bg-green-100 text-green-700",
      created: "bg-amber-100 text-amber-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-purple-100 text-purple-700",
    };

    return styles[value?.toLowerCase()] || "bg-gray-100 text-gray-600";
  };

  const getStatusIcon = (value) => {
    switch (value?.toLowerCase()) {
      case "paid":
        return <CheckCircle2 size={14} />;
      case "created":
        return <Clock3 size={14} />;
      case "failed":
        return <XCircle size={14} />;
      default:
        return <Wallet size={14} />;
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPaymentMethod("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const handlePageLimit = (value) => {
    setLimit(Number(value));
    setPage(1);
  };

  const startRecord =
    pagination.totalRecords === 0
      ? 0
      : (page - 1) * limit + 1;

  const endRecord = Math.min(
    page * limit,
    pagination.totalRecords
  );

  const paidOnCurrentPage = payments.filter(
    (payment) => payment.status?.toLowerCase() === "paid"
  ).length;

  const failedOnCurrentPage = payments.filter(
    (payment) => payment.status?.toLowerCase() === "failed"
  ).length;

  return (
    <div className="min-h-screen bg-[#f7f8f5] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#c9e51b]" />

            <span className="text-xs font-bold uppercase tracking-[2px] text-gray-500">
              Master Administration
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
            Payments Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track transactions, payment status and customer payments.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#d4ed35] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c4dc25] disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Payments
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Transactions
              </p>

              <h2 className="mt-2 text-3xl font-black text-gray-900">
                {pagination.totalRecords.toLocaleString("en-IN")}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Based on current filters
              </p>
            </div>

            <div className="rounded-xl bg-[#eff7c9] p-3">
              <CreditCard size={24} className="text-gray-900" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Paid Transactions
              </p>

              <h2 className="mt-2 text-3xl font-black text-green-600">
                {paidOnCurrentPage}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                On current page
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Failed Transactions
              </p>

              <h2 className="mt-2 text-3xl font-black text-red-600">
                {failedOnCurrentPage}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                On current page
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <h3 className="text-sm font-bold text-gray-900">
              Filter Transactions
            </h3>
          </div>

          <button
            onClick={clearFilters}
            className="text-xs font-bold text-gray-500 underline transition hover:text-black"
          >
            Clear filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search Order ID / Payment ID..."
              className="w-full rounded-xl border border-gray-200 bg-[#fafafa] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#c5df2c] focus:ring-2 focus:ring-[#d4ed35]/20"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
          >
            <option value="all">All Payment Status</option>
            <option value="created">Created</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>

          {/* Payment Method */}
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setPage(1);
            }}
            placeholder="Payment method (e.g. UPI, Card)"
            className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
          />

          {/* From Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              From Date
            </label>

            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              To Date
            </label>

            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
            />
          </div>

          {/* Limit */}
          <select
            value={limit}
            onChange={(e) => handlePageLimit(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>

        </div>
      </div>

      {/* Payment Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-gray-900">
              All Transactions
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Complete payment and transaction records
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#f0f5d9] px-3 py-1.5 text-xs font-bold text-gray-800">
            {pagination.totalRecords} Records
          </span>
        </div>

        {error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}

            <button
              onClick={fetchPayments}
              className="ml-2 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">

            <thead>
              <tr className="bg-[#fafbf8] text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-bold">
                  Transaction
                </th>

                <th className="px-6 py-4 font-bold">
                  Customer
                </th>

                <th className="px-6 py-4 font-bold">
                  Order ID
                </th>

                <th className="px-6 py-4 font-bold">
                  Amount
                </th>

                <th className="px-6 py-4 font-bold">
                  Method
                </th>

                <th className="px-6 py-4 font-bold">
                  Status
                </th>

                <th className="px-6 py-4 font-bold">
                  Date
                </th>

                <th className="px-6 py-4 text-center font-bold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <td key={i} className="px-6 py-5">
                        <div className="h-9 animate-pulse rounded-lg bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center">
                    <CreditCard
                      size={36}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-bold text-gray-700">
                      No payments found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your filters or search.
                    </p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="transition hover:bg-[#fbfcf8]"
                  >

                    {/* Transaction */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">
                        {payment.razorpayPaymentId || "Not generated"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {payment.razorpayOrderId || "No Razorpay Order ID"}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">
                        {payment.userId?.name || "Unknown"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {payment.userId?.email || "N/A"}
                      </p>
                    </td>

                    {/* Order ID */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {payment.orderId || "N/A"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-gray-900">
                        {formatCurrency(
                          getAmount(payment),
                          payment.currency
                        )}
                      </p>
                    </td>

                    {/* Method */}
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold capitalize text-gray-700">
                        {payment.paymentMethod || "N/A"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                          payment.status
                        )}`}
                      >
                        {getStatusIcon(payment.status)}
                        {payment.status || "Unknown"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(payment.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#eff6d1] px-3 py-2 text-xs font-bold text-gray-900 transition hover:bg-[#dced9c]"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col justify-between gap-4 border-t border-gray-100 px-5 py-5 sm:flex-row sm:items-center">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {startRecord} - {endRecord}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">
              {pagination.totalRecords}
            </span>{" "}
            transactions
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => prev - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="min-w-[100px] text-center text-sm font-bold text-gray-800">
              Page {page} of {pagination.totalPages || 1}
            </span>

            <button
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="relative bg-[#171717] px-6 pb-7 pt-7 text-white">

              <button
                onClick={() => setSelectedPayment(null)}
                className="absolute right-5 top-5 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X size={19} />
              </button>

              <span className="rounded-full bg-[#d4ed35] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                Payment Details
              </span>

              <div className="mt-6">
                <p className="text-sm text-gray-400">
                  Transaction Amount
                </p>

                <h2 className="mt-1 text-3xl font-black">
                  {formatCurrency(
                    getAmount(selectedPayment),
                    selectedPayment.currency
                  )}
                </h2>

                <span
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                    selectedPayment.status
                  )}`}
                >
                  {getStatusIcon(selectedPayment.status)}
                  {selectedPayment.status || "Unknown"}
                </span>
              </div>
            </div>

            <div className="space-y-6 p-6">

              {/* Customer */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-400">
                  <UserRound size={16} />
                  Customer Information
                </h3>

                <div className="grid gap-3 rounded-2xl bg-gray-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-400">Customer Name</p>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {selectedPayment.userId?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="mt-1 break-all text-sm font-bold text-gray-900">
                      {selectedPayment.userId?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Phone Number</p>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {selectedPayment.userId?.phoneNo || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">User Type</p>
                    <p className="mt-1 text-sm font-bold capitalize text-gray-900">
                      {selectedPayment.userId?.userType || "N/A"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Transaction Details */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-400">
                  <Receipt size={16} />
                  Transaction Information
                </h3>

                <div className="space-y-3 rounded-2xl border border-gray-100 p-4">

                  {[
                    ["Payment Record ID", selectedPayment._id],
                    ["Razorpay Order ID", selectedPayment.razorpayOrderId],
                    ["Razorpay Payment ID", selectedPayment.razorpayPaymentId],
                    ["Order ID", selectedPayment.orderId],
                    ["Payment Method", selectedPayment.paymentMethod],
                    ["Currency", selectedPayment.currency],
                    ["Payment Date", formatDate(selectedPayment.createdAt)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col justify-between gap-1 border-b border-gray-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start"
                    >
                      <span className="text-xs font-medium text-gray-400">
                        {label}
                      </span>

                      <span className="break-all text-left text-xs font-bold text-gray-800 sm:max-w-[65%] sm:text-right">
                        {value || "N/A"}
                      </span>
                    </div>
                  ))}

                </div>
              </section>

              {/* Ordered Products */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-400">
                  <Package size={16} />
                  Purchased Products
                </h3>

                <div className="space-y-3">

                  {selectedPayment.items?.length > 0 ? (
                    selectedPayment.items.map((item, index) => {
                      const product =
                        item.productId &&
                        typeof item.productId === "object"
                          ? item.productId
                          : null;

                      const productName =
                        item.productName ||
                        product?.productName ||
                        "Product";

                      const image =
                        item.image?.url ||
                        (typeof item.image === "string"
                          ? item.image
                          : product?.image?.url);

                      return (
                        <div
                          key={item._id || index}
                          className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={productName}
                              className="h-14 w-14 rounded-lg border border-gray-100 object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
                              <Package size={22} className="text-gray-400" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-gray-900">
                              {productName}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Code: {item.productCode || product?.productCode || "N/A"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Qty: {item.qty ?? 0}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-black text-gray-900">
                            {formatCurrency(
                              item.subtotal ??
                              (Number(item.price || 0) * Number(item.qty || 0)),
                              selectedPayment.currency
                            )}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
                      No product information available.
                    </p>
                  )}

                </div>
              </section>

              {/* Amount Summary */}
              <section className="rounded-2xl bg-[#f5f8e9] p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-500">
                  <IndianRupee size={16} />
                  Amount Summary
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Total Items
                    </span>

                    <span className="font-bold text-gray-900">
                      {selectedPayment.totalItems ??
                        selectedPayment.items?.reduce(
                          (sum, item) => sum + Number(item.qty || 0),
                          0
                        ) ??
                        0}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="font-bold text-gray-700">
                      Total Amount
                    </span>

                    <span className="text-xl font-black text-gray-900">
                      {formatCurrency(
                        getAmount(selectedPayment),
                        selectedPayment.currency
                      )}
                    </span>
                  </div>

                </div>
              </section>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full rounded-xl bg-[#d4ed35] py-3 text-sm font-black text-black transition hover:bg-[#c4dc25]"
              >
                Close Details
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentsManagement;
