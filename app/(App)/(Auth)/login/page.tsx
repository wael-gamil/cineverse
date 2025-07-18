import { Suspense } from 'react';
import LoginPage from './loginClient';
import AuthFallback from '../authFallback';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <LoginPage />
    </Suspense>
  );
}
