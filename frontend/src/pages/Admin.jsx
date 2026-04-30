import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const API = "http://localhost:5001/api";
const socket = io("http://localhost:5001");

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
});

const STATUS_STEPS = [
  "pending",
  "confirmed",
  "rider_assigned",
  "out_for_delivery",
  "delivered",
  "completed",
];

const STATUS_COLORS = {
  pending:          "bg-gray-100 text-gray-600",
  confirmed:        "bg-green-100 text-green-700",
  rider_assigned:   "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-yellow-100 text-yellow-800",
  delivered:        "bg-purple-100 text-purple-700",
  completed:        "bg-black text-white",
};

const CONDITION_COLORS = {
  New:            "bg-green-100 text-green-700",
  Used:           "bg-orange-100 text-orange-700",
  "PTA Approved": "bg-blue-100 text-blue-700",
};

// ── Apple logo ──────────────────────────────────────────────
const AppleLogo = () => (
  <svg viewBox="0 0 814 1000" fill="currentColor" className="w-5 h-5">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

// ── Toast ───────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl
      ${toast.type === "error" ? "bg-red-500 text-white" : "bg-black text-white"}`}>
      {toast.msg}
    </div>
  );
}

const Empty = ({ icon, msg }) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
    <span className="text-5xl mb-3">{icon}</span>
    <p className="text-sm">{msg}</p>
  </div>
);

const Toggle = ({ on, onChange, colorOn = "bg-black", colorOff = "bg-gray-300" }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none
      ${on ? colorOn : colorOff}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
      ${on ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

// ═══════════════════════════════════════════════════════════
//  ORDERS TAB
// ═══════════════════════════════════════════════════════════
function OrdersTab({ orders, riders, loadOrders }) {
  const { toast, show } = useToast();
  const [filter, setFilter] = useState("all");

  const nextStep = (status) => {
    const i = STATUS_STEPS.indexOf(status);
    return STATUS_STEPS[i + 1] || null;
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/orders/${id}/status`, { status }, { headers: authHeaders() });
      loadOrders();
      show(`Status → ${status}`);
    } catch { show("Failed to update status", "error"); }
  };

  const assignRider = async (orderId, riderId) => {
    try {
      await axios.put(`${API}/orders/${orderId}/status`, { riderId }, { headers: authHeaders() });
      loadOrders();
      show("Rider assigned");
    } catch { show("Failed to assign rider", "error"); }
  };

  const autoAssign = async (order) => {
    const available = riders.filter((r) => r.status === "on");
    if (!available.length) return show("No riders available", "error");
    let selected = available[0], min = Infinity;
    available.forEach((r) => {
      const c = orders.filter((o) => o.rider?._id === r._id).length;
      if (c < min) { min = c; selected = r; }
    });
    await assignRider(order._id, selected._id);
  };

  const printReceipt = (order) => {
    localStorage.setItem("receipt", JSON.stringify(order));
    window.open("/receipt", "_blank");
  };

  const counts = {};
  STATUS_STEPS.forEach((s) => { counts[s] = orders.filter((o) => o.status === s).length; });
  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // ── Order action buttons — split by type ─────────────────
  const OrderActions = ({ order }) => {
    const next = nextStep(order.status);
    const isPickup   = order.type === "pickup";
    const isDelivery = order.type === "delivery";

    // ── PICKUP: only Confirm → Completed (no rider steps) ──
    if (isPickup) {
      return (
        <div className="flex gap-2 flex-wrap mt-4">
          {order.status === "pending" && (
            <button
              onClick={() => updateStatus(order._id, "confirmed")}
              className="bg-black text-white px-3 py-1.5 text-xs rounded-lg hover:bg-gray-800 transition-colors"
            >
              ✔ Confirm Order
            </button>
          )}
          {order.status === "confirmed" && (
            <button
              onClick={() => updateStatus(order._id, "completed")}
              className="bg-green-700 text-white px-3 py-1.5 text-xs rounded-lg hover:bg-green-800 transition-colors"
            >
              ✅ Mark Completed
            </button>
          )}
          {/* Already done */}
          {order.status === "completed" && (
            <span className="text-xs text-gray-400 italic">Pickup completed</span>
          )}
        </div>
      );
    }

    // ── DELIVERY: full flow with rider ───────────────────────
    if (isDelivery) {
      return (
        <div className="flex gap-2 flex-wrap mt-4">
          {order.status === "pending" && (
            <button
              onClick={() => updateStatus(order._id, "confirmed")}
              className="bg-black text-white px-3 py-1.5 text-xs rounded-lg hover:bg-gray-800 transition-colors"
            >
              ✔ Confirm Order
            </button>
          )}

          {/* Rider assignment only at confirmed stage */}
          {order.status === "confirmed" && (
            <>
              <select
                defaultValue=""
                onChange={(e) => e.target.value && assignRider(order._id, e.target.value)}
                className="border border-gray-200 px-2 py-1.5 text-xs rounded-lg bg-white"
              >
                <option value="" disabled>Select Rider</option>
                {riders.filter((r) => r.status === "on").map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
              <button
                onClick={() => autoAssign(order)}
                className="border border-black text-black px-3 py-1.5 text-xs rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                ⚡ Auto Assign
              </button>
            </>
          )}

          {/* Push to next step for everything after confirmed */}
          {next && !["pending", "confirmed", "completed"].includes(order.status) && (
            <button
              onClick={() => updateStatus(order._id, next)}
              className="bg-black text-white px-3 py-1.5 text-xs rounded-lg hover:bg-gray-800 transition-colors"
            >
              → {next.replace(/_/g, " ")}
            </button>
          )}

          {order.status === "completed" && (
            <span className="text-xs text-gray-400 italic">Order completed</span>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <Toast toast={toast} />

      {/* Summary cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
        {STATUS_STEPS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-xl p-3 text-left border transition-all
              ${filter === s ? "bg-black border-black text-white" : "bg-white border-gray-200 hover:border-gray-400"}`}>
            <p className={`text-xs capitalize mb-1 truncate ${filter === s ? "text-gray-400" : "text-gray-500"}`}>
              {s.replace(/_/g, " ")}
            </p>
            <p className={`text-2xl font-bold ${filter === s ? "text-white" : "text-gray-900"}`}>{counts[s]}</p>
          </button>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        {["all", ...STATUS_STEPS].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all
              ${filter === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            {s.replace(/_/g, " ")}
            {s !== "all" && <span className="ml-1 opacity-50">({counts[s]})</span>}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {visible.length === 0 ? <Empty icon="📦" msg="No orders here" /> : (
        <div className="space-y-4">
          {visible.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-all">

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono font-bold text-sm">{order.orderId}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status?.replace(/_/g, " ")}
                    </span>
                    {/* Type badge — colored differently */}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${order.type === "pickup"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"}`}>
                      {order.type === "pickup" ? "🏪 Pickup" : "🚚 Delivery"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {order.createdAt && new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <button onClick={() => printReceipt(order)}
                  className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                  🖨️ Print
                </button>
              </div>

              {/* Customer */}
              {order.shippingAddress && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-3 text-xs space-y-0.5">
                  <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-gray-500">{order.shippingAddress.phone}</p>
                  <p className="text-gray-500">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                </div>
              )}

              {/* Pickup info box */}
              {order.type === "pickup" && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3 text-xs text-blue-700">
                  🏪 <span className="font-medium">Store Pickup</span> — Customer will collect from iStore.pk, Saddar Rawalpindi
                </div>
              )}

              {/* Items */}
              <div className="space-y-1 mb-3">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">• {item.name} <span className="text-gray-400">×{item.qty}</span></span>
                    <span className="font-medium text-gray-900">Rs {item.price?.toLocaleString()}</span>
                  </div>
                ))}
                {order.accessories?.map((a, i) => (
                  <div key={i} className="flex justify-between text-xs text-gray-400 pl-3">
                    <span>+ {a.name}</span>
                    <span>Rs {a.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Total row */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-2 mb-2">
                <div className="flex gap-3 text-xs text-gray-400">
                  {order.warranty && <span>🛡️ {order.warranty}</span>}
                  {order.promoCode && <span>🏷️ {order.promoCode}</span>}
                </div>
                <span className="font-bold text-gray-900">Rs {order.totalPrice?.toLocaleString()}</span>
              </div>

              {/* Rider badge */}
              {order.rider && (
                <div className="flex items-center gap-2 mb-2 text-xs bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">
                  🏍️ <span className="font-medium text-gray-800">{order.rider.name}</span>
                  {order.rider.phone && (
                    <a href={`tel:${order.rider.phone}`} className="ml-auto text-black underline">Call</a>
                  )}
                </div>
              )}

              {/* ── Action buttons (type-aware) ── */}
              <OrderActions order={order} />

              {/* History */}
              {order.history?.length > 0 && (
                <div className="mt-3 border-t border-gray-100 pt-2 space-y-0.5">
                  {order.history.map((h, i) => (
                    <p key={i} className="text-xs text-gray-400">✔ {h.action} — {new Date(h.time).toLocaleString()}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RIDERS TAB
// ═══════════════════════════════════════════════════════════
function RidersTab({ riders, loadRiders, orders }) {
  const { toast, show } = useToast();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const addRider = async () => {
    if (!form.name.trim() || !form.phone.trim()) return show("Name and phone required", "error");
    setSaving(true);
    try {
      await axios.post(`${API}/riders`, form, { headers: authHeaders() });
      setForm({ name: "", phone: "" });
      loadRiders();
      show("Rider added!");
    } catch { show("Failed to add rider", "error"); }
    setSaving(false);
  };

  // ✅ Fixed: calls PUT /riders/:id/status (matches new riderRoutes.js)
  const toggleStatus = async (rider) => {
    const newStatus = rider.status === "on" ? "off" : "on";
    try {
      await axios.put(
        `${API}/riders/${rider._id}/status`,
        { status: newStatus },
        { headers: authHeaders() }
      );
      loadRiders();
      show(`${rider.name} → ${newStatus === "on" ? "On Duty" : "Off Duty"}`);
    } catch { show("Failed to update", "error"); }
  };

  const deleteRider = async (id) => {
    try {
      await axios.delete(`${API}/riders/${id}`, { headers: authHeaders() });
      loadRiders();
      show("Rider removed");
      setDeleteId(null);
    } catch { show("Failed to delete", "error"); }
  };

  const activeOrdersFor = (riderId) =>
    orders.filter((o) => o.rider?._id === riderId && !["completed", "delivered"].includes(o.status)).length;

  const onCount  = riders.filter((r) => r.status === "on").length;
  const offCount = riders.filter((r) => r.status !== "on").length;

  return (
    <div>
      <Toast toast={toast} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Riders</p>
          <p className="text-2xl font-bold text-gray-900">{riders.length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-xs text-green-700 mb-1">On Duty</p>
          <p className="text-2xl font-bold text-green-700">{onCount}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-xs text-red-600 mb-1">Off Duty</p>
          <p className="text-2xl font-bold text-red-600">{offCount}</p>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 text-sm">Add New Rider</h2>
        <div className="flex gap-3 flex-wrap">
          <input type="text" placeholder="Rider name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && addRider()}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-[150px] focus:outline-none focus:border-gray-400" />
          <input type="text" placeholder="Phone number" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && addRider()}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-[150px] focus:outline-none focus:border-gray-400" />
          <button onClick={addRider} disabled={saving}
            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
            {saving ? "Adding…" : "+ Add Rider"}
          </button>
        </div>
      </div>

      {/* Riders grid */}
      {riders.length === 0 ? <Empty icon="🏍️" msg="No riders added yet" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riders.map((rider) => {
            const isOn = rider.status === "on";
            const active = activeOrdersFor(rider._id);
            return (
              <div key={rider._id}
                className={`rounded-2xl border-2 p-5 transition-all
                  ${isOn ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold
                      ${isOn ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                      {rider.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{rider.name}</p>
                      <p className="text-xs text-gray-500">{rider.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Toggle
                      on={isOn}
                      onChange={() => toggleStatus(rider)}
                      colorOn="bg-green-500"
                      colorOff="bg-red-400"
                    />
                    <span className={`text-xs font-semibold ${isOn ? "text-green-700" : "text-red-600"}`}>
                      {isOn ? "On Duty" : "Off Duty"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                      ${isOn ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                      {isOn ? "🟢 Available" : "🔴 Offline"}
                    </span>
                    {active > 0 && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-black text-white font-medium">
                        {active} active {active === 1 ? "order" : "orders"}
                      </span>
                    )}
                  </div>
                  {deleteId === rider._id ? (
                    <div className="flex gap-2 items-center">
                      <button onClick={() => deleteRider(rider._id)} className="text-xs text-red-600 font-semibold">Confirm</button>
                      <button onClick={() => setDeleteId(null)} className="text-xs text-gray-500">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(rider._id)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PRODUCTS TAB
// ═══════════════════════════════════════════════════════════
const EMPTY_PRODUCT = {
  name: "", model: "", storage: "", condition: "New",
  price: "", batteryHealth: "", images: [],
  description: "", imei: "", originalParts: true,
  partsChanged: "", warrantyNote: "", inStock: true,
};

function ProductsTab() {
  const { toast, show } = useToast();
  const [products, setProducts]       = useState([]);
  const [fetching, setFetching]       = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editId, setEditId]           = useState(null);
  const [form, setForm]               = useState(EMPTY_PRODUCT);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState(null);
  const [search, setSearch]           = useState("");
  const [filterCond, setFilterCond]   = useState("all");
  const [filterStock, setFilterStock] = useState("all");

  const loadProducts = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API}/products`, { headers: authHeaders() });
      const list = Array.isArray(res.data) ? res.data
        : Array.isArray(res.data?.data) ? res.data.data : [];
      setProducts(list);
    } catch { show("Failed to load products", "error"); }
    setFetching(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const openAdd  = () => { setForm(EMPTY_PRODUCT); setEditId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...EMPTY_PRODUCT, ...p }); setEditId(p._id); setShowForm(true); };
  const f = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const submitProduct = async () => {
    if (!form.name.trim() || !form.price) return show("Name and price required", "error");
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`${API}/products/${editId}`, form, { headers: authHeaders() });
        show("Product updated!");
      } else {
        await axios.post(`${API}/products`, form, { headers: authHeaders() });
        show("Product added!");
      }
      setShowForm(false);
      loadProducts();
    } catch { show("Failed to save product", "error"); }
    setSaving(false);
  };

  const toggleStock = async (product) => {
    try {
      await axios.put(`${API}/products/${product._id}`, { inStock: !product.inStock }, { headers: authHeaders() });
      loadProducts();
      show(product.inStock ? "Marked as sold out" : "Back in stock");
    } catch { show("Failed to update", "error"); }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`, { headers: authHeaders() });
      loadProducts();
      show("Product deleted");
      setDeleteId(null);
    } catch { show("Failed to delete", "error"); }
  };

  const visible = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = (p.name || "").toLowerCase().includes(q) || (p.model || "").toLowerCase().includes(q);
    const matchCond   = filterCond === "all" || p.condition === filterCond;
    const matchStock  = filterStock === "all"
      || (filterStock === "inStock" && p.inStock)
      || (filterStock === "soldOut" && !p.inStock);
    return matchSearch && matchCond && matchStock;
  });

  return (
    <div>
      <Toast toast={toast} />

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl my-6 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
                <input value={form.name} onChange={(e) => f("name", e.target.value)}
                  placeholder="e.g. iPhone 13 Pro Max"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
                <select value={form.model} onChange={(e) => f("model", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400">
                  <option value="">Select model</option>
                  {["iPhone 11","iPhone 12","iPhone 12 Pro","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max",
                    "iPhone 14","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Pro","iPhone 15 Pro Max",
                    "iPhone 16","iPhone 16 Pro","iPhone 16 Pro Max"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Storage</label>
                <select value={form.storage} onChange={(e) => f("storage", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400">
                  <option value="">Select storage</option>
                  {["64GB","128GB","256GB","512GB","1TB"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Condition</label>
                <select value={form.condition} onChange={(e) => f("condition", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400">
                  <option>New</option>
                  <option>Used</option>
                  <option>PTA Approved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Price (Rs) *</label>
                <input type="number" value={form.price} onChange={(e) => f("price", e.target.value)}
                  placeholder="e.g. 185000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Battery Health (%)</label>
                <input type="number" min="0" max="100" value={form.batteryHealth} onChange={(e) => f("batteryHealth", e.target.value)}
                  placeholder="e.g. 89"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">IMEI</label>
                <input value={form.imei} onChange={(e) => f("imei", e.target.value)}
                  placeholder="15-digit IMEI"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Image URLs <span className="text-gray-400 font-normal">(comma separated)</span>
                </label>
                <input
                  value={Array.isArray(form.images) ? form.images.join(", ") : ""}
                  onChange={(e) => f("images", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description / Condition Notes</label>
                <textarea value={form.description} onChange={(e) => f("description", e.target.value)}
                  rows={3} placeholder="e.g. Minor scratches on back, screen in perfect condition..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Parts Changed</label>
                <input value={form.partsChanged} onChange={(e) => f("partsChanged", e.target.value)}
                  placeholder="e.g. Battery, Screen"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Warranty Note</label>
                <input value={form.warrantyNote} onChange={(e) => f("warrantyNote", e.target.value)}
                  placeholder="e.g. 10-day check warranty"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div className="md:col-span-2 flex gap-6 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Toggle on={form.inStock} onChange={() => f("inStock", !form.inStock)} />
                  <span className="text-sm text-gray-700">In Stock</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Toggle on={form.originalParts} onChange={() => f("originalParts", !form.originalParts)} />
                  <span className="text-sm text-gray-700">All Original Parts</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={submitProduct} disabled={saving}
                className="flex-1 bg-black text-white py-2.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Product"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-5 border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input type="text" placeholder="Search products…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-[180px] focus:outline-none focus:border-gray-400" />
        <select value={filterCond} onChange={(e) => setFilterCond(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
          <option value="all">All Conditions</option>
          <option>New</option><option>Used</option><option>PTA Approved</option>
        </select>
        <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
          <option value="all">All Stock</option>
          <option value="inStock">In Stock</option>
          <option value="soldOut">Sold Out</option>
        </select>
        <button onClick={openAdd}
          className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-xs text-green-700 mb-1">In Stock</p>
          <p className="text-2xl font-bold text-green-700">{products.filter((p) => p.inStock).length}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-xs text-red-600 mb-1">Sold Out</p>
          <p className="text-2xl font-bold text-red-600">{products.filter((p) => !p.inStock).length}</p>
        </div>
      </div>

      {/* Grid */}
      {fetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="w-full h-36 bg-gray-100 rounded-xl mb-3" />
              <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Empty icon="📱" msg={products.length === 0 ? "No products yet — add your first one!" : "No products match your filters"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((product) => (
            <div key={product._id}
              className={`bg-white rounded-2xl border p-4 transition-all
                ${!product.inStock ? "opacity-60 border-gray-100" : "border-gray-200 hover:border-gray-300"}`}>

              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name}
                  className="w-full h-36 object-cover rounded-xl mb-3 bg-gray-100" />
              ) : (
                <div className="w-full h-36 rounded-xl mb-3 bg-gray-100 flex items-center justify-center text-4xl">📱</div>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{product.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap
                  ${CONDITION_COLORS[product.condition] || "bg-gray-100 text-gray-600"}`}>
                  {product.condition}
                </span>
              </div>

              <div className="flex gap-1.5 flex-wrap mb-2">
                {product.storage && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{product.storage}</span>
                )}
                {product.batteryHealth && (
                  <span className={`text-xs px-2 py-0.5 rounded-full
                    ${product.batteryHealth >= 85 ? "bg-green-100 text-green-700"
                      : product.batteryHealth >= 70 ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"}`}>
                    🔋 {product.batteryHealth}%
                  </span>
                )}
                {!product.inStock && (
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Sold Out</span>
                )}
                {product.partsChanged && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Parts replaced</span>
                )}
              </div>

              <p className="font-bold text-gray-900 mb-1">Rs {Number(product.price).toLocaleString()}</p>

              {product.description && (
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
              )}

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(product)}
                  className="flex-1 border border-gray-200 text-gray-700 text-xs py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  ✏️ Edit
                </button>
                <button onClick={() => toggleStock(product)}
                  className={`flex-1 text-xs py-2 rounded-xl border transition-colors
                    ${product.inStock
                      ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                      : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"}`}>
                  {product.inStock ? "Sold Out" : "Back in Stock"}
                </button>
                {deleteId === product._id ? (
                  <div className="flex gap-1 items-center px-1">
                    <button onClick={() => deleteProduct(product._id)} className="text-xs text-red-600 font-semibold">Yes</button>
                    <span className="text-gray-300 text-xs">|</span>
                    <button onClick={() => setDeleteId(null)} className="text-xs text-gray-500">No</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(product._id)}
                    className="border border-gray-200 text-gray-400 text-xs py-2 px-3 rounded-xl hover:text-red-500 hover:border-red-200 transition-colors">
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  USERS TAB — paste this BEFORE the ROOT AdminPanel export
//  in Admin.jsx, then add it to TABS and the render section
// ═══════════════════════════════════════════════════════════

function UsersTab() {
  const { toast, show } = useToast();
  const [users, setUsers]     = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch]   = useState("");

  const loadUsers = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API}/auth/users`, { headers: authHeaders() });
      const list = Array.isArray(res.data) ? res.data : [];
      setUsers(list);
    } catch { show("Failed to load users", "error"); }
    setFetching(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/auth/users/${id}`, { headers: authHeaders() });
      loadUsers();
      show("User removed");
      setDeleteId(null);
    } catch (err) {
      show(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await axios.put(
        `${API}/auth/users/${user._id}/role`,
        { role: newRole },
        { headers: authHeaders() }
      );
      loadUsers();
      show(`${user.name} is now ${newRole}`);
    } catch (err) {
      show(err.response?.data?.message || "Failed to update role", "error");
    }
  };

  const visible = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const admins   = users.filter((u) => u.role === "admin").length;
  const regular  = users.filter((u) => u.role === "user").length;

  return (
    <div>
      <Toast toast={toast} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs text-blue-700 mb-1">Admins</p>
          <p className="text-2xl font-bold text-blue-700">{admins}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Customers</p>
          <p className="text-2xl font-bold text-gray-900">{regular}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text" placeholder="Search by name or email…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full max-w-sm focus:outline-none focus:border-gray-400"
        />
      </div>

      {/* Table */}
      {fetching ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Empty icon="👥" msg="No users found" />
      ) : (
        <div className="space-y-3">
          {visible.map((user) => {
            const isAdmin   = user.role === "admin";
            const initials  = (user.name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={user._id} className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition-all">
                <div className="flex items-center gap-4">

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${isAdmin ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${isAdmin ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" }) : "—"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">

                    {/* Make admin / remove admin */}
                    <button
                      onClick={() => toggleRole(user)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium
                        ${isAdmin
                          ? "border-gray-200 text-gray-500 hover:bg-gray-50"
                          : "border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100"}`}
                    >
                      {isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>

                    {/* Delete — can't delete admins */}
                    {!isAdmin && (
                      deleteId === user._id ? (
                        <div className="flex gap-1 items-center">
                          <button onClick={() => deleteUser(user._id)} className="text-xs text-red-600 font-semibold px-2">Confirm</button>
                          <button onClick={() => setDeleteId(null)} className="text-xs text-gray-400 px-1">Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(user._id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2"
                        >
                          🗑️
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




// ═══════════════════════════════════════════════════════════
//  PROMOS TAB — paste this into Admin.jsx before AdminPanel export
//  Then add { id: "promos", label: "Promos", icon: "🏷️", badge: 0 }
//  to TABS array, and {tab === "promos" && <PromosTab />} to render
// ═══════════════════════════════════════════════════════════

function PromosTab() {
  const { toast, show } = useToast();
  const [promos, setPromos]   = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const EMPTY = { code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "" };
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const loadPromos = async () => {
    setFetching(true);
    try {
      const res  = await axios.get(`${API}/promos`, { headers: authHeaders() });
      setPromos(Array.isArray(res.data) ? res.data : []);
    } catch { show("Failed to load promos", "error"); }
    setFetching(false);
  };

  useEffect(() => { loadPromos(); }, []);

  const f = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const createPromo = async () => {
    if (!form.code.trim() || !form.value) return show("Code and value required", "error");
    setSaving(true);
    try {
      await axios.post(`${API}/promos`, {
        code:      form.code,
        type:      form.type,
        value:     Number(form.value),
        minOrder:  form.minOrder  ? Number(form.minOrder)  : 0,
        maxUses:   form.maxUses   ? Number(form.maxUses)   : null,
        expiresAt: form.expiresAt || null,
      }, { headers: authHeaders() });
      setForm(EMPTY);
      setShowForm(false);
      loadPromos();
      show("Promo created!");
    } catch (err) {
      show(err.response?.data?.message || "Failed to create", "error");
    }
    setSaving(false);
  };

  const togglePromo = async (promo) => {
    try {
      await axios.put(`${API}/promos/${promo._id}/toggle`, {}, { headers: authHeaders() });
      loadPromos();
      show(`${promo.code} ${promo.active ? "deactivated" : "activated"}`);
    } catch { show("Failed to update", "error"); }
  };

  const deletePromo = async (id) => {
    try {
      await axios.delete(`${API}/promos/${id}`, { headers: authHeaders() });
      loadPromos();
      show("Promo deleted");
      setDeleteId(null);
    } catch { show("Failed to delete", "error"); }
  };

  const isExpired = (p) => p.expiresAt && new Date() > new Date(p.expiresAt);
  const isMaxed   = (p) => p.maxUses !== null && p.usedCount >= p.maxUses;

  return (
    <div>
      <Toast toast={toast} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Codes</p>
          <p className="text-2xl font-bold text-gray-900">{promos.length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-xs text-green-700 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-700">{promos.filter((p) => p.active && !isExpired(p) && !isMaxed(p)).length}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Uses</p>
          <p className="text-2xl font-bold text-gray-900">{promos.reduce((s, p) => s + (p.usedCount || 0), 0)}</p>
        </div>
      </div>

      {/* Add button */}
      <div className="mb-5">
        <button onClick={() => setShowForm((v) => !v)}
          className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          {showForm ? "✕ Cancel" : "+ Create Promo Code"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm">New Promo Code</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Code *</label>
              <input value={form.code} onChange={(e) => f("code", e.target.value.toUpperCase())}
                placeholder="e.g. SAVE200" maxLength={20}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-gray-400 uppercase tracking-wider font-mono" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Discount Type *</label>
              <select value={form.type} onChange={(e) => f("type", e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full bg-white focus:outline-none focus:border-gray-400">
                <option value="percentage">Percentage (%) off</option>
                <option value="fixed">Fixed Amount (Rs) off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {form.type === "percentage" ? "Percentage (%) *" : "Amount (Rs) *"}
              </label>
              <input type="number" value={form.value} onChange={(e) => f("value", e.target.value)}
                placeholder={form.type === "percentage" ? "e.g. 10" : "e.g. 500"} min="1"
                max={form.type === "percentage" ? "100" : undefined}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-gray-400" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Minimum Order (Rs)</label>
              <input type="number" value={form.minOrder} onChange={(e) => f("minOrder", e.target.value)}
                placeholder="e.g. 10000 (optional)"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-gray-400" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => f("maxUses", e.target.value)}
                placeholder="Leave blank for unlimited"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-gray-400" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
              <input type="date" value={form.expiresAt} onChange={(e) => f("expiresAt", e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-gray-400" />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={createPromo} disabled={saving}
              className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
              {saving ? "Creating…" : "Create Code"}
            </button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY); }}
              className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Promos list */}
      {fetching ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : promos.length === 0 ? (
        <Empty icon="🏷️" msg="No promo codes yet — create one!" />
      ) : (
        <div className="space-y-3">
          {promos.map((promo) => {
            const expired = isExpired(promo);
            const maxed   = isMaxed(promo);
            const dead    = !promo.active || expired || maxed;

            return (
              <div key={promo._id}
                className={`bg-white rounded-2xl border p-5 transition-all
                  ${dead ? "opacity-60 border-gray-100" : "border-gray-200 hover:border-gray-300"}`}>

                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Code pill */}
                    <span className="font-mono font-bold text-base bg-gray-100 px-3 py-1 rounded-lg tracking-wider">
                      {promo.code}
                    </span>

                    {/* Discount value */}
                    <span className={`text-sm font-bold px-2.5 py-1 rounded-full
                      ${promo.type === "percentage"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"}`}>
                      {promo.type === "percentage" ? `${promo.value}% off` : `Rs ${promo.value.toLocaleString()} off`}
                    </span>

                    {/* Status badges */}
                    {expired && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Expired</span>}
                    {maxed   && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Limit reached</span>}
                    {!promo.active && !expired && !maxed && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Inactive</span>
                    )}
                    {promo.active && !expired && !maxed && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Toggle
                      on={promo.active && !expired && !maxed}
                      onChange={() => togglePromo(promo)}
                    />

                    {deleteId === promo._id ? (
                      <div className="flex gap-1 items-center ml-2">
                        <button onClick={() => deletePromo(promo._id)} className="text-xs text-red-600 font-semibold">Confirm</button>
                        <button onClick={() => setDeleteId(null)} className="text-xs text-gray-400 ml-1">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(promo._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xs ml-2">
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {/* Details row */}
                <div className="flex gap-4 flex-wrap mt-3 text-xs text-gray-400">
                  <span>Used: <span className="font-medium text-gray-600">{promo.usedCount}</span>{promo.maxUses !== null ? ` / ${promo.maxUses}` : ""}</span>
                  {promo.minOrder > 0 && <span>Min order: <span className="font-medium text-gray-600">Rs {promo.minOrder.toLocaleString()}</span></span>}
                  {promo.expiresAt && <span>Expires: <span className="font-medium text-gray-600">{new Date(promo.expiresAt).toLocaleDateString("en-PK", { dateStyle: "medium" })}</span></span>}
                  <span>Created: <span className="font-medium text-gray-600">{new Date(promo.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// In AdminPanel's TABS array, add:
//   { id: "users", label: "Users", icon: "👥", badge: 0 },
//
// In the render section, add:
//   {tab === "users" && <UsersTab />}
// ─────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════
//  ROOT — ADMIN PANEL
// ═══════════════════════════════════════════════════════════
export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  const [tab, setTab]       = useState("orders");
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [badge, setBadge]   = useState(0);
  // const [UserTab, setUsers] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`, { headers: authHeaders() });
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setOrders(list);
    } catch { /* silent */ }
  };

  const loadRiders = async () => {
    try {
      const res = await axios.get(`${API}/riders`, { headers: authHeaders() });
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setRiders(list);
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (!token) return navigate("/admin-login");
    loadOrders();
    loadRiders();
    socket.on("order_updated", () => {
      loadOrders();
      setBadge((c) => c + 1);
    });
    return () => socket.off("order_updated");
  }, []);

  const logout = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  navigate("/admin-login");
};
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const TABS = [
    { id: "orders",   label: "Orders",   icon: "📦", badge: pendingCount },
    { id: "riders",   label: "Riders",   icon: "🏍️", badge: 0 },
    { id: "products", label: "Products", icon: "📱", badge: 0 },
    { id: "users", label: "Users", icon: "👥", badge: 0 },
    { id: "promos", label: "Promos", icon: "🏷️", badge: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="text-white"><AppleLogo /></div>
            <span className="font-bold text-white tracking-tight">iStore Admin</span>
            <div className="flex items-center gap-1.5 ml-3">
              <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-950 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Live
              </div>
            </div>
          </div>
          <button onClick={logout}
            className="text-xs text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
            Logout
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex">
          {TABS.map(({ id, label, icon, badge: b }) => (
            <button key={id}
              onClick={() => { setTab(id); if (id === "orders") setBadge(0); }}
              className={`relative px-5 py-3 text-sm font-medium transition-all border-b-2
                ${tab === id ? "border-white text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
              <span className="mr-1">{icon}</span>{label}
              {b > 0 && (
                <span className="absolute -top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                  {b}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {tab === "orders"   && <OrdersTab   orders={orders}  riders={riders} loadOrders={loadOrders} />}
        {tab === "riders"   && <RidersTab   riders={riders}  loadRiders={loadRiders} orders={orders} />}
        {tab === "products" && <ProductsTab />}
        {tab === "users" && <UsersTab />}
        {tab === "promos" && <PromosTab />}
      </div>
    </div>
  );
}

















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";

// const API = "http://localhost:5001/api";
// const socket = io("http://localhost:5001");

// const authHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// });

// const STATUS_STEPS = [
//   "pending",
//   "confirmed",
//   "rider_assigned",
//   "out_for_delivery",
//   "delivered",
//   "completed",
// ];

// const STATUS_COLORS = {
//   pending:          "bg-gray-100 text-gray-600",
//   confirmed:        "bg-green-100 text-green-700",
//   rider_assigned:   "bg-blue-100 text-blue-700",
//   out_for_delivery: "bg-yellow-100 text-yellow-800",
//   delivered:        "bg-purple-100 text-purple-700",
//   completed:        "bg-black text-white",
// };

// const CONDITION_COLORS = {
//   New:              "bg-green-100 text-green-700",
//   Used:             "bg-orange-100 text-orange-700",
//   "PTA Approved":   "bg-blue-100 text-blue-700",
// };

// // ── Apple logo SVG ──────────────────────────────────────────
// const AppleLogo = () => (
//   <svg viewBox="0 0 814 1000" fill="currentColor" className="w-5 h-5">
//     <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
//   </svg>
// );

// // ── Toast ───────────────────────────────────────────────────
// function useToast() {
//   const [toast, setToast] = useState(null);
//   const show = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };
//   return { toast, show };
// }

// function Toast({ toast }) {
//   if (!toast) return null;
//   return (
//     <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl
//       ${toast.type === "error" ? "bg-red-500 text-white" : "bg-black text-white"}`}>
//       {toast.msg}
//     </div>
//   );
// }

// // ── Empty state ─────────────────────────────────────────────
// const Empty = ({ icon, msg }) => (
//   <div className="flex flex-col items-center justify-center py-20 text-gray-400">
//     <span className="text-5xl mb-3">{icon}</span>
//     <p className="text-sm">{msg}</p>
//   </div>
// );

// // ── Reusable toggle switch ──────────────────────────────────
// const Toggle = ({ on, onChange, colorOn = "bg-black", colorOff = "bg-gray-300" }) => (
//   <button
//     onClick={onChange}
//     className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none
//       ${on ? colorOn : colorOff}`}
//   >
//     <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
//       ${on ? "translate-x-6" : "translate-x-1"}`} />
//   </button>
// );

// // ═══════════════════════════════════════════════════════════
// //  ORDERS TAB
// // ═══════════════════════════════════════════════════════════
// function OrdersTab({ orders, riders, loadOrders }) {
//   const { toast, show } = useToast();
//   const [filter, setFilter] = useState("all");

//   const nextStep = (status) => {
//     const i = STATUS_STEPS.indexOf(status);
//     return STATUS_STEPS[i + 1] || null;
//   };

//   const updateStatus = async (id, status) => {
//     try {
//       await axios.put(`${API}/orders/${id}/status`, { status }, { headers: authHeaders() });
//       loadOrders();
//       show(`Status → ${status}`);
//     } catch { show("Failed to update status", "error"); }
//   };

//   const assignRider = async (orderId, riderId) => {
//     try {
//       await axios.put(`${API}/orders/${orderId}/status`, { riderId }, { headers: authHeaders() });
//       loadOrders();
//       show("Rider assigned");
//     } catch { show("Failed to assign rider", "error"); }
//   };

//   const autoAssign = async (order) => {
//     const available = riders.filter((r) => r.status === "on");
//     if (!available.length) return show("No riders available", "error");
//     let selected = available[0], min = Infinity;
//     available.forEach((r) => {
//       const c = orders.filter((o) => o.rider?._id === r._id).length;
//       if (c < min) { min = c; selected = r; }
//     });
//     await assignRider(order._id, selected._id);
//   };

//   const printReceipt = (order) => {
//     localStorage.setItem("receipt", JSON.stringify(order));
//     window.open("/receipt", "_blank");
//   };

//   const counts = {};
//   STATUS_STEPS.forEach((s) => { counts[s] = orders.filter((o) => o.status === s).length; });
//   const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

//   return (
//     <div>
//       <Toast toast={toast} />

//       {/* Summary cards */}
//       <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
//         {STATUS_STEPS.map((s) => (
//           <button key={s} onClick={() => setFilter(s)}
//             className={`rounded-xl p-3 text-left border transition-all
//               ${filter === s ? "bg-black border-black text-white" : "bg-white border-gray-200 hover:border-gray-400"}`}>
//             <p className={`text-xs capitalize mb-1 truncate ${filter === s ? "text-gray-400" : "text-gray-500"}`}>
//               {s.replace(/_/g, " ")}
//             </p>
//             <p className={`text-2xl font-bold ${filter === s ? "text-white" : "text-gray-900"}`}>{counts[s]}</p>
//           </button>
//         ))}
//       </div>

//       {/* Filter pills */}
//       <div className="flex gap-2 flex-wrap mb-5">
//         {["all", ...STATUS_STEPS].map((s) => (
//           <button key={s} onClick={() => setFilter(s)}
//             className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all
//               ${filter === s ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"}`}>
//             {s.replace(/_/g, " ")}
//             {s !== "all" && <span className="ml-1 opacity-50">({counts[s]})</span>}
//           </button>
//         ))}
//       </div>

//       {/* Orders list */}
//       {visible.length === 0 ? <Empty icon="📦" msg="No orders here" /> : (
//         <div className="space-y-4">
//           {visible.map((order) => {
//             const next = nextStep(order.status);
//             return (
//               <div key={order._id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-all">

//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1 flex-wrap">
//                       <span className="font-mono font-bold text-sm">{order.orderId}</span>
//                       <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
//                         {order.status?.replace(/_/g, " ")}
//                       </span>
//                       <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{order.type}</span>
//                     </div>
//                     <p className="text-xs text-gray-400">
//                       {order.createdAt && new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
//                     </p>
//                   </div>
//                   <button onClick={() => printReceipt(order)}
//                     className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
//                     🖨️ Print
//                   </button>
//                 </div>

//                 {order.shippingAddress && (
//                   <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-3 text-xs space-y-0.5">
//                     <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
//                     <p className="text-gray-500">{order.shippingAddress.phone}</p>
//                     <p className="text-gray-500">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
//                   </div>
//                 )}

//                 <div className="space-y-1 mb-3">
//                   {order.orderItems?.map((item, idx) => (
//                     <div key={idx} className="flex justify-between text-sm">
//                       <span className="text-gray-700">• {item.name} <span className="text-gray-400">×{item.qty}</span></span>
//                       <span className="font-medium text-gray-900">Rs {item.price?.toLocaleString()}</span>
//                     </div>
//                   ))}
//                   {order.accessories?.map((a, i) => (
//                     <div key={i} className="flex justify-between text-xs text-gray-400 pl-3">
//                       <span>+ {a.name}</span>
//                       <span>Rs {a.price?.toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="flex items-center justify-between border-t border-gray-100 pt-2 mb-3">
//                   <div className="flex gap-3 text-xs text-gray-400">
//                     {order.warranty && <span>🛡️ {order.warranty}</span>}
//                     {order.promoCode && <span>🏷️ {order.promoCode}</span>}
//                   </div>
//                   <span className="font-bold text-gray-900">Rs {order.totalPrice?.toLocaleString()}</span>
//                 </div>

//                 {order.rider && (
//                   <div className="flex items-center gap-2 mb-3 text-xs bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">
//                     🏍️ <span className="font-medium text-gray-800">{order.rider.name}</span>
//                     {order.rider.phone && (
//                       <a href={`tel:${order.rider.phone}`} className="ml-auto text-black underline">Call</a>
//                     )}
//                   </div>
//                 )}

//                 {order.type === "delivery" && (
//                   <div className="flex gap-2 flex-wrap">
//                     {order.status === "pending" && (
//                       <button onClick={() => updateStatus(order._id, "confirmed")}
//                         className="bg-black text-white px-3 py-1.5 text-xs rounded-lg hover:bg-gray-800 transition-colors">
//                         ✔ Confirm Order
//                       </button>
//                     )}
//                     {next && order.status !== "pending" && (
//                       <button onClick={() => updateStatus(order._id, next)}
//                         className="bg-black text-white px-3 py-1.5 text-xs rounded-lg hover:bg-gray-800 transition-colors">
//                         → {next.replace(/_/g, " ")}
//                       </button>
//                     )}
//                     {order.status === "confirmed" && (
//                       <>
//                         <select defaultValue=""
//                           onChange={(e) => e.target.value && assignRider(order._id, e.target.value)}
//                           className="border border-gray-200 px-2 py-1.5 text-xs rounded-lg bg-white">
//                           <option value="" disabled>Select Rider</option>
//                           {riders.filter((r) => r.status === "on").map((r) => (
//                             <option key={r._id} value={r._id}>{r.name}</option>
//                           ))}
//                         </select>
//                         <button onClick={() => autoAssign(order)}
//                           className="border border-black text-black px-3 py-1.5 text-xs rounded-lg hover:bg-black hover:text-white transition-colors">
//                           ⚡ Auto Assign
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 )}

//                 {order.history?.length > 0 && (
//                   <div className="mt-3 border-t border-gray-100 pt-2 space-y-0.5">
//                     {order.history.map((h, i) => (
//                       <p key={i} className="text-xs text-gray-400">✔ {h.action} — {new Date(h.time).toLocaleString()}</p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════
// //  RIDERS TAB
// // ═══════════════════════════════════════════════════════════
// function RidersTab({ riders, loadRiders, orders }) {
//   const { toast, show } = useToast();
//   const [form, setForm] = useState({ name: "", phone: "" });
//   const [saving, setSaving] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   const addRider = async () => {
//     if (!form.name.trim() || !form.phone.trim()) return show("Name and phone required", "error");
//     setSaving(true);
//     try {
//       await axios.post(`${API}/riders`, form, { headers: authHeaders() });
//       setForm({ name: "", phone: "" });
//       loadRiders();
//       show("Rider added!");
//     } catch { show("Failed to add rider", "error"); }
//     setSaving(false);
//   };

//   const toggleStatus = async (rider) => {
//     const newStatus = rider.status === "on" ? "off" : "on";
//     try {
//       await axios.put(`${API}/riders/${rider._id}/status`, { status: newStatus }, { headers: authHeaders() });
//       loadRiders();
//       show(`${rider.name} → ${newStatus === "on" ? "On Duty" : "Off Duty"}`);
//     } catch { show("Failed to update", "error"); }
//   };

//   const deleteRider = async (id) => {
//     try {
//       await axios.delete(`${API}/riders/${id}`, { headers: authHeaders() });
//       loadRiders();
//       show("Rider removed");
//       setDeleteId(null);
//     } catch { show("Failed to delete", "error"); }
//   };

//   const activeOrdersFor = (riderId) =>
//     orders.filter((o) => o.rider?._id === riderId && !["completed", "delivered"].includes(o.status)).length;

//   const onCount  = riders.filter((r) => r.status === "on").length;
//   const offCount = riders.filter((r) => r.status !== "on").length;

//   return (
//     <div>
//       <Toast toast={toast} />

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-3 mb-6">
//         <div className="bg-white border border-gray-200 rounded-2xl p-4">
//           <p className="text-xs text-gray-500 mb-1">Total Riders</p>
//           <p className="text-2xl font-bold text-gray-900">{riders.length}</p>
//         </div>
//         <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
//           <p className="text-xs text-green-700 mb-1">On Duty</p>
//           <p className="text-2xl font-bold text-green-700">{onCount}</p>
//         </div>
//         <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
//           <p className="text-xs text-red-600 mb-1">Off Duty</p>
//           <p className="text-2xl font-bold text-red-600">{offCount}</p>
//         </div>
//       </div>

//       {/* Add form */}
//       <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
//         <h2 className="font-semibold text-gray-900 mb-4 text-sm">Add New Rider</h2>
//         <div className="flex gap-3 flex-wrap">
//           <input type="text" placeholder="Rider name" value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             onKeyDown={(e) => e.key === "Enter" && addRider()}
//             className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-[150px] focus:outline-none focus:border-gray-400" />
//           <input type="text" placeholder="Phone number" value={form.phone}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             onKeyDown={(e) => e.key === "Enter" && addRider()}
//             className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-[150px] focus:outline-none focus:border-gray-400" />
//           <button onClick={addRider} disabled={saving}
//             className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
//             {saving ? "Adding…" : "+ Add Rider"}
//           </button>
//         </div>
//       </div>

//       {/* Riders grid */}
//       {riders.length === 0 ? <Empty icon="🏍️" msg="No riders added yet" /> : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {riders.map((rider) => {
//             const isOn = rider.status === "on";
//             const active = activeOrdersFor(rider._id);
//             return (
//               <div key={rider._id}
//                 className={`rounded-2xl border-2 p-5 transition-all
//                   ${isOn ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>

//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold
//                       ${isOn ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
//                       {rider.name?.[0]?.toUpperCase()}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">{rider.name}</p>
//                       <p className="text-xs text-gray-500">{rider.phone}</p>
//                     </div>
//                   </div>

//                   {/* Duty toggle */}
//                   <div className="flex flex-col items-center gap-1">
//                     <Toggle
//                       on={isOn}
//                       onChange={() => toggleStatus(rider)}
//                       colorOn="bg-green-500"
//                       colorOff="bg-red-400"
//                     />
//                     <span className={`text-xs font-semibold ${isOn ? "text-green-700" : "text-red-600"}`}>
//                       {isOn ? "On Duty" : "Off Duty"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex gap-2 flex-wrap">
//                     <span className={`text-xs px-2.5 py-1 rounded-full font-medium
//                       ${isOn ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
//                       {isOn ? "🟢 Available" : "🔴 Offline"}
//                     </span>
//                     {active > 0 && (
//                       <span className="text-xs px-2.5 py-1 rounded-full bg-black text-white font-medium">
//                         {active} active {active === 1 ? "order" : "orders"}
//                       </span>
//                     )}
//                   </div>

//                   {deleteId === rider._id ? (
//                     <div className="flex gap-2 items-center">
//                       <button onClick={() => deleteRider(rider._id)} className="text-xs text-red-600 font-semibold">Confirm</button>
//                       <button onClick={() => setDeleteId(null)} className="text-xs text-gray-500">Cancel</button>
//                     </div>
//                   ) : (
//                     <button onClick={() => setDeleteId(rider._id)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════
// //  PRODUCTS TAB
// // ═══════════════════════════════════════════════════════════
// const EMPTY_PRODUCT = {
//   name: "", model: "", storage: "", condition: "New",
//   price: "", batteryHealth: "", images: [],
//   description: "", imei: "", originalParts: true,
//   partsChanged: "", warrantyNote: "", inStock: true,
// };

// function ProductsTab() {
//   const { toast, show } = useToast();
//   const [products, setProducts]     = useState([]);
//   const [fetching, setFetching]     = useState(true);
//   const [showForm, setShowForm]     = useState(false);
//   const [editId, setEditId]         = useState(null);
//   const [form, setForm]             = useState(EMPTY_PRODUCT);
//   const [saving, setSaving]         = useState(false);
//   const [deleteId, setDeleteId]     = useState(null);
//   const [search, setSearch]         = useState("");
//   const [filterCond, setFilterCond] = useState("all");
//   const [filterStock, setFilterStock] = useState("all");

//   const loadProducts = async () => {
//     setFetching(true);
//     try {
//       const res = await axios.get(`${API}/products`, { headers: authHeaders() });
//       // backend returns plain array
//       const list = Array.isArray(res.data) ? res.data
//         : Array.isArray(res.data?.data) ? res.data.data : [];
//       setProducts(list);
//     } catch { show("Failed to load products", "error"); }
//     setFetching(false);
//   };

//   useEffect(() => { loadProducts(); }, []);

//   const openAdd  = () => { setForm(EMPTY_PRODUCT); setEditId(null); setShowForm(true); };
//   const openEdit = (p) => { setForm({ ...EMPTY_PRODUCT, ...p }); setEditId(p._id); setShowForm(true); };
//   const f = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

//   const submitProduct = async () => {
//     if (!form.name.trim() || !form.price) return show("Name and price required", "error");
//     setSaving(true);
//     try {
//       if (editId) {
//         await axios.put(`${API}/products/${editId}`, form, { headers: authHeaders() });
//         show("Product updated!");
//       } else {
//         await axios.post(`${API}/products`, form, { headers: authHeaders() });
//         show("Product added!");
//       }
//       setShowForm(false);
//       loadProducts();
//     } catch { show("Failed to save product", "error"); }
//     setSaving(false);
//   };

//   const toggleStock = async (product) => {
//     try {
//       await axios.put(`${API}/products/${product._id}`, { inStock: !product.inStock }, { headers: authHeaders() });
//       loadProducts();
//       show(product.inStock ? "Marked as sold out" : "Back in stock");
//     } catch { show("Failed to update", "error"); }
//   };

//   const deleteProduct = async (id) => {
//     try {
//       await axios.delete(`${API}/products/${id}`, { headers: authHeaders() });
//       loadProducts();
//       show("Product deleted");
//       setDeleteId(null);
//     } catch { show("Failed to delete", "error"); }
//   };

//   const visible = products.filter((p) => {
//     const q = search.toLowerCase();
//     const matchSearch = (p.name || "").toLowerCase().includes(q) || (p.model || "").toLowerCase().includes(q);
//     const matchCond   = filterCond === "all" || p.condition === filterCond;
//     const matchStock  = filterStock === "all"
//       || (filterStock === "inStock" && p.inStock)
//       || (filterStock === "soldOut" && !p.inStock);
//     return matchSearch && matchCond && matchStock;
//   });

//   return (
//     <div>
//       <Toast toast={toast} />

//       {/* ── Product form modal ── */}
//       {showForm && (
//         <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-4"
//           style={{ background: "rgba(0,0,0,0.5)" }}>
//           <div className="bg-white rounded-2xl w-full max-w-2xl my-6 p-6 shadow-2xl">

//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-base font-bold text-gray-900">
//                 {editId ? "Edit Product" : "Add New Product"}
//               </h2>
//               <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//               <div className="md:col-span-2">
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
//                 <input value={form.name} onChange={(e) => f("name", e.target.value)}
//                   placeholder="e.g. iPhone 13 Pro Max"
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
//                 <select value={form.model} onChange={(e) => f("model", e.target.value)}
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400">
//                   <option value="">Select model</option>
//                   {["iPhone 11","iPhone 12","iPhone 12 Pro","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max",
//                     "iPhone 14","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Pro","iPhone 15 Pro Max",
//                     "iPhone 16","iPhone 16 Pro","iPhone 16 Pro Max"].map((m) => (
//                     <option key={m} value={m}>{m}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Storage</label>
//                 <select value={form.storage} onChange={(e) => f("storage", e.target.value)}
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400">
//                   <option value="">Select storage</option>
//                   {["64GB","128GB","256GB","512GB","1TB"].map((s) => (
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Condition</label>
//                 <select value={form.condition} onChange={(e) => f("condition", e.target.value)}
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400">
//                   <option>New</option>
//                   <option>Used</option>
//                   <option>PTA Approved</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Price (Rs) *</label>
//                 <input type="number" value={form.price} onChange={(e) => f("price", e.target.value)}
//                   placeholder="e.g. 185000"
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Battery Health (%)</label>
//                 <input type="number" min="0" max="100" value={form.batteryHealth} onChange={(e) => f("batteryHealth", e.target.value)}
//                   placeholder="e.g. 89"
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">IMEI</label>
//                 <input value={form.imei} onChange={(e) => f("imei", e.target.value)}
//                   placeholder="15-digit IMEI"
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-xs font-medium text-gray-600 mb-1">
//                   Image URLs <span className="text-gray-400 font-normal">(comma separated)</span>
//                 </label>
//                 <input
//                   value={Array.isArray(form.images) ? form.images.join(", ") : ""}
//                   onChange={(e) => f("images", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
//                   placeholder="https://res.cloudinary.com/..."
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Description / Condition Notes</label>
//                 <textarea value={form.description} onChange={(e) => f("description", e.target.value)}
//                   rows={3} placeholder="e.g. Minor scratches on back, screen in perfect condition..."
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 resize-none" />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Parts Changed</label>
//                 <input value={form.partsChanged} onChange={(e) => f("partsChanged", e.target.value)}
//                   placeholder="e.g. Battery, Screen"
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Warranty Note</label>
//                 <input value={form.warrantyNote} onChange={(e) => f("warrantyNote", e.target.value)}
//                   placeholder="e.g. 10-day check warranty"
//                   className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
//               </div>

//               <div className="md:col-span-2 flex gap-6 pt-1">
//                 <label className="flex items-center gap-2.5 cursor-pointer">
//                   <Toggle on={form.inStock} onChange={() => f("inStock", !form.inStock)} />
//                   <span className="text-sm text-gray-700">In Stock</span>
//                 </label>
//                 <label className="flex items-center gap-2.5 cursor-pointer">
//                   <Toggle on={form.originalParts} onChange={() => f("originalParts", !form.originalParts)} />
//                   <span className="text-sm text-gray-700">All Original Parts</span>
//                 </label>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button onClick={submitProduct} disabled={saving}
//                 className="flex-1 bg-black text-white py-2.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
//                 {saving ? "Saving…" : editId ? "Save Changes" : "Add Product"}
//               </button>
//               <button onClick={() => setShowForm(false)}
//                 className="px-5 border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50 transition-colors">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toolbar */}
//       <div className="flex flex-wrap gap-3 mb-5 items-center">
//         <input type="text" placeholder="Search products…" value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-[180px] focus:outline-none focus:border-gray-400" />
//         <select value={filterCond} onChange={(e) => setFilterCond(e.target.value)}
//           className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
//           <option value="all">All Conditions</option>
//           <option>New</option><option>Used</option><option>PTA Approved</option>
//         </select>
//         <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}
//           className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
//           <option value="all">All Stock</option>
//           <option value="inStock">In Stock</option>
//           <option value="soldOut">Sold Out</option>
//         </select>
//         <button onClick={openAdd}
//           className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
//           + Add Product
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-3 mb-5">
//         <div className="bg-white border border-gray-200 rounded-2xl p-4">
//           <p className="text-xs text-gray-500 mb-1">Total</p>
//           <p className="text-2xl font-bold text-gray-900">{products.length}</p>
//         </div>
//         <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
//           <p className="text-xs text-green-700 mb-1">In Stock</p>
//           <p className="text-2xl font-bold text-green-700">{products.filter((p) => p.inStock).length}</p>
//         </div>
//         <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
//           <p className="text-xs text-red-600 mb-1">Sold Out</p>
//           <p className="text-2xl font-bold text-red-600">{products.filter((p) => !p.inStock).length}</p>
//         </div>
//       </div>

//       {/* Grid */}
//       {fetching ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {[1,2,3,4,5,6].map((i) => (
//             <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
//               <div className="w-full h-36 bg-gray-100 rounded-xl mb-3" />
//               <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
//               <div className="h-3 bg-gray-100 rounded w-1/2" />
//             </div>
//           ))}
//         </div>
//       ) : visible.length === 0 ? (
//         <Empty icon="📱" msg={products.length === 0 ? "No products yet — add your first one!" : "No products match your filters"} />
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {visible.map((product) => (
//             <div key={product._id}
//               className={`bg-white rounded-2xl border p-4 transition-all
//                 ${!product.inStock ? "opacity-60 border-gray-100" : "border-gray-200 hover:border-gray-300"}`}>

//               {product.images?.[0] ? (
//                 <img src={product.images[0]} alt={product.name}
//                   className="w-full h-36 object-cover rounded-xl mb-3 bg-gray-100" />
//               ) : (
//                 <div className="w-full h-36 rounded-xl mb-3 bg-gray-100 flex items-center justify-center text-4xl">📱</div>
//               )}

//               <div className="flex items-start justify-between gap-2 mb-2">
//                 <h3 className="font-semibold text-gray-900 text-sm leading-snug">{product.name}</h3>
//                 <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap
//                   ${CONDITION_COLORS[product.condition] || "bg-gray-100 text-gray-600"}`}>
//                   {product.condition}
//                 </span>
//               </div>

//               <div className="flex gap-1.5 flex-wrap mb-2">
//                 {product.storage && (
//                   <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{product.storage}</span>
//                 )}
//                 {product.batteryHealth && (
//                   <span className={`text-xs px-2 py-0.5 rounded-full
//                     ${product.batteryHealth >= 85 ? "bg-green-100 text-green-700"
//                       : product.batteryHealth >= 70 ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-700"}`}>
//                     🔋 {product.batteryHealth}%
//                   </span>
//                 )}
//                 {!product.inStock && (
//                   <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Sold Out</span>
//                 )}
//                 {product.partsChanged && (
//                   <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Parts replaced</span>
//                 )}
//               </div>

//               <p className="font-bold text-gray-900 mb-1">Rs {Number(product.price).toLocaleString()}</p>

//               {product.description && (
//                 <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
//               )}

//               <div className="flex gap-2 pt-3 border-t border-gray-100">
//                 <button onClick={() => openEdit(product)}
//                   className="flex-1 border border-gray-200 text-gray-700 text-xs py-2 rounded-xl hover:bg-gray-50 transition-colors">
//                   ✏️ Edit
//                 </button>
//                 <button onClick={() => toggleStock(product)}
//                   className={`flex-1 text-xs py-2 rounded-xl border transition-colors
//                     ${product.inStock
//                       ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
//                       : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"}`}>
//                   {product.inStock ? "Sold Out" : "Back in Stock"}
//                 </button>
//                 {deleteId === product._id ? (
//                   <div className="flex gap-1 items-center px-1">
//                     <button onClick={() => deleteProduct(product._id)} className="text-xs text-red-600 font-semibold">Yes</button>
//                     <span className="text-gray-300 text-xs">|</span>
//                     <button onClick={() => setDeleteId(null)} className="text-xs text-gray-500">No</button>
//                   </div>
//                 ) : (
//                   <button onClick={() => setDeleteId(product._id)}
//                     className="border border-gray-200 text-gray-400 text-xs py-2 px-3 rounded-xl hover:text-red-500 hover:border-red-200 transition-colors">
//                     🗑️
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════
// //  ROOT — ADMIN PANEL
// // ═══════════════════════════════════════════════════════════
// export default function AdminPanel() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [tab, setTab]         = useState("orders");
//   const [orders, setOrders]   = useState([]);
//   const [riders, setRiders]   = useState([]);
//   const [badge, setBadge]     = useState(0);

//   const loadOrders = async () => {
//     try {
//       const res = await axios.get(`${API}/orders`, { headers: authHeaders() });
//       const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
//       setOrders(list);
//     } catch { /* silent */ }
//   };

//   const loadRiders = async () => {
//     try {
//       const res = await axios.get(`${API}/riders`, { headers: authHeaders() });
//       const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
//       setRiders(list);
//     } catch { /* silent */ }
//   };

//   useEffect(() => {
//     if (!token) return navigate("/login");
//     loadOrders();
//     loadRiders();

//     socket.on("order_updated", () => {
//       loadOrders();
//       setBadge((c) => c + 1);
//     });
//     return () => socket.off("order_updated");
//   }, []);

//   const logout = () => { localStorage.clear(); navigate("/login"); };

//   const pendingCount = orders.filter((o) => o.status === "pending").length;

//   const TABS = [
//     { id: "orders",   label: "Orders",   icon: "📦", badge: pendingCount },
//     { id: "riders",   label: "Riders",   icon: "🏍️", badge: 0 },
//     { id: "products", label: "Products", icon: "📱", badge: 0 },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ── Black top bar ── */}
//       <div className="bg-black sticky top-0 z-30">
//         <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="text-white"><AppleLogo /></div>
//             <span className="font-bold text-white tracking-tight">iStore Admin</span>
//             <div className="flex items-center gap-1.5 ml-3">
//               {/* <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
//               <span className="text-xs text-gray-500">Live</span> */}

//  <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
//              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
//               Live
//              </div>

              
//             </div>
            
//           </div>
          
//           <button onClick={logout}
//             className="text-xs text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
//             Logout
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="max-w-6xl mx-auto px-4 flex">
//           {TABS.map(({ id, label, icon, badge: b }) => (
//             <button key={id}
//               onClick={() => { setTab(id); if (id === "orders") setBadge(0); }}
//               className={`relative px-5 py-3 text-sm font-medium transition-all border-b-2
//                 ${tab === id ? "border-white text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
//               <span className="mr-1">{icon}</span>{label}
//               {b > 0 && (
//                 <span className="absolute -top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
//                   {b}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Content ── */}
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         {tab === "orders"   && <OrdersTab   orders={orders}  riders={riders} loadOrders={loadOrders} />}
//         {tab === "riders"   && <RidersTab   riders={riders}  loadRiders={loadRiders} orders={orders} />}
//         {tab === "products" && <ProductsTab />}
//       </div>
//     </div>
//   );
// }
