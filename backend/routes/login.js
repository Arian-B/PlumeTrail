import express from 'express';
import { register, login, logout } from '../controllers/login.js'; // Ensure correct path
console.log("✅ loginRoutes file loaded");

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/', login); 

// Logout route
router.post('/logout', logout);

// Log to verify routes are being loaded
console.log('Login routes are loaded');

// Export the router to be used in the main app
export default router;
