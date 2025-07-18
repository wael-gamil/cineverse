import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useGooglePopupLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const popupIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    if (!popup) {
      setLoading(false);
      setError('Popup blocked. Please allow popups and try again.');
      return;
    }

    popupIntervalRef.current = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupIntervalRef.current!);
        setLoading(false);
        setError('Login cancelled or popup closed.');
      }
    }, 500);
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === 'OAUTH_TOKEN'
      ) {
        const token = event.data.token;
        clearInterval(popupIntervalRef.current!); // stop checking

        try {
          const res = await fetch(`/api/auth/login/oauth2?token=${token}`, {
            method: 'GET',
            credentials: 'include',
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

          const { userStore } = await import('@/utils/userStore');
          userStore.setState({
            username: data.user.username,
            email: data.user.email,
          });

          router.push('/');
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return { loginWithGoogle, loading, error };
}
