import { Suspense } from 'react';
import RegisterPage from './registerClient';
import AuthFallback from '../authFallback';

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <RegisterPage />
    </Suspense>
  );
}
