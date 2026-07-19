'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Bot, UploadCloud, FileText, Sparkles, MessageSquare, ChevronLeft, ChevronRight, Compass, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Slide 1 Animation: Floating Books & Robot
const SlideOneVisual = () => {
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] flex items-center justify-center">
      {/* Moving Ambient Gradient Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-gradient-to-tr from-primary/20 via-secondary/15 to-transparent blur-[60px] -z-10"
      />

      {/* Floating AI Robot */}
      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative z-10 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-3xl bg-zinc-950/80 border border-zinc-900 shadow-2xl backdrop-blur-md"
      >
        <Bot className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
        {/* Glow behind bot */}
        <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-xl opacity-50 -z-10" />
      </motion.div>

      {/* Floating Book 1 */}
      <motion.div
        animate={{ 
          y: [10, -15, 10],
          rotate: [-10, 10, -10]
        }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.2 }}
        className="absolute top-12 left-12 sm:left-20 z-20 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-350 shadow-lg"
      >
        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
      </motion.div>

      {/* Floating Book 2 */}
      <motion.div
        animate={{ 
          y: [-12, 12, -12],
          rotate: [15, -5, 15]
        }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.6 }}
        className="absolute bottom-16 right-12 sm:right-20 z-20 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-350 shadow-lg"
      >
        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
      </motion.div>
    </div>
  );
};

// Slide 2 Animation: Ingestion Pipeline Flow Diagram
const SlideTwoVisual = () => {
  const steps = [
    { id: 1, label: "PDF Upload", icon: <UploadCloud className="h-4 w-4" /> },
    { id: 2, label: "AI Processing", icon: <Bot className="h-4 w-4" /> },
    { id: 3, label: "AI Summary", icon: <Sparkles className="h-4 w-4" /> },
    { id: 4, label: "Library Shelf", icon: <BookOpen className="h-4 w-4" /> }
  ];

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center h-full space-y-4 py-8">
      {/* Background Glow */}
      <div className="absolute w-[250px] h-[250px] rounded-full bg-secondary/5 blur-[50px] -z-10" />

      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          {/* Step Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 w-56 p-3 rounded-xl border border-zinc-900 bg-zinc-950/80 shadow-md relative z-10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-850 text-secondary">
              {step.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-550">Step 0{step.id}</p>
              <h4 className="text-xs font-bold text-white">{step.label}</h4>
            </div>
          </motion.div>

          {/* Connection arrow/indicator */}
          {idx < steps.length - 1 && (
            <div className="flex flex-col items-center">
              {/* Flow line animation */}
              <motion.div 
                animate={{ 
                  height: [12, 24, 12],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.3 }}
                className="w-0.5 h-6 bg-gradient-to-b from-primary to-secondary"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Slide 3 Animation: Fake AI Chat Loop Simulation
const SlideThreeVisual = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; items?: string[] }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let active = true;
    const runSimulation = async () => {
      while (active) {
        // Reset state
        setMessages([]);
        setIsTyping(false);
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (!active) break;

        // User message
        setMessages([{ sender: 'user', text: "Recommend React books." }]);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (!active) break;

        // AI Typing
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (!active) break;

        // AI message
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          { 
            sender: 'ai', 
            text: "Here are the top React/JS books on our shelf:", 
            items: ["Learning React", "Eloquent JavaScript", "You Don't Know JS"] 
          }
        ]);

        // Show for 6 seconds before loop restarts
        await new Promise((resolve) => setTimeout(resolve, 6000));
      }
    };

    runSimulation();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl border border-zinc-900 bg-zinc-950 p-4 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-[320px] text-xs">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-xl -z-10" />

      {/* Chat Header */}
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-2 shrink-0">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-extrabold text-[10px] text-zinc-400 uppercase tracking-widest">AI Librarian Assistant</span>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none flex flex-col">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              {/* Message Bubble */}
              <div 
                className={`p-3 rounded-2xl leading-relaxed font-semibold ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-zinc-900 text-zinc-200 rounded-bl-none border border-zinc-850'
                }`}
              >
                {msg.text}
              </div>

              {/* Bullet list for AI items */}
              {msg.items && (
                <div className="mt-2 pl-2 space-y-1.5 self-start">
                  {msg.items.map((item, idx) => (
                    <motion.div 
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="flex items-center gap-1.5 text-zinc-350 text-[11px]"
                    >
                      <span className="text-primary font-bold">✔️</span>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400 self-start rounded-bl-none"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-450 animate-bounce" />
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-450 animate-bounce [animation-delay:0.2s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-450 animate-bounce [animation-delay:0.4s]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Read Smarter with AI-Powered Library",
      description: "Discover thousands of books with AI-generated summaries, intelligent recommendations, and interactive book conversations.",
      ctaOne: { label: "Explore Books", href: "/books", icon: <BookOpen className="h-4 w-4" /> },
      ctaTwo: { label: "Try AI Assistant", href: "/chat", icon: <Bot className="h-4 w-4" /> },
      visual: <SlideOneVisual />
    },
    {
      title: "Upload Your Books and Let AI Do the Rest",
      description: "Upload PDF books, let AI generate summaries, extract key concepts, and organize your library automatically.",
      ctaOne: { label: "Upload Book", href: "/books/upload", icon: <UploadCloud className="h-4 w-4" /> },
      ctaTwo: { label: "Browse Library", href: "/books", icon: <FileText className="h-4 w-4" /> },
      visual: <SlideTwoVisual />
    },
    {
      title: "Chat with Books. Learn Without Limits.",
      description: "Ask questions about any uploaded book, receive AI-powered explanations, and discover your next favorite read.",
      ctaOne: { label: "Start AI Chat", href: "/chat", icon: <MessageSquare className="h-4 w-4" /> },
      ctaTwo: { label: "Get Recommendations", href: "/books", icon: <Target className="h-4 w-4" /> },
      visual: <SlideThreeVisual />
    }
  ];

  // Auto-play slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7500); // Shift every 7.5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col justify-center min-h-[calc(100vh-4rem)] z-10 overflow-hidden">
      
      {/* Side Slide Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center justify-start pointer-events-none z-20">
        <button 
          onClick={handlePrev}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-900 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-white pointer-events-auto transition-all cursor-pointer select-none active:scale-95 ml-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center justify-end pointer-events-none z-20">
        <button 
          onClick={handleNext}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-900 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-white pointer-events-auto transition-all cursor-pointer select-none active:scale-95 mr-2"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Active Slide Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full px-6 sm:px-12">
        
        {/* Left Side: Content info */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-black uppercase text-primary tracking-widest mx-auto lg:mx-0">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>NovaLibrary Core Ecosystem</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white max-w-2xl">
                {slides[currentSlide].title.split('AI-Powered').map((part, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI-Powered</span>}
                    {part}
                  </React.Fragment>
                ))}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {slides[currentSlide].description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center max-w-md">
                <Link
                  href={slides[currentSlide].ctaOne.href}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  {slides[currentSlide].ctaOne.icon}
                  <span>{slides[currentSlide].ctaOne.label}</span>
                </Link>

                <Link
                  href={slides[currentSlide].ctaTwo.href}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/60 px-6 py-3.5 text-xs sm:text-sm font-bold text-zinc-350 hover:text-white active:scale-95 transition-all"
                >
                  {slides[currentSlide].ctaTwo.icon}
                  <span>{slides[currentSlide].ctaTwo.label}</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Visual Animations */}
        <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              {slides[currentSlide].visual}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Indicator Dots */}
      <div className="flex justify-center items-center gap-2 pt-10 shrink-0">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === index ? 'w-6 bg-primary' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
