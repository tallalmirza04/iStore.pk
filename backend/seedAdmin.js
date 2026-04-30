// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const User = require("./models/User");
// require("dotenv").config();

// mongoose.connect(process.env.MONGO_URI);

// const createAdmin = async () => {
//   try {
//     const email = "admin@istore.pk";

//     const exists = await User.findOne({ email });

//     if (exists) {
//       console.log("⚠️ Admin already exists");
//       process.exit();
//     }

//     const hashedPassword = await bcrypt.hash("admin123", 10);

//     await User.create({
//       name: "Admin",
//       email,
//       password: hashedPassword,
//       role: "admin",
//     });

//     console.log("✅ Admin created successfully");
//     process.exit();
//   } catch (err) {
//     console.log("❌ Error:", err.message);
//     process.exit(1);
//   }
// };

// createAdmin();







// this is clauude
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    const email = "admin@istore.pk";
    const exists = await User.findOne({ email });

    if (exists) {
      console.log("⚠️  Admin already exists — email:", email);
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({ name: "iStore Admin", email, password: hashedPassword, role: "admin" });

    console.log("✅ Admin created!");
    console.log("   Email:    admin@istore.pk");
    console.log("   Password: admin123");
    process.exit();
  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();