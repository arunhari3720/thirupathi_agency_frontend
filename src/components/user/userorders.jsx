
import { useEffect, useState } from "react";
import axios from "../../axiosconfig/axiosconfig"
import {
  Package,
  Search,
  ShoppingBag,
  CalendarDays,
  ChevronRight,
  X,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  RefreshCw,
  CreditCard,
} from "lucide-react";


const statusConfig = {
  pending: {
    label: "Order Placed",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    color: "bg-violet-100 text-violet-700",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-700",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700",
    icon: PackageCheck,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const trackingSteps = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

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

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

 
const fetchMyOrders = async () => {
  try {
    setLoading(true);

    const data = await axios.get("/user/cart/my-orders");

    if (data.success) {
      setOrders(data.orders || []);
    }
  } catch (error) {
    console.error("My Orders Error:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMyOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderId
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || order.orderStatus === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatus = (status) =>
    statusConfig[status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-[#FAFAF7] px-4 py-7 md:px-8 lg:px-12">

      {/* HEADER */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-yellow-700">
            Your Shopping
          </p>

          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            My Orders<span className="text-yellow-500">.</span>
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your purchases and check your order details.
          </p>
        </div>

        <button
          onClick={fetchMyOrders}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            title: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
          },
          {
            title: "In Progress",
            value: orders.filter((o) =>
              ["pending", "confirmed", "processing", "shipped"].includes(
                o.orderStatus
              )
            ).length,
            icon: Clock,
          },
          {
            title: "Delivered",
            value: orders.filter(
              (o) => o.orderStatus === "delivered"
            ).length,
            icon: PackageCheck,
          },
          {
            title: "Cancelled",
            value: orders.filter(
              (o) => o.orderStatus === "cancelled"
            ).length,
            icon: XCircle,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                    {item.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-800">
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm capitalize outline-none focus:border-yellow-400 sm:w-48"
        >
          <option value="all">All Orders</option>
          {Object.keys(statusConfig).map((status) => (
            <option key={status} value={status}>
              {statusConfig[status].label}
            </option>
          ))}
        </select>
      </div>

      {/* ORDER LIST */}
      <div className="space-y-5">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <RefreshCw
              size={30}
              className="animate-spin text-yellow-500"
            />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
              <ShoppingBag size={30} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Your orders will appear here once you place an order.
            </p>

            <a
              href="/products"
              className="mt-5 inline-flex rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-yellow-300"
            >
              Explore Products
            </a>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = getStatus(order.orderStatus);
            const StatusIcon = status.icon;

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-[#FFFDF5] px-5 py-4 md:px-6">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Order ID
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {order.orderId}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Order Date
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <CalendarDays size={14} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Items
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {order.totalItems} Items
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${status.color}`}
                  >
                    <StatusIcon size={15} />
                    {status.label}
                  </span>
                </div>

                {/* ORDER PRODUCTS */}
                <div className="p-5 md:p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8F7F1]">
                          {item.image?.url ? (
                            <img
                              src={item.image.url}
                              alt={item.productName}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <Package className="text-slate-300" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-slate-900">
                            {item.productName}
                          </h3>
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

                  {/* FOOTER */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-xs text-slate-500">
                        Total Amount
                      </p>
                      <p className="mt-1 text-xl font-extrabold text-slate-900">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold capitalize text-slate-600">
                        Payment: {order.paymentStatus}
                      </span>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300"
                      >
                        Track Order
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ORDER DETAILS / TRACKING MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-700">
                  Order Tracking
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-slate-900">
                  {selectedOrder.orderId}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-100 p-2 hover:bg-yellow-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* TRACKING */}
              {selectedOrder.orderStatus === "cancelled" ? (
                <div className="rounded-xl bg-red-50 p-5 text-center text-red-700">
                  <XCircle size={30} className="mx-auto mb-2" />
                  <p className="font-bold">Order Cancelled</p>
                </div>
              ) : (
                <div>
                  <h3 className="mb-5 font-bold text-slate-900">
                    Order Progress
                  </h3>

                  <div className="space-y-0">
                    {trackingSteps.map((step, index) => {
                      const currentIndex = trackingSteps.indexOf(
                        selectedOrder.orderStatus
                      );

                      const completed = index <= currentIndex;
                      const Icon = statusConfig[step].icon;

                      return (
                        <div
                          key={step}
                          className="relative flex gap-4 pb-7 last:pb-0"
                        >
                          {index !== trackingSteps.length - 1 && (
                            <div
                              className={`absolute left-[15px] top-9 h-full w-0.5 ${
                                index < currentIndex
                                  ? "bg-yellow-400"
                                  : "bg-slate-200"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              completed
                                ? "bg-yellow-400 text-slate-900"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <Icon size={16} />
                          </div>

                          <div className="pt-1">
                            <p className={`text-sm font-bold ${
                              completed
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}>
                              {statusConfig[step].label}
                            </p>
                            {index === currentIndex && (
                              <p className="mt-1 text-xs text-yellow-700">
                                Current order status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PAYMENT */}
              <div className="rounded-xl bg-[#FAFAF7] p-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-yellow-700" />
                  <p className="font-bold text-slate-800">
                    Payment Information
                  </p>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-500">Payment Status</span>
                  <span className="font-bold capitalize text-slate-800">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-500">Order Total</span>
                  <span className="font-extrabold text-slate-900">
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* PRODUCTS */}
              <div>
                <h3 className="mb-3 font-bold text-slate-900">
                  Ordered Products
                </h3>

                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="mb-3 flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                  >
                    {item.image?.url && (
                      <img
                        src={item.image.url}
                        alt={item.productName}
                        className="h-12 w-12 rounded-lg object-contain"
                      />
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">
                        {item.productName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Qty: {item.qty}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
