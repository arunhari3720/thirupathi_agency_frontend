import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Landing Page
import Landing from "./components/landing";

// User Authentication
import Login from "./components/user/userlogin";
import Register from "./components/user/userregister";

// User Layout and Pages
import UserLayout from "./layout/userlayout";
import Dashboard from "./components/user/userdashboard";
import UserProducts from "./components/user/userproduct";
import CartPage from "./components/user/usercart";
import Userorders from "./components/user/userorders";
import ForgotPassword from "./components/user/userforgotpassword";
import Profile from "./components/user/userprofile";
import Payments from "./components/user/userpayment";
// Master Authentication
import MasterLogin from "./components/master/masterlogin";
import MasterRegister from "./components/master/masterregister";

// Admin Layout and Pages
import AdminLayout from "./layout/adminlayout";
import AdminDashboard from "./components/master/masterdashboard";
import AddProduct from "./components/master/addproduct";
import MasterOrders from "./components/master/masterproduct";
import UsersManagement from "./components/master/usermanagent";
import PaymentsManagement from "./components/master/paymentmanagment";
import ProductsManagement from "./components/master/productmanagment";
// Scroll to top whenever route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

// User Authentication Check
function UserProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.userType === "master") {
    return <Navigate to="/master/login" replace />;
  }

  return children;
}

// Master Authentication Check
function MasterProtectedRoute({ children }) {
  const token = localStorage.getItem("masterToken");
  const master = JSON.parse(localStorage.getItem("masterUser") || "{}");

  if (!token) {
    return <Navigate to="/master/login" replace />;
  }

  if (master.userType && master.userType !== "master") {
    return <Navigate to="/master/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ================= LANDING ================= */}

        <Route path="/" element={<Landing />} />

        {/* ================= USER AUTH ================= */}

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* ================= MASTER AUTH ================= */}

        <Route path="/master/login" element={<MasterLogin />} />

        <Route path="/master/register" element={<MasterRegister />} />

        {/* ================= USER DASHBOARD ================= */}

        <Route
          path="/user"
          element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<UserProducts />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<Userorders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<Payments />} />
          {/* Future User Pages */}

          {/* 
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          */}
        </Route>

        {/* ================= ADMIN DASHBOARD ================= */}

        <Route
          path="/admin"
          element={
            <MasterProtectedRoute>
              <AdminLayout />
            </MasterProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Admin Dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Add Product */}
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<MasterOrders />} />
          <Route path="usermanagement" element={<UsersManagement />} />
          <Route path="payment" element={<PaymentsManagement />} />

          {/* Future Admin Pages */}

          {/*
          <Route path="users" element={<ManageUsers />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<AdminSettings />} />
          */}
        </Route>

        {/* ================= INVALID ROUTES ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
