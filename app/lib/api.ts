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
} from '@/app/constants/types/movie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const fetcher = async function fetcher(
  query: string,
  revalidateSeconds: number = 60
) {
  const response = await fetch(`${BASE_URL}${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: revalidateSeconds,
    },
  });
  if (!response.ok) {
    // throw new Error('Network response was not ok');
    return null;
  }

  return response.json();
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

    const rawData = await fetcher(url);
    if (!rawData) {
      return {
        content: [],
        totalPages: 0,
        currentPage: 0,
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
export const getFilterOptions = async (): Promise<FilterOpt[]> => {
  try {
    const rawData = await fetcher(`contents/filter/options`);
    const filteredData = rawData.filter(
      (data: { key: string }) => data.key !== 'type' && data.key !== 'sortBy'
    );
    return filteredData;
  } catch (error) {
    throw error;
  }
};
export const getSearchResults = async (
  query: string,
  page = 0
): Promise<{
  contents: Content[];
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const url = `contents/search?q${query && `=${query}`}&page=${page}`;
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
