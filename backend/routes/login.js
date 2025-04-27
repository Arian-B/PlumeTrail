import express from 'express';
import { login } from '../controllers/login.js';

const router = express.Router();

router.post('/', login); // User login

export default router;
