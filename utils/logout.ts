// utils/logout.ts
'use client';

import { userStore } from './userStore';

export async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
  });

  userStore.setState({ username: null, email: null });

  localStorage.removeItem('cineverse-user');
}
