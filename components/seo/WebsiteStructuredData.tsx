'use client';

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CineVerse',
    description:
      'The ultimate platform for movie and TV series enthusiasts. Discover new content, create personalized watchlists, share detailed reviews, and connect with fellow cinema lovers.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse-xi.vercel.app',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${
            process.env.NEXT_PUBLIC_SITE_URL ||
            'https://cineverse-xi.vercel.app'
          }/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/in/wael-gamil/',
      'https://github.com/wael-gamil',
      'https://www.linkedin.com/in/mahmoud-a-fattah',
      'https://github.com/MahmoudAbdulfattah1',
    ],
    author: {
      '@type': 'Organization',
      name: 'CineVerse Team',
      foundingDate: '2025',
      description: 'Movie and TV series platform developers',
      member: [
        {
          '@type': 'Person',
          name: 'Wael Gamil',
          url: 'https://www.linkedin.com/in/wael-gamil/',
          jobTitle: 'Developer',
        },
        {
          '@type': 'Person',
          name: 'Mahmoud Abdelfattah',
          url: 'https://www.linkedin.com/in/mahmoud-a-fattah',
          jobTitle: 'Developer',
        },
      ],
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Movie and TV enthusiasts',
    },
    category: 'Entertainment',
    keywords: [
      'movies',
      'tv series',
      'watchlist',
      'reviews',
      'cinema',
      'entertainment',
      'streaming',
    ],
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
