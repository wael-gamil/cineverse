import { getExtendedPersonDetails } from '@/lib/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import { ExtendedPerson } from '@/constants/types/movie';
import HeroSectionWrapper from './heroSectionWrapper';
import ContentSliderSection from '@/components/shared/contentSliderSection/contentSliderSection';
type PersonPageProps = {
  params: Promise<{ id: number }>;
};
export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['person', id],
    queryFn: () => getExtendedPersonDetails(id),
  });
  const extendedPersonDetails = queryClient.getQueryData([
    'person',
    id,
  ]) as ExtendedPerson;
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <HeroSectionWrapper person={extendedPersonDetails} />

      <ContentSliderSection
        title={`${extendedPersonDetails.name}'s Filmography`}
        fetchUrl={`/api/crew/contents?id=${extendedPersonDetails.id}&`}
        header={{
          variant: 'lined',
          subtitle: 'Film and TV appearances',
        }}
        cardProps={{
          layout: 'overlay',
          imageHeight: 'image-lg',
          minWidth: 250,
          maxWidth: 400,
        }}
      />
    </HydrationBoundary>
  );
}
