// utils/logout.ts
'use client';

import { clearUser } from './userStore';
import toast from 'react-hot-toast';

export async function logout(router?: any) {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    clearUser(); 

    // Show logout success toast
    toast.success('Logged out successfully', {
      className: 'toast-success',
    }); // If router is provided and user is on a protected route, redirect to home
    if (router) {
      const currentPath = window.location.pathname;
      const protectedRoutes = ['/profile', '/watchlist'];

      const isOnProtectedRoute = protectedRoutes.some(route =>
        currentPath.startsWith(route)
      );

      if (isOnProtectedRoute) {
        setTimeout(() => {
          router.push('/');
        }, 100);
      }
    }
  } catch (error) {
    toast.error('Logout failed. Please try again.', {
      className: 'toast-error',
    });
  }
}
