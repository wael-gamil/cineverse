import { getContentDetails } from '@/lib/api';
import { Movie, normalizeContent, Series } from '@/constants/types/movie';
import ContentHero from '@/components/shared/contentDetails/heroSection/contentHero';
import ContentOverview from '@/components/shared/contentDetails/overviewSection/contentOverview';
import ContentSectionWrapper from '@/components/shared/contentDetails/contentSectionWrapper';
import SetSeriesStore from '@/utils/useSetSeriesStore';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  generateContentMetadata,
  generateMovieStructuredData,
} from '@/utils/metadata';
import Script from 'next/script';

type MovieOrSeriesPageProps = {
  params: Promise<{ slug: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: MovieOrSeriesPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const details = await getContentDetails(slug);

    if (!details) {
      return {
        title: 'Content Not Found | CineVerse',
        description: 'The requested movie or TV series could not be found.',
      };
    }

    return generateContentMetadata(details, slug);
  } catch (error) {
    return {
      title: 'Content Not Found | CineVerse',
      description: 'The requested movie or TV series could not be found.',
    };
  }
}

export default async function MovieOrSeriesPage({
  params,
}: MovieOrSeriesPageProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['content', slug],
      queryFn: () => getContentDetails(slug),
    });

    const details = queryClient.getQueryData(['content', slug]) as
      | Movie
      | Series
      | undefined;

    if (!details) {
      notFound();
    }

    const dehydratedState = dehydrate(queryClient);

    // Generate structured data for SEO
    const structuredData = generateMovieStructuredData(details, slug);
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
        {
          '@type': 'ListItem',
          position: 2,
          name: details.title,
          item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
        },
      ],
    };
    return (
      <>
        {/* Structured Data */}
        <Script
          id={`${details.title}-schema`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...structuredData,
              breadcrumb,
            }),
          }}
        />
        <HydrationBoundary state={dehydratedState}>
          <ContentHero content={normalizeContent(details)} />
          <ContentOverview content={normalizeContent(details)} />
          <ContentSectionWrapper section='credits' id={details.id} />
          {details.type === 'series' && (
            <>
              <SetSeriesStore data={details} />
              <ContentSectionWrapper section='seasons' id={details.id} />
            </>
          )}{' '}
          <ContentSectionWrapper
            section='reviews'
            id={details.id}
            contentTitle={details.title}
            contentPoster={details.posterUrl}
            sortBy='likes'
          />
        </HydrationBoundary>
      </>
    );
  } catch (error) {
    notFound();
  }
}
