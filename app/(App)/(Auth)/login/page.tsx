import { Suspense } from 'react';
import LoginPage from './loginClient';
import AuthSkeleton from '../../../../components/ui/authSkeleton/authSkeleton';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <LoginPage />
    </Suspense>
  );
}
