'use client';

import { useStore } from '@tanstack/react-store';
import { useRouter } from 'next/navigation';
import { userStore } from '@/utils/userStore';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export function useAuth() {
  const { username, email, isHydrated } = useStore(userStore);
  const router = useRouter();

  const isAuthenticated = !!(username && email && isHydrated); 
  const isHydrated_ = isHydrated; 
  const requireAuth = useCallback(
    (action?: () => void, message?: string) => {
      if (!isHydrated_) {
        return false;
      }
      
      if (!isAuthenticated) {
        toast.error(message || 'Please log in to continue', {
          className: 'toast-error',
        });
        // Get current path to use as redirect parameter
        const currentPath = window.location.pathname + window.location.search;
        const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
        return false;
      }

      if (action) {
        action();
      }
      return true;
    },
    [isAuthenticated, isHydrated_, router]
  );

  const redirectIfAuthenticated = useCallback(
    (redirectTo: string = '/') => {
      if (!isHydrated_) {
        return false;
      }
      
      if (isAuthenticated) {
        router.push(redirectTo);
        return true;
      }
      return false;
    },
    [isAuthenticated, isHydrated_, router]
  );

  return {
    isAuthenticated,
    isHydrated: isHydrated_,
    user: { username, email },
    requireAuth,
    redirectIfAuthenticated,
  };
}
