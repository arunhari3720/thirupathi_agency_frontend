
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  KeyRound,
} from "lucide-react";

import AuthLayout from "../../layout/authlayout";
import axiosInstance from "../../axiosconfig/axiosconfig";

export default function MasterRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    setupSecret: "",
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
        "/master/register",
        form
      );

      const res = response.data ?? response;

      if (!res?.success) {
        throw new Error(
          res?.message || "Registration failed"
        );
      }

      navigate("/master/login", {
        replace: true,
        state: {
          message:
            "Master account created successfully. Please login.",
        },
      });
    } catch (err) {
      console.error("Master Register Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Master registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter your name",
      icon: User,
      type: "text",
      required: true,
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "admin@example.com",
      icon: Mail,
      type: "email",
      required: true,
      autoComplete: "email",
    },
    {
      name: "phoneNo",
      label: "Phone Number",
      placeholder: "Enter phone number",
      icon: Phone,
      type: "tel",
      required: false,
      autoComplete: "tel",
    },
  ];

  return (
    <AuthLayout title="Create Master Account">

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4"
      >

        {/* BASIC DETAILS */}
        {fields.map((field) => {
          const Icon = field.icon;

          return (
            <div
              key={field.name}
              className="w-full min-w-0"
            >
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>

              <div className="relative w-full">
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  autoComplete={field.autoComplete}
                  className="block w-full min-w-0 box-border rounded-xl border border-gray-200 bg-[#FAFAF8] py-3.5 pl-14 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D2E823] focus:bg-white focus:ring-2 focus:ring-yellow-200"
                />
              </div>
            </div>
          );
        })}

        {/* PASSWORD */}
        <div className="w-full min-w-0">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Password <span className="text-red-500">*</span>
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
              placeholder="Create a strong password"
              minLength={8}
              required
              autoComplete="new-password"
              className="block w-full min-w-0 box-border rounded-xl border border-gray-200 bg-[#FAFAF8] py-3.5 pl-14 pr-14 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D2E823] focus:bg-white focus:ring-2 focus:ring-yellow-200"
            />

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

          <p className="mt-1.5 text-xs text-gray-400">
            Password must contain at least 8 characters.
          </p>
        </div>

        {/* MASTER SETUP SECRET */}
        <div className="w-full min-w-0">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Master Setup Secret
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative w-full">
            <KeyRound
              size={19}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
            />

            <input
              type="password"
              name="setupSecret"
              value={form.setupSecret}
              onChange={handleChange}
              placeholder="Enter master setup secret"
              required
              autoComplete="off"
              className="block w-full min-w-0 box-border rounded-xl border border-gray-200 bg-[#FAFAF8] py-3.5 pl-14 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#D2E823] focus:bg-white focus:ring-2 focus:ring-yellow-200"
            />
          </div>

          <p className="mt-1.5 text-xs text-gray-400">
            Enter your authorized master registration secret.
          </p>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full bg-[#D2E823] py-4 text-sm font-bold text-gray-900 transition duration-200 hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Creating Account..."
            : "Create Master Account →"}
        </button>

      </form>

      {/* LOGIN LINK */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?

        <Link
          to="/master/login"
          className="ml-2 font-bold text-gray-900 underline decoration-[#D2E823] underline-offset-4 transition hover:text-gray-600"
        >
          Login
        </Link>
      </p>

    </AuthLayout>
  );
}
