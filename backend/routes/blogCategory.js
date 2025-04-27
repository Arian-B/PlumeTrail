import express from 'express';
import { createCategory, getAllCategories, getCategoryById } from '../controllers/blogCategory.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories); // Get all categories
router.get('/:id', getCategoryById); // Get single category by ID

// Protected routes
router.post('/', auth, createCategory); // Create a new category

export default router;
