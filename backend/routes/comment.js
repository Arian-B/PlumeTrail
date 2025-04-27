import express from 'express';
import { addComment, getCommentsByBlog, deleteComment } from '../controllers/comment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/blog/:blogId', getCommentsByBlog); // Get all comments for a blog

// Protected route
router.post('/', auth, addComment); // Add a comment to a blog
router.delete('/:comm_id', auth, deleteComment); // Delete a comment

export default router;
