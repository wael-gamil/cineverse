import { Playfair_Display, Inter } from 'next/font/google';

export const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});
