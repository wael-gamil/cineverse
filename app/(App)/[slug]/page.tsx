import {
  getContentDetails,
  getContentTrailer,
  getContentStats,
} from '@/app/lib/api';
import { normalizeContent } from '@/app/constants/types/movie';
import ContentHero from '@/app/components/shared/contentDetails/contentHero';
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
    </>
  );
}
