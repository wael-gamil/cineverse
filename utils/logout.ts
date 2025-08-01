// utils/logout.ts
'use client';

import { userStore } from './userStore';
import toast from 'react-hot-toast';

export async function logout(router?: any) {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    userStore.setState({ username: null, email: null });
    localStorage.removeItem('cineverse-user');

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
        // Use setTimeout to allow the userStore state to update first
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
