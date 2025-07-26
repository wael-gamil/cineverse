'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../page.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import Link from 'next/link';
import { useResetPasswordMutation } from '@/hooks/useAuthMutations';
import toast from 'react-hot-toast';

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
      toast.error('Token is missing or invalid.', {
        className: 'toast-error',
      });
      return;
    }

    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters long.', {
        className: 'toast-error',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', {
        className: 'toast-error',
      });
      return;
    }

    setIsLoading(true);

    resetPassword(
      { token, newPassword: password },
      {
        onSuccess: () => {
          toast.success('Password reset successfully. You can now log in.', {
            className: 'toast-success',
          });
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
