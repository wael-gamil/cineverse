import React from 'react';
import styles from './disclaimerBanner.module.css';

const messages = [
  `⚠️ This website is a personal project created solely to showcase our design and development skills. All movie/TV content is sourced from public APIs for demonstration purposes only. We do not encourage watching such content, as it is prohibited (haram) in Islam.`,
  `⚠️ هذا الموقع مشروع شخصي يهدف فقط إلى عرض مهاراتنا في التصميم والتطوير. جميع محتويات الأفلام والمسلسلات مأخوذة من واجهات برمجة عامة لأغراض العرض فقط. نحن لا نشجع على مشاهدة هذه المحتويات، فهي محرمة في الإسلام.`,
];

export default function DisclaimerBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.marquee}>
        <div className={styles.marqueeContent}>
          {messages.map((msg, idx) => (
            <span key={idx} className={styles.message}>
              {msg}
            </span>
          ))}
        </div>
        <div className={styles.marqueeContent} aria-hidden='true'>
          {messages.map((msg, idx) => (
            <span key={idx} className={styles.message}>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
