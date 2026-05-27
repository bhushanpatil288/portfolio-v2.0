import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', verifyToken, createCategory);
router.patch('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

export default router;
