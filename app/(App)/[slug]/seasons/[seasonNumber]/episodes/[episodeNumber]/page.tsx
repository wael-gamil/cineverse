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

type EpisodeProps = {
  params: Promise<{
    episodeNumber: number;
    seasonNumber: number;
    slug: string;
  }>;
};
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

    return (
      <HydrationBoundary state={dehydratedState}>
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
    console.error('Error fetching episode details:', error);
    notFound();
  }
}
