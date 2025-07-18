import { Suspense } from 'react';
import RegisterPage from './registerClient';
import AuthFallback from '../authFallBack';

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <RegisterPage />
    </Suspense>
  );
}
