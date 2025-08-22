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
  UserReview,
  UserProfile,
  ExtendedReview,
  WatchlistItem,
} from '@/constants/types/movie';
import {
  safeFetcher,
  contentApiCall,
  safeApiCall,
  handleApiError,
  ApiError,
} from './errorHandler';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Legacy fetcher - gradually being replaced with safeFetcher
const fetcher = async function fetcher(
  query: string,
  revalidateSeconds: number = 60,
  headers: HeadersInit = { 'Content-Type': 'application/json' }
) {
  return await safeFetcher(query, revalidateSeconds, headers, BASE_URL);
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
      posterUrl: content.posterUrl,
      slug: content.slug,
    }));
    return {
      content: content,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
      totalElements: rawData.totalElements,
    };
  } catch (error) {
    return {
      content: [],
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
    };
  }
};
export const getFilterOptions = async (): Promise<FilterOpt[]> => {
  return await safeApiCall(
    () => fetcher(`contents/filter/options`),
    [], // Return empty array on error
    'server'
  );
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
  return await safeApiCall(
    async () => {
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
        posterUrl: movie.posterUrl,
        slug: movie.slug,
        type: movie.type,
      }));

      return {
        contents: contents,
        totalPages: rawData.totalPages,
        currentPage: rawData.number,
      };
    },
    {
      contents: [],
      totalPages: 0,
      currentPage: 0,
    },
    'client' // Search results don't need server-side 404
  );
};
export const getContentDetails = async (
  slug: string
): Promise<Movie | Series> => {
  return await contentApiCall(async () => {
    const rawData = await fetcher(`contents/${slug}`, 300);
    if ('numberOfSeasons' in rawData) {
      return { ...rawData, type: 'series' } as Series;
    } else {
      return { ...rawData, type: 'movie' } as Movie;
    }
  });
};
export const getAllSeasonDetails = async (id: number): Promise<Season[]> => {
  return await contentApiCall(async () => {
    const rawData = await fetcher(`contents/${id}/seasons`);
    return rawData as Season[];
  });
};

export const getSeasonDetails = async (
  seriesId: number,
  seasonNumber: number
): Promise<Season> => {
  return await contentApiCall(async () => {
    const rawData = await fetcher(
      `contents/${seriesId}/seasons/${seasonNumber}`
    );
    return rawData as Season;
  });
};
export const getAllEpisodeDetails = async (
  seriesId: number,
  seasonNumber: number
): Promise<Episode[]> => {
  return await contentApiCall(async () => {
    const rawData = await fetcher(
      `contents/${seriesId}/seasons/${seasonNumber}/episodes`
    );
    return rawData as Episode[];
  });
};

export const getEpisodeDetails = async (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
): Promise<Episode> => {
  return await contentApiCall(async () => {
    const rawData = await fetcher(
      `contents/${seriesId}/seasons/${seasonNumber}/episodes/${episodeNumber}`
    );
    return rawData as Episode;
  });
};

export const getContentTrailer = async (id: number): Promise<Trailer> => {
  return await safeApiCall(
    () => fetcher(`contents/${id}/trailer`),
    { trailer: '' } as Trailer, // Default empty trailer
    'client'
  );
};

export const getContentProviders = async (id: number): Promise<Provider[]> => {
  return await safeApiCall(
    () => fetcher(`contents/${id}/providers`),
    [], // Return empty array if no providers found
    'client'
  );
};

export const getContentStats = async (id: number): Promise<Stats> => {
  return await safeApiCall(
    () => fetcher(`contents/${id}/stats`),
    { totalReviews: 0, watchlistCount: 0, platformRate: 0 } as Stats, // Default stats
    'client'
  );
};

export const getContentReviews = async (id: number): Promise<Review[]> => {
  return await safeApiCall(
    () => fetcher(`contents/${id}/reviews`),
    [], // Return empty array if no reviews found
    'client'
  );
};

export const getContentReviewsClient = async (
  id: number,
  token?: string,
  sortBy = 'likes',
  page = 0,
  size = 5
): Promise<{ reviews: Review[]; totalPages: number; currentPage: number }> => {
  return await safeApiCall(
    async () => {
      const query = new URLSearchParams();
      query.set('sortBy', sortBy);
      query.set('page', String(page));
      query.set('size', String(size));

      const url = `reviews/contents/${id}?${query.toString()}`;
      // Build headers with optional Authorization
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const rawData = await fetcher(url, 0, headers);
      return {
        reviews: rawData.content as Review[],
        totalPages: rawData.totalPages ?? 1,
        currentPage: rawData.number ?? page,
      };
    },
    { reviews: [], totalPages: 0, currentPage: 0 }, // Return empty on error
    'client'
  );
};

export const getContentCredits = async (id: number): Promise<Credits> => {
  return await safeApiCall(
    () => fetcher(`contents/${id}/credits`),
    {
      director: { id: 0, name: '', imageUrl: '' },
      casts: [],
    } as Credits, // Default empty credits
    'client'
  );
};

export const getExtendedPersonDetails = async (
  id: number
): Promise<ExtendedPerson> => {
  return await contentApiCall(async () => {
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
  });
};
export const getPersonContents = async (
  id: number,
  page = 0,
  size = 24,
  type?: 'MOVIE' | 'SERIES'
): Promise<{
  content: Content[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}> => {
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
      posterUrl: item.posterUrl,
      slug: item.slug,
    }));

    return {
      content,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
      totalElements: rawData.totalElements,
    };
  } catch (error) {
    return {
      content: [],
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
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
export const getUserProfile = async (token: string): Promise<UserProfile> => {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const data = await fetcher('users/profile', 0, headers);
  return data;
};

export const getPublicUserProfile = async (
  username: string
): Promise<UserProfile> => {
  return await contentApiCall(() => fetcher(`users/profile/${username}`, 0));
};

export const getPublicUserStats = async (
  username: string
): Promise<{ reviewCount: number; watchlistCount: number }> => {
  return await safeApiCall(
    () => fetcher(`users/${username}/stats`, 0),
    { reviewCount: 0, watchlistCount: 0 }, // Default stats
    'client'
  );
};
export const getPublicUserReviews = async (
  username: string,
  page = 0,
  size = 10
): Promise<{
  reviews: UserReview[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('size', String(size));

    const url = `reviews/users/${username}?${query.toString()}`;
    const rawData = await fetcher(url, 0);

    const reviews: UserReview[] = rawData.content;
    return {
      reviews,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
    };
  } catch (error) {
    return {
      reviews: [],
      totalPages: 0,
      currentPage: 0,
    };
  }
};

export const getPublicUserWatchlist = async (
  username: string,
  status: 'TO_WATCH' | 'WATCHED',
  page = 0,
  size = 10
): Promise<{
  items: WatchlistItem[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}> => {
  try {
    const query = new URLSearchParams();
    query.set('status', status);
    query.set('page', String(page));
    query.set('size', String(size));

    const url = `watchlist/${username}?${query.toString()}`;
    const rawData = await fetcher(url, 0);

    return {
      items: rawData.content,
      totalPages: rawData.totalPages,
      totalElements: rawData.totalElements,
      currentPage: rawData.number,
    };
  } catch (error) {
    return {
      items: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
    };
  }
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

export const updateUserProfilePicture = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}users/profile-picture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update picture');
  return data;
};

export const getUserReviews = async (
  token: string,
  username: string,
  page = 0,
  size = 10
): Promise<{
  reviews: UserReview[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('size', String(size));

    const url = `reviews/users/${username}?${query.toString()}`;
    const rawData = await fetcher(url, 0, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const reviews: UserReview[] = rawData.content;
    return {
      reviews,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
    };
  } catch (error) {
    return {
      reviews: [],
      totalPages: 0,
      currentPage: 0,
    };
  }
};
export const getContentSummary = async (
  contentId: number,
  contentType: 'MOVIE' | 'SERIES' | 'SEASON' | 'EPISODE'
): Promise<{
  contentType: string;
  slug: string;
  seasonNumber: number | null;
  episodeNumber: number | null;
}> => {
  return await contentApiCall(async () => {
    const url = `contents/${contentId}/summary?contentType=${contentType}`;
    const rawData = await fetcher(url);
    return rawData;
  });
};
type ReviewPayload = {
  contentId: number;
  rate: number;
  title: string;
  description: string;
  spoiler: boolean;
};
export const postUserReview = async (token: string, review: ReviewPayload) => {
  return await postData('reviews', review, {
    Authorization: `Bearer ${token}`,
  });
};
export const deleteUserReview = async (token: string, reviewId: number) => {
  // Try the standard delete endpoint first
  const res = await fetch(`${BASE_URL}reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    // If it's a foreign key constraint error, provide a more helpful message
    if (data.message && data.message.includes('foreign key constraint')) {
      throw new Error(
        'Cannot delete review: This review has reactions that must be removed first. Please contact support if this issue persists.'
      );
    }
    throw new Error(data.message || 'Failed to delete review');
  }

  return data;
};

type UpdateReviewPayload = {
  reviewId: number;
  rate: number;
  title: string;
  description: string;
  spoiler: boolean;
};

export const updateUserReview = async (
  token: string,
  review: UpdateReviewPayload
) => {
  return await putData(`reviews/${review.reviewId}`, review, {
    Authorization: `Bearer ${token}`,
  });
};

export const reactToReview = async (
  token: string,
  reviewId: number,
  type: 'LIKE' | 'DISLIKE' | 'UNDO'
) => {
  const res = await fetch(`${BASE_URL}reviews/${reviewId}/react?type=${type}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Invalid JSON response from server');
  }

  if (!res.ok) {
    throw new Error(data.message || 'Failed to react to review');
  }

  return data;
};

export const getAllReviewsSSR = async (
  page = 0,
  size = 10,
  sortBy = 'recent',
  token?: string
): Promise<{
  reviews: ExtendedReview[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}> => {
  try {
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('size', String(size));
    query.set('sortBy', sortBy);

    const url = `reviews?${query.toString()}`;

    // Create headers with authorization if token is provided
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const rawData = await fetcher(url, 60, headers);
    return {
      reviews: rawData.content,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
      totalElements: rawData.totalElements,
    };
  } catch (error) {
    return {
      reviews: [],
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
    };
  }
};

export const getAllReviewsClient = async (
  page = 0,
  size = 10,
  sortBy = 'recent',
  token?: string
): Promise<{
  reviews: ExtendedReview[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}> => {
  try {
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('size', String(size));
    query.set('sortBy', sortBy);

    const url = `reviews?${query.toString()}`;

    // Build headers with optional Authorization
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const rawData = await fetcher(url, 0, headers);

    return {
      reviews: rawData.content,
      totalPages: rawData.totalPages,
      currentPage: rawData.number,
      totalElements: rawData.totalElements,
    };
  } catch (error) {
    return {
      reviews: [],
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
    };
  }
};

export const getTopReviewers = async (
  size = 5
): Promise<
  {
    user: {
      userId: number;
      username: string;
      name: string;
      imageUrl: string;
    };
    reviewCount: number;
    averageRating: number;
  }[]
> => {
  try {
    const url = `reviews/top-reviewers?size=${size}`;
    const data = await fetcher(url);
    return data;
  } catch (error) {
    return [];
  }
};

export const getTopReviewedContent = async (): Promise<
  {
    contentId: number;
    title: string;
    contentType: 'MOVIE' | 'SERIES';
    averageRate: number;
    reviewCount: number;
  }[]
> => {
  try {
    const url = `reviews/top-reviewed`;
    const data = await fetcher(url);
    return data;
  } catch (error) {
    return [];
  }
};

export const getUserWatchlist = async (
  username: string,
  status: 'TO_WATCH' | 'WATCHED',
  page = 0,
  size = 10
): Promise<{
  items: WatchlistItem[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}> => {
  try {
    const query = new URLSearchParams();
    query.set('status', status);
    query.set('page', String(page));
    query.set('size', String(size));

    const url = `watchlist/${username}?${query.toString()}`;
    const rawData = await fetcher(url, 0);

    return {
      items: rawData.content,
      totalPages: rawData.totalPages,
      totalElements: rawData.totalElements,
      currentPage: rawData.number,
    };
  } catch (error) {
    return {
      items: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
    };
  }
};

export const getUserWatchlistSSR = async (
  token: string,
  status: 'TO_WATCH' | 'WATCHED',
  page = 0,
  size = 10
): Promise<{
  items: WatchlistItem[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}> => {
  try {
    const query = new URLSearchParams();
    query.set('status', status);
    query.set('page', String(page));
    query.set('size', String(size));

    const url = `watchlist?${query.toString()}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const rawData = await fetcher(url, 0, headers);

    return {
      items: rawData.content,
      totalPages: rawData.totalPages,
      totalElements: rawData.totalElements,
      currentPage: rawData.number,
    };
  } catch (error) {
    return {
      items: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
    };
  }
};

export const addToWatchlist = async (
  token: string,
  contentId: number
): Promise<any> => {
  return await postData(
    'watchlist?contentId=' + contentId,
    {},
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

export const checkWatchlistExists = async (
  token: string,
  contentId: number
): Promise<number | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}watchlist/exists?contentId=${contentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to check watchlist existence');
    }

    const result = await response.json();
    return result.data; // Returns watchlist ID or null
  } catch (error) {
    return null;
  }
};

export const updateWatchlistStatus = async (
  token: string,
  watchlistId: number,
  status: 'WATCHED' | 'TO_WATCH'
): Promise<any> => {
  const url = `watchlist/${watchlistId}?status=${status}`;

  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update watchlist status');
  }

  return data;
};

export const removeFromWatchlist = async (
  token: string,
  watchlistId: number
): Promise<any> => {
  const res = await fetch(`${BASE_URL}watchlist/${watchlistId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to remove from watchlist');
  }

  return await res.json();
};
