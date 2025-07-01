'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../icon/icon';
import styles from './searchInput.module.css';

type Props = {
  initialQuery?: string;
};

export default function SearchInput({ initialQuery = '' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    // Debounce logic
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    }, 700);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query]);

  return (
    <div className={styles.inputWrapper}>
      <Icon name='search' strokeColor='muted' />
      <input
        ref={inputRef}
        type='text'
        placeholder='Search movies, TV shows, genres...'
        value={query}
        onChange={e => setQuery(e.target.value)}
        className={styles.input}
      />
    </div>
  );
}
