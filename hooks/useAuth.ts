'use client';

import { useStore } from '@tanstack/react-store';
import { useRouter } from 'next/navigation';
import { userStore, debugLog } from '@/utils/userStore';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useAuth() {
  const { username, email, isHydrated } = useStore(userStore);
  const router = useRouter();

  // Separate authentication state from hydration state
  const isAuthenticated = !!(username && email);
  const isReady = isHydrated; // Rename for clarity
  
  // Debug authentication state changes
  useEffect(() => {
    debugLog('Auth State Change', {
      username: !!username,
      email: !!email,
      isHydrated,
      isAuthenticated,
      isReady,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server'
    });
  }, [username, email, isHydrated, isAuthenticated, isReady]);
  
  const requireAuth = useCallback(
    (action?: () => void, message?: string) => {
      debugLog('RequireAuth Called', {
        isReady,
        isAuthenticated,
        currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server'
      });
      
      // Don't check auth until we're hydrated
      if (!isReady) {
        debugLog('RequireAuth - Not Ready Yet');
        return false;
      }
      
      if (!isAuthenticated) {
        debugLog('RequireAuth - Not Authenticated, Redirecting to Login');
        toast.error(message || 'Please log in to continue', {
          className: 'toast-error',
        });
        // Get current path to use as redirect parameter
        const currentPath = window.location.pathname + window.location.search;
        const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
        return false;
      }

      debugLog('RequireAuth - Success, Executing Action');
      if (action) {
        action();
      }
      return true;
    },
    [isAuthenticated, isReady, router]
  );

  const redirectIfAuthenticated = useCallback(
    (redirectTo: string = '/') => {
      // Don't redirect until we're hydrated
      if (!isReady) {
        return false;
      }
      
      if (isAuthenticated) {
        router.push(redirectTo);
        return true;
      }
      return false;
    },
    [isAuthenticated, isReady, router]
  );

  return {
    isAuthenticated,
    isReady,
    user: { username, email },
    requireAuth,
    redirectIfAuthenticated,
  };
}
