'use client';

import { Store } from '@tanstack/react-store';

type UserState = {
  username: string | null;
  email: string | null;
};

const initialState: UserState = {
  username: null,
  email: null,
};

export const userStore = new Store<UserState>(initialState);

/**
 * Set user and sync to localStorage with expiry (2 hours)
 */
export const setUserWithExpiry = (username: string, email: string) => {
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours in ms
  userStore.setState({ username, email });

  if (typeof window !== 'undefined') {
    const payload = { username, email, expiresAt };
    localStorage.setItem('cineverse-user', JSON.stringify(payload));
  }
};

// Load from localStorage on init (with expiry check)
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('cineverse-user');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const { username, email, expiresAt } = parsed;
      if (expiresAt && Date.now() < expiresAt) {
        userStore.setState({ username, email });
      } else {
        localStorage.removeItem('cineverse-user');
      }
    } catch (error) {
      console.error('Failed to parse localStorage user data:', error);
      localStorage.removeItem('cineverse-user');
    }
  }
}
