import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 PROTECT (ONLY WHEN USED)
export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  // ✅ If no token → BLOCK (only for protected routes)
  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 👨‍💼 ADMIN ONLY
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};