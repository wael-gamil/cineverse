'use client';

import styles from './mysterySection.module.css';
import MysteryCard from '@/components/cards/card/mysteryCard';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import { useRandomContentQuery } from '@/hooks/useRandomContentQuery';

export default function MysterySection() {
  const { data, isLoading, error, refetch, isFetching } =
    useRandomContentQuery();

  return (
    <section className={styles.wrapper}>
      <div className={styles.text}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <Icon name='dice' strokeColor='white' width={32} height={32} />
            <span>Mystery Pick</span>
          </h2>
          <p className={styles.subtitle}>
            Flip the card to reveal a surprise movie or series.
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isFetching} padding='lg'>
          {isFetching ? 'Drawing...' : 'Draw Another Mystery'}
        </Button>
      </div>

      {isLoading || isFetching ? (
        <p className={styles.status}>Loading mystery...</p>
      ) : error || !data ? (
        <p className={styles.status}>Unable to load mystery card.</p>
      ) : (
        <MysteryCard item={data} />
      )}
    </section>
  );
}
