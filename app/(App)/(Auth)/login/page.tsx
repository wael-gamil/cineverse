import { Suspense } from 'react';
import LoginPage from './loginClient';
import AuthSkeleton from '../../../../components/ui/authSkeleton/authSkeleton';

export const dynamic = 'force-dynamic';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <LoginPage />
    </Suspense>
  );
}
