import { Suspense } from 'react';
import ResetPasswordClient from './resetClient';

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
