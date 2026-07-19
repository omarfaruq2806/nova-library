'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Shield, Cpu, ArrowRight } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import AiFeatures from '../components/AiFeatures';
import DiscoverBooks from '../components/DiscoverBooks';
import ExploreCategories from '../components/ExploreCategories';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import LibraryStats from '../components/LibraryStats';
import FaqSection from '../components/FaqSection';
import FinalCta from '../components/FinalCta';

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: 'Digital Bookshelf',
      description: 'Host, download, and catalog PDF books with clean search and genre filters.',
    },
    {
      icon: <Cpu className="h-6 w-6 text-secondary" />,
      title: 'AI Smart Summary',
      description: 'Powered by Google Gemini to generate instant summaries of key concepts upon upload.',
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-400" />,
      title: 'Better Auth Integration',
      description: 'Secure session handling, role assignment, and single sign-on with Google OAuth.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] bg-zinc-950 text-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      {/* Hero Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center items-center text-center z-10 space-y-12">
        
        {/* Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary tracking-wide"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Digital Repository</span>
        </motion.div>

        {/* Title & Tagline */}
        <div className="space-y-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent"
          >
            Nova<span className="text-primary font-black">Library</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto"
          >
            Discover, upload, and interact with community books backed by automated AI text parsing and semantic intelligence.
          </motion.p>
        </div>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto"
        >
          <Link
            href="/books"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10"
          >
            <span>Browse Bookshelf</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {!session?.user && (
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white transition-all active:scale-95"
            >
              <span>Get Started</span>
            </Link>
          )}
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full pt-10 text-left"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 backdrop-blur-sm space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800">
                {feature.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                <p className="text-xs text-zinc-450 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* AI Features Section */}
      <AiFeatures />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Discover Books Section */}
      <DiscoverBooks />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Explore Categories Section */}
      <ExploreCategories />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Library Stats Section */}
      <LibraryStats />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* FAQ Section */}
      <FaqSection />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />

      {/* Final CTA Section */}
      <FinalCta />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />
    </div>
  );
}
