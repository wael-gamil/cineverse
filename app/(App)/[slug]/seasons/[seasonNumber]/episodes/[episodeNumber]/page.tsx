import {
  getContentDetails,
  getSeasonDetails,
  getEpisodeDetails,
  getContentStats,
} from '@/lib/api';
import ContentHero from '@/components/shared/contentDetails/heroSection/contentHero';
import ContentOverview from '@/components/shared/contentDetails/overviewSection/contentOverview';
import ContentSectionWrapper from '@/components/shared/contentDetails/contentSectionWrapper';
import { notFound } from 'next/navigation';
import {
  Movie,
  normalizeContent,
  Season,
  Series,
} from '@/constants/types/movie';
import { getQueryClient } from '@/lib/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Script from 'next/script';

type EpisodeProps = {
  params: Promise<{
    episodeNumber: number;
    seasonNumber: number;
    slug: string;
  }>;
};
export async function generateMetadata({
  params,
}: EpisodeProps): Promise<Metadata> {
  try {
    const { episodeNumber, seasonNumber, slug } = await params;
    const seriesDetails = await getContentDetails(slug);

    if (!seriesDetails || seriesDetails.type !== 'series') {
      return {
        title: 'Episode Not Found | CineVerse',
        description: 'The requested episode could not be found.',
      };
    }

    const seasonDetails = await getSeasonDetails(
      seriesDetails.id,
      seasonNumber
    );

    if (!seasonDetails || seasonDetails.numberOfEpisodes < episodeNumber) {
      return {
        title: 'Episode Not Found | CineVerse',
        description: 'The requested episode could not be found.',
      };
    }

    const episodeDetails = await getEpisodeDetails(
      seriesDetails.id,
      seasonNumber,
      episodeNumber
    );

    if (!episodeDetails) {
      return {
        title: 'Episode Not Found | CineVerse',
        description: 'The requested episode could not be found.',
      };
    }

    const year = new Date(seasonDetails.releaseDate).getFullYear();
    const title = `${seriesDetails.title} S${seasonNumber}E${episodeNumber}: ${episodeDetails.title} (${year}) | Reviews & Guide | CineVerse`;
    const description = `${
      episodeDetails.overview ||
      `Watch ${seriesDetails.title} Season ${seasonNumber} Episode ${episodeNumber}.`
    } View episode guide, reviews, and ratings on CineVerse.`;

    return {
      title,
      description,
      keywords: [
        seriesDetails.title,
        `season ${seasonNumber}`,
        `episode ${episodeNumber}`,
        episodeDetails.title,
        'tv series',
        'television',
        'watch',
        'reviews',
        'CineVerse',
        year.toString(),
      ],
      openGraph: {
        title: `${seriesDetails.title} S${seasonNumber}E${episodeNumber}: ${episodeDetails.title}`,
        description,
        images: [
          {
            url:
              episodeDetails.posterUrl ||
              seasonDetails.posterUrl ||
              seriesDetails.posterUrl,
            width: 1200,
            height: 630,
            alt: `${seriesDetails.title} Season ${seasonNumber} Episode ${episodeNumber} poster`,
          },
        ],
        type: 'video.episode',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${seriesDetails.title} S${seasonNumber}E${episodeNumber}: ${episodeDetails.title}`,
        description,
        images: [
          episodeDetails.posterUrl ||
            seasonDetails.posterUrl ||
            seriesDetails.posterUrl,
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Episode Not Found | CineVerse',
      description: 'The requested episode could not be found.',
    };
  }
}

export default async function Episode({ params }: EpisodeProps) {
  const { episodeNumber, seasonNumber, slug } = await params;
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

    if (!details || details.type !== 'series') {
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

    if (!seasonDetails || seasonDetails.numberOfEpisodes < episodeNumber) {
      notFound();
    }

    const episodeDetails = await getEpisodeDetails(
      details.id,
      seasonNumber,
      episodeNumber
    );

    if (!episodeDetails) {
      notFound();
    }

    const dehydratedState = dehydrate(queryClient);
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'TVEpisode',
      name: episodeDetails.title,
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber,
      description: episodeDetails.overview,
      image:
        episodeDetails.posterUrl ||
        seasonDetails.posterUrl ||
        details.posterUrl,
      partOfSeries: {
        '@type': 'TVSeries',
        name: details.title,
        genre: details.genres,
      },
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
        {
          '@type': 'ListItem',
          position: 2,
          name: details.title,
          item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Season ${seasonNumber}`,
          item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: `Episode ${episodeNumber}`,
          item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
        },
      ],
    };
    return (
      <HydrationBoundary state={dehydratedState}>
        <Script
          id={`${details.title}-${seasonNumber}-${episodeNumber}-schema`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...structuredData,
              breadcrumb,
            }),
          }}
        />
        <ContentHero
          content={normalizeContent(episodeDetails)}
          backgroundUrl={details.backdropUrl}
          fallbackPoster={seasonDetails.posterUrl || details.posterUrl}
          genres={details.genres}
        />
        <ContentOverview
          content={normalizeContent(episodeDetails)}
          genres={details.genres}
        />
        <ContentSectionWrapper
          section='reviews'
          id={details.id}
          contentTitle={details.title}
          contentPoster={details.posterUrl}
          sortBy='likes'
        />
      </HydrationBoundary>
    );
  } catch (error) {
    notFound();
  }
}
