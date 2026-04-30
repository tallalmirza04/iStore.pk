// import { useState, useEffect } from "react";
// import ProductCard from "../components/ProductCard";

// const API = "http://localhost:5001/api";
// const CATEGORIES = ["All", "PTA Approved", "Non PTA", "JV", "MDM", "BYPASS"];

// const categoryMatch = (product, category) => {
//   if (category === "All") return true;
//   const name      = (product.name      || "").toLowerCase();
//   const condition = (product.condition || "").toLowerCase();
//   const cat       = category.toLowerCase();
//   return name.includes(cat) || condition.includes(cat);
// };

// // ── Apple SVG logo ──────────────────────────────────────────
// const AppleSVG = () => (
//   <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 28, height: 28, display: "block" }}>
//     <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
//   </svg>
// );

// // ── Search icon ─────────────────────────────────────────────
// const SearchIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
//     style={{ width: 18, height: 18 }}>
//     <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//   </svg>
// );

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [search, setSearch]     = useState("");
//   const [category, setCategory] = useState("All");
//   const [sort, setSort]         = useState("newest");
//   const [focused, setFocused]   = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch(`${API}/products`);
//         const data = await res.json();
//         setProducts(Array.isArray(data) ? data : (data?.data || []));
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   let filtered = products.filter((p) => {
//     const matchSearch = (p?.name || "").toLowerCase().includes(search.toLowerCase());
//     const matchCat    = categoryMatch(p, category);
//     return matchSearch && matchCat && p.inStock !== false;
//   });

//   if (sort === "low")    filtered.sort((a, b) => (a.price||0) - (b.price||0));
//   if (sort === "high")   filtered.sort((a, b) => (b.price||0) - (a.price||0));
//   if (sort === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   return (
//     <div style={{ minHeight: "100vh", background: "#f2f2f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>

//       {/* ════════════════════════════════════════════════════
//           HERO
//       ════════════════════════════════════════════════════ */}
//       <div style={{
//         position: "relative", overflow: "hidden",
//         background: "#000",
//         paddingBottom: "80px",
//       }}>

//         {/* Animated mesh background */}
//         <div style={{
//           position: "absolute", inset: 0, zIndex: 0,
//           background: `
//             radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,99,255,0.15) 0%, transparent 60%),
//             radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 55%),
//             radial-gradient(ellipse 70% 70% at 50% 100%, rgba(0,122,255,0.1) 0%, transparent 65%)
//           `,
//         }} />

//         {/* Fine dot grid */}
//         <div style={{
//           position: "absolute", inset: 0, zIndex: 0,
//           backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
//           backgroundSize: "28px 28px",
//         }} />

//         {/* Top nav strip */}
//         <div style={{
//           position: "relative", zIndex: 2,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           padding: "20px 32px",
//           borderBottom: "1px solid rgba(255,255,255,0.06)",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.9)" }}>
//             <AppleSVG />
//             <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>iStore.pk</span>
//           </div>
//         </div>

//         {/* Hero content */}
//         <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "64px 24px 0" }}>

//           {/* Pill badge */}
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 8,
//             background: "rgba(255,255,255,0.07)",
//             border: "1px solid rgba(255,255,255,0.13)",
//             borderRadius: 100, padding: "8px 20px",
//             marginBottom: 32,
//             backdropFilter: "blur(12px)",
//           }}>
//             <span style={{
//               width: 7, height: 7, borderRadius: "50%",
//               background: "#34c759", display: "inline-block",
//               boxShadow: "0 0 8px #34c759",
//             }} />
//             <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 500, letterSpacing: "0.03em" }}>
//               Rawalpindi &amp; Islamabad · Free Delivery
//             </span>
//           </div>

//           {/* Main heading */}
//           <h1 style={{
//             fontSize: "clamp(48px, 9vw, 88px)",
//             fontWeight: 800,
//             letterSpacing: "-0.04em",
//             lineHeight: 0.95,
//             margin: "0 0 8px",
//             color: "#fff",
//           }}>
//             Pakistan's
//           </h1>
//           <h1 style={{
//             fontSize: "clamp(48px, 9vw, 88px)",
//             fontWeight: 800,
//             letterSpacing: "-0.04em",
//             lineHeight: 0.95,
//             margin: "0 0 28px",
//             background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.45) 100%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}>
//             iPhone Store
//           </h1>

//           {/* Subheadline */}
//           <p style={{
//             fontSize: "clamp(16px, 2.2vw, 20px)",
//             color: "rgba(255,255,255,0.45)",
//             fontWeight: 400,
//             letterSpacing: "-0.01em",
//             maxWidth: 440,
//             margin: "0 auto 48px",
//             lineHeight: 1.55,
//           }}>
//             Verified iPhones with battery health, IMEI check &amp; 10-day warranty.
//             <br />Cash on delivery. No advance.
//           </p>

//           {/* Search bar */}
//           <div style={{
//             maxWidth: 520, margin: "0 auto 48px",
//             position: "relative",
//           }}>
//             <div style={{
//               position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)",
//               color: focused ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
//               pointerEvents: "none", transition: "color 0.2s",
//               display: "flex", alignItems: "center",
//             }}>
//               <SearchIcon />
//             </div>
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onFocus={() => setFocused(true)}
//               onBlur={() => setFocused(false)}
//               placeholder="Search iPhone 13, 14 Pro, 15 Pro Max..."
//               style={{
//                 width: "100%", boxSizing: "border-box",
//                 background: focused ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.07)",
//                 border: focused ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
//                 borderRadius: 16,
//                 padding: "16px 20px 16px 50px",
//                 color: "#fff", fontSize: 15,
//                 outline: "none",
//                 backdropFilter: "blur(16px)",
//                 transition: "all 0.2s",
//                 fontFamily: "inherit",
//               }}
//             />
//             {search && (
//               <button onClick={() => setSearch("")} style={{
//                 position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
//                 background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
//                 borderRadius: "50%", width: 22, height: 22, cursor: "pointer",
//                 fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
//                 fontFamily: "inherit",
//               }}>✕</button>
//             )}
//           </div>

//           {/* Trust badges row */}
//           <div style={{
//             display: "flex", flexWrap: "wrap", gap: 10,
//             justifyContent: "center", maxWidth: 560, margin: "0 auto",
//           }}>
//             {[
//               "🛡️ 10-Day Warranty",
//               "🚚 Cash on Delivery",
//               "✅ IMEI Verified",
//               "🔋 Battery Health Listed",
//             ].map((badge) => (
//               <span key={badge} style={{
//                 background: "rgba(255,255,255,0.07)",
//                 border: "1px solid rgba(255,255,255,0.1)",
//                 borderRadius: 100, padding: "6px 14px",
//                 color: "rgba(255,255,255,0.55)",
//                 fontSize: 12, fontWeight: 500,
//                 backdropFilter: "blur(8px)",
//               }}>
//                 {badge}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Bottom fade into page bg */}
//         <div style={{
//           position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
//           background: "linear-gradient(to bottom, transparent, #f2f2f7)",
//           zIndex: 1,
//         }} />
//       </div>

//       {/* ════════════════════════════════════════════════════
//           STICKY FILTER BAR
//       ════════════════════════════════════════════════════ */}
//       <div style={{
//         background: "rgba(242,242,247,0.85)",
//         backdropFilter: "blur(20px)",
//         WebkitBackdropFilter: "blur(20px)",
//         borderBottom: "1px solid rgba(0,0,0,0.07)",
//         position: "sticky", top: 0, zIndex: 30,
//       }}>
//         <div style={{
//           maxWidth: 1200, margin: "0 auto",
//           padding: "10px 24px",
//           display: "flex", alignItems: "center",
//           justifyContent: "space-between", gap: 12, flexWrap: "wrap",
//         }}>
//           <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//             {CATEGORIES.map((c) => {
//               const active = category === c;
//               return (
//                 <button key={c} onClick={() => setCategory(c)} style={{
//                   padding: "7px 16px", borderRadius: 100, fontSize: 13,
//                   fontWeight: active ? 600 : 400, cursor: "pointer",
//                   border: active ? "none" : "1px solid rgba(0,0,0,0.1)",
//                   background: active ? "#000" : "transparent",
//                   color: active ? "#fff" : "#333",
//                   transition: "all 0.15s", whiteSpace: "nowrap",
//                   fontFamily: "inherit",
//                 }}>
//                   {c}
//                 </button>
//               );
//             })}
//           </div>
//           <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
//             border: "1px solid rgba(0,0,0,0.1)", borderRadius: 100,
//             padding: "7px 16px", fontSize: 13, background: "transparent",
//             color: "#333", cursor: "pointer", outline: "none",
//             fontFamily: "inherit", flexShrink: 0,
//           }}>
//             <option value="newest">Newest First</option>
//             <option value="low">Price: Low → High</option>
//             <option value="high">Price: High → Low</option>
//           </select>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════
//           PRODUCT COUNT
//       ════════════════════════════════════════════════════ */}
//       {!loading && (
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 0" }}>
//           <p style={{ fontSize: 13, color: "#8e8e93", fontWeight: 400 }}>
//             {filtered.length} {filtered.length === 1 ? "phone" : "phones"}
//             {category !== "All" && ` · ${category}`}
//             {search && ` · "${search}"`}
//           </p>
//         </div>
//       )}

//       {/* ════════════════════════════════════════════════════
//           PRODUCTS
//       ════════════════════════════════════════════════════ */}
//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 60px" }}>
//         {loading ? (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
//             {[...Array(8)].map((_, i) => (
//               <div key={i} style={{
//                 background: "#fff", borderRadius: 18, padding: 16,
//                 opacity: 1 - i * 0.08,
//               }}>
//                 <div style={{ width: "100%", height: 200, background: "#f0f0f0", borderRadius: 12, marginBottom: 12,
//                   animation: "shimmer 1.4s ease-in-out infinite",
//                 }} />
//                 <div style={{ height: 14, background: "#f0f0f0", borderRadius: 8, marginBottom: 8, width: "70%",
//                   animation: "shimmer 1.4s ease-in-out infinite",
//                 }} />
//                 <div style={{ height: 11, background: "#f0f0f0", borderRadius: 8, width: "45%",
//                   animation: "shimmer 1.4s ease-in-out infinite",
//                 }} />
//                 <style>{`@keyframes shimmer{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
//               </div>
//             ))}
//           </div>
//         ) : filtered.length > 0 ? (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
//             {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
//           </div>
//         ) : (
//           <div style={{ textAlign: "center", padding: "80px 24px" }}>
//             <div style={{ fontSize: 52, marginBottom: 16 }}>📭</div>
//             <p style={{ fontSize: 20, fontWeight: 700, color: "#1c1c1e", marginBottom: 8 }}>No phones found</p>
//             <p style={{ fontSize: 15, color: "#8e8e93", marginBottom: 24 }}>Try a different search or category</p>
//             <button onClick={() => { setSearch(""); setCategory("All"); }} style={{
//               padding: "10px 28px", background: "#000", color: "#fff",
//               border: "none", borderRadius: 100, fontSize: 14,
//               cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
//             }}>
//               Clear filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ════════════════════════════════════════════════════
//           FOOTER
//       ════════════════════════════════════════════════════ */}
//       <footer style={{ background: "#1c1c1e", color: "rgba(255,255,255,0.6)", fontFamily: "inherit" }}>

//         {/* Top footer grid */}
//         <div style={{
//           maxWidth: 1100, margin: "0 auto",
//           padding: "56px 32px 40px",
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//           gap: 48,
//         }}>

//           {/* Brand col */}
//           <div>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: "#fff" }}>
//               <AppleSVG />
//               <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>iStore.pk</span>
//             </div>
//             <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", maxWidth: 220 }}>
//               Premium iPhones with verified IMEI, battery health & check warranty. 
//             </p>
//             <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//               {[
//                 { label: "Instagram", href: "#", icon: "📸" },
//                 { label: "WhatsApp", href: "https://wa.me/923120704180", icon: "💬" },
//                 { label: "Facebook",  href: "#", icon: "📘" },
//               ].map((s) => (
//                 <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
//                   width: 36, height: 36, borderRadius: 10,
//                   background: "rgba(255,255,255,0.08)",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: 15, textDecoration: "none",
//                   transition: "background 0.15s",
//                 }} title={s.label}>
//                   {s.icon}
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Contact col */}
//           <div>
//             <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: "-0.01em" }}>
//               Contact
//             </h4>
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {[
//                 { icon: "📍", text: "Saddar Market, Rawalpindi" },
//                 { icon: "📞", text: "+92 336 0972974", href: "tel:+923360972974" },
//                 { icon: "💬", text: "WhatsApp Us", href: "https://wa.me/923360972974" },
//               ].map((item) => (
//                 <div key={item.text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
//                   <span style={{ fontSize: 14, marginTop: 1 }}>{item.icon}</span>
//                   {item.href ? (
//                     <a href={item.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
//                       onMouseEnter={(e) => e.target.style.color = "#fff"}
//                       onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.45)"}>
//                       {item.text}
//                     </a>
//                   ) : (
//                     <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{item.text}</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Hours col */}
//           <div>
//             <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: "-0.01em" }}>
//               Opening Hours
//             </h4>
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               {[
//                 { day: "Mon – Thu", time: "11:00 AM – 10:00 PM" },
//                 { day: "Friday",    time: "2:00 PM – 11:00 PM" },
//                 { day: "Sat – Sun", time: "11:00 AM – 11:00 PM" },
//               ].map((h) => (
//                 <div key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13 }}>
//                   <span style={{ color: "rgba(255,255,255,0.4)" }}>{h.day}</span>
//                   <span style={{ color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>{h.time}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick links col */}
//           <div>
//             <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: "-0.01em" }}>
//               Quick Links
//             </h4>
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               {[
//                 { label: "📱 Browse iPhones", href: "/" },
//                 { label: "🛒 Cart",           href: "/cart" },
//                 { label: "📋 Track Order",    href: "#" },
//                 { label: "🗺️ Find Us",        href: "https://maps.google.com/?q=Saddar+Rawalpindi" },
//               ].map((link) => (
//                 <a key={link.label} href={link.href} style={{
//                   fontSize: 13, color: "rgba(255,255,255,0.45)",
//                   textDecoration: "none", transition: "color 0.15s",
//                 }}
//                   onMouseEnter={(e) => e.target.style.color = "#fff"}
//                   onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.45)"}>
//                   {link.label}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Divider */}
//         <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", maxWidth: 1100, margin: "0 auto" }} />

//         {/* Bottom bar */}
//         <div style={{
//           maxWidth: 1100, margin: "0 auto",
//           padding: "20px 32px",
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           flexWrap: "wrap", gap: 12,
//         }}>
//           <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
//             © 2026 iStore.pk · All rights reserved
//           </p>
//           {/* <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>
//             Made with ❤️ in Rawalpindi
//           </p> */}
//         </div>
//       </footer>

//     </div>
//   );
// }



import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const API = "http://localhost:5001/api";
const CATEGORIES = ["All", "PTA Approved", "Non PTA", "JV", "MDM", "BYPASS"];

const categoryMatch = (product, category) => {
  if (category === "All") return true;
  const name      = (product.name      || "").toLowerCase();
  const condition = (product.condition || "").toLowerCase();
  const cat       = category.toLowerCase();
  return name.includes(cat) || condition.includes(cat);
};

// ── Apple SVG ───────────────────────────────────────────────
const AppleSVG = () => (
  <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 28, height: 28, display: "block" }}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

// ── Search icon ─────────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

// ── Real brand SVG icons ────────────────────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort]         = useState("newest");
  const [focused, setFocused]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : (data?.data || []));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  let filtered = products.filter((p) => {
    const matchSearch = (p?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchCat    = categoryMatch(p, category);
    return matchSearch && matchCat && p.inStock !== false;
  });

  if (sort === "low")    filtered.sort((a, b) => (a.price||0) - (b.price||0));
  if (sort === "high")   filtered.sort((a, b) => (b.price||0) - (a.price||0));
  if (sort === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Social icon button style
  const socialBtn = (color) => ({
    width: 38, height: 38, borderRadius: 10,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    textDecoration: "none", transition: "background 0.15s, color 0.15s",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f2f2f7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <div style={{ position: "relative", overflow: "hidden", background: "#000", paddingBottom: "80px" }}>

        {/* Mesh bg */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 40%, rgba(99,99,255,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 70% 70% at 50% 100%, rgba(0,122,255,0.1) 0%, transparent 65%)
          `,
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Top nav */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
            {/* <AppleSVG /> */}
            
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#34c759",
              display: "inline-block", boxShadow: "0 0 8pxrgb(30, 218, 77)",
            }} />
             <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 500, letterSpacing: "0.03em" }}>
              Rawalpindi &amp; Islamabad · Free Delivery
            </span>
          </div>
        </div>

        {/* Hero body */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "64px 24px 0" }}>

          {/* Live badge
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)",
            borderRadius: 100, padding: "8px 20px", marginBottom: 32,
            backdropFilter: "blur(12px)",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#34c759",
              display: "inline-block", boxShadow: "0 0 8px #34c759",
            }} />
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 500, letterSpacing: "0.03em" }}>
              Rawalpindi &amp; Islamabad · Free Delivery
            </span>
          </div> */}

          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(48px, 9vw, 88px)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 0.95,
            margin: "0 0 8px", color: "#fff",
          }}>
             iStore.pk
          </h1>
          {/* <h1 style={{
            fontSize: "clamp(48px, 9vw, 88px)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 0.95, margin: "0 0 28px",
            background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.45) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            iPhone Store
          </h1> */}
<br />
          {/* Sub */}
          {/* <p style={{
            fontSize: "clamp(16px, 2.2vw, 20px)", color: "rgba(255,255,255,0.45)",
            fontWeight: 400, letterSpacing: "-0.01em",
            maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.55,
          }}>
            Verified iPhones with battery health, IMEI check &amp; up to 6-month warranty.
            <br />Cash on delivery. No advance.
          </p> */}

          {/* Search */}
          <div style={{ maxWidth: 520, margin: "0 auto 48px", position: "relative" }}>
            <div style={{
              position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)",
              color: focused ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
              pointerEvents: "none", transition: "color 0.2s",
              display: "flex", alignItems: "center",
            }}>
              <SearchIcon />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search iPhone 13, 15 Pro, 17 Pro Max..."
              style={{
                width: "100%", boxSizing: "border-box",
                background: focused ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.07)",
                border: focused ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "16px 20px 16px 50px",
                color: "#fff", fontSize: 15, outline: "none",
                backdropFilter: "blur(16px)", transition: "all 0.2s", fontFamily: "inherit",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{
                position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                borderRadius: "50%", width: 22, height: 22, cursor: "pointer",
                fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "inherit",
              }}>✕</button>
            )}
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 580, margin: "0 auto" }}>
            {[
              "🛡️ Up to 6-Month Warranty",
              "🚚 Cash on Delivery",
              "✅ IMEI Verified",
              "🔋 Battery Health Listed",
            ].map((badge) => (
              <span key={badge} style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 100, padding: "6px 14px", color: "rgba(255,255,255,0.55)",
                fontSize: 12, fontWeight: 500, backdropFilter: "blur(8px)",
              }}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Fade into page */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(to bottom, transparent, #f2f2f7)", zIndex: 1,
        }} />
      </div>

      {/* ══════════════════════ STICKY FILTER BAR ══════════════════════ */}
      <div style={{
        background: "rgba(242,242,247,0.85)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.07)",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "10px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: "7px 16px", borderRadius: 100, fontSize: 13,
                  fontWeight: active ? 600 : 400, cursor: "pointer",
                  border: active ? "none" : "1px solid rgba(0,0,0,0.1)",
                  background: active ? "#000" : "transparent",
                  color: active ? "#fff" : "#333",
                  transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: "inherit",
                }}>
                  {c}
                </button>
              );
            })}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
            border: "1px solid rgba(0,0,0,0.1)", borderRadius: 100,
            padding: "7px 16px", fontSize: 13, background: "transparent",
            color: "#333", cursor: "pointer", outline: "none",
            fontFamily: "inherit", flexShrink: 0,
          }}>
            <option value="newest">Newest First</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* ══════════════════════ PRODUCT COUNT ══════════════════════ */}
      {!loading && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 0" }}>
          <p style={{ fontSize: 13, color: "#8e8e93", fontWeight: 400 }}>
            {filtered.length} {filtered.length === 1 ? "phone" : "phones"}
            {category !== "All" && ` · ${category}`}
            {search && ` · "${search}"`}
          </p>
        </div>
      )}

      {/* ══════════════════════ PRODUCTS ══════════════════════ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 60px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 18, padding: 16, opacity: 1 - i * 0.08 }}>
                <div style={{ width: "100%", height: 200, background: "#f0f0f0", borderRadius: 12, marginBottom: 12, animation: "shimmer 1.4s ease-in-out infinite" }} />
                <div style={{ height: 14, background: "#f0f0f0", borderRadius: 8, marginBottom: 8, width: "70%", animation: "shimmer 1.4s ease-in-out infinite" }} />
                <div style={{ height: 11, background: "#f0f0f0", borderRadius: 8, width: "45%", animation: "shimmer 1.4s ease-in-out infinite" }} />
                <style>{`@keyframes shimmer{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#1c1c1e", marginBottom: 8 }}>No phones found</p>
            <p style={{ fontSize: 15, color: "#8e8e93", marginBottom: 24 }}>Try a different search or category</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} style={{
              padding: "10px 28px", background: "#000", color: "#fff",
              border: "none", borderRadius: 100, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
            }}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer style={{ background: "#1c1c1e", color: "rgba(255,255,255,0.6)", fontFamily: "inherit" }}>

        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "56px 32px 40px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48,
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: "#fff" }}>
              <AppleSVG />
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>iStore.pk</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", maxWidth: 220, margin: "0 0 20px" }}>
              Premium iPhones with verified IMEI, battery health &amp; up to 6-month warranty.
            </p>

            {/* ✅ Real SVG social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                title="Instagram"
                style={socialBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "transparent"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <InstagramIcon />
              </a>
              <a href="https://wa.me/923360972974" target="_blank" rel="noreferrer"
                title="WhatsApp"
                style={socialBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#25d366"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "transparent"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <WhatsAppIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                title="Facebook"
                style={socialBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1877f2"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "transparent"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <FacebookIcon />
              </a>
              <a href="mailto:istorepk92@gmail.com"
                title="Email"
                style={socialBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ea4335"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "transparent"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <EmailIcon />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: "-0.01em" }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "📍", text: "Saddar Market, Rawalpindi" },
                { icon: "📞", text: "+92 336 0972974", href: "tel:+923360972974" },
                { icon: "💬", text: "WhatsApp Us", href: "https://wa.me/923360972974" },
                { icon: "✉️", text: "istorepk92@gmail.com", href: "mailto:istorepk92@gmail.com" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.15s", wordBreak: "break-all" }}
                      onMouseEnter={(e) => e.target.style.color = "#fff"}
                      onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.45)"}>
                      {item.text}
                    </a>
                  ) : (
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: "-0.01em" }}>
              Opening Hours
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { day: "Mon – Thu", time: "11:00 AM – 10:00 PM" },
                { day: "Friday",    time: "2:00 PM – 11:00 PM"  },
                { day: "Sat – Sun", time: "11:00 AM – 11:00 PM" },
              ].map((h) => (
                <div key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 13 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>{h.day}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 16, letterSpacing: "-0.01em" }}>
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "📱 Browse iPhones", href: "/"         },
                { label: "🛒 Cart",           href: "/cart"     },
                { label: "📋 Track Order",    href: "#"         },
                { label: "🗺️ Find Us on Maps", href: "https://maps.google.com/?q=Saddar+Rawalpindi" },
              ].map((link) => (
                <a key={link.label} href={link.href} style={{
                  fontSize: 13, color: "rgba(255,255,255,0.45)",
                  textDecoration: "none", transition: "color 0.15s",
                }}
                  onMouseEnter={(e) => e.target.style.color = "#fff"}
                  onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.45)"}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", maxWidth: 1100, margin: "0 auto" }} />

        {/* Bottom bar */}
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "20px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
            © 2026 iStore.pk · All rights reserved
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>
            iStore.pk by Tallal Mahmood 
          </p>
        </div>
      </footer>

    </div>
  );
}