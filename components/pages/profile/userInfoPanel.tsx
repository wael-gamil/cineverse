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
import { usePublicUserStatsQuery } from '@/hooks/usePublicUserStatsQuery';
import avatarFallback from '@/public/avatar_fallback.png';
import styles from './userInfoPanel.module.css';
type UserInfoPanelProps = {
  initialUser: UserProfile;
};
export default function UserInfoPanel({ initialUser }: UserInfoPanelProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: user = initialUser, refetch } = useUserProfileQuery();
  const { data: stats, isLoading: statsLoading } = usePublicUserStatsQuery(
    user.username
  );
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
      description: statsLoading
        ? '...'
        : stats
        ? stats.watchlistCount.toString()
        : '0',
    },
    {
      iconName: 'star' as const,
      title: 'Reviews',
      description: statsLoading
        ? '...'
        : stats
        ? stats.reviewCount.toString()
        : '0',
    },
  ];

  return (
    <>
      <ContentHeroSimple
        title={user.name || user.username}
        image={user.profilePicture || (avatarFallback as { src: string }).src}
        bio={user.bio || 'No bio provided yet.'}
        infoCards={infoCards}
        actionButton={
          <div className={styles.actionButton}>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant='solid'
              color='neutral'
            >
              <Icon name='edit' strokeColor='white' />
              Edit Profile
            </Button>
            <Button
              color='neutral'
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    url: `profile/${user.username}`,
                    title: user.name || user.username,
                    text: user.bio || 'No bio provided yet.',
                  });
                } else {
                  navigator.clipboard.writeText(`profile/${user.username}`);
                  alert('Link copied to clipboard!');
                }
              }}
            >
              <Icon name='share' strokeColor='white' />
            </Button>
          </div>
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
