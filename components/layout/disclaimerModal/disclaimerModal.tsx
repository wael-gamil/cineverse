'use client';
import React, { useState, useEffect } from 'react';
import styles from './disclaimerModal.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';

const messages = {
  english: `⚠️ This website is a personal project created solely to showcase our design and development skills. All movie/TV content is sourced from public APIs for demonstration purposes only. We do not encourage watching such content, as it is prohibited (haram) in Islam.`,
  arabic: `⚠️ هذا الموقع مشروع شخصي يهدف فقط إلى عرض مهاراتنا في التصميم والتطوير. جميع محتويات الأفلام والمسلسلات مأخوذة من واجهات برمجة عامة لأغراض العرض فقط. نحن لا نشجع على مشاهدة هذه المحتويات، فهي محرمة في الإسلام.`
};

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem('cineverse-disclaimer-seen');
    if (!hasSeenDisclaimer) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('cineverse-disclaimer-seen', 'true');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
      aria-describedby="disclaimer-modal-description"
    >
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <Icon name="alertTriangle" strokeColor="danger" width={24} height={24} />
          <h2 id="disclaimer-modal-title" className={styles.modalTitle}>
            Important Disclaimer
          </h2>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.messageSection}>
            <h3 className={styles.sectionTitle}>English</h3>
            <p className={styles.modalText}>{messages.english}</p>
          </div>
          
          <div className={styles.messageSection}>
            <h3 className={styles.sectionTitle}  dir="rtl">العربية</h3>
            <p className={styles.modalText} dir="rtl">{messages.arabic}</p>
          </div>
        </div>

        <div className={styles.modalActions}>
          <Button
            onClick={handleClose}
            variant="solid"
            color="primary"
            width="100%"
          >
            <Icon name="check" strokeColor="white" width={20} height={20} />
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
