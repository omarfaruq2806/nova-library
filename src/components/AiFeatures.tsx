'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, Compass, Tags, BookOpen, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  glowColor: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, glowColor, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      className="group relative rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-xl overflow-hidden cursor-pointer"
    >
      {/* Dynamic Glow Background Effect on Hover */}
      <div 
        className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}15, transparent 60%)`
        }}
      />
      <div 
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-solid pointer-events-none"
        style={{ borderColor: glowColor }}
      />

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Icon Wrapper */}
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white transition-all duration-300">
        <motion.div 
          className="relative z-10"
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>
        
        {/* Glow behind icon */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-all duration-300"
          style={{ backgroundColor: glowColor }}
        />
      </div>

      {/* Card Content */}
      <div className="mt-5 space-y-2 relative z-10">
        <h3 className="text-base font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 transition-all duration-300 flex items-center gap-2">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-medium transition-colors duration-300 group-hover:text-zinc-300">
          {description}
        </p>
      </div>

      {/* Accent corner light */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: glowColor }}
      />
    </motion.div>
  );
};

export default function AiFeatures() {
  const featuresList = [
    {
      icon: <Bot className="h-5.5 w-5.5" />,
      title: "🤖 AI Book Summary",
      description: "Get instant summaries of key concepts, core arguments, and major chapters right after uploading your book, powered by Google Gemini.",
      glowColor: "#a855f7", // Purple Accent
    },
    {
      icon: <MessageSquare className="h-5.5 w-5.5" />,
      title: "💬 Chat with Any Book",
      description: "Converse directly with your PDF documents. Ask questions, clarify complex terms, and extract insights in a natural chat layout.",
      glowColor: "#06b6d4", // Cyan Accent
    },
    {
      icon: <Compass className="h-5.5 w-5.5" />,
      title: "🎯 Smart Recommendation",
      description: "Receive tailormade suggestions for your next read based on your personalized reading patterns, preferences, and difficulty levels.",
      glowColor: "#f59e0b", // Amber Accent
    },
    {
      icon: <Tags className="h-5.5 w-5.5" />,
      title: "🏷️ AI Auto Tagging",
      description: "No manual sorting needed. The system automatically categorizes and tags books with relevant genres and topics upon ingestion.",
      glowColor: "#ec4899", // Pink Accent
    },
    {
      icon: <BookOpen className="h-5.5 w-5.5" />,
      title: "📚 Personalized Learning",
      description: "Adapt standard reading to your own pace. Generates definitions, flashcards, and reading difficulty guides specialized for you.",
      glowColor: "#10b981", // Emerald Accent
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      {/* Decorative ambient lights for section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[130px] pointer-events-none -z-10" />

      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-black uppercase text-primary tracking-widest"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Intelligent Reading</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
          >
            AI-Powered Reading Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the next generation of digital reading with state-of-the-art artificial intelligence tools designed to simplify discovery, digestion, and learning.
          </motion.p>
        </div>

        {/* Features Cards Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {featuresList.map((feature, idx) => {
            // If it is the last item (5th item) in a 3-column grid, we make it centered on large screens
            const isLast = idx === 4;
            return (
              <div 
                key={idx} 
                className={`${
                  isLast ? 'sm:col-span-2 lg:col-span-1 lg:col-start-2' : ''
                }`}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  glowColor={feature.glowColor}
                  delay={0.1 * (idx + 1)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
