import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  shortBio: {
    type: String
  },
  skills: [{
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 5 }
  }],
  timeline: [{
    year: String,
    role: String,
    org: String,
    desc: String
  }],
  currentlyLearning: [{
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  resumeUrl: String,
  socials: {
    github: String,
    linkedin: String,
    twitter: String,
    email: String
  },
  avatar: {
    url: String,
    publicId: String
  }
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
