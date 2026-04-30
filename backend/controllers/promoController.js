import Promo from "../models/Promo.js";

// ── VALIDATE CODE (public — called from checkout) ───────────
export const validatePromo = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code) return res.status(400).json({ message: "Code is required" });

    const promo = await Promo.findOne({ code: code.toUpperCase().trim() });

    if (!promo)
      return res.status(404).json({ message: "Invalid promo code" });

    if (!promo.active)
      return res.status(400).json({ message: "This promo code is no longer active" });

    if (promo.expiresAt && new Date() > promo.expiresAt)
      return res.status(400).json({ message: "This promo code has expired" });

    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses)
      return res.status(400).json({ message: "This promo code has reached its usage limit" });

    if (orderTotal && promo.minOrder > 0 && orderTotal < promo.minOrder)
      return res.status(400).json({
        message: `Minimum order of Rs ${promo.minOrder.toLocaleString()} required`,
      });

    // Calculate discount
    let discount = 0;
    if (promo.type === "percentage") {
      discount = Math.round((orderTotal * promo.value) / 100);
    } else {
      discount = promo.value;
    }

    return res.json({
      valid: true,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discount,
      message: promo.type === "percentage"
        ? `${promo.value}% off applied!`
        : `Rs ${promo.value.toLocaleString()} off applied!`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── INCREMENT USE COUNT (called when order placed) ──────────
export const usePromo = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Code required" });

    await Promo.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── GET ALL PROMOS (admin) ──────────────────────────────────
export const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });
    return res.json(promos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── CREATE PROMO (admin) ────────────────────────────────────
export const createPromo = async (req, res) => {
  try {
    const { code, type, value, minOrder, maxUses, expiresAt } = req.body;

    if (!code || !type || !value)
      return res.status(400).json({ message: "Code, type and value are required" });

    const existing = await Promo.findOne({ code: code.toUpperCase().trim() });
    if (existing)
      return res.status(400).json({ message: "Promo code already exists" });

    const promo = await Promo.create({
      code:      code.toUpperCase().trim(),
      type,
      value:     Number(value),
      minOrder:  Number(minOrder || 0),
      maxUses:   maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt || null,
      active:    true,
    });

    return res.status(201).json(promo);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── TOGGLE ACTIVE (admin) ───────────────────────────────────
export const togglePromo = async (req, res) => {
  try {
    const promo = await Promo.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promo not found" });

    promo.active = !promo.active;
    await promo.save();
    return res.json(promo);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── DELETE PROMO (admin) ────────────────────────────────────
export const deletePromo = async (req, res) => {
  try {
    await Promo.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};