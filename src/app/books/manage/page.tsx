'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Trash2, Eye, Clock, CheckCircle, XCircle, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '../../../lib/auth-client';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function ManageBooksPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } = useSession();

  // Route protection
  React.useEffect(() => {
    if (!isSessionPending && !session) {
      toast.error('Authentication required. Redirecting to login.');
      router.push('/login');
    }
  }, [session, isSessionPending, router]);

  // Fetch user's own uploaded books
  const { data: books = [], isLoading, isError, refetch } = useQuery<Book[]>({
    queryKey: ['my-books'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/books/user/manage`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to load your books list.');
      }
      return res.json();
    },
    enabled: !!session,
  });

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
      toast.success('Book deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['my-books'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete book.');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this book? This action is permanent.')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: 'pending' | 'accepted' | 'rejected') => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 border border-green-500/25 text-green-400">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Accepted</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/25 text-red-400">
            <XCircle className="h-3.5 w-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            <span>Pending Approval</span>
          </span>
        );
    }
  };

  if (isSessionPending || isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-zinc-400">Loading your books...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-5xl space-y-8 z-10 relative">
        {/* Back Link */}
        <button
          onClick={() => router.push('/books')}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Shelf</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Manage Your Books
            </h1>
            <p className="text-sm text-zinc-450">
              Track the status of your uploads, view details, or delete files.
            </p>
          </div>
          <Link
            href="/books/upload"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload New Book</span>
          </Link>
        </div>

        {/* List table */}
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-zinc-850 bg-zinc-900/5 rounded-2xl p-16 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
              <FileText className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No uploads found</h3>
              <p className="text-xs text-zinc-500 font-medium">
                You haven't uploaded any books to the digital library shelf yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-900/10 backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/30 text-xs font-bold text-zinc-450 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Book Info</th>
                  <th className="p-4 sm:p-5">Genre</th>
                  <th className="p-4 sm:p-5">Approval Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-sm text-zinc-300">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-zinc-900/10 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="font-semibold text-white truncate max-w-xs">{book.title}</div>
                      <div className="text-xs text-zinc-500 italic">By {book.author}</div>
                    </td>
                    <td className="p-4 sm:p-5 text-xs font-medium text-zinc-450">
                      {book.genre}
                    </td>
                    <td className="p-4 sm:p-5">
                      {getStatusBadge(book.status)}
                    </td>
                    <td className="p-4 sm:p-5 text-right space-x-2">
                      <Link
                        href={`/books/${book._id}`}
                        className="inline-flex p-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-300 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="inline-flex p-2 rounded-lg bg-zinc-900/40 hover:bg-red-950/20 border border-zinc-850 hover:border-red-900/40 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
