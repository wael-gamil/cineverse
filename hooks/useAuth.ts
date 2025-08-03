'use client';

import { useStore } from '@tanstack/react-store';
import { useRouter } from 'next/navigation';
import { userStore } from '@/utils/userStore';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export function useAuth() {
  const { username, email } = useStore(userStore);
  const router = useRouter();

  const isAuthenticated = !!(username && email);
  const requireAuth = useCallback(
    (action?: () => void, message?: string) => {
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
    [isAuthenticated, router]
  );

  const redirectIfAuthenticated = useCallback(
    (redirectTo: string = '/') => {
      if (isAuthenticated) {
        router.push(redirectTo);
        return true;
      }
      return false;
    },
    [isAuthenticated, router]
  );

  return {
    isAuthenticated,
    user: { username, email },
    requireAuth,
    redirectIfAuthenticated,
  };
}
