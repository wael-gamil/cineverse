// hooks/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (body: { username: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (body: {
      email: string;
      password: string;
      username: string;
    }) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    },
  });
};

export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (body: { email: string }) => {
      const res = await fetch('/api/auth/forget-password', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      return data;
    },
  });
};
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (body: { token: string; newPassword: string }) => {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      return data;
    },
  });
};
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
    },
  });
}
export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: async (username: string) => {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Failed to resend verification email');

      return data;
    },
  });
}
