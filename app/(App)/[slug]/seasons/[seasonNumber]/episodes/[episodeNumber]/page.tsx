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
import { normalizeContent } from '@/constants/types/movie';

type EpisodeProps = {
  params: Promise<{
    episodeNumber: number;
    seasonNumber: number;
    slug: string;
  }>;
};
export default async function Episode({ params }: EpisodeProps) {
  const { episodeNumber, seasonNumber, slug } = await params;
  const contentDetails = await getContentDetails(slug);
  if (contentDetails.type !== 'series') {
    notFound();
  }
  const seasonDetails = await getSeasonDetails(contentDetails.id, seasonNumber);
  if (seasonDetails.numberOfEpisodes < episodeNumber) {
    notFound();
  }
  const episodeDetails = await getEpisodeDetails(
    contentDetails.id,
    seasonNumber,
    episodeNumber
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
