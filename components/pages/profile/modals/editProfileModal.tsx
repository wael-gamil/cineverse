'use client';

import { useState, useRef } from 'react';
import styles from './editProfileModal.module.css';
import Image from 'next/image';

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
    user.profilePicture || '/default-avatar.png'
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const updatedUser: User = {
      name,
      bio,
      dateOfBirth: dob,
      profilePicture,
    };
    onSave?.(updatedUser, imageFile);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.photoSection}>
          <div className={styles.avatarWrapper} onClick={handleImageClick}>
            <Image
              src={profilePicture}
              alt='Profile Picture'
              fill
              className={styles.avatar}
            />
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <p className={styles.avatarHint}>Click photo to change</p>
        </div>

        <h2 className={styles.title}>Edit Profile</h2>

        <div className={styles.field}>
          <label>Name</label>
          <input
            type='text'
            value={name}
            placeholder='Enter your name'
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Bio</label>
          <input
            type='text'
            value={bio}
            placeholder='Tell us about yourself'
            onChange={e => setBio(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>Date of Birth</label>
          <input
            type='date'
            value={dob}
            onChange={e => setDob(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.save} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
