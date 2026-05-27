import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../../api/profile.js';
import { uploadImage, deleteImage } from '../../api/upload.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Upload, Trash2, Plus, Sparkles, UserRound, Award, Calendar, Link as LinkIcon, X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export const AboutAdmin = () => {
  const queryClient = useQueryClient();
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    shortBio: '',
    bio: '',
    resumeUrl: '',
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      email: ''
    }
  });

  const [avatar, setAvatar] = useState(null);
  const [skills, setSkills] = useState([]);
  const [timeline, setTimeline] = useState([]);

  const [currentlyLearning, setCurrentlyLearning] = useState([]);

  const [newSkill, setNewSkill] = useState({ name: '', level: 3 });
  const [newTimeline, setNewTimeline] = useState({ year: '', role: '', org: '', desc: '' });
  const [newLearning, setNewLearning] = useState({ title: '', description: '' });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profileData?.profile) {
      const p = profileData.profile;
      setFormData({
        name: p.name || '',
        title: p.title || '',
        shortBio: p.shortBio || '',
        bio: p.bio || '',
        resumeUrl: p.resumeUrl || '',
        socials: {
          github: p.socials?.github || '',
          linkedin: p.socials?.linkedin || '',
          twitter: p.socials?.twitter || '',
          email: p.socials?.email || ''
        }
      });
      setAvatar(p.avatar || null);
      setSkills(p.skills || []);
      setTimeline(p.timeline || []);
      setCurrentlyLearning(p.currentlyLearning || []);
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socials.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socials: { ...prev.socials, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      if (avatar?.publicId) {
        try { await deleteImage(avatar.publicId); } catch (err) {}
      }

      const res = await uploadImage(file);
      if (res.success) {
        setAvatar({
          publicId: res.image.publicId,
          url: res.image.url
        });
        toast.success('Profile avatar uploaded successfully');
      }
    } catch (err) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (avatar?.publicId) {
      try {
        await deleteImage(avatar.publicId);
      } catch (err) {}
    }
    setAvatar(null);
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills(prev => [...prev, { ...newSkill, name: newSkill.name.trim() }]);
    setNewSkill({ name: '', level: 3 });
  };

  const handleRemoveSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTimeline = () => {
    if (!newTimeline.year.trim() || !newTimeline.role.trim() || !newTimeline.org.trim()) {
      toast.error('Please fill in Year, Role, and Organization fields');
      return;
    }
    setTimeline(prev => [...prev, { ...newTimeline }]);
    setNewTimeline({ year: '', role: '', org: '', desc: '' });
  };

  const handleRemoveTimeline = (index) => {
    setTimeline(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddLearning = () => {
    if (!newLearning.title.trim() || !newLearning.description.trim()) {
      toast.error('Please fill in both Topic and Description fields');
      return;
    }
    setCurrentlyLearning(prev => [...prev, { ...newLearning }]);
    setNewLearning({ title: '', description: '' });
  };

  const handleRemoveLearning = (index) => {
    setCurrentlyLearning(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const profileData = {
      ...formData,
      avatar,
      skills,
      timeline,
      currentlyLearning
    };

    try {
      await updateProfile(profileData);
      toast.success('Developer profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (err) {
      toast.error('Failed to update developer profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-Outfit">Edit Profile & CV</h1>
          <p className="text-slate-500 text-sm">Update your public biography, social linkages, experience timeline, and core skills.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-Outfit border-b pb-2 flex items-center gap-2">
            <UserRound size={18} className="text-blue-600" />
            General Bio Information
          </h3>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <span className="block text-sm font-semibold text-slate-700 mb-2">Avatar Picture</span>
              {avatar ? (
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-slate-200 group">
                  <img src={avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-36 h-36 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-full cursor-pointer bg-slate-50 hover:bg-blue-50/5 transition-all">
                  {isUploadingAvatar ? (
                    <Spinner size="sm" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <Upload size={20} className="mb-1" />
                      <span className="text-[10px] font-semibold">Upload Photo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={isUploadingAvatar} />
                </label>
              )}
            </div>

            <div className="flex-grow w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="shortBio" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Short Tagline Summary
                </label>
                <input
                  type="text"
                  id="shortBio"
                  name="shortBio"
                  required
                  value={formData.shortBio}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="resumeUrl" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Resume/CV URL
              </label>
              <input
                type="url"
                id="resumeUrl"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="socials.email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                id="socials.email"
                name="socials.email"
                value={formData.socials.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between items-center">
              Detailed Narrative Biography (Supports Markdown)
              <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                <Sparkles size={14} />
                Markdown
              </span>
            </label>
            <textarea
              id="bio"
              name="bio"
              required
              rows={8}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-Outfit border-b pb-2 flex items-center gap-2">
            <LinkIcon size={18} className="text-blue-600" />
            Social Profiles Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label htmlFor="socials.github" className="block text-sm font-semibold text-slate-700 mb-1.5">
                GitHub Profile
              </label>
              <input
                type="url"
                id="socials.github"
                name="socials.github"
                value={formData.socials.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="socials.linkedin" className="block text-sm font-semibold text-slate-700 mb-1.5">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="socials.linkedin"
                name="socials.linkedin"
                value={formData.socials.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="socials.twitter" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Twitter Profile
              </label>
              <input
                type="url"
                id="socials.twitter"
                name="socials.twitter"
                value={formData.socials.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-Outfit border-b pb-2 flex items-center gap-2">
            <Award size={18} className="text-blue-600" />
            Core Skills Grid
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Skill Name</label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Node.js"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Proficiency Level (1-5)</label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
              >
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <option key={lvl} value={lvl}>Level {lvl}/5</option>
                ))}
              </select>
            </div>
            <Button type="button" variant="secondary" onClick={handleAddSkill} className="w-full gap-1.5 py-2">
              <Plus size={16} />
              Add Skill
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            {skills.length === 0 ? (
              <p className="text-slate-400 text-xs italic">No skills listed yet.</p>
            ) : (
              skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <span>{skill.name}</span>
                  <span className="bg-blue-600 text-white rounded-full px-1.5 py-0.5 text-[9px]">L{skill.level}</span>
                  <button type="button" onClick={() => handleRemoveSkill(index)} className="text-slate-400 hover:text-red-600 font-bold ml-1">
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-Outfit border-b pb-2 flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            Professional Journey Timeline
          </h3>

          <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Year Range</label>
                <input
                  type="text"
                  value={newTimeline.year}
                  onChange={(e) => setNewTimeline(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="e.g. 2024 - Present"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Role/Title</label>
                <input
                  type="text"
                  value={newTimeline.role}
                  onChange={(e) => setNewTimeline(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g. Tech Lead"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organization/Company</label>
                <input
                  type="text"
                  value={newTimeline.org}
                  onChange={(e) => setNewTimeline(prev => ({ ...prev, org: e.target.value }))}
                  placeholder="e.g. Google DeepMind"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Description</label>
              <textarea
                value={newTimeline.desc}
                onChange={(e) => setNewTimeline(prev => ({ ...prev, desc: e.target.value }))}
                placeholder="Explain key achievements or details of this position..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
              />
            </div>
            <Button type="button" variant="secondary" onClick={handleAddTimeline} className="w-full gap-1.5 py-2">
              <Plus size={16} />
              Add Timeline Event
            </Button>
          </div>

          <div className="space-y-4">
            {timeline.length === 0 ? (
              <p className="text-slate-400 text-xs italic">No timeline entries added.</p>
            ) : (
              timeline.map((item, index) => (
                <div key={index} className="flex justify-between items-start bg-slate-50/30 p-4 rounded-lg border border-slate-100 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {item.year}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">{item.role}</h4>
                      <span className="text-xs text-slate-400">@ {item.org}</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveTimeline(index)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-Outfit border-b pb-2 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" />
            Currently Learning Topics
          </h3>

          <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Topic Title</label>
                <input
                  type="text"
                  value={newLearning.title}
                  onChange={(e) => setNewLearning(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. OS-Level & WebSockets"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Description</label>
                <input
                  type="text"
                  value={newLearning.description}
                  onChange={(e) => setNewLearning(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what you're exploring..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
                />
              </div>
            </div>
            <Button type="button" variant="secondary" onClick={handleAddLearning} className="w-full gap-1.5 py-2">
              <Plus size={16} />
              Add Learning Topic
            </Button>
          </div>

          <div className="space-y-3">
            {currentlyLearning.length === 0 ? (
              <p className="text-slate-400 text-xs italic">No learning topics added yet.</p>
            ) : (
              currentlyLearning.map((item, index) => (
                <div key={index} className="flex justify-between items-start bg-slate-50/30 p-4 rounded-lg border border-slate-100 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveLearning(index)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="px-8 py-3">
            {isSubmitting ? 'Saving Profile...' : 'Save Profile Details'}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AboutAdmin;
