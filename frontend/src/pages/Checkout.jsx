






















// import { useState } from "react";
// import { getCart } from "../utils/cart";
// import { useNavigate } from "react-router-dom";

// function Checkout() {
//   const cart     = getCart() || [];
//   const navigate = useNavigate();

//   const [type, setType]   = useState("delivery");
//   const [warranty, setWarranty] = useState("15days");
//   const [selectedAccessories, setSelectedAccessories] = useState([]);
//   const [customAccessory, setCustomAccessory] = useState(false);
//   const [customNote, setCustomNote] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [serverError, setServerError] = useState("");

//   const [form, setForm] = useState({
//     name: "", phone: "", email: "", address: "", city: "",
//   });

//   const accessoriesList = [
//     { name: "Case",              price: 500  },
//     { name: "Screen Protector",  price: 0    },
//     { name: "Original Charger",  price: 5000 },
//     { name: "Copy Charger",      price: 1500 },
//     { name: "Protection Jelly",  price: 300  },
//   ];

//   const warrantyPrices = { "15days": 0, "1month": 1000, "6months": 5000 };

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const toggleAccessory = (item) =>
//     setSelectedAccessories((prev) =>
//       prev.find((a) => a.name === item.name)
//         ? prev.filter((a) => a.name !== item.name)
//         : [...prev, item]
//     );

//   const validate = () => {
//     if (!form.name.trim())  return "Name is required";
//     if (!form.phone.trim()) return "Phone is required";
//     if (!form.email.trim()) return "Email is required";
//     if (type === "delivery") {
//       if (!form.city)           return "City is required";
//       if (!form.address.trim()) return "Address is required";
//     }
//     if (cart.length === 0) return "Cart is empty";
//     return null;
//   };

//   const baseTotal        = cart.reduce((s, i) => s + (i?.product?.price || 0) * (i?.quantity || 0), 0);
//   const warrantyCost     = warrantyPrices[warranty] || 0;
//   const accessoriesTotal = selectedAccessories.reduce((s, i) => s + (i?.price || 0), 0);
//   const total            = baseTotal + warrantyCost + accessoriesTotal;
//   const isValid          = !validate();

//   const placeOrder = async () => {
//     const error = validate();
//     if (error) return setServerError(error);

//     setLoading(true);
//     setServerError("");

//     try {
//       const payload = {
//         type,
//         name:    form.name,
//         phone:   form.phone,
//         email:   form.email,
//         address: type === "delivery" ? form.address : "",
//         city:    type === "delivery" ? form.city    : "",
//         orderItems: cart.map((item) => ({
//           product: item.product._id,
//           name:    item.product.name,
//           qty:     item.quantity,
//           price:   item.product.price,
//         })),
//         warranty,
//         accessories: selectedAccessories,
//         totalPrice: total,
//       };

//       console.log("🛒 Sending order:", payload);

//       const res  = await fetch("http://localhost:5001/api/orders", {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("📬 Server response:", data);

//       if (!res.ok) {
//         // Show the actual server error so you can see what's wrong
//         setServerError(data.message || `Server error ${res.status}`);
//         return;
//       }

//       if (!data._id) {
//         setServerError("Order created but no ID returned. Check server logs.");
//         return;
//       }

//       localStorage.removeItem("cart");
//       navigate(`/success/${data._id}`);

//     } catch (err) {
//       console.error("❌ Checkout fetch error:", err);
//       setServerError(err.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen py-10 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

//         {/* ── SERVER ERROR BANNER ── */}
//         {serverError && (
//           <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
//             ⚠️ {serverError}
//           </div>
//         )}

//         <div className="grid md:grid-cols-2 gap-6">

//           {/* LEFT */}
//           <div className="bg-white p-6 rounded-2xl shadow">

//             <label className="block text-xs font-medium text-gray-500 mb-1">Order Type</label>
//             <select className="border p-3 w-full mb-4 rounded-xl" value={type}
//               onChange={(e) => setType(e.target.value)}>
//               <option value="delivery">🚚 Delivery</option>
//               <option value="pickup">🏪 Pickup</option>
//             </select>

//             <input name="name" placeholder="Full Name *"
//               className="border p-3 w-full mb-3 rounded-xl"
//               value={form.name} onChange={handleChange} />

//             <input name="phone" placeholder="Phone *"
//               className="border p-3 w-full mb-3 rounded-xl"
//               value={form.phone} onChange={handleChange} />

//             <input name="email" placeholder="Email *"
//               className="border p-3 w-full mb-3 rounded-xl"
//               value={form.email} onChange={handleChange} />

//             {type === "delivery" && (
//               <>
//                 <select name="city" className="border p-3 w-full mb-3 rounded-xl"
//                   value={form.city} onChange={handleChange}>
//                   <option value="">Select City *</option>
//                   <option value="Rawalpindi">Rawalpindi</option>
//                   <option value="Islamabad">Islamabad</option>
//                 </select>
//                 <textarea name="address" placeholder="Full Address *" rows={3}
//                   className="border p-3 w-full mb-3 rounded-xl resize-none"
//                   value={form.address} onChange={handleChange} />
//               </>
//             )}

//             <label className="block text-xs font-medium text-gray-500 mb-1 mt-2">Warranty</label>
//             <select className="border p-3 w-full mb-4 rounded-xl" value={warranty}
//               onChange={(e) => setWarranty(e.target.value)}>
//               <option value="15days">15 Days — Free</option>
//               <option value="1month">1 Month — +Rs 1,000</option>
//               <option value="6months">6 Months — +Rs 5,000</option>
//             </select>

//             <label className="block text-xs font-medium text-gray-500 mb-2">Accessories</label>
//             {accessoriesList.map((item) => (
//               <label key={item.name}
//                 className="flex justify-between items-center border p-2 mb-2 rounded-xl cursor-pointer hover:bg-gray-50">
//                 <div className="flex gap-2 items-center">
//                   <input type="checkbox" onChange={() => toggleAccessory(item)} />
//                   <span className="text-sm">{item.name}</span>
//                 </div>
//                 <span className="text-sm text-gray-500">
//                   {item.price === 0 ? "Free" : `Rs ${item.price.toLocaleString()}`}
//                 </span>
//               </label>
//             ))}

//             <label className="flex gap-2 items-center mt-3 cursor-pointer text-sm">
//               <input type="checkbox" onChange={(e) => setCustomAccessory(e.target.checked)} />
//               Custom request
//             </label>
//             {customAccessory && (
//               <textarea rows={2} className="border p-3 w-full mt-2 rounded-xl resize-none"
//                 placeholder="Describe what you need..."
//                 value={customNote} onChange={(e) => setCustomNote(e.target.value)} />
//             )}
//           </div>

//           {/* RIGHT */}
//           <div className="bg-white p-6 rounded-2xl shadow">
//             <h2 className="text-lg font-bold mb-4">Order Summary</h2>

//             {cart.length === 0 ? (
//               <p className="text-gray-400 text-sm">Your cart is empty</p>
//             ) : (
//               cart.map((item) => (
//                 <div key={item.product._id} className="flex justify-between text-sm mb-2">
//                   <span>{item.product.name} × {item.quantity}</span>
//                   <span>Rs {(item.product.price * item.quantity).toLocaleString()}</span>
//                 </div>
//               ))
//             )}

//             <hr className="my-4" />
//             <div className="space-y-1 text-sm text-gray-600 mb-4">
//               <div className="flex justify-between">
//                 <span>Items</span><span>Rs {baseTotal.toLocaleString()}</span>
//               </div>
//               {warrantyCost > 0 && (
//                 <div className="flex justify-between">
//                   <span>Warranty</span><span>Rs {warrantyCost.toLocaleString()}</span>
//                 </div>
//               )}
//               {accessoriesTotal > 0 && (
//                 <div className="flex justify-between">
//                   <span>Accessories</span><span>Rs {accessoriesTotal.toLocaleString()}</span>
//                 </div>
//               )}
//             </div>
//             <hr className="mb-4" />

//             <div className="flex justify-between font-bold text-lg mb-5">
//               <span>Total</span>
//               <span>Rs {total.toLocaleString()}</span>
//             </div>

//             <div className="space-y-3 mb-5">
//               <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
//                 <span>🚚</span>
//                 <span className="font-semibold text-sm text-green-800">Free Cash on Delivery</span>
//               </div>
//               <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
//                 <span>🛡️</span>
//                 <span className="text-sm text-green-800">
//                   <span className="font-semibold">Inspect First, Pay Later</span> — satisfaction guaranteed
//                 </span>
//               </div>
//             </div>

//             <button
//               disabled={!isValid || loading}
//               onClick={placeOrder}
//               className={`w-full py-3 rounded-xl text-white font-medium transition-colors
//                 ${isValid && !loading
//                   ? "bg-black hover:bg-gray-800 cursor-pointer"
//                   : "bg-gray-400 cursor-not-allowed"}`}
//             >
//               {loading ? "Placing Order..." : "Place Order"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );


  
// }

// export default Checkout;









import { useState } from "react";
import { getCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5001/api";

export default function Checkout() {
  const cart     = getCart() || [];
  const navigate = useNavigate();

  const [type, setType]   = useState("delivery");
  const [warranty, setWarranty] = useState("15days");
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [customAccessory, setCustomAccessory] = useState(false);
  const [customNote, setCustomNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Promo
  const [promoCode, setPromoCode]       = useState("");
  const [promoResult, setPromoResult]   = useState(null); // { discount, message, code, type, value }
  const [promoError, setPromoError]     = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "" });

  const accessoriesList = [
    { name: "Case",             price: 500  },
    { name: "Screen Protector", price: 0    },
    { name: "Original Charger", price: 5000 },
    { name: "Copy Charger",     price: 1500 },
    { name: "Protection Jelly", price: 300  },
  ];

  const warrantyPrices = { "15days": 0, "1month": 1000, "6months": 5000 };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleAccessory = (item) =>
    setSelectedAccessories((prev) =>
      prev.find((a) => a.name === item.name)
        ? prev.filter((a) => a.name !== item.name)
        : [...prev, item]
    );

  const validate = () => {
    if (!form.name.trim())  return "Name is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.email.trim()) return "Email is required";
    if (type === "delivery") {
      if (!form.city)           return "City is required";
      if (!form.address.trim()) return "Address is required";
    }
    if (cart.length === 0) return "Cart is empty";
    return null;
  };

  const baseTotal        = cart.reduce((s, i) => s + (i?.product?.price || 0) * (i?.quantity || 0), 0);
  const warrantyCost     = warrantyPrices[warranty] || 0;
  const accessoriesTotal = selectedAccessories.reduce((s, i) => s + (i?.price || 0), 0);
  const subtotal         = baseTotal + warrantyCost + accessoriesTotal;
  const discount         = promoResult?.discount || 0;
  const total            = Math.max(0, subtotal - discount);
  const isValid          = !validate();

  // ── Apply promo code ──────────────────────────────────────
  const applyPromo = async () => {
    if (!promoCode.trim()) return setPromoError("Enter a promo code");
    setPromoLoading(true);
    setPromoError("");
    setPromoResult(null);
    try {
      const res  = await fetch(`${API}/promos/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), orderTotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { setPromoError(data.message); return; }
      setPromoResult(data);
    } catch {
      setPromoError("Failed to validate code");
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => { setPromoResult(null); setPromoCode(""); setPromoError(""); };

  // ── Place order ───────────────────────────────────────────
  const placeOrder = async () => {
    const error = validate();
    if (error) return setServerError(error);
    setLoading(true);
    setServerError("");
    try {
      const token = localStorage.getItem("token");

      const payload = {
        type,
        name:    form.name,
        phone:   form.phone,
        email:   form.email,
        address: type === "delivery" ? form.address : "",
        city:    type === "delivery" ? form.city    : "",
        orderItems: cart.map((item) => ({
          product: item.product._id,
          name:    item.product.name,
          qty:     item.quantity,
          price:   item.product.price,
        })),
        warranty,
        accessories: selectedAccessories,
        totalPrice:  total,
        promoCode:   promoResult?.code || null,
        discount:    discount,
      };

      const res  = await fetch(`${API}/orders`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.message || `Error ${res.status}`); return; }
      if (!data._id) { setServerError("Order created but no ID returned"); return; }

      // Mark promo as used
      if (promoResult?.code) {
        await fetch(`${API}/promos/use`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: promoResult.code }),
        });
      }

      localStorage.removeItem("cart");
      navigate(`/success/${data._id}`);
    } catch (err) {
      setServerError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // ── Input style ───────────────────────────────────────────
  const inputCls = "border border-gray-200 rounded-xl px-4 py-3 w-full text-sm focus:outline-none focus:border-gray-400";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>
      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Checkout</h1>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
            ⚠️ {serverError}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── LEFT — Form ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">

            <div>
              <label className={labelCls}>Order Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
                <option value="delivery">🚚 Delivery</option>
                <option value="pickup">🏪 Pickup from Store</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Ahmad Ali" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="03XX XXXXXXX" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Email * <span className="font-normal text-gray-400">(order confirmation sent here)</span></label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputCls} />
            </div>

            {type === "delivery" && (
              <>
                <div>
                  <label className={labelCls}>City *</label>
                  <select name="city" value={form.city} onChange={handleChange} className={inputCls}>
                    <option value="">Select city</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange}
                    placeholder="House #, Street, Area" rows={3}
                    className="border border-gray-200 rounded-xl px-4 py-3 w-full text-sm focus:outline-none focus:border-gray-400 resize-none" />
                </div>
              </>
            )}

            <div>
              <label className={labelCls}>Warranty</label>
              <select value={warranty} onChange={(e) => setWarranty(e.target.value)} className={inputCls}>
                <option value="15days">15 Days — Free</option>
                <option value="1month">1 Month — +Rs 1,000</option>
                <option value="6months">6 Months — +Rs 5,000</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Accessories</label>
              {accessoriesList.map((item) => (
                <label key={item.name} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2.5 mb-2 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" onChange={() => toggleAccessory(item)} className="accent-black" />
                    <span className="text-sm text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.price === 0 ? "Free" : `Rs ${item.price.toLocaleString()}`}</span>
                </label>
              ))}

              <label className="flex items-center gap-3 px-1 cursor-pointer">
                <input type="checkbox" onChange={(e) => setCustomAccessory(e.target.checked)} className="accent-black" />
                <span className="text-sm text-gray-700">Custom request</span>
              </label>
              {customAccessory && (
                <textarea rows={2} value={customNote} onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Describe what you need…"
                  className="border border-gray-200 rounded-xl px-4 py-3 w-full text-sm focus:outline-none focus:border-gray-400 resize-none mt-2" />
              )}
            </div>
          </div>

          {/* ── RIGHT — Summary ── */}
          <div className="space-y-4">

            {/* Order summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-base">Order Summary</h2>

              {cart.length === 0 ? (
                <p className="text-gray-400 text-sm">Your cart is empty</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.product.name} <span className="text-gray-400">× {item.quantity}</span></span>
                      <span className="font-medium text-gray-900">Rs {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Items</span><span>Rs {baseTotal.toLocaleString()}</span>
                </div>
                {warrantyCost > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Warranty</span><span>Rs {warrantyCost.toLocaleString()}</span>
                  </div>
                )}
                {accessoriesTotal > 0 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Accessories</span><span>Rs {accessoriesTotal.toLocaleString()}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-green-700">
                    <span>🏷️ Promo ({promoResult.code})</span>
                    <span>− Rs {discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
            </div>

            {/* ── Promo code card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-3 text-base">🏷️ Promo Code</h2>

              {promoResult ? (
                // Applied state
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-green-800 text-sm">{promoResult.code}</p>
                      <p className="text-green-700 text-xs mt-0.5">{promoResult.message}</p>
                      <p className="text-green-800 font-semibold text-sm mt-1">
                        − Rs {discount.toLocaleString()} saved!
                      </p>
                    </div>
                    <button onClick={removePromo} className="text-green-600 hover:text-red-500 text-xs underline transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                // Input state
                <div>
                  <div className="flex gap-2">
                    <input
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="Enter promo code"
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:border-gray-400 uppercase tracking-wider"
                    />
                    <button
                      onClick={applyPromo}
                      disabled={promoLoading || !promoCode.trim()}
                      className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40"
                    >
                      {promoLoading ? "…" : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-xs mt-2 font-medium">⚠️ {promoError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <span>🚚</span>
                <span className="font-semibold text-sm text-green-800">Free Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <span>🛡️</span>
                <span className="text-sm text-green-800">
                  <span className="font-semibold">Inspect First, Pay Later</span> — satisfaction guaranteed
                </span>
              </div>
            </div>

            {/* Place order button */}
            <button
              disabled={!isValid || loading}
              onClick={placeOrder}
              className={`w-full py-4 rounded-xl text-white font-bold text-base transition-all
                ${isValid && !loading ? "bg-black hover:bg-gray-800" : "bg-gray-300 cursor-not-allowed"}`}
            >
              {loading ? "Placing Order…" : `Place Order — Rs ${total.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}