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
type SeasonProps = {
  params: Promise<{ seasonNumber: number; slug: string }>;
};
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
  return (
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
      />
    </HydrationBoundary>
  );
}
