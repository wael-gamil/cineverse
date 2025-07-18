// app/auth/verify/page.tsx
import { Suspense } from 'react';
import VerifyPage from './verifyClient';
import AuthFallback from '../../authFallback';

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <VerifyPage />
    </Suspense>
  );
}
