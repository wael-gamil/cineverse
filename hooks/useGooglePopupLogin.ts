// hooks/useGooglePopupLogin.ts
import { useEffect, useState } from 'react';

export function useGooglePopupLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithGoogle = () => {
    setError(null);
    setLoading(true);

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}oauth2/authorization/google`,
      'Google Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const handleMessage = async (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== 'OAUTH_CODE'
      ) {
        return;
      }

      const code = event.data.code;

      try {
        const res = await fetch(`/api/auth/login/oauth2?code=${code}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Login failed');
        }

        const { user } = await res.json();

        // Store user
        const { userStore } = await import('@/utils/userStore');
        userStore.setState({
          username: user.username,
          email: user.email,
        });

        // Done!
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  return { loginWithGoogle, loading, error };
}
