import styles from '@/app/components/ui/Icon/icon.module.css';
export const Icon = ({
  name,
  className = '',
  primaryStroke,
  secondaryStroke,
  whiteStroke,
}: {
  name: string;
  className?: string;
  primaryStroke?: boolean;
  secondaryStroke?: boolean;
  whiteStroke?: boolean;
}) => {
  switch (name) {
    case 'film':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#000000'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={`${className} ${
            primaryStroke ? styles.primaryStroke : ''
          } ${secondaryStroke ? styles.secondaryStroke : ''} ${
            whiteStroke ? styles.whiteStroke : ''
          }`}
        >
          <rect x='2' y='2' width='20' height='20' rx='2.18' ry='2.18'></rect>
          <line x1='7' y1='2' x2='7' y2='22'></line>
          <line x1='17' y1='2' x2='17' y2='22'></line>
          <line x1='2' y1='12' x2='22' y2='12'></line>
          <line x1='2' y1='7' x2='7' y2='7'></line>
          <line x1='2' y1='17' x2='7' y2='17'></line>
          <line x1='17' y1='17' x2='22' y2='17'></line>
          <line x1='17' y1='7' x2='22' y2='7'></line>
        </svg>
      );
    case 'user':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#000000'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={`${className} ${
            primaryStroke ? styles.primaryStroke : ''
          } ${secondaryStroke ? styles.secondaryStroke : ''} 
          ${whiteStroke ? styles.whiteStroke : ''}
          `}
        >
          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
          <circle cx='12' cy='7' r='4'></circle>
        </svg>
      );
    case 'search':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#000000'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={`${className} ${
            primaryStroke ? styles.primaryStroke : ''
          } ${secondaryStroke ? styles.secondaryStroke : ''} 
          ${whiteStroke ? styles.whiteStroke : ''}
          `}
        >
          <circle cx='11' cy='11' r='8'></circle>
          <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
        </svg>
      );
    case 'burger':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#000000'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={`${className} ${
            primaryStroke ? styles.primaryStroke : ''
          } ${secondaryStroke ? styles.secondaryStroke : ''} 
          ${whiteStroke ? styles.whiteStroke : ''}
          `}
        >
          <line x1='3' y1='12' x2='21' y2='12'></line>
          <line x1='3' y1='6' x2='21' y2='6'></line>
          <line x1='3' y1='18' x2='21' y2='18'></line>
        </svg>
      );
    case 'close':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#000000'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={`${className} ${
            primaryStroke ? styles.primaryStroke : ''
          } ${secondaryStroke ? styles.secondaryStroke : ''} 
            ${whiteStroke ? styles.whiteStroke : ''}
            `}
        >
          <line x1='3' y1='3' x2='21' y2='21'></line>
          <line x1='21' y1='3' x2='3' y2='21'></line>
        </svg>
      );
    default:
      return null;
  }
};
