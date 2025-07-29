'use client';

import { useState } from 'react';
import { useUpdateProfileMutation } from '@/hooks/useUpdateProfileMutation';
import EditProfileModal from './modals/editProfileModal';
import toast from 'react-hot-toast';
import ContentHeroSimple from '@/components/shared/contentDetails/heroSection/contentHeroSimple';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import { useUpdateProfilePictureMutation } from '@/hooks/useUpdateProfilePictureMutation';
import { UserProfile } from '@/constants/types/movie';
import { useUserProfileQuery } from '@/hooks/useUserProfileQuery';

type UserInfoPanelProps = {
  initialUser: UserProfile;
};
export default function UserInfoPanel({ initialUser }: UserInfoPanelProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: user = initialUser, refetch } = useUserProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const updateProfileImage = useUpdateProfilePictureMutation();

  const infoCards = [
    {
      iconName: 'calendar' as const,
      title: 'Joined',
      description: new Date(user.createdAt).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
    },
    {
      iconName: 'bookmark' as const,
      title: 'Watchlist',
      description: '0',
    },
    {
      iconName: 'star' as const,
      title: 'Reviews',
      description: '0',
    },
  ];

  return (
    <>
      <ContentHeroSimple
        title={user.name || user.username}
        image={
          user.profilePicture || 'https://placehold.co/275x400?text=Avatar'
        }
        bio={user.bio || 'No bio provided yet.'}
        infoCards={infoCards}
        badges={['User']} // You can map this dynamically if needed
        actionButton={
          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant='solid'
            color='neutral'
          >
            <Icon name='edit' strokeColor='white' />
            Edit Profile
          </Button>
        }
      />

      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={async (updatedData, newImageFile) => {
            try {
              // First update name/bio/date
              await updateProfile.mutateAsync({
                name: updatedData.name ?? '',
                bio: updatedData.bio ?? '',
                dateOfBirth: updatedData.dateOfBirth ?? '',
              });

              // Then upload image with toast.promise
              if (newImageFile) {
                await toast.promise(
                  updateProfileImage.mutateAsync(newImageFile),
                  {
                    loading: 'Uploading profile image...',
                    success: 'Profile image uploaded!',
                    error: 'Failed to upload image.',
                  },
                  {
                    className: 'toast-default',
                  }
                );
              }
              refetch();
              setIsEditModalOpen(false);
              toast.success('Profile updated successfully!', {
                className: 'toast-success',
              });
            } catch (error) {
              toast.error('Profile update failed. Please try again.', {
                className: 'toast-error',
              });
            }
          }}
        />
      )}
    </>
  );
}
