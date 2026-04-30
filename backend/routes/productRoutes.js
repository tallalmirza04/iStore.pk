
// import express from "express";
// import Product from "../models/Product.js";

// const router = express.Router();

// // GET
// router.get("/", async (req, res) => {
//   const products = await Product.find().sort({ createdAt: -1 });
//   res.json(products);
// });

// // CREATE (WITH IMAGE URL FIX)
// router.post("/", async (req, res) => {
//   try {
//     const product = await Product.create({
//       name: req.body.name,
//       price: req.body.price,
//       battery: req.body.battery,
//       condition: req.body.condition,
//       image: req.body.image, // IMPORTANT FIX
//     });

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE
// router.delete("/:id", async (req, res) => {
//   await Product.findByIdAndDelete(req.params.id);
//   res.json({ ok: true });
// });

// export default router;


import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ONE
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE — was missing, admin Edit button needs this
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;