'use client';

import ContentHeroSimple from '@/components/shared/contentDetails/heroSection/contentHeroSimple';
import { UserProfile } from '@/constants/types/movie';
import { usePublicUserProfileQuery } from '@/hooks/usePublicUserProfileQuery';

type PublicUserInfoPanelProps = {
  initialUser: UserProfile;
  username: string;
};

export default function PublicUserInfoPanel({
  initialUser,
  username,
}: PublicUserInfoPanelProps) {
  const { data: user = initialUser } = usePublicUserProfileQuery(username);
  const infoCards = [
    {
      iconName: 'calendar' as const,
      title: 'Joined',
      description: new Date(user.createdAt).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      }),
    },
    {
      iconName: 'bookmark' as const,
      title: 'Watchlist',
      description: '0',
    },
    {
      iconName: 'star' as const,
      title: 'Reviews',
      description: '0',
    },
  ];
  return (
    <ContentHeroSimple
      title={user.name || user.username}
      image={user.profilePicture || 'https://placehold.co/275x400?text=Avatar'}
      infoCards={infoCards}
      bio={user.bio || `${user.username}'s profile`}
    />
  );
}
