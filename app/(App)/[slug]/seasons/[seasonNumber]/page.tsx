import {
  getContentDetails,
  getSeasonDetails,
  getContentReviews,
  getContentStats,
} from '@/app/lib/api';
import ContentHero from '@/app/components/shared/contentDetails/heroSection/contentHero';
import ContentOverview from '@/app/components/shared/contentDetails/overviewSection/contentOverview';
import ContentSectionWrapper from '@/app/components/shared/contentDetails/contentSectionWrapper';
import { notFound } from 'next/navigation';
import { normalizeContent } from '@/app/constants/types/movie';
export default async function Season({
  params,
}: {
  params: { seasonNumber: number; slug: string };
}) {
  const contentDetails = await getContentDetails(params.slug);
  if (
    contentDetails.type !== 'series' ||
    contentDetails.numberOfSeasons < params.seasonNumber
  ) {
    notFound();
  }
  const seasonDetails = await getSeasonDetails(
    contentDetails.id,
    params.seasonNumber
  );
  const stats = await getContentStats(seasonDetails.id);
  return (
    <>
      <ContentHero
        content={normalizeContent(seasonDetails)}
        backgroundUrl={contentDetails.backdropPath}
        genres={contentDetails.genres}
      />
      <ContentOverview
        content={normalizeContent(seasonDetails)}
        totalReviews={stats.totalReviews}
        watchlistCount={stats.watchlistCount}
        genres={contentDetails.genres}
      />
      <ContentSectionWrapper section='reviews' id={contentDetails.id} />
    </>
  );
}
