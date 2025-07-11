'use client';
import Button from '@/components/ui/button/button';
import styles from '../page.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon/icon';
import {
  useRegisterMutation,
  useResendVerificationMutation,
} from '@/hooks/useAuthMutations';

export default function RegisterPage() {
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
        setResendMessage('Verification email resent successfully.');
        setResendCooldown(30);
      },
      onError: err => {
        setResendMessage(err.message || 'Resend failed');
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
      setErrors(prev => ({
        ...prev,
        general: 'Please fill in all required fields.',
      }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address.',
      }));
      return;
    }
    if (password.length < 8) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must be at least 8 characters.',
      }));
      return;
    }
    if (password !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match.',
      }));
      return;
    }

    setIsLoading(true);

    register(
      { username, email, password },
      {
        onSuccess: () => {
          setSuccess(
            'Account created! Please check your email for verification.'
          );
          setIsLoading(false);
        },
        onError: err => {
          setErrors(prev => ({
            ...prev,
            general: err.message || 'Something went wrong',
          }));
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

            <Button type='submit' width='100%' disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        )}

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
