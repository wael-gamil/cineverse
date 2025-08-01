import { normalizeContent } from '@/constants/types/movie';
import HeroSectionWrapper from '../../../components/shared/homePage/heroSectionWrapper';
import { getContentDetails, getContents } from '@/lib/api';
import CommunityFloat from '../../../components/shared/homePage/communityFloat';
import styles from './page.module.css';
import ContentSliderSectionWrapper from '@/components/shared/contentSliderSection/contentSliderSectionWrapper';
import MysterySection from '@/components/shared/homePage/mysterySection';
import { Icon } from '@/components/ui/icon/icon';
import MotionSection from '@/components/shared/motionSection';

const sectionConfig: Record<
  string,
  {
    title: string;
    fetchUrl: string;
    header?: {
      variant?: 'block' | 'strip' | 'lined' | 'ghost';
      subtitle?: string;
      icon?: React.ReactNode;
    };
    cardProps?: {
      layout?: 'overlay' | 'below' | 'wide';
      imageHeight?: 'image-lg' | 'image-md';
      minWidth?: number;
      maxWidth?: number;
    };
  }
> = {
  'top-rated': {
    title: 'Top Rated',
    fetchUrl: '/api/slider?section=top-rated&',
    header: {
      variant: 'block',
      subtitle: 'Best movies according to IMDb rating',
      icon: <Icon name='star' strokeColor='primary' width={32} height={32} />,
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-lg',
      minWidth: 270,
      maxWidth: 400,
    },
  },
  'most-recent': {
    title: 'Most Recent',
    fetchUrl: '/api/slider?section=most-recent&',
    header: {
      variant: 'lined',
      subtitle: 'Latest releases this month',
      icon: <Icon name='clock' strokeColor='white' width={32} height={32} />,
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-lg',
      minWidth: 250,
      maxWidth: 400,
    },
  },
  'up-coming': {
    title: 'Upcoming',
    fetchUrl: '/api/slider?section=up-coming&',
    header: {
      variant: 'ghost',
      subtitle: 'What’s hitting theaters next',
      icon: <Icon name='calendar' strokeColor='white' width={32} height={32} />,
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-lg',
      minWidth: 250,
      maxWidth: 400,
    },
  },
  'top-arab': {
    title: 'Top Arab',
    fetchUrl: '/api/slider?section=top-arab&',
    header: {
      variant: 'strip',
      subtitle: 'Critically acclaimed Arab films',
      icon: <Icon name='film' strokeColor='white' width={32} height={32} />,
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-lg',
      minWidth: 270,
      maxWidth: 400,
    },
  },
  'most-recent-arab': {
    title: 'Most Recent Arab',
    fetchUrl: '/api/slider?section=most-recent-arab&',
    header: {
      variant: 'block',
      subtitle: 'Fresh out from the Arab scene',
      icon: <Icon name='clock' strokeColor='primary' width={32} height={32} />,
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-md',
      minWidth: 250,
      maxWidth: 400,
    },
  },
  'arab-comedy': {
    title: 'Arab Comedy',
    fetchUrl: '/api/slider?section=arab-comedy&',
    header: {
      variant: 'lined',
      subtitle: 'Light-hearted Arab comedies',
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-md',
      minWidth: 250,
      maxWidth: 400,
    },
  },
  'top-horror': {
    title: 'Top Horror',
    fetchUrl: '/api/slider?section=top-horror&',
    header: {
      variant: 'ghost',
      subtitle: 'Terrifying horror films',
      icon: (
        <Icon name='skull' strokeColor='secondary' width={32} height={32} />
      ),
    },
    cardProps: {
      layout: 'wide',
      imageHeight: 'image-md',
      minWidth: 500,
      maxWidth: 500,
    },
  },
  'top-animation': {
    title: 'Top Animation',
    fetchUrl: '/api/slider?section=top-animation&',
    header: {
      variant: 'strip',
      subtitle: 'Family-friendly animated adventures',
      icon: <Icon name='dragon' strokeColor='white' width={32} height={32} />,
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-lg',
      minWidth: 250,
      maxWidth: 400,
    },
  },
  'family-picks': {
    title: 'Family Picks',
    fetchUrl: '/api/slider?section=family-picks&',
    header: {
      variant: 'block',
      subtitle: 'Most-Recent films to watch with family',
      icon: <Icon name='family' strokeColor='white' width={32} height={32} />,
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-lg',
      minWidth: 300,
      maxWidth: 400,
    },
  },
  'arab-thrillers': {
    title: 'Arab Thrillers',
    fetchUrl: '/api/slider?section=arab-thrillers&',
    header: {
      variant: 'ghost',
      subtitle: 'Edge-of-seat thrillers',
      icon: (
        <Icon name='magnifier' strokeColor='white' width={32} height={32} />
      ),
    },
    cardProps: {
      layout: 'overlay',
      imageHeight: 'image-lg',
      minWidth: 250,
      maxWidth: 400,
    },
  },
};

export default async function Home() {
  const { content } = await getContents(
    'MOVIE',
    { sortBy: 'mostRecent', lang: 'en', genres: [''] },
    0,
    4
  );

  const contents = await Promise.all(
    content.map(movie => getContentDetails(movie.slug).then(normalizeContent))
  );

  const sectionKeys = Object.keys(sectionConfig);
  const firstHalf = sectionKeys.slice(0, 4);
  const secondHalf = sectionKeys.slice(4);

  return (
    <>
      <HeroSectionWrapper contents={contents} rawContent={content} />
      <div className={styles.container}>
        {/* First half */}
        {firstHalf.map((key, index) => {
          const config = sectionConfig[key];

          const animationVariants = [
            'slide-up',
            'slide-left',
            'fade',
            'zoom',
          ] as const;
          const variantType =
            animationVariants[index % animationVariants.length];

          return (
            <MotionSection key={key} variantType={variantType}>
              <ContentSliderSectionWrapper
                title={config.title}
                fetchUrl={config.fetchUrl}
                initialFilter='MOVIE'
                showAllFilter={false}
                header={config.header}
                cardProps={config.cardProps}
              />
            </MotionSection>
          );
        })}

        {/* Mystery Section */}
        <MotionSection variantType='zoom' delay={0.2}>
          <MysterySection />
        </MotionSection>

        {/* Second half */}
        {secondHalf.map((key, index) => {
          const config = sectionConfig[key];
          const animationVariants = [
            'slide-left',
            'fade',
            'zoom',
            'slide-up',
          ] as const;
          const variantType =
            animationVariants[index % animationVariants.length];

          return (
            <MotionSection
              key={key}
              variantType={variantType}
              delay={0.1 * index}
            >
              <ContentSliderSectionWrapper
                title={config.title}
                fetchUrl={config.fetchUrl}
                initialFilter='MOVIE'
                showAllFilter={false}
                header={config.header}
                cardProps={config.cardProps}
              />
            </MotionSection>
          );
        })}
        <MotionSection variantType='fade'>
          <CommunityFloat />
        </MotionSection>
      </div>
    </>
  );
}
