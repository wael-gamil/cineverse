import {
  Movies,
  MovieDetails,
  Crew,
  Trailer,
  Provider,
  Review,
  Stats,
} from '@/app/constants/types/movie';

const BASE_URL = 'https://b09d-102-47-213-28.ngrok-free.app/';

const fetcher = async function fetcher(
  endpoint: string,
  params: Record<string, any>
) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
export const getMovies = (): Promise<Movies[]> => fetcher('movies', {});
export const getMovieDetails = (id: number): Promise<MovieDetails> =>
  fetcher(`movies/${id}`, {});
export const getMovieCrew = (id: number): Promise<Crew> =>
  fetcher(`movies/${id}/cast`, {});
export const getMovieTrailer = (id: number): Promise<Trailer> =>
  fetcher(`movies/${id}/trailer`, {});
export const getMovieProviders = (id: number): Promise<Provider[]> =>
  fetcher(`movies/${id}/provider`, {});
export const getMovieReviews = (id: number): Promise<Review[]> =>
  fetcher(`movies/${id}/review`, {});
export const getMovieStats = (id: number): Promise<Stats> =>
  fetcher(`movies/${id}/stats`, {});
