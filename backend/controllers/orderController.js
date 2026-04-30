import Order from "../models/Order.js";
import getNextOrderId from "../utils/getNextOrderId.js";
import Rider from "../models/Rider.js";

// ── CREATE ORDER ────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    console.log("📦 ORDER BODY:", JSON.stringify(req.body, null, 2));

    const {
      orderItems  = [],
      totalPrice  = 0,
      type        = "delivery",
      accessories = [],
      warranty    = "none",
      name        = "",
      phone       = "",
      email       = "",
      address     = "",
      city        = "",
    } = req.body;

    const orderId = await getNextOrderId();

    // Attach user if token provided (optional)
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(
          authHeader.split(" ")[1],
          process.env.JWT_SECRET
        );
        userId = decoded.id;
      }
    } catch { /* guest order */ }

    const order = new Order({
      user: userId,
      orderItems,
      totalPrice,
      type,
      accessories,
      warranty,
      phone,
      email,
      address,
      shippingAddress: { name, phone, address, city },
      status:  "pending",
      orderId,
      rider:   null,
      history: [{ action: "Order Created", time: new Date() }],
    });

    const saved = await order.save();
    console.log("✅ Saved _id:", saved._id.toString());

    req.app.get("io")?.emit("order_updated", saved);
    return res.status(201).json(saved);
  } catch (err) {
    console.error("❌ createOrder FAILED:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// ── GET ALL (admin) ─────────────────────────────────────────
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("orderItems.product")
      .populate("rider")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET MY ORDERS ───────────────────────────────────────────
// Matches by user._id (logged-in orders) OR by email (guest orders
// placed with same email as account)
export const getMyOrders = async (req, res) => {
  try {
    const userId    = req.user._id;
    const userEmail = req.user.email;

    const orders = await Order.find({
      $or: [
        { user: userId },
        { email: userEmail },
      ],
    })
      .populate("orderItems.product")
      .populate("rider")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error("❌ getMyOrders:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// ── GET BY ID ───────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined")
      return res.status(400).json({ message: "Invalid order ID" });

    const order = await Order.findById(id)
      .populate("orderItems.product")
      .populate("rider");

    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── UPDATE STATUS ───────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, riderId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.history) order.history = [];

    if (status) {
      order.status = status;
      order.history.push({ action: status, time: new Date() });
    }

    if (riderId) {
      const rider = await Rider.findById(riderId);
      if (!rider) return res.status(404).json({ message: "Rider not found" });
      order.rider  = rider._id;
      order.status = "rider_assigned";
      order.history.push({ action: "rider_assigned", time: new Date() });
    }

    const updated = await order.save();
    req.app.get("io")?.emit("order_updated", updated);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};





// // this is claused
// import Order from "../models/Order.js";
// import getNextOrderId from "../utils/getNextOrderId.js";
// import Rider from "../models/Rider.js";

// // ── CREATE ORDER ────────────────────────────────────────────
// export const createOrder = async (req, res) => {
//   try {
//     console.log("📦 ORDER BODY:", JSON.stringify(req.body, null, 2));

//     const {
//       orderItems  = [],
//       totalPrice  = 0,
//       type        = "delivery",
//       accessories = [],
//       warranty    = "none",
//       name        = "",
//       phone       = "",
//       email       = "",
//       address     = "",
//       city        = "",
//     } = req.body;

//     const orderId = await getNextOrderId();

//     // Attach user if token provided (optional auth)
//     let userId = null;
//     try {
//       const authHeader = req.headers.authorization;
//       if (authHeader?.startsWith("Bearer ")) {
//         const jwt = await import("jsonwebtoken");
//         const decoded = jwt.default.verify(
//           authHeader.split(" ")[1],
//           process.env.JWT_SECRET
//         );
//         userId = decoded.id;
//       }
//     } catch { /* no token — guest order */ }

//     const order = new Order({
//       user: userId,
//       orderItems,
//       totalPrice,
//       type,
//       accessories,
//       warranty,
//       phone,
//       email,
//       address,
//       shippingAddress: { name, phone, address, city },
//       status:  "pending",
//       orderId,
//       rider:   null,
//       history: [{ action: "Order Created", time: new Date() }],
//     });

//     const saved = await order.save();
//     console.log("✅ Saved _id:", saved._id.toString());

//     req.app.get("io")?.emit("order_updated", saved);
//     return res.status(201).json(saved);
//   } catch (err) {
//     console.error("❌ createOrder FAILED:", err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // ── GET ALL (admin) ─────────────────────────────────────────
// export const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("orderItems.product")
//       .populate("rider")
//       .sort({ createdAt: -1 });
//     return res.json(orders);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // ── GET MY ORDERS (logged-in user) ──────────────────────────
// export const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .populate("orderItems.product")
//       .populate("rider")
//       .sort({ createdAt: -1 });
//     return res.json(orders);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // ── GET BY ID ───────────────────────────────────────────────
// export const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id || id === "undefined")
//       return res.status(400).json({ message: "Invalid order ID" });

//     const order = await Order.findById(id)
//       .populate("orderItems.product")
//       .populate("rider");

//     if (!order) return res.status(404).json({ message: "Order not found" });
//     return res.json(order);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // ── UPDATE STATUS ───────────────────────────────────────────
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { status, riderId } = req.body;
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (!order.history) order.history = [];

//     if (status) {
//       order.status = status;
//       order.history.push({ action: status, time: new Date() });
//     }

//     if (riderId) {
//       const rider = await Rider.findById(riderId);
//       if (!rider) return res.status(404).json({ message: "Rider not found" });
//       order.rider  = rider._id;
//       order.status = "rider_assigned";
//       order.history.push({ action: "rider_assigned", time: new Date() });
//     }

//     const updated = await order.save();
//     req.app.get("io")?.emit("order_updated", updated);
//     return res.json(updated);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };