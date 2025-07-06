import { getContents, getPersonContents } from '@/lib/api';
import { NextResponse } from 'next/server';

const defaultGenres = {
  MOVIE: ['Action', 'Adventure'],
  SERIES: ['Action & Adventure'],
};

const sectionKeys = [
  'most-recent',
  'top-rated',
  'up-coming',
  'top-arab',
  'most-recent-arab',
  'arab-comedy',
  'top-horror',
  'top-animation',
  'family-picks',
  'arab-thrillers',
] as const;
type SectionKey = (typeof sectionKeys)[number];

type SortMapValue = {
  sortBy?: string;
  year?: string;
  lang?: string;
  status?: string;
  order?: string;
  genres?: {
    MOVIE: string[];
    SERIES: string[];
  };
};

const sortMap: Record<SectionKey, SortMapValue> = {
  'top-rated': {
    sortBy: 'topRated',
    year: '2000',
    lang: 'en',
    genres: {
      MOVIE: ['Action', 'Adventure'],
      SERIES: ['Action & Adventure'],
    },
  },
  'most-recent': {
    sortBy: 'mostRecent',
    year: '2024',
    lang: 'en',
  },
  'up-coming': {
    status: 'UPCOMING',
    order: 'asc',
    lang: 'en',
  },

  'top-arab': {
    sortBy: 'topRated',
    year: '2000',
    lang: 'ar',
  },
  'most-recent-arab': {
    sortBy: 'mostRecent',
    year: '2024',
    lang: 'ar',
    genres: {
      MOVIE: ['Drama'],
      SERIES: ['Drama'],
    },
  },
  'arab-comedy': {
    sortBy: 'topRated',
    year: '2000',
    lang: 'ar',
    genres: {
      MOVIE: ['Comedy'],
      SERIES: ['Comedy'],
    },
  },

  'top-horror': {
    sortBy: 'topRated',
    year: '2000',
    lang: 'en',
    genres: {
      MOVIE: ['Horror'],
      SERIES: ['Mystery'],
    },
  },
  'top-animation': {
    sortBy: 'topRated',
    year: '2000',
    lang: 'en',
    genres: {
      MOVIE: ['Animation'],
      SERIES: ['Animation'],
    },
  },

  'family-picks': {
    sortBy: 'topRated',
    year: '2000',
    lang: 'en',
    genres: {
      MOVIE: ['Family'],
      SERIES: ['Family'],
    },
  },
  'arab-thrillers': {
    sortBy: 'topRated',
    year: '2010',
    lang: 'ar',
    genres: {
      MOVIE: ['Thriller'],
      SERIES: ['Crime'],
    },
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 0;
  const size = Number(url.searchParams.get('size')) || 8;
  const type = (url.searchParams.get('type') || 'MOVIE') as 'MOVIE' | 'SERIES';
  const section = url.searchParams.get('section');

  try {
    if (!section || !(section in sortMap)) {
      return NextResponse.json(
        { error: 'Invalid or missing section' },
        { status: 400 }
      );
    }

    const config = sortMap[section as keyof typeof sortMap];
    const genres = config.genres?.[type];
    const response = await getContents(
      type,
      {
        ...config,
        genres,
      },
      page,
      size
    );

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
