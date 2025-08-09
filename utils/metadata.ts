import { Metadata } from 'next';
import {
  Movie,
  Series,
  ExtendedPerson,
  UserProfile,
  NormalizedContent,
} from '@/constants/types/movie';

const SITE_NAME = 'CineVerse';
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse-xi.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/og-logo.png`;
const WHATSAPP_IMAGE = `${SITE_URL}/whatsapp-share-400x400.webp`;

// Base metadata that appears on all pages
export const baseMetadata: Partial<Metadata> = {
  metadataBase: new URL(SITE_URL),
  authors: [
    { name: 'Wael Gamil', url: 'https://www.linkedin.com/in/wael-gamil/' },
    {
      name: 'Mahmoud Abdelfattah',
      url: 'https://www.linkedin.com/in/mahmoud-a-fattah',
    },
  ],
  creator: 'CineVerse Team',
  publisher: 'CineVerse',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
};

// Generate metadata for movie/series content
export function generateContentMetadata(
  content: Movie | Series,
  slug: string
): Metadata {
  const isMovie = content.type === 'movie';
  const contentType = isMovie ? 'Movie' : 'TV Series';
  const year = new Date(content.releaseDate).getFullYear();
  const rating = content.imdbRate ? `${content.imdbRate}/10 IMDb` : '';
  const genres = content.genres.slice(0, 3).join(', ');

  const title = `${content.title} (${year}) | ${contentType} | ${SITE_NAME}`;
  const description = `${content.overview.substring(0, 150)}... ${
    rating ? `Rated ${rating}.` : ''
  } ${
    genres ? `Genres: ${genres}.` : ''
  } Watch, review, and add to your watchlist on ${SITE_NAME}.`;

  // Generate dynamic OG image URL as fallback
  const fallbackOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(
    content.title
  )}&subtitle=${encodeURIComponent(contentType + ' • ' + year)}`;

  const keywords = [
    content.title,
    ...content.genres,
    year.toString(),
    isMovie ? 'movie' : 'tv series',
    isMovie ? 'film' : 'television',
    'watch',
    'review',
    'watchlist',
    SITE_NAME.toLowerCase(),
  ];

  // Add production country and language if available
  if (content.language) keywords.push(content.language);
  if (content.productionCountry) keywords.push(content.productionCountry);

  return {
    ...baseMetadata,
    title,
    description,
    keywords,
    openGraph: {
      title: `${content.title} (${year})`,
      description,
      url: `${SITE_URL}/${slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: content.posterUrl || fallbackOgImage,
          width: 1200,
          height: 630,
          alt: `${content.title} poster`,
        },
        {
          url: content.backdropUrl || content.posterUrl || fallbackOgImage,
          width: 1920,
          height: 1080,
          alt: `${content.title} backdrop`,
        },
        // WhatsApp-optimized image
        {
          url: WHATSAPP_IMAGE,
          width: 400,
          height: 400,
          alt: `${content.title} on ${SITE_NAME}`,
        },
      ],
      type: 'video.movie',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${content.title} (${year})`,
      description,
      images: [content.posterUrl || fallbackOgImage],
      creator: '@cineverse',
      site: '@cineverse',
    },
    alternates: {
      canonical: `${SITE_URL}/${slug}`,
    },
    other: {
      'article:published_time': content.releaseDate,
      'article:modified_time': new Date().toISOString(),
      'article:section': isMovie ? 'Movies' : 'TV Series',
      'article:tag': content.genres.join(','),
    },
  };
}

// Generate metadata for person/crew pages
export function generatePersonMetadata(person: ExtendedPerson): Metadata {
  const age = person.birthday
    ? `${Math.floor(
        (new Date().getTime() - new Date(person.birthday).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )} years old`
    : '';

  const title = `${person.name} - ${person.knownForDepartment} Profile | ${SITE_NAME}`;
  const description = `${person.biography.substring(0, 150)}... ${
    age ? `${age}.` : ''
  } ${
    person.placeOfBirth ? `Born in ${person.placeOfBirth}.` : ''
  } View complete filmography and biography on ${SITE_NAME}.`;

  // Generate dynamic OG image URL as fallback
  const fallbackOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(
    person.name
  )}&subtitle=${encodeURIComponent(person.knownForDepartment)}`;

  const keywords = [
    person.name,
    person.knownForDepartment.toLowerCase(),
    'actor',
    'actress',
    'director',
    'filmmaker',
    'biography',
    'filmography',
    'movies',
    SITE_NAME.toLowerCase(),
    ...person.alsoKnownAs.slice(0, 3),
  ];

  if (person.placeOfBirth) keywords.push(person.placeOfBirth);

  return {
    ...baseMetadata,
    title,
    description,
    keywords,
    openGraph: {
      title: person.name,
      description,
      url: `${SITE_URL}/crew/${person.id}`,
      siteName: SITE_NAME,
      images: [
        {
          url: person.imageUrl || fallbackOgImage,
          width: 1200,
          height: 630,
          alt: `${person.name} photo`,
        },
        // WhatsApp-optimized image
        {
          url: WHATSAPP_IMAGE,
          width: 400,
          height: 400,
          alt: `${person.name} on ${SITE_NAME}`,
        },
      ],
      type: 'profile',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: person.name,
      description,
      images: [person.imageUrl || fallbackOgImage],
    },
    alternates: {
      canonical: `${SITE_URL}/crew/${person.id}`,
    },
  };
}

// Generate metadata for user profile pages
export function generateUserProfileMetadata(user: UserProfile): Metadata {
  const title = `${user.name ?? ''} (@${
    user.username
  }) - Profile | ${SITE_NAME}`;
  const description = `${
    user.bio
      ? user.bio.substring(0, 150)
      : `${user.name}'s profile on ${SITE_NAME}`
  }. View ${user.username}'s movie reviews, watchlist, and ratings.`;

  return {
    ...baseMetadata,
    title,
    description,
    keywords: [
      user.name,
      user.username,
      'profile',
      'reviews',
      'watchlist',
      'ratings',
      SITE_NAME.toLowerCase(),
    ],
    openGraph: {
      title: `${user.name} (@${user.username})`,
      description,
      url: `${SITE_URL}/profile/${user.username}`,
      siteName: SITE_NAME,
      images: [
        {
          url: user.profilePicture || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: `${user.name ? user.name : user.username}'s profile picture`,
        },
      ],
      type: 'profile',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title: `${user.name} (@${user.username})`,
      description,
      images: [user.profilePicture || DEFAULT_IMAGE],
    },
    alternates: {
      canonical: `${SITE_URL}/profile/${user.username}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Generate metadata for explore pages
export function generateExploreMetadata(
  type: 'movies' | 'tv-series',
  filters: { genres?: string[]; year?: string; sortBy?: string }
): Metadata {
  const contentType = type === 'movies' ? 'Movies' : 'TV Series';
  const year = filters.year ? ` ${filters.year}` : '';
  const genres =
    filters.genres && filters.genres.length > 0 ? ` ${filters.genres[0]}` : '';
  const sortBy = filters.sortBy
    ? ` - ${filters.sortBy === 'mostRecent' ? 'Latest' : 'Top Rated'}`
    : '';

  const title = `${genres}${contentType}${year}${sortBy} | Discover & Watch | ${SITE_NAME}`;
  const description = `Discover the best${genres.toLowerCase()} ${contentType.toLowerCase()}${year}. Browse, filter, and sort by ratings, genres, and release date. Add to your watchlist and share reviews on ${SITE_NAME}.`;

  // Generate dynamic OG image URL
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
    `Discover ${contentType}`
  )}&subtitle=${encodeURIComponent(`${genres}${year}${sortBy}`)}`;

  const keywords = [
    contentType.toLowerCase(),
    type,
    'discover',
    'browse',
    'watch',
    'filter',
    'sort',
    'ratings',
    'reviews',
    SITE_NAME.toLowerCase(),
  ];

  if (filters.genres) keywords.push(...filters.genres);
  if (filters.year) keywords.push(filters.year);

  return {
    ...baseMetadata,
    title,
    description,
    keywords,
    openGraph: {
      title: `Discover ${contentType}${year}`,
      description,
      url: `${SITE_URL}/explore/${type}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Discover ${contentType} on ${SITE_NAME}`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Discover ${contentType}${year}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/explore/${type}`,
    },
  };
}

// Generate metadata for home page
export function generateHomeMetadata(): Metadata {
  const title = `${SITE_NAME} - Discover, Track & Review Movies and TV Series`;
  const description = `The ultimate platform for movie and TV series enthusiasts. Discover new content, create personalized watchlists, share detailed reviews, and connect with fellow cinema lovers. Track what you've watched and find your next favorite film or series.`;

  return {
    ...baseMetadata,
    title,
    description,
    keywords: [
      'movies',
      'tv series',
      'television',
      'cinema',
      'film',
      'watchlist',
      'reviews',
      'ratings',
      'discover',
      'track',
      'streaming',
      'entertainment',
      SITE_NAME.toLowerCase(),
    ],
    openGraph: {
      title: SITE_NAME,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Movie and TV Series Platform`,
        },
        // WhatsApp-optimized image
        {
          url: WHATSAPP_IMAGE,
          width: 400,
          height: 400,
          alt: `${SITE_NAME} - Discover Movies & TV Series`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description,
      images: [DEFAULT_IMAGE],
      creator: '@cineverse',
      site: '@cineverse',
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

// Generate structured data (JSON-LD) for movies/series
export function generateMovieStructuredData(
  content: Movie | Series,
  slug: string
) {
  const isMovie = content.type === 'movie';

  return {
    '@context': 'https://schema.org',
    '@type': isMovie ? 'Movie' : 'TVSeries',
    name: content.title,
    description: content.overview,
    image: content.posterUrl,
    datePublished: content.releaseDate,
    genre: content.genres,
    inLanguage: content.language,
    countryOfOrigin: content.productionCountry,
    ...(content.imdbRate && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: content.imdbRate,
        bestRating: 10,
        worstRating: 1,
        ratingCount: 1000, // You might want to fetch actual count
      },
    }),
    ...(isMovie &&
      'runtime' in content && {
        duration: `PT${content.runtime}M`,
      }),
    ...(!isMovie &&
      'numberOfSeasons' in content && {
        numberOfSeasons: content.numberOfSeasons,
        numberOfEpisodes: content.numberOfEpisodes,
      }),
    url: `${SITE_URL}/${slug}`,
    sameAs: [`${SITE_URL}/${slug}`],
  };
}

// Generate structured data for person
export function generatePersonStructuredData(person: ExtendedPerson) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    description: person.biography,
    image: person.imageUrl,
    birthDate: person.birthday,
    ...(person.deathday && { deathDate: person.deathday }),
    birthPlace: person.placeOfBirth,
    jobTitle: person.knownForDepartment,
    alternateName: person.alsoKnownAs,
    url: `${SITE_URL}/crew/${person.id}`,
  };
}
