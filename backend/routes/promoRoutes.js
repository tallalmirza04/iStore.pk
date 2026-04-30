import express from "express";
import {
  validatePromo,
  usePromo,
  getPromos,
  createPromo,
  togglePromo,
  deletePromo,
} from "../controllers/promoController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public — called from checkout
router.post("/validate", validatePromo);
router.post("/use",      usePromo);

// Admin only
router.get("/",           protect, adminOnly, getPromos);
router.post("/",          protect, adminOnly, createPromo);
router.put("/:id/toggle", protect, adminOnly, togglePromo);
router.delete("/:id",     protect, adminOnly, deletePromo);

export default router;