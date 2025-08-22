import styles from '../profile.module.css';
import { getQueryClient } from '@/lib/getQueryClient';
import { getPublicUserProfile } from '@/lib/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { UserProfile } from '@/constants/types/movie';
import { notFound } from 'next/navigation';
import PublicTabsWrapper from '@/components/pages/profile/publicTabsWrapper';
import PublicUserInfoPanel from '@/components/pages/profile/publicUserInfoPanel';
import { Metadata } from 'next';
import { generateUserProfileMetadata } from '@/utils/metadata';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

// Generate dynamic metadata for user profile pages
export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  try {
    const { username } = await params;
    const userProfile = await getPublicUserProfile(username);

    if (!userProfile) {
      return {
        title: 'User Not Found | CineVerse',
        description: 'The requested user profile could not be found.',
      };
    }

    return generateUserProfileMetadata(userProfile);
  } catch (error) {
    return {
      title: 'User Not Found | CineVerse',
      description: 'The requested user profile could not be found.',
    };
  }
}

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

    // Generate structured data for user profile
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: userProfile.name,
        alternateName: userProfile.username,
        description:
          userProfile.bio || `${userProfile.name}'s profile on CineVerse`,
        image: userProfile.profilePicture,
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
        }/profile/${userProfile.username}`,
        sameAs: `${
          process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
        }/profile/${userProfile.username}`,
      },
    };
    const breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: userProfile.name,
          item: `${
            process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social'
          }/profile/${userProfile.username}`,
        },
      ],
    };
    return (
      <>
        {/* Structured Data */}
        <Script
          id={`${userProfile.name || userProfile.username}-schema`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...structuredData,
              breadcrumb,
            }),
          }}
        />
        <HydrationBoundary state={dehydratedState}>
          <div className={styles.container}>
            <PublicUserInfoPanel
              initialUser={userProfile}
              username={username}
            />
            <PublicTabsWrapper username={username} />
          </div>
        </HydrationBoundary>
      </>
    );
  } catch (error) {
    notFound();
  }
}
