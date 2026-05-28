import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';
import { genAI, isGeminiConfigured } from '../config/gemini.js';
import asyncWrapper from '../middleware/asyncWrapper.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Handles chat requests from recruiters and visitors.
 * Grounded in Bhushan's database records.
 */
export const chatWithAI = asyncWrapper(async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    throw new ApiError(400, 'Message is required');
  }

  // Fetch live context from database
  const profile = await Profile.findOne();
  const projects = await Project.find().limit(5);
  const blogs = await BlogPost.find({ published: true }).limit(5);

  const profileContext = profile ? {
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    shortBio: profile.shortBio,
    skills: profile.skills.map(s => `${s.name} (Level ${s.level}/5)`).join(', '),
    timeline: profile.timeline.map(t => `${t.year}: ${t.role} at ${t.org} - ${t.desc}`).join('\n'),
    resumeUrl: profile.resumeUrl,
    socials: profile.socials
  } : null;

  const projectsContext = projects.map(p => ({
    title: p.title,
    techStack: p.techStack.join(', '),
    shortDesc: p.shortDesc,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl
  }));

  const blogsContext = blogs.map(b => ({
    title: b.title,
    excerpt: b.excerpt
  }));

  // If Gemini is configured and package is loaded, call Gemini API
  if (isGeminiConfigured && genAI) {
    try {
      const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
      const model = genAI.getGenerativeModel({ model: modelName });

      // Construct system instruction
      const systemInstruction = `You are the virtual AI assistant for Bhushan Ghansham Patil's portfolio website.
Your role is to answer questions from recruiters and visitors about Bhushan's skills, projects, education, and career.
Keep your answers professional, concise (2-4 sentences), and accurate.

Official Database Information for Bhushan Ghansham Patil:
- Name: ${profileContext?.name || 'Bhushan Ghansham Patil'}
- Title: ${profileContext?.title || 'Full Stack Developer'}
- Bio: ${profileContext?.bio || ''}
- Skills: ${profileContext?.skills || 'HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB, Tailwind CSS'}
- Journey & Timeline:
${profileContext?.timeline || ''}
- Socials: GitHub (${profileContext?.socials?.github}), LinkedIn (${profileContext?.socials?.linkedin}), Twitter (${profileContext?.socials?.twitter}), Email (${profileContext?.socials?.email})
- Resume Link: ${profileContext?.resumeUrl || ''}

Projects Built:
${projectsContext.map(p => `- ${p.title} (${p.techStack}): ${p.shortDesc}. Live: ${p.liveUrl}, Repo: ${p.githubUrl}`).join('\n')}

Blog Posts Written:
${blogsContext.map(b => `- ${b.title}: ${b.excerpt}`).join('\n')}

Guidelines:
1. Ground your answers strictly in the details provided.
2. Be proud of Bhushan's background: he has a BA in English, showcasing strong communication and self-driven learning skills, and is currently pursuing his MCA (Master of Computer Applications, 2025-2027) at Red & White Skill Education.
3. If asked about something not in the list, politely tell the recruiter you don't have that detail and suggest they email Bhushan directly at ${profileContext?.socials?.email || 'sharewithbhushan@gmail.com'}.
4. If asked to download or view the resume, highlight the resume link: ${profileContext?.resumeUrl}.
5. Do not make up facts or project details.`;

      const prompt = `${systemInstruction}\n\nUser Question: ${message}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const replyText = response.text();

      return res.status(200).json({
        success: true,
        reply: replyText,
        source: 'gemini-api'
      });
    } catch (apiError) {
      console.error('Gemini API Error, falling back to mock:', apiError);
      // Fall through to mock logic on failure
    }
  }

  // --- Mock Chatbot Logic (Offline / Free Fallback) ---
  const lowerMsg = message.toLowerCase();
  let reply = '';

  const name = profileContext?.name || 'Bhushan Ghansham Patil';
  const email = profileContext?.socials?.email || 'sharewithbhushan@gmail.com';
  const resume = profileContext?.resumeUrl || '#';
  const github = profileContext?.socials?.github || 'https://github.com';
  const linkedin = profileContext?.socials?.linkedin || 'https://linkedin.com';

  if (lowerMsg.includes('skill') || lowerMsg.includes('tech') || lowerMsg.includes('know') || lowerMsg.includes('language') || lowerMsg.includes('stack')) {
    reply = `Bhushan is a skilled Full Stack Developer. His core technical stack includes ${profileContext?.skills || 'HTML, CSS, JavaScript, React.js, Tailwind CSS, Node.js, Express.js, and MongoDB'}. He excels at building responsive UIs and robust REST APIs.`;
  } else if (lowerMsg.includes('project') || lowerMsg.includes('build') || lowerMsg.includes('work') || lowerMsg.includes('portfolio') || lowerMsg.includes('create')) {
    if (projectsContext.length > 0) {
      const projList = projectsContext.map(p => `"${p.title}" (built using ${p.techStack})`).join(', ');
      reply = `Bhushan has built several impressive projects including: ${projList}. You can view the full details and live links in the Projects section of this website!`;
    } else {
      reply = `Bhushan has worked on multiple projects involving the MERN stack. Check out the Projects section of the website to explore them with screenshots and code repositories!`;
    }
  } else if (lowerMsg.includes('resume') || lowerMsg.includes('cv') || lowerMsg.includes('download') || lowerMsg.includes('hiring') || lowerMsg.includes('hire')) {
    reply = `You can view and download Bhushan's official resume by clicking here: [Bhushan's Resume](${resume}). Feel free to reach out to him directly at ${email} for job inquiries!`;
  } else if (lowerMsg.includes('education') || lowerMsg.includes('mca') || lowerMsg.includes('college') || lowerMsg.includes('degree') || lowerMsg.includes('study') || lowerMsg.includes('ba') || lowerMsg.includes('english')) {
    reply = `Bhushan holds a Bachelor of Arts (BA) in English, which gives him excellent critical thinking and communication skills. Pivoting into computer science, he is currently pursuing his MCA (2025–2027) and MERN stack training at Red & White Skill Education.`;
  } else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('social') || lowerMsg.includes('github') || lowerMsg.includes('linkedin')) {
    reply = `You can contact Bhushan via email at ${email}. You can also connect with him on [LinkedIn](${linkedin}) or check out his active code repositories on [GitHub](${github}).`;
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey') || lowerMsg.includes('welcome')) {
    reply = `Hello! I am Bhushan's virtual AI assistant. Ask me anything about his projects, technical skills, MCA journey, or how to get in touch with him!`;
  } else {
    reply = `Thanks for asking! Bhushan is a MERN Stack developer currently pursuing his MCA (2025-2027). He specializes in clean interfaces and backend integrations. Please email him at ${email} to discuss details, or ask me about his 'skills', 'projects', 'education', or 'resume'!`;
  }

  return res.status(200).json({
    success: true,
    reply: reply,
    source: 'mock-local'
  });
});
