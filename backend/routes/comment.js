import express from "express";
import {
  getCommentsByBlogId,
  addComment,
  deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

router.get("/:blogId", getCommentsByBlogId); // Get all comments for a blog post
router.post("/", addComment);                // Add a comment
router.delete("/:id", deleteComment);        // Delete comment by id

export default router;
