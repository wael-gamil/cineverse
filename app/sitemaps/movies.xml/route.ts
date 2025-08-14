import { NextResponse } from 'next/server';
import { getContents } from '@/lib/api';

type Movie = {
  url: string;
  lastMod: Date;
  image: {
    loc: string;
    title: string;
    caption: string;
  };
};

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social';

  let movies: Movie[] = [];
  try {
    const { content: topMovies } = await getContents(
      'MOVIE',
      { sortBy: 'mostPopular' },
      0,
      2000
    );
    movies = topMovies.map(movie => ({
      url: `${baseUrl}/${movie.slug}`,
      lastMod: movie.releaseDate ? new Date(movie.releaseDate) : new Date(),
      image: {
        loc: movie.posterUrl,
        title: movie.title,
        caption: movie.overview?.slice(0, 200) || movie.title,
      },
    }));
  } catch (err) {
    console.error('Error fetching movies', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${movies
    .map(
      m => `
    <url>
      <loc>${m.url}</loc>
      <lastmod>${m.lastMod.toISOString()}</lastmod>
      <image:image>
        <image:loc>${m.image.loc}</image:loc>
        <image:title>${escapeXml(m.image.title)}</image:title>
        <image:caption>${escapeXml(m.image.caption)}</image:caption>
      </image:image>
    </url>
  `
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
