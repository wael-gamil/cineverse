'use client';

import styles from './pagination.module.css';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Icon } from '../icon/icon';
import Button from '../button/button';

type Props = {
  currentPage: number; 
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      const isActive = currentPage === i;

      pages.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          borderRadius='fullRadius'
          variant={isActive ? 'solid' : 'outline'}
          color={isActive ? 'primary' : 'neutral'}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <Button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label='Previous page'
        borderRadius='fullRadius'
        color='neutral'
      >
        <Icon name='arrow-left' strokeColor='muted' />
      </Button>

      {renderPageNumbers()}

      <Button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label='Next page'
        borderRadius='fullRadius'
        color='neutral'
      >
        <Icon name='arrow-right' strokeColor='muted' />
      </Button>
    </div>
  );
}
