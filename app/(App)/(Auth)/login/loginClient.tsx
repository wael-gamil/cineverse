'use client';
import Button from '@/components/ui/button/button';
import styles from '../page.module.css';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
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

  // Playful "shy" button behavior
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [shyLevel, setShyLevel] = useState(0);
  const [isButtonShaking, setIsButtonShaking] = useState(false);
  const [isEvading, setIsEvading] = useState(false);
  
  const fieldsComplete = username.trim().length > 0 && password.trim().length > 0;

  // Reset button position when fields are complete
  useEffect(() => {
    if (fieldsComplete) {
      setButtonPosition({ x: 0, y: 0 });
      setShyLevel(0);
      setIsButtonShaking(false);
      setIsEvading(false);
    }
  }, [fieldsComplete]);

  const handleButtonHover = () => {
    if (fieldsComplete || isLoading || isEvading) return;

    setIsEvading(true);
    // Increase shyness with each attempt
    setShyLevel(prev => prev + 1);

    // Different behaviors based on shyness level with bigger movements
    if (shyLevel === 0) {
      // First hover: medium jump away
      setButtonPosition({ x: Math.random() > 0.5 ? 80 : -80, y: -40 });
    } else if (shyLevel === 1) {
      // Second hover: bigger jump with rotation
      setButtonPosition({ x: Math.random() > 0.5 ? 120 : -120, y: -60 });
    } else if (shyLevel === 2) {
      // Third hover: shake in place and show message
      setIsButtonShaking(true);
      setButtonPosition({ x: 0, y: -80 }); // Move up while shaking
      setTimeout(() => setIsButtonShaking(false), 600);
    } else {
      // After multiple attempts: dramatic escape to corners
      const corners = [
        { x: 150, y: -100 },
        { x: -150, y: -100 },
        { x: 100, y: 50 },
        { x: -100, y: 50 }
      ];
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      setButtonPosition(randomCorner);
    }

    // Reset evading state after animation
    setTimeout(() => setIsEvading(false), 500);
  };

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
          <div 
            ref={buttonRef}
            style={{
              transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
              transition: isButtonShaking ? 'none' : 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              animation: isButtonShaking ? 'shake 0.6s ease-in-out' : 'none',
              width: '100%',
              position: 'relative',
              pointerEvents: isEvading ? 'none' : 'auto' // Disable interaction while evading
            }}
            onMouseEnter={handleButtonHover}
            onFocus={handleButtonHover}
          >
            <Button 
              type='submit' 
              width='100%' 
              disabled={isLoading || !fieldsComplete}
              title={!fieldsComplete ? (
                shyLevel === 0 ? "I'm a bit shy... fill in the fields first! 😳" :
                shyLevel === 1 ? "Nope, still not ready! Complete the form! 🏃" :
                shyLevel === 2 ? "I'm getting nervous! Please fill everything! 😰" :
                "I'll hide in the corners until you're done! 🫣"
              ) : undefined}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
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
