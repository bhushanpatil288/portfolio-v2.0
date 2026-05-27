import Project from '../models/Project.js';
import Category from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';
import asyncWrapper from '../middleware/asyncWrapper.js';

export const getProjects = asyncWrapper(async (req, res) => {
  const { category, featured, limit } = req.query;
  const filter = {};

  if (featured !== undefined) {
    filter.featured = featured === 'true';
  }

  if (category) {
    let categoryObj = await Category.findOne({ slug: category });
    if (!categoryObj) {
      try {
        categoryObj = await Category.findById(category);
      } catch (err) {
        // Invalid ID
      }
    }
    if (categoryObj) {
      filter.categories = categoryObj._id;
    } else {
      return res.status(200).json({ success: true, projects: [] });
    }
  }

  let query = Project.find(filter).populate('categories').sort({ order: 1, createdAt: -1 });

  if (limit) {
    query = query.limit(parseInt(limit, 10));
  }

  const projects = await query;
  res.status(200).json({
    success: true,
    projects
  });
});

export const getProjectBySlug = asyncWrapper(async (req, res) => {
  const { slug } = req.params;
  const project = await Project.findOne({ slug }).populate('categories');
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  res.status(200).json({
    success: true,
    project
  });
});

export const createProject = asyncWrapper(async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.status(201).json({
    success: true,
    project
  });
});

export const updateProject = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  res.status(200).json({
    success: true,
    project
  });
});

export const deleteProject = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  res.status(200).json({
    success: true,
    message: 'Project deleted successfully'
  });
});
