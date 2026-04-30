import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5001/api";

const STATUS_COLORS = {
  pending:          { bg: "#f2f2f7", color: "#8e8e93" },
  confirmed:        { bg: "#e8f5e9", color: "#2e7d32" },
  rider_assigned:   { bg: "#e3f2fd", color: "#1565c0" },
  out_for_delivery: { bg: "#fff8e1", color: "#e65100" },
  delivered:        { bg: "#f3e5f5", color: "#6a1b9a" },
  completed:        { bg: "#000",    color: "#fff"     },
  cancelled:        { bg: "#ffebee", color: "#c62828" },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    (async () => {
      try {
        const res  = await fetch(`${API}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrders(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 32, height: 32, border: "2px solid #000",
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "#8e8e93", fontSize: 14 }}>Loading your orders…</p>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#f2f2f7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1c1c1e", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
            Order History
          </h1>
          <p style={{ fontSize: 14, color: "#8e8e93", margin: 0 }}>
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>

        {error && (
          <div style={{ background: "#fff2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16, marginBottom: 20, color: "#dc2626", fontSize: 14 }}>
            {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#1c1c1e", marginBottom: 8 }}>No orders yet</p>
            <p style={{ fontSize: 14, color: "#8e8e93", marginBottom: 24 }}>Your orders will appear here after you shop</p>
            <button onClick={() => navigate("/")} style={{
              padding: "10px 28px", background: "#000", color: "#fff",
              border: "none", borderRadius: 100, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
            }}>
              Browse iPhones
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((order) => {
              const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const items = order.orderItems || [];
              const total = Number(order.totalPrice || 0);
              return (
                <div key={order._id} style={{
                  background: "#fff", borderRadius: 18,
                  padding: 20, border: "1px solid rgba(0,0,0,0.06)",
                  cursor: "pointer", transition: "box-shadow 0.2s",
                }}
                  onClick={() => navigate(`/success/${order._id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>

                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                    <div>
                      <p style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: "#1c1c1e", margin: "0 0 4px" }}>
                        {order.orderId || order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p style={{ fontSize: 12, color: "#8e8e93", margin: 0 }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" }) : "—"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <span style={{
                        background: st.bg, color: st.color,
                        fontSize: 11, fontWeight: 600, padding: "4px 10px",
                        borderRadius: 100, textTransform: "capitalize", whiteSpace: "nowrap",
                      }}>
                        {order.status?.replace(/_/g, " ")}
                      </span>
                      <span style={{
                        background: order.type === "pickup" ? "#e3f2fd" : "#f2f2f7",
                        color: order.type === "pickup" ? "#1565c0" : "#555",
                        fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 100,
                      }}>
                        {order.type === "pickup" ? "🏪 Pickup" : "🚚 Delivery"}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ marginBottom: 12 }}>
                    {items.map((item, i) => (
                      <p key={i} style={{ fontSize: 13, color: "#3a3a3c", margin: "0 0 2px" }}>
                        • {item.name} <span style={{ color: "#8e8e93" }}>× {item.qty}</span>
                      </p>
                    ))}
                  </div>

                  {/* Bottom row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1c1c1e", margin: 0 }}>
                      Rs {total.toLocaleString()}
                    </p>
                    <span style={{ fontSize: 12, color: "#8e8e93" }}>
                      View details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}