import { Season } from '@/constants/types/movie';
export async function GET(req: Request) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return new Response('Missing id', { status: 400 });

  try {
    const url = `${BASE_URL}contents/${id}/seasons`;
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(`Failed to fetch seasons from upstream ${url}`, {
        status: res.status,
      });
    }

    const data: Season[] = await res.json();

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
