// utils/userStore.ts
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

// Create store
export const userStore = new Store<UserState>(initialState);

// Save to localStorage on state change
userStore.subscribe(state => {
  if (typeof window !== 'undefined') {
    const { username, email } = userStore.state;
    localStorage.setItem('cineverse-user', JSON.stringify({ username, email }));
  }
});
// Rehydrate from localStorage
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('cineverse-user');
  if (saved) {
    const parsed = JSON.parse(saved);
    userStore.setState(parsed);
  }
}
