'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, ArrowLeft, MessageSquare, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    // Reset success banner after 4 seconds
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative py-12 sm:py-20 overflow-hidden">
      {/* Background neon ambient lights */}
      <div className="absolute top-10 left-1/3 w-[450px] h-[450px] bg-primary/3 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/3 w-[450px] h-[450px] bg-secondary/3 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
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

        {/* Section Header */}
        <motion.div variants={itemVariants} className="space-y-4 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3.5 py-1.5 text-xs font-black uppercase text-secondary tracking-widest">
            <MessageSquare className="h-3.5 w-3.5 animate-pulse" />
            <span>Get in touch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none">
            Contact Us
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
            Have questions, feedback, or want to collaborate? Shoot us a message and our team will get back to you shortly.
          </p>
        </motion.div>

        {/* Main Grid: Form & Info Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Form Panel (8 cols on lg) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 sm:p-10 backdrop-blur-sm space-y-6 shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-secondary/30 pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-3.5 text-xs sm:text-sm text-white placeholder-zinc-700 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-3.5 text-xs sm:text-sm text-white placeholder-zinc-700 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-3.5 text-xs sm:text-sm text-white placeholder-zinc-700 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-3.5 text-xs sm:text-sm text-white placeholder-zinc-700 focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Form Success Banner */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 rounded-xl border border-green-950 bg-green-950/20 text-green-400 text-xs sm:text-sm font-bold flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span>Message sent successfully! We will get back to you soon.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3.5 text-xs sm:text-sm font-black text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10 disabled:opacity-50 cursor-pointer"
              >
                <Send className={`h-4 w-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </motion.div>

          {/* Right Column: Info Cards (4 cols on lg) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 space-y-6"
          >
            {/* Address Details Card */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-sm space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-xl -z-10" />

              <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-900 pb-2.5">
                Support Details
              </h3>

              <div className="space-y-4 text-xs font-bold text-zinc-400">
                {/* Email Address */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-850 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-550 font-black uppercase tracking-wider">Email Us</p>
                    <Link href="mailto:support@novalibrary.com" className="hover:text-primary transition-colors text-[11px] sm:text-xs">
                      support@novalibrary.com
                    </Link>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-850 text-secondary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-550 font-black uppercase tracking-wider">Location</p>
                    <p className="text-[11px] sm:text-xs text-white">Global Digital Shelf</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials Connection Card */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-sm space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-secondary/5 blur-xl -z-10" />

              <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-900 pb-2.5">
                Connect Directly
              </h3>

              <div className="space-y-3">
                {/* LinkedIn Link */}
                <Link
                  href="https://www.linkedin.com/in/omarfaruk28/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 hover:border-primary bg-zinc-900/20 hover:bg-zinc-900/40 text-xs sm:text-sm font-bold text-zinc-350 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span>LinkedIn Profile</span>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 text-zinc-650 group-hover:text-primary transition-colors" />
                </Link>

                {/* GitHub/Portfolio Link */}
                <Link
                  href="https://github.com/omarfaruq2806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 hover:border-secondary bg-zinc-900/20 hover:bg-zinc-900/40 text-xs sm:text-sm font-bold text-zinc-350 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-zinc-400 group-hover:text-secondary transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <span>Developer Portfolio</span>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 text-zinc-650 group-hover:text-secondary transition-colors" />
                </Link>
              </div>
            </div>

          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
