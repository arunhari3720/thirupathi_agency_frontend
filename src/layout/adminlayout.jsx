
// import React, { useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";

// import {
//   Menu,
//   X,
//   LayoutDashboard,
//   Users,
//   ShoppingBag,
//   Package,
//   BarChart3,
//   Settings,
//   LogOut,
//   ChevronRight,
//   Bell,
//   UserRound,
//   User,
//   IndianRupee,
//   Cuboid,
// } from "lucide-react";

// const menuItems = [
//   {
//     name: "Dashboard",
//     path: "/admin/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "User Management",
//     path: "/admin/usermanagement",
//     icon: User,
//   },
//   {
//     name: "Payments Management",
//     path: "/admin/payment",
//     icon: IndianRupee,
//   },
//   {
//     name: "Products Management",
//     path: "/admin/products",
//     icon: Cuboid,
//   },
//   {
//     name: "Manage Products",
//     path: "/admin/products/add",
//     icon: ShoppingBag,
//   },
//   {
//     name: "Manage Orders",
//     path: "/admin/orders",
//     icon: Package,
//   },
//   {
//     name: "Manage Users",
//     path: "/admin/users",
//     icon: Users,
//   },
//   {
//     name: "Analytics",
//     path: "/admin/analytics",
//     icon: BarChart3,
//   },
//   {
//     name: "Settings",
//     path: "/admin/settings",
//     icon: Settings,
//   },
// ];

// function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const navigate = useNavigate();

//   const admin = JSON.parse(
//     localStorage.getItem("masterUser") || "{}"
//   );

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem("masterToken");
//     localStorage.removeItem("masterUser");

//     navigate("/master/login", { replace: true });
//   };

//   return (
//     <div className="min-h-screen bg-[#F7F7F3] text-[#252525]">

//       {/* HEADER */}
//       <header className="fixed left-0 right-0 top-0 z-50 h-[76px] border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-2xl">
//         <div className="flex h-full items-center justify-between px-4 md:px-8">

//           {/* LEFT */}
//           <div className="flex items-center gap-4">

//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:bg-[#FFE45C]"
//               aria-label="Toggle sidebar"
//             >
//               {sidebarOpen ? (
//                 <X size={22} />
//               ) : (
//                 <Menu size={22} />
//               )}
//             </button>

//             <h1 className="text-lg font-extrabold tracking-tight md:text-2xl">
//               Thirupathi{" "}
//               <span className="text-[#B99A00]">Agencies</span>
//             </h1>

//             <span className="hidden rounded-lg bg-[#FFE45C]/50 px-3 py-1 text-xs font-bold text-gray-800 sm:block">
//               ADMIN PANEL
//             </span>
//           </div>

//           {/* RIGHT */}
//           <div className="flex items-center gap-3 md:gap-5">

//             {/* NOTIFICATION */}
//             <button
//               className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:bg-[#FFE45C] sm:flex"
//               aria-label="Notifications"
//             >
//               <Bell size={20} />
//               <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
//             </button>

//             {/* ADMIN PROFILE - LOGOUT */}
//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all hover:border-red-200 hover:bg-red-50"
//             >
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE45C] transition group-hover:bg-red-100">
//                 <UserRound
//                   size={19}
//                   className="group-hover:hidden"
//                 />

//                 <LogOut
//                   size={18}
//                   className="hidden text-red-500 group-hover:block"
//                 />
//               </div>

//               <div className="hidden text-left sm:block">
//                 <p className="text-sm font-bold group-hover:text-red-600">
//                   {admin.name || "Admin"}
//                 </p>

//                 <p className="text-[10px] text-gray-500">
//                   Click to logout
//                 </p>
//               </div>
//             </button>

//           </div>
//         </div>
//       </header>

//       {/* BODY */}
//       <div className="pt-[76px]">

//         {/* SIDEBAR */}
//         <aside
//           className={`
//             fixed bottom-0 left-0 top-[76px] z-40
//             flex w-[260px] flex-col
//             border-r border-white/80
//             bg-white/95 backdrop-blur-2xl
//             transition-transform duration-300 ease-in-out
//             ${
//               sidebarOpen
//                 ? "translate-x-0"
//                 : "-translate-x-full"
//             }
//           `}
//         >

//           {/* SCROLLABLE MENU */}
//           <div className="flex-1 overflow-y-auto px-4 py-6">

//             <div className="mb-7 px-3">
//               <p className="text-[11px] font-bold uppercase tracking-[2px] text-gray-400">
//                 Admin Menu
//               </p>
//             </div>

//             <nav className="space-y-2">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;

//                 return (
//                   <NavLink
//                     key={item.path}
//                     to={item.path}
//                     className={({ isActive }) =>
//                       `group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${
//                         isActive
//                           ? "bg-[#FFE45C] text-black shadow-md shadow-yellow-200/50"
//                           : "text-gray-600 hover:bg-yellow-50 hover:text-black"
//                       }`
//                     }
//                   >
//                     {({ isActive }) => (
//                       <>
//                         <div className="flex items-center gap-3">
//                           <Icon size={19} />

//                           <span className="text-sm font-semibold">
//                             {item.name}
//                           </span>
//                         </div>

//                         <ChevronRight
//                           size={16}
//                           className={`transition-transform ${
//                             isActive
//                               ? "translate-x-0 opacity-100"
//                               : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
//                           }`}
//                         />
//                       </>
//                     )}
//                   </NavLink>
//                 );
//               })}
//             </nav>

//           </div>

//           {/* FIXED BOTTOM SECTION */}
//           <div className="shrink-0 border-t border-gray-100 bg-white p-4">

//             {/* ADMIN INFO */}
//             <div className="mb-3 rounded-xl border border-yellow-100 bg-yellow-50/70 p-4">
//               <p className="text-xs font-bold text-gray-800">
//                 Admin Access
//               </p>

//               <p className="mt-1 truncate text-[11px] text-gray-500">
//                 {admin.email || "Administrator"}
//               </p>
//             </div>

//             {/* LOGOUT */}
//             <button
//               onClick={handleLogout}
//               className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-50"
//             >
//               <LogOut size={19} />
//               Logout
//             </button>

//           </div>
//         </aside>

//         {/* SIDEBAR OVERLAY - MOBILE */}
//         {sidebarOpen && (
//           <div
//             onClick={() => setSidebarOpen(false)}
//             className="fixed inset-0 z-30 bg-black/30 md:hidden"
//           />
//         )}

//         {/* MAIN CONTENT */}
//         <main
//           className={`
//             min-h-[calc(100vh-76px)]
//             min-w-0 p-4 transition-all duration-300
//             md:p-8
//             ${
//               sidebarOpen
//                 ? "md:ml-[260px]"
//                 : "md:ml-0"
//             }
//           `}
//         >
//           <div className="mx-auto w-full max-w-[1600px]">
//             <Outlet />
//           </div>
//         </main>

//       </div>
//     </div>
//   );
// }

// export default AdminLayout;
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  UserRound,
  User,
  IndianRupee,
  Cuboid,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
} from "lucide-react";

/* Desktop sidebar menu */
const sidebarMenu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", path: "/admin/usermanagement", icon: User },
  { name: "Payments Management", path: "/admin/payment", icon: IndianRupee },
  { name: "Products Management", path: "/admin/products", icon: Cuboid, end: true },
  { name: "Manage Products", path: "/admin/products/add", icon: ShoppingBag },
  { name: "Manage Orders", path: "/admin/orders", icon: Package },
  // { name: "Manage Users", path: "/admin/users", icon: Users },
  // { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  // { name: "Settings", path: "/admin/settings", icon: Settings },
];

/* Mobile bottom tab bar */
const bottomNav = [
  { name: "Home", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Cuboid, end: true },
  { name: "Add", path: "/admin/products/add", icon: Plus, primary: true },
  { name: "Orders", path: "/admin/orders", icon: Package },
];

/* "More" sheet on mobile */
const moreMenu = [
  { name: "User Management", path: "/admin/usermanagement", icon: User },
  { name: "Payments Management", path: "/admin/payment", icon: IndianRupee },
  // { name: "Manage Users", path: "/admin/users", icon: Users },
  // { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  // { name: "Settings", path: "/admin/settings", icon: Settings },
];

/* Profile dropdown links (everything not in the bottom bar is reachable here) */
const profileMenu = [
  { name: "Manage products", path: "/admin/products/add", icon: ShoppingBag },
  { name: "Manage users", path: "/admin/users", icon: Users },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const Avatar = ({ admin, size = "h-9 w-9" }) => (
  <div
    className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFE45C] text-sm font-bold text-gray-900`}
  >
    {admin?.profilePic?.url ? (
      <img
        src={admin.profilePic.url}
        alt={admin.name || "Admin"}
        className="h-full w-full object-cover"
      />
    ) : admin?.name ? (
      admin.name.charAt(0).toUpperCase()
    ) : (
      <UserRound size={18} />
    )}
  </div>
);

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop sidebar: hidden by default, the round button under the header toggles it
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef(null);

  const admin = JSON.parse(localStorage.getItem("masterUser") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("masterToken");
    localStorage.removeItem("masterUser");
    setLogoutOpen(false);
    navigate("/master/login", { replace: true });
  };

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setLogoutOpen(false);
      setMenuOpen(false);
      setMoreOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = logoutOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [logoutOpen]);

  const openLogoutModal = () => {
    setMenuOpen(false);
    setMoreOpen(false);
    setLogoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3] text-[#252525]">
      {/* ================= HEADER ================= */}
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <NavLink
              to="/admin/dashboard"
              className="text-lg font-extrabold tracking-tight md:text-xl"
            >
              Thirupathi <span className="text-[#B99A00]">Agencies</span>
            </NavLink>

            <span className="hidden rounded-lg bg-[#FFE45C]/50 px-3 py-1 text-xs font-bold text-gray-800 sm:block">
              ADMIN PANEL
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Notifications */}
            <button
              className="relative hidden h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 sm:flex"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-2.5 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <Avatar admin={admin} />
                <span className="hidden max-w-[110px] truncate text-sm font-semibold md:block">
                  {admin.name || "Admin"}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-gray-500 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] w-64 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                >
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5">
                    <Avatar admin={admin} size="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {admin.name || "Admin"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {admin.email || "Administrator"}
                      </p>
                    </div>
                  </div>

                  <div className="p-1.5">
                    {profileMenu.map(({ name, path, icon: Icon }) => (
                      <button
                        key={path}
                        role="menuitem"
                        onClick={() => navigate(path)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
                      >
                        <Icon size={17} className="text-gray-500" />
                        {name}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 p-1.5">
                    <button
                      role="menuitem"
                      onClick={openLogoutModal}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= DESKTOP: ROUND TOGGLE UNDER HEADER ================= */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        aria-expanded={sidebarOpen}
        aria-controls="admin-sidebar"
        className={`fixed top-[76px] z-40 hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-all duration-300 hover:bg-[#FFE45C] hover:text-black lg:flex ${
          sidebarOpen ? "left-[244px]" : "left-2"
        }`}
      >
        <ChevronRight
          size={17}
          className={`transition-transform duration-300 ${
            sidebarOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className={`fixed bottom-0 left-0 top-16 z-30 hidden w-[260px] flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-8">
          <p className="mb-3 px-3 text-xs font-semibold text-gray-400">
            Admin menu
          </p>

          <nav className="space-y-1">
            {sidebarMenu.map(({ name, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                tabIndex={sidebarOpen ? 0 : -1}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#FFE45C] text-black"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`
                }
              >
                <Icon size={19} />
                {name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="shrink-0 space-y-3 border-t border-gray-100 p-4">
          <div className="rounded-xl border border-yellow-100 bg-yellow-50/70 p-3.5">
            <p className="text-xs font-bold text-gray-800">Admin access</p>
            <p className="mt-1 truncate text-[11px] text-gray-500">
              {admin.email || "Administrator"}
            </p>
          </div>

          <button
            onClick={openLogoutModal}
            tabIndex={sidebarOpen ? 0 : -1}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main
        className={`min-w-0 px-4 pb-28 pt-24 transition-all duration-300 md:px-8 lg:pb-12 lg:pr-8 ${
          sidebarOpen ? "lg:ml-[260px] lg:pl-8" : "lg:ml-0 lg:pl-14"
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px]">
          <Outlet />
        </div>
      </main>

      {/* ================= MOBILE BOTTOM TAB BAR ================= */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        aria-label="Primary"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {bottomNav.map(({ name, path, icon: Icon, end, primary }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                    isActive ? "text-black" : "text-gray-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
                        primary
                          ? "bg-black text-white"
                          : isActive
                          ? "bg-[#FFE45C]"
                          : ""
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    {name}
                  </>
                )}
              </NavLink>
            </li>
          ))}

          <li>
            <button
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              className="flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-gray-500 transition"
            >
              <span className="flex h-7 w-12 items-center justify-center rounded-full">
                <MoreHorizontal size={20} />
              </span>
              More
            </button>
          </li>
        </ul>
      </nav>

      {/* ================= MOBILE "MORE" SHEET ================= */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/50 lg:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="More"
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-2xl bg-white p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-2xl"
          >
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200" />

            <div className="space-y-1">
              {moreMenu.map(({ name, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#FFE45C] text-black"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={19} />
                  {name}
                </NavLink>
              ))}
            </div>

            <div className="mt-2 border-t border-gray-100 pt-2">
              <button
                onClick={openLogoutModal}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LOGOUT CONFIRM MODAL ================= */}
      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setLogoutOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <LogOut size={20} />
            </div>

            <h2
              id="logout-title"
              className="mt-4 text-lg font-semibold text-gray-900"
            >
              Log out of the admin panel?
            </h2>

            <p className="mt-1.5 text-sm text-gray-500">
              You’ll need to sign in again to manage users, orders and
              payments.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                autoFocus
                onClick={() => setLogoutOpen(false)}
                className="rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Stay signed in
              </button>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;