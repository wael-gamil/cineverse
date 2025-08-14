import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social';

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemaps/static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/movies.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/series.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(sitemapIndex, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
