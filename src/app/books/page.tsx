'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Trash2, BookOpen, ExternalLink, RefreshCw, AlertCircle, Sparkles, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '../../lib/auth-client';

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
}

interface FetchBooksResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

const CATEGORIES = ['All', 'Finance', 'Fiction', 'Science', 'Biography', 'Technology', 'History'];
const LANGUAGES = ['All', 'English', 'Bangla', 'Spanish', 'French', 'German'];
const READING_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function BooksPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // Filters & State
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');
  const [readingLevel, setReadingLevel] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Fetch paginated books with TanStack Query
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<FetchBooksResponse>({
    queryKey: ['books', page, search, genre, language, readingLevel, sort],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '8');
      if (search.trim() !== '') params.append('search', search);
      if (genre !== 'All') params.append('genre', genre);
      if (language !== 'All') params.append('language', language);
      if (readingLevel !== 'All') params.append('readingLevel', readingLevel);
      if (sort) params.append('sort', sort);

      const res = await fetch(`${apiUrl}/books?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to retrieve book catalog.');
      }
      return res.json();
    },
  });

  const { books = [], totalPages = 1 } = data || {};

  // Delete Book Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete book.');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Book and files deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete book.');
    },
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Are you sure you want to delete this book? This will also remove the files from storage.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'genre') setGenre(value);
    if (filterType === 'language') setLanguage(value);
    if (filterType === 'readingLevel') setReadingLevel(value);
    setPage(1); // Reset to page 1 on filter changes
  };

  // Pulse skeleton card matching styling
  const SkeletonCard = () => (
    <div className="flex flex-col rounded-2xl border border-zinc-900 bg-zinc-900/30 overflow-hidden animate-pulse h-[440px] justify-between p-4">
      <div className="h-40 w-full bg-zinc-800/40 rounded-xl" />
      <div className="space-y-3 mt-4 flex-1">
        <div className="flex justify-between items-center">
          <div className="h-4 w-16 bg-zinc-800/40 rounded" />
          <div className="h-4 w-20 bg-zinc-800/40 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-zinc-800/40 rounded" />
        <div className="h-4 w-1/2 bg-zinc-800/40 rounded" />
        <div className="h-10 w-full bg-zinc-800/30 rounded mt-3" />
      </div>
      <div className="h-10 w-full bg-zinc-800/40 rounded-xl mt-4" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl space-y-8 z-10 relative">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Library Shelf
            </h1>
            <p className="text-sm text-zinc-400">
              Discover and explore books. Search, filter, and access summaries instantly.
            </p>
          </div>

          {session?.user && (
            <Link
              href="/books/upload"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Link>
          )}
        </div>

        {/* Filters Controls Panel */}
        <div className="space-y-4 bg-zinc-900/10 border border-zinc-900 rounded-2xl p-5 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Box */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search title, author, description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-850 pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {/* Sorting Dropdown */}
            <div className="md:col-span-2 relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="title_asc">Title: A to Z</option>
                <option value="title_desc">Title: Z to A</option>
                <option value="author_asc">Author: A to Z</option>
                <option value="author_desc">Author: Z to A</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="md:col-span-2">
              <select
                value={genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="All">Category: All</option>
                {CATEGORIES.filter(c => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div className="md:col-span-2">
              <select
                value={language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="All">Language: All</option>
                {LANGUAGES.filter(l => l !== 'All').map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Reading Level Filter */}
            <div className="md:col-span-2">
              <select
                value={readingLevel}
                onChange={(e) => handleFilterChange('readingLevel', e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-850 px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="All">Reading Level: All</option>
                {READING_LEVELS.filter(r => r !== 'All').map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-red-950 bg-red-950/10 rounded-2xl p-10 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Database request failed</h3>
              <p className="text-xs text-zinc-500 font-medium">Ensure the backend Express server is running and database is connected.</p>
            </div>
            <button
              onClick={() => refetch()}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-350 hover:text-white"
            >
              Retry Connection
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-zinc-850 bg-zinc-900/5 rounded-2xl p-16 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No books found</h3>
              <p className="text-xs text-zinc-500 font-medium">
                Try adjusting your search criteria, category filters, or reading levels.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Book Grid - exactly 4 columns on desktop (lg:grid-cols-4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => {
                const isUploader = book.uploadedBy === session?.user?.id;
                const isAdmin = session?.user?.role === 'admin';

                return (
                  <div
                    key={book._id}
                    className="flex flex-col rounded-2xl border border-zinc-900 bg-zinc-900/20 hover:border-zinc-800 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-md overflow-hidden relative group h-[440px] justify-between p-4"
                  >
                    {/* Banner/Cover Header */}
                    <div className="h-40 w-full relative bg-zinc-950 border border-zinc-900 flex items-center justify-center overflow-hidden rounded-xl">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        /* Graphic background */
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-secondary/5 to-zinc-950 flex flex-col justify-between p-3">
                          <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary w-fit">
                            {book.genre}
                          </span>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-2">{book.title}</h4>
                            <p className="text-[10px] text-zinc-500">By {book.author}</p>
                          </div>
                        </div>
                      )}

                      {/* Delete Trigger */}
                      {(isUploader || isAdmin) && (
                        <button
                          onClick={(e) => handleDelete(e, book._id)}
                          className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-zinc-900/90 border border-zinc-850 hover:border-red-900/50 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Meta Body details */}
                    <div className="flex-1 flex flex-col justify-between mt-3 space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-extrabold tracking-wider uppercase">
                          <span className="text-zinc-500">{book.genre}</span>
                          <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                            {book.readingLevel || 'Intermediate'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-zinc-450 italic">By {book.author}</p>
                      </div>

                      {/* Short Description */}
                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {book.description || 'No description provided.'}
                      </p>

                      {/* View Details Button */}
                      <Link
                        href={`/books/${book._id}`}
                        className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 py-2.5 text-xs font-bold text-zinc-200 hover:text-white transition-all active:scale-95 mt-2"
                      >
                        <span>View Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-zinc-900">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-850 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          page === pageNum
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-850'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-850 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
