'use client';

import { Store } from '@tanstack/react-store';

type UserState = {
  username: string | null;
  email: string | null;
  profilePicture: string | null;
};

const initialState: UserState = {
  username: null,
  email: null,
  profilePicture: null,
};

export const userStore = new Store<UserState>(initialState);

/**
 * Set user and sync to localStorage with expiry (2 hours)
 */
export const setUserWithExpiry = (
  username: string,
  email: string,
  profilePicture?: string | null
) => {
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours in ms
  userStore.setState({
    username,
    email,
    profilePicture: profilePicture || null,
  });

  if (typeof window !== 'undefined') {
    const payload = {
      username,
      email,
      profilePicture: profilePicture || null,
      expiresAt,
    };
    localStorage.setItem('cineverse-user', JSON.stringify(payload));
  }
};

/**
 * Update only the profile picture in userStore and localStorage without changing expiry
 */
export const updateUserProfilePicture = (profilePicture: string | null) => {
  userStore.setState(prev => ({
    ...prev,
    profilePicture: profilePicture || null,
  }));

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cineverse-user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { username, email, expiresAt } = parsed;
        const payload = {
          username,
          email,
          profilePicture: profilePicture || null,
          expiresAt,
        };
        localStorage.setItem('cineverse-user', JSON.stringify(payload));
      } catch (error) {
        // fallback: just update profilePicture
        localStorage.setItem(
          'cineverse-user',
          JSON.stringify({ profilePicture: profilePicture || null })
        );
      }
    }
  }
};

// Load from localStorage on init (with expiry check)
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('cineverse-user');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const { username, email, profilePicture, expiresAt } = parsed;
      if (expiresAt && Date.now() < expiresAt) {
        userStore.setState({
          username,
          email,
          profilePicture: profilePicture || null,
        });
      } else {
        localStorage.removeItem('cineverse-user');
      }
    } catch (error) {
      localStorage.removeItem('cineverse-user');
    }
  }
}
