'use client';

import React from 'react';
import Button from '../button/button';
import { Icon } from '../icon/icon';
import styles from './deleteConfirmationModal.module.css';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemPreview?: React.ReactNode;
  confirmText?: string;
  isDeleting?: boolean;
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemPreview,
  confirmText = 'Delete',
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

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
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <Icon name='alertTriangle' className={styles.warningIcon} />
          <h2 id="delete-modal-title" className={styles.modalTitle}>
            {title}
          </h2>
        </div>

        <div className={styles.modalBody}>
          <p id="delete-modal-description" className={styles.modalText}>
            {message}
          </p>
          
          {itemPreview && (
            <div className={styles.itemPreview}>
              {itemPreview}
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <Button
            type='button'
            variant='ghost'
            color='neutral'
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='solid'
            color='danger'
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
