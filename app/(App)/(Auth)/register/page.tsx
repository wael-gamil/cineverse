import { Suspense } from 'react';
import RegisterPage from './registerClient';
import AuthSkeleton from '../../../../components/ui/authSkeleton/authSkeleton';

export const dynamic = 'force-dynamic';

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <RegisterPage />
    </Suspense>
  );
}
