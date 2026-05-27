import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  color: {
    type: String,
    default: '#185FA5'
  }
});

categorySchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();
  
  let baseSlug = slugify(this.name);
  let finalSlug = baseSlug;
  let count = 1;

  while (await mongoose.models.Category.findOne({ slug: finalSlug, _id: { $ne: this._id } })) {
    finalSlug = `${baseSlug}-${Date.now()}-${count++}`;
  }
  
  this.slug = finalSlug;
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
