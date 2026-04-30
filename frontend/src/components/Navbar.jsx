// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getCart } from "../utils/cart";

// function Navbar() {
//   const [count, setCount] = useState(0);

//   const update = () => {
//     const cart = getCart();
//     const total = cart.reduce(
//       (sum, item) => sum + (item.quantity || 0),
//       0
//     );
//     setCount(total);
//   };

//   useEffect(() => {
//     update();

//     const interval = setInterval(update, 500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">

//       <Link to="/" className="text-2xl font-bold">
//          iStore.pk
//       </Link>

//       <div className="flex items-center gap-6">

//         <Link to="/" className="text-gray-700">
//           Home
//         </Link>

//         <Link to="/cart" className="relative">
//           🛒 Cart

//           {count > 0 && (
//             <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
//               {count}
//             </span>
//           )}
//         </Link>

//         <button className="bg-black text-white px-4 py-2 rounded-lg">
//           Sign In
//         </button>

//       </div>

//     </nav>
//   );
// }

// export default Navbar;






// this is claused
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getCart } from "../utils/cart";

const AppleSVG = () => (
  <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 18, height: 18, display: "block" }}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

export default function Navbar() {
  const navigate    = useNavigate();
  const dropRef     = useRef(null);
  const [count, setCount]   = useState(0);
  const [user, setUser]     = useState(null);
  const [open, setOpen]     = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk]       = useState(false);

  // Cart count
  useEffect(() => {
    const update = () => {
      const cart  = getCart();
      const total = cart.reduce((s, i) => s + (i.quantity || 0), 0);
      setCount(total);
    };
    update();
    const iv = setInterval(update, 500);
    return () => clearInterval(iv);
  }, []);

  // Auth state
  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);

    const onStorage = () => {
      const r = localStorage.getItem("user");
      setUser(r ? JSON.parse(r) : null);
    };
    window.addEventListener("storage", onStorage);
    // Also poll every second so login/logout on same tab reflects
    const iv = setInterval(onStorage, 1000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(iv); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setOpen(false);
    navigate("/");
  };

  const changePassword = async () => {
    setPwError("");
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) return setPwError("Fill all fields");
    if (pwForm.next.length < 6) return setPwError("New password must be 6+ characters");
    if (pwForm.next !== pwForm.confirm) return setPwError("Passwords don't match");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok) return setPwError(data.message || "Failed");
      setPwOk(true);
      setTimeout(() => { setPwModal(false); setPwForm({ current: "", next: "", confirm: "" }); setPwOk(false); }, 1500);
    } catch { setPwError("Network error"); }
  };

  // Avatar initials
  const initials = user?.name ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 56,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "sticky", top: 0, zIndex: 50,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#000" }}>
          <AppleSVG />
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>iStore.pk</span>
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

          {/* Cart */}
          <Link to="/cart" style={{
            display: "flex", alignItems: "center", gap: 6,
            textDecoration: "none", color: "#1c1c1e",
            fontSize: 14, fontWeight: 500, position: "relative",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ width: 20, height: 20 }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span>Cart</span>
            {count > 0 && (
              <span style={{
                position: "absolute", top: -8, right: -10,
                background: "#ff3b30", color: "#fff",
                fontSize: 10, fontWeight: 700,
                minWidth: 16, height: 16, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 4px",
              }}>
                {count}
              </span>
            )}
          </Link>

          {/* Auth area */}
          {!user ? (
            <Link to="/login" style={{
              background: "#000", color: "#fff",
              padding: "7px 16px", borderRadius: 20,
              textDecoration: "none", fontSize: 13, fontWeight: 600,
            }}>
              Sign In
            </Link>
          ) : (
            <div ref={dropRef} style={{ position: "relative" }}>
              {/* Avatar button */}
              <button onClick={() => setOpen((o) => !o)} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "none", border: "1.5px solid rgba(0,0,0,0.12)",
                borderRadius: 20, padding: "5px 12px 5px 6px",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                {/* Avatar circle */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#000", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1c1c1e", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ width: 12, height: 12, color: "#8e8e93", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {/* Dropdown */}
              {open && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#fff", border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 14, padding: "6px",
                  minWidth: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  zIndex: 100,
                }}>

                  {/* User info */}
                  <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1c1c1e", margin: 0 }}>{user.name}</p>
                    <p style={{ fontSize: 11, color: "#8e8e93", margin: "2px 0 0", wordBreak: "break-all" }}>{user.email}</p>
                  </div>

                  {[
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                        </svg>
                      ),
                      label: "Order History",
                      onClick: () => { navigate("/orders"); setOpen(false); },
                    },
                    {
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      ),
                      label: "Change Password",
                      onClick: () => { setPwModal(true); setOpen(false); },
                    },
                  ].map((item) => (
                    <button key={item.label} onClick={item.onClick} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "9px 12px", border: "none",
                      background: "none", borderRadius: 8, cursor: "pointer",
                      fontSize: 13, color: "#1c1c1e", fontFamily: "inherit",
                      textAlign: "left", transition: "background 0.1s",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f2f2f7"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                      <span style={{ color: "#8e8e93" }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", margin: "4px 0" }} />

                  <button onClick={logout} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "9px 12px", border: "none",
                    background: "none", borderRadius: 8, cursor: "pointer",
                    fontSize: 13, color: "#ff3b30", fontFamily: "inherit",
                    textAlign: "left", transition: "background 0.1s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fff2f2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ width: 15, height: 15 }}>
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── Change Password Modal ── */}
      {pwModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", padding: 24,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 28,
            width: "100%", maxWidth: 360, boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1c1c1e" }}>Change Password</h2>
              <button onClick={() => { setPwModal(false); setPwError(""); setPwOk(false); }} style={{
                border: "none", background: "#f2f2f7", borderRadius: "50%",
                width: 28, height: 28, cursor: "pointer", fontSize: 14, color: "#8e8e93",
              }}>✕</button>
            </div>

            {pwError && (
              <div style={{ background: "#fff2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 12, color: "#dc2626" }}>
                {pwError}
              </div>
            )}
            {pwOk && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 12, color: "#16a34a" }}>
                Password changed successfully!
              </div>
            )}

            {[
              { key: "current", label: "Current Password" },
              { key: "next",    label: "New Password" },
              { key: "confirm", label: "Confirm New Password" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#3a3a3c", marginBottom: 5 }}>
                  {f.label}
                </label>
                <input type="password" value={pwForm[f.key]}
                  onChange={(e) => { setPwForm((p) => ({ ...p, [f.key]: e.target.value })); setPwError(""); }}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    border: "1.5px solid #e5e5ea", borderRadius: 10,
                    padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#000"}
                  onBlur={(e)  => e.target.style.borderColor = "#e5e5ea"}
                />
              </div>
            ))}

            <button onClick={changePassword} style={{
              width: "100%", marginTop: 8, padding: "12px",
              background: "#000", color: "#fff", border: "none",
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Update Password
            </button>
          </div>
        </div>
      )}
    </>
  );
}