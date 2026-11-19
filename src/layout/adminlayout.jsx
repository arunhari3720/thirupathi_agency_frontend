
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  UserRound,
  User,
  IndianRupee,
  Cuboid,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    path: "/admin/usermanagement",
    icon: User,
  },
  {
    name: "Payments Management",
    path: "/admin/payment",
    icon: IndianRupee,
  },
  {
    name: "Products Management",
    path: "/admin/products",
    icon: Cuboid,
  },
  {
    name: "Manage Products",
    path: "/admin/products/add",
    icon: ShoppingBag,
  },
  {
    name: "Manage Orders",
    path: "/admin/orders",
    icon: Package,
  },
  {
    name: "Manage Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(
    localStorage.getItem("masterUser") || "{}"
  );

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("masterToken");
    localStorage.removeItem("masterUser");

    navigate("/master/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3] text-[#252525]">

      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 h-[76px] border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-2xl">
        <div className="flex h-full items-center justify-between px-4 md:px-8">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:bg-[#FFE45C]"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

            <h1 className="text-lg font-extrabold tracking-tight md:text-2xl">
              Thirupathi{" "}
              <span className="text-[#B99A00]">Agencies</span>
            </h1>

            <span className="hidden rounded-lg bg-[#FFE45C]/50 px-3 py-1 text-xs font-bold text-gray-800 sm:block">
              ADMIN PANEL
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 md:gap-5">

            {/* NOTIFICATION */}
            <button
              className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:bg-[#FFE45C] sm:flex"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* ADMIN PROFILE - LOGOUT */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all hover:border-red-200 hover:bg-red-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE45C] transition group-hover:bg-red-100">
                <UserRound
                  size={19}
                  className="group-hover:hidden"
                />

                <LogOut
                  size={18}
                  className="hidden text-red-500 group-hover:block"
                />
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold group-hover:text-red-600">
                  {admin.name || "Admin"}
                </p>

                <p className="text-[10px] text-gray-500">
                  Click to logout
                </p>
              </div>
            </button>

          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="pt-[76px]">

        {/* SIDEBAR */}
        <aside
          className={`
            fixed bottom-0 left-0 top-[76px] z-40
            flex w-[260px] flex-col
            border-r border-white/80
            bg-white/95 backdrop-blur-2xl
            transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >

          {/* SCROLLABLE MENU */}
          <div className="flex-1 overflow-y-auto px-4 py-6">

            <div className="mb-7 px-3">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-gray-400">
                Admin Menu
              </p>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${
                        isActive
                          ? "bg-[#FFE45C] text-black shadow-md shadow-yellow-200/50"
                          : "text-gray-600 hover:bg-yellow-50 hover:text-black"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon size={19} />

                          <span className="text-sm font-semibold">
                            {item.name}
                          </span>
                        </div>

                        <ChevronRight
                          size={16}
                          className={`transition-transform ${
                            isActive
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

          </div>

          {/* FIXED BOTTOM SECTION */}
          <div className="shrink-0 border-t border-gray-100 bg-white p-4">

            {/* ADMIN INFO */}
            <div className="mb-3 rounded-xl border border-yellow-100 bg-yellow-50/70 p-4">
              <p className="text-xs font-bold text-gray-800">
                Admin Access
              </p>

              <p className="mt-1 truncate text-[11px] text-gray-500">
                {admin.email || "Administrator"}
              </p>
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-50"
            >
              <LogOut size={19} />
              Logout
            </button>

          </div>
        </aside>

        {/* SIDEBAR OVERLAY - MOBILE */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
          />
        )}

        {/* MAIN CONTENT */}
        <main
          className={`
            min-h-[calc(100vh-76px)]
            min-w-0 p-4 transition-all duration-300
            md:p-8
            ${
              sidebarOpen
                ? "md:ml-[260px]"
                : "md:ml-0"
            }
          `}
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
