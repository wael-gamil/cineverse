import { Provider } from '@/constants/types/movie';
export async function GET(req: Request) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    const url = `${BASE_URL}contents/${id}/providers`;
    const res = await fetch(url);
    if (!res.ok) {
      // Log or forward the status
      return new Response(`Failed to fetch providers from upstream`, {
        status: res.status,
      });
    }

    const data: Provider[] = await res.json();

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
