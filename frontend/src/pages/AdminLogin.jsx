// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AppleSVG = () => (
//   <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 28, height: 28 }}>
//     <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
//   </svg>
// );

// export default function AdminLogin() {
//   const navigate      = useNavigate();
//   const [form, setForm]       = useState({ email: "", password: "" });
//   const [error, setError]     = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const submit = async () => {
//     if (!form.email || !form.password) return setError("Fill all fields");
//     setLoading(true);
//     setError("");
//     try {
//       // Wipe any existing session first
//       localStorage.clear();

//       const res = await axios.post("http://localhost:5001/api/auth/login", form);

//       // Strict check — reject non-admins immediately
//       if (res.data.role !== "admin") {
//         setError("Access denied. Admin accounts only.");
//         setLoading(false);
//         return;
//       }

//       // Save and redirect
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user",  JSON.stringify(res.data));
//       navigate("/admin");

//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKey = (e) => e.key === "Enter" && submit();

//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "#000",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
//       padding: 24,
//       position: "relative", overflow: "hidden",
//     }}>
//       {/* subtle grid */}
//       <div style={{
//         position: "absolute", inset: 0,
//         backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
//         backgroundSize: "28px 28px",
//       }} />
//       {/* glow */}
//       <div style={{
//         position: "absolute", top: "30%", left: "50%",
//         transform: "translateX(-50%)",
//         width: 400, height: 200,
//         background: "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)",
//         pointerEvents: "none",
//       }} />

//       <div style={{
//         position: "relative", zIndex: 1,
//         width: "100%", maxWidth: 380,
//         background: "rgba(255,255,255,0.04)",
//         border: "1px solid rgba(255,255,255,0.1)",
//         borderRadius: 24, padding: "40px 36px",
//         backdropFilter: "blur(20px)",
//       }}>
//         {/* Header */}
//         <div style={{ textAlign: "center", marginBottom: 32 }}>
//           <div style={{ color: "#fff", display: "flex", justifyContent: "center", marginBottom: 16 }}>
//             <AppleSVG />
//           </div>
//           <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", margin: "0 0 8px", textTransform: "uppercase" }}>
//             iStore.pk
//           </p>
//           <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
//             Admin Panel
//           </h1>
//           <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
//             Restricted access only
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div style={{
//             background: "rgba(255,59,48,0.15)", border: "1px solid rgba(255,59,48,0.3)",
//             borderRadius: 10, padding: "10px 14px", marginBottom: 20,
//             fontSize: 13, color: "#ff6b6b",
//           }}>
//             {error}
//           </div>
//         )}

//         {/* Fields */}
//         {[
//           { name: "email",    label: "Email",    type: "email",    ph: "admin@istore.pk" },
//           { name: "password", label: "Password", type: "password", ph: "••••••••" },
//         ].map((f) => (
//           <div key={f.name} style={{ marginBottom: 16 }}>
//             <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.03em" }}>
//               {f.label.toUpperCase()}
//             </label>
//             <input
//               name={f.name} type={f.type} placeholder={f.ph}
//               value={form[f.name]} onChange={handleChange} onKeyDown={handleKey}
//               style={{
//                 width: "100%", boxSizing: "border-box",
//                 background: "rgba(255,255,255,0.06)",
//                 border: "1px solid rgba(255,255,255,0.12)",
//                 borderRadius: 12, padding: "12px 14px",
//                 color: "#fff", fontSize: 15, outline: "none",
//                 fontFamily: "inherit", transition: "border-color 0.2s",
//               }}
//               onFocus={(e) => e.target.style.borderColor = "rgba(255,255,255,0.4)"}
//               onBlur={(e)  => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
//             />
//           </div>
//         ))}

//         <div style={{ marginTop: 8, marginBottom: 0 }}>
//           <button onClick={submit} disabled={loading} style={{
//             width: "100%", padding: "13px",
//             background: loading ? "rgba(255,255,255,0.1)" : "#fff",
//             color: loading ? "rgba(255,255,255,0.3)" : "#000",
//             border: "none", borderRadius: 12,
//             fontSize: 15, fontWeight: 700,
//             cursor: loading ? "not-allowed" : "pointer",
//             fontFamily: "inherit", transition: "all 0.2s",
//             marginTop: 8,
//           }}>
//             {loading ? "Signing in…" : "Sign In to Admin"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }








import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppleSVG = () => (
  <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 28, height: 28 }}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async () => {
    if (!form.email || !form.password) return setError("Fill all fields");
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", form);

      if (res.data.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        return;
      }

      // ✅ Store admin session under SEPARATE keys — never touches user session
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_user",  JSON.stringify(res.data));

      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === "Enter" && submit();

  return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 400, height: 200,
        background: "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 380,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24, padding: "40px 36px",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ color: "#fff", display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <AppleSVG />
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", margin: "0 0 8px", textTransform: "uppercase" }}>
            iStore.pk
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
            Restricted access only
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255,59,48,0.15)", border: "1px solid rgba(255,59,48,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 20,
            fontSize: 13, color: "#ff6b6b",
          }}>
            {error}
          </div>
        )}

        {[
          { name: "email",    label: "Email",    type: "email",    ph: "admin@istore.pk" },
          { name: "password", label: "Password", type: "password", ph: "••••••••" },
        ].map((f) => (
          <div key={f.name} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 7, letterSpacing: "0.03em" }}>
              {f.label.toUpperCase()}
            </label>
            <input
              name={f.name} type={f.type} placeholder={f.ph}
              value={form[f.name]} onChange={handleChange} onKeyDown={handleKey}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12, padding: "12px 14px",
                color: "#fff", fontSize: 15, outline: "none",
                fontFamily: "inherit", transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(255,255,255,0.4)"}
              onBlur={(e)  => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          </div>
        ))}

        <button onClick={submit} disabled={loading} style={{
          width: "100%", marginTop: 8, padding: "13px",
          background: loading ? "rgba(255,255,255,0.1)" : "#fff",
          color: loading ? "rgba(255,255,255,0.3)" : "#000",
          border: "none", borderRadius: 12,
          fontSize: 15, fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", transition: "all 0.2s",
        }}>
          {loading ? "Signing in…" : "Sign In to Admin"}
        </button>
      </div>
    </div>
  );
}