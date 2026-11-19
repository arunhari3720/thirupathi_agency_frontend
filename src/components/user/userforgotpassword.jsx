
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../layout/authlayout";
import axiosInstance from "../../axiosconfig/axiosconfig";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post(
        "/user/forgot-password/send-otp",
        { email }
      );

      setStep(2);
      setSuccess(
        res.data?.message ||
          "Verification OTP has been sent to your email."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post(
        "/user/forgot-password/verify-otp",
        {
          email,
          otp,
        }
      );

      const token = res.data?.resetToken;

      if (!token) {
        throw new Error("Reset token not received from server.");
      }

      setResetToken(token);
      setStep(3);

      setSuccess("OTP verified successfully. Set your new password.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/user/forgot-password/reset-password",
        {
          email,
          resetToken,
          newPassword: password,
        }
      );

      setSuccess(
        res.data?.message ||
          "Password reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    setSuccess("");

    if (step === 3) {
      setStep(2);
      setResetToken("");
    } else if (step === 2) {
      setStep(1);
      setOtp("");
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <p className="text-xs font-bold uppercase tracking-[3px] text-gray-400">
        Account Recovery
      </p>

      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#111114]">
        {step === 1 && "Forgot password?"}
        {step === 2 && "Verify your email."}
        {step === 3 && "Create new password."}
      </h1>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {step === 1 &&
          "Enter your registered email address. We will send you a verification code."}

        {step === 2 &&
          `Enter the 6-digit verification code sent to ${email}.`}

        {step === 3 &&
          "Create a strong new password for your account."}
      </p>

      {/* Progress */}
      <div className="mt-7 flex gap-2">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className={`h-1.5 flex-1 rounded-full transition ${
              step >= item
                ? "bg-[#D2E823]"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* STEP 1: EMAIL */}
      {step === 1 && (
        <form
          onSubmit={handleSendOtp}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#222]">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-4 text-sm outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#D2E823] py-4 text-sm font-bold text-[#111114] transition hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send Verification OTP →"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <form
          onSubmit={handleVerifyOtp}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#222]">
              Verification Code
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              placeholder="Enter 6-digit OTP"
              required
              className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-4 text-center text-xl font-bold tracking-[10px] outline-none transition focus:border-[#B5C91B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-full bg-[#D2E823] py-4 text-sm font-bold text-[#111114] transition hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP →"}
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="w-full text-sm font-semibold text-gray-500 hover:text-black"
          >
            ← Change Email
          </button>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {step === 3 && (
        <form
          onSubmit={handleResetPassword}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#222]">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-4 pr-16 text-sm outline-none transition focus:border-[#B5C91B]"
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

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#222]">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-4 pr-16 text-sm outline-none transition focus:border-[#B5C91B]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#D2E823] py-4 text-sm font-bold text-[#111114] transition hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating Password..." : "Reset Password →"}
          </button>
        </form>
      )}

      {/* Back to Login */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Remember your password?

        <Link
          to="/login"
          className="ml-2 font-bold text-[#111114] underline underline-offset-4 decoration-[#D2E823]"
        >
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
}
