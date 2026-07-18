'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am Nova AI, powered by Gemini 3.5 Flash and LangChain. Feel free to ask me anything to test my responses!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Explain quantum computing in one simple sentence.',
    'Recommend some good fiction genres.',
    'Write a short poem about a digital library.',
  ];

  // Auto scroll to bottom on new messages
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/books/test-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response from AI.');
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
      toast.error(err.message || 'Something went wrong.');
      const errorMessage: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: 'Error: Failed to fetch response. Please verify that the backend server is running and GEMINI_API_KEY is configured.',
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
        text: 'Chat cleared. Ask me anything!',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-6 sm:px-6 lg:px-8 relative flex flex-col justify-between">
      {/* Background ambient glow */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-3xl w-full flex-1 flex flex-col space-y-4 z-10">
        
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">AI Sandbox</h1>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-zinc-450 hover:text-red-400 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-4 p-2 pr-4 custom-scrollbar">
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
                {/* Avatar */}
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-350'
                      : 'bg-primary/10 border-primary/20 text-primary'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-tr-none'
                      : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-300 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="block text-[9px] text-zinc-500 mt-2 text-right">
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
                <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-primary/10 border-primary/20 text-primary shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl p-4 bg-zinc-900/60 border border-zinc-800/80 text-zinc-300 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-zinc-400">Nova AI is thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Action / Suggestions bar if no custom messages yet */}
        {messages.length === 1 && !isLoading && (
          <div className="space-y-2 pt-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Suggestions</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="p-3 text-left text-xs bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center border border-zinc-800 bg-zinc-900/20 backdrop-blur-md rounded-2xl p-1.5 focus-within:border-primary/50 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your test message here..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
