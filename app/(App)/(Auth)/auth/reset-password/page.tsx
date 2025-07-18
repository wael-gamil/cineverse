import { Suspense } from 'react';
import ResetPasswordClient from './resetClient';
import AuthFallback from '../../authFallBack';

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
