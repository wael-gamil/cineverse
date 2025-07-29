export type FilterType = '' | 'MOVIE' | 'SERIES';

export type ContentType = 'MOVIE' | 'SERIES';

export type Filters = {
  genres?: string[];
  year?: string;
  rate?: string;
  lang?: string;
  sortBy?: string;
  order?: string;
  status?: string;
};

export type Content = {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  imdbRate: number;
  genres: string[];
  posterUrl: string;
  slug: string;
  type?: FilterType;
};

export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  imdbRate: number;
  platformRating: number;
  genres: string[];
  posterUrl: string;
  runtime: number;
  language: string;
  productionCountry: string;
};
export type Person = {
  id: number;
  name: string;
  imageUrl: string;
};

export type Director = Person;
export type CastMember = Person & {
  characterName: string;
};
export type Credits = {
  director: Director;
  casts: CastMember[];
};
export type SocialLinks = {
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
};
export type ExtendedPerson = Person & {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string;
  knownForDepartment: string;
  alsoKnownAs: string[];
};
export type UserProfile = {
  id: number;
  username: string;
  email: string;
  name: string;
  bio: string;
  dateOfBirth: string;
  profilePicture: string;
  createdAt: string;
};
export type Trailer = {
  trailer: string;
};
export type Provider = {
  name: string;
  logo: string;
};
// Shared review base
export type BaseReview = {
  reviewId: number;
  rate: number;
  title: string;
  description: string;
  spoiler: boolean;
  likeCount: number;
  dislikeCount: number;
  userReaction: null | 'LIKE' | 'DISLIKE';
  createdAt: string;
};

// If user info is needed (like for public reviews display)
export type ReviewWithUser = BaseReview & {
  user: {
    id: number;
    name: string;
    imageUrl: string;
  };
};

// If content info is needed (like for profile page)
export type ReviewWithContent = BaseReview & {
  contentId: number;
  contentType: 'MOVIE' | 'SERIES' | 'SEASON' | 'EPISODE';
  contentTitle: string;
  contentPosterUrl: string;
};
export type ExtendedReview = BaseReview & {
  user: {
    id: number;
    name: string;
    imageUrl: string;
    username: string;
  };
  contentId: number;
  contentType: 'MOVIE' | 'SERIES' | 'SEASON' | 'EPISODE';
  contentTitle: string;
  contentPosterUrl: string;
};
export type Review = ReviewWithUser;
export type UserReview = ReviewWithContent;

export type WatchlistItem = {
  id: number;
  contentId: number;
  title: string;
  overview: string;
  contentPosterUrl: string;
  contentType: 'MOVIE' | 'SERIES';
  imdbRate: number;
  watchingStatus: 'TO_WATCH' | 'WATCHED';
  createdAt: string;
  updatedAt: string;
};

export type Stats = {
  totalReviews: number;
  watchlistCount: number;
  platformRate: number;
};

export type FilterOpt = {
  title: string;
  key: string;
  options: [
    {
      label: string;
      value: string;
    }
  ];
  multiple: boolean;
};

export type BaseContent = {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  releaseDate: string;
};

export type Movie = BaseContent & {
  backdropUrl: string;
  runtime: number;
  language: string;
  productionCountry: string;
  imdbRate: number;
  platformRate: number;
  genres: string[];
  type: 'movie';
};

export type Series = BaseContent & {
  backdropUrl: string;
  language: string;
  productionCountry: string;
  imdbRate: number;
  platformRate: number;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  status: 'Continuing' | 'Ended';
  genres: string[];
  type: 'series';
};

export type Season = BaseContent & {
  seasonNumber: number;
  imdbRate: number;
  numberOfEpisodes: number;
  type: 'season';
};

export type Episode = BaseContent & {
  episodeNumber: number;
  imdbRate: number;
  runTime: number;
  type: 'episode';
};

export type ContentDetailsType = Movie | Series | Season | Episode;

export type NormalizedContent = {
  type: 'movie' | 'series' | 'season' | 'episode';
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  imageUrl: string;
  backgroundUrl: string;
  runtime?: number;
  imdbRate?: number;
  platformRate?: number;
  genres?: string[];
  status?: 'Continuing' | 'Ended';
  language?: string;
  productionCountry?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
};

export function normalizeContent(
  data: Movie | Series | Season | Episode
): NormalizedContent {
  if ('runtime' in data) {
    return {
      type: 'movie',
      id: data.id,
      title: data.title,
      description: data.overview,
      releaseDate: data.releaseDate,
      imageUrl: data.posterUrl,
      backgroundUrl: data.backdropUrl,
      runtime: data.runtime,
      imdbRate: data.imdbRate,
      platformRate: data.platformRate,
      genres: data.genres,
      language: data.language,
      productionCountry: data.productionCountry,
    };
  }

  if ('numberOfSeasons' in data) {
    return {
      type: 'series',
      id: data.id,
      title: data.title,
      description: data.overview,
      releaseDate: data.releaseDate,
      imageUrl: data.posterUrl,
      backgroundUrl: data.backdropUrl,
      imdbRate: data.imdbRate,
      platformRate: data.platformRate,
      genres: data.genres,
      status: data.status,
      language: data.language,
      productionCountry: data.productionCountry,
      numberOfEpisodes: data.numberOfEpisodes,
      numberOfSeasons: data.numberOfSeasons,
    };
  }

  if ('seasonNumber' in data) {
    return {
      type: 'season',
      id: data.id,
      title: data.title,
      description: data.overview,
      releaseDate: data.releaseDate,
      imageUrl: data.posterUrl,
      backgroundUrl: '',
      imdbRate: data.imdbRate,
      numberOfEpisodes: data.numberOfEpisodes,
    };
  }

  return {
    type: 'episode',
    id: data.id,
    title: data.title,
    description: data.overview,
    releaseDate: data.releaseDate,
    imageUrl: data.posterUrl,
    backgroundUrl: '',
    imdbRate: data.imdbRate,
    runtime: data.runTime,
  };
}
