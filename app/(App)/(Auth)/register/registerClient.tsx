'use client';
import Button from '@/components/ui/button/button';
import styles from '../page.module.css';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon/icon';
import {
  useRegisterMutation,
  useResendVerificationMutation,
} from '@/hooks/useAuthMutations';
import { useGooglePopupLogin } from '@/hooks/useGooglePopupLogin';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const { redirectIfAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });
  const [success, setSuccess] = useState('');
  const { mutate: register } = useRegisterMutation();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
  const { mutate: resendVerification, isPending: resendLoading } =
    useResendVerificationMutation();

  // State declarations first
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonRotation, setButtonRotation] = useState(0);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [attemptCount, setAttemptCount] = useState(0);
  const [buttonMessage, setButtonMessage] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDizzy, setIsDizzy] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic messages system
  const getValidationMessages = useCallback(() => {
    const missing = [];
    if (!username.trim()) missing.push('username');
    if (!email.trim()) missing.push('email');
    if (password.length < 8) missing.push('password (8+ chars)');
    if (password !== confirmPassword) missing.push('matching passwords');
    return missing;
  }, [username, email, password, confirmPassword]);

  const getRandomMessage = useCallback(
    (
      type: 'attempt' | 'cooldown' | 'recovery',
      attemptCount: number,
      missing: string[],
      cooldownTime?: number
    ) => {
      switch (type) {
        case 'attempt':
          const attemptMessages = [
            [
              `Oops! Fill in: ${missing[0]} first! 🔄`,
              `Hey! Need your ${missing[0]}! 📝`,
              `Missing ${missing[0]}? Let's fix that! ✨`,
            ],
            [
              `Still missing ${missing.length} field${
                missing.length > 1 ? 's' : ''
              }! 🌀`,
              `Almost there! ${missing.length} more to go! 🎯`,
              `So close! Just ${missing.join(', ')} left! 💪`,
            ],
            [
              `Getting dizzy! Complete the form! 😵‍💫`,
              `Whoa! Too much spinning! Help! 🌪️`,
              `Feeling wobbly! Fill it out! 😵`,
            ],
            [
              `I'm too dizzy to work! Help! 🌪️`,
              `Can't... stop... spinning! 🌀`,
              `Too dizzy! Need a break! 😵‍💫`,
            ],
          ];
          const messageIndex = Math.min(
            attemptCount - 1,
            attemptMessages.length - 1
          );
          const messages = attemptMessages[messageIndex];
          return messages[Math.floor(Math.random() * messages.length)];

        case 'cooldown':
          const cooldownMessages = [
            'Still too dizzy! 🥴',
            'Need more rest... 😵‍💫',
            'Spinning too much! 🌪️',
            `Wait ${cooldownTime} more seconds! ⏰`,
            "Can't work right now! 😴",
            'Recovery mode activated! 🔄',
            'Give me a moment... 💤',
          ];
          return cooldownMessages[
            Math.floor(Math.random() * cooldownMessages.length)
          ];

        case 'recovery':
          const recoveryMessages = [
            'Feeling better! Try again! 😊',
            'Ready to spin again! 🎯',
            'Recharged and ready! ⚡',
            'Back in action! 💪',
          ];
          return recoveryMessages[
            Math.floor(Math.random() * recoveryMessages.length)
          ];

        default:
          return '';
      }
    },
    [cooldownTime]
  );

  // Centralized message management
  const showMessage = useCallback(
    (message: string, duration: number = 3000) => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      setButtonMessage(message);
      messageTimeoutRef.current = setTimeout(() => {
        setButtonMessage('');
        messageTimeoutRef.current = null;
      }, duration);
    },
    []
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const allFieldsComplete =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  // Reset button when fields are complete
  useEffect(() => {
    if (allFieldsComplete) {
      setButtonRotation(0);
      setButtonOpacity(1);
      setAttemptCount(0);
      setButtonMessage('');
      setIsSpinning(false);
      setIsDizzy(false);
      setCooldownTime(0);
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = null;
      }
    }
  }, [allFieldsComplete]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            setIsDizzy(false);
            setButtonOpacity(1);
            const recoveryMessage = getRandomMessage('recovery', 0, []);
            showMessage(recoveryMessage, 2000);
          }
          return newTime;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime, showMessage]);

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      if (allFieldsComplete || isLoading) {
        // Let the form submit normally
        return;
      }

      // Prevent form submission
      e.preventDefault();
      e.stopPropagation();

      // If button is dizzy (in cooldown), just show message
      if (isDizzy) {
        const cooldownMessage = getRandomMessage(
          'cooldown',
          0,
          [],
          cooldownTime
        );
        showMessage(cooldownMessage, 1500);
        return;
      }

      if (isSpinning) return;

      setIsSpinning(true);
      setAttemptCount(prev => prev + 1);

      // Get missing fields
      const missing = [];
      if (!username.trim()) missing.push('username');
      if (!email.trim()) missing.push('email');
      if (password.length < 8) missing.push('password (8+ chars)');
      if (password !== confirmPassword) missing.push('matching passwords');

      // Progressive spinning behavior
      if (attemptCount === 0) {
        setButtonRotation(prev => prev + 180);
        setButtonMessage(`Oops! Fill in: ${missing[0]} first! 🔄`);
      } else if (attemptCount === 1) {
        setButtonRotation(prev => prev + 360);
        setButtonMessage(
          `Still missing ${missing.length} field${
            missing.length > 1 ? 's' : ''
          }! �`
        );
      } else if (attemptCount === 2) {
        setButtonRotation(prev => prev + 720);
        setButtonOpacity(0.5);
        setButtonMessage(`Getting dizzy! Complete the form! 😵‍💫`);
      } else {
        // Maximum dizziness - more spinning each time
        setButtonRotation(prev => prev + 1440);
        setButtonOpacity(0.3);
        setButtonMessage(`I'm too dizzy to work! Help! 🌪️`);

        // Set dizzy state and start 5-second cooldown after a delay
        setTimeout(() => {
          setIsDizzy(true);
          setCooldownTime(5);
          setButtonOpacity(0.7);
          setButtonMessage('Taking a dizzy break... 😴');
        }, 500);
      }

      // Reset spinning state
      setTimeout(() => {
        setIsSpinning(false);
        if (attemptCount < 3) {
          setButtonOpacity(1);
        }
      }, 1000);

      // Clear message (only for non-dizzy attempts)
      if (attemptCount < 3) {
        setTimeout(() => setButtonMessage(''), 3000);
      }
    },
    [
      allFieldsComplete,
      isLoading,
      isDizzy,
      isSpinning,
      attemptCount,
      cooldownTime,
      getValidationMessages,
      getRandomMessage,
      showMessage,
    ]
  );

  const {
    loginWithGoogle,
    loading: googleLoading,
    error: googleError,
  } = useGooglePopupLogin(redirectTo);
  // Redirect if already authenticated
  useEffect(() => {
    const redirectTo = searchParams.get('redirect') || '/';
    redirectIfAuthenticated(redirectTo);
  }, [redirectIfAuthenticated, searchParams]);
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
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = () => {
    setResendMessage('');
    resendVerification(username, {
      onSuccess: () => {
        toast.success('Verification email resent successfully.', {
          className: 'toast-success',
        });
        setResendCooldown(30);
      },
      onError: err => {
        toast.error(err.message || 'Resend failed.', {
          className: 'toast-error',
        });
      },
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    });

    if (!email || !password || !username) {
      toast.error('Please fill in all required fields.', {
        className: 'toast-error',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', {
        className: 'toast-error',
      });

      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.', {
        className: 'toast-error',
      });
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', { className: 'toast-error' });

      return;
    }

    setIsLoading(true);

    register(
      { username, email, password },
      {
        onSuccess: () => {
          toast.success('Account created! Check your email to verify.', {
            className: 'toast-success',
          });
          setSuccess(
            'Account created successfully! Please check your email to verify your account.'
          );
          setIsLoading(false);
        },
        onError: err => {
          toast.error(err.message || 'Something went wrong.', {
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
          <h1 className={styles.heading}>Create an account</h1>
          <p className={styles.subheading}>Join CineVerse today</p>
        </div>
        {errors.general && <div className={styles.error}>{errors.general}</div>}
        {success ? (
          <>
            <div className={styles.success}>{success}</div>

            <div style={{ marginTop: '1rem' }}>
              <Button
                type='button'
                onClick={handleResendVerification}
                disabled={resendCooldown > 0 || resendLoading}
                width='100%'
              >
                {resendLoading
                  ? 'Resending...'
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend verification email'}
              </Button>
              {resendMessage && (
                <p style={{ marginTop: '0.5rem', color: 'var(--color-muted)' }}>
                  {resendMessage}
                </p>
              )}
            </div>
          </>
        ) : (
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
                  onChange={e => setUsername(e.target.value)}
                  placeholder='username'
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label htmlFor='email' className={styles.inputLabel}>
                Email address
              </label>
              <div className={styles.inputWrapper}>
                <Icon
                  name='envelope'
                  strokeColor='muted'
                  width={20}
                  height={20}
                />
                <input
                  id='email'
                  type='text'
                  className={`${styles.input} ${
                    errors.email ? styles.inputError : ''
                  }`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='your@email.com'
                />
              </div>
              {errors.email && (
                <div className={styles.error}>{errors.email}</div>
              )}
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
                  onChange={e => setPassword(e.target.value)}
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
              {errors.password && (
                <div className={styles.error}>{errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <label htmlFor='confirm-password' className={styles.inputLabel}>
                Confirm Password
              </label>
              <div className={styles.inputWrapper}>
                <Icon name='lock' strokeColor='muted' width={20} height={20} />
                <input
                  id='confirm-password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`${styles.input} ${
                    errors.confirmPassword ? styles.inputError : ''
                  }`}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder='••••••••'
                />
                <Button
                  type='button'
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  variant='ghost'
                  color='neutral'
                  padding='none'
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                  title={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  <Icon
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    strokeColor='muted'
                  />
                </Button>
              </div>
              {errors.confirmPassword && (
                <div className={styles.error}>{errors.confirmPassword}</div>
              )}
            </div>

            <div
              ref={buttonRef}
              style={{
                transform: `rotate(${buttonRotation}deg)`,
                opacity: buttonOpacity,
                transition:
                  'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
                width: '100%',
                position: 'relative',
                cursor: allFieldsComplete ? 'pointer' : 'not-allowed',
              }}
              onClick={handleButtonClick}
            >
              <Button
                type={allFieldsComplete ? 'submit' : 'button'}
                width='100%'
                disabled={isLoading}
                title={
                  buttonMessage ||
                  (!allFieldsComplete
                    ? 'Complete all fields first! �'
                    : undefined)
                }
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>

            {buttonMessage && (
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--space-sm)',
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                {buttonMessage}
              </div>
            )}
          </form>
        )}
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
          <span>Already have an account?</span>
        </div>

        <Link href='/login' className={styles.registerLink}>
          <Button width='100%' variant='outline'>
            Sign in
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
