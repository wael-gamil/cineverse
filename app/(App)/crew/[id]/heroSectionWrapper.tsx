'use client';

import { useSocialQuery } from '@/hooks/useSocialQuery';
import { ExtendedPerson } from '@/constants/types/movie';
import ContentHeroSimple from '@/components/shared/contentDetails/heroSection/contentHeroSimple';
import AvatarFallback from '@/public/avatar_fallback.png';

type heroSectionWrapperProps = {
  person: ExtendedPerson;
};

export default function heroSectionWrapper({
  person,
}: heroSectionWrapperProps) {
  const { data: socialLinks } = useSocialQuery(person.id);
  // Combine birthday and deathday into a single info card

  // Helper to calculate age
  function calculateAge(
    birthDateStr?: string,
    deathDateStr?: string
  ): number | undefined {
    if (!birthDateStr) return undefined;
    const birthDate = new Date(birthDateStr);
    const endDate = deathDateStr ? new Date(deathDateStr) : new Date();
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const m = endDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const age = calculateAge(
    person.birthday ?? undefined,
    person.deathday ?? undefined
  );

  // Ensure image is always a string
  const imageSrc =
    typeof person.path === 'string'
      ? person.path
      : (AvatarFallback as { src: string }).src ?? '';

  // Build infoCards array conditionally
  const infoCards = [];

  if (age !== undefined || person.birthday) {
    infoCards.push({
      iconName: 'calendar' as const,
      title: 'Age & Birthday',
      description: age !== undefined ? `${age} years` : undefined,
      subtitle: person.birthday ? person.birthday : undefined,
    });
  }
  if (person.deathday) {
    infoCards.push({
      iconName: 'clock' as const,
      title: 'Death Year',
      description: person.deathday ? person.deathday : undefined,
    });
  }
  if (person.placeOfBirth) {
    infoCards.push({
      iconName: 'location' as const,
      title: 'Place of Birth',
      description: person.placeOfBirth,
    });
  }

  return (
    <ContentHeroSimple
      image={imageSrc}
      badges={[person.knownForDepartment]}
      title={person.name}
      alsoKnownAs={person.alsoKnownAs}
      infoCards={infoCards}
      socialLinks={socialLinks}
      bio={person.biography}
    />
  );
}
