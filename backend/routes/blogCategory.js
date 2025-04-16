import express from "express";
import {
  getBlogCategories,
  getBlogCategory,
  addBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "../controllers/blogCategory.js";

const router = express.Router();

router.get("/", getBlogCategories);
router.get("/:id", getBlogCategory);
router.post("/", addBlogCategory);
router.put("/:id", updateBlogCategory);
router.delete("/:id", deleteBlogCategory);

export default router;
