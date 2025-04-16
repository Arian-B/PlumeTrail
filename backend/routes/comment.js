import express from "express";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

// Get all comments for a specific blog
router.get("/:blogId", getComments);

// Add a comment
router.post("/", addComment);

// Update a comment
router.put("/:id", updateComment);

// Delete a comment
router.delete("/:id", deleteComment);

export default router;
