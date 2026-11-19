
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  Package,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Plus,
  Eye,
  BarChart3,
  CreditCard,
  Wallet,
  RefreshCw,
  CalendarDays,
  PackageCheck,
  UserRound,
  Receipt,
  Sparkles,
  CircleAlert,
  ChevronRight,
  Boxes,
} from "lucide-react";

import axiosInstance from "../../axiosconfig/axiosconfig";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    users: [],
    products: [],
    orders: [],
    payments: [],
    totals: {
      users: 0,
      products: 0,
      orders: 0,
      payments: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all master dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, productsRes, ordersRes, paymentsRes] =
        await Promise.all([
          axiosInstance.get("/master-data/users?page=1&limit=100"),
          axiosInstance.get("/master-data/products?page=1&limit=100"),
          axiosInstance.get("/master-data/orders?page=1&limit=100"),
          axiosInstance.get("/master-data/payments?page=1&limit=100"),
        ]);

      setData({
        users: usersRes.users || [],
        products: productsRes.products || [],
        orders: ordersRes.orders || [],
        payments: paymentsRes.payments || [],
        totals: {
          users: usersRes.pagination?.totalRecords ?? usersRes.users?.length ?? 0,
          products: productsRes.pagination?.totalRecords ?? productsRes.products?.length ?? 0,
          orders: ordersRes.pagination?.totalRecords ?? ordersRes.orders?.length ?? 0,
          payments: paymentsRes.pagination?.totalRecords ?? paymentsRes.payments?.length ?? 0,
        },
      });
    } catch (err) {
      console.error("Master Dashboard Error:", err);

      setError(
        err.message ||
        err.error ||
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { users, products, orders, payments, totals } = data;

  // Helpers
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const orderStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 ring-amber-200",
      confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
      processing: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      shipped: "bg-purple-50 text-purple-700 ring-purple-200",
      delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      cancelled: "bg-red-50 text-red-700 ring-red-200",
    };

    return styles[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-600 ring-gray-200";
  };

  const paymentStatusStyle = (status) => {
    const styles = {
      paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      created: "bg-amber-50 text-amber-700 ring-amber-200",
      failed: "bg-red-50 text-red-700 ring-red-200",
    };

    return styles[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-600 ring-gray-200";
  };

  const getFirstProduct = (order) => order.items?.[0];

  const getProductName = (item) =>
    item?.productName ||
    item?.productId?.productName ||
    "Product";

  const getProductImage = (item) =>
    item?.image?.url ||
    item?.productId?.image?.url ||
    "";

  // Recent records
  const recentUsers = useMemo(
    () =>
      [...users]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )
        .slice(0, 5),
    [users]
  );

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )
        .slice(0, 4),
    [products]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )
        .slice(0, 5),
    [orders]
  );

  const recentPayments = useMemo(
    () =>
      [...payments]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )
        .slice(0, 5),
    [payments]
  );

  // Order summary from loaded records
  const orderSummary = useMemo(() => {
    const count = (status) =>
      orders.filter(
        (order) => order.orderStatus?.toLowerCase() === status
      ).length;

    return {
      pending: count("pending"),
      processing: count("processing"),
      delivered: count("delivered"),
      cancelled: count("cancelled"),
      confirmed: count("confirmed"),
      shipped: count("shipped"),
    };
  }, [orders]);

  // Payment summary from loaded records
  const paymentSummary = useMemo(() => {
    const paid = payments.filter(
      (payment) => payment.status?.toLowerCase() === "paid"
    );

    const pending = payments.filter(
      (payment) => payment.status?.toLowerCase() === "created"
    );

    const failed = payments.filter(
      (payment) => payment.status?.toLowerCase() === "failed"
    );

    const revenue = paid.reduce(
      (total, payment) =>
        total + Number(payment.totalAmount ?? payment.amount ?? 0),
      0
    );

    return {
      paidCount: paid.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      revenue,
    };
  }, [payments]);

  // Product inventory summary from loaded records
  const inventorySummary = useMemo(() => {
    const lowStock = products.filter(
      (product) => Number(product.qty) > 0 && Number(product.qty) <= 10
    );

    const outOfStock = products.filter(
      (product) => Number(product.qty) === 0
    );

    const totalStock = products.reduce(
      (total, product) => total + (Number(product.qty) || 0),
      0
    );

    return {
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      totalStock,
    };
  }, [products]);

  // Last 7 days payment chart from loaded records
  const salesChart = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const dayPayments = payments.filter((payment) => {
        if (payment.status?.toLowerCase() !== "paid") return false;

        const paymentDate = new Date(payment.createdAt);
        paymentDate.setHours(0, 0, 0, 0);

        return paymentDate.getTime() === date.getTime();
      });

      const amount = dayPayments.reduce(
        (total, payment) =>
          total + Number(payment.totalAmount ?? payment.amount ?? 0),
        0
      );

      days.push({
        label: date.toLocaleDateString("en-IN", {
          weekday: "short",
        }),
        amount,
      });
    }

    const maxAmount = Math.max(...days.map((day) => day.amount), 1);

    return days.map((day) => ({
      ...day,
      height: (day.amount / maxAmount) * 100,
    }));
  }, [payments]);

  const stats = [
    {
      title: "Total Users",
      value: totals.users,
      subtitle: "Registered accounts",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "border-blue-100",
      path: "/admin/users",
    },
    {
      title: "Total Products",
      value: totals.products,
      subtitle: "Products in catalogue",
      icon: ShoppingBag,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "border-amber-100",
      path: "/admin/products",
    },
    {
      title: "Total Orders",
      value: totals.orders,
      subtitle: "All customer orders",
      icon: Package,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      accent: "border-purple-100",
      path: "/admin/orders",
    },
    {
      title: "Total Payments",
      value: totals.payments,
      subtitle: "Payment transactions",
      icon: CreditCard,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "border-emerald-100",
      path: "/admin/payments",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-52 rounded-3xl bg-gray-200" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-36 rounded-2xl bg-gray-200" />
          ))}
        </div>

        <div className="h-80 rounded-3xl bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <CircleAlert size={30} />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-gray-900">
            Unable to load admin dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={fetchDashboardData}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FFE45C] px-6 py-3 text-sm font-bold text-gray-900 hover:bg-yellow-400"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-8">

      {/* HERO */}
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fff5bd] via-[#ffed88] to-[#f8dc47] p-6 shadow-sm sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[40px] border-white/20" />

        <div className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-white/30 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[2px] text-gray-700 backdrop-blur-md">
              <Sparkles size={13} />
              Business Control Center
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-[#171717] sm:text-4xl lg:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-700 sm:text-base">
              Monitor your customers, products, orders and payments
              from one place. Stay on top of your business activity.
            </p>

            <button
              onClick={() => navigate("/admin/products")}
              className="mt-6 inline-flex items-center gap-3 rounded-xl bg-[#171717] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-black"
            >
              <Plus size={17} />
              Add New Product
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/45 p-5 backdrop-blur-xl md:min-w-[230px]">
            <p className="text-xs font-bold uppercase tracking-[2px] text-gray-600">
              Inventory Snapshot
            </p>

            <h2 className="mt-3 text-4xl font-black text-gray-900">
              {inventorySummary.totalStock.toLocaleString("en-IN")}
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              Units across loaded products
            </p>

            <div className="mt-5 flex gap-2">
              <span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold text-amber-700">
                Low: {inventorySummary.lowStock}
              </span>

              <span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold text-red-600">
                Out: {inventorySummary.outOfStock}
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* OVERVIEW CARDS */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
              Business Performance
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
              Business Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your complete business at a glance.
            </p>
          </div>

          <span className="text-xs text-gray-400">
            Live database records
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className={`group rounded-2xl border ${item.accent} bg-white p-5 text-left shadow-[0_5px_25px_rgba(0,0,0,0.025)] transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg} ${item.iconColor}`}>
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-gray-300 transition group-hover:text-gray-900"
                  />
                </div>

                <h3 className="mt-5 text-3xl font-black tracking-tight text-gray-900">
                  {Number(item.value).toLocaleString("en-IN")}
                </h3>

                <p className="mt-1 text-sm font-bold text-gray-800">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {item.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </section>


      {/* REVENUE + ORDER SUMMARY */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* REVENUE */}
        <div className="relative overflow-hidden rounded-3xl bg-[#171717] p-6 text-white xl:col-span-2 sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-16 h-60 w-60 rounded-full border-[38px] border-white/[0.05]" />

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[2px] text-gray-400">
                <Wallet size={15} />
                Payment Analytics
              </div>

              <p className="mt-5 text-sm text-gray-400">
                Successful Payment Amount
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {formatCurrency(paymentSummary.revenue)}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Calculated from the latest 100 payment records loaded
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-[#FFE45C]">
              <BarChart3 size={26} />
            </div>
          </div>

          {/* 7 DAY PAYMENT CHART */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-300">
                Last 7 Days – Paid Transactions
              </p>

              <span className="text-[10px] text-gray-500">
                Based on loaded records
              </span>
            </div>

            <div className="flex h-36 items-end justify-between gap-3 border-b border-white/10 pb-2">
              {salesChart.map((day, index) => (
                <div
                  key={`${day.label}-${index}`}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      title={formatCurrency(day.amount)}
                      style={{
                        height: `${day.height}%`,
                        minHeight: day.amount > 0 ? "5px" : "0",
                      }}
                      className={`w-full max-w-12 rounded-t-lg transition-all duration-300 ${
                        index === 6
                          ? "bg-[#FFE45C]"
                          : "bg-yellow-200/60 hover:bg-yellow-200"
                      }`}
                    />
                  </div>

                  <span className="text-[10px] font-medium text-gray-400">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-5">
            <div>
              <p className="text-2xl font-extrabold text-white">
                {paymentSummary.paidCount}
              </p>
              <p className="mt-1 text-[10px] text-gray-400">
                Successful
              </p>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-white">
                {paymentSummary.pendingCount}
              </p>
              <p className="mt-1 text-[10px] text-gray-400">
                Pending
              </p>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-white">
                {paymentSummary.failedCount}
              </p>
              <p className="mt-1 text-[10px] text-gray-400">
                Failed
              </p>
            </div>
          </div>
        </div>


        {/* ORDER SUMMARY */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-gray-900">
            Order Summary
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Status breakdown of latest 100 orders
          </p>

          <div className="mt-7 space-y-6">
            {[
              {
                title: "Pending",
                value: orderSummary.pending,
                icon: Clock,
                color: "bg-amber-50 text-amber-600",
              },
              {
                title: "Processing",
                value: orderSummary.processing,
                icon: Truck,
                color: "bg-blue-50 text-blue-600",
              },
              {
                title: "Delivered",
                value: orderSummary.delivered,
                icon: CheckCircle2,
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                title: "Cancelled",
                value: orderSummary.cancelled,
                icon: AlertCircle,
                color: "bg-red-50 text-red-600",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-3 ${item.color}`}>
                      <Icon size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <span className="text-xl font-extrabold text-gray-900">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFE45C] py-3 text-sm font-bold text-gray-900 transition hover:bg-yellow-400"
          >
            Manage Orders
            <ArrowRight size={16} />
          </button>
        </div>
      </section>


      {/* RECENT ORDERS */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              Recent Orders
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Latest 5 customer orders
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 rounded-xl bg-[#F5F6E7] px-4 py-2.5 text-xs font-bold text-gray-800 hover:bg-[#EDEFCE]"
          >
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package size={32} className="mx-auto text-gray-300" />
            <p className="mt-3 font-bold text-gray-800">No orders yet</p>
            <p className="mt-1 text-sm text-gray-400">
              New customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-y border-gray-100 bg-gray-50/70">
                  {["Order ID", "Customer", "Product", "Amount", "Date", "Status"].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => {
                  const item = getFirstProduct(order);
                  const customer = order.userId;

                  return (
                    <tr
                      key={order._id || order.orderId}
                      className="border-b border-gray-50 transition hover:bg-[#FCFCF8]"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">
                        {order.orderId}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {customer?.name || "Customer"}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {customer?.email || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getProductImage(item) ? (
                            <img
                              src={getProductImage(item)}
                              alt={getProductName(item)}
                              className="h-9 w-9 rounded-lg bg-gray-50 object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                              <Package size={16} className="text-gray-400" />
                            </div>
                          )}

                          <span className="max-w-[150px] truncate text-xs font-medium text-gray-600">
                            {getProductName(item)}
                            {order.items?.length > 1
                              ? ` +${order.items.length - 1}`
                              : ""}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-gray-800">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ring-1 ring-inset ${orderStatusStyle(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>


      {/* RECENT USERS + PRODUCTS */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* USERS */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Recent Users
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                Latest registered accounts
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/users")}
              className="rounded-xl bg-[#F5F6E7] p-2.5 text-gray-700 hover:bg-[#EDEFCE]"
              aria-label="View all users"
            >
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {recentUsers.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-400">
                No users found.
              </p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    {user.profilePic?.url ? (
                      <img
                        src={user.profilePic.url}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold capitalize text-gray-600">
                      {user.userType || "user"}
                    </span>
                    <p className="mt-2 text-[10px] text-gray-400">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


        {/* PRODUCTS */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Recent Products
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                Latest catalogue additions
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/products")}
              className="rounded-xl bg-[#F5F6E7] p-2.5 text-gray-700 hover:bg-[#EDEFCE]"
              aria-label="View all products"
            >
              <ArrowUpRight size={17} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {recentProducts.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-400">
                No products found.
              </p>
            ) : (
              recentProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8F8F3]">
                    {product.image?.url ? (
                      <img
                        src={product.image.url}
                        alt={product.productName}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <Boxes size={20} className="text-gray-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-800">
                      {product.productName}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400">
                      {product.productCode}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-gray-900">
                      {formatCurrency(product.price)}
                    </p>
                    <p className={`mt-1 text-[10px] font-semibold ${
                      Number(product.qty) === 0
                        ? "text-red-500"
                        : Number(product.qty) <= 10
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }`}>
                      Stock: {product.qty}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>


      {/* RECENT PAYMENTS */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              Recent Payments
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Latest 5 customer transactions
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/payments")}
            className="flex items-center gap-2 rounded-xl bg-[#F5F6E7] px-4 py-2.5 text-xs font-bold text-gray-800 hover:bg-[#EDEFCE]"
          >
            View All Payments
            <ArrowUpRight size={16} />
          </button>
        </div>

        {recentPayments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CreditCard size={32} className="mx-auto text-gray-300" />
            <p className="mt-3 font-bold text-gray-800">
              No payment records
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {recentPayments.map((payment) => (
              <div
                key={payment._id || payment.razorpayOrderId}
                className="rounded-2xl border border-gray-100 bg-[#FCFCFA] p-5 transition hover:border-[#E5EBAA] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
                    <Receipt size={19} />
                  </div>

                  <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ring-1 ring-inset ${paymentStatusStyle(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>

                <p className="mt-5 text-xs text-gray-400">
                  Transaction Amount
                </p>

                <h4 className="mt-1 text-2xl font-black text-gray-900">
                  {formatCurrency(payment.totalAmount ?? payment.amount)}
                </h4>

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex justify-between gap-2 text-xs">
                    <span className="text-gray-400">Customer</span>
                    <span className="max-w-[65%] truncate font-semibold text-gray-700">
                      {payment.userId?.name || "Customer"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 text-xs">
                    <span className="text-gray-400">Payment ID</span>
                    <span className="max-w-[65%] truncate font-semibold text-gray-700">
                      {payment.razorpayPaymentId || "Not completed"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 text-xs">
                    <span className="text-gray-400">Order ID</span>
                    <span className="max-w-[65%] truncate font-semibold text-gray-700">
                      {payment.orderId || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 text-xs">
                    <span className="text-gray-400">Date</span>
                    <span className="font-semibold text-gray-700">
                      {formatDate(payment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* QUICK ACTIONS */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-extrabold text-gray-900">
            Quick Actions
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            Manage your store operations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Add Product",
              description: "Create a new product",
              icon: Plus,
              path: "/admin/products",
              color: "bg-amber-50 text-amber-600",
            },
            {
              title: "Manage Users",
              description: "View customer accounts",
              icon: Users,
              path: "/admin/users",
              color: "bg-blue-50 text-blue-600",
            },
            {
              title: "Manage Orders",
              description: "Track customer orders",
              icon: PackageCheck,
              path: "/admin/orders",
              color: "bg-purple-50 text-purple-600",
            },
            {
              title: "Manage Payments",
              description: "Review transactions",
              icon: CreditCard,
              path: "/admin/payments",
              color: "bg-emerald-50 text-emerald-600",
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-3 ${action.color}`}>
                    <Icon size={21} />
                  </div>

                  <div>
                    <p className="font-bold text-gray-800">
                      {action.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-900"
                />
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}
