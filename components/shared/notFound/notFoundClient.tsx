'use client';

import { useRouter, usePathname } from 'next/navigation';
import styles from './notFound.module.css';
import Button from '@/components/ui/button/button';
import Icon from '@/components/ui/icon/icon';
import { useEffect, useState } from 'react';

type NotFoundType = 'page' | 'content' | 'user' | 'episode' | 'season' | 'crew';

interface NotFoundClientProps {
  type?: NotFoundType;
  customMessage?: string;
  customSuggestions?: string[];
}

interface NotFoundConfig {
  icon: React.ComponentProps<typeof Icon>['name'];
  code: string;
  heading: string;
  subheading: string;
  description: string;
  suggestions: string[];
}

const notFoundConfigs: Record<NotFoundType, NotFoundConfig> = {
  page: {
    icon: 'search',
    code: '404',
    heading: 'Page Not Found',
    subheading: 'The page you are looking for could not be found',
    description: 'The URL you entered might be incorrect, or the page may have been moved or deleted.',
    suggestions: [
      'Check the URL for any typos',
      'Navigate back to the home page',
      'Use the search feature to find content',
      'Browse popular movies and TV shows'
    ]
  },
  content: {
    icon: 'film',
    code: '404',
    heading: 'Content Not Found',
    subheading: 'We couldn\'t find this movie or TV show',
    description: 'The content you\'re looking for might not be available in our database or the link might be incorrect.',
    suggestions: [
      'Search for similar titles',
      'Browse trending content',
      'Check our latest releases',
      'Explore different genres'
    ]
  },
  user: {
    icon: 'user',
    code: '404',
    heading: 'User Not Found',
    subheading: 'This user profile doesn\'t exist',
    description: 'The username you\'re looking for might be incorrect, or the user account may have been deleted.',
    suggestions: [
      'Check the username spelling',
      'Search for users in the community',
      'Browse popular reviewers',
      'Create your own account'
    ]
  },
  episode: {
    icon: 'tv',
    code: '404',
    heading: 'Episode Not Found',
    subheading: 'This episode doesn\'t exist',
    description: 'The episode number you\'re looking for might be incorrect or not yet available.',
    suggestions: [
      'Check the episode number',
      'View all episodes in this season',
      'Browse other seasons',
      'Return to the main series page'
    ]
  },
  season: {
    icon: 'tv-alt',
    code: '404',
    heading: 'Season Not Found',
    subheading: 'This season doesn\'t exist',
    description: 'The season number you\'re looking for might be incorrect or not yet available.',
    suggestions: [
      'Check the season number',
      'View all available seasons',
      'Browse similar series',
      'Return to the main series page'
    ]
  },
  crew: {
    icon: 'user-alt',
    code: '404',
    heading: 'Person Not Found',
    subheading: 'We couldn\'t find this person',
    description: 'The person you\'re looking for might not be in our database or the link might be incorrect.',
    suggestions: [
      'Search for the person\'s name',
      'Browse popular actors and directors',
      'Explore cast and crew of popular movies',
      'Return to browse content'
    ]
  }
};

export default function NotFoundClient({ 
  type = 'page', 
  customMessage,
  customSuggestions 
}: NotFoundClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [countdown, setCountdown] = useState(10);
  
  const config = notFoundConfigs[type];
  const suggestions = customSuggestions || config.suggestions;
  const description = customMessage || config.description;

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleSearchContent = () => {
    router.push('/search');
  };

  const handleExploreContent = () => {
    router.push('/explore/movies');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Icon 
              name={config.icon} 
              strokeColor="primary" 
              width={40} 
              height={40} 
            />
          </div>
          <h1 className={styles.errorCode}>{config.code}</h1>
          <h2 className={styles.heading}>{config.heading}</h2>
          <p className={styles.subheading}>{config.subheading}</p>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>{description}</p>

          <div className={styles.suggestions}>
            <h3 className={styles.suggestionsTitle}>What you can do:</h3>
            <ul className={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <li key={index} className={styles.suggestionItem}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.buttonGroup}>
            <Button 
              onClick={handleGoHome}
              width="100%"
            >
              <Icon name="film" strokeColor="white" width={20} height={20} />
              Go to Home
            </Button>
            <Button 
              onClick={handleGoBack}
              variant="outline"
              width="100%"
            >
              <Icon name="arrow-left" strokeColor="primary" width={20} height={20} />
              Go Back
            </Button>
          </div>

          {(type === 'content' || type === 'page') && (
            <>
              <div className={styles.divider}>
                <span>or</span>
              </div>
              <div className={styles.buttonGroup}>
                <Button 
                  onClick={handleSearchContent}
                  variant="outline"
                  width="100%"
                >
                  <Icon name="search" strokeColor="primary" width={20} height={20} />
                  Search Content
                </Button>
                <Button 
                  onClick={handleExploreContent}
                  variant="outline"
                  width="100%"
                >
                  <Icon name="globe" strokeColor="primary" width={20} height={20} />
                  Explore
                </Button>
              </div>
            </>
          )}
        </div>

        <div className={styles.helpText}>
          <Icon name="info" strokeColor="muted" width={16} height={16} />
          <span>Redirecting to home in {countdown} seconds</span>
        </div>
      </div>
    </div>
  );
}
