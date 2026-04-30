

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";

// const API    = "http://localhost:5001/api/orders";
// const socket = io("http://localhost:5001");

// const STATUS_STEPS = [
//   { key: "pending",          label: "Order Placed",      icon: "📋" },
//   { key: "confirmed",        label: "Confirmed",          icon: "✅" },
//   { key: "rider_assigned",   label: "Rider Assigned",     icon: "🏍️" },
//   { key: "out_for_delivery", label: "Out for Delivery",   icon: "🚚" },
//   { key: "delivered",        label: "Delivered",          icon: "📦" },
//   { key: "completed",        label: "Completed",          icon: "🎉" },
// ];

// function Success() {
//   const { id }   = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder]     = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState("");

//   // ── Always re-fetch to get fully populated rider ──────────
//   const fetchOrder = async () => {
//     try {
//       if (!id || id === "undefined") throw new Error("Invalid order ID");
//       const res  = await fetch(`${API}/${id}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Order not found");
//       setOrder(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();

//     // ✅ Fix: always re-fetch on socket event so rider is populated
//     // (socket sends raw saved doc where rider = ObjectId string, not object)
//     socket.on("order_updated", (updated) => {
//       // ✅ Fix: was using undefined `data` variable — now uses `updated`
//       const updatedId = updated?._id?.toString() || updated?._id;
//       if (updatedId === id) {
//         // re-fetch to get populated rider name/phone
//         fetchOrder();
//       }
//     });

//     return () => socket.off("order_updated");
//   }, [id]);

//   // ── Loading ───────────────────────────────────────────────
//   if (loading) return (
//     <div className="h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center">
//         <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//         <p className="text-gray-500 text-sm">Loading your order...</p>
//       </div>
//     </div>
//   );

//   // ── Error ─────────────────────────────────────────────────
//   if (error || !order) return (
//     <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
//       <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">❌</div>
//       <h1 className="text-lg font-bold text-gray-900">Something went wrong</h1>
//       <p className="text-gray-500 mt-2 text-sm max-w-xs">{error}</p>
//       <button onClick={() => navigate("/")}
//         className="mt-6 bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 text-sm font-medium">
//         Go Home
//       </button>
//     </div>
//   );

//   // ── Derived data ──────────────────────────────────────────
//   const items        = order.orderItems  || [];
//   const accessories  = order.accessories || [];
//   const orderType    = (order.type || "").toLowerCase();
//   const isDelivery   = orderType === "delivery";
//   const isPickup     = orderType === "pickup";

//   const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

//   const itemsTotal       = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
//   const accessoriesTotal = accessories.reduce((s, a) => s + (a.price || 0), 0);
//   const total            = Number(order.totalPrice || 0) || itemsTotal + accessoriesTotal;

//   // ✅ rider is a populated object (has .name) after fetchOrder
//   // show rider card once assigned
//   const riderStatuses = ["rider_assigned", "out_for_delivery", "delivered", "completed"];
//   const showRider = isDelivery &&
//     riderStatuses.includes(order.status) &&
//     order.rider &&
//     typeof order.rider === "object" &&
//     order.rider.name;

//   const visibleSteps = isPickup
//     ? STATUS_STEPS.filter((s) => ["pending", "confirmed", "completed"].includes(s.key))
//     : STATUS_STEPS;

//   return (
//     <div className="bg-gray-50 min-h-screen py-8 px-4">
//       <div className="max-w-lg mx-auto space-y-4">

//         {/* ── Header card ── */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h1 className="text-xl font-bold text-gray-900 mb-1">Order Placed!</h1>
//           <p className="text-gray-400 text-sm mb-4">iStore.pk — Thank you for your order</p>

//           <div className="flex items-center justify-center gap-2 flex-wrap">
//             <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
//               {order.orderId || order._id}
//             </span>
//             <span className={`text-xs px-3 py-1.5 rounded-full font-medium
//               ${isPickup ? "bg-blue-100 text-blue-700" : "bg-gray-900 text-white"}`}>
//               {isPickup ? "🏪 Pickup" : "🚚 Delivery"}
//             </span>
//           </div>
//         </div>

//         {/* ── Rider card — appears when rider assigned ── */}
//         {showRider && (
//           <div className="bg-gray-900 text-white rounded-2xl p-5">
//             <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Your Delivery Rider</p>
//             <div className="flex items-center gap-4">
//               {/* Avatar */}
//               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
//                 {order.rider.name?.[0]?.toUpperCase()}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-bold text-white text-base">{order.rider.name}</p>
//                 <p className="text-gray-400 text-sm">{order.rider.phone}</p>
//               </div>
//               <a href={`tel:${order.rider.phone}`}
//                 className="flex items-center gap-1.5 bg-white text-gray-900 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
//                 📞 Call
//               </a>
//             </div>

//             {/* Status pill */}
//             <div className="mt-4 pt-4 border-t border-white/10">
//               <div className="flex items-center gap-2">
//                 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//                 <span className="text-sm text-gray-300 capitalize">
//                   {order.status.replace(/_/g, " ")}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── Tracking — delivery ── */}
//         {isDelivery && (
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="font-semibold text-gray-900 text-sm">Order Tracking</h2>
//               <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
//                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
//                 Live
//               </div>
//             </div>

//             <div className="relative pl-3">
//               {/* Vertical connector line */}
//               <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-gray-100 z-0" />

//               <div className="space-y-6 relative z-10">
//                 {visibleSteps.map((step, i) => {
//                   const done    = i <= currentStepIndex;
//                   const current = i === currentStepIndex;
//                   const future  = i > currentStepIndex;
//                   return (
//                     <div key={step.key} className="flex items-start gap-4">
//                       {/* Circle */}
//                       <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm
//                         transition-all duration-300
//                         ${done && !current ? "bg-black text-white"
//                           : current        ? "bg-black text-white ring-4 ring-black/10"
//                           : "bg-white border-2 border-gray-200 text-gray-300"}`}>
//                         {done ? (
//                           current
//                             ? <span className="text-xs">{step.icon}</span>
//                             : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                               </svg>
//                         ) : (
//                           <span className="text-xs opacity-40">{step.icon}</span>
//                         )}
//                       </div>

//                       <div className="pt-1">
//                         <p className={`text-sm font-medium leading-tight
//                           ${done ? "text-gray-900" : "text-gray-400"}`}>
//                           {step.label}
//                         </p>
//                         {current && (
//                           <p className="text-xs text-green-600 font-medium mt-0.5">Current status</p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── Pickup card ── */}
//         {isPickup && (
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-semibold text-gray-900 text-sm">Pickup Details</h2>
//               <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
//                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
//                 Live
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 space-y-1">
//               <p className="font-semibold text-gray-900">iStore.pk</p>
//               <p>Saddar Market, Rawalpindi</p>
//               <p>⏰ 11:00 AM – 9:00 PM</p>
//               <p className="text-xs text-gray-400 mt-2">Show your Order ID at the counter</p>
//             </div>

//             <div className="space-y-3">
//               {visibleSteps.map((step, i) => {
//                 const done    = i <= currentStepIndex;
//                 const current = i === currentStepIndex;
//                 return (
//                   <div key={step.key} className="flex items-center gap-3">
//                     <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
//                       ${done ? "bg-black" : "bg-gray-200"}`}>
//                       {done && (
//                         <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                         </svg>
//                       )}
//                     </div>
//                     <p className={`text-sm ${done ? "text-gray-900 font-medium" : "text-gray-400"}`}>
//                       {step.label}
//                       {current && <span className="ml-2 text-xs text-green-600 font-medium">← Now</span>}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* ── Customer details ── */}
//         {order.shippingAddress?.name && (
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//             <h2 className="font-semibold text-gray-900 text-sm mb-3">Your Details</h2>
//             <div className="text-sm text-gray-600 space-y-1">
//               <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
//               <p>{order.shippingAddress.phone}</p>
//               {isDelivery && order.shippingAddress.address && (
//                 <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ── Order items ── */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
//           <h2 className="font-semibold text-gray-900 text-sm mb-4">Order Summary</h2>

//           <div className="space-y-2.5">
//             {items.map((item, idx) => (
//               <div key={idx} className="flex justify-between text-sm">
//                 <span className="text-gray-700">
//                   {item.name}
//                   <span className="text-gray-400 ml-1">× {item.qty}</span>
//                 </span>
//                 <span className="font-medium text-gray-900">
//                   Rs {((item.price || 0) * (item.qty || 1)).toLocaleString()}
//                 </span>
//               </div>
//             ))}

//             {accessories.map((a, i) => (
//               <div key={i} className="flex justify-between text-xs text-gray-400">
//                 <span>+ {a.name}</span>
//                 <span>{a.price > 0 ? `Rs ${a.price.toLocaleString()}` : "Free"}</span>
//               </div>
//             ))}
//           </div>

//           {order.warranty && order.warranty !== "none" && (
//             <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
//               <span>🛡️</span>
//               <span>Warranty: {order.warranty}</span>
//             </div>
//           )}

//           <div className="flex justify-between font-bold text-gray-900 mt-4 pt-3 border-t border-gray-100 text-base">
//             <span>Total</span>
//             <span>Rs {total.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* ── Back button ── */}
//         <button onClick={() => navigate("/")}
//           className="w-full bg-black text-white py-3.5 rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm">
//           Back to Store
//         </button>

//         <p className="text-center text-xs text-gray-400 pb-4">
//           iStore.pk · Saddar Market, Rawalpindi
//         </p>

//       </div>
//     </div>
//   );
// }

// export default Success;









import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { sendOrderConfirmation } from "../utils/emailService";

const API    = "http://localhost:5001/api/orders";
const socket = io("http://localhost:5001");

const STATUS_STEPS = [
  { key: "pending",          label: "Order Placed",      icon: "📋" },
  { key: "confirmed",        label: "Confirmed",          icon: "✅" },
  { key: "rider_assigned",   label: "Rider Assigned",     icon: "🏍️" },
  { key: "out_for_delivery", label: "Out for Delivery",   icon: "🚚" },
  { key: "delivered",        label: "Delivered",          icon: "📦" },
  { key: "completed",        label: "Completed",          icon: "🎉" },
];

function Success() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // ✅ Track if email already sent — prevents double-send on re-renders
  const emailSent = useRef(false);

  const fetchOrder = async () => {
    try {
      if (!id || id === "undefined") throw new Error("Invalid order ID");
      const res  = await fetch(`${API}/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order not found");
      setOrder(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load — fetch order then send email once
    fetchOrder().then((data) => {
      if (data && !emailSent.current) {
        emailSent.current = true;
        sendOrderConfirmation(data);
      }
    });

    // Socket — re-fetch on status update to get populated rider
    socket.on("order_updated", (updated) => {
      const updatedId = updated?._id?.toString() || updated?._id;
      if (updatedId === id) fetchOrder();
    });

    return () => socket.off("order_updated");
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading your order...</p>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">❌</div>
      <h1 className="text-lg font-bold text-gray-900">Something went wrong</h1>
      <p className="text-gray-500 mt-2 text-sm max-w-xs">{error}</p>
      <button onClick={() => navigate("/")}
        className="mt-6 bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 text-sm font-medium">
        Go Home
      </button>
    </div>
  );

  const items        = order.orderItems  || [];
  const accessories  = order.accessories || [];
  const orderType    = (order.type || "").toLowerCase();
  const isDelivery   = orderType === "delivery";
  const isPickup     = orderType === "pickup";

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  const itemsTotal       = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const accessoriesTotal = accessories.reduce((s, a) => s + (a.price || 0), 0);
  const total            = Number(order.totalPrice || 0) || itemsTotal + accessoriesTotal;

  const showRider = isDelivery &&
    ["rider_assigned", "out_for_delivery", "delivered", "completed"].includes(order.status) &&
    order.rider &&
    typeof order.rider === "object" &&
    order.rider.name;

  const visibleSteps = isPickup
    ? STATUS_STEPS.filter((s) => ["pending", "confirmed", "completed"].includes(s.key))
    : STATUS_STEPS;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto space-y-4">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Order Placed!</h1>
          <p className="text-gray-400 text-sm mb-1">iStore.pk — Thank you for your order</p>
          <p className="text-gray-400 text-xs mb-4">A confirmation email has been sent to you</p>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
              {order.orderId || order._id}
            </span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium
              ${isPickup ? "bg-blue-100 text-blue-700" : "bg-gray-900 text-white"}`}>
              {isPickup ? "🏪 Pickup" : "🚚 Delivery"}
            </span>
          </div>
        </div>

        {/* Rider card */}
        {showRider && (
          <div className="bg-gray-900 text-white rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Your Delivery Rider</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                {order.rider.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-base">{order.rider.name}</p>
                <p className="text-gray-400 text-sm">{order.rider.phone}</p>
              </div>
              <a href={`tel:${order.rider.phone}`}
                className="flex items-center gap-1.5 bg-white text-gray-900 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
                📞 Call
              </a>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300 capitalize">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery tracking */}
        {isDelivery && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-sm">Order Tracking</h2>
              <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </div>
            </div>

            <div className="relative pl-3">
              <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-gray-100 z-0" />
              <div className="space-y-6 relative z-10">
                {visibleSteps.map((step, i) => {
                  const done    = i <= currentStepIndex;
                  const current = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm transition-all duration-300
                        ${done && !current ? "bg-black text-white"
                          : current        ? "bg-black text-white ring-4 ring-black/10"
                          : "bg-white border-2 border-gray-200 text-gray-300"}`}>
                        {done ? (
                          current
                            ? <span className="text-xs">{step.icon}</span>
                            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                        ) : (
                          <span className="text-xs opacity-40">{step.icon}</span>
                        )}
                      </div>
                      <div className="pt-1">
                        <p className={`text-sm font-medium leading-tight ${done ? "text-gray-900" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        {current && <p className="text-xs text-green-600 font-medium mt-0.5">Current status</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pickup */}
        {isPickup && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-sm">Pickup Details</h2>
              <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">iStore.pk</p>
              <p>Saddar Market, Rawalpindi</p>
              <p>⏰ 11:00 AM – 9:00 PM</p>
              <p className="text-xs text-gray-400 mt-2">Show your Order ID at the counter</p>
            </div>
            <div className="space-y-3">
              {visibleSteps.map((step, i) => {
                const done    = i <= currentStepIndex;
                const current = i === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
                      ${done ? "bg-black" : "bg-gray-200"}`}>
                      {done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className={`text-sm ${done ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                      {step.label}
                      {current && <span className="ml-2 text-xs text-green-600 font-medium">← Now</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Customer details */}
        {order.shippingAddress?.name && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Your Details</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              {isDelivery && order.shippingAddress.address && (
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
              )}
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Order Summary</h2>
          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} <span className="text-gray-400">× {item.qty}</span>
                </span>
                <span className="font-medium text-gray-900">
                  Rs {((item.price || 0) * (item.qty || 1)).toLocaleString()}
                </span>
              </div>
            ))}
            {accessories.map((a, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-400">
                <span>+ {a.name}</span>
                <span>{a.price > 0 ? `Rs ${a.price.toLocaleString()}` : "Free"}</span>
              </div>
            ))}
          </div>

          {order.warranty && order.warranty !== "none" && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <span>🛡️</span><span>Warranty: {order.warranty}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-gray-900 mt-4 pt-3 border-t border-gray-100 text-base">
            <span>Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
        </div>

        <button onClick={() => navigate("/")}
          className="w-full bg-black text-white py-3.5 rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm">
          Back to Store
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          iStore.pk · Saddar Market, Rawalpindi
        </p>
      </div>
    </div>
  );
}

export default Success;