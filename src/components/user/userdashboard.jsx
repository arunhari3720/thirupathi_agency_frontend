// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   CircleAlert,
//   Package,
//   RefreshCw,
// } from "lucide-react";

// import axiosInstance from "../../axiosconfig/axiosconfig";

// /* ---------- small helpers (outside component, so they don't re-create) ---------- */

// const formatCurrency = (amount, currency = "INR") =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency,
//     maximumFractionDigits: 2,
//   }).format(Number(amount) || 0);

// const formatDate = (date) => {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const greeting = () => {
//   const h = new Date().getHours();
//   if (h < 12) return "Good morning";
//   if (h < 17) return "Good afternoon";
//   return "Good evening";
// };

// // dot colour + label colour for a status
// const ORDER_DOT = {
//   pending: "bg-amber-500",
//   confirmed: "bg-blue-500",
//   processing: "bg-indigo-500",
//   shipped: "bg-purple-500",
//   delivered: "bg-emerald-500",
//   cancelled: "bg-red-500",
// };

// const PAYMENT_DOT = {
//   paid: "bg-emerald-500",
//   created: "bg-amber-500",
//   failed: "bg-red-500",
// };

// const StatusDot = ({ status, map }) => (
//   <span className="inline-flex items-center gap-2 text-xs font-medium capitalize text-gray-700">
//     <span
//       className={`h-2 w-2 rounded-full ${
//         map[status?.toLowerCase()] || "bg-gray-400"
//       }`}
//     />
//     {status || "Unknown"}
//   </span>
// );

// const getProductName = (item) =>
//   item?.productName || item?.productId?.productName || "Product";

// const getProductImage = (item) =>
//   item?.image?.url || item?.productId?.image?.url || "";

// const Thumb = ({ item, size = "h-10 w-10" }) => {
//   const src = getProductImage(item);
//   return (
//     <div
//       className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100`}
//     >
//       {src ? (
//         <img
//           src={src}
//           alt={getProductName(item)}
//           className="h-full w-full object-contain p-1"
//         />
//       ) : (
//         <Package size={16} className="text-gray-400" />
//       )}
//     </div>
//   );
// };

// const SectionHeader = ({ title, hint, actionLabel, onAction }) => (
//   <div className="flex items-end justify-between gap-4 pb-3">
//     <div>
//       <h2 className="text-base font-semibold text-gray-900">{title}</h2>
//       {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
//     </div>
//     {actionLabel && (
//       <button
//         onClick={onAction}
//         className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline"
//       >
//         {actionLabel}
//         <ArrowRight size={13} />
//       </button>
//     )}
//   </div>
// );

// /* ---------- spend sparkline (cumulative paid amount) ---------- */

// const Sparkline = ({ values }) => {
//   const W = 320;
//   const H = 64;
//   const pad = 4;

//   const points = values.length >= 2 ? values : [0, values[0] || 0];
//   const max = Math.max(...points, 1);
//   const step = (W - pad * 2) / (points.length - 1);

//   const coords = points.map((v, i) => [
//     pad + i * step,
//     H - pad - (v / max) * (H - pad * 2),
//   ]);

//   const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
//   const area = `${pad},${H} ${line} ${W - pad},${H}`;
//   const [lx, ly] = coords[coords.length - 1];

//   return (
//     <svg
//       viewBox={`0 0 ${W} ${H}`}
//       className="h-16 w-full"
//       preserveAspectRatio="none"
//       role="img"
//       aria-label="Cumulative spend over your paid transactions"
//     >
//       <polygon points={area} fill="#D2E823" fillOpacity="0.25" />
//       <polyline
//         points={line}
//         fill="none"
//         stroke="#171717"
//         strokeWidth="1.75"
//         strokeLinejoin="round"
//         strokeLinecap="round"
//         vectorEffect="non-scaling-stroke"
//       />
//       <circle cx={lx} cy={ly} r="3" fill="#171717" />
//     </svg>
//   );
// };

// /* ---------- page ---------- */

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [dashboardData, setDashboardData] = useState({
//     user: null,
//     cart: { items: [] },
//     orders: [],
//     payments: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await axiosInstance.get("/user-data/my-data");

//       setDashboardData({
//         user: res.user || null,
//         cart: res.cart || { items: [] },
//         orders: res.orders || [],
//         payments: res.payments || [],
//       });
//     } catch (err) {
//       console.error("Dashboard API Error:", err);
//       setError(
//         err.message || err.error || "Unable to load dashboard details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const { user, cart, orders, payments } = dashboardData;

//   /* cart */
//   const cartItems = cart?.items || [];

//   const cartQuantity = useMemo(
//     () => cartItems.reduce((t, i) => t + (Number(i.qty) || 0), 0),
//     [cartItems]
//   );

//   const cartTotal = useMemo(
//     () =>
//       cartItems.reduce(
//         (t, i) =>
//           t + (Number(i.productId?.price) || 0) * (Number(i.qty) || 0),
//         0
//       ),
//     [cartItems]
//   );

//   /* orders */
//   const statusOf = (o) => o.orderStatus?.toLowerCase();

//   const activeOrders = orders.filter((o) =>
//     ["pending", "confirmed", "processing", "shipped"].includes(statusOf(o))
//   );
//   const deliveredOrders = orders.filter((o) => statusOf(o) === "delivered");
//   const cancelledOrders = orders.filter((o) => statusOf(o) === "cancelled");

//   /* payments */
//   const paidPayments = payments.filter(
//     (p) => p.status?.toLowerCase() === "paid"
//   );

//   const amountOf = (p) => Number(p.totalAmount ?? p.amount ?? 0);

//   const totalPaid = paidPayments.reduce((t, p) => t + amountOf(p), 0);

//   // cumulative running total, oldest -> newest, for the sparkline
//   const spendSeries = useMemo(() => {
//     let running = 0;
//     return [...paidPayments]
//       .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
//       .map((p) => (running += amountOf(p)));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [payments]);

//   const byNewest = (a, b) =>
//     new Date(b.createdAt || 0) - new Date(a.createdAt || 0);

//   const recentOrders = [...orders].sort(byNewest).slice(0, 3);
//   const recentPayments = [...payments].sort(byNewest).slice(0, 3);

//   /* order pipeline */
//   const pipeline = [
//     {
//       label: "Being prepared",
//       count: orders.filter((o) =>
//         ["pending", "confirmed", "processing"].includes(statusOf(o))
//       ).length,
//       color: "bg-indigo-500",
//     },
//     {
//       label: "On the way",
//       count: orders.filter((o) => statusOf(o) === "shipped").length,
//       color: "bg-purple-500",
//     },
//     { label: "Delivered", count: deliveredOrders.length, color: "bg-emerald-500" },
//     { label: "Cancelled", count: cancelledOrders.length, color: "bg-red-400" },
//   ];

//   const pipelineTotal = pipeline.reduce((t, p) => t + p.count, 0);

//   /* top summary strip — plain columns separated by hairlines, no boxes */
//   const metrics = [
//     {
//       label: "Orders placed",
//       value: orders.length,
//       note: "All time",
//       path: "/user/orders",
//     },
//     {
//       label: "In progress",
//       value: activeOrders.length,
//       note: "Not delivered yet",
//       path: "/user/orders",
//     },
//     {
//       label: "Delivered",
//       value: deliveredOrders.length,
//       note: "Completed orders",
//       path: "/user/orders",
//     },
//     {
//       label: "In your cart",
//       value: cartQuantity,
//       note: `${cartItems.length} ${cartItems.length === 1 ? "product" : "products"}`,
//       path: "/user/cart",
//     },
//   ];

//   /* one-line summary under the greeting */
//   const summaryLine = (() => {
//     const parts = [];
//     if (activeOrders.length > 0)
//       parts.push(
//         `${activeOrders.length} ${
//           activeOrders.length === 1 ? "order is" : "orders are"
//         } on the way`
//       );
//     if (cartItems.length > 0)
//       parts.push(`${formatCurrency(cartTotal)} is waiting in your cart`);
//     if (parts.length === 0) return "Nothing pending right now.";
//     return parts.join(" and ") + ".";
//   })();

//   /* ---------- loading ---------- */
//   if (loading) {
//     return (
//       <div className="mx-auto max-w-6xl animate-pulse space-y-8 pb-10">
//         <div className="space-y-3">
//           <div className="h-8 w-72 rounded bg-gray-200" />
//           <div className="h-4 w-96 max-w-full rounded bg-gray-100" />
//         </div>
//         <div className="h-24 rounded bg-gray-100" />
//         <div className="grid gap-10 lg:grid-cols-12">
//           <div className="h-80 rounded bg-gray-100 lg:col-span-8" />
//           <div className="h-80 rounded bg-gray-100 lg:col-span-4" />
//         </div>
//       </div>
//     );
//   }

//   /* ---------- error ---------- */
//   if (error) {
//     return (
//       <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center text-center">
//         <CircleAlert size={28} className="text-red-500" />
//         <h2 className="mt-4 text-lg font-semibold text-gray-900">
//           We couldn’t load your dashboard
//         </h2>
//         <p className="mt-1 text-sm text-gray-500">{error}</p>
//         <button
//           onClick={fetchDashboardData}
//           className="mt-5 inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
//         >
//           <RefreshCw size={15} />
//           Retry
//         </button>
//       </div>
//     );
//   }

//   /* ---------- page ---------- */
//   return (
//     <div className="mx-auto max-w-6xl pb-12 text-gray-900">
//       {/* HEADER */}
//       <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
//             {greeting()}, {user?.name?.split(" ")[0] || "there"}
//           </h1>
//           <p className="mt-1.5 text-sm text-gray-500">{summaryLine}</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate("/user/products")}
//             className="inline-flex items-center gap-2 rounded-md bg-[#D2E823] px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-[#BFD51B]"
//           >
//             Browse products
//             <ArrowUpRight size={15} />
//           </button>

//           <button
//             onClick={() => navigate("/user/profile")}
//             className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-700 ring-2 ring-white transition hover:ring-[#D2E823]"
//             aria-label="Open your profile"
//           >
//             {user?.profilePic?.url ? (
//               <img
//                 src={user.profilePic.url}
//                 alt={user?.name || "Profile"}
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               user?.name?.charAt(0)?.toUpperCase() || "U"
//             )}
//           </button>
//         </div>
//       </header>

//       {/* SUMMARY STRIP */}
//       <section className="mt-8 border-y border-gray-200">
//         <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-gray-200">
//           {metrics.map((m, i) => (
//             <button
//               key={m.label}
//               onClick={() => navigate(m.path)}
//               className={`group px-0 py-5 text-left transition lg:px-6 lg:first:pl-0 ${
//                 i % 2 === 1 ? "pl-5 lg:pl-6" : ""
//               } ${i > 1 ? "border-t border-gray-200 lg:border-t-0" : ""}`}
//             >
//               <p className="text-sm text-gray-500">{m.label}</p>
//               <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
//                 {m.value}
//               </p>
//               <p className="mt-1 text-xs text-gray-400 group-hover:text-gray-600">
//                 {m.note}
//               </p>
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* MAIN GRID */}
//       <div className="mt-10 grid gap-12 lg:grid-cols-12">
//         {/* LEFT: orders + payments as tables */}
//         <div className="space-y-12 lg:col-span-8">
//           {/* Orders */}
//           <section>
//             <SectionHeader
//               title="Recent orders"
//               hint="Your last 3 orders"
//               actionLabel="All orders"
//               onAction={() => navigate("/user/orders")}
//             />

//             {recentOrders.length === 0 ? (
//               <div className="border-t border-gray-200 py-12 text-center">
//                 <Package size={28} className="mx-auto text-gray-300" />
//                 <p className="mt-3 text-sm font-medium text-gray-800">
//                   No orders yet
//                 </p>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Orders you place will show up here.
//                 </p>
//                 <button
//                   onClick={() => navigate("/user/products")}
//                   className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
//                 >
//                   Start shopping
//                 </button>
//               </div>
//             ) : (
//               <div className="text-sm">
//                 {/* column headings (hidden on mobile) */}
//                 <div className="hidden grid-cols-12 gap-4 border-y border-gray-200 py-2 text-xs font-medium text-gray-500 sm:grid">
//                   <div className="col-span-5">Order</div>
//                   <div className="col-span-2">Date</div>
//                   <div className="col-span-3">Status</div>
//                   <div className="col-span-2 text-right">Amount</div>
//                 </div>

//                 <div className="divide-y divide-gray-100 border-t border-gray-200 sm:border-t-0">
//                   {recentOrders.map((order) => {
//                     const first = order.items?.[0];
//                     const extra = (order.items?.length || 0) - 1;

//                     return (
//                       <div
//                         key={order._id || order.orderId}
//                         className="grid grid-cols-12 items-center gap-x-4 gap-y-2 py-4"
//                       >
//                         <div className="col-span-12 flex min-w-0 items-center gap-3 sm:col-span-5">
//                           <Thumb item={first} />
//                           <div className="min-w-0">
//                             <p className="truncate font-medium text-gray-900">
//                               {getProductName(first)}
//                               {extra > 0 && (
//                                 <span className="font-normal text-gray-500">
//                                   {" "}
//                                   +{extra} more
//                                 </span>
//                               )}
//                             </p>
//                             <p className="truncate text-xs text-gray-500">
//                               #{order.orderId}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="col-span-4 text-gray-600 sm:col-span-2">
//                           {formatDate(order.createdAt)}
//                         </div>

//                         <div className="col-span-4 sm:col-span-3">
//                           <StatusDot
//                             status={order.orderStatus}
//                             map={ORDER_DOT}
//                           />
//                         </div>

//                         <div className="col-span-4 text-right font-semibold tabular-nums sm:col-span-2">
//                           {formatCurrency(order.totalAmount)}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* Payments */}
//           <section>
//             <SectionHeader
//               title="Recent payments"
//               hint="Your last 3 transactions"
//               actionLabel="All payments"
//               onAction={() => navigate("/user/payments")}
//             />

//             {recentPayments.length === 0 ? (
//               <p className="border-t border-gray-200 py-10 text-center text-sm text-gray-500">
//                 No payments yet. Completed and attempted payments appear here.
//               </p>
//             ) : (
//               <div className="text-sm">
//                 <div className="hidden grid-cols-12 gap-4 border-y border-gray-200 py-2 text-xs font-medium text-gray-500 sm:grid">
//                   <div className="col-span-4">Payment ID</div>
//                   <div className="col-span-2">Method</div>
//                   <div className="col-span-2">Date</div>
//                   <div className="col-span-2">Status</div>
//                   <div className="col-span-2 text-right">Amount</div>
//                 </div>

//                 <div className="divide-y divide-gray-100 border-t border-gray-200 sm:border-t-0">
//                   {recentPayments.map((p) => (
//                     <div
//                       key={p._id || p.razorpayOrderId}
//                       className="grid grid-cols-12 items-center gap-x-4 gap-y-1 py-4"
//                     >
//                       <div className="col-span-12 min-w-0 sm:col-span-4">
//                         <p className="truncate font-medium text-gray-900">
//                           {p.razorpayPaymentId || "Not completed"}
//                         </p>
//                         <p className="truncate text-xs text-gray-500">
//                           Order {p.orderId || "not generated"} ·{" "}
//                           {p.totalItems || p.items?.length || 0} items
//                         </p>
//                       </div>

//                       <div className="col-span-4 capitalize text-gray-600 sm:col-span-2">
//                         {p.paymentMethod || "Online"}
//                       </div>

//                       <div className="col-span-4 text-gray-600 sm:col-span-2">
//                         {formatDate(p.createdAt)}
//                       </div>

//                       <div className="col-span-4 sm:col-span-2">
//                         <StatusDot status={p.status} map={PAYMENT_DOT} />
//                       </div>

//                       <div className="col-span-12 font-semibold tabular-nums sm:col-span-2 sm:text-right">
//                         {formatCurrency(
//                           p.totalAmount ?? p.amount,
//                           p.currency || "INR"
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </section>
//         </div>

//         {/* RIGHT: spend, order progress, cart — one rail, hairline separated */}
//         <aside className="divide-y divide-gray-200 lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-10">
//           {/* Spend */}
//           <section className="pb-8">
//             <p className="text-sm text-gray-500">Total paid</p>
//             <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
//               {formatCurrency(totalPaid)}
//             </p>
//             <p className="mt-1 text-xs text-gray-400">
//               From {paidPayments.length} successful of {payments.length}{" "}
//               {payments.length === 1 ? "transaction" : "transactions"}
//             </p>

//             <div className="mt-5">
//               <Sparkline values={spendSeries} />
//             </div>
//           </section>

//           {/* Order progress */}
//           <section className="py-8">
//             <h2 className="text-base font-semibold">Where your orders are</h2>

//             {pipelineTotal === 0 ? (
//               <p className="mt-2 text-sm text-gray-500">
//                 Place an order to track it here.
//               </p>
//             ) : (
//               <>
//                 <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
//                   {pipeline.map(
//                     (s) =>
//                       s.count > 0 && (
//                         <div
//                           key={s.label}
//                           className={s.color}
//                           style={{ width: `${(s.count / pipelineTotal) * 100}%` }}
//                           title={`${s.label}: ${s.count}`}
//                         />
//                       )
//                   )}
//                 </div>

//                 <ul className="mt-4 space-y-2.5 text-sm">
//                   {pipeline.map((s) => (
//                     <li
//                       key={s.label}
//                       className="flex items-center justify-between"
//                     >
//                       <span className="inline-flex items-center gap-2 text-gray-600">
//                         <span className={`h-2 w-2 rounded-full ${s.color}`} />
//                         {s.label}
//                       </span>
//                       <span className="font-medium tabular-nums">
//                         {s.count}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </>
//             )}
//           </section>

//           {/* Cart */}
//           <section className="pt-8">
//             <div className="flex items-baseline justify-between">
//               <h2 className="text-base font-semibold">Your cart</h2>
//               <button
//                 onClick={() => navigate("/user/cart")}
//                 className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline"
//               >
//                 Open cart
//                 <ArrowRight size={13} />
//               </button>
//             </div>

//             {cartItems.length === 0 ? (
//               <p className="mt-2 text-sm text-gray-500">
//                 Your cart is empty.{" "}
//                 <button
//                   onClick={() => navigate("/user/products")}
//                   className="font-medium text-gray-900 underline underline-offset-4"
//                 >
//                   Find something to add
//                 </button>
//               </p>
//             ) : (
//               <>
//                 <ul className="mt-4 space-y-3">
//                   {cartItems.slice(0, 3).map((item, index) => (
//                     <li
//                       key={item.productId?._id || index}
//                       className="flex items-center gap-3"
//                     >
//                       <Thumb item={item} size="h-9 w-9" />
//                       <div className="min-w-0 flex-1">
//                         <p className="truncate text-sm font-medium text-gray-900">
//                           {getProductName(item)}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Qty {item.qty}
//                         </p>
//                       </div>
//                       <p className="text-sm font-medium tabular-nums">
//                         {formatCurrency(
//                           (Number(item.productId?.price) || 0) *
//                             (Number(item.qty) || 0)
//                         )}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>

//                 {cartItems.length > 3 && (
//                   <p className="mt-3 text-xs text-gray-500">
//                     + {cartItems.length - 3} more in your cart
//                   </p>
//                 )}

//                 <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
//                   <span className="text-gray-500">Subtotal</span>
//                   <span className="font-semibold tabular-nums">
//                     {formatCurrency(cartTotal)}
//                   </span>
//                 </div>

//                 <button
//                   onClick={() => navigate("/user/cart")}
//                   className="mt-4 w-full rounded-md bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-black"
//                 >
//                   Go to checkout
//                 </button>
//               </>
//             )}
//           </section>
//         </aside>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  CreditCard,
  Package,
  RefreshCw,
  ShoppingBag,
  Trophy,
} from "lucide-react";

import axiosInstance from "../../axiosconfig/axiosconfig";

/* ---------- helpers ---------- */

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const getProductName = (item) =>
  item?.productName || item?.productId?.productName || "Product";

const getProductImage = (item) =>
  item?.image?.url || item?.productId?.image?.url || "";

const getProductKey = (item) =>
  item?.productId?._id || item?.productId || item?.productName || null;

const ORDER_DOT = {
  pending: "bg-amber-500",
  confirmed: "bg-blue-500",
  processing: "bg-indigo-500",
  shipped: "bg-purple-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-500",
};

const PAYMENT_DOT = {
  paid: "bg-emerald-500",
  created: "bg-amber-500",
  failed: "bg-red-500",
};

const StatusDot = ({ status, map }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-gray-700">
    <span
      className={`h-2 w-2 rounded-full ${
        map[status?.toLowerCase()] || "bg-gray-400"
      }`}
    />
    {status || "Unknown"}
  </span>
);

const Thumb = ({ item, size = "h-12 w-12" }) => {
  const src = getProductImage(item);
  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100`}
    >
      {src ? (
        <img
          src={src}
          alt={getProductName(item)}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <Package size={18} className="text-gray-400" />
      )}
    </div>
  );
};

/* a row inside a summary card: label on the left, value on the right */
const Row = ({ label, value, dot }) => (
  <div className="flex items-center justify-between py-2.5 text-sm">
    <span className="inline-flex items-center gap-2 text-gray-600">
      {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
      {label}
    </span>
    <span className="font-semibold tabular-nums text-gray-900">{value}</span>
  </div>
);

/* shared shell for the three summary cards */
const SummaryCard = ({ icon: Icon, title, onViewMore, children }) => (
  <section className="flex flex-col rounded-2xl border border-gray-200 bg-white">
    <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F7C8] text-gray-900">
        <Icon size={18} />
      </div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    </div>

    <div className="flex-1 px-5 py-5">{children}</div>

    <button
      onClick={onViewMore}
      className="group flex items-center justify-between rounded-b-2xl border-t border-gray-100 px-5 py-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
    >
      View more
      <ArrowRight
        size={16}
        className="transition group-hover:translate-x-0.5"
      />
    </button>
  </section>
);

/* ---------- page ---------- */

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    user: null,
    cart: { items: [] },
    orders: [],
    payments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/user-data/my-data");

      setDashboardData({
        user: res.user || null,
        cart: res.cart || { items: [] },
        orders: res.orders || [],
        payments: res.payments || [],
      });
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(
        err.message || err.error || "Unable to load dashboard details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { user, cart, orders, payments } = dashboardData;

  /* ---- cart ---- */
  const cartItems = cart?.items || [];

  const cartQuantity = useMemo(
    () => cartItems.reduce((t, i) => t + (Number(i.qty) || 0), 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (t, i) =>
          t + (Number(i.productId?.price) || 0) * (Number(i.qty) || 0),
        0
      ),
    [cartItems]
  );

  /* ---- orders ---- */
  const statusOf = (o) => o.orderStatus?.toLowerCase();

  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed", "processing", "shipped"].includes(statusOf(o))
  );
  const deliveredOrders = orders.filter((o) => statusOf(o) === "delivered");
  const cancelledOrders = orders.filter((o) => statusOf(o) === "cancelled");

  const byNewest = (a, b) =>
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0);

  const latestOrder = [...orders].sort(byNewest)[0];

  /* ---- payments ---- */
  const amountOf = (p) => Number(p.totalAmount ?? p.amount ?? 0);
  const statusOfPayment = (p) => p.status?.toLowerCase();

  const paidPayments = payments.filter((p) => statusOfPayment(p) === "paid");
  const failedPayments = payments.filter(
    (p) => statusOfPayment(p) === "failed"
  );
  const initiatedPayments = payments.filter(
    (p) => statusOfPayment(p) === "created"
  );

  const totalPaid = paidPayments.reduce((t, p) => t + amountOf(p), 0);
  const latestPayment = [...payments].sort(byNewest)[0];

  /* ---- products ordered (cancelled orders are ignored) ---- */
  const productStats = useMemo(() => {
    const map = new Map();

    orders
      .filter((o) => o.orderStatus?.toLowerCase() !== "cancelled")
      .forEach((order) => {
        (order.items || []).forEach((item) => {
          const key = getProductKey(item);
          if (!key) return;

          const qty = Number(item.qty ?? item.quantity ?? 1) || 1;
          const existing = map.get(key);

          if (existing) {
            existing.units += qty;
          } else {
            map.set(key, { key, item, units: qty });
          }
        });
      });

    const list = [...map.values()].sort((a, b) => b.units - a.units);

    return {
      list,
      distinct: list.length,
      units: list.reduce((t, p) => t + p.units, 0),
    };
  }, [orders]);

  const topProduct = productStats.list[0];
  const runnersUp = productStats.list.slice(1, 3);

  /* ---- banner numbers ---- */
  const bannerStats = [
    {
      label: "Products in cart",
      value: cartQuantity,
      note: `${formatCurrency(cartTotal)} cart value`,
      path: "/user/cart",
    },
    {
      label: "Total paid",
      value: formatCurrency(totalPaid),
      note: `${paidPayments.length} successful ${
        paidPayments.length === 1 ? "payment" : "payments"
      }`,
      path: "/user/payments",
    },
    {
      label: "Orders placed",
      value: orders.length,
      note: `${activeOrders.length} in progress`,
      path: "/user/orders",
    },
  ];

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-6 pb-10">
        <div className="h-48 rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  /* ---------- error ---------- */
  if (error) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center text-center">
        <CircleAlert size={28} className="text-red-500" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          We couldn’t load your dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          <RefreshCw size={15} />
          Retry
        </button>
      </div>
    );
  }

  /* ---------- page ---------- */
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* CTA BANNER */}
      <section className="overflow-hidden rounded-2xl bg-[#171717] text-white">
        <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {greeting()}, {user?.name?.split(" ")[0] || "there"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              {cartQuantity > 0
                ? `You have ${cartQuantity} ${
                    cartQuantity === 1 ? "product" : "products"
                  } waiting in your cart. Ready to check out?`
                : "Your cart is empty. Pick something you like and we’ll take it from there."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  navigate(cartQuantity > 0 ? "/user/cart" : "/user/products")
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#D2E823] px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-[#BFD51B]"
              >
                {cartQuantity > 0 ? "Go to cart" : "Explore products"}
                <ArrowUpRight size={16} />
              </button>

              {cartQuantity > 0 && (
                <button
                  onClick={() => navigate("/user/products")}
                  className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Keep shopping
                </button>
              )}
            </div>
          </div>

          {/* numbers */}
          <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-3 sm:divide-x sm:divide-white/10">
            {bannerStats.map((s) => (
              <button
                key={s.label}
                onClick={() => navigate(s.path)}
                className="group text-left sm:px-6 sm:first:pl-0 sm:last:pr-0"
              >
                <p className="text-sm text-gray-400">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-gray-500 transition group-hover:text-gray-300">
                  {s.note}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* ORDER SUMMARY */}
        <SummaryCard
          icon={ShoppingBag}
          title="Order summary"
          onViewMore={() => navigate("/user/orders")}
        >
          <p className="text-sm text-gray-500">Total orders</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-gray-900">
            {orders.length}
          </p>

          <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
            <Row
              label="In progress"
              value={activeOrders.length}
              dot="bg-purple-500"
            />
            <Row
              label="Delivered"
              value={deliveredOrders.length}
              dot="bg-emerald-500"
            />
            <Row
              label="Cancelled"
              value={cancelledOrders.length}
              dot="bg-red-500"
            />
          </div>

          {latestOrder ? (
            <div className="mt-4">
              <p className="text-xs text-gray-500">Latest order</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    #{latestOrder.orderId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(latestOrder.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrency(latestOrder.totalAmount)}
                  </p>
                  <StatusDot
                    status={latestOrder.orderStatus}
                    map={ORDER_DOT}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              No orders yet. Your first order will appear here.
            </p>
          )}
        </SummaryCard>

        {/* PAYMENT SUMMARY */}
        <SummaryCard
          icon={CreditCard}
          title="Payment summary"
          onViewMore={() => navigate("/user/payments")}
        >
          <p className="text-sm text-gray-500">Total paid</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-gray-900">
            {formatCurrency(totalPaid)}
          </p>

          <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
            <Row
              label="Successful"
              value={paidPayments.length}
              dot="bg-emerald-500"
            />
            <Row
              label="Not completed"
              value={initiatedPayments.length}
              dot="bg-amber-500"
            />
            <Row
              label="Failed"
              value={failedPayments.length}
              dot="bg-red-500"
            />
          </div>

          {latestPayment ? (
            <div className="mt-4">
              <p className="text-xs text-gray-500">Latest payment</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium capitalize text-gray-900">
                    {latestPayment.paymentMethod || "Online"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(latestPayment.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrency(
                      latestPayment.totalAmount ?? latestPayment.amount,
                      latestPayment.currency || "INR"
                    )}
                  </p>
                  <StatusDot
                    status={latestPayment.status}
                    map={PAYMENT_DOT}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              No payments yet. Transactions will appear here.
            </p>
          )}
        </SummaryCard>

        {/* PRODUCTS SUMMARY */}
        <SummaryCard
          icon={Package}
          title="Products you order"
          onViewMore={() => navigate("/user/products")}
        >
          <div className="flex gap-8">
            <div>
              <p className="text-sm text-gray-500">Different products</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-gray-900">
                {productStats.distinct}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Units ordered</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-gray-900">
                {productStats.units}
              </p>
            </div>
          </div>

          {topProduct ? (
            <>
              <div className="mt-5 rounded-xl bg-[#F7F9E1] p-3.5">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <Trophy size={13} />
                  Most ordered
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <Thumb item={topProduct.item} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {getProductName(topProduct.item)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Ordered {topProduct.units}{" "}
                      {topProduct.units === 1 ? "time" : "times"}
                    </p>
                  </div>
                </div>
              </div>

              {runnersUp.length > 0 && (
                <ul className="mt-4 divide-y divide-gray-100">
                  {runnersUp.map((p) => (
                    <li
                      key={p.key}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <Thumb item={p.item} size="h-8 w-8" />
                      <p className="min-w-0 flex-1 truncate text-sm text-gray-700">
                        {getProductName(p.item)}
                      </p>
                      <span className="text-sm font-medium tabular-nums text-gray-900">
                        ×{p.units}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="mt-5 text-sm text-gray-500">
              Once you order, your most-ordered product shows up here.
            </p>
          )}
        </SummaryCard>
      </div>
    </div>
  );
}