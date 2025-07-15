'use client';

import { useState } from 'react';
import styles from './editProfileModal.module.css';

interface User {
  name: string | null;
  bio: string | null;
  dateOfBirth: string | null;
}

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave?: (updatedUser: User) => void;
}

export default function EditProfileModal({
  user,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(user.name ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [dob, setDob] = useState(user.dateOfBirth ?? '');

  const handleSubmit = () => {
    const updatedUser: User = {
      name,
      bio,
      dateOfBirth: dob,
    };
    onSave?.(updatedUser);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
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
          <button className={styles.save} onClick={handleSubmit}>
            Save
          </button>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
