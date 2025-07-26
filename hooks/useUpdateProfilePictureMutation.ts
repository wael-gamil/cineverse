import { useMutation } from '@tanstack/react-query';

export const useUpdateProfilePictureMutation = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/user/update-profile-picture', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Failed to update profile picture');
      return data;
    },
  });
};
