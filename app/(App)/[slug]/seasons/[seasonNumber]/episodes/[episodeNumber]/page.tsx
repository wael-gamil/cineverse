import {
  getContentDetails,
  getSeasonDetails,
  getEpisodeDetails,
  getContentStats,
} from '@/app/lib/api';
import ContentHero from '@/app/components/shared/contentDetails/heroSection/contentHero';
import ContentOverview from '@/app/components/shared/contentDetails/overviewSection/contentOverview';
import ContentSectionWrapper from '@/app/components/shared/contentDetails/contentSectionWrapper';
import { notFound } from 'next/navigation';
import { normalizeContent } from '@/app/constants/types/movie';

export default async function Episode({
  params,
}: {
  params: { episodeNumber: number; seasonNumber: number; slug: string };
}) {
  const contentDetails = await getContentDetails(params.slug);
  if (contentDetails.type !== 'series') {
    notFound();
  }
  const seasonDetails = await getSeasonDetails(
    contentDetails.id,
    params.seasonNumber
  );
  if (seasonDetails.numberOfEpisodes < params.episodeNumber) {
    notFound();
  }
  const episodeDetails = await getEpisodeDetails(
    contentDetails.id,
    params.seasonNumber,
    params.episodeNumber
  );
  const stats = await getContentStats(episodeDetails.id);
  return (
    <>
      <ContentHero
        content={normalizeContent(episodeDetails)}
        backgroundUrl={contentDetails.backdropPath}
        genres={contentDetails.genres}
      />
      <ContentOverview
        content={normalizeContent(episodeDetails)}
        totalReviews={stats.totalReviews}
        watchlistCount={stats.watchlistCount}
        genres={contentDetails.genres}
      />
      <ContentSectionWrapper section='reviews' id={contentDetails.id} />
    </>
  );
}
