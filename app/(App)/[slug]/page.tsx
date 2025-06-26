import {
  getContentDetails,
  getContentTrailer,
  getContentStats,
} from '@/app/lib/api';
import { normalizeContent } from '@/app/constants/types/movie';
import ContentHero from '@/app/components/shared/contentDetails/heroSection/contentHero';
import ContentOverview from '@/app/components/shared/contentDetails/overviewSection/contentOverview';
import ContentSectionWrapper from '@/app/components/shared/contentDetails/contentSectionWrapper';
import SetSeriesStore from '@/app/utils/useSetSeriesStore';
export default async function MovieOrSeriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const awaitedParams = await params;
  const details = await getContentDetails(awaitedParams.slug);
  const trailer = await getContentTrailer(details.id);
  const stats = await getContentStats(details.id);
  return (
    <>
      <ContentHero
        content={normalizeContent(details)}
        trailerUrl={trailer.trailer}
      />
      <ContentOverview
        content={normalizeContent(details)}
        totalReviews={stats.totalReviews}
        watchlistCount={stats.watchlistCount}
        platformRate={stats.platformRate}
      />
      <ContentSectionWrapper section='credits' id={details.id} />
      {details.type === 'series' && (
        <>
          <SetSeriesStore data={details} />
          <ContentSectionWrapper section='seasons' id={details.id} />
        </>
      )}
      <ContentSectionWrapper section='reviews' id={details.id} />
    </>
  );
}
