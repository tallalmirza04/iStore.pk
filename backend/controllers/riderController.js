// const Rider = require("../models/Rider.js");


// // ---------------- ADD RIDER ----------------
// const addRider = async (req, res) => {
//   try {
//     const rider = new Rider(req.body);
//     await rider.save();

//     res.status(201).json({
//       success: true,
//       message: "Rider added successfully",
//       data: rider
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// // ---------------- GET ALL RIDERS ----------------
// const getAllRiders = async (req, res) => {
//   try {
//     const riders = await Rider.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: riders
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// // ---------------- UPDATE RIDER STATUS (ON/OFF) ----------------
// const updateRiderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const rider = await Rider.findById(req.params.id);

//     if (!rider) {
//       return res.status(404).json({
//         success: false,
//         message: "Rider not found"
//       });
//     }

//     rider.status = status;
//     await rider.save();

//     res.json({
//       success: true,
//       message: "Rider status updated",
//       data: rider
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// // ---------------- DELETE RIDER ----------------
// const deleteRider = async (req, res) => {
//   try {
//     const rider = await Rider.findByIdAndDelete(req.params.id);

//     if (!rider) {
//       return res.status(404).json({
//         success: false,
//         message: "Rider not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Rider deleted successfully"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// // ---------------- EXPORTS ----------------
// // module.exports = {
// //   addRider,
// //   getAllRiders,
// //   updateRiderStatus,
// //   deleteRider
// // };
// export {
//   addRider,
//   getAllRiders,
//   updateRiderStatus,
//   deleteRider
// };




import Rider from "../models/Rider.js";

// ---------------- ADD RIDER ----------------
export const addRider = async (req, res) => {
  try {
    const rider = new Rider(req.body);
    await rider.save();
    res.status(201).json({ success: true, message: "Rider added successfully", data: rider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- GET ALL RIDERS ----------------
export const getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find().sort({ createdAt: -1 });
    res.json(riders); // plain array — frontend handles both shapes
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- UPDATE RIDER STATUS ----------------
export const updateRiderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    rider.status = status;
    await rider.save();
    res.json({ success: true, message: "Rider status updated", data: rider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- DELETE RIDER ----------------
export const deleteRider = async (req, res) => {
  try {
    const rider = await Rider.findByIdAndDelete(req.params.id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    res.json({ success: true, message: "Rider deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};