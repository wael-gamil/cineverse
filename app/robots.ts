import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse-xi.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/explore/', '/reviews', '/search', '/crew/', '/profile/'],
        disallow: [
          '/api/',
          '/watchlist',
          '/login',
          '/register',
          '/verify',
          '/forget-password',
          '/reset-password',
          '/oauth2/',
          '/*?page=*', // Prevent indexing of paginated pages beyond first few
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/explore/', '/reviews', '/crew/', '/profile/'],
        disallow: [
          '/api/',
          '/watchlist',
          '/login',
          '/register',
          '/verify',
          '/forget-password',
          '/reset-password',
          '/oauth2/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
