import { Metadata } from 'next';
import NotFoundClient from '@/components/shared/notFound/notFoundClient';

export const metadata: Metadata = {
  title: 'Content Not Found - CineVerse',
  description: 'The movie or TV show you are looking for could not be found.',
};

export default function ContentNotFound() {
  return <NotFoundClient type='content' />;
}
