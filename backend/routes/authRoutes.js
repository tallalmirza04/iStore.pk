// this is claused
import express from "express";
import { register, login, getMe, getUsers, deleteUser, updateUserRole, changePassword } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

// Admin only
router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

export default router;




// import express from "express";
// import { register, login } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;