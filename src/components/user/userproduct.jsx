
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, LoaderCircle } from "lucide-react";
import axiosInstance from "../../axiosconfig/axiosconfig";

function UserProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/master/product/getall"
      );

      const data = response.data ?? response;
      setProducts(data.products || []);
    } catch (error) {
      setError(
        error.message || "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingId(product._id);

      const response = await axiosInstance.post("/user/cart/add", {
        productId: product._id,
        qty: 1,
      });

      const data = response.data ?? response;

      if (data.success) {
        navigate("/user/cart");
      }
    } catch (error) {
      alert(
        error.message || "Unable to add product to cart"
      );
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="animate-spin" size={35} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 rounded-lg bg-yellow-400 px-5 py-2 font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-10">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
              Our Collection
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
              Our Products
            </h1>

            <p className="mt-2 text-gray-500">
              Explore our available products.
            </p>
          </div>

          <button
            onClick={() => navigate("/user/cart")}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-yellow-500 hover:text-black"
          >
            <ShoppingCart size={19} />
            View Cart
          </button>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white py-20 text-center shadow-sm">
            <Package
              size={45}
              className="mx-auto text-gray-300"
            />
            <h2 className="mt-4 text-xl font-bold">
              No Products Available
            </h2>
            <p className="mt-2 text-gray-500">
              Products will appear here once added by admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-56 items-center justify-center bg-gray-50 p-5">
                  <img
                    src={product.image?.url}
                    alt={product.productName}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {product.productCode}
                  </p>

                  <h2 className="mt-2 text-lg font-bold text-gray-900">
                    {product.productName}
                  </h2>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xl font-extrabold text-gray-900">
                      ₹{product.price}
                    </p>

                    <span
                      className={`text-xs font-semibold ${
                        product.qty > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.qty > 0
                        ? `${product.qty} Available`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <button
                    disabled={
                      product.qty <= 0 ||
                      addingId === product._id
                    }
                    onClick={() => handleAddToCart(product)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 font-bold text-gray-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {addingId === product._id ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <ShoppingCart size={18} />
                    )}

                    {addingId === product._id
                      ? "Adding..."
                      : product.qty > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default UserProducts;
