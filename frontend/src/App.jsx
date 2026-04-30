
// import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// import Navbar         from "./components/Navbar";
// import Home           from "./pages/Home";
// import ProductDetails from "./pages/ProductDetails";
// import Cart           from "./pages/Cart";
// import Checkout       from "./pages/Checkout";
// import Success        from "./pages/Success";
// import Admin          from "./pages/Admin";
// import AdminLogin     from "./pages/AdminLogin";
// import ReceiptPage    from "./pages/ReceiptPage";
// import Login          from "./pages/Login";
// import Signup         from "./pages/Signup";
// import OrderHistory   from "./pages/OrderHistory";

// const HIDE_NAVBAR = ["/admin", "/receipt", "/admin-login"];

// function getUser() {
//   try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
// }

// function Layout() {
//   const location = useLocation();
//   const hideNav  = HIDE_NAVBAR.some((p) => location.pathname.startsWith(p));
//   const token    = localStorage.getItem("token");
//   const user     = getUser();

//   return (
//     <>
//       {!hideNav && <Navbar />}
//       <Routes>

//         {/* ── Public ── */}
//         <Route path="/"             element={<Home />} />
//         <Route path="/product/:id"  element={<ProductDetails />} />
//         <Route path="/cart"         element={<Cart />} />
//         <Route path="/checkout"     element={<Checkout />} />
//         <Route path="/success/:id"  element={<Success />} />

//         {/* ── Auth ── */}
//         <Route path="/login"        element={<Login />} />
//         <Route path="/signup"       element={<Signup />} />

//         {/* ── Separate admin login ── */}
//         <Route path="/admin-login"  element={<AdminLogin />} />

//         {/* ── Receipt — both with and without id ── */}
//         <Route path="/receipt"      element={<ReceiptPage />} />
//         <Route path="/receipt/:id"  element={<ReceiptPage />} />

//         {/* ── User protected ── */}
//         <Route
//           path="/orders"
//           element={token ? <OrderHistory /> : <Navigate to="/login" replace />}
//         />

//         {/* ── Admin protected — must be logged in via admin-login ── */}
//         <Route
//           path="/admin"
//           element={
//             token && user?.role === "admin"
//               ? <Admin />
//               : <Navigate to="/admin-login" replace />
//           }
//         />

//         {/* ── Catch-all ── */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Layout />
//     </BrowserRouter>
//   );
// }








import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar         from "./components/Navbar";
import Home           from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart           from "./pages/Cart";
import Checkout       from "./pages/Checkout";
import Success        from "./pages/Success";
import Admin          from "./pages/Admin";
import AdminLogin     from "./pages/AdminLogin";
import ReceiptPage    from "./pages/ReceiptPage";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import OrderHistory   from "./pages/OrderHistory";

const HIDE_NAVBAR = ["/admin", "/receipt", "/admin-login"];

function Layout() {
  const location = useLocation();
  const hideNav  = HIDE_NAVBAR.some((p) => location.pathname.startsWith(p));

  // ✅ Separate keys for admin vs user — never conflict
  const userToken  = localStorage.getItem("token");
  const adminToken = localStorage.getItem("admin_token");

  let adminUser = null;
  try { adminUser = JSON.parse(localStorage.getItem("admin_user")); } catch {}

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>

        {/* Public */}
        <Route path="/"            element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/success/:id" element={<Success />} />

        {/* Auth */}
        <Route path="/login"       element={<Login />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Receipt */}
        <Route path="/receipt"     element={<ReceiptPage />} />
        <Route path="/receipt/:id" element={<ReceiptPage />} />

        {/* User protected — uses user token */}
        <Route path="/orders"
          element={userToken ? <OrderHistory /> : <Navigate to="/login" replace />}
        />

        {/* Admin protected — uses SEPARATE admin token */}
        <Route path="/admin"
          element={
            adminToken && adminUser?.role === "admin"
              ? <Admin />
              : <Navigate to="/admin-login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}