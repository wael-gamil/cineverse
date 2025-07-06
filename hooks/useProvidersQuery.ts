import { useQuery } from '@tanstack/react-query';
import { Provider } from '@/constants/types/movie';

export function useProvidersQuery(id: number, enabled?: boolean) {
  return useQuery({
    queryKey: ['providers', id],
    queryFn: async () => {
      let url = `/api/proxy/providers?id=${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch providers');
      return (await res.json()) as Provider[];
    },
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
