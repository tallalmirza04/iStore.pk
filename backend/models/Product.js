import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    model:        { type: String },
    storage:      { type: String },
    condition:    { type: String, default: "Used" },
    price:        { type: Number, required: true },

    // ✅ batteryHealth (admin sends this, not "battery")
    batteryHealth: { type: Number },

    // ✅ images array (admin sends multiple Cloudinary URLs)
    images:       [{ type: String }],

    // kept for backwards compat with old frontend products
    image:        { type: String },

    description:  { type: String },
    imei:         { type: String },
    originalParts:{ type: Boolean, default: true },
    partsChanged: { type: String },
    warrantyNote: { type: String },
    inStock:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);


// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   battery: String,
//   condition: String,
//   image: String,
// });

// module.exports = mongoose.model("Product", productSchema);