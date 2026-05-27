import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getProfile);
router.patch('/', verifyToken, updateProfile);

export default router;
