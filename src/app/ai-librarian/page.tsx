'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, ArrowLeft, Loader2, BookOpen, Compass, Map } from 'lucide-react';
import { useSession } from '../../lib/auth-client';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// Custom parser component to render markdown lists, bold texts, and button links beautifully
const FormattedText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith('*') || trimmed.startsWith('-');
        const cleanLine = isBullet ? trimmed.substring(1).trim() : line;

        // Custom parser for markdown bold: **text** -> <strong>text</strong>
        // Custom parser for details link: [View Book Detail](url) -> custom button/link
        let htmlContent = cleanLine
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-white">$1</strong>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="inline-flex items-center gap-1 text-[11px] font-black uppercase text-primary border-b border-primary/45 hover:border-primary transition-all mt-1" target="_blank">$1</a>');

        if (isBullet) {
          return (
            <div key={idx} className="flex gap-2.5 items-start pl-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-sm shadow-primary/50" />
              <span dangerouslySetInnerHTML={{ __html: htmlContent }} className="text-zinc-300 text-xs sm:text-sm leading-relaxed" />
            </div>
          );
        }

        if (trimmed === '') {
          return <div key={idx} className="h-1.5" />;
        }

        return (
          <p
            key={idx}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className="text-zinc-300 text-xs sm:text-sm leading-relaxed"
          />
        );
      })}
    </div>
  );
};

export default function AiLibrarianPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isPending && !session) {
      toast.error('Authentication required. Redirecting to login.');
      router.push('/login');
    }
  }, [session, isPending, router]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your **Nova AI Librarian**. I can recommend books from our shelf, help design a structured **Learning Roadmap** for you, or search the library catalog directly. How can I guide your studies today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    {
      icon: <Compass className="h-4.5 w-4.5 text-primary" />,
      title: 'Book Recommendations',
      description: 'Find top books in our catalog.',
      prompt: 'Recommend some good books on Finance and Technology.',
    },
    {
      icon: <Map className="h-4.5 w-4.5 text-secondary" />,
      title: 'Learning Roadmaps',
      description: 'Get a custom path on any topic.',
      prompt: 'Create a learning roadmap to learn Science and Biology.',
    },
    {
      icon: <Sparkles className="h-4.5 w-4.5 text-purple-400" />,
      title: 'Q&A Assistant',
      description: 'Ask general educational questions.',
      prompt: 'What are the core differences between microeconomics and macroeconomics?',
    },
  ];

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.slice(1).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/ai/librarian-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Librarian failed to respond.');
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Librarian error:', err);
      toast.error(err.message || 'Something went wrong.');
      const errorMessage: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: 'Error: Failed to obtain response from AI Librarian. Please verify your backend server is online and has GEMINI_API_KEY set.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Librarian chatbot memory cleared. How can I help you find books or create roadmaps next?',
        timestamp: new Date(),
      },
    ]);
  };

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-zinc-400">Loading AI Librarian...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8 relative flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-4xl w-full flex-1 flex flex-col justify-between z-10 gap-6">
        
        {/* Top Header bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1">
                AI Librarian <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium">Concept Roadmaps & Recommendations</p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-zinc-450 hover:text-red-400 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>

        {/* Messages Content scrollable container */}
        <div className="flex-1 overflow-y-auto max-h-[55vh] space-y-5 p-2 pr-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar icon */}
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      : 'bg-primary/10 border-primary/20 text-primary'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </div>

                {/* Speech Bubble */}
                <div
                  className={`rounded-2xl p-4 shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none font-medium'
                      : 'bg-zinc-900/60 border border-zinc-800/80 rounded-tl-none'
                  }`}
                >
                  <FormattedText text={msg.text} />
                  <span className="block text-[9px] text-zinc-550 mt-2.5 text-right font-medium">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 mr-auto max-w-[85%]"
              >
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border bg-primary/10 border-primary/20 text-primary shadow-md">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="rounded-2xl p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-zinc-500 font-semibold">Nova AI Librarian is searching library database...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion cards for quick navigation if chat is empty */}
        {messages.length === 1 && !isLoading && (
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Start a Conversation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {samplePrompts.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(card.prompt)}
                  className="flex flex-col text-left p-4 bg-zinc-900/20 hover:bg-zinc-900/50 border border-zinc-850 hover:border-primary/30 rounded-2xl transition-all duration-200 group cursor-pointer"
                >
                  <div className="h-9 w-9 flex items-center justify-center bg-zinc-950 border border-zinc-850 rounded-xl mb-3 group-hover:border-primary/25 transition-colors">
                    {card.icon}
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors mb-1">{card.title}</h4>
                  <p className="text-[10px] text-zinc-500 leading-normal">{card.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center border border-zinc-800 bg-zinc-900/10 backdrop-blur-md rounded-2xl p-2 focus-within:border-primary/50 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask AI Librarian for catalog searches, recommendations or study roadmaps..."
            className="flex-1 bg-transparent px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-550 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-10 px-5 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
