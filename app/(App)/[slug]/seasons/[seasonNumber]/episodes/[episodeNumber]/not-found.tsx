import { Metadata } from 'next';
import NotFoundClient from '@/components/shared/notFound/notFoundClient';

export const metadata: Metadata = {
  title: 'Episode Not Found - CineVerse',
  description: 'The episode you are looking for could not be found.',
};

export default function EpisodeNotFound() {
  return <NotFoundClient type='episode' />;
}
