'use client';

import { useEffect } from 'react';

export default function GoogleOAuthPopupRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code && window.opener) {
      window.opener.postMessage(
        { type: 'OAUTH_CODE', code },
        window.location.origin
      );
      window.close(); // ✅ Close popup after sending code
    }
  }, []);

  return <p>Signing in with Google...</p>;
}
