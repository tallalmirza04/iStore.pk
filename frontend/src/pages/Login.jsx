// // 




// // tthis is claused
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { setAuth } from "../utils/auth";

// const AppleSVG = () => (
//   <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 32, height: 32 }}>
//     <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
//   </svg>
// );

// export default function Login() {
//   const navigate = useNavigate();
//   const [form, setForm]     = useState({ email: "", password: "" });
//   const [error, setError]   = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const submit = async () => {
//     if (!form.email || !form.password) return setError("Please fill all fields");
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.post("http://localhost:5001/api/auth/login", form);
//       setAuth(res.data);
//       navigate(res.data.role === "admin" ? "/admin" : "/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKey = (e) => e.key === "Enter" && submit();

//   return (
//     <div style={{
//       minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
//       background: "linear-gradient(160deg, #1a1a1a 0%, #2a2a2a 100%)",
//       fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
//       padding: "24px",
//     }}>
//       <div style={{
//         width: "100%", maxWidth: 400,
//         background: "#fff", borderRadius: 24,
//         padding: "40px 36px", boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
//       }}>

//         {/* Logo */}
//         <div style={{ textAlign: "center", marginBottom: 28 }}>
//           <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
//             width: 56, height: 56, background: "#000", borderRadius: 16, marginBottom: 16 }}>
//             <div style={{ color: "#fff" }}><AppleSVG /></div>
//           </div>
//           <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c1c1e", margin: 0, letterSpacing: "-0.03em" }}>
//             Welcome back
//           </h1>
//           <p style={{ fontSize: 13, color: "#8e8e93", marginTop: 6 }}>Sign in to your iStore.pk account</p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div style={{
//             background: "#fff2f2", border: "1px solid #fecaca", borderRadius: 10,
//             padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626",
//           }}>
//             {error}
//           </div>
//         )}

//         {/* Fields */}
//         <div style={{ marginBottom: 14 }}>
//           <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3c", marginBottom: 6 }}>
//             Email
//           </label>
//           <input
//             name="email" type="email" value={form.email}
//             onChange={handleChange} onKeyDown={handleKey}
//             placeholder="you@example.com"
//             style={{
//               width: "100%", boxSizing: "border-box",
//               border: "1.5px solid #e5e5ea", borderRadius: 12,
//               padding: "12px 14px", fontSize: 15, outline: "none",
//               fontFamily: "inherit", color: "#1c1c1e",
//               transition: "border-color 0.2s",
//             }}
//             onFocus={(e) => e.target.style.borderColor = "#000"}
//             onBlur={(e)  => e.target.style.borderColor = "#e5e5ea"}
//           />
//         </div>

//         <div style={{ marginBottom: 24 }}>
//           <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3c", marginBottom: 6 }}>
//             Password
//           </label>
//           <input
//             name="password" type="password" value={form.password}
//             onChange={handleChange} onKeyDown={handleKey}
//             placeholder="••••••••"
//             style={{
//               width: "100%", boxSizing: "border-box",
//               border: "1.5px solid #e5e5ea", borderRadius: 12,
//               padding: "12px 14px", fontSize: 15, outline: "none",
//               fontFamily: "inherit", color: "#1c1c1e",
//               transition: "border-color 0.2s",
//             }}
//             onFocus={(e) => e.target.style.borderColor = "#000"}
//             onBlur={(e)  => e.target.style.borderColor = "#e5e5ea"}
//           />
//         </div>

//         {/* Submit */}
//         <button onClick={submit} disabled={loading} style={{
//           width: "100%", padding: "13px",
//           background: loading ? "#555" : "#000", color: "#fff",
//           border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600,
//           cursor: loading ? "not-allowed" : "pointer",
//           fontFamily: "inherit", transition: "background 0.2s",
//           marginBottom: 20,
//         }}>
//           {loading ? "Signing in…" : "Sign In"}
//         </button>

//         {/* Footer */}
//         <p style={{ textAlign: "center", fontSize: 13, color: "#8e8e93", margin: 0 }}>
//           Don't have an account?{" "}
//           <Link to="/signup" style={{ color: "#000", fontWeight: 600, textDecoration: "none" }}>
//             Create one
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AppleSVG = () => (
  <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 32, height: 32 }}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

export default function Login() {
  const navigate      = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async () => {
    if (!form.email || !form.password) return setError("Please fill all fields");
    setLoading(true);
    setError("");
    try {
      // Always wipe stale session before logging in
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      const res = await axios.post("http://localhost:5001/api/auth/login", form);

      // This page is for customers only — block admins
      if (res.data.role === "admin") {
        setError("Please use the Admin login page instead.");
        setLoading(false);
        return;
      }

      // Save and go to home
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user",  JSON.stringify(res.data));
      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === "Enter" && submit();

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #1a1a1a 0%, #2a2a2a 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#fff", borderRadius: 24,
        padding: "40px 36px", boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, background: "#000", borderRadius: 16, marginBottom: 16,
          }}>
            <div style={{ color: "#fff" }}><AppleSVG /></div>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c1c1e", margin: 0, letterSpacing: "-0.03em" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: "#8e8e93", marginTop: 6 }}>Sign in to your iStore.pk account</p>
        </div>

        {error && (
          <div style={{
            background: "#fff2f2", border: "1px solid #fecaca",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#dc2626",
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3c", marginBottom: 6 }}>Email</label>
          <input name="email" type="email" value={form.email}
            onChange={handleChange} onKeyDown={handleKey} placeholder="you@example.com"
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1.5px solid #e5e5ea", borderRadius: 12,
              padding: "12px 14px", fontSize: 15, outline: "none",
              fontFamily: "inherit", color: "#1c1c1e", transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#000"}
            onBlur={(e)  => e.target.style.borderColor = "#e5e5ea"}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3a3a3c", marginBottom: 6 }}>Password</label>
          <input name="password" type="password" value={form.password}
            onChange={handleChange} onKeyDown={handleKey} placeholder="••••••••"
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1.5px solid #e5e5ea", borderRadius: 12,
              padding: "12px 14px", fontSize: 15, outline: "none",
              fontFamily: "inherit", color: "#1c1c1e", transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#000"}
            onBlur={(e)  => e.target.style.borderColor = "#e5e5ea"}
          />
        </div>

        <button onClick={submit} disabled={loading} style={{
          width: "100%", padding: "13px",
          background: loading ? "#555" : "#000", color: "#fff",
          border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", marginBottom: 20,
        }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#8e8e93", margin: 0 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#000", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}