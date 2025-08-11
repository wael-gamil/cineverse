import {
  getContentDetails,
  getSeasonDetails,
  getContentReviews,
  getContentStats,
} from '@/lib/api';
import ContentHero from '@/components/shared/contentDetails/heroSection/contentHero';
import ContentOverview from '@/components/shared/contentDetails/overviewSection/contentOverview';
import ContentSectionWrapper from '@/components/shared/contentDetails/contentSectionWrapper';
import { notFound } from 'next/navigation';
import { Movie, normalizeContent, Series } from '@/constants/types/movie';
import type { Season } from '@/constants/types/movie';
import { getQueryClient } from '@/lib/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

type SeasonProps = {
  params: Promise<{ seasonNumber: number; slug: string }>;
};

// Generate dynamic metadata for season pages
export async function generateMetadata({
  params,
}: SeasonProps): Promise<Metadata> {
  try {
    const { seasonNumber, slug } = await params;
    const seriesDetails = await getContentDetails(slug);

    if (!seriesDetails || seriesDetails.type !== 'series') {
      return {
        title: 'Season Not Found | CineVerse',
        description: 'The requested season could not be found.',
      };
    }

    const seasonDetails = await getSeasonDetails(
      seriesDetails.id,
      seasonNumber
    );

    if (!seasonDetails) {
      return {
        title: 'Season Not Found | CineVerse',
        description: 'The requested season could not be found.',
      };
    }

    const year = new Date(seasonDetails.releaseDate).getFullYear();
    const title = `${seriesDetails.title} Season ${seasonNumber} (${year}) | Episodes & Reviews | CineVerse`;
    const description = `${
      seasonDetails.overview ||
      `Watch ${seriesDetails.title} Season ${seasonNumber} with ${seasonDetails.numberOfEpisodes} episodes.`
    } View episode guide, reviews, and ratings on CineVerse.`;

    return {
      title,
      description,
      keywords: [
        seriesDetails.title,
        `season ${seasonNumber}`,
        'episodes',
        'tv series',
        'television',
        'watch',
        'reviews',
        'CineVerse',
        year.toString(),
      ],
      openGraph: {
        title: `${seriesDetails.title} Season ${seasonNumber}`,
        description,
        images: [
          {
            url: seasonDetails.posterUrl || seriesDetails.posterUrl,
            width: 1200,
            height: 630,
            alt: `${seriesDetails.title} Season ${seasonNumber} poster`,
          },
        ],
        type: 'video.tv_show',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${seriesDetails.title} Season ${seasonNumber}`,
        description,
        images: [seasonDetails.posterUrl || seriesDetails.posterUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Season Not Found | CineVerse',
      description: 'The requested season could not be found.',
    };
  }
}
export default async function Season({ params }: SeasonProps) {
  const { seasonNumber, slug } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['content', slug],
    queryFn: () => getContentDetails(slug),
  });
  const details = queryClient.getQueryData(['content', slug]) as Movie | Series;
  if (details.type !== 'series' || details.numberOfSeasons < seasonNumber) {
    notFound();
  }
  await queryClient.prefetchQuery({
    queryKey: ['season', details.id, seasonNumber],
    queryFn: () => getSeasonDetails(details.id, seasonNumber),
  });
  const seasonDetails = queryClient.getQueryData([
    'season',
    details.id,
    seasonNumber,
  ]) as Season;
  const dehydratedState = dehydrate(queryClient);

  // Generate structured data for season
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeason',
    partOfSeries: {
      '@type': 'TVSeries',
      name: details.title,
      genre: details.genres,
    },
    name: `${details.title} Season ${seasonNumber}`,
    seasonNumber: seasonNumber,
    numberOfEpisodes: seasonDetails.numberOfEpisodes,
    datePublished: seasonDetails.releaseDate,
    description:
      seasonDetails.overview || `Season ${seasonNumber} of ${details.title}`,
    image: seasonDetails.posterUrl || details.posterUrl,
    ...(seasonDetails.imdbRate && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: seasonDetails.imdbRate,
        bestRating: 10,
        worstRating: 1,
      },
    }),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <HydrationBoundary state={dehydratedState}>
        <ContentHero
          content={normalizeContent(seasonDetails)}
          backgroundUrl={details.backdropUrl}
          fallbackPoster={details.posterUrl}
          genres={details.genres}
        />
        <ContentOverview
          content={normalizeContent(seasonDetails)}
          genres={details.genres}
        />

        <ContentSectionWrapper
          section='episodes'
          id={details.id}
          seasonNumber={seasonNumber}
          fallbackPoster={seasonDetails.posterUrl || details.posterUrl}
          seasonsData={[seasonDetails]}
        />
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
}
