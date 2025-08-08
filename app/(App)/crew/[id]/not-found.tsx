import { Metadata } from 'next';
import NotFoundClient from '@/components/shared/notFound/notFoundClient';

export const metadata: Metadata = {
  title: 'Person Not Found - CineVerse',
  description: 'The person you are looking for could not be found.',
};

export default function CrewNotFound() {
  return <NotFoundClient type='crew' />;
}
