import SkeletonExtendedReviewCard from '@/components/cards/extendedReviewCard/skeletonExtendedReviewCard';

export default function SkeletonReviewsList() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonExtendedReviewCard key={index} />
      ))}
    </>
  );
}
