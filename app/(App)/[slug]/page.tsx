import {
  getContentDetails,
  getContentTrailer,
  getContentStats,
} from '@/app/lib/api';
import { normalizeContent } from '@/app/constants/types/movie';
import ContentHero from '@/app/components/shared/contentDetails/contentHero';
import ContentOverview from '@/app/components/shared/contentDetails/contentOverview';
import ContentSectionWrapper from '@/app/components/shared/contentDetails/contentSectionWrapper';
export default async function MovieOrSeriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const awaitedParams = await params;
  const details = await getContentDetails(awaitedParams.slug);
  // const trailer = await getContentTrailer(details.id);
  const stats = await getContentStats(details.id);
  return (
    <>
      {/* <ContentHero
        content={normalizeContent(details)}
        trailerUrl={trailer.trailer}
      /> */}
      <ContentHero
        content={normalizeContent(details)}
        backgroundUrl={details.backdropPath}
      />
      <ContentOverview
        content={normalizeContent(details)}
        totalReviews={stats.totalReviews}
        watchlistCount={stats.watchlistCount}
      />
      <ContentSectionWrapper section='credits' id={details.id} />
      {details.type === 'series' && (
        <ContentSectionWrapper section='seasons' id={details.id} />
      )}
      <ContentSectionWrapper section='reviews' id={details.id} />
    </>
  );
}
