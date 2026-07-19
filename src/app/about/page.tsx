'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, UploadCloud, Settings, Star, Sparkles, MessageSquare, Shield, CheckCircle, Cpu, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  const capabilities = [
    { text: 'Explore a growing collection of digital books.', icon: <BookOpen className="h-4 w-4" /> },
    { text: 'Search books by title, author, category, or language.', icon: <Search className="h-4 w-4" /> },
    { text: 'Upload your own PDF books with cover images.', icon: <UploadCloud className="h-4 w-4" /> },
    { text: 'Manage your uploaded books in one place.', icon: <Settings className="h-4 w-4" /> },
    { text: 'Save your favorite books for quick access.', icon: <Star className="h-4 w-4" /> },
    { text: 'Discover books through AI-powered recommendations.', icon: <Sparkles className="h-4 w-4" /> },
    { text: 'Chat with AI to understand books more effectively.', icon: <MessageSquare className="h-4 w-4" /> },
    { text: 'Read AI summaries and key insights before starting.', icon: <CheckCircle className="h-4 w-4" /> },
  ];

  const aiFeatures = [
    { name: 'AI Book Summaries', desc: 'Instant high-fidelity overviews generated upon upload.' },
    { name: 'AI Document Understanding', desc: 'Direct parsing and learning takeaway extractions.' },
    { name: 'AI Smart Book Recommendations', desc: 'Matching library contents to readers\' tastes.' },
    { name: 'AI Book Chat Assistant', desc: 'Conversational agents connected directly to the PDF contents.' },
    { name: 'AI Auto Tag & Metadata Generation', desc: 'Automatic categorization and linguistic difficulty levels mapping.' },
  ];

  const techStack = {
    frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'TanStack Query'],
    backend: ['Express.js', 'MongoDB', 'Better Auth', 'Supabase Storage'],
    ai: ['LangChain', 'Google Gemini'],
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative py-12 sm:py-20 overflow-hidden">
      {/* Background Neon lighting circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-secondary/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16"
      >
        
        {/* Back Link */}
        <motion.div variants={itemVariants}>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-450 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Section 1: Header */}
        <motion.div variants={itemVariants} className="space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-black uppercase text-primary tracking-widest">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Our Profile</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            About NovaLibrary
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base font-semibold max-w-xl mx-auto">
            Welcome to a next-generation repository making knowledge acquisition and reading engagingly intelligent.
          </p>
        </motion.div>

        {/* Section 2: Welcome Intro */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 sm:p-8 backdrop-blur-sm space-y-4"
        >
          <h2 className="text-lg sm:text-xl font-black text-white">Welcome to NovaLibrary</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
            NovaLibrary is an AI-powered digital library designed to make reading, learning, and discovering knowledge more engaging and intelligent. Instead of simply storing books, NovaLibrary uses Artificial Intelligence to help readers understand content faster, explore new topics, and find books that match their interests.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
            Our goal is to combine the power of modern web technologies with AI to create a smarter reading experience for students, professionals, and lifelong learners.
          </p>
        </motion.div>

        {/* Section 3: Our Mission */}
        <motion.div 
          variants={itemVariants}
          className="relative rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 sm:p-8 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-secondary" />
          <div className="pl-4 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">Our Mission</h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-350 leading-relaxed font-semibold italic">
              "We believe that knowledge should be accessible, organized, and easy to understand. NovaLibrary helps readers save time by providing AI-generated insights while giving authors and contributors a simple platform to share valuable books with the community."
            </p>
          </div>
        </motion.div>

        {/* Section 4: What You Can Do Grid */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-white text-center">What You Can Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-secondary border border-zinc-850">
                  {item.icon}
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 5: AI Features List */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-white text-center">AI-Powered Features</h2>
          <div className="space-y-4">
            {aiFeatures.map((feat, idx) => (
              <div 
                key={idx}
                className="group flex flex-col sm:flex-row justify-between sm:items-center p-5 rounded-xl border border-zinc-900 bg-zinc-950/30 hover:bg-zinc-950/60 transition-colors gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-primary transition-colors">
                    {feat.name}
                  </h4>
                </div>
                <p className="text-xs text-zinc-450 font-medium sm:text-right">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 6: Quality & Moderation */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 sm:p-8 backdrop-blur-sm flex flex-col sm:flex-row gap-5 items-start"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-950/30 border border-purple-900/50 text-purple-400 shadow-inner">
            <Shield className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-white">Quality & Moderation</h2>
            <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed font-medium">
              To maintain a high-quality library, every uploaded book goes through an admin approval process before becoming publicly available. This helps ensure that the library remains organized, useful, and trustworthy for all users.
            </p>
          </div>
        </motion.div>

        {/* Section 7: Technologies Used */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-white text-center">Technologies Used</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Tech Box 1: Frontend */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider border-b border-zinc-900 pb-2">
                <Cpu className="h-4 w-4" />
                <span>Frontend</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techStack.frontend.map(tech => (
                  <span key={tech} className="text-[10px] sm:text-xs font-bold bg-zinc-900 text-zinc-350 px-2 py-1 rounded-md border border-zinc-850">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Box 2: Backend */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider border-b border-zinc-900 pb-2">
                <Settings className="h-4 w-4" />
                <span>Backend</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techStack.backend.map(tech => (
                  <span key={tech} className="text-[10px] sm:text-xs font-bold bg-zinc-900 text-zinc-350 px-2 py-1 rounded-md border border-zinc-850">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Box 3: Artificial Intelligence */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider border-b border-zinc-900 pb-2">
                <Sparkles className="h-4 w-4" />
                <span>AI Stack</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techStack.ai.map(tech => (
                  <span key={tech} className="text-[10px] sm:text-xs font-bold bg-zinc-900 text-zinc-350 px-2 py-1 rounded-md border border-zinc-850">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* Section 8: Our Vision */}
        <motion.div 
          variants={itemVariants}
          className="text-center space-y-6 pt-6 border-t border-zinc-900"
        >
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-black text-white">Our Vision</h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium max-w-xl mx-auto">
              Our vision is to build a modern AI-powered knowledge platform where readers can do more than simply read books. We want to create an ecosystem where AI helps users discover, understand, and learn from information in a smarter and more interactive way.
            </p>
          </div>
          <div className="text-sm font-black text-primary tracking-wide">
            Thank you for being a part of the NovaLibrary community. Happy Reading! 📚✨
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
