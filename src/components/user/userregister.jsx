
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../layout/authlayout";
import axiosInstance from "../../axiosconfig/axiosconfig";

export default function Register() {
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    userType: "user",
    shopName: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpStep, setOtpStep] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const isShopUser = ["retailer", "supermarket"].includes(
    form.userType
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "userType" &&
      !["retailer", "supermarket"].includes(value)
        ? { shopName: "" }
        : {}),
    }));
  };

  // STEP 1: Send Registration OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        shopName: isShopUser ? form.shopName.trim() : null,
      };

      const res = await axiosInstance.post(
        "/user/register",
        payload
      );

      setOtpStep(true);
      setOtp(["", "", "", "", "", ""]);

      setSuccess(
        res.data?.message ||
          "OTP sent successfully to your email address."
      );

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // OTP INPUT CHANGE
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);
    setError("");
    setSuccess("");

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // OTP BACKSPACE
  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // OTP PASTE
  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const newOtp = Array.from(
      { length: 6 },
      (_, index) => pastedValue[index] || ""
    );

    setOtp(newOtp);

    const nextIndex = Math.min(pastedValue.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  // STEP 2: Verify OTP and Create Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post(
        "/user/register/verify-otp",
        {
          email: form.email.trim().toLowerCase(),
          otp: enteredOtp,
        }
      );

      setSuccess(
        res.data?.message ||
          "Email verified and account created successfully!"
      );

      // Registration completed.
      // User should login manually.
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Back to registration
  const handleBackToRegister = () => {
    setOtpStep(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
  };

  return (
    <AuthLayout>
      {!otpStep ? (
        <>
          {/* REGISTER HEADER */}
          <p className="text-xs font-bold uppercase tracking-[3px] text-gray-400">
            Join With Us
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#111114]">
            Create your account.
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Register to explore our products and services.
          </p>

          {/* ERROR */}
          {error && (
            <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* SUCCESS */}
          {success && (
            <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          {/* REGISTER FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-4"
          >
            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm outline-none focus:border-[#B5C91B]"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm outline-none focus:border-[#B5C91B]"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Phone Number
              </label>

              <input
                type="tel"
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm outline-none focus:border-[#B5C91B]"
              />
            </div>

            {/* ACCOUNT TYPE */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Account Type
              </label>

              <select
                name="userType"
                value={form.userType}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm outline-none focus:border-[#B5C91B]"
              >
                <option value="user">General User</option>
                <option value="retailer">Retailer</option>
                <option value="supermarket">Supermarket</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* SHOP NAME - ONLY RETAILER / SUPERMARKET */}
            {isShopUser && (
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Shop Name
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  name="shopName"
                  value={form.shopName}
                  onChange={handleChange}
                  placeholder="Enter your shop name"
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 text-sm outline-none focus:border-[#B5C91B]"
                />
              </div>
            )}

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3.5 pr-16 text-sm outline-none focus:border-[#B5C91B]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#D2E823] py-4 text-sm font-bold text-[#111114] transition hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Continue →"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?

            <Link
              to="/login"
              className="ml-2 font-bold text-[#111114] underline underline-offset-4 decoration-[#D2E823]"
            >
              Login
            </Link>
          </p>
        </>
      ) : (
        <>
          {/* OTP HEADER */}
          <p className="text-xs font-bold uppercase tracking-[3px] text-gray-400">
            Email Verification
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#111114]">
            Verify your email.
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            We have sent a 6-digit verification code to
            <span className="font-bold text-[#111114]">
              {" "}{form.email}
            </span>
          </p>

          {/* ERROR */}
          {error && (
            <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* SUCCESS */}
          {success && (
            <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>
          )}

          {/* OTP FORM */}
          <form
            onSubmit={handleVerifyOtp}
            className="mt-7 space-y-6"
          >
            <div>
              <label className="mb-3 block text-sm font-semibold">
                Enter Verification OTP
              </label>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={
                      index === 0 ? "one-time-code" : "off"
                    }
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, index)
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(e, index)
                    }
                    onPaste={handleOtpPaste}
                    className="h-14 min-w-0 flex-1 rounded-xl border border-gray-200 bg-[#FAFAF8] text-center text-xl font-bold text-[#111114] outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
                  />
                ))}
              </div>
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full rounded-full bg-[#D2E823] py-4 text-sm font-bold text-[#111114] transition hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>

            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={handleBackToRegister}
              className="w-full text-sm font-semibold text-gray-500 hover:text-black"
            >
              ← Back to Registration
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
