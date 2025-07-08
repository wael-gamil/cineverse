'use client';

import styles from './contentSliderSection.module.css';
import SkeletonCard from '@/components/cards/card/skeletonCard';
import Button from '@/components/ui/button/button';
import { Icon } from '@/components/ui/icon/icon';
import SectionHeader from './sectionHeader';
import FilterTabs from '@/components/ui/filter/filterTabs';
import CardContainer from '@/components/cards/card/cardContainer';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type HeaderVariant = 'block' | 'strip' | 'lined' | 'ghost';
type Props = {
  cardsPerView: number;
  title: string;
  layout?: 'overlay' | 'below' | 'wide';
  imageHeight?: 'image-md' | 'image-lg';
  minWidth?: number;
  maxWidth?: number;
  header?: {
    variant?: HeaderVariant;
    subtitle?: string;
    icon?: React.ReactNode;
  };
};

export default function ContentSliderSkeleton({
  cardsPerView,
  title,
  layout,
  imageHeight,
  minWidth,
  maxWidth,
  header,
}: Props) {
  const isMobile = useResponsiveLayout();
  return (
    <div className={styles.wrapper}>
      <SectionHeader
        title={title}
        subtitle={header?.subtitle}
        icon={header?.icon}
        variant={header?.variant || 'block'}
        filterTabs={
          <FilterTabs
            options={[
              { label: 'Movies', value: 'MOVIE' },
              { label: 'Series', value: 'SERIES' },
            ]}
            showAll={false}
          />
        }
      />

      <div
        className={styles.sliderRow}
        style={
          isMobile
            ? imageHeight === 'image-lg'
              ? { minHeight: '600px', maxHeight: '600px' }
              : { minHeight: '450px', maxHeight: '450px' }
            : undefined
        }
      >
        {!isMobile && (
          <Button variant='outline' color='neutral' disabled>
            <Icon name='arrow-left' strokeColor='white' />
          </Button>
        )}

        <CardContainer layout='scroll' cardMinWidth={minWidth} cardGap={16}>
          {Array.from({ length: cardsPerView }).map((_, i) => (
            <SkeletonCard
              key={i}
              layout={layout}
              imageHeight={imageHeight}
              maxWidth={maxWidth}
              minWidth={minWidth}
            />
          ))}
        </CardContainer>

        {!isMobile && (
          <Button variant='outline' color='neutral' disabled>
            <Icon name='arrow-right' strokeColor='white' />
          </Button>
        )}
      </div>

      {isMobile && (
        <div className={styles.mobileControls}>
          <Button variant='outline' color='neutral' disabled>
            <Icon name='arrow-left' strokeColor='white' />
          </Button>
          <Button variant='outline' color='neutral' disabled>
            <Icon name='arrow-right' strokeColor='white' />
          </Button>
        </div>
      )}

      <div className={styles.pageInfo}>Showing 0 – 0 of 0</div>
    </div>
  );
}
