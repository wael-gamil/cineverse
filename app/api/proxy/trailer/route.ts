import { Trailer } from '@/constants/types/movie';
export async function GET(req: Request) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    const url = `${BASE_URL}contents/${id}/trailer`;
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(`Failed to fetch trailer from upstream`, {
        status: res.status,
      });
    }
    const json = await res.json();
    if (!json.success || !json.data) {
      return new Response('Unexpected response format from upstream', {
        status: 502,
      });
    }
    const data: Trailer = json.data;

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
