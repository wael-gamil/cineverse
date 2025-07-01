import {
  getContentDetails,
} from '@/lib/api';
import { Movie, normalizeContent, Series } from '@/constants/types/movie';
import ContentHero from '@/components/shared/contentDetails/heroSection/contentHero';
import ContentOverview from '@/components/shared/contentDetails/overviewSection/contentOverview';
import ContentSectionWrapper from '@/components/shared/contentDetails/contentSectionWrapper';
import SetSeriesStore from '@/utils/useSetSeriesStore';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
type MovieOrSeriesPageProps = {
  params: Promise<{ slug: string }>;
};
export default async function MovieOrSeriesPage({
  params,
}: MovieOrSeriesPageProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['content', slug],
    queryFn: () => getContentDetails(slug),
  });
  const details = queryClient.getQueryData(['content', slug]) as
    | Movie
    | Series
    | undefined;
  if (!details) {
    throw new Error('Content details not found');
  }
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <ContentHero content={normalizeContent(details)} />
      <ContentOverview content={normalizeContent(details)} />
      <ContentSectionWrapper section='credits' id={details.id} />
      {details.type === 'series' && (
        <>
          <SetSeriesStore data={details} />
          <ContentSectionWrapper section='seasons' id={details.id} />
        </>
      )}
      <ContentSectionWrapper section='reviews' id={details.id} />
    </HydrationBoundary>
  );
}
