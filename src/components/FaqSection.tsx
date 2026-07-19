'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const AccordionItem = ({ item, isOpen, onToggle, index }: AccordionItemProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="rounded-2xl border border-zinc-900 bg-zinc-950/30 overflow-hidden transition-all duration-300 hover:border-zinc-800"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left text-white hover:text-primary transition-colors cursor-pointer"
      >
        <span className="text-sm sm:text-base font-bold pr-4">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-zinc-900/50 text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FaqItem[] = [
    {
      question: "How does AI Summary work?",
      answer: "When a book is uploaded and approved, NovaLibrary uses Google Gemini AI to analyze the PDF. It extracts the core themes and generates a concise, high-fidelity 3-sentence summary along with key learning takeaways automatically."
    },
    {
      question: "Can I upload books?",
      answer: "Yes! Any registered user can upload PDF books. You will just need to provide metadata such as the title, author, genre, language, and reading level along with the document."
    },
    {
      question: "Who approves books?",
      answer: "To maintain a high-quality, safe, and organized collection, library administrators review and approve all uploaded books. You can track your uploads' status on the Manage Books page."
    },
    {
      question: "Can AI answer from the uploaded PDF?",
      answer: "Absolutely! Through our interactive AI Chat or AI Librarian pages, Gemini reads the parsed PDF text directly and answers your questions by referencing details from within the book."
    },
    {
      question: "Is my uploaded book secure?",
      answer: "Yes, security is a priority. All PDF files and covers are stored in secure cloud storage buckets (Supabase Storage). Your books are only accessed to generate summaries and chat outputs inside the private platform context."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      {/* Background glow ambient */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="space-y-12 max-w-3xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-black uppercase text-primary tracking-widest">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Find answers to common queries about our AI processing, file storage, security, and book catalog workflows.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, idx) => (
            <AccordionItem
              key={idx}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() => handleToggle(idx)}
              index={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
