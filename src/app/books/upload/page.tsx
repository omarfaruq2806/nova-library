'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, Book, FileText, Image as ImageIcon, Loader2, ArrowLeft, Info, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../../lib/auth-client';

const bookUploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Please select a category'),
  language: z.string().min(1, 'Language is required'),
  readingLevel: z.string().min(1, 'Reading level is required'),
  tags: z.string().optional(),
  description: z.string().optional(),
});
const CATEGORIES = ['All', 'Finance', 'Fiction', 'Science', 'Biography', 'Technology', 'History'];
const LANGUAGES = ['All', 'English', 'Bangla', 'Spanish', 'French', 'German'];
const READING_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

type BookUploadFormValues = z.infer<typeof bookUploadSchema>;

export default function BookUploadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending } = useSession();

  React.useEffect(() => {
    if (!isPending && !session) {
      toast.error('Authentication required. Redirecting to login.');
      router.push('/login');
    }
  }, [session, isPending, router]);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState('');
  const [coverName, setCoverName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookUploadFormValues>({
    resolver: zodResolver(bookUploadSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      language: 'English',
      readingLevel: 'Intermediate',
      tags: '',
      description: '',
    },
  });

  // TanStack Query Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Crucial: send Better Auth session cookies
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong during book upload.');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Book uploaded and AI Summary generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      router.push('/');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload book.');
    },
  });

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF documents are allowed.');
        return;
      }
      setPdfFile(file);
      setPdfName(file.name);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed for the cover.');
        return;
      }
      setCoverFile(file);
      setCoverName(file.name);
    }
  };

  const onSubmit = (values: BookUploadFormValues) => {
    if (!pdfFile) {
      toast.error('Please select a PDF document file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('author', values.author);
    formData.append('genre', values.genre);
    formData.append('description', values.description || '');
    formData.append('language', values.language);
    formData.append('readingLevel', values.readingLevel);
    formData.append('tags', values.tags || '');
    formData.append('pdf', pdfFile);
    if (coverFile) {
      formData.append('cover', coverFile);
    }

    uploadMutation.mutate(formData);
  };

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-zinc-400">Verifying session...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Avoid flashing content before redirect
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8 relative">
      {/* Background ambient glow */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-2xl space-y-6">

        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Shelf</span>
        </button>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Upload Book <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </h1>
          <p className="text-sm text-zinc-400">
            Publish a PDF book to the library catalog. We will automatically extract metadata and parse content.
          </p>
        </div>

        {/* Card Form container */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Book Title</label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Rich Dad Poor Dad"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.title.message}</p>
                )}
              </div>

              {/* Author Field */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Author Name</label>
                <input
                  type="text"
                  {...register('author')}
                  placeholder="e.g. Robert Kiyosaki"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                />
                {errors.author && (
                  <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.author.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Genre / Category Select */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  {...register('genre')}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.genre && <p className="mt-1.5 text-xs text-red-400 font-semibold">{errors.genre.message}</p>}
              </div>

              {/* Language Select */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Language</label>
                <select
                  {...register('language')}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                >
                  {LANGUAGES.filter(l => l !== 'All').map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Reading Level Select */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Reading Level</label>
                <select
                  {...register('readingLevel')}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                >
                  {READING_LEVELS.filter(r => r !== 'All').map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                rows={3}
                {...register('description')}
                placeholder="A brief overview of the book's contents, concepts..."
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* PDF Document Upload (Required Drag & Drop) */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">PDF Document File</label>
              <div className="relative border-2 border-dashed border-zinc-800 hover:border-primary/40 rounded-2xl bg-zinc-950/50 transition-colors">
                <input
                  type="file"
                  id="pdf-upload"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-primary mb-1">
                    <Upload className="h-5 w-5" />
                  </div>
                  {pdfName ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white truncate max-w-md px-4">{pdfName}</p>
                      <p className="text-xs text-zinc-500">{(pdfFile!.size / (1024 * 1024)).toFixed(2)} MB • PDF file selected</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-zinc-300">Drag & drop your PDF file here</p>
                      <p className="text-xs text-zinc-500">or click to browse local files (max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="flex gap-2.5 items-start bg-primary/5 border border-primary/20 rounded-xl p-3.5 text-xs text-primary/80">
              <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                By uploading, our server will extract full PDF text and use Google Gemini to automatically generate a summary of key concepts for other readers.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploadMutation.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white hover:opacity-90 active:scale-98 transition-all disabled:opacity-50"
            >
              {uploadMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing & Uploading Book...</span>
                </div>
              ) : (
                <span>Publish Book</span>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
