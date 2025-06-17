import {
  getContentDetails,
  getSeasonDetails,
  getContentReviews,
} from '@/app/lib/api';
import ContentHero from '@/app/components/shared/contentDetails/contentHero';
import { notFound } from 'next/navigation';
import { normalizeContent } from '@/app/constants/types/movie';
export default async function Season({
  params,
}: {
  params: { seasonNumber: number; slug: string };
}) {
  const contentDetails = await getContentDetails(params.slug);
  console.log(contentDetails);
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
  const contentReviews = await getContentReviews(seasonDetails.id);

  console.log(contentReviews);
  return (
    <>
      <ContentHero
        content={normalizeContent(seasonDetails)}
        backgroundUrl={contentDetails.backdropPath}
        genres={contentDetails.genres}
      />
    </>
  );
}
