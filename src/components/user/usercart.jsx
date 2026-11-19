
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  LoaderCircle,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";

import axiosInstance from "../../axiosconfig/axiosconfig";

function CartPage() {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0,
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  // FETCH CART
  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/user/cart/get");
      const data = response.data ?? response;

      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Fetch Cart Error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to fetch cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = async (productId, qty) => {
    if (qty < 1) return;

    try {
      setUpdatingId(productId);

      const response = await axiosInstance.put("/user/cart/update", {
        productId,
        qty,
      });

      const data = response.data ?? response;

      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Update Quantity Error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update quantity"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // REMOVE CART ITEM
  const removeItem = async (productId) => {
    try {
      const response = await axiosInstance.delete(
        `/user/cart/remove/${productId}`
      );

      const data = response.data ?? response;

      if (data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Remove Item Error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to remove product"
      );
    }
  };

  // VERIFY PAYMENT
  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await axiosInstance.post(
        "/user/payment/verify-payment",
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }
      );

      const data = response.data ?? response;

      if (!data.success) {
        throw new Error(
          data.message || "Payment verification failed"
        );
      }

      alert(
        `Payment Successful!\nPayment ID: ${paymentResponse.razorpay_payment_id}`
      );

      await fetchCart();

      navigate("/user/products");

    } catch (error) {
      console.error("Payment Verification Error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Payment verification failed. Please contact support."
      );

      // Payment may have succeeded even if verification request failed.
      // Check payment status through backend/webhook before retrying.
    } finally {
      setCheckoutLoading(false);
    }
  };

  // RAZORPAY CHECKOUT
  const handleCheckout = async () => {
    try {
      if (!cart.items.length) {
        alert("Your cart is empty");
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh the page.");
        return;
      }

      setCheckoutLoading(true);

      // STEP 1: CREATE RAZORPAY ORDER
      const response = await axiosInstance.post(
        "/user/payment/create-order"
      );

      const data = response.data ?? response;

      if (!data.success) {
        throw new Error(
          data.message || "Unable to create payment order"
        );
      }

      // STEP 2: RAZORPAY OPTIONS
      const options = {
key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || "INR",

        name: "Thirupathi Agencies",
        description: "Product Purchase",

        order_id: data.orderId,

        handler: function (paymentResponse) {
          verifyPayment(paymentResponse);
        },

        prefill: {
          // Optional: Add logged-in user's name, email and phone here.
        },

        notes: {
          purpose: "Product Purchase",
        },

        theme: {
          color: "#FACC15",
        },

        modal: {
          ondismiss: function () {
            setCheckoutLoading(false);
          },
        },
      };

      // STEP 3: OPEN RAZORPAY
      const razorpay = new window.Razorpay(options);

      // PAYMENT FAILURE
      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay Payment Failed:", response.error);

        alert(
          response.error.description ||
          "Payment failed. Please try again."
        );

        setCheckoutLoading(false);
      });

      razorpay.open();

    } catch (error) {
      console.error("Checkout Error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to initiate payment"
      );

      setCheckoutLoading(false);
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle
          size={35}
          className="animate-spin text-yellow-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/user/products")}
          className="mb-6 flex items-center gap-2 font-semibold text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </button>

        {/* PAGE TITLE */}
        <div className="mb-8 flex items-center gap-3">
          <ShoppingCart size={30} />

          <h1 className="text-3xl font-extrabold text-gray-900">
            My Cart
          </h1>

          <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-bold">
            {cart.totalItems} Items
          </span>
        </div>

        {cart.items.length === 0 ? (

          /* EMPTY CART */
          <div className="rounded-2xl bg-white px-5 py-20 text-center shadow-sm">
            <ShoppingBag
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-2xl font-bold">
              Your Cart is Empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some products to continue shopping.
            </p>

            <button
              onClick={() => navigate("/user/products")}
              className="mt-6 rounded-xl bg-yellow-400 px-7 py-3 font-bold hover:bg-yellow-500"
            >
              Explore Products
            </button>
          </div>

        ) : (

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

            {/* CART ITEMS */}
            <div className="space-y-4 lg:col-span-2">

              {cart.items.map((item) => {
                const product = item.product;

                return (
                  <div
                    key={product._id}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >

                    {/* PRODUCT IMAGE */}
                    <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-gray-50 p-3 sm:w-28">
                      <img
                        src={product.image?.url}
                        alt={product.productName}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-semibold text-gray-400">
                        {product.productCode}
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        {product.productName}
                      </h3>

                      <p className="mt-2 font-bold text-gray-800">
                        ₹{product.price}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Subtotal: ₹{item.subtotal}
                      </p>

                    </div>

                    {/* QUANTITY & REMOVE */}
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">

                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-2">

                        <button
                          disabled={
                            updatingId === product._id ||
                            item.qty <= 1
                          }
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              item.qty - 1
                            )
                          }
                          className="disabled:opacity-40"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="min-w-5 text-center font-bold">
                          {item.qty}
                        </span>

                        <button
                          disabled={
                            updatingId === product._id ||
                            item.qty >= product.qty
                          }
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              item.qty + 1
                            )
                          }
                          className="disabled:opacity-40"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      <button
                        onClick={() => removeItem(product._id)}
                        className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* ORDER SUMMARY */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">

              <h2 className="text-xl font-extrabold">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between text-gray-600">
                <span>Total Items</span>
                <span>{cart.totalItems}</span>
              </div>

              <div className="mt-4 flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cart.totalAmount}</span>
              </div>

              <div className="my-5 border-t border-dashed" />

              <div className="flex justify-between text-lg font-extrabold">
                <span>Total</span>
                <span>₹{cart.totalAmount}</span>
              </div>

              {/* RAZORPAY PAYMENT BUTTON */}
              <button
                onClick={handleCheckout}
                disabled={
                  checkoutLoading ||
                  cart.items.length === 0
                }
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-4 font-bold text-gray-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {checkoutLoading ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <ShieldCheck size={19} />
                )}

                {checkoutLoading
                  ? "Processing Payment..."
                  : `Pay Now ₹${cart.totalAmount}`}

              </button>

              {/* PAYMENT INFO */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={15} />
                Secure Payment Powered by Razorpay
              </div>

              <p className="mt-2 text-center text-xs text-gray-400">
                Complete your payment to confirm your order.
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default CartPage;
