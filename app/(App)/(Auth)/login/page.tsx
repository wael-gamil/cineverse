import { Suspense } from 'react';
import LoginPage from './loginClient';

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <LoginPage />
    </Suspense>
  );
}
