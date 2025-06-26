import {
  getContentDetails,
  getContentTrailer,
  getContentStats,
} from '@/lib/api';
import { normalizeContent } from '@/constants/types/movie';
import ContentHero from '@/components/shared/contentDetails/heroSection/contentHero';
import ContentOverview from '@/components/shared/contentDetails/overviewSection/contentOverview';
import ContentSectionWrapper from '@/components/shared/contentDetails/contentSectionWrapper';
import SetSeriesStore from '@/utils/useSetSeriesStore';
type MovieOrSeriesPageProps = {
  params: Promise<{ slug: string }>;
};
export default async function MovieOrSeriesPage({
  params,
}: MovieOrSeriesPageProps) {
  const { slug } = await params;
  const details = await getContentDetails(slug);
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
