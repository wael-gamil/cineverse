import styles from '@/components/ui/icon/icon.module.css';

export type IconName =
  | 'film'
  | 'user'
  | 'search'
  | 'burger'
  | 'close'
  | 'play'
  | 'pause' // <-- Added pause here
  | 'star'
  | 'plus'
  | 'message-square'
  | 'eye'
  | 'bar-chart-3'
  | 'info'
  | 'user-alt'
  | 'sparkles'
  | 'trending-up'
  | 'calendar'
  | 'sliders-horizontal'
  | 'dot'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'expand'
  | 'contract'
  | 'volumeoff'
  | 'volumeup'
  | 'mute'
  | 'speaker'
  | 'speaker-mini'
  | 'share'
  | 'popcorn'
  | 'tv'
  | 'clock'
  | 'languages'
  | 'bookmark'
  | 'badge'
  | 'status'
  | 'tv-alt'
  | 'globe'
  | 'starFilled'
  | 'PlusCircle'
  | 'thumbUp'
  | 'thumbDown'
  | 'MessageSquare'
  | 'ExternalLink';
type IconProps = {
  name: IconName;
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
  hide?: boolean;
};

export const Icon = ({
  name,
  className = '',
  strokeColor = 'black',
  width = 24,
  height = 24,
  hide = false,
}: IconProps) => {
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
    className: `${className} ${styles.icon} ${colorClass} ${
      hide && styles.hide
    }`,
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
    case 'pause':
      return (
        <svg {...svgProps}>
          <rect x='6' y='4' width='4' height='16'></rect>
          <rect x='14' y='4' width='4' height='16'></rect>
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
    case 'sliders-horizontal':
      return (
        <svg {...svgProps}>
          <line x1='21' y1='4' x2='14' y2='4'></line>
          <line x1='10' y1='4' x2='3' y2='4'></line>
          <circle cx='12' cy='4' r='2'></circle>
          <line x1='21' y1='12' x2='12' y2='12'></line>
          <line x1='8' y1='12' x2='3' y2='12'></line>
          <circle cx='10' cy='12' r='2'></circle>
          <line x1='21' y1='20' x2='16' y2='20'></line>
          <line x1='12' y1='20' x2='3' y2='20'></line>
          <circle cx='14' cy='20' r='2'></circle>
        </svg>
      );
    case 'dot':
      return (
        <svg {...svgProps}>
          <circle
            cx='12'
            cy='12'
            r='4'
            fill='currentColor'
            stroke='none'
          ></circle>
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...svgProps}>
          <line x1='19' y1='12' x2='5' y2='12'></line>
          <polyline points='12 19 5 12 12 5'></polyline>
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...svgProps}>
          <line x1='5' y1='12' x2='19' y2='12'></line>
          <polyline points='12 5 19 12 12 19'></polyline>
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...svgProps}>
          <polyline points='6 9 12 15 18 9'></polyline>
        </svg>
      );
    case 'chevron-up':
      return (
        <svg {...svgProps}>
          <polyline points='6 15 12 9 18 15'></polyline>
        </svg>
      );
    case 'expand':
      return (
        <svg {...svgProps}>
          <polyline points='16 3 21 3 21 8'></polyline>
          <line x1='14' y1='10' x2='21' y2='3'></line>
          <polyline points='8 21 3 21 3 16'></polyline>
          <line x1='10' y1='14' x2='3' y2='21'></line>
        </svg>
      );
    case 'contract':
      return (
        <svg {...svgProps}>
          <polyline points='21 16 21 21 16 21'></polyline>
          <line x1='21' y1='21' x2='14' y2='14'></line>
          <polyline points='3 8 3 3 8 3'></polyline>
          <line x1='3' y1='3' x2='10' y2='10'></line>
        </svg>
      );
    case 'volumeoff':
      return (
        <svg {...svgProps}>
          <polygon points='11 5 6 9H2v6h4l5 4V5z'></polygon>
          <line x1='23' y1='9' x2='17' y2='15'></line>
          <line x1='17' y1='9' x2='23' y2='15'></line>
        </svg>
      );
    case 'volumeup':
      return (
        <svg {...svgProps}>
          <polygon points='11 5 6 9H2v6h4l5 4V5z'></polygon>
          <path d='M19 7c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5'></path>
          <path d='M15 9.5c.7.7 1.5 1.7 1.5 2.5s-.8 1.8-1.5 2.5'></path>
        </svg>
      );
    case 'mute':
      return (
        <svg
          {...svgProps}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {/* Speaker shape */}
          <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />

          {/* Mute cross (X) */}
          <line x1='18' y1='9' x2='23' y2='15' />
          <line x1='23' y1='9' x2='18' y2='15' />
        </svg>
      );
    case 'speaker':
      return (
        <svg
          {...svgProps}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {/* Speaker shape */}
          <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
          {/* Volume waves */}
          <path d='M15 9c1.5 1.5 1.5 4.5 0 6' />
          <path d='M17.5 6.5c3 3 3 8 0 11' />
        </svg>
      );
    case 'speaker-mini':
      return (
        <svg
          {...svgProps}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {/* Speaker shape */}
          <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
          {/* Volume waves */}
          <path d='M15 9c1.5 1.5 1.5 4.5 0 6' />
        </svg>
      );
    case 'share':
      return (
        <svg {...svgProps}>
          <circle cx='18' cy='5' r='3'></circle>
          <circle cx='6' cy='12' r='3'></circle>
          <circle cx='18' cy='19' r='3'></circle>
          <line x1='8.59' y1='13.51' x2='15.42' y2='17.49'></line>
          <line x1='15.41' y1='6.51' x2='8.59' y2='10.49'></line>
        </svg>
      );
    case 'popcorn':
      return (
        <span
          className={`${className} ${styles.icon} ${colorClass} ${
            hide && styles.hide
          }`}
          style={{ fontSize: typeof width === 'number' ? `${width}px` : width }}
        >
          🍿
        </span>
      );
    case 'tv':
      return (
        <svg {...svgProps}>
          <rect x='2' y='7' width='20' height='15' rx='2' ry='2'></rect>
          <polyline points='17 2 12 7 7 2'></polyline>
        </svg>
      );
    case 'clock':
      return (
        <svg {...svgProps}>
          <circle cx='12' cy='12' r='10'></circle>
          <polyline points='12 6 12 12 16 14'></polyline>
        </svg>
      );
    case 'languages':
      return (
        <svg {...svgProps}>
          <circle cx='12' cy='12' r='10'></circle>
          <path d='M4 12h16'></path>
          <path d='M12 2a15.3 15.3 0 0 1 0 20'></path>
          <path d='M12 2a15.3 15.3 0 0 0 0 20'></path>
          <path d='M8 8h8'></path>
          <path d='M8 16h8'></path>
        </svg>
      );
    case 'bookmark':
      return (
        <svg {...svgProps}>
          <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'></path>
        </svg>
      );
    case 'badge':
      return (
        <svg {...svgProps}>
          {/* Outer medal circle */}
          <circle cx='12' cy='12' r='8' />
          {/* Inner medal circle */}
          <circle cx='12' cy='12' r='4' />
          {/* Medal ribbon left */}
          <rect x='8' y='2' width='2' height='6' rx='1' />
          {/* Medal ribbon right */}
          <rect x='14' y='2' width='2' height='6' rx='1' />
        </svg>
      );
    case 'status':
      return (
        <svg {...svgProps}>
          <circle cx='12' cy='12' r='10'></circle>
          <circle cx='12' cy='12' r='6'></circle>
          <circle
            cx='12'
            cy='12'
            r='2'
            fill='currentColor'
            stroke='none'
          ></circle>
        </svg>
      );
    case 'tv-alt':
      return (
        <svg {...svgProps}>
          <rect x='3' y='7' width='18' height='13' rx='2' ry='2'></rect>
          <line x1='8' y1='2' x2='16' y2='2'></line>
          <line x1='12' y1='2' x2='12' y2='7'></line>
        </svg>
      );
    case 'globe':
      return (
        <svg {...svgProps}>
          <circle cx='12' cy='12' r='10'></circle>
          <ellipse cx='12' cy='12' rx='10' ry='4'></ellipse>
          <ellipse cx='12' cy='12' rx='4' ry='10'></ellipse>
          <line x1='2' y1='12' x2='22' y2='12'></line>
          <line x1='12' y1='2' x2='12' y2='22'></line>
        </svg>
      );
    case 'starFilled':
      return (
        <svg {...svgProps}>
          <polygon
            points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
            fill='currentColor'
            stroke='none'
          />
        </svg>
      );
    case 'PlusCircle':
      return (
        <svg {...svgProps}>
          <circle cx='12' cy='12' r='10' />
          <line x1='12' y1='8' x2='12' y2='16' />
          <line x1='8' y1='12' x2='16' y2='12' />
        </svg>
      );
    case 'thumbUp':
      return (
        <svg
          {...svgProps}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M7 10v10H4V10h3zm5.3-7c.6 0 1 .4 1 1v4h5.6c.9 0 1.4 1 .9 1.7l-2.7 6.7c-.2.5-.6.8-1.1.8H9V10.4l3.3-7.2c.2-.1.4-.2.7-.2z' />
        </svg>
      );
    case 'thumbDown':
      return (
        <svg
          {...svgProps}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M17 14V4h3v10h-3zm-5.3 7c-.6 0-1-.4-1-1v-4H5.1c-.9 0-1.4-1-.9-1.7l2.7-6.7c.2-.5.6-.8 1.1-.8H15v8.6l-3.3 7.2c-.2.1-.4.2-.7.2z' />
        </svg>
      );
    case 'MessageSquare':
      return (
        <svg {...svgProps}>
          <path d='M3 3h18v12H3z' />
          <path d='M3 15l3 3 3-3H3z' />
        </svg>
      );
    case 'ExternalLink':
      return (
        <svg {...svgProps}>
          {/* Box */}
          <rect x='3' y='7' width='14' height='14' rx='2' ry='2'></rect>
          {/* Arrow */}
          <polyline points='15 3 21 3 21 9'></polyline>
          <line x1='10' y1='14' x2='21' y2='3'></line>
        </svg>
      );
    default:
      return null;
  }
};
export default Icon;
