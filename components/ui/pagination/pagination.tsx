'use client';

import styles from './pagination.module.css';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Icon } from '../icon/icon';
import Button from '../button/button';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useResponsiveLayout();

  const onPageChange = (displayPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', displayPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const current = currentPage + 1;
    const mobile = isMobile;

    const siblingCount = mobile ? 0 : 1;

    // Always show the first page
    pages.push(1);

    const startPage = Math.max(current - siblingCount, 2);
    const endPage = Math.min(current + siblingCount, totalPages - 1);

    if (startPage > 2) pages.push('...');

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);

    return pages.map((page, idx) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
            ...
          </span>
        );
      }

      const isActive = current === page;

      return (
        <Button
          key={page}
          onClick={() => onPageChange(Number(page))}
          borderRadius='fullRadius'
          variant={isActive ? 'solid' : 'outline'}
          color={isActive ? 'primary' : 'neutral'}
          padding='none'
        >
          {page}
        </Button>
      );
    });
  };

  const currentDisplayPage = currentPage + 1;

  return (
    <div className={styles.pagination}>
      <Button
        onClick={() => onPageChange(Math.max(currentDisplayPage - 1, 1))}
        disabled={currentDisplayPage === 1}
        aria-label='Previous page'
        borderRadius='fullRadius'
        color='neutral'
        padding='none'
        title='Previous Page'
      >
        <Icon name='arrow-left' strokeColor='muted' />
      </Button>

      {renderPageNumbers()}

      <Button
        onClick={() =>
          onPageChange(Math.min(currentDisplayPage + 1, totalPages))
        }
        disabled={currentDisplayPage === totalPages}
        aria-label='Next page'
        borderRadius='fullRadius'
        color='neutral'
        padding='none'
        title='Next Page'
      >
        <Icon name='arrow-right' strokeColor='muted' />
      </Button>
    </div>
  );
}
