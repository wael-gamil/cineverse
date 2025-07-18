import { Suspense } from 'react';
import ResetPasswordClient from './resetClient';
import AuthSkeleton from '../../../../../components/ui/authSkeleton/authSkeleton';

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
