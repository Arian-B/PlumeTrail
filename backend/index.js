// index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";

// Routes
import loginRoutes from "./routes/login.js";
import userRoutes from "./routes/user.js";
import blogRoutes from "./routes/blog.js";
import blogCategoryRoutes from "./routes/blogCategory.js";
import commentRoutes from "./routes/comment.js";

const app = express();

// Create public/upload directory if it doesn't exist
const uploadDir = path.join("public", "upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created upload directory at:", uploadDir);
}

// CORS setup - adjust frontend port as needed
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files (images, etc.)
app.use("/upload", express.static(uploadDir));

// Multer storage config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

// File upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json({ filename: file.filename });
});

// Routes
app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/blogCategory", blogCategoryRoutes);
app.use("/api/comments", commentRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(8800, () => {
  console.log("✅ Server is running at http://localhost:8800");
});
