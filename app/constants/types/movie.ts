export type FilterType = '' | 'MOVIE' | 'SERIES';

export type Content = {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  imdbRating: number;
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
  imdbRating: number;
  platformRating: number;
  genres: string[];
  posterUrl: string;
  runtime: number;
  language: string;
  productionCountry: string;
};
export type Crew = {
  director: {
    id: number;
    name: string;
    path: string;
  };
  casts: Array<Cast>;
};
export type Cast = {
  id: number;
  name: string;
  characterName: string;
  path: string;
};

export type Trailer = {
  trailerUrl: string;
};
export type Provider = {
  name: string;
  logoUrl: string;
};
export type Review = {
  id: number;
  user: {
    id: number;
    name: string;
    path: string;
  };
  date: string;
  rate: number;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  spoiler: boolean;
};
export type Stats = {
  totalReviews: number;
  watchlistCount: number;
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

// export type MediaItem = {
//   id: string;
//   title: string;
//   image: string;
//   type: FilterType;
// };
