
// import React, { useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   X,
//   LayoutDashboard,
//   ShoppingBag,
//   ShoppingCart,
//   CreditCard,
//   Package,
//   UserRound,
//   LogOut,
//   ChevronRight,
//   Bell,
// } from "lucide-react";

// const menuItems = [
//   { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
//   { name: "Products", path: "/user/products", icon: ShoppingBag },
//   { name: "My Cart", path: "/user/cart", icon: ShoppingCart },
//   { name: "Checkout", path: "/user/checkout", icon: CreditCard },
//   { name: "My Orders", path: "/user/orders", icon: Package },
//   { name: "My Profile", path: "/user/profile", icon: UserRound },
// ];

// function UserLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login", { replace: true });
//   };

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

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
//               {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>

//             <h1 className="text-lg font-extrabold tracking-tight md:text-2xl">
//               Thirupathi <span className="text-[#B99A00]">Agencies</span>
//             </h1>
//           </div>

//           {/* RIGHT */}
//           <div className="flex items-center gap-3 md:gap-5">

//             {/* CART */}
//             <button
//               onClick={() => navigate("/user/cart")}
//               className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:bg-[#FFE45C]"
//               aria-label="Shopping cart"
//             >
//               <ShoppingCart size={21} />
//               <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFE45C] px-1 text-[10px] font-bold">
//                 0
//               </span>
//             </button>

//             {/* NOTIFICATION */}
//             <button
//               className="hidden h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:bg-[#FFE45C] sm:flex"
//               aria-label="Notifications"
//             >
//               <Bell size={20} />
//             </button>

//             {/* PROFILE - LOGOUT */}
//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className="flex items-center gap-2 rounded-full border border-white bg-white/80 py-1.5 pl-1.5 pr-3 shadow-sm transition-all hover:bg-red-50"
//             >
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE45C]">
//                 <UserRound size={19} />
//               </div>

//               <div className="hidden text-left sm:block">
//                 <p className="text-sm font-bold">
//                   {user.name || "User"}
//                 </p>
//                 <p className="text-[10px] text-gray-500">
//                   Click to logout
//                 </p>
//               </div>

//               <LogOut size={16} className="hidden text-red-500 sm:block" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* CONTENT WRAPPER */}
//       <div className="flex min-h-screen pt-[76px]">

//         {/* MOBILE OVERLAY */}
//         {sidebarOpen && (
//           <div
//             onClick={() => setSidebarOpen(false)}
//             className="fixed inset-0 top-[76px] z-30 bg-black/40 md:hidden"
//           />
//         )}

//         {/* SIDEBAR */}
//         <aside
//           className={`fixed bottom-0 left-0 top-[76px] z-40 flex w-[260px] flex-col border-r border-white/80 bg-white/95 shadow-xl backdrop-blur-2xl transition-transform duration-300 ease-in-out ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           {/* SIDEBAR MENU - SCROLLABLE */}
//           <div className="flex-1 overflow-y-auto px-4 py-6">

//             <div className="mb-7 px-3">
//               <p className="text-[11px] font-bold uppercase tracking-[2px] text-gray-400">
//                 Main Menu
//               </p>
//             </div>

//             <nav className="space-y-2">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;

//                 return (
//                   <NavLink
//                     key={item.path}
//                     to={item.path}
//                     onClick={() => {
//                       if (window.innerWidth < 768) {
//                         setSidebarOpen(false);
//                       }
//                     }}
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

//           {/* SIDEBAR BOTTOM - LOGOUT FIXED */}
//           <div className="shrink-0 border-t border-gray-100 bg-white p-4">
//             <button
//               onClick={handleLogout}
//               className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-50"
//             >
//               <LogOut size={19} />
//               Logout
//             </button>
//           </div>
//         </aside>

//         {/* MAIN CONTENT */}
//         <main
//           className={`min-h-[calc(100vh-76px)] min-w-0 flex-1 p-4 transition-all duration-300 md:p-8 ${
//             sidebarOpen ? "md:ml-[260px]" : "md:ml-0"
//           }`}
//         >
//           <div className="mx-auto w-full max-w-[1600px]">
//             <Outlet />
//           </div>
//         </main>

//       </div>
//     </div>
//   );
// }

// export default UserLayout;
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  UserRound,
  Wallet,
  LogOut,
  Bell,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

/* Desktop sidebar menu */
const sidebarMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/user/products", icon: ShoppingBag },
  { name: "My Cart", path: "/user/cart", icon: ShoppingCart },
  { name: "My Orders", path: "/user/orders", icon: Package },
  { name: "Payments", path: "/user/payments", icon: Wallet },
  { name: "My Profile", path: "/user/profile", icon: UserRound },
];

/* Mobile bottom tab bar (unchanged) */
const bottomNav = [
  { name: "Home", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/user/products", icon: ShoppingBag },
  { name: "Cart", path: "/user/cart", icon: ShoppingCart },
  { name: "Orders", path: "/user/orders", icon: Package },
  { name: "Profile", path: "/user/profile", icon: UserRound },
];

/* Profile dropdown links */
const profileMenu = [
  { name: "View profile", path: "/user/profile", icon: UserRound },
  { name: "View cart", path: "/user/cart", icon: ShoppingCart },
  { name: "View orders", path: "/user/orders", icon: Package },
  { name: "Payments", path: "/user/payments", icon: Wallet },
];

const Avatar = ({ user, size = "h-9 w-9" }) => (
  <div
    className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FFE45C] text-sm font-bold text-gray-900`}
  >
    {user?.profilePic?.url ? (
      <img
        src={user.profilePic.url}
        alt={user.name || "Profile"}
        className="h-full w-full object-cover"
      />
    ) : user?.name ? (
      user.name.charAt(0).toUpperCase()
    ) : (
      <UserRound size={18} />
    )}
  </div>
);

function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop sidebar: hidden by default, the round button under the header toggles it
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // TODO: replace with your real cart count (context / redux / API)
  const cartCount = 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLogoutOpen(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    setMenuOpen(false);
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
    setLogoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3] text-[#252525]">
      {/* ================= HEADER ================= */}
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between gap-4 px-4 md:px-8">
          <NavLink
            to="/user/dashboard"
            className="text-lg font-extrabold tracking-tight md:text-xl"
          >
            Thirupathi <span className="text-[#B99A00]">Agencies</span>
          </NavLink>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Cart (tablet/desktop — mobile has it in the bottom bar) */}
            <button
              onClick={() => navigate("/user/cart")}
              className="relative hidden h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 sm:flex"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFE45C] px-1 text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 sm:flex"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-2.5 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <Avatar user={user} />
                <span className="hidden max-w-[110px] truncate text-sm font-semibold md:block">
                  {user.name || "User"}
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
                    <Avatar user={user} size="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name || "User"}
                      </p>
                      {user.email && (
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      )}
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
        aria-controls="desktop-sidebar"
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
        id="desktop-sidebar"
        aria-label="Main navigation"
        className={`fixed bottom-0 left-0 top-16 z-30 hidden w-[260px] flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-8">
          <p className="mb-3 px-3 text-xs font-semibold text-gray-400">
            Menu
          </p>

          <nav className="space-y-1">
            {sidebarMenu.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
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

        <div className="shrink-0 border-t border-gray-100 p-4">
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
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* ================= MOBILE BOTTOM TAB BAR ================= */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        aria-label="Primary"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {bottomNav.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                    isActive ? "text-black" : "text-gray-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`relative flex h-7 w-12 items-center justify-center rounded-full transition ${
                        isActive ? "bg-[#FFE45C]" : ""
                      }`}
                    >
                      <Icon size={20} />
                      {name === "Cart" && cartCount > 0 && (
                        <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                          {cartCount}
                        </span>
                      )}
                    </span>
                    {name}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

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
              Log out of your account?
            </h2>

            <p className="mt-1.5 text-sm text-gray-500">
              You’ll need to sign in again to see your cart and orders.
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

export default UserLayout;