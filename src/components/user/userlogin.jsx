
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import AuthLayout from "../../layout/authlayout";
// import axiosInstance from "../../axiosconfig/axiosconfig";

// export default function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle login
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setError("");

//     try {
//       const res = await axiosInstance.post(
//         "/user/login",
//         form
//       );

//       // Validate API response
//       if (!res?.token || !res?.user) {
//         throw new Error("Invalid login response from server.");
//       }

//       // Save authentication details
//       localStorage.setItem("token", res.token);
//       localStorage.setItem("user", JSON.stringify(res.user));

//       // Redirect to user dashboard
//       navigate("/user/dashboard", {
//         replace: true,
//       });

//     } catch (err) {
//       console.error("Login Error:", err);

//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         "Login failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout>
//       {/* Heading */}
//       <p className="text-xs font-bold uppercase tracking-[3px] text-gray-400">
//         Welcome Back
//       </p>

//       <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#111114]">
//         Login to your account.
//       </h1>

//       <p className="mt-3 text-sm leading-6 text-gray-500">
//         Enter your credentials to continue.
//       </p>

//       {/* Error Message */}
//       {error && (
//         <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
//           {error}
//         </div>
//       )}

//       {/* Login Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="mt-8 space-y-5"
//       >
//         {/* Email */}
//         <div>
//           <label className="mb-2 block text-sm font-semibold text-[#222]">
//             Email Address
//           </label>

//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="you@example.com"
//             autoComplete="email"
//             required
//             className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-4 text-sm outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <div className="mb-2 flex items-center justify-between">
//             <label className="text-sm font-semibold text-[#222]">
//               Password
//             </label>

//             <Link
//               to="/forgot-password"
//               className="text-xs font-semibold text-gray-500 hover:text-black"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               autoComplete="current-password"
//               required
//               className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-4 pr-16 text-sm outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-black"
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-full bg-[#D2E823] py-4 text-sm font-bold text-[#111114] transition hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {loading ? "Logging in..." : "Login →"}
//         </button>
//       </form>

//       {/* Register Link */}
//       <p className="mt-8 text-center text-sm text-gray-500">
//         Don't have an account?

//         <Link
//           to="/register"
//           className="ml-2 font-bold text-[#111114] underline underline-offset-4 decoration-[#D2E823]"
//         >
//           Create Account
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// }
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import AuthLayout from "../../layout/authlayout";
import axiosInstance from "../../axiosconfig/axiosconfig";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Google's button needs a pixel width, so we measure the container
  const googleBoxRef = useRef(null);
  const [googleWidth, setGoogleWidth] = useState(320);

  useEffect(() => {
    const el = googleBoxRef.current;
    if (!el) return;

    const update = () =>
      setGoogleWidth(
        Math.min(400, Math.max(200, Math.floor(el.offsetWidth)))
      );

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Shared by email login and Google login
  const finishLogin = (res) => {
    // Validate API response
    if (!res?.token || !res?.user) {
      throw new Error("Invalid login response from server.");
    }

    // Save authentication details
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    // Redirect to user dashboard
    navigate("/user/dashboard", {
      replace: true,
    });
  };

  // Email + password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/user/login", form);
      finishLogin(res);
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google login: Google gives us an ID token (credential), our API verifies it
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError("Google did not return a sign-in token. Please try again.");
      return;
    }

    setGoogleLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/user/google-login", {
        credential: credentialResponse.credential,
        userType: "user", // only used if this Google account is new
      });

      finishLogin(res);
    } catch (err) {
      console.error("Google Login Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const busy = loading || googleLoading;

  return (
    <AuthLayout>
      {/* Heading */}
      <p className="text-xs font-bold uppercase tracking-[3px] text-gray-400">
        Welcome Back
      </p>

      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#111114]">
        Login to your account.
      </h1>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        Enter your credentials to continue.
      </p>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* Google login */}
      <div className="mt-8">
        <div
          ref={googleBoxRef}
          className={`flex w-full justify-center transition ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setError("Google sign-in was cancelled or failed. Please try again.")
            }
            text="continue_with"
            shape="pill"
            theme="outline"
            size="large"
            logo_alignment="left"
            width={googleWidth}
          />
        </div>

        {googleLoading && (
          <p className="mt-3 text-center text-xs text-gray-500">
            Signing you in with Google...
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400">
          or login with email
        </span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#222]">
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
            className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-4 text-sm outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-[#222]">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-gray-500 hover:text-black"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-4 pr-16 text-sm outline-none transition focus:border-[#B5C91B] focus:ring-2 focus:ring-[#D2E823]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[#D2E823] py-4 text-sm font-bold text-[#111114] transition hover:bg-[#BFD51B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login →"}
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account?
        <Link
          to="/register"
          className="ml-2 font-bold text-[#111114] underline underline-offset-4 decoration-[#D2E823]"
        >
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}