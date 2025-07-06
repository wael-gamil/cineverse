import { getPersonContents } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const id = Number(url.searchParams.get('id'));
  const page = Number(url.searchParams.get('page')) || 0;
  const size = Number(url.searchParams.get('size')) || 8;
  const type = url.searchParams.get('type') as 'MOVIE' | 'SERIES' | undefined;

  if (!id) {
    return NextResponse.json({ error: 'Missing crew ID' }, { status: 400 });
  }

  try {
    const response = await getPersonContents(id, page, size, type);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch crew content' },
      { status: 500 }
    );
  }
}
