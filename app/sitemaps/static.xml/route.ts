import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://cineverse.social';

  const staticPages = [
    { url: baseUrl, lastMod: new Date() },
    { url: `${baseUrl}/explore/movies`, lastMod: new Date() },
    { url: `${baseUrl}/explore/tv-series`, lastMod: new Date() },
    { url: `${baseUrl}/reviews`, lastMod: new Date() },
    { url: `${baseUrl}/search`, lastMod: new Date() },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      p => `
    <url>
      <loc>${p.url}</loc>
      <lastmod>${p.lastMod.toISOString()}</lastmod>
    </url>
  `
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
