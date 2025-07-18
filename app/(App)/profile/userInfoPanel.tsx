'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './userInfoPanel.module.css';
import { useUserProfileQuery } from '@/hooks/useUserProfileQuery';
import { useUpdateProfileMutation } from '@/hooks/useUpdateProfileMutation';
import EditProfileModal from './editProfileModal';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
export default function UserInfoPanel() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: user, isLoading, isError } = useUserProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className={styles.wrapper}>Loading...</div>;
  }

  if (isError || !user) {
    return <div className={styles.wrapper}>Failed to load profile.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundPattern} />

      <div className={styles.content}>
        <div className={styles.avatar}>
          <Image
            src={
              user.profilePicture || 'https://placehold.co/200x200?text=Avatar'
            }
            alt={user.name || user.username}
            fill
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{user.name || user.username}</h1>
          <p className={styles.username}>@{user.username}</p>
          <p className={styles.joinDate}>
            Member since{' '}
            {new Date(user.createdAt).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className={styles.bio}>{user.bio || 'No bio provided yet.'}</p>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span>
                <strong>0</strong> in watchlist
              </span>
            </div>
            <div className={styles.statItem}>
              <span>
                <strong>0</strong> reviews
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className={styles.editBtn}
        >
          Edit Profile
        </button>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={async updatedData => {
            try {
              await updateProfile.mutateAsync({
                name: updatedData.name ?? '',
                bio: updatedData.bio ?? '',
                dateOfBirth: updatedData.dateOfBirth ?? '',
              });
              await queryClient.invalidateQueries({
                queryKey: ['user-profile'],
              });
              queryClient.refetchQueries({
                queryKey: ['user-profile'],
              });
              setIsEditModalOpen(false);
              toast.success('Profile updated successfully!', {
                className: 'toast-success',
              });
            } catch (err) {
              toast.error('Profile update failed. Please try again.', {
                className: 'toast-error',
              });
            }
          }}
        />
      )}
    </div>
  );
}
