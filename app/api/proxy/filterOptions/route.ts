import { FilterOpt } from '@/constants/types/movie';
export async function GET() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  try {
    const url = `${BASE_URL}contents/filter/options`;
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(`Failed to fetch filter options from upstream`, {
        status: res.status,
      });
    }

    const data: FilterOpt[] = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Internal Server Error in proxy', { status: 500 });
  }
}
