import {
  Content,
  FilterOpt,
  Filters,
  ContentType,
  Movie,
  Series,
  Season,
  Episode,
  Trailer,
  Review,
  Provider,
  Stats,
  Credits,
  ExtendedPerson,
} from '@/constants/types/movie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const fetcher = async function fetcher(
  query: string,
  revalidateSeconds: number = 60,
  headers: HeadersInit = { 'Content-Type': 'application/json' }
) {
  const response = await fetch(`${BASE_URL}${query}`, {
    method: 'GET',
    headers,
    next: {
      revalidate: revalidateSeconds,
    },
  });

  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Something went wrong');
  }

  return result.data;
};

export const getContents = async (
  type: ContentType,
  filters: Filters,
  page = 0,
  size = 24
): Promise<{
  content: Content[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}> => {
  try {
    const query = new URLSearchParams();
    const filterMap: Record<string, string | undefined> = {
      genres: filters.genres?.join(','),
      year: filters.year,
      rate: filters.rate,
      lang: filters.lang,
      sortBy: filters.sortBy,
      order: filters.order,
      status: filters.status,
    };

    Object.entries(filterMap).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });

    const url = `contents/filter?type=${type}&${query.toString()}&page=${page}&size=${size}`;
    const rawData = await fetcher(url);
    if (!rawData) {
      return {
        content: [],
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
      };
    }

    const content: Content[] = rawData.content.map((content: any) => ({
      id: content.id,
      title: content.title,
      overview: content.overview,
      releaseDate: content.releaseDate,
      imdbRate: content.imdbRate,
      genres: content.genres,
      posterUrl: content.posterPath,
      slug: content.slug,
    }));
    return {
      content: content,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
      totalElements: rawData.totalElements,
    };
  } catch (error) {
    console.error('Error fetching content:', error);
    return {
      content: [],
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
    };
  }
};
export const getFilterOptions = async (): Promise<FilterOpt[]> => {
  try {
    const rawData = await fetcher(`contents/filter/options`);
    return rawData;
  } catch (error) {
    throw error;
  }
};
export const getSearchResults = async (
  query: string,
  type: 'MOVIE' | 'SERIES' | '',
  page = 0
): Promise<{
  contents: Content[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const url = `contents/search?q${
      query && `=${query}`
    }&page=${page}&type=${type}`;
    const rawData = await fetcher(url);
    const contents: Content[] = rawData.content.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      imdbRate: movie.imdbRate,
      genres: movie.genres,
      posterUrl: movie.posterPath,
      slug: movie.slug,
      type: movie.type,
    }));

    return {
      contents: contents,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
    };
  } catch (error) {
    throw error;
  }
};
export const getContentDetails = async (
  slug: string
): Promise<Movie | Series> => {
  try {
    const rawData = await fetcher(`contents/${slug}`, 300);
    if ('numberOfSeasons' in rawData) {
      return { ...rawData, type: 'series' } as Series;
    } else {
      return { ...rawData, type: 'movie' } as Movie;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllSeasonDetails = async (id: number): Promise<Season[]> => {
  try {
    const rawData = await fetcher(`contents/${id}/seasons`);
    return rawData as Season[];
  } catch (error) {
    throw error;
  }
};
export const getSeasonDetails = async (
  seriesId: number,
  seasonNumber: number
): Promise<Season> => {
  try {
    const rawData = await fetcher(
      `contents/${seriesId}/seasons/${seasonNumber}`
    );
    return rawData as Season;
  } catch (error) {
    throw error;
  }
};
export const getAllEpisodeDetails = async (
  seriesId: number,
  seasonNumber: number
): Promise<Episode[]> => {
  try {
    const rawData = await fetcher(
      `contents/${seriesId}/seasons/${seasonNumber}/episodes`
    );
    return rawData as Episode[];
  } catch (error) {
    throw error;
  }
};
export const getEpisodeDetails = async (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<Episode> => {
  try {
    const rawData = await fetcher(
      `contents/${seriesId}/seasons/${seasonNumber}/episodes/${episodeNumber}`
    );
    return rawData as Episode;
  } catch (error) {
    throw error;
  }
};

export const getContentTrailer = async (id: number): Promise<Trailer> => {
  try {
    const rawData = await fetcher(`contents/${id}/trailer`);
    return rawData as Trailer;
  } catch (error) {
    throw error;
  }
};

export const getContentProviders = async (id: number): Promise<Provider[]> => {
  try {
    const rawData = await fetcher(`contents/${id}/providers`);
    return rawData as Provider[];
  } catch (error) {
    throw error;
  }
};
export const getContentStats = async (id: number): Promise<Stats> => {
  try {
    const rawData = await fetcher(`contents/${id}/stats`);
    return rawData as Stats;
  } catch (error) {
    throw error;
  }
};
export const getContentReviews = async (id: number): Promise<Review[]> => {
  try {
    const rawData = await fetcher(`contents/${id}/reviews`);
    return rawData as Review[];
  } catch (error) {
    throw error;
  }
};
export const getContentCredits = async (id: number): Promise<Credits> => {
  try {
    const rawData = await fetcher(`contents/${id}/credits`);
    return rawData as Credits;
  } catch (error) {
    throw error;
  }
};
export const getExtendedPersonDetails = async (
  id: number
): Promise<ExtendedPerson> => {
  try {
    const rawData = await fetcher(`artists/${id}`);
    const departmentMap: Record<string, string> = {
      Acting: 'Actor',
      Directing: 'Director',
    };

    const normalizedData: ExtendedPerson = {
      ...rawData,
      knownForDepartment:
        departmentMap[rawData.knownForDepartment] ||
        rawData.knownForDepartment.toLowerCase(),
    };

    return normalizedData;
  } catch (error) {
    throw error;
  }
};
export const getPersonContents = async (
  id: number,
  page = 0,
  size = 24,
  type?: 'MOVIE' | 'SERIES'
): Promise<{ content: Content[]; totalPages: number; currentPage: number }> => {
  try {
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('size', String(size));
    if (type) query.set('type', type);

    const url = `artists/${id}/contents?${query.toString()}`;
    const rawData = await fetcher(url);

    const content: Content[] = rawData.content.map((item: any) => ({
      id: item.id,
      title: item.title,
      overview: item.overview,
      releaseDate: item.releaseDate,
      imdbRate: item.imdbRate,
      genres: item.genres,
      posterUrl: item.posterPath,
      slug: item.slug,
    }));

    return {
      content,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
    };
  } catch (error) {
    console.error('Error fetching person content:', error);
    return {
      content: [],
      totalPages: 0,
      currentPage: 0,
    };
  }
};

const postData = async (endpoint: string, body: any, headers?: HeadersInit) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const loginUser = async (username: string, password: string) => {
  return await postData('auth/login', { username, password });
};
export const logoutUser = async (token: string) => {
  return await postData(
    'auth/logout',
    {},
    {
      Authorization: `Bearer ${token}`,
    }
  );
};
export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  return await postData('auth/register', { email, password, username });
};
export const resendVerificationEmail = async (username: string) => {
  return await postData('auth/resend-verification', { username });
};
export const requestPasswordReset = async (email: string) => {
  return await postData('auth/forget-password', { email });
};
export const resetPassword = async (token: string, newPassword: string) => {
  return await postData('auth/reset-password', { token, newPassword });
};
export const getUserProfile = async (token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const data = await fetcher('users/profile', 60, headers);
  return data;
};
export const getCurrentUser = async (token: string) => {
  const res = await fetch(`${BASE_URL}auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }

  return data;
};
export const verifyEmail = async (token: string) => {
  return await fetcher(`auth/verify?token=${token}`);
};

const putData = async (endpoint: string, body: any, headers?: HeadersInit) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
export const updateUserProfile = async (
  token: string,
  updatedUser: {
    name: string;
    bio: string;
    dateOfBirth: string;
  }
) => {
  return await putData('users/profile', updatedUser, {
    Authorization: `Bearer ${token}`,
  });
};
