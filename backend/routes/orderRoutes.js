import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ✅ EXACT routes MUST come before /:id wildcard
router.get("/",       protect, getOrders);    // GET  /api/orders       — admin all
router.get("/my",     protect, getMyOrders);  // GET  /api/orders/my    — user history
router.post("/",      createOrder);           // POST /api/orders       — place order
router.get("/:id",    getOrderById);          // GET  /api/orders/:id   — single order
router.put("/:id/status", protect, updateOrderStatus); // PUT status

export default router;



// // this is claused
// import express from "express";
// import {
//   createOrder,
//   getOrders,
//   getOrderById,
//   updateOrderStatus,
//   getMyOrders,
// } from "../controllers/orderController.js";
// import { protect } from "../middleware/auth.js";

// const router = express.Router();

// // ✅ Specific routes BEFORE wildcard /:id
// router.get("/",    protect, getOrders);    // admin: all orders
// router.get("/my",  protect, getMyOrders);  // user: their orders
// router.post("/",   createOrder);           // place order
// router.get("/:id", getOrderById);          // public: single order
// router.put("/:id/status", protect, updateOrderStatus);

// export default router;