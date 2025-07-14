'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../page.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import Link from 'next/link';
import { useResetPasswordMutation } from '@/hooks/useAuthMutations';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    general: '',
  });
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: resetPassword } = useResetPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ password: '', confirmPassword: '', general: '' });

    if (!token) {
      setErrors(prev => ({ ...prev, general: 'Token is missing or invalid.' }));
      return;
    }

    if (!password || password.length < 8) {
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

    resetPassword(
      { token, newPassword: password },
      {
        onSuccess: () => {
          setSuccess('✅ Password reset successfully. You can now log in.');
          setIsLoading(false);
        },
        onError: err => {
          setErrors(prev => ({
            ...prev,
            general: err.message || 'Something went wrong.',
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
          <h1 className={styles.heading}>Set new password</h1>
          <p className={styles.subheading}>
            Enter a strong new password for your account.
          </p>
        </div>

        {errors.general && <div className={styles.error}>{errors.general}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {!success && (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* New Password */}
            <div className={styles.inputGroup}>
              <label htmlFor='password' className={styles.inputLabel}>
                New Password
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
              {errors.password && (
                <div className={styles.error}>{errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <label htmlFor='confirmPassword' className={styles.inputLabel}>
                Confirm Password
              </label>
              <div className={styles.inputWrapper}>
                <Icon name='lock' strokeColor='muted' width={20} height={20} />
                <input
                  id='confirmPassword'
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${
                    errors.confirmPassword ? styles.inputError : ''
                  }`}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder='••••••••'
                />
                <Button
                  type='button'
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label='Toggle password visibility'
                  variant='ghost'
                  color='neutral'
                  padding='none'
                >
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    strokeColor='muted'
                  />
                </Button>
              </div>
              {errors.confirmPassword && (
                <div className={styles.error}>{errors.confirmPassword}</div>
              )}
            </div>

            <Button type='submit' width='100%' disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        {success && (
          <Link href='/login' className={styles.registerLink}>
            <Button width='100%' variant='outline'>
              Go to Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
