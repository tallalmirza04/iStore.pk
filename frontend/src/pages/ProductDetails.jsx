// import { useParams } from "react-router-dom";
// import products from "../data/products";

// function ProductDetails() {
//   const { id } = useParams();

//   const product = products.find((p) => p.id === Number(id));

//   if (!product) {
//     return <div className="p-6">Product not found</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">

//       <h1 className="text-3xl font-bold">{product.name}</h1>

//       <div className="mt-4 h-64 bg-gray-200 rounded-xl"></div>

//       <p className="mt-4 text-gray-600">
//         {product.storage} • {product.battery}% Battery
//       </p>

//       <p className="mt-2">
//         Condition: {product.condition}
//       </p>

//       <p className="mt-4 text-2xl font-bold">
//         Rs. {product.price.toLocaleString()}
//       </p>

//     </div>
//   );
// }

// export default ProductDetails;






import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";

const API = "http://localhost:5001/api";

const CONDITION_STYLE = {
  "New":          { bg: "#e8f5e9", color: "#2e7d32" },
  "PTA Approved": { bg: "#e3f2fd", color: "#1565c0" },
  "Used":         { bg: "#fff3e0", color: "#e65100" },
  "Non PTA":      { bg: "#fce4ec", color: "#c62828" },
  "JV":           { bg: "#f3e5f5", color: "#6a1b9a" },
  "MDM":          { bg: "#e8eaf6", color: "#283593" },
  "BYPASS":       { bg: "#f5f5f5", color: "#424242" },
};

export default function ProductDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded]     = useState(false);

  useEffect(() => {
    if (!id || id === "undefined") { setError("Invalid product"); setLoading(false); return; }
    (async () => {
      try {
        const res  = await fetch(`${API}/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Product not found");
        setProduct(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "#8e8e93", fontSize: 14 }}>Loading product…</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>📱</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1c1c1e", marginBottom: 8 }}>Product not found</h2>
      <button onClick={() => navigate("/")} style={{ padding: "10px 24px", background: "#000", color: "#fff", border: "none", borderRadius: 100, fontSize: 14, cursor: "pointer" }}>
        Back to Store
      </button>
    </div>
  );

  const images   = product.images?.length ? product.images : product.image ? [product.image] : [];
  const battery  = product.batteryHealth || product.battery;
  const condStyle = CONDITION_STYLE[product.condition] || { bg: "#f5f5f5", color: "#555" };

  const batteryColor = !battery ? "#8e8e93"
    : battery >= 85 ? "#2e7d32"
    : battery >= 70 ? "#e65100"
    : "#c62828";

  const handleAddToCart = () => {
    addToCart({ ...product, _id: product._id || product.id });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const specs = [
    product.model        && { label: "Model",           value: product.model },
    product.storage      && { label: "Storage",         value: product.storage },
    product.condition    && { label: "Condition",       value: product.condition },
    battery              && { label: "Battery Health",  value: `${battery}%` },
    product.imei         && { label: "IMEI",            value: product.imei },
    product.originalParts !== undefined && {
      label: "Parts",
      value: product.originalParts ? "All Original" : `Replaced: ${product.partsChanged || "Some parts"}`,
    },
    product.warrantyNote && { label: "Warranty",        value: product.warrantyNote },
  ].filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: "#f2f2f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 14, color: "#8e8e93", marginBottom: 24, padding: 0,
          fontFamily: "inherit",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

          {/* ── LEFT — Image gallery ── */}
          <div>
            {/* Main image */}
            <div style={{
              background: "#fff", borderRadius: 20, overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.06)", marginBottom: 12,
              aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {images.length > 0 ? (
                <img src={images[imgIndex]} alt={product.name} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transition: "opacity 0.2s",
                }} />
              ) : (
                <span style={{ fontSize: 80, opacity: 0.2 }}>📱</span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIndex(i)} style={{
                    width: 64, height: 64, borderRadius: 10, overflow: "hidden",
                    border: imgIndex === i ? "2px solid #000" : "2px solid transparent",
                    padding: 0, cursor: "pointer", background: "#fff",
                    transition: "border-color 0.15s",
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT — Info ── */}
          <div>

            {/* Condition badge */}
            <div style={{ marginBottom: 12 }}>
              <span style={{
                background: condStyle.bg, color: condStyle.color,
                fontSize: 12, fontWeight: 700, padding: "5px 14px",
                borderRadius: 100, letterSpacing: "0.02em",
              }}>
                {product.condition}
              </span>
              {!product.inStock && (
                <span style={{
                  marginLeft: 8, background: "#000", color: "#fff",
                  fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100,
                }}>
                  Sold Out
                </span>
              )}
            </div>

            {/* Name */}
            <h1 style={{
              fontSize: 28, fontWeight: 800, color: "#1c1c1e",
              margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1,
            }}>
              {product.name}
            </h1>

            {/* Quick tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {product.storage && (
                <span style={{ background: "#f5f5f7", color: "#555", fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 100 }}>
                  {product.storage}
                </span>
              )}
              {battery && (
                <span style={{ background: `${batteryColor}18`, color: batteryColor, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>
                  🔋 {battery}%
                </span>
              )}
              {product.partsChanged && (
                <span style={{ background: "#fff3e0", color: "#e65100", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>
                  ⚠️ Parts replaced
                </span>
              )}
            </div>

            {/* Price */}
            <p style={{ fontSize: 32, fontWeight: 800, color: "#1c1c1e", margin: "0 0 20px", letterSpacing: "-0.02em" }}>
              Rs {Number(product.price).toLocaleString()}
            </p>

            {/* Description */}
            {product.description && (
              <p style={{ fontSize: 14, color: "#8e8e93", lineHeight: 1.6, margin: "0 0 24px" }}>
                {product.description}
              </p>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{
                width: "100%", padding: "16px",
                background: added ? "#2e7d32" : product.inStock ? "#000" : "#e0e0e0",
                color: product.inStock ? "#fff" : "#aaa",
                border: "none", borderRadius: 14,
                fontSize: 16, fontWeight: 700,
                cursor: product.inStock ? "pointer" : "not-allowed",
                fontFamily: "inherit", letterSpacing: "-0.01em",
                transition: "all 0.2s", marginBottom: 12,
              }}
            >
              {added ? "✓ Added to Cart" : product.inStock ? "Add to Cart" : "Sold Out"}
            </button>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              {[
                "🚚 Free Cash on Delivery",
                "🛡️ Inspect Before Paying",
                "✅ IMEI Verified",
              ].map((b) => (
                <span key={b} style={{
                  background: "#f5f5f7", color: "#555",
                  fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 100,
                }}>
                  {b}
                </span>
              ))}
            </div>

            {/* Specs table */}
            {specs.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#8e8e93", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, padding: "14px 16px 0" }}>
                  Specifications
                </p>
                {specs.map((spec, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px",
                    borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)",
                  }}>
                    <span style={{ fontSize: 13, color: "#8e8e93" }}>{spec.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1c1c1e", textAlign: "right", maxWidth: "60%" }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Mobile layout fix */}
        <style>{`
          @media (max-width: 680px) {
            div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}