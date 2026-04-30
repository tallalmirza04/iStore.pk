import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name:    String,
        qty:     Number,
        price:   Number,
      },
    ],

    accessories: [
      {
        name:  String,
        price: Number,
      },
    ],

    warranty: { type: String, default: "none" },

    orderId: { type: String, unique: true },

    totalPrice: { type: Number, required: true },

    type: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending","confirmed","rider_assigned","out_for_delivery","delivered","completed","cancelled"],
      default: "pending",
    },

    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      default: null,
    },

    history: [
      { action: String, time: Date },
    ],

    address:  String,
    phone:    String,
    email:    String,

    shippingAddress: {
      name:    String,
      phone:   String,
      address: String,
      city:    String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);







// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     orderItems: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//         },
//         name: String,
//         qty: Number,
//         price: Number,
//       },
//     ],

//     accessories: [
//       {
//         name: String,
//         price: Number,
//       },
//     ],

//     warranty: {
//       type: String,
//       default: "none",
//     },

//     // ⚠️ optional business order ID (NOT used for frontend lookup)
//     orderId: {
//       type: String,
//       unique: true,
//     //   default: () => "ORD-" + Date.now(),
//     },

//     totalPrice: {
//       type: Number,
//       required: true,
//     },


//     type: {
//       type: String,
//       enum: ["delivery", "pickup"],
//       default: "delivery",
//       required: true,
//     },


//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "confirmed",
//         "rider_assigned",
//         "out_for_delivery",
//         "delivered",
//         "completed",
//         "cancelled",
//       ],
//       default: "pending",
//     },

//     rider: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Rider",
//   default: null,
// },

//    history: [
//   {
//     action: String,
//     time: Date,
//   },
// ],

//     address: String,
//     phone: String,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);