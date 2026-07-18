'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __fetch_intercepted__?: boolean;
    sessionToken?: string;
  }
}

export default function FetchInterceptor() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Instantly load cached token from localStorage to prevent cold start 401s
      window.sessionToken = localStorage.getItem('better_session_token') || '';
    }

    if (typeof window !== 'undefined' && !window.__fetch_intercepted__) {
      window.__fetch_intercepted__ = true;
      const originalFetch = window.fetch;
      
      // 2. Fetch session from Next.js server route to cache the active token
      const getSessionAndCache = async () => {
        try {
          const res = await originalFetch('/api/auth/get-session');
          if (res.ok) {
            const data = await res.json();
            if (data && data.session && data.session.token) {
              const token = data.session.token;
              window.sessionToken = token;
              localStorage.setItem('better_session_token', token);
            } else {
              window.sessionToken = '';
              localStorage.removeItem('better_session_token');
            }
          }
        } catch (e) {
          console.warn('Failed to load session token:', e);
        }
      };

      getSessionAndCache();
      
      // 3. Intercept fetch calls to insert Authorization Bearer header
      window.fetch = async function (input, init) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const urlString = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
        
        // Avoid intercepting the auth session route itself to prevent loops
        if (urlString.includes('/api/auth/')) {
          return originalFetch(input, init);
        }
        
        if (urlString.startsWith(apiUrl)) {
          const token = window.sessionToken || localStorage.getItem('better_session_token') || '';
          
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
