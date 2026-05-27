import Profile from '../models/Profile.js';
import asyncWrapper from '../middleware/asyncWrapper.js';

export const getProfile = asyncWrapper(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({
      name: 'Developer Name',
      title: 'Full Stack Engineer',
      bio: 'Update your bio...',
      shortBio: 'Update your short bio...',
      skills: [],
      timeline: [],
      socials: { github: '', linkedin: '', twitter: '', email: '' }
    });
  }
  res.status(200).json({
    success: true,
    profile
  });
});

export const updateProfile = asyncWrapper(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = new Profile(req.body);
  } else {
    Object.assign(profile, req.body);
  }
  await profile.save();
  res.status(200).json({
    success: true,
    profile
  });
});
