import styles from '@/app/components/ui/Icon/icon.module.css';

export const Icon = ({
  name,
  className = '',
  strokeColor = 'black',
  width = 24,
  height = 24,
}: {
  name: string;
  className?: string;
  strokeColor?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'white'
    | 'black'
    | 'muted';
  width?: number | string;
  height?: number | string;
}) => {
  const colorClass = styles[`stroke_${strokeColor}`] || '';

  const svgProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    width,
    height,
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `${className} ${styles.icon} ${colorClass}`,
  };

  switch (name) {
    case 'film':
      return (
        <svg {...svgProps}>
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
        <svg {...svgProps}>
          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
          <circle cx='12' cy='7' r='4'></circle>
        </svg>
      );
    case 'search':
      return (
        <svg {...svgProps}>
          <circle cx='11' cy='11' r='8'></circle>
          <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
        </svg>
      );
    case 'burger':
      return (
        <svg {...svgProps}>
          <line x1='3' y1='12' x2='21' y2='12'></line>
          <line x1='3' y1='6' x2='21' y2='6'></line>
          <line x1='3' y1='18' x2='21' y2='18'></line>
        </svg>
      );
    case 'close':
      return (
        <svg {...svgProps}>
          <line x1='3' y1='3' x2='21' y2='21'></line>
          <line x1='21' y1='3' x2='3' y2='21'></line>
        </svg>
      );
    case 'play':
      return (
        <svg {...svgProps}>
          <polygon points='5 3 19 12 5 21 5 3'></polygon>
        </svg>
      );
    case 'star':
      return (
        <svg {...svgProps}>
          <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'></polygon>
        </svg>
      );
    case 'plus':
      return (
        <svg {...svgProps}>
          <line x1='12' y1='5' x2='12' y2='19'></line>
          <line x1='5' y1='12' x2='19' y2='12'></line>
        </svg>
      );
    case 'message-square':
      return (
        <svg {...svgProps}>
          <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
        </svg>
      );
    case 'eye':
      return (
        <svg {...svgProps}>
          <path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z'></path>
          <circle cx='12' cy='12' r='3'></circle>
        </svg>
      );
    case 'bar-chart-3':
      return (
        <svg {...svgProps}>
          <line x1='3' y1='12' x2='3' y2='21'></line>
          <line x1='9' y1='6' x2='9' y2='21'></line>
          <line x1='15' y1='9' x2='15' y2='21'></line>
          <line x1='21' y1='3' x2='21' y2='21'></line>
        </svg>
      );
    case 'info':
      return (
        <svg {...svgProps}>
          <circle cx='12' cy='12' r='10'></circle>
          <line x1='12' y1='16' x2='12' y2='12'></line>
          <line x1='12' y1='8' x2='12.01' y2='8'></line>
        </svg>
      );
    case 'user-alt':
      return (
        <svg {...svgProps}>
          <circle cx='12' cy='8' r='4'></circle>
          <path d='M4 20c0-4 4-6 8-6s8 2 8 6'></path>
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...svgProps}>
          <path d='M12 2l1.09 3.41a1 1 0 0 0 .95.69h3.58a.5.5 0 0 1 .29.91l-2.9 2.11a1 1 0 0 0-.36 1.11l1.09 3.41a.5.5 0 0 1-.77.56l-2.9-2.11a1 1 0 0 0-1.18 0l-2.9 2.11a.5.5 0 0 1-.77-.56l1.09-3.41a1 1 0 0 0-.36-1.11l-2.9-2.11a.5.5 0 0 1 .29-.91h3.58a1 1 0 0 0 .95-.69L12 2z' />
          <path d='M19 16l.5 1.5a.5.5 0 0 0 .95 0L21 16l1.5-.5a.5.5 0 0 0 0-.95L21 14l-.5-1.5a.5.5 0 0 0-.95 0L19 14l-1.5.5a.5.5 0 0 0 0 .95L19 16z' />
          <path d='M5 19l.5 1.5a.5.5 0 0 0 .95 0L7 19l1.5-.5a.5.5 0 0 0 0-.95L7 17l-.5-1.5a.5.5 0 0 0-.95 0L5 17l-1.5.5a.5.5 0 0 0 0 .95L5 19z' />
        </svg>
      );
    case 'trending-up':
      return (
        <svg {...svgProps}>
          <polyline points='23 6 13.5 15.5 8.5 10.5 1 18'></polyline>
          <polyline points='17 6 23 6 23 12'></polyline>
        </svg>
      );
    case 'calendar':
      return (
        <svg {...svgProps}>
          <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
          <line x1='16' y1='2' x2='16' y2='6'></line>
          <line x1='8' y1='2' x2='8' y2='6'></line>
          <line x1='3' y1='10' x2='21' y2='10'></line>
        </svg>
      );
    default:
      return null;
  }
};
