'use client';

import { useState } from 'react';
import styles from '../page.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import Link from 'next/link';
import { useForgetPasswordMutation } from '@/hooks/useAuthMutations';
import toast from 'react-hot-toast';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { mutate: forgetPassword } = useForgetPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      toast.error('Please enter your email.', {
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

    setIsLoading(true);

    forgetPassword(
      { email },
      {
        onSuccess: () => {
          toast.success(
            `✅ A reset link was sent to ${email}. Please check your inbox.`,
            {
              className: 'toast-success',
            }
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
          <h1 className={styles.heading}>Forgot your password?</h1>
          <p className={styles.subheading}>
            Enter the email associated with your account.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {!success && (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Email input */}
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
                    error ? styles.inputError : ''
                  }`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='your@email.com'
                />
              </div>
            </div>

            <Button type='submit' width='100%' disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}

        <div className={styles.divider}>
          <span>Back to login?</span>
        </div>

        <Link href='/login' className={styles.registerLink}>
          <Button width='100%' variant='outline'>
            Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}
