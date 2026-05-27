import express from 'express';
import {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} from '../controllers/blog.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/by-id/:id', verifyToken, getBlogPostById);
router.get('/:slug', getBlogPostBySlug);
router.post('/', verifyToken, createBlogPost);
router.patch('/:id', verifyToken, updateBlogPost);
router.delete('/:id', verifyToken, deleteBlogPost);

export default router;
