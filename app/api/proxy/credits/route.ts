import { Credits } from '@/constants/types/movie';
export async function GET(req: Request) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return new Response('Missing id', { status: 400 });
  try {
    const url = `${BASE_URL}contents/${id}/credits`;
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(`Failed to fetch credits from upstream`, {
        status: res.status,
      });
    }
    const json = await res.json();
    if (!json.success || !json.data) {
      return new Response('Unexpected response format from upstream', {
        status: 502,
      });
    }
    const data: Credits = json.data;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response('Internal Server Error in proxy', { status: 500 });
  }
}
