
import { useEffect, useMemo, useState } from "react";
import axios from "../../axiosconfig/axiosconfig";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  Clock3,
  PackageCheck,
  IndianRupee,
  Eye,
  X,
  ChevronDown,
  Package,
  CalendarDays,
  UserRound,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusStyle = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-violet-50 text-violet-700 border-violet-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const isFinalStatus = (status) =>
  ["delivered", "cancelled"].includes(status);

const MasterOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [toast, setToast] = useState(null);

  // API CONFIG
  const api = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("masterToken")}`,
      },
    });
  }, []);

  // FETCH ALL ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/user/cart/getall");

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Unable to fetch orders",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // TOAST MESSAGE
  const showToast = (message, type = "success") => {
    setToast({ message, type });

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // UPDATE STATUS
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const { data } = await api.patch(
        `/user/cart/status/${orderId}`,
        { orderStatus: newStatus }
      );

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );

        setSelectedOrder((prev) =>
          prev?.orderId === orderId
            ? { ...prev, orderStatus: newStatus }
            : prev
        );

        showToast("Order status updated successfully");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Status update failed",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // FILTER ORDERS
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        order.orderId?.toLowerCase().includes(keyword) ||
        order.userId?.name?.toLowerCase().includes(keyword) ||
        order.userId?.email?.toLowerCase().includes(keyword) ||
        order.userId?.phoneNo?.toString().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // DASHBOARD STATS
  const stats = useMemo(() => [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.orderStatus === "pending").length,
      icon: Clock3,
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Processing",
      value: orders.filter((o) =>
        ["confirmed", "processing", "shipped"].includes(o.orderStatus)
      ).length,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Delivered",
      value: orders.filter((o) => o.orderStatus === "delivered").length,
      icon: PackageCheck,
      color: "bg-green-100 text-green-700",
    },
  ], [orders]);

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-4 sm:p-6 lg:p-8">

      {/* TOAST */}
      {toast && (
        <div className={`fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-xl border bg-white px-5 py-4 shadow-xl ${
          toast.type === "error"
            ? "border-red-200 text-red-700"
            : "border-yellow-300 text-slate-800"
        }`}>
          {toast.type === "error" ? (
            <AlertCircle size={19} className="text-red-500" />
          ) : (
            <CheckCircle2 size={19} className="text-yellow-600" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)}>
            <X size={17} />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-yellow-700">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            Master Dashboard
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Orders Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage customer orders and track their delivery status.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-yellow-300 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Orders
        </button>
      </div>

      {/* STATS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-2xl p-3.5 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN TABLE CONTAINER */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TABLE HEADER */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Orders
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              View and manage all customer purchases.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:bg-white sm:w-64"
              />
            </div>

            {/* FILTER */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm capitalize outline-none focus:border-yellow-400 sm:w-44"
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center">
            <RefreshCw className="mb-3 animate-spin text-yellow-500" size={30} />
            <p className="text-sm text-slate-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 rounded-2xl bg-yellow-50 p-5 text-yellow-600">
              <ShoppingBag size={32} />
            </div>
            <h3 className="font-bold text-slate-800">No orders found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Orders will appear here when customers place purchases.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-[#FAFAF7]">
                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Order Details</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Products</th>
                  <th className="px-5 py-4">Total Amount</th>
                  <th className="px-5 py-4">Order Date</th>
                  <th className="px-5 py-4">Order Status</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition hover:bg-yellow-50/30"
                  >
                    {/* ORDER ID */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">
                        {order.orderId}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {order.totalItems} Items
                      </p>
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {order.userId?.name || "Unknown"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.userId?.email || "No email"}
                      </p>
                    </td>

                    {/* PRODUCTS */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {order.items?.[0]?.image?.url ? (
                          <img
                            src={order.items[0].image.url}
                            alt={order.items[0].productName}
                            className="h-11 w-11 rounded-xl border border-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                            <Package size={19} />
                          </div>
                        )}

                        <div>
                          <p className="max-w-32 truncate text-sm font-medium text-slate-700">
                            {order.items?.[0]?.productName || "Product"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {order.items?.length > 1
                              ? `+ ${order.items.length - 1} more products`
                              : "Single product"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays size={15} className="text-slate-400" />
                        {formatDate(order.createdAt)}
                      </div>
                    </td>

                    {/* STATUS UPDATE */}
                    <td className="px-5 py-4">
                      <div className="relative w-36">
                        <select
                          value={order.orderStatus}
                          disabled={
                            updatingId === order.orderId ||
                            isFinalStatus(order.orderStatus)
                          }
                          onChange={(e) =>
                            handleStatusUpdate(
                              order.orderId,
                              e.target.value
                            )
                          }
                          className={`w-full appearance-none rounded-lg border px-3 py-2.5 text-xs font-bold capitalize outline-none transition focus:ring-2 focus:ring-yellow-300 disabled:cursor-not-allowed disabled:opacity-70 ${
                            statusStyle[order.orderStatus]
                          }`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={14}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                        />
                      </div>

                      {updatingId === order.orderId && (
                        <p className="mt-1 text-[10px] text-yellow-700">
                          Updating...
                        </p>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-yellow-400 hover:bg-yellow-50 hover:text-slate-900"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FOOTER */}
        {!loading && filteredOrders.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
            <p className="text-xs text-slate-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <p className="text-xs font-medium text-slate-500">
              Order Management
            </p>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-700">
                  Order Information
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedOrder.orderId}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-100 p-2 transition hover:bg-yellow-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* CUSTOMER INFO */}
              <div className="rounded-2xl border border-slate-200 bg-[#FAFAF7] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-yellow-100 p-2 text-yellow-800">
                    <UserRound size={17} />
                  </div>
                  <h3 className="font-bold text-slate-800">
                    Customer Information
                  </h3>
                </div>

                <p className="mb-3 font-semibold text-slate-900">
                  {selectedOrder.userId?.name || "Unknown"}
                </p>

                <div className="space-y-2 text-sm text-slate-500">
                  <p className="flex items-center gap-2">
                    <Mail size={15} />
                    {selectedOrder.userId?.email || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={15} />
                    {selectedOrder.userId?.phoneNo || "N/A"}
                  </p>
                </div>
              </div>

              {/* PRODUCT DETAILS */}
              <div>
                <h3 className="mb-4 font-bold text-slate-900">
                  Ordered Products
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 p-3"
                    >
                      {item.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.productName}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100">
                          <Package size={23} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Code: {item.productCode}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatPrice(item.price)} × {item.qty}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-slate-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Total Items</span>
                  <span>{selectedOrder.totalItems}</span>
                </div>

                <div className="mt-3 flex justify-between text-sm text-slate-500">
                  <span>Payment Status</span>
                  <span className="font-semibold capitalize text-slate-800">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
                  <span className="font-bold text-slate-900">
                    Total Amount
                  </span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* STATUS UPDATE */}
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50/60 p-5">
                <h3 className="mb-1 font-bold text-slate-900">
                  Update Order Status
                </h3>
                <p className="mb-4 text-xs text-slate-500">
                  Change the current order status from here.
                </p>

                <div className="relative">
                  <select
                    value={selectedOrder.orderStatus}
                    disabled={
                      updatingId === selectedOrder.orderId ||
                      isFinalStatus(selectedOrder.orderStatus)
                    }
                    onChange={(e) =>
                      handleStatusUpdate(
                        selectedOrder.orderId,
                        e.target.value
                      )
                    }
                    className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 text-sm font-bold capitalize outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 disabled:opacity-60 ${
                      statusStyle[selectedOrder.orderStatus]
                    }`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  />
                </div>

                {isFinalStatus(selectedOrder.orderStatus) && (
                  <p className="mt-3 text-xs text-slate-500">
                    This order has reached its final status.
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterOrders;
