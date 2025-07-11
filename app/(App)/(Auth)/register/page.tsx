'use client';
import Button from '@/components/ui/button/button';
import styles from '../page.module.css';
import Link from 'next/link';
import { useState } from 'react';
import Icon from '@/components/ui/icon/icon';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const errors = { email: '', password: '', confirmPassword: '', general: '' }; // replace with real validation

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // handle register logic
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Create an account</h1>
          <p className={styles.subheading}>Join CineVerse today</p>
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
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${
                  errors.confirmPassword ? styles.inputError : ''
                }`}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder='••••••••'
              />
            </div>
          </div>

          {/* Submit */}
          <Button type='submit' width='100%' disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

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
