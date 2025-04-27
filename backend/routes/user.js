import express from 'express';
import { register, getUserById } from '../controllers/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register); // User registration

// Protected route: get user info by ID (optional, e.g. for profile)
router.get('/:id', auth, getUserById);

export default router;
