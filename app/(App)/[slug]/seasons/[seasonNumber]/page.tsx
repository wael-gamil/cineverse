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
import { normalizeContent } from '@/constants/types/movie';
type SeasonProps = {
  params: Promise<{ seasonNumber: number; slug: string }>;
};
export default async function Season({ params }: SeasonProps) {
  const { seasonNumber, slug } = await params;
  const contentDetails = await getContentDetails(slug);
  if (
    contentDetails.type !== 'series' ||
    contentDetails.numberOfSeasons < seasonNumber
  ) {
    notFound();
  }
  const seasonDetails = await getSeasonDetails(contentDetails.id, seasonNumber);
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
