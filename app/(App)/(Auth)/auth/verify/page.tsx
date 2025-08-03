// app/auth/verify/page.tsx
import { Suspense } from 'react';
import VerifyPage from './verifyClient';
import AuthFallback from '../../../../../components/ui/authSkeleton/authSkeleton';

export const dynamic = 'force-dynamic';

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <VerifyPage />
    </Suspense>
  );
}
