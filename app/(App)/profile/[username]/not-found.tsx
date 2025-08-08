import { Metadata } from 'next';
import NotFoundClient from '@/components/shared/notFound/notFoundClient';

export const metadata: Metadata = {
  title: 'User Not Found - CineVerse',
  description: 'The user profile you are looking for could not be found.',
};

export default function UserNotFound() {
  return <NotFoundClient type='user' />;
}
