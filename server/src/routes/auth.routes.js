import express from 'express';
import { login, getMe, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, login);
router.get('/me', verifyToken, getMe);
router.post('/logout', logout);

export default router;
