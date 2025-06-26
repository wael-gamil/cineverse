import styles from './reviewCard.module.css';
import Image from 'next/image';
import { Icon } from '../../ui/icon/icon';
import { Review } from '@/constants/types/movie';
import fallbackAvatar from '@/public/avatar_fallback.png';
import Button from '../../ui/button/button';
type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.cardTop}>
        <div className={styles.avatar}>
          <Image
            src={review.user?.path || fallbackAvatar}
            alt={review.user?.name || 'User'}
            fill
            className='object-cover'
          />
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardHeader}>
            <h4>{review.user?.name}</h4>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  name='starFilled'
                  className={
                    i < Math.floor((review.rate || 0) / 2)
                      ? styles.starFilled
                      : styles.starEmpty
                  }
                />
              ))}
            </div>
          </div>
          <h5 className={styles.reviewTitle}>{review.title}</h5>
          <p className={styles.reviewContent}>{review.content}</p>
          <div className={styles.reviewFooter}>
            <span>Was it helpful? </span>
            <Button
              padding='sm'
              variant='ghost'
              color='neutral'
              borderRadius='fullRadius'
            >
              <Icon name='thumbUp' strokeColor='white' />
              <span>{review.likes || 0}</span>
            </Button>
            <Button
              padding='sm'
              variant='ghost'
              color='neutral'
              borderRadius='fullRadius'
            >
              <Icon name='thumbDown' strokeColor='white' />
              <span>{review.dislikes || 0}</span>
            </Button>
            <span className={styles.date}>{review.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
