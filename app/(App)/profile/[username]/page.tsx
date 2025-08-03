import styles from '../profile.module.css';
import { getQueryClient } from '@/lib/getQueryClient';
import { getPublicUserProfile } from '@/lib/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { UserProfile } from '@/constants/types/movie';
import { notFound } from 'next/navigation';
import PublicTabsWrapper from '@/components/pages/profile/publicTabsWrapper';
import PublicUserInfoPanel from '@/components/pages/profile/publicUserInfoPanel';

export const dynamic = 'force-dynamic';

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['public-user-profile', username],
      queryFn: () => getPublicUserProfile(username),
    });

    const userProfile = queryClient.getQueryData([
      'public-user-profile',
      username,
    ]) as UserProfile | undefined;

    if (!userProfile) {
      notFound();
    }

    const dehydratedState = dehydrate(queryClient);

    return (
      <HydrationBoundary state={dehydratedState}>
        <div className={styles.container}>
          <PublicUserInfoPanel initialUser={userProfile} username={username} />
          <PublicTabsWrapper username={username} />
        </div>
      </HydrationBoundary>
    );
  } catch (error) {
    console.error('Error fetching public profile:', error);
    notFound();
  }
}
