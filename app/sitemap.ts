import { MetadataRoute } from 'next';
import { getContents } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse-xi.vercel.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/explore/tv-series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Get popular/top-rated movies for sitemap (limit to avoid huge sitemap)
    const { content: topMovies } = await getContents(
      'MOVIE',
      { sortBy: 'mostPopular' },
      0,
      500 // Limit to 500 most popular movies
    );

    // Get popular/top-rated TV series for sitemap
    const { content: topSeries } = await getContents(
      'SERIES',
      { sortBy: 'mostPopular' },
      0,
      500 // Limit to 500 most popular series
    );

    // Add movie pages to sitemap
    const moviePages: MetadataRoute.Sitemap = topMovies.map(movie => ({
      url: `${baseUrl}/${movie.slug}`,
      lastModified: new Date(movie.releaseDate),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Add series pages to sitemap
    const seriesPages: MetadataRoute.Sitemap = topSeries.map(series => ({
      url: `${baseUrl}/${series.slug}`,
      lastModified: new Date(series.releaseDate),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...moviePages, ...seriesPages];
  } catch (error) {
    // Return static pages if dynamic content fails
    return staticPages;
  }
}
