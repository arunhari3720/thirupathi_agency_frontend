
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  Package,
  IndianRupee,
  Hash,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import axios from "../../axiosconfig/axiosconfig";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    price: "",
    qty: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // IMAGE UPLOAD
  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image file.",
      });
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size should be less than 5MB.",
      });
      e.target.value = "";
      return;
    }

    setImage(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setMessage({ type: "", text: "" });
  };

  // REMOVE IMAGE
  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  // CREATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!image) {
      setMessage({
        type: "error",
        text: "Please upload a product image.",
      });
      return;
    }

    if (
      !formData.productName.trim() ||
      !formData.productCode.trim() ||
      formData.price === "" ||
      formData.qty === ""
    ) {
      setMessage({
        type: "error",
        text: "Please fill all required fields.",
      });
      return;
    }

    if (
      !Number.isFinite(Number(formData.price)) ||
      !Number.isFinite(Number(formData.qty)) ||
      Number(formData.price) < 0 ||
      Number(formData.qty) < 0
    ) {
      setMessage({
        type: "error",
        text: "Price and quantity must be valid non-negative numbers.",
      });
      return;
    }

    const token = localStorage.getItem("masterToken");

    if (!token) {
      setMessage({
        type: "error",
        text: "Admin session expired. Please login again.",
      });
      return;
    }

    const data = new FormData();

    data.append("productName", formData.productName.trim());
    data.append(
      "productCode",
      formData.productCode.trim().toUpperCase()
    );
    data.append("price", formData.price);
    data.append("qty", formData.qty);
    data.append("image", image);

    try {
      setLoading(true);

      // DEBUG
      console.log("Selected Image:", image);

      for (const [key, value] of data.entries()) {
        console.log(
          key,
          value instanceof File
            ? {
                name: value.name,
                type: value.type,
                size: value.size,
              }
            : value
        );
      }

      // AXIOS REQUEST
      const response = await axios.post(
        "/master/product/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data ?? response;

      if (result.success) {
        setMessage({
          type: "success",
          text: "Product added successfully!",
        });

        setFormData({
          productName: "",
          productCode: "",
          price: "",
          qty: "",
        });

        setImage(null);
        setPreview("");

        setTimeout(() => {
          navigate("/admin/products");
        }, 1200);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to add product.",
        });
      }
    } catch (error) {
      console.error("Add Product Error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // COMMON INPUT CLASS
  const inputClass =
    "block w-full min-w-0 box-border rounded-xl border border-gray-200 bg-gray-50/50 py-3.5 pl-14 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100";

  // COMMON ICON CLASS
  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400";

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-400">
            Admin / Products / Add Product
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
            Add New Product
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add a new product to your agency inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl border border-white bg-white/85 shadow-sm backdrop-blur-xl"
      >
        {/* FORM TITLE */}
        <div className="border-b border-gray-100 px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE45C]">
              <Package size={22} />
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900">
                Product Information
              </h3>

              <p className="text-xs text-gray-400">
                Enter the product details below
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 p-5 md:grid-cols-2 md:p-8">

          {/* LEFT - PRODUCT DETAILS */}
          <div className="space-y-5">

            {/* PRODUCT NAME */}
            <div className="w-full min-w-0">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>

              <div className="relative w-full">
                <Package size={19} className={iconClass} />

                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* PRODUCT CODE */}
            <div className="w-full min-w-0">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Product Code <span className="text-red-500">*</span>
              </label>

              <div className="relative w-full">
                <Hash size={19} className={iconClass} />

                <input
                  type="text"
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleChange}
                  placeholder="Example: RKG001"
                  className={`${inputClass} uppercase`}
                  required
                />
              </div>
            </div>

            {/* PRICE */}
            <div className="w-full min-w-0">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Product Price <span className="text-red-500">*</span>
              </label>

              <div className="relative w-full">
                <IndianRupee size={19} className={iconClass} />

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter product price"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* QUANTITY */}
            <div className="w-full min-w-0">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Quantity / Available Stock{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative w-full">
                <Package size={19} className={iconClass} />

                <input
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleChange}
                  placeholder="Enter available quantity"
                  min="0"
                  step="1"
                  className={inputClass}
                  required
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Enter the available product quantity.
              </p>
            </div>
          </div>

          {/* RIGHT - IMAGE UPLOAD */}
          <div className="w-full min-w-0">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Product Image <span className="text-red-500">*</span>
            </label>

            <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-5 transition hover:border-yellow-400">

              {preview ? (
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="Product preview"
                    className="h-[270px] w-full rounded-xl object-contain"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <X size={18} />
                  </button>

                  <p className="mt-3 truncate text-center text-xs font-semibold text-gray-500">
                    {image?.name}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFE45C]/40 text-yellow-800">
                    <ImagePlus size={30} />
                  </div>

                  <p className="text-sm font-bold text-gray-800">
                    Upload Product Image
                  </p>

                  <p className="mt-2 text-center text-xs text-gray-400">
                    PNG, JPG, JPEG or WEBP
                  </p>

                  <label className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl bg-[#FFE45C] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#f5d83d]">
                    <Upload size={17} />
                    Choose Image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-4 text-[11px] text-gray-400">
                    Maximum file size: 5MB
                  </p>
                </>
              )}

              {preview && (
                <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-yellow-50">
                  <Upload size={15} />
                  Change Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div
            className={`mx-5 mb-5 flex items-center gap-3 rounded-xl p-4 text-sm font-medium md:mx-8 ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={19} />
            ) : (
              <AlertCircle size={19} />
            )}

            {message.text}
          </div>
        )}

        {/* FOOTER BUTTONS */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-5 sm:flex-row md:px-8">

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            disabled={loading}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FFE45C] px-7 py-3 text-sm font-extrabold text-black shadow-sm transition hover:bg-[#f5d83d] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <Package size={18} />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
