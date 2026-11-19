
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../axiosconfig/axiosconfig";

export default function Profile() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phoneNo: "",
    shopName: "",
  });

  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isShopUser = ["retailer", "supermarket"].includes(
    profile?.userType
  );

  // Load profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/user/profile");

      const user = res.user || res.data?.user || res;

      setProfile(user);

      setForm({
        name: user.name || "",
        phoneNo: user.phoneNo || "",
        shopName: user.shopName || "",
      });

      setPreview(user.profilePic?.url || "");

      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err.message || err.error || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Profile picture selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should not exceed 5MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Edit mode
  const handleEdit = () => {
    setForm({
      name: profile.name || "",
      phoneNo: profile.phoneNo || "",
      shopName: profile.shopName || "",
    });

    setPreview(profile.profilePic?.url || "");
    setSelectedFile(null);
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setForm({
      name: profile.name || "",
      phoneNo: profile.phoneNo || "",
      shopName: profile.shopName || "",
    });

    setPreview(profile.profilePic?.url || "");
    setSelectedFile(null);
    setError("");
    setIsEditing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("phoneNo", form.phoneNo.trim());

      if (isShopUser) {
        formData.append("shopName", form.shopName.trim());
      }

      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      const res = await axiosInstance.put(
        "/user/profile",
        formData
      );

      const updatedUser = res.user || res.data?.user || res;

      setProfile(updatedUser);

      setForm({
        name: updatedUser.name || "",
        phoneNo: updatedUser.phoneNo || "",
        shopName: updatedUser.shopName || "",
      });

      setPreview(updatedUser.profilePic?.url || "");
      setSelectedFile(null);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
      setSuccess("Profile updated successfully!");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.message ||
        err.error ||
        "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const getUserType = (type) => {
    const types = {
      user: "User",
      customer: "Customer",
      retailer: "Retailer",
      supermarket: "Supermarket",
      master: "Master",
    };

    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#D2E823]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
          {error || "Profile details not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[3px] text-gray-400">
              Account Settings
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#171717] sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your personal information and account details.
            </p>
          </div>

          {!isEditing && (
            <button
              onClick={handleEdit}
              className="rounded-full bg-[#D2E823] px-6 py-3 text-sm font-bold text-[#171717] transition hover:bg-[#BFD51B]"
            >
              Edit Profile ↗
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Profile Card */}
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

            {/* Top Profile Section */}
            <div className="border-b border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                {/* Profile Picture */}
                <div className="relative h-28 w-28 shrink-0">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#F0F2E7] bg-gray-100">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-400">
                        {profile.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-[#D2E823] text-lg font-bold text-black shadow-sm"
                      title="Change profile picture"
                    >
                      +
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* User Details */}
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-[#171717]">
                    {profile.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {profile.email}
                  </p>

                  <span className="mt-3 inline-flex rounded-full bg-[#F3F6D9] px-4 py-1.5 text-xs font-bold text-[#59630D]">
                    {getUserType(profile.userType)}
                  </span>

                  {isEditing && (
                    <p className="mt-3 text-xs text-gray-400">
                      JPG, PNG or WEBP · Maximum 5MB
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#171717]">
                  Personal Information
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Your basic account information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
                    />
                  ) : (
                    <p className="rounded-xl bg-[#FAFAF8] px-4 py-3.5 text-sm font-medium text-gray-800">
                      {profile.name || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5 text-sm text-gray-500">
                    {profile.email}
                    <span className="ml-2 text-xs text-gray-400">
                      (Read only)
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNo"
                      value={form.phoneNo}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
                    />
                  ) : (
                    <p className="rounded-xl bg-[#FAFAF8] px-4 py-3.5 text-sm font-medium text-gray-800">
                      {profile.phoneNo || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Account Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Account Type
                  </label>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-600">
                    {getUserType(profile.userType)}
                    <span className="ml-2 text-xs text-gray-400">
                      (Read only)
                    </span>
                  </div>
                </div>

                {/* Shop Name */}
                {isShopUser && (
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Shop Name
                    </label>

                    {isEditing ? (
                      <input
                        type="text"
                        name="shopName"
                        value={form.shopName}
                        onChange={handleChange}
                        placeholder="Enter your shop name (optional)"
                        className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
                      />
                    ) : (
                      <p className="rounded-xl bg-[#FAFAF8] px-4 py-3.5 text-sm font-medium text-gray-800">
                        {profile.shopName || "Not provided"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-full border border-gray-200 px-7 py-3.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-[#D2E823] px-8 py-3.5 text-sm font-bold text-[#171717] transition hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving Changes..." : "Save Changes →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          Keep your profile information up to date.
        </p>
      </div>
    </div>
  );
}
