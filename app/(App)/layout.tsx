import type { Metadata } from 'next';
import { inter, geist } from '@/constants/fonts';
import '@/styles/global.css';
import '@/styles/reset.css';
import Navbar from '@/components/layout/navbar/navbar';
import DisclaimerModal from '@/components/layout/disclaimerModal/disclaimerModal';
import Footer from '@/components/layout/footer/footer';
import Providers from '@/lib/providers';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { generateHomeMetadata } from '@/utils/metadata';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

export const metadata: Metadata = generateHomeMetadata();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${geist.className} ${inter.className}`}>
      <body>
        <GoogleAnalytics />
        <Suspense fallback={<div />}>
          <Navbar />
        </Suspense>
        <Providers>{children}</Providers>
        <Footer />
        <Toaster position='bottom-right' />
        <DisclaimerModal />
      </body>
    </html>
  );
}
