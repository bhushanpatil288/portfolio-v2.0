import React, { useState } from 'react';
import api from '../api/axios.js';
import { Button } from './ui/Button.jsx';
import { Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/contact', formData);
      if (data.success) {
        toast.success(data.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(true);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl p-8 text-center max-w-lg mx-auto shadow-sm animate-in fade-in duration-300">
        <CheckCircle2 size={48} className="mx-auto text-blue-600 dark:text-blue-400 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Thank you for reaching out. I have received your message and will get back to you shortly.
        </p>
        <Button variant="secondary" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm w-full max-w-xl mx-auto hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          placeholder="Project Collaboration"
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Hi, I'd like to talk about..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gap-2 py-3"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
        <Send size={16} />
      </Button>
    </form>
  );
};
export default ContactForm;
