'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, ShieldCheck, FileSearch, Sparkles, MessageSquare, Info } from 'lucide-react';

interface TimelineStepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const TimelineStep = ({ number, icon, title, description, delay }: TimelineStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      className="relative pl-8 sm:pl-32 py-6 group"
    >
      {/* Node Bullet and Glow */}
      <div className="absolute left-0 sm:left-16 top-6 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 group-hover:text-primary group-hover:border-primary transition-all duration-500 shadow-lg">
        {icon}
        {/* Glow behind node */}
        <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10" />
      </div>

      {/* Step Number Badge */}
      <span className="hidden sm:flex absolute left-0 top-9 items-center justify-center text-xs font-black uppercase text-zinc-650 tracking-wider w-10">
        Step {number}
      </span>

      {/* Content Card */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 hover:border-zinc-850 hover:bg-zinc-900/20 p-5 sm:p-6 transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
        {/* Hover corner glow */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/3 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-primary">
              Step {number}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: <UploadCloud className="h-5 w-5 sm:h-5.5 sm:w-5.5" />,
      title: "1️⃣ Upload Book",
      description: "Users securely upload PDF books and fill in details such as title, author, category, language, and reading level.",
    },
    {
      number: 2,
      icon: <ShieldCheck className="h-5 w-5 sm:h-5.5 sm:w-5.5" />,
      title: "2️⃣ Admin Reviews",
      description: "Administrators review the submitted books in the dashboard to ensure text safety, copyright guidelines, and PDF formatting are correct.",
    },
    {
      number: 3,
      icon: <FileSearch className="h-5 w-5 sm:h-5.5 sm:w-5.5" />,
      title: "3️⃣ AI Reads the PDF",
      description: "Upon approval, the system parses the document contents. Google Gemini AI reads and indexes the text structure for semantics.",
    },
    {
      number: 4,
      icon: <Sparkles className="h-5 w-5 sm:h-5.5 sm:w-5.5" />,
      title: "4️⃣ AI Generates Summary",
      description: "Gemini automatically generates high-fidelity summaries, key takeaways, and lists core points for readers to digest instantly.",
    },
    {
      number: 5,
      icon: <MessageSquare className="h-5 w-5 sm:h-5.5 sm:w-5.5" />,
      title: "5️⃣ Readers Discover & Chat",
      description: "Users explore the library, read instant summaries, and launch the AI Chat to question the book directly for personalized learning.",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase text-primary tracking-widest">
            <Info className="h-3.5 w-3.5" />
            <span>Operational Flow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            How NovaLibrary Works
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Understand the step-by-step lifecycle of how books are ingested, parsed, and transformed into interactive learning companions.
          </p>
        </div>

        {/* Timeline Line Container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical central/left line */}
          <div className="absolute left-5 sm:left-[88px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-secondary to-zinc-900 pointer-events-none" />

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <TimelineStep
                key={step.number}
                number={step.number}
                icon={step.icon}
                title={step.title}
                description={step.description}
                delay={0.1 * idx}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
