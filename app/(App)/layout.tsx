import type { Metadata } from 'next';
import { inter, geist } from '@/constants/fonts';
import '@/styles/global.css';
import '@/styles/reset.css';
import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer/footer';
import  Providers  from '@/lib/providers';

export const metadata: Metadata = {
  title: 'CineVerse',
  description:
    'CineVerse is a movie and TV series tracking app that allows users to create and manage their watchlists, discover new content, and share their reviews',
  keywords: [
    'CineVerse',
    'movie',
    'cinema',
    'tv',
    'series',
    'watchlist',
    'movies',
    'tv shows',
    'tv series',
    'watch',
  ],
  authors: [
    { name: 'Wael Gamil', url: 'https://www.linkedin.com/in/wael-gamil/' },
    {
      name: 'Mahmoud Abdelfattah',
      url: 'https://www.linkedin.com/in/mahmoud-a-fattah',
    },
  ],
  icons: {
    icon: 'public/favicon.ico',
  },
  openGraph: {
    title: 'CineVerse',
    description:
      'CineVerse is a movie and TV series tracking app that allows users to create and manage their watchlists, discover new content, and share their reviews',
    //todo: update the url
    url: '',
    siteName: 'CineVerse',
    images: [
      {
        url: '',
        width: 1200,
        height: 630,
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${geist.className} ${inter.className}`}>
      <body>
        <Navbar />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
