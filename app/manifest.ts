import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CineVerse - Movie & TV Series Platform',
    short_name: 'CineVerse',
    description: 'Discover, track, and review movies and TV series. Create personalized watchlists and connect with fellow cinema enthusiasts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c1117',
    theme_color: '#42a5f5',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-US',
    categories: ['entertainment', 'lifestyle', 'social'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1912x1000',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '425x913',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
  };
}
