'use client';
import Button from '@/components/ui/button/button';
import styles from '../page.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon/icon';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import { setUserWithExpiry } from '@/utils/userStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGooglePopupLogin } from '@/hooks/useGooglePopupLogin';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfileQuery } from '@/hooks/useUserProfileQuery';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { redirectIfAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  // User profile query (disabled initially)
  const { refetch: fetchUserProfile } = useUserProfileQuery();

  // Helper function to fetch and store user profile after login
  const fetchAndStoreUserProfile = async () => {
    try {
      const { data: userProfile } = await fetchUserProfile();
      if (userProfile) {
        setUserWithExpiry(
          userProfile.username,
          userProfile.email,
          userProfile.profilePicture
        );
      }
    } catch (error) {}
  };
  // Redirect if already authenticated
  useEffect(() => {
    const redirectTo = searchParams.get('redirect') || '/';
    redirectIfAuthenticated(redirectTo);
  }, [redirectIfAuthenticated, searchParams]);

  const {
    loginWithGoogle,
    loading: googleLoading,
    error: googleError,
  } = useGooglePopupLogin(redirectTo);
  useEffect(() => {
    if (googleError) {
      toast.error(googleError, {
        className: 'toast-error',
      });
    }
  }, [googleError]);
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth') {
      toast.error(
        'Google login failed. Please try again or use manual login.',
        {
          className: 'toast-error',
        }
      );
    }
  }, []);
  const { mutate: login } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setErrors({ username: '', password: '', general: '' });

    if (!username || !password) {
      toast.error('Please enter both username and password.', {
        className: 'toast-error',
      });
      setIsLoading(false);
      return;
    }
    login(
      { username, password },
      {
        onSuccess: async data => {
          // Fetch and store complete user profile
          await fetchAndStoreUserProfile();

          toast.success('Login successful!', {
            className: 'toast-success',
          });

          // Check if there's a redirect parameter
          const redirectTo = searchParams.get('redirect') || '/';
          router.push(redirectTo);
        },
        onError: err => {
          toast.error(err.message || 'Something went wrong', {
            className: 'toast-error',
          });
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.subheading}>Sign in to continue to CineVerse</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Username */}
          <div className={styles.inputGroup}>
            <label htmlFor='username' className={styles.inputLabel}>
              Username
            </label>
            <div className={styles.inputWrapper}>
              <Icon name='user' strokeColor='muted' width={20} height={20} />
              <input
                id='username'
                type='text'
                maxLength={100}
                className={`${styles.input} ${
                  errors.username ? styles.inputError : ''
                }`}
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setErrors(prev => ({ ...prev, username: '', general: '' }));
                }}
                placeholder='username'
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label htmlFor='password' className={styles.inputLabel}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Icon name='lock' strokeColor='muted' width={20} height={20} />
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ''
                }`}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '', general: '' }));
                }}
                placeholder='••••••••'
              />
              <Button
                type='button'
                onClick={() => setShowPassword(prev => !prev)}
                variant='ghost'
                color='neutral'
                padding='none'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  strokeColor='muted'
                />
              </Button>
            </div>
            <Link href='/forget-password'>Forget password?</Link>
          </div>

          {/* Submit */}
          <Button type='submit' width='100%' disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <Button
          type='button'
          onClick={loginWithGoogle}
          width='100%'
          variant='outline'
        >
          <Icon name='google' />
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>
        {googleError && <div className={styles.error}>{googleError}</div>}

        <div className={styles.divider}>
          <span>Don't have an account?</span>
        </div>

        <Link href='/register' className={styles.registerLink}>
          <Button width='100%' variant='outline'>
            Create an account
          </Button>
        </Link>

        <div className={styles.trustBadge}>
          <Icon name='trust-badge' strokeColor='white' />
          <span>Your information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}
