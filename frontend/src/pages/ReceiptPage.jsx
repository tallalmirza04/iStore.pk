








// import { useEffect, useState } from "react";

// function ReceiptPage() {
//   const [order, setOrder] = useState(null);
//   const [rider, setRider] = useState(null);

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("selectedReceipt"));
//     if (!data) return;

//     setOrder(data);

//     const riders = JSON.parse(localStorage.getItem("riders")) || [];
//     const found = riders.find((r) => r.id === data.riderId);
//     setRider(found);
//   }, []);

//   const printPage = () => window.print();

//   if (!order) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <h2 className="text-xl font-semibold text-red-500">
//           No Receipt Found
//         </h2>
//       </div>
//     );
//   }

//   const total = order.items?.reduce(
//     (sum, i) => sum + (i.product.price || 0) * i.quantity,
//     0
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 print:bg-white">

//       {/* PRINT STYLE FIX (IMPORTANT) */}
//       <style>
//         {`
//           @media print {
//             body {
//               background: white !important;
//             }

//             .no-print {
//               display: none !important;
//             }

//             .receipt-box {
//               box-shadow: none !important;
//               border: none !important;
//             }
//           }
//         `}
//       </style>

//       {/* RECEIPT CARD */}
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow receipt-box">

//         {/* BRAND HEADER */}
//         <div className="text-center border-b pb-4">
//           <h1 className="text-3xl font-bold tracking-wide">
//             📱 iStore.pk
//           </h1>
//           <p className="text-sm text-gray-500">
//             Premium smartphones in Pakistan
//           </p>
//           <p className="text-xs text-gray-400 mt-1">
//             Official Order Receipt
//           </p>
//         </div>

//         {/* ORDER INFO */}
//         <div className="mt-4 text-sm space-y-1">
//           <p><b>Order ID:</b> AIP-{order.id}</p>
//           <p><b>Status:</b> {order.status}</p>
//         </div>

//         {/* CUSTOMER INFO */}
//         <div className="mt-4 border-t pt-3 text-sm">
//           <p className="font-semibold mb-2">Customer Details</p>
//           <p><b>Name:</b> {order.customer?.name || order.customerName || "N/A"}</p>
//           <p><b>Phone:</b> {order.customer?.phone || order.phone || "N/A"}</p>
//           <p><b>Address:</b> {order.customer?.address || order.address || "N/A"}</p>
//         </div>

//         {/* RIDER INFO */}
//         <div className="mt-4 border-t pt-3 text-sm">
//           <p className="font-semibold mb-2">Delivery Rider</p>

//           {rider ? (
//             <div>
//               <p><b>Name:</b> {rider.name}</p>
//               <p><b>Phone:</b> {rider.phone}</p>
//             </div>
//           ) : (
//             <p className="text-red-500">No rider assigned</p>
//           )}
//         </div>

//         {/* ITEMS */}
//         <div className="mt-4 border-t pt-3 text-sm">
//           <p className="font-semibold mb-2">Order Items</p>

//           <div className="space-y-2">
//             {order.items?.map((i, idx) => (
//               <div
//                 key={idx}
//                 className="flex justify-between border-b pb-1"
//               >
//                 <span>
//                   {i.product.name} × {i.quantity}
//                 </span>
//                 <span>
//                   Rs {(i.product.price || 0) * i.quantity}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* TOTAL */}
//         <div className="mt-4 border-t pt-3 flex justify-between font-bold text-lg">
//           <span>Total Amount</span>
//           <span>Rs {total || 0}</span>
//         </div>

//         {/* TIMELINE */}
//         <div className="mt-4 border-t pt-3 text-xs text-gray-600">
//           <p className="font-semibold mb-2">Order Timeline</p>

//           {(order.history || []).length === 0 ? (
//             <p>No activity recorded</p>
//           ) : (
//             order.history.map((h, i) => (
//               <p key={i}>
//                 ✔ {h.action} — {h.time}
//               </p>
//             ))
//           )}
//         </div>

//         {/* FOOTER */}
//         <div className="mt-6 text-center text-xs text-gray-400 border-t pt-3">
//           Thank you for choosing iStore.pk 💙
//         </div>

//         {/* BUTTONS (NO PRINT CLUTTER) */}
//         <div className="mt-6 flex gap-3 justify-center no-print">

//           <button
//             onClick={printPage}
//             className="bg-black text-white px-4 py-2 rounded"
//           >
//             Print Receipt
//           </button>

//           <button
//             onClick={() => window.close()}
//             className="bg-gray-500 text-white px-4 py-2 rounded"
//           >
//             Close
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }

// export default ReceiptPage;








import { useEffect, useState } from "react";

function ReceiptPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Admin sets "receipt" key — was "selectedReceipt" before (mismatch fixed)
    const raw = localStorage.getItem("receipt");
    if (!raw) return;
    try {
      setOrder(JSON.parse(raw));
    } catch { /* bad JSON — ignore */ }
  }, []);

  const printPage = () => window.print();

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold text-red-500">No Receipt Found</h2>
        <p className="text-sm text-gray-500 mt-2">Open this page from the Admin panel Print button.</p>
      </div>
    );
  }

  const items       = order.orderItems || [];
  const accessories = order.accessories || [];
  const customer    = order.shippingAddress || {};
  const rider       = order.rider;

  const itemsTotal  = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const accTotal    = accessories.reduce((s, a) => s + (a.price || 0), 0);
  const total       = Number(order.totalPrice || 0) || itemsTotal + accTotal;

  return (
    <div className="min-h-screen bg-gray-100 p-6 print:bg-white">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .receipt-box { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow receipt-box">

        {/* Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold">📱 iStore.pk</h1>
          <p className="text-sm text-gray-500">Premium smartphones in Pakistan</p>
          <p className="text-xs text-gray-400 mt-1">Official Order Receipt</p>
        </div>

        {/* Order info */}
        <div className="mt-4 text-sm space-y-1">
          <p><b>Order ID:</b> {order.orderId || order._id}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Type:</b> {order.type}</p>
          <p><b>Date:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</p>
        </div>

        {/* Customer */}
        <div className="mt-4 border-t pt-3 text-sm">
          <p className="font-semibold mb-2">Customer Details</p>
          <p><b>Name:</b>    {customer.name    || order.name    || "N/A"}</p>
          <p><b>Phone:</b>   {customer.phone   || order.phone   || "N/A"}</p>
          <p><b>Address:</b> {customer.address || order.address || "N/A"}</p>
          {customer.city && <p><b>City:</b> {customer.city}</p>}
        </div>

        {/* Rider */}
        {order.type === "delivery" && (
          <div className="mt-4 border-t pt-3 text-sm">
            <p className="font-semibold mb-2">Delivery Rider</p>
            {rider ? (
              <>
                <p><b>Name:</b>  {rider.name}</p>
                <p><b>Phone:</b> {rider.phone}</p>
              </>
            ) : (
              <p className="text-gray-400 italic">No rider assigned yet</p>
            )}
          </div>
        )}

        {order.type === "pickup" && (
          <div className="mt-4 border-t pt-3 text-sm bg-blue-50 p-3 rounded-lg">
            <p className="font-semibold mb-1">🏪 Store Pickup</p>
            <p>iStore.pk — Saddar Market, Rawalpindi</p>
            <p className="text-xs text-gray-500 mt-1">Show this Order ID at counter</p>
          </div>
        )}

        {/* Items */}
        <div className="mt-4 border-t pt-3 text-sm">
          <p className="font-semibold mb-2">Order Items</p>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between border-b pb-1">
                <span>{item.name} × {item.qty}</span>
                <span>Rs {((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accessories */}
        {accessories.length > 0 && (
          <div className="mt-3 text-sm">
            <p className="font-semibold mb-1">Accessories</p>
            {accessories.map((a, i) => (
              <div key={i} className="flex justify-between text-gray-600">
                <span>{a.name}</span>
                <span>Rs {a.price?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Warranty */}
        {order.warranty && order.warranty !== "none" && (
          <div className="mt-2 text-sm text-gray-600">
            <b>Warranty:</b> {order.warranty}
          </div>
        )}

        {/* Total */}
        <div className="mt-4 border-t pt-3 flex justify-between font-bold text-lg">
          <span>Total Amount</span>
          <span>Rs {total.toLocaleString()}</span>
        </div>

        {/* History/Timeline */}
        {order.history?.length > 0 && (
          <div className="mt-4 border-t pt-3 text-xs text-gray-600">
            <p className="font-semibold mb-2">Order Timeline</p>
            {order.history.map((h, i) => (
              <p key={i}>✔ {h.action} — {new Date(h.time).toLocaleString()}</p>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400 border-t pt-3">
          Thank you for choosing iStore.pk 💙
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3 justify-center no-print">
          <button onClick={printPage} className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800">
            Print Receipt
          </button>
          <button onClick={() => window.close()} className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptPage;