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

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('q', val);
    } else {
      params.delete('q');
    }

    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.inputWrapper}>
      <Icon name='search' strokeColor='muted' />
      <input
        ref={inputRef}
        type='text'
        placeholder='Search movies, TV shows, genres...'
        value={query}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );
}
