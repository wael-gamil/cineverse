'use client';
import Button from '@/components/ui/button/button';
import styles from '../page.module.css';
import Link from 'next/link';
import { useState } from 'react';
import Icon from '@/components/ui/icon/icon';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import { userStore } from '@/utils/userStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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

  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear existing errors
    setErrors({ username: '', password: '', general: '' });

    // Simple validation
    if (!username || !password) {
      setErrors(prev => ({
        ...prev,
        general: 'Please enter both username and password.',
      }));
      setIsLoading(false);
      return;
    }

    login(
      { username, password },
      {
        onSuccess: data => {
          userStore.setState({
            username: data.user.username,
            email: data.user.email,
          });

          alert('Login successful!');

          router.push('/');
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
          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.subheading}>Sign in to continue to CineVerse</p>
        </div>

        {errors.general && <div className={styles.error}>{errors.general}</div>}

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
                onChange={e => {
                  setUsername(e.target.value);
                  setErrors(prev => ({ ...prev, username: '', general: '' }));
                }}
                placeholder='username'
              />
            </div>
            {errors.username && (
              <div className={styles.error}>{errors.username}</div>
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
            <Link href='/forget-password'>Forget password?</Link>
          </div>

          {/* Submit */}
          <Button type='submit' width='100%' disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

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
