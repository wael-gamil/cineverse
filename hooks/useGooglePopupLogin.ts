import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function useGooglePopupLogin(redirectTo?: string | null) {
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
      toast.error('Popup blocked. Please allow popups and try again.', {
        className: 'toast-error',
      });
      return;
    }

    popupIntervalRef.current = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupIntervalRef.current!);
        setLoading(false);
        toast.error('Login cancelled or popup closed.', {
          className: 'toast-error',
        });
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
          const { userStore, setUserWithExpiry } = await import(
            '@/utils/userStore'
          );

          // Fetch user profile to get complete user data
          try {
            const profileRes = await fetch('/api/user/profile', {
              credentials: 'include',
            });
            const profileData = await profileRes.json();

            if (profileRes.ok && profileData.user) {
              setUserWithExpiry(
                profileData.user.username,
                profileData.user.email,
                profileData.user.profilePicture
              );
            } else {
              // Fallback to basic user data if profile fetch fails
              setUserWithExpiry(data.user.username, data.user.email);
            }
          } catch (profileError) {
            // Fallback to basic user data if profile fetch fails
            setUserWithExpiry(data.user.username, data.user.email);
          }
          toast.success('Logged in successfully', {
            className: 'toast-success',
          });

          // Use provided redirect parameter or fall back to URL params or default
          const finalRedirectTo =
            redirectTo ||
            new URLSearchParams(window.location.search).get('redirect') ||
            '/';
          router.push(finalRedirectTo);
        } catch (err: any) {
          toast.error(err.message || 'Google login failed', {
            className: 'toast-error',
          });
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
