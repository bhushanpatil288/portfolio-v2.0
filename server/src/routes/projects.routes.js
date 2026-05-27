import express from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', verifyToken, createProject);
router.patch('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;
