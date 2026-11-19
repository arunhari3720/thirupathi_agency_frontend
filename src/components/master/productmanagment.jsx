
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosconfig/axiosconfig";

import {
  Package,
  Search,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  IndianRupee,
  Boxes,
  AlertTriangle,
  Ban,
  CalendarDays,
  Tag,
} from "lucide-react";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [search, setSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/master-data/products",
        {
          params: {
            page,
            limit,
            search: search.trim() || undefined,
            stockStatus:
              stockStatus !== "all" ? stockStatus : undefined,
            minPrice: minPrice !== "" ? minPrice : undefined,
            maxPrice: maxPrice !== "" ? maxPrice : undefined,
          },
        }
      );

      setProducts(response.products || []);

      setPagination(
        response.pagination || {
          totalRecords: 0,
          currentPage: 1,
          totalPages: 1,
          limit,
        }
      );
    } catch (err) {
      console.error("Fetch Products Error:", err);

      setError(
        err?.message || "Unable to fetch products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 350);

    return () => clearTimeout(timer);
  }, [page, limit, search, stockStatus, minPrice, maxPrice]);

  // Helpers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStockStatus = (qty) => {
    const quantity = Number(qty) || 0;

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        style: "bg-red-100 text-red-700",
        icon: <Ban size={14} />,
      };
    }

    if (quantity <= 10) {
      return {
        label: "Low Stock",
        style: "bg-amber-100 text-amber-700",
        icon: <AlertTriangle size={14} />,
      };
    }

    return {
      label: "In Stock",
      style: "bg-green-100 text-green-700",
      icon: <Boxes size={14} />,
    };
  };

  const clearFilters = () => {
    setSearch("");
    setStockStatus("all");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const handleLimit = (value) => {
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

  const inStockCount = products.filter(
    (product) => Number(product.qty) > 10
  ).length;

  const lowStockCount = products.filter(
    (product) => Number(product.qty) > 0 && Number(product.qty) <= 10
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.qty) === 0
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
            Products Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your product catalogue, pricing and inventory.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#d4ed35] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c4dc25] disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Products
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <h2 className="mt-2 text-3xl font-black text-gray-900">
                {pagination.totalRecords.toLocaleString("en-IN")}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Based on current filters
              </p>
            </div>

            <div className="rounded-xl bg-[#eff7c9] p-3">
              <Package size={24} className="text-gray-900" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                In Stock
              </p>

              <h2 className="mt-2 text-3xl font-black text-green-600">
                {inStockCount}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Current page records
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <Boxes size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Low Stock
              </p>

              <h2 className="mt-2 text-3xl font-black text-amber-600">
                {lowStockCount}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Current page records
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3">
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Out of Stock
              </p>

              <h2 className="mt-2 text-3xl font-black text-red-600">
                {outOfStockCount}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Current page records
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3">
              <Ban size={24} className="text-red-600" />
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
              Filter Products
            </h3>
          </div>

          <button
            onClick={clearFilters}
            className="text-xs font-bold text-gray-500 underline transition hover:text-black"
          >
            Clear filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* Search */}
          <div className="relative xl:col-span-2">
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
              placeholder="Search product name or product code..."
              className="w-full rounded-xl border border-gray-200 bg-[#fafafa] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#c5df2c] focus:ring-2 focus:ring-[#d4ed35]/20"
            />
          </div>

          {/* Stock Filter */}
          <select
            value={stockStatus}
            onChange={(e) => {
              setStockStatus(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Page Limit */}
          <select
            value={limit}
            onChange={(e) => handleLimit(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>

          {/* Min Price */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Minimum Price (₹)
            </label>

            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
              placeholder="Min price"
              className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              Maximum Price (₹)
            </label>

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              placeholder="Max price"
              className="w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-[#c5df2c]"
            />
          </div>

        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-gray-900">
              All Products
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Product catalogue and inventory information
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
              onClick={fetchProducts}
              className="ml-2 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">

            <thead>
              <tr className="bg-[#fafbf8] text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-bold">
                  Product
                </th>

                <th className="px-6 py-4 font-bold">
                  Product Code
                </th>

                <th className="px-6 py-4 font-bold">
                  Price
                </th>

                <th className="px-6 py-4 font-bold">
                  Available Stock
                </th>

                <th className="px-6 py-4 font-bold">
                  Stock Status
                </th>

                <th className="px-6 py-4 font-bold">
                  Created Date
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
                    {Array.from({ length: 7 }).map((_, i) => (
                      <td key={i} className="px-6 py-5">
                        <div className="h-9 animate-pulse rounded-lg bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <Package
                      size={36}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-bold text-gray-700">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stock = getStockStatus(product.qty);

                  return (
                    <tr
                      key={product._id}
                      className="transition hover:bg-[#fbfcf8]"
                    >

                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image?.url ? (
                            <img
                              src={product.image.url}
                              alt={product.productName}
                              className="h-12 w-12 rounded-xl border border-gray-100 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                              <Package
                                size={21}
                                className="text-gray-400"
                              />
                            </div>
                          )}

                          <div>
                            <p className="font-bold text-gray-900">
                              {product.productName || "Unnamed Product"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID: {product._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-mono text-xs font-bold text-gray-700">
                          {product.productCode || "N/A"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-900">
                          {formatCurrency(product.price)}
                        </p>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800">
                          {Number(product.qty) || 0}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">
                          units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${stock.style}`}
                        >
                          {stock.icon}
                          {stock.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(product.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#eff6d1] px-3 py-2 text-xs font-bold text-gray-900 transition hover:bg-[#dced9c]"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>

                    </tr>
                  );
                })
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
            products
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

      {/* Product Details Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="relative bg-[#171717] px-6 pb-7 pt-7 text-white">

              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute right-5 top-5 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X size={19} />
              </button>

              <span className="rounded-full bg-[#d4ed35] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                Product Details
              </span>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">

                {selectedProduct.image?.url ? (
                  <img
                    src={selectedProduct.image.url}
                    alt={selectedProduct.productName}
                    className="h-28 w-28 rounded-2xl border-2 border-white/20 object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10">
                    <Package size={36} />
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-black">
                    {selectedProduct.productName}
                  </h2>

                  <p className="mt-2 font-mono text-sm text-gray-400">
                    {selectedProduct.productCode}
                  </p>

                  <h3 className="mt-3 text-2xl font-black text-[#d4ed35]">
                    {formatCurrency(selectedProduct.price)}
                  </h3>
                </div>

              </div>
            </div>

            {/* Details */}
            <div className="space-y-5 p-6">

              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">
                Inventory Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <Tag size={16} />
                    <span className="text-xs font-semibold">
                      Product Name
                    </span>
                  </div>

                  <p className="break-words text-sm font-bold text-gray-900">
                    {selectedProduct.productName || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <Package size={16} />
                    <span className="text-xs font-semibold">
                      Product Code
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-900">
                    {selectedProduct.productCode || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <IndianRupee size={16} />
                    <span className="text-xs font-semibold">
                      Product Price
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <Boxes size={16} />
                    <span className="text-xs font-semibold">
                      Available Quantity
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-900">
                    {Number(selectedProduct.qty) || 0} Units
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <Filter size={16} />
                    <span className="text-xs font-semibold">
                      Stock Status
                    </span>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStockStatus(
                      selectedProduct.qty
                    ).style}`}
                  >
                    {getStockStatus(selectedProduct.qty).label}
                  </span>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-gray-400">
                    <CalendarDays size={16} />
                    <span className="text-xs font-semibold">
                      Created Date
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-900">
                    {formatDate(selectedProduct.createdAt)}
                  </p>
                </div>

              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Product ID
                </p>

                <p className="break-all font-mono text-xs text-gray-700">
                  {selectedProduct._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
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

export default ProductsManagement;
