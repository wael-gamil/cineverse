import { Episode } from '@/constants/types/movie';
export async function GET(req: Request) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const seasonNumber = searchParams.get('seasonNumber');

  if (!id) return new Response('Missing id', { status: 400 });

  try {
    const url = `${BASE_URL}contents/${id}/seasons/${seasonNumber}/episodes`;
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(`Failed to fetch episodes from upstream ${url}`, {
        status: res.status,
      });
    }
    const json = await res.json();
    if (!json.success || !json.data) {
      return new Response('Unexpected response format from upstream', {
        status: 502,
      });
    }
    const data: Episode[] = await json.data;

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
