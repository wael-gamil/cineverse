// app/auth/verify/page.tsx
import { Suspense } from 'react';
import VerifyPage from './verifyClient';
import AuthFallback from '../../../../../components/ui/authSkeleton/authSkeleton';

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <VerifyPage />
    </Suspense>
  );
}
