import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Route imports
import loginRoutes from "./routes/login.js";
import userRoutes from "./routes/user.js";
import blogRoutes from "./routes/blog.js";
import blogCategoryRoutes from "./routes/blogCategory.js";
import commentRoutes from "./routes/comment.js";

// Load env
dotenv.config();

const app = express();
const uploadDir = path.join("public", "upload");

// Create upload dir if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created upload directory at:", uploadDir);
}

// Middleware
console.log("🔁 Registering middlewares...");
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/upload", express.static(uploadDir));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
});
const upload = multer({ storage });

// Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log("📸 Upload route hit");
  const file = req.file;
  res.status(200).json({ filename: file.filename });
});

// Routes
console.log("🔗 Mounting routes...");
app.get("/api/test", (req, res) => {
  res.send("✅ Backend API working!");
});
app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/blogCategory", blogCategoryRoutes);  // ✅ Correct route for blog categories
app.use("/api/comments", commentRoutes);

// Debug route (optional, for testing)
app.post("/debugtest", (req, res) => {
  console.log("🚨 /debugtest route hit");
  res.status(200).json({ message: "✅ Debug route OK" });
});

// 404 handler
app.use((req, res, next) => {
  console.log("❌ 404 - No endpoint matched");
  res.status(404).json({ message: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
