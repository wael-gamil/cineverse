import {
  Content,
  MovieDetails,
  Crew,
  Trailer,
  Provider,
  Review,
  Stats,
  FilterOpt,
} from '@/app/constants/types/movie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const fetcher = async function fetcher(
  query: string,
  params: Record<string, any>
) {
  const response = await fetch(`${BASE_URL}${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    // throw new Error('Network response was not ok');
    return null;
  }

  return response.json();
};

type ContentType = 'MOVIE' | 'SERIES';

type Filters = {
  genres?: string[];
  year?: string;
  rate?: string;
  lang?: string;
  sortBy?: string;
};

export const getContents = async (
  type: ContentType,
  filters: Filters,
  page = 0
): Promise<{ content: Content[]; totalPages: number; currentPage: number }> => {
  try {
    // Construct query parameters
    const query = new URLSearchParams();
    const filterMap: Record<string, string | undefined> = {
      genres: filters.genres?.join(','),
      year: filters.year,
      rate: filters.rate,
      lang: filters.lang,
      sortBy: filters.sortBy,
    };

    Object.entries(filterMap).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });

    const url = `contents/filter?type=${type}&${query.toString()}&page=${page}&size=24`;

    const rawData = await fetcher(url, {});
    if (!rawData) {
      return {
        content: [],
        totalPages: 0,
        currentPage: 0,
      };
    }

    const movies: Content[] = rawData.content.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      imdbRating: movie.rate,
      genres: movie.genres,
      posterUrl: movie.posterPath,
      slug: movie.slug,
    }));

    return {
      content: movies,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
    };
  } catch (error) {
    console.error('Error fetching content:', error);
    return {
      content: [],
      totalPages: 0,
      currentPage: 0,
    };
  }
};

export const getSearchResults = async (
  query: string,
  page = 0
): Promise<{ content: Content[]; totalPages: number; currentPage: number }> => {
  try {
    const url = `contents/search?q${query && `=${query}`}&page=${page}`;
    const rawData = await fetcher(url, {});
    const movies: Content[] = rawData.content.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      imdbRating: movie.rate,
      genres: movie.genres,
      posterUrl: movie.posterPath,
      slug: movie.slug,
      type: movie.type,
    }));

    return {
      content: movies,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
    };
  } catch (error) {
    throw error;
  }
};
export const getMovieDetails = async (slug: string): Promise<MovieDetails> => {
  try {
    const rawData = await fetcher(`contents/${slug}`, {});
    if (!rawData) {
      throw new Error('Movie not found');
    }

    const movieDetails: MovieDetails = {
      id: rawData.id,
      title: rawData.title,
      overview: rawData.overview,
      releaseDate: rawData.releaseDate,
      imdbRating: rawData.imdbRate,
      platformRating: rawData.platformRate,
      genres: rawData.genres,
      posterUrl: rawData.posterPath,
      runtime: rawData.runtime,
      language: rawData.language,
      productionCountry: rawData.productionCountry,
    };
    return movieDetails;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};
export const getContentTrailer = async (id: number): Promise<Trailer> => {
  try {
    const rawData = await fetcher(`contents/${id}/trailer`, {});
    if (!rawData) {
      return {
        trailerUrl: 'https://www.youtube.com/watch?v=UaVTIH8mujA',
      };
    }
    const trailer: Trailer = {
      trailerUrl: rawData.trailer,
    };
    return trailer;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    throw error;
  }
};
export const getFilterOptions = async (): Promise<FilterOpt[]> => {
  try {
    const rawData = await fetcher(`contents/filter/options`, {});
    const filteredData = rawData.filter(
      (data: { key: string }) => data.key !== 'type' && data.key !== 'sortBy'
    );
    return filteredData;
  } catch (error) {
    throw error;
  }
};

// export const getMovieDetails = (id: number): Promise<MovieDetails> =>
//   fetcher(`movies/${id}`, {});
// export const getMovieCrew = (id: number): Promise<Crew> =>
//   fetcher(`movies/${id}/cast`, {});
// export const getMovieTrailer = (id: number): Promise<Trailer> =>
//   fetcher(`movies/${id}/trailer`, {});
// export const getMovieProviders = (id: number): Promise<Provider[]> =>
//   fetcher(`movies/${id}/provider`, {});
// export const getMovieReviews = (id: number): Promise<Review[]> =>
//   fetcher(`movies/${id}/review`, {});
// export const getMovieStats = (id: number): Promise<Stats> =>
//   fetcher(`movies/${id}/stats`, {});
