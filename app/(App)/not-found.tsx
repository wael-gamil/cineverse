import { Metadata } from 'next';
import NotFoundClient from '@/components/shared/notFound/notFoundClient';

export const metadata: Metadata = {
  title: 'Page Not Found - CineVerse',
  description: 'The page you are looking for could not be found.',
};

export default function GlobalNotFound() {
  return <NotFoundClient type="page" />;
}
