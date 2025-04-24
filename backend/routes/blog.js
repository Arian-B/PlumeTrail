import express from "express";
import {
  addBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
} from "../controllers/blog.js";
import { verifyToken } from "../verifyToken.js"; // ✅ Direct import from backend root

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:id", getBlog);

// Protected routes
router.post("/", verifyToken, addBlog);
router.put("/:id", verifyToken, updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

export default router;
