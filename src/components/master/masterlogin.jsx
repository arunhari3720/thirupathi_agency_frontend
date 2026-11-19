
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import AuthLayout from "../../layout/admin_authlayout";
import axiosInstance from "../../axiosconfig/axiosconfig";

export default function MasterLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(
        "/master/login",
        form
      );

      const res = response.data ?? response;

      if (
        !res?.success ||
        !res?.token ||
        res?.master?.userType !== "master"
      ) {
        throw new Error(
          res?.message || "Invalid master login response"
        );
      }

      // Save master authentication details
      localStorage.setItem("masterToken", res.token);

      localStorage.setItem(
        "masterUser",
        JSON.stringify(res.master)
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Master Login Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Master login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back, Master">

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-5">

        {/* EMAIL */}
        <div className="w-full min-w-0">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email Address
          </label>

          <div className="relative w-full">
            <Mail
              size={19}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              className="block w-full min-w-0 box-border rounded-xl border border-gray-200 bg-[#FAFAF8] py-4 pl-14 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D2E823] focus:bg-white focus:ring-2 focus:ring-yellow-200"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="w-full min-w-0">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Password
          </label>

          <div className="relative w-full">
            <Lock
              size={19}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter master password"
              required
              autoComplete="current-password"
              className="block w-full min-w-0 box-border rounded-xl border border-gray-200 bg-[#FAFAF8] py-4 pl-14 pr-14 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D2E823] focus:bg-white focus:ring-2 focus:ring-yellow-200"
            />

            {/* PASSWORD VISIBILITY */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-gray-700"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full bg-[#D2E823] py-4 text-sm font-bold text-gray-900 transition duration-200 hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Master Login →"}
        </button>

      </form>

      {/* REGISTER LINK */}
      <p className="mt-8 text-center text-sm text-gray-500">
        New master account?

        <Link
          to="/master/register"
          className="ml-2 font-bold text-gray-900 underline decoration-[#D2E823] underline-offset-4 transition hover:text-gray-600"
        >
          Register
        </Link>
      </p>

    </AuthLayout>
  );
}
