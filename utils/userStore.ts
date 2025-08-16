'use client';

import { Store } from '@tanstack/react-store';

type UserState = {
  username: string | null;
  email: string | null;
  profilePicture: string | null;
  isHydrated: boolean; 
};

const initialState: UserState = {
  username: null,
  email: null,
  profilePicture: null,
  isHydrated: false,
};

export const userStore = new Store<UserState>(initialState);

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
    isHydrated: true,
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

export const clearUser = () => {
  userStore.setState({
    username: null,
    email: null,
    profilePicture: null,
    isHydrated: true,
  });

  if (typeof window !== 'undefined') {
    localStorage.removeItem('cineverse-user');
  }
};

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
          isHydrated: true, 
        });
      } else {
        localStorage.removeItem('cineverse-user');
        userStore.setState(prev => ({ ...prev, isHydrated: true }));
      }
    } catch (error) {
      localStorage.removeItem('cineverse-user');
      userStore.setState(prev => ({ ...prev, isHydrated: true }));
    }
  } else {
    userStore.setState(prev => ({ ...prev, isHydrated: true }));
  }
} else {
  userStore.setState(prev => ({ ...prev, isHydrated: true }));
}
