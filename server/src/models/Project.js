import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  shortDesc: {
    type: String,
    maxlength: 160
  },
  description: {
    type: String
  },
  images: [{
    url: String,
    publicId: String
  }],
  coverImage: {
    url: String,
    publicId: String
  },
  techStack: [String],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  liveUrl: String,
  githubUrl: String,
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', async function (next) {
  if (!this.isModified('title') && this.slug) return next();

  let baseSlug = slugify(this.title);
  let finalSlug = baseSlug;

  const existing = await mongoose.models.Project.findOne({ slug: finalSlug, _id: { $ne: this._id } });
  if (existing) {
    finalSlug = `${baseSlug}-${Date.now()}`;
  }

  this.slug = finalSlug;
  next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
