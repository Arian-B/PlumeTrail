import express from 'express';
import { createBlog, getAllBlogs, getRecentBlogs, getBlogsByCategory, getBlogById, updateBlog, deleteBlog } from '../controllers/blog.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs); // Get all blogs
router.get('/recent', getRecentBlogs); // Get recent blogs for homepage
router.get('/category/:categoryId', getBlogsByCategory); // Get blogs by category
router.get('/:id', getBlogById); // Get single blog by ID

// Protected routes
router.post('/', auth, createBlog); // Create a new blog
router.put('/:id', auth, updateBlog); // Update a blog
router.delete('/:id', auth, deleteBlog); // Delete a blog

export default router;
