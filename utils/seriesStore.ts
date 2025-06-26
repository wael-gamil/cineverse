'use client';

import { Store } from '@tanstack/react-store';
import { Series } from '@/constants/types/movie';

type SeriesState = {
  series: Series | null;
};

export const seriesStore = new Store<SeriesState>({
  series: null,
});
