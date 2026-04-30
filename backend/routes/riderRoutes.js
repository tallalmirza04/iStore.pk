


// import express from "express";
// import Rider from "../models/Rider.js";

// const router = express.Router();

// // GET ALL
// router.get("/", async (req, res) => {
//   const riders = await Rider.find().sort({ createdAt: -1 });
//   res.json(riders);
// });

// // ADD RIDER
// router.post("/", async (req, res) => {
//   try {
//     const rider = await Rider.create({
//       name: req.body.name,
//       phone: req.body.phone,
//       status: "on",
//     });
//     res.json(rider);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ UPDATE STATUS — this is what Admin calls: PUT /riders/:id/status
// router.put("/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;
//     const rider = await Rider.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     if (!rider) return res.status(404).json({ message: "Rider not found" });
//     res.json(rider);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // UPDATE (general — keep for future use)
// router.put("/:id", async (req, res) => {
//   try {
//     const rider = await Rider.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(rider);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE
// router.delete("/:id", async (req, res) => {
//   await Rider.findByIdAndDelete(req.params.id);
//   res.json({ ok: true });
// });

// export default router;










import express from "express";
import Rider from "../models/Rider.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const riders = await Rider.find().sort({ createdAt: -1 });
    res.json(riders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD RIDER — ✅ admin only + must have name & phone, rejects order-like payloads
router.post("/", protect, async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Guard: reject if this looks like an order payload
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }
    if (req.body.orderItems || req.body.totalPrice) {
      return res.status(400).json({ message: "Invalid rider data" });
    }

    const rider = await Rider.create({ name, phone, status: "on" });
    res.status(201).json(rider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STATUS — PUT /riders/:id/status
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!rider) return res.status(404).json({ message: "Rider not found" });
    res.json(rider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE (general)
router.put("/:id", protect, async (req, res) => {
  try {
    const rider = await Rider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(rider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    await Rider.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;