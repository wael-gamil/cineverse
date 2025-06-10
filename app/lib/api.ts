import {
  Movie,
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
  endpoint: string,
  params: Record<string, any>
) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
export const getMovies = async (filters: {
  genres?: string[];
  year?: string;
  rate?: string;
  lang?: string;
  sortBy?: string;
}): Promise<Movie[]> => {
  try {
    //applying filters
    const query = new URLSearchParams();
    const filterMap: Record<string, string | undefined> = {
      genres: filters.genres?.join(','),
      year: filters.year,
      rate: filters.rate,
      lang: filters.lang,
      sortBy: filters.sortBy,
    };
    Object.entries(filterMap).forEach(([key, value]) => {
      value && query.set(key, value);
    });
    const url = `contents/filter?type=MOVIE&${query.toString()}`;
    //fetching data
    const rawData = await fetcher(url, {});
    if (!rawData) {
      return [];
    }
    //constructing movie data
    const movies: Movie[] = rawData.content.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      imdbRating: movie.rate,
      genres: movie.genres,
      posterUrl: movie.posterPath,
      slug: movie.slug,
    }));
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
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
