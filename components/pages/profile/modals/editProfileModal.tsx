'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import styles from './editProfileModal.module.css';
import avatarFallback from '@/public/avatar_fallback.png';

type User = {
  name: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  profilePicture?: string | null;
};

type EditProfileModalProps = {
  user: User;
  onClose: () => void;
  onSave?: (updatedUser: User, newImageFile?: File | null) => void;
};

export default function EditProfileModal({
  user,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(user.name ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [dob, setDob] = useState(user.dateOfBirth ?? '');
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture || avatarFallback.src
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDateFieldClick = () => {
    dateInputRef.current?.focus();
    dateInputRef.current?.showPicker?.();
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setImageFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updatedUser: User = {
        name,
        bio,
        dateOfBirth: dob,
        profilePicture,
      };
      await onSave?.(updatedUser, imageFile);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role='dialog'
      aria-labelledby='edit-profile-modal-title'
      aria-describedby='edit-profile-modal-description'
    >
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <Icon name='user' className={styles.headerIcon} />
          <h2 id='edit-profile-modal-title' className={styles.modalTitle}>
            Edit Profile
          </h2>
          <Button
            variant='ghost'
            color='neutral'
            padding='sm'
            borderRadius='fullRadius'
            onClick={onClose}
            ariaLabel='Close modal'
          >
            <Icon name='close' strokeColor='white' />
          </Button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <p
            id='edit-profile-modal-description'
            className={styles.modalDescription}
          >
            Update your profile information and photo
          </p>

          {/* Profile Photo Section */}
          <div className={styles.photoSection}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarWrapper} onClick={handleImageClick}>
                <Image
                  src={profilePicture}
                  alt='Profile Picture'
                  fill
                  className={styles.avatar}
                />{' '}
                <div className={styles.avatarOverlay}>
                  <Icon name='edit' strokeColor='white' />
                </div>
              </div>
            </div>{' '}
            <div className={styles.photoInfo}>
              <h3 className={styles.photoTitle}>Profile Photo</h3>
              <p className={styles.photoDescription}>
                Click on your photo to change it
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className={styles.formSection}>
            <div className={styles.field}>
              <label htmlFor='name' className={styles.label}>
                <Icon
                  name='user'
                  className={styles.labelIcon}
                  strokeColor='white'
                />
                Name
              </label>
              <input
                id='name'
                type='text'
                value={name}
                placeholder='Enter your name'
                onChange={e => setName(e.target.value)}
                className={styles.input}
                maxLength={50}
              />
              <div className={styles.fieldInfo}>
                <span className={styles.charCount}>{name.length}/50</span>
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor='bio' className={styles.label}>
                <Icon
                  name='edit'
                  className={styles.labelIcon}
                  strokeColor='white'
                />
                Bio
              </label>
              <textarea
                id='bio'
                value={bio}
                placeholder='Tell us about yourself, your favorite movies...'
                onChange={e => setBio(e.target.value)}
                className={styles.textarea}
                maxLength={500}
                rows={4}
              />
              <div className={styles.fieldInfo}>
                <span className={styles.charCount}>{bio.length}/500</span>
              </div>
            </div>{' '}
            <div className={styles.field}>
              <label htmlFor='dob' className={styles.label}>
                <Icon
                  name='calendar'
                  className={styles.labelIcon}
                  strokeColor='white'
                />
                Date of Birth
              </label>
              <div
                className={styles.dateFieldWrapper}
                onClick={handleDateFieldClick}
              >
                <input
                  ref={dateInputRef}
                  id='dob'
                  type='date'
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className={styles.input}
                />
                <Icon
                  name='calendar'
                  className={styles.dateIcon}
                  strokeColor='muted'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalActions}>
          <Button
            variant='ghost'
            color='neutral'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant='solid'
            color='primary'
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
