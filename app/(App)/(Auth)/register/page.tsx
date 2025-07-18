import { Suspense } from 'react';
import RegisterPage from './registerClient';
import AuthSkeleton from '../../../../components/ui/authSkeleton/authSkeleton';

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <RegisterPage />
    </Suspense>
  );
}
