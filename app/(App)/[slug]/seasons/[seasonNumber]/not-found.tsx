import { Metadata } from 'next';
import NotFoundClient from '@/components/shared/notFound/notFoundClient';

export const metadata: Metadata = {
  title: 'Season Not Found - CineVerse',
  description: 'The season you are looking for could not be found.',
};

export default function SeasonNotFound() {
  return <NotFoundClient type='season' />;
}
