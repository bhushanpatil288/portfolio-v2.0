import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Profile from './models/Profile.js';
import connectDB from './config/db.js';

// Resolve environment file location dynamically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedProfile() {
  // Connect to the database using existing connection configuration
  await connectDB();

  console.log('Clearing existing profile...');
  await Profile.deleteMany({});

  console.log('Seeding new profile details...');
  await Profile.create({
    name: 'Bhushan Ghansham Patil',
    title: 'Full Stack Developer',
    shortBio: 'I build things for the web — from clean UIs to solid backends.',
    bio: `I'm Bhushan, a full stack developer with a background that might surprise you — I started with a BA in English before falling headfirst into code. That path taught me to think clearly, communicate well, and learn anything from scratch. These days I apply all three to building web applications with the MERN stack.

I'm currently pursuing my MCA (2025–2027) and sharpening my skills at Red & White Skill Education, where I've been going deep on real-world full stack development. I'm a fresher, but I don't arrive empty-handed — I bring strong fundamentals across the entire stack and a habit of building things rather than just reading about them.`,
    skills: [
      { name: 'HTML', level: 5 },
      { name: 'CSS', level: 5 },
      { name: 'JavaScript', level: 5 },
      { name: 'React.js', level: 4 },
      { name: 'Tailwind CSS', level: 5 },
      { name: 'Bootstrap', level: 5 },
      { name: 'Node.js', level: 4 },
      { name: 'Express.js', level: 4 },
      { name: 'MongoDB', level: 3 }
    ],
    timeline: [
      {
        year: '2025 – 2027',
        role: 'Master of Computer Applications (MCA)',
        org: 'Currently enrolled',
        desc: 'Deepening computer science fundamentals and advanced software engineering concepts alongside active full stack development.'
      },
      {
        year: '2024 – 2026',
        role: 'MERN Stack Training',
        org: 'Red & White Skill Education',
        desc: 'Hands-on industry training covering the full MERN stack — MongoDB, Express, React, and Node — with real project work.'
      },
      {
        year: '2021 – 2024',
        role: 'Bachelor of Arts (English)',
        org: 'Graduated',
        desc: 'Built strong foundations in communication, critical thinking, and self-directed learning — then pivoted fully into software development.'
      }
    ],
    resumeUrl: 'https://drive.google.com/file/d/1jzGAyXGA4L1uU-HYScIJeMnBmaSQlVS9/view?usp=sharing',
    socials: {
      github: 'https://github.com/bhushanpatil288',
      linkedin: 'https://www.linkedin.com/in/bhushan-patil-990530223/',
      twitter: 'https://x.com/Bhushan91938529',
      email: 'sharewithbhushan@gmail.com'
    },
    avatar: {
      url: 'https://res.cloudinary.com/dsyxsipwf/image/upload/v1779881508/profile_a3nwva.png',
      publicId: 'seed_avatar'
    }
  });

  console.log('Profile seeded successfully');
  await mongoose.disconnect();
}

seedProfile().catch((err) => {
  console.error('Error during profile seed:', err);
  process.exit(1);
});
