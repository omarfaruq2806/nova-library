'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __fetch_intercepted__?: boolean;
  }
}

export default function FetchInterceptor() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__fetch_intercepted__) {
      window.__fetch_intercepted__ = true;
      const originalFetch = window.fetch;
      
      window.fetch = async function (input, init) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const urlString = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
        
        if (urlString.startsWith(apiUrl)) {
          const match = document.cookie.match(/(^|;)\s*better-auth\.session_token\s*=\s*([^;]+)/);
          const token = match ? match[2] : '';
          
          if (token) {
            init = init || {};
            const headers = new Headers(init.headers || {});
            if (!headers.has('Authorization')) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            init.headers = headers;
          }
        }
        return originalFetch(input, init);
      };
    }
  }, []);

  return null;
}
