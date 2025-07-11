// app/auth/verify/page.tsx
import { Suspense } from 'react';
import VerifyPage from './verifyClient';

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <VerifyPage />
    </Suspense>
  );
}
