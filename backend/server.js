// import express from "express";
// import http from "http";
// import cors from "cors";
// import dotenv from "dotenv";
// import { Server } from "socket.io";

// import connectDB from "./config/db.js";

// import authRoutes    from "./routes/authRoutes.js";
// import orderRoutes   from "./routes/orderRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import riderRoutes   from "./routes/riderRoutes.js";

// dotenv.config();

// const app    = express();
// const server = http.createServer(app);

// // ── Middleware ───────────────────────────────────────────────
// app.use(cors());
// app.use(express.json());

// // ── DB ───────────────────────────────────────────────────────
// connectDB();

// // ── Socket.io ───────────────────────────────────────────────
// const io = new Server(server, { cors: { origin: "*" } });
// app.set("io", io);
// io.on("connection", (socket) => {
//   console.log("🟢 Socket connected:", socket.id);
// });

// // ── Routes ───────────────────────────────────────────────────
// app.use("/api/auth",     authRoutes);    // login, register, users, change-password
// app.use("/api/orders",   orderRoutes);   // orders + /my
// app.use("/api/products", productRoutes); // products
// app.use("/api/riders",   riderRoutes);   // riders

// // ── Health check ─────────────────────────────────────────────
// app.get("/api/health", (req, res) => res.json({ ok: true }));

// // ── Start ────────────────────────────────────────────────────
// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => {
//   console.log(`🔥 Server running on port ${PORT}`);
// });






import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes    from "./routes/authRoutes.js";
import orderRoutes   from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import riderRoutes   from "./routes/riderRoutes.js";
import promoRoutes   from "./routes/promoRoutes.js";

dotenv.config();

const app    = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();

const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);
});

app.use("/api/auth",     authRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/riders",   riderRoutes);
app.use("/api/promos",   promoRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));