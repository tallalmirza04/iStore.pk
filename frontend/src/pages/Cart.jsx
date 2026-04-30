import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity } from "../utils/cart";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  const loadCart = () => {
    const data = getCart() || [];

    // 🔥 FILTER OUT INVALID PRODUCTS
    const cleanCart = data.filter(item => item?.product?._id);

    setCart(cleanCart);
  };

  useEffect(() => {
    loadCart();

    const interval = setInterval(() => {
      loadCart();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const total = cart.reduce((sum, item) => {
    return sum + (item?.product?.price || 0) * (item?.quantity || 0);
  }, 0);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          🛒 Your Cart
        </h1>

        {/* EMPTY STATE */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">

            <h2 className="text-3xl font-bold text-gray-800">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mt-2">
              Add premium iPhones to continue shopping
            </p>

            <Link to="/" className="mt-6">
              <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800">
                Browse Products
              </button>
            </Link>

          </div>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT SIDE - CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">

              {cart.map((item) => (
                <div
                  key={item.product._id} // ✅ FIXED
                  className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4"
                >

                  {/* IMAGE */}
                  <img
                    src={item.product.image}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">

                    <h2 className="font-semibold text-lg">
                      {item.product.name}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Rs {item.product.price.toLocaleString()}
                    </p>

                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-3 mt-3">

                      <button
                        onClick={() => {
                          updateQuantity(item.product._id, "dec"); // ✅ FIXED
                          loadCart();
                        }}
                        className="w-8 h-8 border rounded-lg"
                      >
                        -
                      </button>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          updateQuantity(item.product._id, "inc"); // ✅ FIXED
                          loadCart();
                        }}
                        className="w-8 h-8 border rounded-lg"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => {
                      removeFromCart(item.product._id); // ✅ FIXED
                      loadCart();
                    }}
                    className="text-red-500 text-sm font-medium hover:text-red-700"
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>

            {/* RIGHT SIDE - SUMMARY */}
            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">

              <h2 className="text-xl font-bold mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm text-gray-600">

                {cart.map((item) => (
                  <div
                    key={item.product._id} // ✅ FIXED
                    className="flex justify-between"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>

                    <span>
                      Rs {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

              </div>

              <hr className="my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>

              <Link to="/checkout">
                <button className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800">
                  Proceed to Checkout
                </button>
              </Link>

              <button
                className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800"
                onClick={() => {
                  localStorage.removeItem("cart");
                  loadCart(); // ✅ refresh UI
                }}
              >
                Clear Cart
              </button>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Secure checkout • Cash on delivery available
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
    
  );

  
}

export default Cart;