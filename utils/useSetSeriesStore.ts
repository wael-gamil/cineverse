'use client';

import { useEffect } from 'react';
import { Series } from '@/constants/types/movie';
import { seriesStore } from '@/utils/seriesStore';

export default function SetSeriesStore({ data }: { data: Series }) {
  useEffect(() => {
    seriesStore.setState(state => ({
      ...state,
      series: data,
    }));
  }, [data]);

  return null;
}
