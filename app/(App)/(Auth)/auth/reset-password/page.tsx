import { Suspense } from 'react';
import ResetPasswordClient from './resetClient';
import AuthSkeleton from '../../../../../components/ui/authSkeleton/authSkeleton';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
