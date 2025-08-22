import { normalizeContent } from '@/constants/types/movie';
import HeroSectionWrapper from '../../../components/shared/homePage/heroSectionWrapper';
import { getContentDetails, getContents } from '@/lib/api';
import CommunityFloat from '../../../components/shared/homePage/communityFloat';
import styles from './page.module.css';
import ContentSliderSectionWrapper from '@/components/shared/contentSliderSection/contentSliderSectionWrapper';
import MysterySection from '@/components/shared/homePage/mysterySection';
import { Icon } from '@/components/ui/icon/icon';
import MotionSection from '@/components/shared/motionSection';
import { Metadata } from 'next';
import { generateHomeMetadata } from '@/utils/metadata';
import { cookies } from 'next/headers';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

// Enhanced metadata for home page
export const metadata: Metadata = generateHomeMetadata();

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
      subtitle: 'Best according to IMDb rating',
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
      subtitle: 'Critically acclaimed Arab content',
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
      subtitle: 'Terrifying horror content',
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
      subtitle: 'Most-Recent content to watch with family',
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
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
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

  // Generate structured data for home page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CineVerse',
    alternateName: 'CineVerse - Movie and TV Series Platform',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
    description:
      'The ultimate platform for movie and TV series enthusiasts. Discover new content, create personalized watchlists, share detailed reviews, and connect with fellow cinema lovers.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
        }/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'],
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
      },
    ],
  };
  return (
    <>
      {/* Structured Data */}
      <Script
        id='home-page-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...structuredData,
            breadcrumb,
          }),
        }}
      />
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
        {token && (
          <MotionSection variantType='fade'>
            <CommunityFloat />
          </MotionSection>
        )}
      </div>
    </>
  );
}
