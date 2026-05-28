import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Anant Shah',
      role: 'Mentor & Technical Instructor',
      message: "Bhushan has been my student for the past 1 year, and I've consistently been impressed by his dedication to learning. He approaches every topic with curiosity and persistence, never hesitating to dive deep or ask thoughtful questions. His growth in full-stack development has been steady and commendable. With his positive attitude and willingness to improve, I'm confident he'll become a strong and capable developer.",
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Keyur Gohil',
      role: 'Secondary Mentor & Software Engineer',
      message: "Bhushan was under my mentorship during the second half of his studies, and I was consistently impressed by his dedication to learning. He approached every topic with deep curiosity and persistence, never hesitating to ask thoughtful questions. His rapid growth in full-stack development was highly commendable. With his positive attitude and constant drive to improve, I'm confident he has the skills to become an exceptional developer.",
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  return (
    <section className="py-16 border-b border-slate-100 dark:border-slate-800">
      <div className="mb-10 text-center md:text-left">
        <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Endorsements</span>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">What Mentors Say</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
          Feedback and recommendations from professionals who have guided me in my development journey.
        </p>
        <div className="w-12 h-1 gradient-line rounded-full mt-3 mx-auto md:mx-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            {/* Quote Icon Accent */}
            <Quote className="absolute right-6 top-6 w-16 h-16 text-blue-600/5 dark:text-blue-400/5 pointer-events-none" />

            <p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed relative z-10 text-sm md:text-base">
              "{t.message}"
            </p>

            <div className="flex items-center gap-4 border-t border-slate-50 dark:border-slate-800/50 pt-4 mt-auto">
              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20 shadow-sm"
                loading="lazy"
              />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
