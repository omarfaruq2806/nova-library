'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, Download, Loader2, Sparkles, User, Calendar, Tag, Globe, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description?: string;
  fileUrl: string;
  coverUrl?: string;
  language: string;
  readingLevel: string;
  tags?: string[];
  uploadedBy: string;
  uploadedByName?: string;
  aiSummary?: string;
  createdAt: string;
  relatedBooks?: Book[];
}

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [showPreview, setShowPreview] = useState(false);

  // Fetch book details and related books
  const { data: book, isLoading, isError } = useQuery<Book>({
    queryKey: ['book', id],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch book details.');
      }
      return res.json();
    },
    enabled: !!id,
  });

  // Chat sandbox states
  interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
  }
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial greeting
  useEffect(() => {
    if (book) {
      setChatMessages([
        {
          sender: 'ai',
          text: `Hello! I am your AI Librarian for "${book.title}". I have read and analyzed its content. Feel free to ask me any questions or select one of the prompts below!`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [book]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const handleSendChat = async (text: string) => {
    if (!text.trim() || !book) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const chatHistory = chatMessages.slice(1).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books/${book._id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: text,
          history: chatHistory,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to communicate with Book AI.');
      }

      const data = await res.json();
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: data.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat companion error:', err);
      toast.error(err.message || 'Error fetching AI response.');
      const errMsg: ChatMessage = {
        sender: 'ai',
        text: 'Error: Failed to obtain a response. Please check that the server is online and key is set.',
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const suggestedPrompts = book ? [
    `What are the core concepts covered in "${book.title}"?`,
    `Summarize the main takeaways or core themes.`,
    `Who is the target audience for this book?`,
  ] : [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-zinc-400">Fetching book records...</p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-xl font-bold text-white">Failed to load book</h2>
        <p className="text-xs text-zinc-550 max-w-xs">
          The requested book details page could not be loaded. Please ensure the backend is running and database is connected.
        </p>
        <Link
          href="/books"
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-350 hover:text-white"
        >
          Return to Shelf
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8 relative">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl space-y-8 z-10 relative">
        {/* Back Link */}
        <button
          onClick={() => router.push('/books')}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Shelf</span>
        </button>

        {/* Layout Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cover */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-4 flex flex-col items-center gap-4"
          >
            <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden relative shadow-2xl shadow-black/50">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Abstract graphic cover placeholder */
                <div className="w-full h-full bg-gradient-to-tr from-primary/20 via-secondary/10 to-zinc-950 flex flex-col justify-between p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-850 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white leading-tight line-clamp-3">{book.title}</h3>
                    <p className="text-xs text-zinc-400">By {book.author}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Metadata & AI Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-8 space-y-6"
          >
            {/* Meta badges header */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary uppercase">
                  <Tag className="h-3 w-3" />
                  <span>{book.genre}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 border border-secondary/20 text-secondary uppercase">
                  <Globe className="h-3 w-3" />
                  <span>{book.language || 'English'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 border border-zinc-850 text-zinc-300 uppercase">
                  <GraduationCap className="h-3 w-3" />
                  <span>{book.readingLevel || 'Intermediate'}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {book.title}
              </h1>
              
              <p className="text-base text-zinc-400 italic">
                Written by <span className="font-semibold text-white not-italic">{book.author}</span>
              </p>
            </div>

            {/* Publishing details */}
            <div className="flex flex-wrap gap-4 text-xs text-zinc-550 font-medium pt-2 border-t border-zinc-900">
              <span className="flex items-center gap-1.5">
                <User className="h-4.5 w-4.5 text-zinc-650" />
                <span>Uploaded by: <strong className="text-zinc-350">{book.uploadedByName || 'User'}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-zinc-650" />
                <span>Published on: <strong className="text-zinc-350">{formatDate(book.createdAt)}</strong></span>
              </span>
            </div>

            {/* Tags rendering */}
            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium text-zinc-400 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description (Overview) */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-zinc-450 uppercase tracking-wider">Book Overview</h3>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/10 border border-zinc-900/50 rounded-xl p-4">
                {book.description || 'No description provided for this book.'}
              </p>
            </div>

            {/* AI Summary card */}
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6 space-y-3 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>AI Concept Summary</span>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed italic">
                "{book.aiSummary || 'No AI summary generated for this book.'}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Preview PDF</span>
              </button>

              <a
                href={book.fileUrl}
                download
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 px-6 py-3.5 text-sm font-semibold text-zinc-350 hover:text-white transition-all active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </a>
            </div>

            {/* Contextual AI Chat Panel */}
            <div className="rounded-2xl border border-zinc-850 bg-zinc-900/10 backdrop-blur-md p-6 space-y-4 mt-8 relative">
              <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Book Companion AI</h3>
                </div>
                <button
                  onClick={() => {
                    setChatMessages([
                      {
                        sender: 'ai',
                        text: `Welcome back! Ask me anything about "${book.title}".`,
                        timestamp: new Date(),
                      },
                    ]);
                  }}
                  className="text-[10px] text-zinc-550 hover:text-red-400 underline cursor-pointer"
                >
                  Reset Chat
                </button>
              </div>

              {/* Chat history display */}
              <div className="h-[280px] overflow-y-auto pr-2 space-y-3 custom-scrollbar flex flex-col">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border text-[10px] font-bold ${
                        msg.sender === 'user'
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          : 'bg-primary/10 border-primary/20 text-primary'
                      }`}
                    >
                      {msg.sender === 'user' ? 'U' : 'AI'}
                    </div>
                    <div
                      className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none'
                          : 'bg-zinc-900 border border-zinc-850 text-zinc-300 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-2 mr-auto max-w-[85%]">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary text-[10px] font-bold">
                      AI
                    </div>
                    <div className="rounded-2xl px-3 py-2 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-tl-none flex items-center gap-1.5 text-xs">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      <span>Reading book context...</span>
                    </div>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Suggestions */}
              {chatMessages.length === 1 && !isChatLoading && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Suggested Questions</p>
                  <div className="flex flex-col gap-1.5">
                    {suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendChat(prompt)}
                        className="text-left text-xs bg-zinc-950/50 hover:bg-zinc-900/50 border border-zinc-850 px-3 py-2 rounded-xl text-zinc-450 hover:text-white transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat(chatInput);
                }}
                className="flex items-center border border-zinc-800 bg-zinc-950/50 rounded-xl p-1 focus-within:border-primary/50 transition-colors"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                  placeholder={`Ask a question about "${book.title}"...`}
                  className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="h-8 px-4 flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>

          </motion.div>

        </div>

        {/* Lightbox / Modal PDF Preview */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-4">
            <div className="flex justify-between items-center pb-3 max-w-7xl mx-auto w-full">
              <h3 className="text-sm font-extrabold text-white truncate">{book.title} - PDF Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
            <div className="flex-1 w-full max-w-7xl mx-auto bg-zinc-950 rounded-2xl border border-zinc-900 overflow-hidden shadow-2xl">
              <iframe
                src={`${book.fileUrl}#toolbar=0`}
                className="w-full h-full border-none"
                title="PDF Reader"
              />
            </div>
          </div>
        )}

        {/* Related Books section - Category matching */}
        {book.relatedBooks && book.relatedBooks.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-zinc-900 mt-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Related Books ({book.genre})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {book.relatedBooks.map((relBook) => (
                <Link
                  key={relBook._id}
                  href={`/books/${relBook._id}`}
                  className="flex flex-col rounded-2xl border border-zinc-900 bg-zinc-900/10 hover:border-zinc-800 p-3 hover:-translate-y-1 transition-all h-[240px] justify-between cursor-pointer group"
                >
                  {/* Thumbnail Cover */}
                  <div className="h-28 w-full bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                    {relBook.coverUrl ? (
                      <img src={relBook.coverUrl} alt={relBook.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-primary/10 to-zinc-950 p-2 flex items-end">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider">{relBook.genre}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Related Metadata */}
                  <div className="mt-2 space-y-1 flex-1 flex flex-col justify-end">
                    <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                      {relBook.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">By {relBook.author}</p>
                    <span className="text-[8px] font-extrabold uppercase text-primary/85">{relBook.readingLevel}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
