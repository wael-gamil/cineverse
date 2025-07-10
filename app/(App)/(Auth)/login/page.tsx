'use client';
import Button from '@/components/ui/button/button';
import styles from '../page.module.css';
import Link from 'next/link';
import { useState } from 'react';
import Icon from '@/components/ui/icon/icon';
import { useLoginMutation } from '@/hooks/useAuthMutations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const errors = { email: '', password: '', general: '' }; // replace with real errors

  const { mutate: login, isPending, error } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login(
      { email, password },
      {
        onSuccess: data => {
          // set user, redirect, etc.
        },
        onError: err => {
          console.error(err);
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
                type='email'
                className={`${styles.input} ${
                  errors.email ? styles.inputError : ''
                }`}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='your@email.com'
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
                onChange={e => setPassword(e.target.value)}
                placeholder='••••••••'
              />
            </div>
            <Link href='/forgot-password'>Forgot password?</Link>
          </div>

          {/* Remember me */}
          <label className={styles.checkboxLabel}>
            <input
              type='checkbox'
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className={styles.checkboxInput}
            />
            <span className={styles.customCheckbox}></span>
            Remember me
          </label>

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
