import { Content } from '@/constants/types/movie';

export async function GET(req: Request) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const { searchParams } = new URL(req.url);

  const id = searchParams.get('id');
  const page = searchParams.get('page') ?? '0';
  const type = searchParams.get('type');

  if (!id) {
    return new Response('Missing artist id', { status: 400 });
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.set('page', page);
    queryParams.set('size', '7');

    if (type === 'MOVIE' || type === 'SERIES') {
      queryParams.set('type', type);
    }

    const url = `${BASE_URL}artists/${id}/contents?${queryParams.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      return new Response(`Failed to fetch contents from upstream`, {
        status: res.status,
      });
    }

    const data: {
      content: Content[];
      totalPages: number;
      totalElements: number;
      pageable: any;
    } = await res.json();

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
