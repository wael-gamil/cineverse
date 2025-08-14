import { NextResponse } from 'next/server';
import { getContents } from '@/lib/api';
type Serie = {
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

  let series: Serie[] = [];
  try {
    const { content: topSeries } = await getContents(
      'SERIES',
      { sortBy: 'mostPopular' },
      0,
      2000
    );
    series = topSeries.map(series => ({
      url: `${baseUrl}/${series.slug}`,
      lastMod: series.releaseDate ? new Date(series.releaseDate) : new Date(),
      image: {
        loc: series.posterUrl,
        title: series.title,
        caption: series.overview?.slice(0, 200) || series.title,
      },
    }));
  } catch (err) {
    console.error('Error fetching series', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${series
    .map(
      s => `
    <url>
      <loc>${s.url}</loc>
      <lastmod>${s.lastMod.toISOString()}</lastmod>
      <image:image>
        <image:loc>${s.image.loc}</image:loc>
        <image:title>${escapeXml(s.image.title)}</image:title>
        <image:caption>${escapeXml(s.image.caption)}</image:caption>
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
