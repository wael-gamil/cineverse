import { getExtendedPersonDetails } from '@/lib/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import { ExtendedPerson } from '@/constants/types/movie';
import HeroSectionWrapper from './heroSectionWrapper';
import ContentSliderSection from '@/components/shared/contentSliderSection/contentSliderSection';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  generatePersonMetadata,
  generatePersonStructuredData,
} from '@/utils/metadata';

type PersonPageProps = {
  params: Promise<{ id: number }>;
};

// Generate dynamic metadata for person pages
export async function generateMetadata({
  params,
}: PersonPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const person = await getExtendedPersonDetails(id);

    if (!person) {
      return {
        title: 'Person Not Found | CineVerse',
        description: 'The requested person could not be found.',
      };
    }

    return generatePersonMetadata(person);
  } catch (error) {
    return {
      title: 'Person Not Found | CineVerse',
      description: 'The requested person could not be found.',
    };
  }
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['person', id],
      queryFn: () => getExtendedPersonDetails(id),
    });

    const extendedPersonDetails = queryClient.getQueryData(['person', id]) as
      | ExtendedPerson
      | undefined;

    if (!extendedPersonDetails) {
      notFound();
    }

    const dehydratedState = dehydrate(queryClient);

    // Generate structured data for SEO
    const structuredData = generatePersonStructuredData(extendedPersonDetails);

    return (
      <>
        {/* Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

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
      </>
    );
  } catch (error) {
    notFound();
  }
}
