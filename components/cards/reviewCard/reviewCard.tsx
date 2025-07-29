import styles from './reviewCard.module.css';
import Image from 'next/image';
import { Icon } from '../../ui/icon/icon';
import { Review } from '@/constants/types/movie';
import fallbackAvatar from '@/public/avatar_fallback.png';
import Button from '../../ui/button/button';
type ReviewCardProps = {
  review: Review;
  onReact?: (reviewId: number, type: 'LIKE' | 'DISLIKE') => void;
};

export default function ReviewCard({ review, onReact }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div className={styles.reviewCard}>
      <div className={styles.cardTop}>
        <div className={styles.avatar}>
          <Image
            src={review.user?.imageUrl || fallbackAvatar}
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
          <p className={styles.reviewContent}>{review.description}</p>
          <div className={styles.reviewFooter}>
            <Button
              padding='sm'
              variant='ghost'
              color='neutral'
              borderRadius='fullRadius'
              onClick={e => {
                e.stopPropagation();
                onReact?.(review.reviewId, 'LIKE');
              }}
            >
              <Icon name='thumbUp' strokeColor='white' />
              <span>{review.likeCount || 0}</span>
            </Button>
            <Button
              padding='sm'
              variant='ghost'
              color='neutral'
              borderRadius='fullRadius'
              onClick={e => {
                e.stopPropagation();
                onReact?.(review.reviewId, 'DISLIKE');
              }}
            >
              <Icon name='thumbDown' strokeColor='white' />
              <span>{review.dislikeCount || 0}</span>
            </Button>
            <span className={styles.date}>{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
