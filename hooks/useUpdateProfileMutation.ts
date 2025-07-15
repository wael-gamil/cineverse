import { useMutation } from '@tanstack/react-query';

type UpdateInput = {
  name: string;
  bio: string;
  dateOfBirth: string;
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: async (updatedUser: UpdateInput) => {
      const res = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      return data;
    },
  });
};
