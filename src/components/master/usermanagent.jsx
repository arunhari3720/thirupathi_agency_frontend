
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig/axiosconfig";
import {
  Search,
  Users,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Store,
  CalendarDays,
  ShieldCheck,
  UserRound,
  Filter,
} from "lucide-react";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/master-data/users",
        {
          params: {
            page,
            limit,
            search: search.trim() || undefined,
            userType: userType !== "all" ? userType : undefined,
          },
        }
      );

      setUsers(response.users || []);

      setPagination(
        response.pagination || {
          totalRecords: 0,
          currentPage: 1,
          totalPages: 1,
          limit,
        }
      );
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setError(
        err?.message || "Unable to fetch users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 350);

    return () => clearTimeout(timer);
  }, [page, limit, search, userType]);

  // Search and filter handlers
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleUserType = (value) => {
    setUserType(value);
    setPage(1);
  };

  const handleLimit = (value) => {
    setLimit(Number(value));
    setPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getUserTypeStyle = (type) => {
    const styles = {
      master: "bg-purple-100 text-purple-700",
      retailer: "bg-blue-100 text-blue-700",
      supermarket: "bg-orange-100 text-orange-700",
      customer: "bg-green-100 text-green-700",
      user: "bg-gray-100 text-gray-700",
    };

    return styles[type] || "bg-gray-100 text-gray-700";
  };

  const startRecord =
    pagination.totalRecords === 0
      ? 0
      : (page - 1) * limit + 1;

  const endRecord = Math.min(
    page * limit,
    pagination.totalRecords
  );

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
            Users Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and monitor all registered users.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#d4ed35] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c4dc25] disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Users
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Registered Users
              </p>

              <h2 className="mt-2 text-3xl font-black text-gray-900">
                {pagination.totalRecords.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="rounded-xl bg-[#eff7c9] p-3">
              <Users size={24} className="text-gray-900" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Page Records
              </p>

              <h2 className="mt-2 text-3xl font-black text-gray-900">
                {users.length}
              </h2>
            </div>

            <div className="rounded-xl bg-gray-100 p-3">
              <UserRound size={24} className="text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search name, email, phone or shop..."
              className="w-full rounded-xl border border-gray-200 bg-[#fafafa] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#c5df2c] focus:ring-2 focus:ring-[#d4ed35]/20"
            />
          </div>

          {/* User Type Filter */}
          <div className="relative w-full lg:w-56">
            <Filter
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <select
              value={userType}
              onChange={(e) => handleUserType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-[#fafafa] py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#c5df2c]"
            >
              <option value="all">All User Types</option>
              <option value="user">User</option>
              <option value="customer">Customer</option>
              <option value="retailer">Retailer</option>
              <option value="supermarket">Supermarket</option>
              <option value="master">Master</option>
            </select>
          </div>

          {/* Page Limit */}
          <select
            value={limit}
            onChange={(e) => handleLimit(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm font-medium outline-none focus:border-[#c5df2c] lg:w-32"
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-gray-900">
              All Users
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              User information and account details
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
              onClick={fetchUsers}
              className="ml-2 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="bg-[#fafbf8] text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Shop Name</th>
                <th className="px-6 py-4 font-bold">User Type</th>
                <th className="px-6 py-4 font-bold">Joined Date</th>
                <th className="px-6 py-4 text-center font-bold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <td key={i} className="px-6 py-5">
                        <div className="h-9 animate-pulse rounded-lg bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <Users
                      size={36}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-bold text-gray-700">
                      No users found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-[#fbfcf8]"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.profilePic?.url ? (
                          <img
                            src={user.profilePic.url}
                            alt={user.name}
                            className="h-11 w-11 rounded-full border border-gray-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf5c7] text-sm font-black text-gray-800">
                            {getInitials(user.name)}
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-gray-900">
                            {user.name || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            ID: {user._id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800">
                        {user.email || "N/A"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {user.phoneNo || "No phone"}
                      </p>
                    </td>

                    {/* Shop */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {user.shopName || "—"}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getUserTypeStyle(
                          user.userType
                        )}`}
                      >
                        {user.userType || "user"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedUser(user)}
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
            users
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

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-[#171717] px-6 pb-8 pt-7 text-white">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute right-5 top-5 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X size={19} />
              </button>

              <span className="rounded-full bg-[#d4ed35] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                User Profile
              </span>

              <div className="mt-6 flex items-center gap-4">
                {selectedUser.profilePic?.url ? (
                  <img
                    src={selectedUser.profilePic.url}
                    alt={selectedUser.name}
                    className="h-20 w-20 rounded-2xl border-2 border-white/20 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#d4ed35] text-2xl font-black text-black">
                    {getInitials(selectedUser.name)}
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-black">
                    {selectedUser.name || "Unknown User"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {selectedUser.email}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs capitalize">
                    {selectedUser.userType || "user"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-5 p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">
                Account Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <UserRound size={16} />
                    <span className="text-xs font-semibold">Full Name</span>
                  </div>
                  <p className="break-words text-sm font-bold text-gray-900">
                    {selectedUser.name || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <Mail size={16} />
                    <span className="text-xs font-semibold">Email</span>
                  </div>
                  <p className="break-all text-sm font-bold text-gray-900">
                    {selectedUser.email || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <Phone size={16} />
                    <span className="text-xs font-semibold">Phone Number</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedUser.phoneNo || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <Store size={16} />
                    <span className="text-xs font-semibold">Shop Name</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedUser.shopName || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-semibold">Account Type</span>
                  </div>
                  <p className="text-sm font-bold capitalize text-gray-900">
                    {selectedUser.userType || "user"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <CalendarDays size={16} />
                    <span className="text-xs font-semibold">Joined Date</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>

              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  User ID
                </p>

                <p className="break-all font-mono text-xs text-gray-700">
                  {selectedUser._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="w-full rounded-xl bg-[#d4ed35] py-3 text-sm font-black text-black transition hover:bg-[#c4dc25]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersManagement;
