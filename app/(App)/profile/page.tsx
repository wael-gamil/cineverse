import UserInfoPanel from '@/components/pages/profile/userInfoPanel';
import styles from './profile.module.css';
import { getQueryClient } from '@/lib/getQueryClient';
import TabsWrapper from '@/components/pages/profile/tabsWrapper';
import { getUserProfile } from '@/lib/api';
import { cookies } from 'next/headers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { UserProfile } from '@/constants/types/movie';
import NotFoundClient from '@/components/shared/notFound/notFoundClient';

export default async function ProfilePage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    return <NotFoundClient type='user' />;
  }
  await queryClient.prefetchQuery({
    queryKey: ['user-profile'],
    queryFn: () => getUserProfile(token),
  });
  const userProfile = queryClient.getQueryData(['user-profile']) as
    | UserProfile
    | undefined;
  if (!userProfile) {
    return <NotFoundClient type='user' />;
  }
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className={styles.container}>
        <UserInfoPanel initialUser={userProfile} />
        <TabsWrapper />
      </div>
    </HydrationBoundary>
  );
}
